import { NextRequest, NextResponse } from 'next/server'
import { SubscriptionScheduler } from '@/lib/subscription/subscription-scheduler'

export async function POST(request: NextRequest) {
  try {
    // Verify the request is from a cron job or authorized source
    const authHeader = request.headers.get('authorization')
    const expectedToken = process.env.CRON_SECRET || 'your-secure-cron-token'
    
    if (authHeader !== `Bearer ${expectedToken}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const scheduler = new SubscriptionScheduler()
    
    console.log('Starting subscription scheduler job...')
    await scheduler.runDailyScheduler()
    console.log('Subscription scheduler job completed successfully')

    return NextResponse.json({
      success: true,
      message: 'Subscription scheduler executed successfully',
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Error in subscription scheduler cron job:', error)
    return NextResponse.json(
      {
        error: 'Scheduler execution failed',
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Subscription scheduler endpoint is active',
    timestamp: new Date().toISOString(),
    note: 'Use POST with proper authorization to trigger scheduler'
  })
}