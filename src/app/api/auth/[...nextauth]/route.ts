import NextAuth from 'next-auth'
import { authOptions } from '@/lib/auth'

// Set NEXTAUTH_URL from Vercel if not set
if (!process.env.NEXTAUTH_URL) {
  if (process.env.VERCEL_URL) {
    process.env.NEXTAUTH_URL = `https://${process.env.VERCEL_URL}`
  } else if (process.env.NODE_ENV === 'production') {
    process.env.NEXTAUTH_URL = 'https://pondok-digital.vercel.app'
  }
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }

// Configuration for App Router
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'