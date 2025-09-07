import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { SubscriptionManager } from '@/lib/subscription/subscription-manager'
import { PricingService } from '@/lib/subscription/pricing'
import { UsageMonitor } from '@/lib/subscription/usage-monitor'
import { SubscriptionTier } from '@/lib/subscription/types'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const organizationId = session.user.tenantId
    if (!organizationId) {
      return NextResponse.json({ error: 'No organization found' }, { status: 400 })
    }

    // Get current subscription with usage data
    const subscriptionData = await SubscriptionManager.getSubscriptionWithUsage(organizationId)
    
    if (!subscriptionData) {
      return NextResponse.json({ error: 'No subscription found' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: subscriptionData
    })

  } catch (error) {
    console.error('Error fetching subscription:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const organizationId = session.user.tenantId
    if (!organizationId) {
      return NextResponse.json({ error: 'No organization found' }, { status: 400 })
    }

    const body = await request.json()
    const { tier, billingCycle, paymentMethod, discountPercent, discountEndDate } = body

    // Validate required fields
    if (!tier || !billingCycle) {
      return NextResponse.json(
        { error: 'Missing required fields: tier, billingCycle' },
        { status: 400 }
      )
    }

    // Validate tier
    if (!Object.values(SubscriptionTier).includes(tier)) {
      return NextResponse.json(
        { error: 'Invalid subscription tier' },
        { status: 400 }
      )
    }

    // Validate billing cycle
    if (!['MONTHLY', 'YEARLY'].includes(billingCycle)) {
      return NextResponse.json(
        { error: 'Invalid billing cycle' },
        { status: 400 }
      )
    }

    // Create subscription
    const subscriptionId = await SubscriptionManager.createSubscription({
      organizationId,
      tier,
      billingCycle,
      paymentMethod,
      discountPercent,
      discountEndDate: discountEndDate ? new Date(discountEndDate) : undefined
    })

    return NextResponse.json({
      success: true,
      data: {
        subscriptionId,
        message: 'Subscription created successfully'
      }
    })

  } catch (error) {
    console.error('Error creating subscription:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const organizationId = session.user.tenantId
    if (!organizationId) {
      return NextResponse.json({ error: 'No organization found' }, { status: 400 })
    }

    const body = await request.json()
    const { subscriptionId, newTier, newBillingCycle, effectiveDate, prorationOption } = body

    if (!subscriptionId || !newTier) {
      return NextResponse.json(
        { error: 'Missing required fields: subscriptionId, newTier' },
        { status: 400 }
      )
    }

    // Validate new tier
    if (!Object.values(SubscriptionTier).includes(newTier)) {
      return NextResponse.json(
        { error: 'Invalid subscription tier' },
        { status: 400 }
      )
    }

    // Change subscription
    await SubscriptionManager.changeSubscription({
      subscriptionId,
      newTier,
      newBillingCycle,
      effectiveDate: effectiveDate ? new Date(effectiveDate) : undefined,
      prorationOption: prorationOption || 'IMMEDIATE'
    })

    return NextResponse.json({
      success: true,
      data: {
        message: 'Subscription updated successfully'
      }
    })

  } catch (error) {
    console.error('Error updating subscription:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const subscriptionId = searchParams.get('subscriptionId')
    const reason = searchParams.get('reason')

    if (!subscriptionId) {
      return NextResponse.json(
        { error: 'Missing subscriptionId parameter' },
        { status: 400 }
      )
    }

    // Cancel subscription
    await SubscriptionManager.cancelSubscription(subscriptionId, reason || undefined)

    return NextResponse.json({
      success: true,
      data: {
        message: 'Subscription cancelled successfully'
      }
    })

  } catch (error) {
    console.error('Error cancelling subscription:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}