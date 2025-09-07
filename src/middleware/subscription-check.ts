import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { prisma } from '@/lib/prisma';

// Pages that are always accessible
const PUBLIC_PATHS = [
  '/auth',
  '/api/auth',
  '/_next',
  '/favicon.ico',
  '/public',
];

// Pages accessible even with expired subscription (read-only)
const READ_ONLY_PATHS = [
  '/dashboard',
  '/profile',
  '/settings/billing',
  '/subscription/expired',
  '/subscription/upgrade',
];

// Features that require active subscription
const PREMIUM_FEATURES = [
  '/students/add',
  '/students/edit',
  '/finance/transactions/new',
  '/reports/generate',
  '/export',
  '/import',
];

export async function checkSubscription(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Skip public paths
  if (PUBLIC_PATHS.some(path => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Get user session
  const token = await getToken({ 
    req: request, 
    secret: process.env.NEXTAUTH_SECRET 
  });

  if (!token || !token.tenantId) {
    // No authenticated user or no tenant
    return NextResponse.next();
  }

  try {
    // Get tenant subscription
    const subscription = await prisma.subscription.findFirst({
      where: {
        organizationId: token.tenantId as string,
      },
    });

    if (!subscription) {
      // No subscription found - redirect to setup
      return NextResponse.redirect(
        new URL('/subscription/setup', request.url)
      );
    }

    const now = new Date();
    const isExpired = subscription.status === 'EXPIRED' || 
                     (subscription.endDate && subscription.endDate < now);
    const isTrial = subscription.tier === 'TRIAL';
    const trialExpired = isTrial && 
                        subscription.trialEndDate && 
                        subscription.trialEndDate < now;

    // Check if subscription is expired or trial has ended
    if (isExpired || trialExpired) {
      // Check if accessing premium features
      if (PREMIUM_FEATURES.some(path => pathname.startsWith(path))) {
        // Redirect to upgrade page
        return NextResponse.redirect(
          new URL('/subscription/expired?feature=restricted', request.url)
        );
      }

      // Check if trying to modify data (POST, PUT, DELETE)
      if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(request.method)) {
        // For API routes, return error
        if (pathname.startsWith('/api')) {
          return NextResponse.json(
            { 
              error: 'Subscription expired. Please upgrade to continue.',
              code: 'SUBSCRIPTION_EXPIRED' 
            },
            { status: 403 }
          );
        }
        
        // For pages, redirect to upgrade
        return NextResponse.redirect(
          new URL('/subscription/expired?action=modify', request.url)
        );
      }

      // Add header to indicate expired subscription (for UI to show banner)
      const response = NextResponse.next();
      response.headers.set('X-Subscription-Status', 'expired');
      response.headers.set('X-Trial-Status', trialExpired ? 'expired' : 'active');
      
      return response;
    }

    // Check usage limits for active subscriptions
    if (subscription.status === 'ACTIVE') {
      // Usage tracking would be implemented here
      // For now, we'll skip usage checks
      const usage = null;

      // Get tier limits
      const limits = getTierLimits(subscription.tier);
      
      // Usage checking would be implemented here when usage tracking is added
      // For now, we'll skip these checks
    }

    // Add subscription info to headers for the app to use
    const response = NextResponse.next();
    response.headers.set('X-Subscription-Tier', subscription.tier);
    response.headers.set('X-Subscription-Status', subscription.status);
    
    if (isTrial && subscription.trialEndDate) {
      const daysRemaining = Math.ceil(
        (subscription.trialEndDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      );
      response.headers.set('X-Trial-Days-Remaining', daysRemaining.toString());
    }
    
    return response;
    
  } catch (error) {
    console.error('Error checking subscription:', error);
    // Allow access but log error
    return NextResponse.next();
  }
}

function getTierLimits(tier: string) {
  switch (tier) {
    case 'TRIAL':
      return {
        maxStudents: 50,
        maxTeachers: 10,
        maxStorageMB: 1000, // 1 GB
        maxMonthlyEmails: 100,
        maxMonthlySMS: 0,
      };
    case 'BASIC':
      return {
        maxStudents: 100,
        maxTeachers: 20,
        maxStorageMB: 5000, // 5 GB
        maxMonthlyEmails: 500,
        maxMonthlySMS: 100,
      };
    case 'STANDARD':
      return {
        maxStudents: 500,
        maxTeachers: 50,
        maxStorageMB: 20000, // 20 GB
        maxMonthlyEmails: 2000,
        maxMonthlySMS: 500,
      };
    case 'PREMIUM':
      return {
        maxStudents: 2000,
        maxTeachers: 200,
        maxStorageMB: 100000, // 100 GB
        maxMonthlyEmails: 10000,
        maxMonthlySMS: 2000,
      };
    case 'ENTERPRISE':
      return {
        maxStudents: Infinity,
        maxTeachers: Infinity,
        maxStorageMB: Infinity,
        maxMonthlyEmails: Infinity,
        maxMonthlySMS: Infinity,
      };
    default:
      return {
        maxStudents: 0,
        maxTeachers: 0,
        maxStorageMB: 0,
        maxMonthlyEmails: 0,
        maxMonthlySMS: 0,
      };
  }
}