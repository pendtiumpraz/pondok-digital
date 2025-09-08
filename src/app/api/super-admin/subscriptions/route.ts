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

    const subscriptions = await prisma.subscription.findMany({
      include: {
        organization: {
          include: {
            _count: {
              select: {
                users: true,
                students: true
              }
            }
          }
        },
        invoices: {
          take: 5,
          orderBy: { createdAt: 'desc' }
        },
        _count: {
          select: {
            invoices: true,
            paymentTransactions: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const formattedSubscriptions = subscriptions.map(sub => ({
      id: sub.id,
      organizationId: sub.organizationId,
      organizationName: sub.organization.name,
      organizationSlug: sub.organization.slug,
      tier: sub.tier,
      status: sub.status,
      startDate: sub.startDate,
      endDate: sub.endDate,
      trialEndDate: sub.trialEndDate,
      billingPeriod: sub.billingPeriod,
      features: sub.features,
      maxUsers: sub.maxUsers,
      maxStudents: sub.maxStudents,
      currentUsers: sub.organization._count.users,
      currentStudents: sub.organization._count.students,
      totalInvoices: sub._count.invoices,
      totalTransactions: sub._count.paymentTransactions,
      lastPayment: sub.invoices[0] || null,
      monthlyPrice: sub.tier === 'BASIC' ? 299000 :
                   sub.tier === 'STANDARD' ? 799000 :
                   sub.tier === 'PREMIUM' ? 1999000 : 0
    }));

    return NextResponse.json({
      success: true,
      subscriptions: formattedSubscriptions
    });
  } catch (error) {
    console.error('Error fetching subscriptions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch subscriptions' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id || session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { subscriptionId, tier, status } = body;

    const updated = await prisma.subscription.update({
      where: { id: subscriptionId },
      data: {
        tier,
        status,
        updatedAt: new Date()
      }
    });

    return NextResponse.json({
      success: true,
      subscription: updated
    });
  } catch (error) {
    console.error('Error updating subscription:', error);
    return NextResponse.json(
      { error: 'Failed to update subscription' },
      { status: 500 }
    );
  }
}