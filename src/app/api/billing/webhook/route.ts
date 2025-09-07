import { NextRequest, NextResponse } from 'next/server'
import { MidtransSubscriptionGateway } from '@/lib/subscription/midtrans-subscription'
import { PaymentNotification } from '@/lib/payment-gateway'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate that this is a Midtrans notification
    const requiredFields = ['transaction_status', 'order_id', 'gross_amount', 'signature_key']
    const missingFields = requiredFields.filter(field => !body[field])
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      )
    }

    const notification: PaymentNotification = {
      transaction_time: body.transaction_time,
      transaction_status: body.transaction_status as 'capture' | 'settlement' | 'pending' | 'deny' | 'cancel' | 'expire' | 'failure',
      transaction_id: body.transaction_id,
      status_message: body.status_message,
      status_code: body.status_code,
      signature_key: body.signature_key,
      payment_type: body.payment_type,
      order_id: body.order_id,
      merchant_id: body.merchant_id,
      masked_card: body.masked_card,
      gross_amount: body.gross_amount,
      fraud_status: body.fraud_status,
      eci: body.eci,
      currency: body.currency || 'IDR',
      channel_response_message: body.channel_response_message,
      channel_response_code: body.channel_response_code,
      card_type: body.card_type,
      bank: body.bank,
      va_numbers: body.va_numbers,
      biller_code: body.biller_code,
      bill_key: body.bill_key,
      permata_va_number: body.permata_va_number,
      bca_va_number: body.bca_va_number,
      approval_code: body.approval_code
    }

    const gateway = new MidtransSubscriptionGateway()
    
    // Process the notification
    await gateway.processSubscriptionNotification(notification)
    
    // Return success response to Midtrans
    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Error processing webhook:', error)
    
    // Log the error but return success to prevent Midtrans from retrying
    // In production, you might want to implement a dead letter queue
    return NextResponse.json(
      { error: 'Webhook processing failed but acknowledged' },
      { status: 200 }
    )
  }
}

// Handle GET request for webhook verification (optional)
export async function GET() {
  return NextResponse.json({
    status: 'Webhook endpoint is active',
    timestamp: new Date().toISOString()
  })
}