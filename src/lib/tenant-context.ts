import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient, Prisma } from '@prisma/client'
import { cache } from 'react'
import { getTenantBySubdomain, getTenantByDomain, TenantInfo } from './tenant-auth'
import prisma from './prisma'

/**
 * Tenant Context System
 * 
 * This module provides comprehensive tenant isolation for multi-tenant applications.
 * It handles tenant detection, context management, and automatic filtering.
 */

// Types for tenant context
export interface TenantContext {
  id: string
  name: string
  slug: string
  prefix: string
  domain?: string
  subdomain?: string
  isActive: boolean
  settings: Record<string, any>
  createdAt: Date
  updatedAt: Date
}

export interface TenantRequestContext {
  tenant: TenantContext | null
  isMultiTenant: boolean
  isTenantRequired: boolean
  detectionMethod: 'subdomain' | 'domain' | 'header' | 'none'
  originalHost: string
  error?: string
}

// Global tenant context for server components
let currentTenant: TenantContext | null = null

/**
 * Extract tenant information from request
 * Supports multiple detection methods: subdomain, custom domain, and headers
 */
export function extractTenantFromRequest(request: NextRequest): {
  subdomain: string | null
  domain: string | null
  customDomain: string | null
  host: string
  detectionMethod: 'subdomain' | 'domain' | 'header' | 'none'
} {
  const host = request.headers.get('host') || request.headers.get('x-forwarded-host') || ''
  const tenantHeader = request.headers.get('x-tenant-id')
  
  // If tenant is specified via header (for API calls)
  if (tenantHeader) {
    return {
      subdomain: null,
      domain: null,
      customDomain: tenantHeader,
      host,
      detectionMethod: 'header'
    }
  }

  // Remove port if present
  const cleanHost = host.split(':')[0].toLowerCase()
  const hostParts = cleanHost.split('.')

  // Check for subdomain pattern (e.g., pondok-syafii.app.com)
  if (hostParts.length >= 3) {
    const potentialSubdomain = hostParts[0]
    const baseDomain = hostParts.slice(1).join('.')
    
    // Exclude common subdomains that aren't tenants
    const excludedSubdomains = ['www', 'api', 'admin', 'app', 'mail', 'ftp', 'blog', 'dev', 'staging', 'test']
    
    if (!excludedSubdomains.includes(potentialSubdomain)) {
      return {
        subdomain: potentialSubdomain,
        domain: baseDomain,
        customDomain: null,
        host,
        detectionMethod: 'subdomain'
      }
    }
  }

  // Check for custom domain (single or multi-level domain that's not the main app domain)
  const mainDomains = ['localhost', '127.0.0.1', 'app.com', 'yourapp.com'] // Configure your main domains
  
  if (!mainDomains.includes(cleanHost) && !cleanHost.startsWith('192.168.') && !cleanHost.startsWith('10.')) {
    return {
      subdomain: null,
      domain: cleanHost,
      customDomain: cleanHost,
      host,
      detectionMethod: 'domain'
    }
  }

  return {
    subdomain: null,
    domain: cleanHost,
    customDomain: null,
    host,
    detectionMethod: 'none'
  }
}

/**
 * Get current tenant information from request
 * This is the main function for tenant detection
 */
export async function getCurrentTenant(request: NextRequest): Promise<TenantRequestContext> {
  const extraction = extractTenantFromRequest(request)
  
  let tenant: TenantContext | null = null
  let error: string | undefined

  try {
    // Try different detection methods
    switch (extraction.detectionMethod) {
      case 'subdomain':
        if (extraction.subdomain) {
          const tenantData = await getTenantBySubdomain(extraction.subdomain)
          if (tenantData) {
            tenant = mapTenantInfoToContext(tenantData)
          }
        }
        break
        
      case 'domain':
        if (extraction.customDomain) {
          const tenantData = await getTenantByDomain(extraction.customDomain)
          if (tenantData) {
            tenant = mapTenantInfoToContext(tenantData)
          }
        }
        break
        
      case 'header':
        if (extraction.customDomain) {
          // Look up tenant by ID, slug, or subdomain from header
          const tenantData = await findTenantByIdentifier(extraction.customDomain)
          if (tenantData) {
            tenant = mapTenantInfoToContext(tenantData)
          }
        }
        break
    }
  } catch (err) {
    error = `Failed to resolve tenant: ${err instanceof Error ? err.message : 'Unknown error'}`
  }

  return {
    tenant,
    isMultiTenant: true,
    isTenantRequired: extraction.detectionMethod !== 'none',
    detectionMethod: extraction.detectionMethod,
    originalHost: extraction.host,
    error
  }
}

