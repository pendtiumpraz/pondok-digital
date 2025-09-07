import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import prisma from '@/lib/prisma'
import { 
  createTenant,
  generateUniqueTenantPrefix,
  createPrefixedUsername,
  isValidTenantPrefix,
  detectTenantFromRequest,
  getTenantBySubdomain,
  getTenantByDomain
} from '@/lib/tenant-auth'
import { z } from 'zod'

// Validation schemas
const createTenantSchema = z.object({
  tenantName: z.string().min(2).max(100),
  tenantSlug: z.string().optional(),
  domain: z.string().optional(),
  subdomain: z.string().optional(),
})

const registerUserSchema = z.object({
  username: z.string().min(3).max(50),
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2).max(100),
  phone: z.string().optional(),
  role: z.enum(['ADMIN', 'STAFF', 'USER']).default('USER'),
  isUstadz: z.boolean().default(false),
  tenantId: z.string().optional(),
  createTenant: z.boolean().default(false),
  tenantData: createTenantSchema.optional(),
})

/**
 * POST /api/auth/tenant-register
 * 
 * Register a new user with automatic tenant prefix assignment
 * Can also create a new tenant if specified
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const validatedData = registerUserSchema.parse(body)

    const {
      username,
      email,
      password,
      name,
      phone,
      role,
      isUstadz,
      tenantId,
      createTenant: shouldCreateTenant,
      tenantData
    } = validatedData

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { username }
        ]
      }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email or username already exists' },
        { status: 400 }
      )
    }

    let tenant = null
    let finalTenantId = tenantId

    // Handle tenant creation or detection
    if (shouldCreateTenant && tenantData) {
      // Create new tenant
      try {
        tenant = await createTenant({
          name: tenantData.tenantName,
          slug: tenantData.tenantSlug,
          domain: tenantData.domain,
          subdomain: tenantData.subdomain,
        })
        finalTenantId = tenant.id
        
        console.log('Created new tenant:', tenant.name, 'with prefix:', tenant.prefix)
      } catch (error) {
        return NextResponse.json(
          { error: `Failed to create tenant: ${error}` },
          { status: 500 }
        )
      }
    } else if (!finalTenantId) {
      // Try to detect tenant from request
      const { subdomain, domain } = detectTenantFromRequest({
        headers: {
          host: req.headers.get('host') || '',
          'x-forwarded-host': req.headers.get('x-forwarded-host') || ''
        }
      })

      if (subdomain) {
        tenant = await getTenantBySubdomain(subdomain)
      } else if (domain) {
        tenant = await getTenantByDomain(domain)
      }

      if (tenant) {
        finalTenantId = tenant.id
      }
    } else if (finalTenantId) {
      // Validate provided tenant ID
      tenant = await prisma.tenant.findUnique({
        where: { id: finalTenantId, isActive: true }
      })

      if (!tenant) {
        return NextResponse.json(
          { error: 'Invalid tenant ID' },
          { status: 400 }
        )
      }
    }

    // Generate prefixed username if tenant is available
    let finalUsername = username
    let tenantPrefix = null

    if (tenant) {
      try {
        finalUsername = createPrefixedUsername(tenant.prefix, username)
        tenantPrefix = tenant.prefix

        // Check if prefixed username already exists
        const existingPrefixedUser = await prisma.user.findUnique({
          where: { username: finalUsername }
        })

        if (existingPrefixedUser) {
          return NextResponse.json(
            { 
              error: `Username ${username} already exists in ${tenant.name}`,
              suggestion: `Try a different username or use: ${tenant.prefix}_${username}2`
            },
            { status: 400 }
          )
        }
      } catch (error) {
        return NextResponse.json(
          { error: `Invalid username format: ${error}` },
          { status: 400 }
        )
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user
    const newUser = await prisma.user.create({
      data: {
        username: finalUsername,
        email,
        password: hashedPassword,
        name,
        role,
        isUstadz,
        tenantId: finalTenantId,
        isActive: true,
        phoneVerified: false,
        twoFactorEnabled: false,
      },
      select: {
        id: true,
        username: true,
        email: true,
        name: true,
        role: true,
        isUstadz: true,
        tenantId: true,
        createdAt: true,
        tenant: {
          select: {
            id: true,
            name: true,
            prefix: true,
            slug: true
          }
        }
      }
    })

    // Prepare response data
    const responseData = {
      success: true,
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
        isUstadz: newUser.isUstadz,
        createdAt: newUser.createdAt,
      },
      tenant: newUser.tenant ? {
        id: newUser.tenant.id,
        name: newUser.tenant.name,
        prefix: newUser.tenant.prefix,
        slug: newUser.tenant.slug,
      } : null,
      prefixInfo: tenant ? {
        originalUsername: username,
        prefixedUsername: finalUsername,
        tenantPrefix,
        tenantName: tenant.name,
      } : null,
      message: tenant 
        ? `User registered successfully with prefix ${tenantPrefix} in ${tenant.name}`
        : 'User registered successfully (no tenant assigned)'
    }

    return NextResponse.json(responseData, { status: 201 })

  } catch (error) {
    console.error('Registration error:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Validation failed',
          details: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }))
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/auth/tenant-register
 * 
 * Get registration info including available tenants and detected tenant
 */
