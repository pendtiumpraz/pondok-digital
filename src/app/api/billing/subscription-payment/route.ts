import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { MidtransSubscriptionGateway } from '@/lib/subscription/midtrans-subscription'
import { SubscriptionTier } from '@/lib/subscription/types'
import { PricingService } from '@/lib/subscription/pricing'

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
    const { 
      subscriptionId,
      invoiceId,
      subscriptionTier,
      billingCycle,
      amount,
      isRenewal = false,
      isUpgrade = false,
      prorationAmount,
      paymentType,
      bankTransfer,
      ewallet
    } = body

    // Validate required fields
    if (!subscriptionTier || !billingCycle || !amount) {
      return NextResponse.json(
        { error: 'Missing required fields: subscriptionTier, billingCycle, amount' },
        { status: 400 }
      )
    }

    // Validate tier
    if (!Object.values(SubscriptionTier).includes(subscriptionTier)) {
      return NextResponse.json(
        { error: 'Invalid subscription tier' },
        { status: 400 }
      )
    }

    const gateway = new MidtransSubscriptionGateway()
    
    // Get organization details (in real app, this would come from database)
    const customerDetails = {
      firstName: session.user.name || 'Organization',
      lastName: '',
      email: session.user.email || '',
      phone: '+6281234567890' // This should come from organization data
    }

    const plan = PricingService.getPlan(subscriptionTier, billingCycle)
    if (!plan) {
      return NextResponse.json(
        { error: 'Invalid pricing plan' },
        { status: 400 }
      )
    }

    // Create payment request
    const paymentData = {
      subscriptionId,
      invoiceId,
      organizationId,
      subscriptionTier,
      billingCycle,
      amount,
      customerDetails,
      itemDetails: [{
        id: subscriptionTier.toLowerCase(),
        name: `${plan.name} - ${billingCycle === 'YEARLY' ? 'Tahunan' : 'Bulanan'}`,
        price: amount,
        quantity: 1
      }],
      isRenewal,
      isUpgrade,
      prorationAmount,
      paymentType,
      bankTransfer,
      ewallet
    }

    // Create payment
    const result = await gateway.createSubscriptionPayment(paymentData)

    return NextResponse.json({
      success: true,
      data: {
        paymentToken: result.paymentResponse.token,
        redirectUrl: result.paymentResponse.redirect_url,
        transactionId: result.transactionId,
        invoiceId: result.invoiceId,
        snapUrl: `https://app${process.env.MIDTRANS_IS_PRODUCTION === 'true' ? '' : '.sandbox'}.midtrans.com/snap/v4/redirection/${result.paymentResponse.token}`
      }
    })

  } catch (error) {
    console.error('Error creating payment:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}

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
    const analytics = searchParams.get('analytics') === 'true'

    if (analytics) {
      const gateway = new MidtransSubscriptionGateway()
      const paymentAnalytics = await gateway.getSubscriptionPaymentAnalytics(organizationId)
      
      return NextResponse.json({
        success: true,
        data: paymentAnalytics
      })
    }

    // Default: return payment methods
    return NextResponse.json({
      success: true,
      data: {
        paymentMethods: [
          {
            type: 'bank_transfer',
            name: 'Transfer Bank',
            methods: [
              { code: 'bca', name: 'BCA Virtual Account', icon: '/images/banks/bca.png' },
              { code: 'bni', name: 'BNI Virtual Account', icon: '/images/banks/bni.png' },
              { code: 'bri', name: 'BRI Virtual Account', icon: '/images/banks/bri.png' },
              { code: 'permata', name: 'Permata Virtual Account', icon: '/images/banks/permata.png' },
              { code: 'echannel', name: 'Mandiri Bill Payment', icon: '/images/banks/mandiri.png' }
            ]
          },
          {
            type: 'e_wallet',
            name: 'E-Wallet',
            methods: [
              { code: 'gopay', name: 'GoPay', icon: '/images/ewallet/gopay.png' },
              { code: 'ovo', name: 'OVO', icon: '/images/ewallet/ovo.png' },
              { code: 'dana', name: 'DANA', icon: '/images/ewallet/dana.png' },
              { code: 'linkaja', name: 'LinkAja', icon: '/images/ewallet/linkaja.png' },
              { code: 'shopeepay', name: 'ShopeePay', icon: '/images/ewallet/shopeepay.png' }
            ]
          },
          {
            type: 'qris',
            name: 'QRIS',
            methods: [
              { code: 'qris', name: 'QRIS', icon: '/images/qris.png' }
            ]
          }
        ]
      }
    })

  } catch (error) {
    console.error('Error fetching payment data:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}