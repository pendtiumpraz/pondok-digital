import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { SubscriptionManager } from '@/lib/subscription/subscription-manager';
import { NotificationService } from '@/lib/notification/notification-service';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Validate required fields
    const requiredFields = ['tenantName', 'adminName', 'email', 'whatsapp', 'password'];
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json(
          { error: `Field ${field} is required` },
          { status: 400 }
        );
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate WhatsApp format (Indonesian number)
    const whatsappRegex = /^(\+62|62|0)8[1-9][0-9]{6,10}$/;
    if (!whatsappRegex.test(data.whatsapp)) {
      return NextResponse.json(
        { error: 'Invalid WhatsApp number format' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      );
    }

    // Generate tenant slug from name
    const slug = data.tenantName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    // Check if slug already exists
    const existingTenant = await prisma.tenant.findUnique({
      where: { slug }
    });

    if (existingTenant) {
      return NextResponse.json(
        { error: 'Organization name already taken' },
        { status: 400 }
      );
    }

    // Start transaction to create tenant, admin user, and trial subscription
    const result = await prisma.$transaction(async (tx) => {
      // 1. Create tenant
      const tenant = await tx.tenant.create({
        data: {
          name: data.tenantName,
          slug,
          prefix: slug.substring(0, 3).toUpperCase(),
          domain: `${slug}.pondokdigital.id`,
          settings: {
            contactEmail: data.email,
            contactPhone: data.whatsapp,
            address: data.address || '',
            city: data.city || '',
            province: data.province || '',
          },
          isActive: true,
        },
      });

      // 2. Hash password
      const hashedPassword = await bcrypt.hash(data.password, 10);

      // 3. Create admin user
      const adminUser = await tx.user.create({
        data: {
          username: data.email.split('@')[0],
          email: data.email,
          name: data.adminName,
          password: hashedPassword,
          role: 'ADMIN',
          tenantId: tenant.id,
          isActive: true,
        },
      });

      // 4. Create 14-day trial subscription
      const trialEndDate = new Date();
      trialEndDate.setDate(trialEndDate.getDate() + 14);
      
      const subscription = await tx.subscription.create({
        data: {
          organizationId: tenant.id,
          tier: 'TRIAL',
          status: 'TRIAL',
          startDate: new Date(),
          endDate: trialEndDate,
          trialEndDate,
          isTrialUsed: true,
          currentPeriodStart: new Date(),
          currentPeriodEnd: trialEndDate,
          billingCycle: 'MONTHLY',
          price: 0,
          currency: 'IDR',
        },
      });

      // 5. Log the trial creation
      await tx.auditTrail.create({
        data: {
          tableName: 'tenants',
          recordId: tenant.id,
          action: 'TRIAL_STARTED',
          userId: adminUser.id,
          ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
          userAgent: request.headers.get('user-agent') || 'unknown',
          newValues: JSON.stringify({
            trialDays: 14,
            email: data.email,
            whatsapp: data.whatsapp,
          }),
        },
      });

      // 6. Create notification for sales team
      const notificationService = new NotificationService();
      await notificationService.notifySalesTeam({
        type: 'NEW_TRIAL_SIGNUP',
        tenant: {
          name: data.tenantName,
          slug,
          adminName: data.adminName,
          email: data.email,
          whatsapp: data.whatsapp,
          city: data.city || 'Not specified',
          signupDate: new Date().toISOString(),
          trialEndDate: subscription.trialEndDate?.toISOString(),
        },
      });

      // 7. Send welcome email to admin
      await notificationService.sendWelcomeEmail({
        to: data.email,
        name: data.adminName,
        tenantName: data.tenantName,
        trialDays: 14,
        loginUrl: `https://pondokdigital.id/yayasan/${slug}/auth/signin`,
      });

      return {
        tenant,
        user: {
          id: adminUser.id,
          email: adminUser.email,
          name: adminUser.name,
          role: adminUser.role,
        },
        subscription,
      };
    });

    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Trial account created successfully',
      data: {
        tenantSlug: result.tenant.slug,
        loginUrl: `https://pondokdigital.id/yayasan/${result.tenant.slug}/auth/signin`,
        trialEndDate: result.subscription.trialEndDate,
        user: result.user,
      },
    });

  } catch (error) {
    console.error('Error creating trial:', error);
    return NextResponse.json(
      { error: 'Failed to create trial account' },
      { status: 500 }
    );
  }
}