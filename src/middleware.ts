import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { checkSubscription } from './middleware/subscription-check'

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Routes that don't need tenant context or subscription check
  const publicRoutes = [
    '/',
    '/pricing',
    '/features',
    '/contact',
    '/onboarding',
    '/auth',
    '/api/auth',
    '/api/onboarding',
    '/api/webhooks',
    '/_next',
    '/favicon.ico',
  ]

  // Check if it's a public route
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route))
  if (isPublicRoute) {
    return NextResponse.next()
  }

  // Check if it's a yayasan route
  if (pathname.startsWith('/yayasan/')) {
    // Extract yayasan slug from URL
    const parts = pathname.split('/')
    const yayasanSlug = parts[2] // /yayasan/[slug]/...
    
    if (yayasanSlug) {
      // Skip subscription check for auth pages
      if (!pathname.includes('/auth/')) {
        // Check subscription status for authenticated yayasan routes
        const subscriptionResponse = await checkSubscription(request)
        if (subscriptionResponse.status !== 200 && subscriptionResponse.status !== 304) {
          return subscriptionResponse
        }
      }
      
      const response = NextResponse.next()
      
      // Add yayasan info to headers for downstream use
      response.headers.set('x-yayasan-slug', yayasanSlug)
      
      // Copy subscription headers from subscription check
      const subscriptionHeaders = ['X-Subscription-Status', 'X-Subscription-Tier', 'X-Trial-Days-Remaining', 'X-Trial-Status']
      subscriptionHeaders.forEach(header => {
        const value = request.headers.get(header)
        if (value) {
          response.headers.set(header, value)
        }
      })
      
      // Add security headers
      response.headers.set('x-frame-options', 'DENY')
      response.headers.set('x-content-type-options', 'nosniff')
      response.headers.set('referrer-policy', 'strict-origin-when-cross-origin')
      
      return response
    }
  }

  // For all other routes, proceed normally
  const response = NextResponse.next()
  
  // Add security headers
  response.headers.set('x-frame-options', 'DENY')
  response.headers.set('x-content-type-options', 'nosniff')
  response.headers.set('referrer-policy', 'strict-origin-when-cross-origin')
  
  return response
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