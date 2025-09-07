import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { UsageMonitor } from '@/lib/subscription/usage-monitor'
import { PricingService } from '@/lib/subscription/pricing'
import { SubscriptionTier, UsageLimits } from '@/lib/subscription/types'

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

    const { searchParams } = new URL(request.url)
    const detailed = searchParams.get('detailed') === 'true'

    if (detailed) {
      // Get detailed usage analytics
      const analytics = await UsageMonitor.getUsageAnalytics(organizationId)
      
      return NextResponse.json({
        success: true,
        data: analytics
      })
    } else {
      // Get basic usage check
      const usageCheck = await UsageMonitor.checkUsageLimits(organizationId)
      
      return NextResponse.json({
        success: true,
        data: usageCheck
      })
    }

  } catch (error) {
    console.error('Error fetching usage data:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const organizationId = session.user.tenantId
    if (!organizationId) {
      return NextResponse.json({ error: 'No organization found' }, { status: 400 })
    }

    const body = await request.json()
    const { usageType, increment = 1 } = body

    if (!usageType) {
      return NextResponse.json(
        { error: 'Missing required field: usageType' },
        { status: 400 }
      )
    }

    // Validate usage type
    const validUsageTypes = [
      'students',
      'teachers', 
      'storageUsedGB',
      'apiCallsThisMonth',
      'smsUsedThisMonth',
      'emailsUsedThisMonth',
      'reportsGeneratedThisMonth',
      'customFieldsUsed'
    ]

    if (!validUsageTypes.includes(usageType)) {
      return NextResponse.json(
        { error: 'Invalid usage type' },
        { status: 400 }
      )
    }

    // Track usage
    await UsageMonitor.trackUsage(organizationId, usageType, increment)

    return NextResponse.json({
      success: true,
      data: {
        message: 'Usage tracked successfully',
        usageType,
        increment
      }
    })

  } catch (error) {
    console.error('Error tracking usage:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}