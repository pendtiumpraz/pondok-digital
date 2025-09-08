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

    const { searchParams } = new URL(request.url);
    const reportType = searchParams.get('type') || 'overview';
    const startDate = searchParams.get('startDate') ? new Date(searchParams.get('startDate')!) : new Date(new Date().setMonth(new Date().getMonth() - 1));
    const endDate = searchParams.get('endDate') ? new Date(searchParams.get('endDate')!) : new Date();

    let reportData: any = {};

    switch (reportType) {
      case 'overview':
        const [totalTenants, activeTenants, totalUsers, totalStudents, totalRevenue] = await Promise.all([
          prisma.tenant.count(),
          prisma.subscription.count({ where: { status: 'ACTIVE' } }),
          prisma.user.count(),
          prisma.student.count(),
          prisma.paymentTransaction.aggregate({
            where: {
              status: 'SUCCESS',
              createdAt: { gte: startDate, lte: endDate }
            },
            _sum: { amount: true }
          })
        ]);

        reportData = {
          totalTenants,
          activeTenants,
          totalUsers,
          totalStudents,
          totalRevenue: Number(totalRevenue._sum.amount || 0),
          period: { startDate, endDate }
        };
        break;

      case 'financial':
        const transactions = await prisma.paymentTransaction.findMany({
          where: {
            createdAt: { gte: startDate, lte: endDate }
          },
          include: {
            subscription: {
              include: {
                organization: true
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        });

        const dailyRevenue: { [key: string]: number } = {};
        transactions.forEach(tx => {
          if (tx.status === 'SUCCESS') {
            const date = tx.createdAt.toISOString().split('T')[0];
            dailyRevenue[date] = (dailyRevenue[date] || 0) + Number(tx.amount);
          }
        });

        reportData = {
          transactions: transactions.map(tx => ({
            id: tx.id,
            amount: Number(tx.amount),
            status: tx.status,
            method: tx.paymentMethod,
            organization: tx.subscription?.organization?.name,
            date: tx.createdAt
          })),
          dailyRevenue: Object.entries(dailyRevenue).map(([date, amount]) => ({
            date,
            amount
          })),
          totalRevenue: Object.values(dailyRevenue).reduce((sum, amount) => sum + amount, 0),
          totalTransactions: transactions.length,
          successfulTransactions: transactions.filter(tx => tx.status === 'SUCCESS').length,
          period: { startDate, endDate }
        };
        break;

      case 'tenants':
        const tenants = await prisma.tenant.findMany({
          include: {
            subscription: true,
            _count: {
              select: {
                users: true,
                students: true,
                paymentTransactions: true
              }
            }
          }
        });

        reportData = {
          tenants: tenants.map(tenant => ({
            id: tenant.id,
            name: tenant.name,
            slug: tenant.slug,
            tier: tenant.subscription?.tier || 'TRIAL',
            status: tenant.subscription?.status || 'INACTIVE',
            users: tenant._count.users,
            students: tenant._count.students,
            transactions: tenant._count.paymentTransactions,
            createdAt: tenant.createdAt
          })),
          totalTenants: tenants.length,
          byTier: {
            trial: tenants.filter(t => !t.subscription || t.subscription.status === 'TRIAL').length,
            basic: tenants.filter(t => t.subscription?.tier === 'BASIC').length,
            standard: tenants.filter(t => t.subscription?.tier === 'STANDARD').length,
            premium: tenants.filter(t => t.subscription?.tier === 'PREMIUM').length
          },
          period: { startDate, endDate }
        };
        break;

      case 'users':
        const users = await prisma.user.groupBy({
          by: ['role'],
          _count: true
        });

        const userActivity = await prisma.auditTrail.groupBy({
          by: ['userId'],
          where: {
            createdAt: { gte: startDate, lte: endDate }
          },
          _count: true
        });

        reportData = {
          usersByRole: users.map(u => ({
            role: u.role,
            count: u._count
          })),
          totalUsers: users.reduce((sum, u) => sum + u._count, 0),
          activeUsers: userActivity.length,
          period: { startDate, endDate }
        };
        break;

      case 'activity':
        const activities = await prisma.auditTrail.findMany({
          where: {
            createdAt: { gte: startDate, lte: endDate }
          },
          include: {
            user: {
              select: {
                name: true,
                username: true,
                role: true
              }
            }
          },
          orderBy: { createdAt: 'desc' },
          take: 1000
        });

        const activityByAction: { [key: string]: number } = {};
        const activityByUser: { [key: string]: number } = {};
        const activityByDay: { [key: string]: number } = {};

        activities.forEach(activity => {
          activityByAction[activity.action] = (activityByAction[activity.action] || 0) + 1;
          const userName = activity.user?.name || 'Unknown';
          activityByUser[userName] = (activityByUser[userName] || 0) + 1;
          const date = activity.createdAt.toISOString().split('T')[0];
          activityByDay[date] = (activityByDay[date] || 0) + 1;
        });

        reportData = {
          totalActivities: activities.length,
          byAction: Object.entries(activityByAction).map(([action, count]) => ({
            action,
            count
          })),
          byUser: Object.entries(activityByUser)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10)
            .map(([user, count]) => ({
              user,
              count
            })),
          byDay: Object.entries(activityByDay).map(([date, count]) => ({
            date,
            count
          })),
          recentActivities: activities.slice(0, 100).map(a => ({
            id: a.id,
            action: a.action,
            entity: a.entity,
            user: a.user?.name,
            timestamp: a.createdAt
          })),
          period: { startDate, endDate }
        };
        break;
    }

    return NextResponse.json({
      success: true,
      type: reportType,
      data: reportData
    });
  } catch (error) {
    console.error('Error generating report:', error);
    return NextResponse.json(
      { error: 'Failed to generate report' },
      { status: 500 }
    );
  }
}