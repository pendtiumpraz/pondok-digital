import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { getWhatsAppService } from '@/lib/whatsapp-service';
import { WHATSAPP_TEMPLATES } from '@/lib/whatsapp-templates';

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!session.user?.role || !['SUPER_ADMIN', 'ADMIN'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const whatsappService = getWhatsAppService();
    const result = await whatsappService.getMessageTemplates();

    if (result.success) {
      return NextResponse.json({
        predefinedTemplates: WHATSAPP_TEMPLATES,
        whatsappTemplates: result.templates || [],
      });
    } else {
      return NextResponse.json({
        predefinedTemplates: WHATSAPP_TEMPLATES,
        whatsappTemplates: [],
        error: result.error,
      });
    }
  } catch (error) {
    console.error('Error fetching WhatsApp templates:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

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
    const { template } = body;

    if (!template) {
      return NextResponse.json(
        { error: 'Template data is required' },
        { status: 400 }
      );
    }

    const whatsappService = getWhatsAppService();
    const result = await whatsappService.createMessageTemplate(template);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error creating WhatsApp template:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}