import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import TwoFactorAuthService from '@/lib/two-factor-auth'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { token, isBackupCode = false } = await request.json()

    if (!token) {
      return NextResponse.json({ 
        error: 'Verification code is required' 
      }, { status: 400 })
    }

    // Check rate limiting
    const action = isBackupCode ? 'backup' : 'totp'
    const rateLimit = await TwoFactorAuthService.checkRateLimit(session.user.id, action)
    
    if (!rateLimit.allowed) {
      return NextResponse.json({
        error: 'Too many attempts. Please try again later.',
        resetTime: rateLimit.resetTime,
        remainingAttempts: rateLimit.remainingAttempts
      }, { status: 429 })
    }

    // Verify the token
    const result = await TwoFactorAuthService.verify2FA(session.user.id, token, isBackupCode)
    
    if (!result.isValid) {
      // Increment failed attempts
      await TwoFactorAuthService.incrementAttempts(session.user.id, action)
      return NextResponse.json({ 
        error: result.message 
      }, { status: 400 })
    }

    return NextResponse.json({
      message: result.message,
      verified: true,
      backupCodeUsed: result.backupCodeUsed || false
    })

  } catch (error) {
    console.error('2FA verification error:', error)
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 })
  }
}