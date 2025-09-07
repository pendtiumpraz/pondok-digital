import { NextRequest, NextResponse } from 'next/server';
import { TripayService } from '@/lib/payment/tripay-service';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const callbackSignature = request.headers.get('X-Callback-Signature');
    const rawBody = await request.text();
    const callback = JSON.parse(rawBody);

    if (!callbackSignature) {
      return NextResponse.json(
        { error: 'Missing signature' },
        { status: 401 }
      );
    }

    // Verify signature
    const tripay = new TripayService();
    const isValid = tripay.verifyCallback(callbackSignature, rawBody);

    if (!isValid) {
      console.error('Invalid Tripay signature');
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    const {
      merchant_ref,
      reference,
      status,
      payment_method,
      payment_name,
      amount,
      fee_merchant,
      fee_customer,
      total_fee,
      amount_received,
      paid_at,
    } = callback;

    // Get payment transaction by merchant reference
    const paymentTransaction = await prisma.paymentTransaction.findFirst({
      where: { 
        gatewayTransactionId: merchant_ref 
      },
      include: {
        invoice: true,
        subscription: true,
      },
    });

    if (!paymentTransaction) {
      console.error('Payment transaction not found:', merchant_ref);
      return NextResponse.json(
        { error: 'Payment not found' },
        { status: 404 }
      );
    }

    // Update payment status based on Tripay status
    let paymentStatus: 'PENDING' | 'SUCCESS' | 'FAILED' | 'CANCELLED' = 'PENDING';
    let subscriptionStatus: 'ACTIVE' | 'EXPIRED' | 'CANCELLED' | undefined;

    switch (status) {
      case 'PAID':
        paymentStatus = 'SUCCESS';
        subscriptionStatus = 'ACTIVE';
        break;
      case 'UNPAID':
        paymentStatus = 'PENDING';
        break;
      case 'REFUND':
      case 'FAILED':
        paymentStatus = 'FAILED';
        break;
      case 'EXPIRED':
        paymentStatus = 'FAILED';
        break;
    }

    // Update payment transaction
    await prisma.paymentTransaction.update({
      where: { id: paymentTransaction.id },
      data: {
        status: paymentStatus,
        paymentMethod: payment_method,
        paidAt: paid_at ? new Date(paid_at * 1000) : null,
        gatewayResponse: {
          ...(typeof paymentTransaction.gatewayResponse === 'object' && paymentTransaction.gatewayResponse !== null ? paymentTransaction.gatewayResponse : {}),
          tripay_reference: reference,
          tripay_callback: callback,
          fee_merchant,
          fee_customer,
          total_fee,
          amount_received,
        },
      },
    });

    // Update invoice status
    if (paymentStatus === 'SUCCESS') {
      await prisma.invoice.update({
        where: { id: paymentTransaction.invoiceId },
        data: {
          status: 'PAID',
          paidDate: new Date(),
          paymentMethod: payment_method,
        },
      });
    }

    // If payment successful, activate subscription
    if (paymentStatus === 'SUCCESS' && subscriptionStatus === 'ACTIVE') {
      const subscription = paymentTransaction.subscription;

      if (subscription) {
        const now = new Date();
        const endDate = new Date();
        
        // Set end date based on billing cycle
        if (subscription.billingCycle === 'MONTHLY') {
          endDate.setMonth(endDate.getMonth() + 1);
        } else if (subscription.billingCycle === 'YEARLY') {
          endDate.setFullYear(endDate.getFullYear() + 1);
        }

        await prisma.subscription.update({
          where: { id: subscription.id },
          data: {
            status: 'ACTIVE',
            currentPeriodStart: now,
            currentPeriodEnd: endDate,
            endDate,
            lastPaymentDate: now,
            nextBillingDate: endDate,
            // Clear trial if upgrading from trial
            trialEndDate: subscription.tier === 'TRIAL' ? null : subscription.trialEndDate,
          },
        });

        // Send success notification to user
        const tenant = await prisma.tenant.findUnique({
          where: { id: paymentTransaction.organizationId },
          include: {
            users: {
              where: { role: 'ADMIN' },
              take: 1,
            },
          },
        });

        if (tenant && tenant.users[0]) {
          await prisma.notification.create({
            data: {
              type: 'PAYMENT_SUCCESS',
              title: 'Pembayaran Berhasil',
              message: `Pembayaran telah berhasil. Langganan Anda telah diaktifkan.`,
              userId: tenant.users[0].id,
              data: JSON.stringify({
                invoiceId: paymentTransaction.invoiceId,
                amount: paymentTransaction.amount,
              }),
            },
          });
        }
      }
    }

    return NextResponse.json({ 
      success: true,
      message: 'Callback received' 
    });
  } catch (error) {
    console.error('Tripay webhook error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}