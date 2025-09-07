import { prisma } from '@/lib/prisma';

interface SalesNotification {
  type: 'NEW_TRIAL_SIGNUP' | 'TRIAL_EXPIRING' | 'TRIAL_EXPIRED' | 'SUBSCRIPTION_UPGRADED';
  tenant: {
    name: string;
    slug: string;
    adminName: string;
    email: string;
    whatsapp: string;
    city?: string;
    signupDate?: string;
    trialEndDate?: string;
  };
}

interface WelcomeEmailData {
  to: string;
  name: string;
  tenantName: string;
  trialDays: number;
  loginUrl: string;
}

export class NotificationService {
  
  async notifySalesTeam(data: SalesNotification) {
    try {
      // Format WhatsApp message
      const whatsappMessage = this.formatWhatsAppMessage(data);
      
      // Send to sales team WhatsApp (you can integrate with WhatsApp Business API)
      await this.sendWhatsAppToSales(whatsappMessage);
      
      // Store notification in database
      // Store notification in database for admin tracking
      // Note: This would typically be a different model for sales notifications
      console.log('Sales notification:', {
        type: data.type,
        title: this.getNotificationTitle(data.type),
        message: whatsappMessage,
        data,
      });

      // Send email to sales team
      await this.sendEmailToSales(data);
      
    } catch (error) {
      console.error('Error notifying sales team:', error);
    }
  }

  private formatWhatsAppMessage(data: SalesNotification): string {
    const { tenant } = data;
    
    switch (data.type) {
      case 'NEW_TRIAL_SIGNUP':
        return `
🎉 *TRIAL BARU MENDAFTAR!*

*Yayasan:* ${tenant.name}
*Admin:* ${tenant.adminName}
*Email:* ${tenant.email}
*WhatsApp:* ${tenant.whatsapp}
*Kota:* ${tenant.city || 'Tidak disebutkan'}
*Tanggal Daftar:* ${new Date(tenant.signupDate || '').toLocaleDateString('id-ID')}
*Trial Berakhir:* ${new Date(tenant.trialEndDate || '').toLocaleDateString('id-ID')}

*Action Required:*
1. Hubungi via WhatsApp untuk onboarding
2. Jadwalkan demo/training
3. Follow up sebelum trial berakhir

*Link Admin:* https://pondokdigital.id/yayasan/${tenant.slug}
        `.trim();
        
      case 'TRIAL_EXPIRING':
        return `
⚠️ *TRIAL AKAN BERAKHIR!*

*Yayasan:* ${tenant.name}
*Admin:* ${tenant.adminName}
*WhatsApp:* ${tenant.whatsapp}
*Trial Berakhir:* ${new Date(tenant.trialEndDate || '').toLocaleDateString('id-ID')}

*URGENT:* Hubungi sekarang untuk conversion!
        `.trim();
        
      case 'TRIAL_EXPIRED':
        return `
🔴 *TRIAL SUDAH BERAKHIR*

*Yayasan:* ${tenant.name}
*Admin:* ${tenant.adminName}
*WhatsApp:* ${tenant.whatsapp}

*Action:* Follow up untuk upgrade ke berbayar
        `.trim();
        
      default:
        return `Notification: ${data.type}`;
    }
  }

  private async sendWhatsAppToSales(message: string) {
    // Sales team WhatsApp numbers
    const salesNumbers = [
      process.env.SALES_WHATSAPP_1 || '+6281234567890',
      process.env.SALES_WHATSAPP_2,
    ].filter(Boolean);

    // Integration with WhatsApp Business API or Fonnte/Wablas
    // For now, we'll log it
    console.log('WhatsApp notification to sales:', message);
    
    // TODO: Implement actual WhatsApp sending
    // Example with Fonnte:
    // await fetch('https://api.fonnte.com/send', {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Bearer ${process.env.FONNTE_TOKEN}`,
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify({
    //     target: salesNumbers.join(','),
    //     message: message,
    //   })
    // });
  }

  private async sendEmailToSales(data: SalesNotification) {
    const salesEmails = [
      process.env.SALES_EMAIL_1 || 'sales@pondokdigital.id',
      process.env.SALES_EMAIL_2,
    ].filter(Boolean);

    // TODO: Implement email sending with Resend/SendGrid
    console.log('Email notification to sales:', data);
  }

  async sendWelcomeEmail(data: WelcomeEmailData) {
    // TODO: Implement welcome email with Resend/SendGrid
    console.log('Sending welcome email:', data);
    
    // Example email template:
    const emailContent = `
      Assalamu'alaikum ${data.name},
      
      Selamat datang di Pondok Digital!
      
      Akun trial Anda untuk ${data.tenantName} telah berhasil dibuat.
      Anda memiliki ${data.trialDays} hari untuk mencoba semua fitur kami.
      
      Login di: ${data.loginUrl}
      
      Tim support kami akan menghubungi Anda untuk membantu proses onboarding.
      
      Wassalamu'alaikum,
      Tim Pondok Digital
    `;
    
    // Send via email service
  }

  private getNotificationTitle(type: string): string {
    switch (type) {
      case 'NEW_TRIAL_SIGNUP':
        return 'Trial Baru Mendaftar';
      case 'TRIAL_EXPIRING':
        return 'Trial Akan Berakhir';
      case 'TRIAL_EXPIRED':
        return 'Trial Sudah Berakhir';
      case 'SUBSCRIPTION_UPGRADED':
        return 'Subscription Upgraded';
      default:
        return type;
    }
  }

  async sendTrialExpiryNotification(tenantId: string, daysRemaining: number) {
    try {
      const tenant = await prisma.tenant.findUnique({
        where: { id: tenantId },
        include: {
          users: {
            where: { role: 'ADMIN' },
            take: 1,
          },
        },
      });

      if (!tenant || !tenant.users[0]) return;

      const admin = tenant.users[0];
      
      if (daysRemaining === 1) {
        // Notify sales team
        await this.notifySalesTeam({
          type: 'TRIAL_EXPIRING',
          tenant: {
            name: tenant.name,
            slug: tenant.slug,
            adminName: admin.name || '',
            email: admin.email,
            whatsapp: admin.email || '',
            trialEndDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          },
        });
      }
      
      // Send notification to admin
      await prisma.notification.create({
        data: {
          type: 'TRIAL_EXPIRING',
          title: `Trial Anda akan berakhir dalam ${daysRemaining} hari`,
          message: `Trial Anda akan berakhir dalam ${daysRemaining} hari. Upgrade sekarang untuk melanjutkan akses.`,
          userId: admin.id,
          data: JSON.stringify({
            tenantId,
            daysRemaining,
          }),
        },
      });
      
    } catch (error) {
      console.error('Error sending trial expiry notification:', error);
    }
  }
}