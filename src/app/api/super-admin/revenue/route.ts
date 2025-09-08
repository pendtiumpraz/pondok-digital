import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id || session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    // Get monthly revenue for the year
    const monthlyRevenue = [];
    for (let month = 0; month < 12; month++) {
      const startDate = new Date(currentYear, month, 1);
      const endDate = new Date(currentYear, month + 1, 0);

      const [transactions, subscriptions] = await Promise.all([
        // Payment transactions
        prisma.paymentTransaction.aggregate({
          where: {
            createdAt: {
              gte: startDate,
              lte: endDate
            },
            status: 'SUCCESS'
          },
          _sum: { amount: true }
        }),
        // Active subscriptions count
        prisma.subscription.count({
          where: {
            status: 'ACTIVE',
            startDate: { lte: endDate },
            OR: [
              { endDate: null },
              { endDate: { gte: startDate } }
            ]
          }
        })
      ]);

      monthlyRevenue.push({
        month: month + 1,
        monthName: new Date(currentYear, month).toLocaleString('id-ID', { month: 'long' }),
        revenue: Number(transactions._sum.amount || 0),
        subscriptions
      });
    }

    // Get revenue by tier
    const revenueByTier = await prisma.subscription.groupBy({
      by: ['tier'],
      where: {
        status: 'ACTIVE'
      },
      _count: true
    });

    const tierRevenue = revenueByTier.map(tier => ({
      tier: tier.tier,
      count: tier._count,
      monthlyRevenue: tier.tier === 'BASIC' ? 299000 * tier._count :
                     tier.tier === 'STANDARD' ? 799000 * tier._count :
                     tier.tier === 'PREMIUM' ? 1999000 * tier._count : 0
    }));

    // Get top paying tenants
    const topTenants = await prisma.tenant.findMany({
      take: 10,
      include: {
        subscription: true,
        paymentTransactions: {
          where: { status: 'SUCCESS' },
          select: { amount: true }
        },
        _count: {
          select: {
            users: true,
            students: true
          }
        }
      }
    });

    const formattedTopTenants = topTenants.map(tenant => {
      const totalRevenue = tenant.paymentTransactions.reduce(
        (sum, tx) => sum + Number(tx.amount), 0
      );
      return {
        id: tenant.id,
        name: tenant.name,
        tier: tenant.subscription?.tier || 'TRIAL',
        totalRevenue,
        users: tenant._count.users,
        students: tenant._count.students
      };
    }).sort((a, b) => b.totalRevenue - a.totalRevenue);

    // Calculate summary stats
    const totalRevenue = monthlyRevenue.reduce((sum, m) => sum + m.revenue, 0);
    const avgMonthlyRevenue = totalRevenue / 12;
    const currentMonthRevenue = monthlyRevenue[currentMonth]?.revenue || 0;
    const lastMonthRevenue = monthlyRevenue[currentMonth - 1]?.revenue || 0;
    const growth = lastMonthRevenue > 0 
      ? ((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue * 100).toFixed(1)
      : 0;

    return NextResponse.json({
      success: true,
      data: {
        summary: {
          totalRevenue,
          avgMonthlyRevenue,
          currentMonthRevenue,
          growth
        },
        monthlyRevenue,
        tierRevenue,
        topTenants: formattedTopTenants
      }
    });
  } catch (error) {
    console.error('Error fetching revenue data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch revenue data' },
      { status: 500 }
    );
  }
}