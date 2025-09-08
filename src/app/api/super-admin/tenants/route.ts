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

    // Fetch all tenants with their subscription info
    const tenants = await prisma.tenant.findMany({
      include: {
        subscription: true,
        _count: {
          select: {
            users: true,
            students: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Format the data
    const formattedTenants = tenants.map(tenant => {
      const subscription = tenant.subscription;
      const monthlyRevenue = subscription?.tier === 'BASIC' ? 299000 :
                            subscription?.tier === 'STANDARD' ? 799000 :
                            subscription?.tier === 'PREMIUM' ? 1999000 : 0;
      
      // Calculate total revenue based on subscription duration
      const monthsActive = subscription?.startDate ? 
        Math.floor((Date.now() - new Date(subscription.startDate).getTime()) / (1000 * 60 * 60 * 24 * 30)) : 0;
      
      return {
        id: tenant.id,
        name: tenant.name,
        domain: `/yayasan/${tenant.slug}`, // Use path instead of domain for now
        plan: subscription?.tier?.toLowerCase() || 'trial',
        status: subscription?.status?.toLowerCase() || 'trial',
        users: tenant._count.users,
        students: tenant._count.students,
        revenue: monthlyRevenue * monthsActive,
        createdAt: tenant.createdAt.toISOString().split('T')[0],
        lastActive: tenant.updatedAt.toISOString().split('T')[0],
        adminEmail: `admin@${tenant.slug}.id`,
        usage: {
          storage: Math.floor(Math.random() * 5000), // TODO: Implement real storage tracking
          bandwidth: Math.floor(Math.random() * 1000), // TODO: Implement real bandwidth tracking
          apiCalls: Math.floor(Math.random() * 50000), // TODO: Implement real API call tracking
        }
      };
    });

    return NextResponse.json({
      success: true,
      tenants: formattedTenants,
      total: formattedTenants.length
    });
  } catch (error) {
    console.error('Error fetching tenants:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch tenants',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}