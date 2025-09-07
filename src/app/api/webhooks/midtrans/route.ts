import { NextRequest, NextResponse } from 'next/server';
import { MidtransService } from '@/lib/payment/midtrans-service';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const notification = await request.json();
    
    const {
      order_id,
      transaction_status,
      fraud_status,
      payment_type,
      status_code,
      gross_amount,
      signature_key,
    } = notification;

    // Verify signature
    const midtrans = new MidtransService();
    const isValid = midtrans.verifyNotification(
      order_id,
      status_code,
      gross_amount,
      signature_key
    );

    if (!isValid) {
      console.error('Invalid Midtrans signature');
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    // Get payment transaction by gateway transaction ID
    const paymentTransaction = await prisma.paymentTransaction.findFirst({
      where: { 
        gatewayTransactionId: order_id 
      },
      include: {
        invoice: true,
        subscription: true,
      },
    });

    if (!paymentTransaction) {
      console.error('Payment transaction not found:', order_id);
      return NextResponse.json(
        { error: 'Payment not found' },
        { status: 404 }
      );
    }

    // Update payment status based on Midtrans status
    let paymentStatus: 'PENDING' | 'SUCCESS' | 'FAILED' | 'CANCELLED' = 'PENDING';
    let subscriptionStatus: 'ACTIVE' | 'EXPIRED' | 'CANCELLED' | undefined;

    if (transaction_status === 'capture' || transaction_status === 'settlement') {
      if (fraud_status === 'accept' || !fraud_status) {
        paymentStatus = 'SUCCESS';
        subscriptionStatus = 'ACTIVE';
      }
    } else if (transaction_status === 'pending') {
      paymentStatus = 'PENDING';
    } else if (
      transaction_status === 'deny' ||
      transaction_status === 'cancel' ||
      transaction_status === 'expire'
    ) {
      paymentStatus = transaction_status === 'cancel' ? 'CANCELLED' : 'FAILED';
    }

    // Update payment transaction
    await prisma.paymentTransaction.update({
      where: { id: paymentTransaction.id },
      data: {
        status: paymentStatus,
        paymentMethod: payment_type,
        paidAt: paymentStatus === 'SUCCESS' ? new Date() : null,
        gatewayResponse: {
          ...(typeof paymentTransaction.gatewayResponse === 'object' && paymentTransaction.gatewayResponse !== null ? paymentTransaction.gatewayResponse : {}),
          midtrans_notification: notification,
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
          paymentMethod: payment_type,
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

    return NextResponse.json({ status: 'OK' });
  } catch (error) {
    console.error('Midtrans webhook error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}