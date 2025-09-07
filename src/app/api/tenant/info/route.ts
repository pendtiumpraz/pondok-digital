import { NextRequest } from 'next/server'
import { getCurrentTenant, createTenantResponse } from '@/lib/tenant-context'
import { getTenantPrismaClient } from '@/lib/prisma'

/**
 * Example API route demonstrating tenant isolation
 * GET /api/tenant/info - Returns current tenant information and basic stats
 */
export async function GET(request: NextRequest) {
  try {
    // Get tenant context from request
    const tenantContext = await getCurrentTenant(request)
    
    // Validate tenant exists
    if (!tenantContext.tenant) {
      return createTenantResponse(
        {
          error: 'Tenant not found',
          message: tenantContext.error || 'No tenant context available',
          detectionMethod: tenantContext.detectionMethod,
          host: tenantContext.originalHost
        },
        404
      )
    }

    const { tenant } = tenantContext

    // Use tenant-aware Prisma client for database operations
    const db = getTenantPrismaClient(tenant.id)

    try {
      // Get tenant-specific statistics (automatically filtered by tenantId)
      const stats = await Promise.all([
        db.user.count(),
        db.student.count(),
        db.teacher.count(),
        db.class.count(),
      ])

      const [userCount, studentCount, teacherCount, classCount] = stats

      // Return tenant information and stats
      return createTenantResponse({
        tenant: {
          id: tenant.id,
          name: tenant.name,
          slug: tenant.slug,
          prefix: tenant.prefix,
          subdomain: tenant.subdomain,
          domain: tenant.domain,
          isActive: tenant.isActive,
        },
        stats: {
          users: userCount,
          students: studentCount,
          teachers: teacherCount,
          classes: classCount,
        },
        context: {
          detectionMethod: tenantContext.detectionMethod,
          host: tenantContext.originalHost,
          isMultiTenant: tenantContext.isMultiTenant,
        },
        timestamp: new Date().toISOString(),
      })
    } catch (dbError) {
      console.error('Database error for tenant', tenant.id, ':', dbError)
      
      return createTenantResponse(
        {
          error: 'Database error',
          message: 'Failed to fetch tenant statistics',
          tenantId: tenant.id
        },
        500
      )
    }
  } catch (error) {
    console.error('Tenant info API error:', error)
    
    return createTenantResponse(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      500
    )
  }
}

/**
 * Example POST endpoint for updating tenant settings
 * POST /api/tenant/info - Updates tenant settings
 */
export async function POST(request: NextRequest) {
  try {
    const tenantContext = await getCurrentTenant(request)
    
    if (!tenantContext.tenant) {
      return createTenantResponse(
        {
          error: 'Tenant not found',
          message: 'No tenant context available'
        },
        404
      )
    }

    const { tenant } = tenantContext
    const body = await request.json()

    // Validate request body
    if (!body || typeof body !== 'object') {
      return createTenantResponse(
        {
          error: 'Invalid request',
          message: 'Request body must be a valid JSON object'
        },
        400
      )
    }

    // Use tenant-aware Prisma client
    const db = getTenantPrismaClient(tenant.id)

    // Update tenant settings (only allowed fields)
    const allowedFields = ['name', 'settings']
    const updateData: any = {}

    Object.keys(body).forEach(key => {
      if (allowedFields.includes(key)) {
        updateData[key] = body[key]
      }
    })

    if (Object.keys(updateData).length === 0) {
      return createTenantResponse(
        {
          error: 'No valid fields',
          message: 'No valid fields provided for update',
          allowedFields
        },
        400
      )
    }

    // Update tenant
    const updatedTenant = await db.tenant.update({
      where: { id: tenant.id },
      data: {
        ...updateData,
        updatedAt: new Date()
      }
    })

    return createTenantResponse({
      message: 'Tenant updated successfully',
      tenant: {
        id: updatedTenant.id,
        name: updatedTenant.name,
        slug: updatedTenant.slug,
        settings: updatedTenant.settings,
        updatedAt: updatedTenant.updatedAt
      }
    })
  } catch (error) {
    console.error('Tenant update API error:', error)
    
    return createTenantResponse(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      500
    )
  }
}