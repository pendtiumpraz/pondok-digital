import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import TwoFactorAuthService from '@/lib/two-factor-auth'

export const dynamic = 'force-dynamic'

// Get 2FA status for current user
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const status = await TwoFactorAuthService.get2FAStatus(session.user.id)

    return NextResponse.json({
      enabled: status.enabled,
      phoneVerified: status.phoneVerified,
      backupCodesCount: status.backupCodesCount,
      canDisable: status.enabled
    })

  } catch (error) {
    console.error('2FA status error:', error)
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 })
  }
}