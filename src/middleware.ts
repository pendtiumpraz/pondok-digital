import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { tenantValidationMiddleware, getCurrentTenant } from './lib/tenant-context'

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Bypass middleware for webhook routes - no redirects or tenant validation
  if (pathname.startsWith('/api/webhooks/')) {
    return NextResponse.next()
  }

  // Bypass tenant validation for static files and API routes that don't need tenant context
  const bypassPaths = [
    '/_next',
    '/favicon.ico',
    '/api/health',
    '/api/system',
    '/api/auth/signin',
    '/api/auth/callback',
    '/api/auth/csrf',
    '/public'
  ]

  const shouldBypass = bypassPaths.some(path => pathname.startsWith(path))
  if (shouldBypass) {
    return NextResponse.next()
  }

  // Apply tenant validation for all other routes
  try {
    // Check if database URL is configured
    if (!process.env.DATABASE_URL) {
      console.warn('DATABASE_URL not configured, skipping tenant validation')
      const response = NextResponse.next()
      
      // Add security headers
      response.headers.set('x-frame-options', 'DENY')
      response.headers.set('x-content-type-options', 'nosniff')
      response.headers.set('referrer-policy', 'strict-origin-when-cross-origin')
      
      return response
    }

    const tenantResponse = await tenantValidationMiddleware(request)
    
    // If tenant validation returns an error response, return it
    if (tenantResponse.status !== 200) {
      return tenantResponse
    }

    // Get tenant context for logging
    const tenantContext = await getCurrentTenant(request)
    
    // Add tenant information to request for downstream processing
    const response = NextResponse.next()
    
    if (tenantContext.tenant) {
      response.headers.set('x-tenant-id', tenantContext.tenant.id)
      response.headers.set('x-tenant-slug', tenantContext.tenant.slug)
      response.headers.set('x-tenant-name', tenantContext.tenant.name)
      response.headers.set('x-tenant-prefix', tenantContext.tenant.prefix)
      response.headers.set('x-detection-method', tenantContext.detectionMethod)
    }
    
    // Add security headers
    response.headers.set('x-frame-options', 'DENY')
    response.headers.set('x-content-type-options', 'nosniff')
    response.headers.set('referrer-policy', 'strict-origin-when-cross-origin')
    
    return response
    
  } catch (error) {
    console.error('Middleware error:', error)
    
    // Check if this is a database connection error
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    const isDatabaseError = errorMessage.includes('connect') || 
                          errorMessage.includes('ECONNREFUSED') || 
                          errorMessage.includes('P1001') ||
                          errorMessage.includes('database') ||
                          errorMessage.includes('prisma')
    
    // If database error in production, allow request to proceed
    if (isDatabaseError && process.env.NODE_ENV === 'production') {
      console.error('Database connection error in middleware, proceeding without tenant validation')
      const response = NextResponse.next()
      
      // Add security headers
      response.headers.set('x-frame-options', 'DENY')
      response.headers.set('x-content-type-options', 'nosniff')
      response.headers.set('referrer-policy', 'strict-origin-when-cross-origin')
      
      return response
    }
    
    // Return error response for other failures
    return new NextResponse(
      JSON.stringify({
        error: 'Middleware error',
        message: process.env.NODE_ENV === 'development' ? errorMessage : 'Internal server error',
        code: 'MIDDLEWARE_ERROR'
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*|public).*)',
  ],
}