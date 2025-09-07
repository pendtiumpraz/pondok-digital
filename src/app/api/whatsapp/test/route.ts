import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { getWhatsAppService } from '@/lib/whatsapp-service';

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!session.user?.role || !['SUPER_ADMIN', 'ADMIN'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { phoneNumber } = body;

    if (!phoneNumber) {
      return NextResponse.json(
        { error: 'Phone number is required' },
        { status: 400 }
      );
    }

    const whatsappService = getWhatsAppService();
    
    // Test connection first
    const connectionTest = await whatsappService.testConnection();
    if (!connectionTest.success) {
      return NextResponse.json({
        success: false,
        error: 'WhatsApp service connection failed: ' + connectionTest.error,
      });
    }

    // Send test message
    const testMessage = `🧪 *Test Message*

Assalamu'alaikum!

Ini adalah pesan test dari sistem Pondok Pesantren Imam Syafi'i.

Jika Anda menerima pesan ini, berarti konfigurasi WhatsApp sudah berjalan dengan baik.

Barakallahu fiikum!

_Dikirim pada: ${new Date().toLocaleString('id-ID')}_`;

    const result = await whatsappService.sendTextMessage(phoneNumber, testMessage);

    return NextResponse.json({
      connectionTest: connectionTest,
      messageTest: result,
    });
  } catch (error) {
    console.error('WhatsApp test error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}