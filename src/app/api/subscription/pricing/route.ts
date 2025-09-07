import { NextRequest, NextResponse } from 'next/server'
import { PricingService } from '@/lib/subscription/pricing'
import { SubscriptionTier } from '@/lib/subscription/types'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const billingCycle = searchParams.get('billingCycle') as 'MONTHLY' | 'YEARLY'
    const tier = searchParams.get('tier') as SubscriptionTier

    // If specific tier requested
    if (tier) {
      if (!Object.values(SubscriptionTier).includes(tier)) {
        return NextResponse.json(
          { error: 'Invalid subscription tier' },
          { status: 400 }
        )
      }

      const plan = PricingService.getPlan(tier, billingCycle || 'MONTHLY')
      if (!plan) {
        return NextResponse.json(
          { error: 'Plan not found' },
          { status: 404 }
        )
      }

      return NextResponse.json({
        success: true,
        data: plan
      })
    }

    // Return all plans
    const plans = PricingService.getAllPlans(billingCycle || 'MONTHLY')
    
    // Calculate yearly savings for monthly plans
    const plansWithSavings = plans.map(plan => {
      if (billingCycle !== 'YEARLY' && plan.tier !== SubscriptionTier.TRIAL && plan.tier !== SubscriptionTier.ENTERPRISE) {
        const yearlyDiscount = PricingService.calculateYearlyDiscount(plan.price)
        return {
          ...plan,
          yearlyDiscount,
          yearlyPrice: Math.floor(plan.price * 12 * 0.85) // 15% discount
        }
      }
      return plan
    })

    return NextResponse.json({
      success: true,
      data: {
        plans: plansWithSavings,
        billingCycle: billingCycle || 'MONTHLY'
      }
    })

  } catch (error) {
    console.error('Error fetching pricing plans:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { currentTier, newTier, billingCycle, daysRemaining } = body

    if (!currentTier || !newTier || !billingCycle || daysRemaining === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: currentTier, newTier, billingCycle, daysRemaining' },
        { status: 400 }
      )
    }

    // Validate tiers
    if (!Object.values(SubscriptionTier).includes(currentTier) || 
        !Object.values(SubscriptionTier).includes(newTier)) {
      return NextResponse.json(
        { error: 'Invalid subscription tier' },
        { status: 400 }
      )
    }

    const currentPlan = PricingService.getPlan(currentTier, billingCycle)
    const newPlan = PricingService.getPlan(newTier, billingCycle)

    if (!currentPlan || !newPlan) {
      return NextResponse.json(
        { error: 'Plan not found' },
        { status: 404 }
      )
    }

    const totalDaysInCycle = billingCycle === 'YEARLY' ? 365 : 30
    const prorationAmount = PricingService.calculateProration(
      currentPlan,
      newPlan,
      daysRemaining,
      totalDaysInCycle
    )

    return NextResponse.json({
      success: true,
      data: {
        currentPlan,
        newPlan,
        prorationAmount,
        totalDaysInCycle,
        daysRemaining,
        formattedProrationAmount: PricingService.formatPrice(prorationAmount)
      }
    })

  } catch (error) {
    console.error('Error calculating proration:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}