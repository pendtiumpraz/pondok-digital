import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

const prismaClientSingleton = () => {
  const client = new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    datasources: {
      db: {
        url: process.env.DATABASE_URL || '',
      },
    },
  })

  // Add global tenant-aware middleware for security
  // This acts as a safety net, but specific tenant clients should be used when possible
  client.$use(async (params, next) => {
    // Models that should always be tenant-filtered for security
    const tenantModels = [
      'user', 'student', 'teacher', 'class', 'course', 'attendance', 
      'grade', 'exam', 'schedule', 'message', 'notification', 'activity',
      'alumni', 'budget', 'transaction', 'financialReport', 'donationCampaign',
      'ebook', 'video', 'hafalanRecord', 'hafalanSession', 'hafalanTarget',
      'parentAccount', 'lineAdmin', 'auditTrail', 'securityAuditLog'
    ]

    // Skip tenant filtering for tenant model itself and system models
    const skipTenantModels = ['tenant', 'pushSubscription', 'twoFactorVerification']

    if (params.model && tenantModels.includes(params.model.toLowerCase())) {
      // Log queries that might be missing tenant context in development
      if (process.env.NODE_ENV === 'development') {
        const hasExplicitTenantFilter = params.args?.where?.tenantId !== undefined ||
          params.args?.where?.AND?.some((condition: any) => condition.tenantId !== undefined) ||
          params.args?.where?.OR?.some((condition: any) => condition.tenantId !== undefined)

        if (!hasExplicitTenantFilter && ['findMany', 'findFirst', 'count', 'aggregate'].includes(params.action)) {
          console.warn(`⚠️  Query on ${params.model} without explicit tenant filter:`, {
            action: params.action,
            args: params.args
          })
        }
      }

      // For write operations without tenantId, log a warning but don't block
      if (['create', 'createMany'].includes(params.action)) {
        if (params.action === 'create' && !params.args?.data?.tenantId) {
          console.warn(`⚠️  Creating ${params.model} without tenantId - this may cause data isolation issues`)
        }
        if (params.action === 'createMany' && params.args?.data?.some((item: any) => !item.tenantId)) {
          console.warn(`⚠️  Creating multiple ${params.model} records without tenantId - this may cause data isolation issues`)
        }
      }
    }

    return next(params)
  })

  // Add audit logging middleware
  client.$use(async (params, next) => {
    const start = Date.now()
    const result = await next(params)
    const duration = Date.now() - start

    // Log slow queries in development
    if (process.env.NODE_ENV === 'development' && duration > 1000) {
      console.warn(`🐌 Slow query detected (${duration}ms):`, {
        model: params.model,
        action: params.action
      })
    }

    return result
  })

  return client
}

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

/**
 * Get a tenant-aware Prisma client for the current context
 * This function should be used instead of the default prisma client for tenant operations
 */
export function getTenantPrismaClient(tenantId?: string): PrismaClient {
  // Import here to avoid circular dependency
  const { getCurrentTenantContext, createTenantPrismaClient } = require('./tenant-context')
  
  const tenant = getCurrentTenantContext()
  const effectiveTenantId = tenantId || tenant?.id
  
  if (effectiveTenantId) {
    return createTenantPrismaClient(effectiveTenantId)
  }
  
  // Return default client with warning
  if (process.env.NODE_ENV === 'development') {
    console.warn('🔄 Using default Prisma client - consider using getTenantPrismaClient() with explicit tenantId')
  }
  
  return prisma
}

export default prisma