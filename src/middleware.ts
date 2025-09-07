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
    
    // Return error response for tenant validation failures
    return new NextResponse(
      JSON.stringify({
        error: 'Tenant validation failed',
        message: error instanceof Error ? error.message : 'Unknown error',
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