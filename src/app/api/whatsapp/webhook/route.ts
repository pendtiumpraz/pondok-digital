import { NextRequest, NextResponse } from 'next/server';
import { getWhatsAppService } from '@/lib/whatsapp-service';

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const mode = searchParams.get('hub.mode');
    const token = searchParams.get('hub.verify_token');
    const challenge = searchParams.get('hub.challenge');

    if (!mode || !token) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    const whatsappService = getWhatsAppService();
    const verificationResult = whatsappService.verifyWebhook(mode, token, challenge || '');

    if (verificationResult) {
      return new NextResponse(verificationResult, {
        status: 200,
        headers: { 'Content-Type': 'text/plain' },
      });
    } else {
      return NextResponse.json({ error: 'Webhook verification failed' }, { status: 403 });
    }
  } catch (error) {
    console.error('WhatsApp webhook verification error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Verify webhook signature (optional but recommended)
    const signature = request.headers.get('x-hub-signature-256');
    if (signature) {
      // Implement signature verification here if needed
      // const expectedSignature = generateSignature(JSON.stringify(body));
      // if (signature !== expectedSignature) {
      //   return NextResponse.json({ error: 'Invalid signature' }, { status: 403 });
      // }
    }

    console.log('WhatsApp webhook received:', JSON.stringify(body, null, 2));

    const whatsappService = getWhatsAppService();
    await whatsappService.processWebhookData(body);

    return NextResponse.json({ status: 'success' });
  } catch (error) {
    console.error('WhatsApp webhook processing error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Helper function to generate signature (implement if needed)
function generateSignature(payload: string): string {
  const crypto = require('crypto');
  const appSecret = process.env.WHATSAPP_APP_SECRET || '';
  
  return 'sha256=' + crypto
    .createHmac('sha256', appSecret)
    .update(payload, 'utf8')
    .digest('hex');
}