export async function GET(req: NextRequest) {
  try {
    // Detect tenant from request
    const { subdomain, domain } = detectTenantFromRequest({
      headers: {
        host: req.headers.get('host') || '',
        'x-forwarded-host': req.headers.get('x-forwarded-host') || ''
      }
    })

    let detectedTenant = null
    
    if (subdomain) {
      detectedTenant = await getTenantBySubdomain(subdomain)
    } else if (domain) {
      detectedTenant = await getTenantByDomain(domain)
    }

    // Get all active tenants for selection
    const availableTenants = await prisma.tenant.findMany({
      where: { isActive: true },
      select: {
        id: true,
        name: true,
        prefix: true,
        slug: true,
        domain: true,
        subdomain: true,
      },
      orderBy: { name: 'asc' }
    })

    return NextResponse.json({
      detectedTenant,
      availableTenants,
      canCreateTenant: true, // This could be based on permissions
      registrationInfo: {
        hostInfo: { subdomain, domain },
        prefixRules: {
          minLength: 3,
          maxLength: 8,
          format: 'Uppercase letters and numbers only',
          example: 'SYAF_username'
        }
      }
    })

  } catch (error) {
    console.error('Get registration info error:', error)
    return NextResponse.json(
      { error: 'Failed to get registration information' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/auth/tenant-register/validate
 * 
 * Validate registration data before submission
 */
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()
    const { username, email, tenantId, tenantPrefix } = body

    const validation = {
      username: { available: false, message: '' },
      email: { available: false, message: '' },
      tenant: { valid: false, message: '' },
      overall: { valid: false, message: '' }
    }

    // Validate email
    const existingEmailUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingEmailUser) {
      validation.email = { 
        available: false, 
        message: 'Email already registered' 
      }
    } else {
      validation.email = { 
        available: true, 
        message: 'Email available' 
      }
    }

    // Validate username (with or without prefix)
    let finalUsername = username
    let tenant = null

    if (tenantId) {
      tenant = await prisma.tenant.findUnique({
        where: { id: tenantId, isActive: true }
      })

      if (tenant) {
        finalUsername = createPrefixedUsername(tenant.prefix, username)
        validation.tenant = {
          valid: true,
          message: `Will use prefix: ${tenant.prefix}`
        }
      } else {
        validation.tenant = {
          valid: false,
          message: 'Invalid tenant'
        }
      }
    } else if (tenantPrefix && isValidTenantPrefix(tenantPrefix)) {
      finalUsername = createPrefixedUsername(tenantPrefix, username)
      validation.tenant = {
        valid: true,
        message: `Using prefix: ${tenantPrefix}`
      }
    } else {
      validation.tenant = {
        valid: true,
        message: 'No tenant prefix (allowed)'
      }
    }

    const existingUsernameUser = await prisma.user.findUnique({
      where: { username: finalUsername }
    })

    if (existingUsernameUser) {
      validation.username = {
        available: false,
        message: `Username ${finalUsername} already exists`
      }
    } else {
      validation.username = {
        available: true,
        message: `Username ${finalUsername} available`
      }
    }

    // Overall validation
    validation.overall = {
      valid: validation.username.available && 
             validation.email.available && 
             validation.tenant.valid,
      message: validation.overall.valid 
        ? 'All validations passed' 
        : 'Some validations failed'
    }

    return NextResponse.json({
      validation,
      finalUsername,
      tenant: tenant ? {
        id: tenant.id,
        name: tenant.name,
        prefix: tenant.prefix
      } : null
    })

  } catch (error) {
    console.error('Validation error:', error)
    return NextResponse.json(
      { error: 'Validation failed' },
      { status: 500 }
    )
  }
}