/**
 * Helper function to find tenant by various identifiers
 */
async function findTenantByIdentifier(identifier: string): Promise<TenantInfo | null> {
  try {
    // Try to find by ID, slug, prefix, subdomain, or domain
    const tenant = await prisma.tenant.findFirst({
      where: {
        OR: [
          { id: identifier },
          { slug: identifier },
          { prefix: identifier.toUpperCase() },
          { subdomain: identifier.toLowerCase() },
          { domain: identifier.toLowerCase() }
        ],
        isActive: true
      }
    })
    return tenant
  } catch (error) {
    console.warn('Error finding tenant by identifier:', error)
    return null
  }
}

/**
 * Map TenantInfo to TenantContext
 */
function mapTenantInfoToContext(tenantInfo: TenantInfo): TenantContext {
  return {
    id: tenantInfo.id,
    name: tenantInfo.name,
    slug: tenantInfo.slug,
    prefix: tenantInfo.prefix,
    domain: tenantInfo.domain,
    subdomain: tenantInfo.subdomain,
    isActive: tenantInfo.isActive,
    settings: typeof tenantInfo.settings === 'object' ? tenantInfo.settings || {} : {},
    createdAt: tenantInfo.createdAt,
    updatedAt: tenantInfo.updatedAt
  }
}

/**
 * Server-side function to get current tenant in RSC (React Server Components)
 * Uses dynamic import to access headers only when in server context
 */
export const getCurrentTenantSSR = cache(async (): Promise<TenantContext | null> => {
  try {
    // Dynamic import to avoid client-side issues
    const { headers } = await import('next/headers')
    const headersList = headers()
    const host = headersList.get('host') || headersList.get('x-forwarded-host') || ''
    const tenantId = headersList.get('x-tenant-id')
    const tenantSlug = headersList.get('x-tenant-slug')
    
    // Priority: x-tenant-id > x-tenant-slug > host-based detection
    if (tenantId) {
      const tenant = await prisma.tenant.findUnique({
        where: { id: tenantId, isActive: true }
      })
      if (tenant) return mapTenantInfoToContext(tenant)
    }
    
    if (tenantSlug) {
      const tenant = await prisma.tenant.findFirst({
        where: { slug: tenantSlug, isActive: true }
      })
      if (tenant) return mapTenantInfoToContext(tenant)
    }
    
    // Extract from host
    const cleanHost = host.split(':')[0].toLowerCase()
    const hostParts = cleanHost.split('.')
    
    // Try subdomain
    if (hostParts.length >= 3) {
      const subdomain = hostParts[0]
      if (!['www', 'api', 'admin', 'app'].includes(subdomain)) {
        const tenant = await getTenantBySubdomain(subdomain)
        if (tenant) return mapTenantInfoToContext(tenant)
      }
    }
    
    // Try custom domain
    const mainDomains = ['localhost', '127.0.0.1', 'app.com', 'yourapp.com']
    if (!mainDomains.includes(cleanHost)) {
      const tenant = await getTenantByDomain(cleanHost)
      if (tenant) return mapTenantInfoToContext(tenant)
    }
    
    return null
  } catch (error) {
    console.warn('Error getting current tenant in SSR:', error)
    return null
  }
})

/**
 * Set current tenant context (for server-side operations)
 */
export function setCurrentTenant(tenant: TenantContext | null): void {
  currentTenant = tenant
}

/**
 * Get current tenant context (for server-side operations)
 */
export function getCurrentTenantContext(): TenantContext | null {
  return currentTenant
}

/**
 * Middleware to validate tenant and inject tenant context
 */
