import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Routes that don't need tenant context
  const publicRoutes = [
    '/',
    '/pricing',
    '/auth',
    '/api/auth',
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
      const response = NextResponse.next()
      
      // Add yayasan info to headers for downstream use
      response.headers.set('x-yayasan-slug', yayasanSlug)
      
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