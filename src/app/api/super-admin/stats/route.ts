import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is super admin
    if (session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get current date for calculations
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    // Fetch stats
    const [
      totalTenants,
      activeTenants,
      totalUsers,
      totalStudents,
      activeSubscriptions,
      trialSubscriptions,
      recentTransactions
    ] = await Promise.all([
      // Total tenants
      prisma.tenant.count(),
      
      // Active tenants (with active subscription)
      prisma.tenant.count({
        where: {
          subscription: {
            status: 'ACTIVE'
          }
        }
      }),
      
      // Total users across all tenants
      prisma.user.count(),
      
      // Total students across all tenants
      prisma.student.count(),
      
      // Active subscriptions
      prisma.subscription.count({
        where: {
          status: 'ACTIVE'
        }
      }),
      
      // Trial subscriptions
      prisma.subscription.count({
        where: {
          tier: 'TRIAL'
        }
      }),
      
      // Recent payment transactions
      prisma.paymentTransaction.findMany({
        where: {
          createdAt: {
            gte: startOfMonth
          },
          status: 'SUCCESS'
        },
        select: {
          amount: true
        }
      })
    ]);

    // Calculate revenue
    const monthlyRevenue = recentTransactions.reduce((sum, tx) => sum + Number(tx.amount), 0);

    // Calculate growth (mock data for now since we need historical data)
    const tenantGrowth = 12.5; // TODO: Calculate real growth
    const revenueGrowth = 18.2; // TODO: Calculate real growth
    const userGrowth = 15.3; // TODO: Calculate real growth

    // System health score (based on active vs total)
    const healthScore = Math.round((activeTenants / totalTenants) * 100) || 0;

    return NextResponse.json({
      success: true,
      stats: {
        tenants: {
          total: totalTenants,
          active: activeTenants,
          trial: trialSubscriptions,
          growth: tenantGrowth
        },
        revenue: {
          monthly: monthlyRevenue,
          growth: revenueGrowth
        },
        users: {
          total: totalUsers,
          growth: userGrowth
        },
        students: {
          total: totalStudents
        },
        health: {
          score: healthScore
        }
      }
    });
  } catch (error) {
    console.error('Error fetching super admin stats:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch stats',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}