export async function tenantValidationMiddleware(request: NextRequest): Promise<NextResponse> {
  const tenantContext = await getCurrentTenant(request)
  
  // Check if tenant is required but not found
  if (tenantContext.isTenantRequired && !tenantContext.tenant) {
    return new NextResponse(
      JSON.stringify({
        error: 'Tenant not found',
        message: tenantContext.error || 'Invalid tenant domain or subdomain',
        code: 'TENANT_NOT_FOUND'
      }),
      {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
  }

  // Check if tenant is inactive
  if (tenantContext.tenant && !tenantContext.tenant.isActive) {
    return new NextResponse(
      JSON.stringify({
        error: 'Tenant inactive',
        message: 'This tenant account is currently inactive',
        code: 'TENANT_INACTIVE'
      }),
      {
        status: 403,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
  }

  // Create response and inject tenant headers
  const response = NextResponse.next()
  
  if (tenantContext.tenant) {
    response.headers.set('x-tenant-id', tenantContext.tenant.id)
    response.headers.set('x-tenant-slug', tenantContext.tenant.slug)
    response.headers.set('x-tenant-name', tenantContext.tenant.name)
    response.headers.set('x-tenant-prefix', tenantContext.tenant.prefix)
    
    // Set tenant context for downstream middleware
    setCurrentTenant(tenantContext.tenant)
  }

  return response
}

/**
 * Create a tenant-aware Prisma client with automatic filtering
 */
export function createTenantPrismaClient(tenantId?: string): PrismaClient {
  const client = new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })

  // Add tenant filtering middleware
  if (tenantId) {
    // Models that should be tenant-filtered
    const tenantModels = [
      'user', 'student', 'teacher', 'class', 'course', 'attendance', 
      'grade', 'exam', 'schedule', 'message', 'notification', 'activity',
      'alumni', 'budget', 'transaction', 'financialReport', 'donationCampaign',
      'ebook', 'video', 'hafalanRecord', 'hafalanSession', 'hafalanTarget'
    ]

    tenantModels.forEach(modelName => {
      // Add middleware for reads (findMany, findFirst, findUnique, count, etc.)
      client.$use(async (params, next) => {
        // Only apply to specified models
        if (params.model && tenantModels.includes(params.model.toLowerCase())) {
          // For read operations, add tenant filter
          if (['findMany', 'findFirst', 'count', 'aggregate', 'groupBy'].includes(params.action)) {
            params.args = params.args || {}
            params.args.where = params.args.where || {}
            
            // Add tenant filter if not already present
            if (!params.args.where.tenantId && !params.args.where.AND?.some((condition: any) => condition.tenantId)) {
              params.args.where.tenantId = tenantId
            }
          }
          
          // For findUnique, we need to be more careful
          if (params.action === 'findUnique') {
            params.args = params.args || {}
            params.args.where = params.args.where || {}
            
            // Convert findUnique to findFirst with tenant filter if tenantId is not in where clause
            if (!params.args.where.tenantId) {
              params.action = 'findFirst'
              params.args.where.tenantId = tenantId
            }
          }
          
          // For write operations, inject tenantId
          if (['create', 'createMany'].includes(params.action)) {
            params.args = params.args || {}
            
            if (params.action === 'create') {
              params.args.data = params.args.data || {}
              if (!params.args.data.tenantId) {
                params.args.data.tenantId = tenantId
              }
            }
            
            if (params.action === 'createMany') {
              params.args.data = params.args.data || []
              params.args.data = params.args.data.map((item: any) => ({
                ...item,
                tenantId: item.tenantId || tenantId
              }))
            }
          }
          
          // For update operations, add tenant filter to where clause
          if (['update', 'updateMany', 'delete', 'deleteMany'].includes(params.action)) {
            params.args = params.args || {}
            params.args.where = params.args.where || {}
            
            if (!params.args.where.tenantId && !params.args.where.AND?.some((condition: any) => condition.tenantId)) {
              params.args.where.tenantId = tenantId
            }
          }
        }
        
        return next(params)
      })
    })
  }

  return client
}

/**
 * Get tenant-aware Prisma client for current request context
 */
export function getTenantPrismaClient(): PrismaClient {
  const tenant = getCurrentTenantContext()
  
  if (tenant) {
    return createTenantPrismaClient(tenant.id)
  }
  
  // Fallback to regular client if no tenant context
  return prisma
}

/**
 * Row-Level Security helper functions
 */

/**
 * Validate that a resource belongs to the current tenant
 */
export async function validateTenantResource(
  resourceTenantId: string | null | undefined,
  allowedTenantId?: string
): Promise<boolean> {
  const tenant = getCurrentTenantContext()
  const requiredTenantId = allowedTenantId || tenant?.id
  
  if (!requiredTenantId) {
    return false // No tenant context or allowed tenant ID
  }
  
  return resourceTenantId === requiredTenantId
}

/**
 * Throw error if resource doesn't belong to current tenant
 */
export async function requireTenantResource(
  resourceTenantId: string | null | undefined,
  resourceType: string = 'resource'
): Promise<void> {
  const isValid = await validateTenantResource(resourceTenantId)
  
  if (!isValid) {
    throw new Error(`Access denied: ${resourceType} does not belong to current tenant`)
  }
}

/**
 * Filter array of resources by tenant
 */
export function filterByTenant<T extends { tenantId?: string | null }>(
  resources: T[],
  tenantId?: string
): T[] {
  const tenant = getCurrentTenantContext()
  const filterTenantId = tenantId || tenant?.id
  
  if (!filterTenantId) {
    return [] // No tenant context, return empty array
  }
  
  return resources.filter(resource => resource.tenantId === filterTenantId)
}

/**
 * Create database where clause with tenant filter
 */
export function withTenantFilter(
  where: any = {},
  tenantId?: string
): any {
  const tenant = getCurrentTenantContext()
  const filterTenantId = tenantId || tenant?.id
  
  if (!filterTenantId) {
    return where
  }
  
  return {
    ...where,
    tenantId: filterTenantId
  }
}

/**
 * Security audit logging for tenant operations
 */
export async function logTenantOperation(
  operation: string,
  resourceType: string,
  resourceId: string,
  additionalData?: Record<string, any>
): Promise<void> {
  const tenant = getCurrentTenantContext()
  
  try {
    await prisma.securityAuditLog.create({
      data: {
        action: operation,
        resourceType,
        resourceId,
        tenantId: tenant?.id || null,
        metadata: {
          tenantName: tenant?.name,
          tenantSlug: tenant?.slug,
          ...additionalData
        },
        timestamp: new Date(),
        userId: null // Will be set by auth middleware if available
      }
    })
  } catch (error) {
    console.warn('Failed to log tenant operation:', error)
  }
}

/**
 * Utility to check if current user has access to tenant
 */
export function validateTenantAccess(
  userTenantId: string | null | undefined,
  userRole?: string
): boolean {
  const tenant = getCurrentTenantContext()
  
  // Super admin can access any tenant
  if (userRole === 'SUPER_ADMIN' || userRole === 'SYSTEM_ADMIN') {
    return true
  }
  
  // Regular users must belong to the current tenant
  return userTenantId === tenant?.id
}

/**
 * Create response with tenant information in headers
 */
export function createTenantResponse(
  data: any,
  status: number = 200,
  additionalHeaders: Record<string, string> = {}
): NextResponse {
  const tenant = getCurrentTenantContext()
  
  const headers = {
    'Content-Type': 'application/json',
    ...additionalHeaders
  }
  
  if (tenant) {
    headers['x-tenant-id'] = tenant.id
    headers['x-tenant-slug'] = tenant.slug
    headers['x-tenant-name'] = tenant.name
  }
  
  return new NextResponse(JSON.stringify(data), {
    status,
    headers
  })
}

export default {
  extractTenantFromRequest,
  getCurrentTenant,
  getCurrentTenantSSR,
  tenantValidationMiddleware,
  createTenantPrismaClient,
  getTenantPrismaClient,
  validateTenantResource,
  requireTenantResource,
  filterByTenant,
  withTenantFilter,
  logTenantOperation,
  validateTenantAccess,
  createTenantResponse
}