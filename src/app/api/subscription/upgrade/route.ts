import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { MidtransService } from '@/lib/payment/midtrans-service';
import { TripayService } from '@/lib/payment/tripay-service';
import { getActivePaymentGateway, TIER_PRICING } from '@/lib/payment/payment-config';
import { Decimal } from '@prisma/client/runtime/library';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.tenantId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { 
      tier, 
      billingPeriod = 'monthly',
      paymentMethod,
      promoCode,
    } = body;

    // Validate tier
    if (!TIER_PRICING[tier as keyof typeof TIER_PRICING]) {
      return NextResponse.json(
        { error: 'Invalid subscription tier' },
        { status: 400 }
      );
    }

    // Get tenant and subscription
    const tenant = await prisma.tenant.findUnique({
      where: { id: session.user.tenantId },
      include: {
        subscription: true,
        users: {
          where: { id: session.user.id },
          take: 1,
        },
      },
    });

    if (!tenant) {
      return NextResponse.json(
        { error: 'Tenant not found' },
        { status: 404 }
      );
    }

    const user = tenant.users[0];
    const currentSubscription = tenant.subscription;

    // Calculate amount
    const tierConfig = TIER_PRICING[tier as keyof typeof TIER_PRICING];
    let amount = billingPeriod === 'yearly' 
      ? tierConfig.yearly 
      : tierConfig.monthly;

    if (!amount) {
      return NextResponse.json(
        { error: 'Custom pricing not available online. Please contact sales.' },
        { status: 400 }
      );
    }

    // Apply promo code if provided
    let discount = 0;
    if (promoCode) {
      // Check promo code validity
      if (promoCode === 'TRIAL20' && currentSubscription?.tier === 'TRIAL') {
        // 20% discount for trial users
        discount = Math.floor(amount * 0.2);
      }
      // Add more promo codes as needed
    }

    const finalAmount = amount - discount;

    // First create an invoice
    const invoice = await prisma.invoice.create({
      data: {
        invoiceNumber: `INV-${Date.now()}`,
        subscriptionId: currentSubscription?.id || '',
        organizationId: tenant.id,
        amount: finalAmount,
        currency: 'IDR',
        status: 'PENDING',
        dueDate: new Date(),
        subtotal: amount,
        tax: 0,
        discount: discount,
        total: finalAmount,
      },
    });

    // Process payment based on gateway
    const gateway = getActivePaymentGateway();
    let paymentUrl: string;
    let paymentToken: string | undefined;
    let transactionData: any = {};

    if (gateway.provider === 'MIDTRANS') {
      const midtrans = new MidtransService();
      const result = await midtrans.createSubscriptionPayment(
        tenant.id,
        session.user.id,
        tier as keyof typeof TIER_PRICING,
        billingPeriod as 'monthly' | 'yearly',
        {
          name: user.name || 'Customer',
          email: user.email,
          phone: '+62812345678', // Default phone as it's not in User model
        }
      );

      paymentUrl = result.redirect_url;
      paymentToken = result.token;
      transactionData = { midtrans_token: result.token };
      
    } else if (gateway.provider === 'TRIPAY') {
      if (!paymentMethod) {
        return NextResponse.json(
          { error: 'Payment method required for Tripay' },
          { status: 400 }
        );
      }

      const tripay = new TripayService();
      const result = await tripay.createSubscriptionPayment(
        tenant.id,
        session.user.id,
        tier as keyof typeof TIER_PRICING,
        billingPeriod as 'monthly' | 'yearly',
        paymentMethod,
        {
          name: user.name || 'Customer',
          email: user.email,
          phone: '0812345678',
        }
      );

      paymentUrl = result.checkout_url;
      transactionData = {
        tripay_reference: result.reference,
        tripay_pay_code: result.pay_code,
        tripay_qr_url: result.qr_url,
      };
    } else {
      throw new Error('Invalid payment gateway configuration');
    }

    // Create payment transaction
    const paymentTransaction = await prisma.paymentTransaction.create({
      data: {
        invoiceId: invoice.id,
        subscriptionId: currentSubscription?.id || '',
        organizationId: tenant.id,
        amount: finalAmount,
        currency: 'IDR',
        status: 'PENDING',
        paymentMethod: paymentMethod || 'UNKNOWN',
        paymentGateway: gateway.provider,
        gatewayResponse: transactionData,
      },
    });

    // Create notification for admin
    await prisma.notification.create({
      data: {
        userId: session.user.id,
        type: 'UPGRADE_INITIATED',
        title: 'Upgrade Dimulai',
        message: `Proses upgrade ke ${tierConfig.name} telah dimulai. Selesaikan pembayaran untuk mengaktifkan.`,
        data: JSON.stringify({
          tier,
          amount: finalAmount,
          invoiceId: invoice.id,
        }),
      },
    });

    return NextResponse.json({
      success: true,
      paymentId: paymentTransaction.id,
      invoiceId: invoice.id,
      paymentUrl,
      paymentToken,
      amount: finalAmount,
      discount,
      tier,
      billingPeriod,
    });
  } catch (error) {
    console.error('Upgrade error:', error);
    return NextResponse.json(
      { error: 'Failed to initiate upgrade' },
      { status: 500 }
    );
  }
}