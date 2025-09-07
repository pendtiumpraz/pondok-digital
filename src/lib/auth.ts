import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import prisma from './prisma'
import { 
  findUserWithTenant, 
  detectTenantFromRequest, 
  getTenantBySubdomain, 
  getTenantByDomain,
  isSuperAdmin,
  parsePrefixedUsername
} from './tenant-auth'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
        tenantId: { label: 'Tenant ID', type: 'text' },
        host: { label: 'Host', type: 'text' }
      },
      async authorize(credentials, req) {
        console.log('🔐 Authorize called with:', { 
          username: credentials?.username,
          hasPassword: !!credentials?.password,
          tenantId: credentials?.tenantId,
          host: credentials?.host
        })

        if (!credentials?.username || !credentials?.password) {
          console.log('❌ Missing credentials')
          return null
        }

        try {
          // Detect tenant from request or credentials
          let detectedTenant = null
          
          // Try to detect tenant from host/subdomain first
          if (credentials.host || req?.headers?.host) {
            const hostToUse = credentials.host || req?.headers?.host || ''
            const { subdomain, domain } = detectTenantFromRequest({
              headers: { host: hostToUse }
            })
            
            if (subdomain) {
              detectedTenant = await getTenantBySubdomain(subdomain)
              console.log('🏢 Detected tenant from subdomain:', { subdomain, tenant: detectedTenant?.name })
            } else if (domain) {
              detectedTenant = await getTenantByDomain(domain)
              console.log('🏢 Detected tenant from domain:', { domain, tenant: detectedTenant?.name })
            }
          }
          
          // Use provided tenantId if available
          const tenantId = credentials.tenantId || detectedTenant?.id
          
          console.log('🔍 Looking for user with tenant context:', {
            username: credentials.username,
            tenantId,
            detectedTenant: detectedTenant?.name
          })
          
          // Use tenant-aware user lookup
          const userResult = await findUserWithTenant(credentials.username, tenantId)
          
          if (!userResult.user) {
            console.log('❌ User not found:', credentials.username)
            return null
          }
          
          const { user, tenant, isPrefixed, originalUsername } = userResult

          if (!user.isActive) {
            console.log('❌ User not active:', credentials.username)
            return null
          }

          console.log('✅ User found:', { 
            id: user.id, 
            username: user.username, 
            isActive: user.isActive,
            tenant: tenant?.name,
            isPrefixed,
            originalUsername
          })

          console.log('🔑 Comparing passwords...')
          const passwordMatch = await bcrypt.compare(
            credentials.password,
            user.password
          )

          if (!passwordMatch) {
            console.log('❌ Password mismatch for user:', credentials.username)
            return null
          }

          console.log('✅ Password match successful for user:', credentials.username)
          
          // Check if user has 2FA enabled
          const requires2FA = user.twoFactorEnabled
          
          return {
            id: user.id,
            username: user.username,
            email: user.email,
            name: user.name,
            role: user.role,
            isUstadz: user.isUstadz,
            requires2FA,
            tenantId: tenant?.id,
            tenantPrefix: tenant?.prefix,
            tenantName: tenant?.name,
          }
        } catch (error) {
          console.error('❌ Auth error:', error)
          return null
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      try {
        if (user) {
          token.role = user.role
          token.username = user.username
          token.isUstadz = user.isUstadz
          token.requires2FA = user.requires2FA
          token.tenantId = user.tenantId
          token.tenantPrefix = user.tenantPrefix
          token.tenantName = user.tenantName
        }
        return token
      } catch (error) {
        console.error('JWT callback error:', error)
        return token
      }
    },
    async session({ session, token }) {
      try {
        if (token && session?.user) {
          session.user.id = token.sub as string
          session.user.role = token.role as string
          session.user.username = token.username as string
          session.user.isUstadz = token.isUstadz as boolean
          session.user.requires2FA = token.requires2FA as boolean
          session.user.tenantId = token.tenantId as string
          session.user.tenantPrefix = token.tenantPrefix as string
          session.user.tenantName = token.tenantName as string
        }
        
        // Ensure session always has a valid structure
        if (!session) {
          return {
            expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            user: null as any
          } as any
        }
        
        return session
      } catch (error) {
        console.error('Session callback error:', error)
        // Return a valid empty session structure
        return {
          expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          user: null as any
        } as any
      }
    },
    async signIn({ user, account, profile }) {
      if (process.env.NODE_ENV === 'development') {
        console.log('SignIn callback:', { user: !!user, account: !!account, profile: !!profile })
      }
      return true
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
  logger: {
    error(code, metadata) {
      console.error('NextAuth Error:', code, metadata)
    },
    warn(code) {
      console.warn('NextAuth Warning:', code)
    },
    debug(code, metadata) {
      if (process.env.NODE_ENV === 'development') {
        console.log('NextAuth Debug:', code, metadata)
      }
    },
  },
  events: {
    async session({ session, token }) {
      // Log session events for debugging
      if (process.env.NODE_ENV === 'development') {
        console.log('Session event:', { session: !!session, token: !!token })
      }
    },
  },
}