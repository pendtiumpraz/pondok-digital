import prisma from './prisma'
import bcrypt from 'bcryptjs'

/**
 * Tenant Prefix Authentication System
 * 
 * This module provides functionality for tenant-specific user authentication
 * using prefixed usernames to ensure uniqueness across different organizations.
 */

export interface TenantInfo {
  id: string
  name: string
  slug: string
  prefix: string
  domain?: string | null
  subdomain?: string | null
  isActive: boolean
  settings?: any
  createdAt: Date
  updatedAt: Date
}

export interface PrefixedUser {
  originalUsername: string
  prefixedUsername: string
  tenantId: string
  tenantPrefix: string
}

/**
 * Generate a tenant prefix from tenant name
 * Rules:
 * - Take first 4 characters of each significant word
 * - Remove special characters and spaces
 * - Convert to uppercase
 * - Ensure minimum length of 3, maximum of 8 characters
 */
export function generateTenantPrefix(tenantName: string): string {
  if (!tenantName || tenantName.trim().length === 0) {
    throw new Error('Tenant name cannot be empty')
  }

  // Remove special characters and split by spaces/separators
  const cleanName = tenantName
    .replace(/[^\w\s]/g, ' ')
    .trim()
    .toUpperCase()

  const words = cleanName.split(/\s+/).filter(word => word.length > 0)
  
  if (words.length === 0) {
    throw new Error('Tenant name must contain valid characters')
  }

  let prefix = ''
  
  // Strategy 1: Use first 4 chars of each word (up to 2 words)
  if (words.length === 1) {
    prefix = words[0].substring(0, 8)
  } else {
    // Take first 4 chars from first word, then fill from other words
    prefix = words[0].substring(0, 4)
    for (let i = 1; i < words.length && prefix.length < 8; i++) {
      const remainingLength = 8 - prefix.length
      prefix += words[i].substring(0, Math.min(4, remainingLength))
    }
  }

  // Ensure minimum length of 3
  if (prefix.length < 3) {
    prefix = prefix.padEnd(3, 'X')
  }

  // Ensure maximum length of 8
  prefix = prefix.substring(0, 8)

  return prefix
}

/**
 * Generate a unique tenant prefix by checking against existing tenants
 */
export async function generateUniqueTenantPrefix(tenantName: string): Promise<string> {
  const basePrefix = generateTenantPrefix(tenantName)
  let prefix = basePrefix
  let counter = 1

  // Check if prefix already exists
  while (await checkPrefixExists(prefix)) {
    // Add number suffix if collision occurs
    const suffix = counter.toString()
    const maxPrefixLength = 8 - suffix.length
    prefix = basePrefix.substring(0, maxPrefixLength) + suffix
    counter++
    
    // Prevent infinite loop
    if (counter > 999) {
      throw new Error('Unable to generate unique tenant prefix')
    }
  }

  return prefix
}

/**
 * Check if a tenant prefix already exists
 */
export async function checkPrefixExists(prefix: string): Promise<boolean> {
  try {
    const existingTenant = await prisma.tenant.findFirst({
      where: { prefix }
    })
    return !!existingTenant
  } catch (error) {
    // If tenant table doesn't exist yet, assume prefix is available
    console.warn('Tenant table not found, assuming prefix is available:', error)
    return false
  }
}

/**
 * Parse a prefixed username to extract tenant prefix and original username
 */
export function parsePrefixedUsername(prefixedUsername: string): {
  tenantPrefix: string | null
  originalUsername: string
  isPrefixed: boolean
} {
  if (!prefixedUsername || prefixedUsername.trim().length === 0) {
    return {
      tenantPrefix: null,
      originalUsername: '',
      isPrefixed: false
    }
  }

  // Check for underscore separator
  const underscoreIndex = prefixedUsername.indexOf('_')
  
  if (underscoreIndex === -1 || underscoreIndex === 0) {
    // No prefix found or invalid format
    return {
      tenantPrefix: null,
      originalUsername: prefixedUsername,
      isPrefixed: false
    }
  }

  const potentialPrefix = prefixedUsername.substring(0, underscoreIndex)
  const originalUsername = prefixedUsername.substring(underscoreIndex + 1)

  // Validate prefix format (3-8 alphanumeric uppercase characters)
  if (!/^[A-Z0-9]{3,8}$/.test(potentialPrefix)) {
    return {
      tenantPrefix: null,
      originalUsername: prefixedUsername,
      isPrefixed: false
    }
  }

  return {
    tenantPrefix: potentialPrefix,
    originalUsername,
    isPrefixed: true
  }
}

/**
 * Create a prefixed username from tenant prefix and original username
 */
export function createPrefixedUsername(tenantPrefix: string, originalUsername: string): string {
  if (!tenantPrefix || !originalUsername) {
    throw new Error('Both tenant prefix and username are required')
  }

  // Validate prefix format
  if (!/^[A-Z0-9]{3,8}$/.test(tenantPrefix)) {
    throw new Error('Invalid tenant prefix format')
  }

  // Validate username format (allow alphanumeric, dots, hyphens, underscores)
  if (!/^[a-zA-Z0-9._-]+$/.test(originalUsername)) {
    throw new Error('Invalid username format')
  }

  return `${tenantPrefix}_${originalUsername}`
}

/**
 * Get tenant information by prefix
 */
export async function getTenantByPrefix(prefix: string): Promise<TenantInfo | null> {
  try {
    const tenant = await prisma.tenant.findFirst({
      where: { 
        prefix,
        isActive: true
      }
    })
    return tenant
  } catch (error) {
    console.warn('Error fetching tenant by prefix:', error)
    return null
  }
}

/**
 * Get tenant information by subdomain
 */
export async function getTenantBySubdomain(subdomain: string): Promise<TenantInfo | null> {
  try {
    const tenant = await prisma.tenant.findFirst({
      where: { 
        subdomain,
        isActive: true
      }
    })
    return tenant
  } catch (error) {
    console.warn('Error fetching tenant by subdomain:', error)
    return null
  }
}

/**
 * Get tenant information by domain
 */
export async function getTenantByDomain(domain: string): Promise<TenantInfo | null> {
  try {
    const tenant = await prisma.tenant.findFirst({
      where: { 
        domain,
        isActive: true
      }
    })
    return tenant
  } catch (error) {
    console.warn('Error fetching tenant by domain:', error)
    return null
  }
}

/**
 * Detect tenant from request headers or URL
 */
export function detectTenantFromRequest(request: {
  headers: { host?: string, 'x-forwarded-host'?: string }
  url?: string
}): { subdomain: string | null, domain: string | null } {
  const host = request.headers['x-forwarded-host'] || request.headers.host
  
  if (!host) {
    return { subdomain: null, domain: null }
  }

  // Remove port if present
  const cleanHost = host.split(':')[0]
  const parts = cleanHost.split('.')

  if (parts.length >= 3) {
    // Potential subdomain structure: subdomain.domain.com
    const subdomain = parts[0]
    const domain = parts.slice(1).join('.')
    
    // Don't treat 'www' as a tenant subdomain
    if (subdomain !== 'www' && subdomain !== 'api') {
      return { subdomain, domain }
    }
  }

  return { subdomain: null, domain: cleanHost }
}

/**
 * Validate tenant prefix format
 */
export function isValidTenantPrefix(prefix: string): boolean {
  return /^[A-Z0-9]{3,8}$/.test(prefix)
}

/**
 * Find user by prefixed or unprefixed username with tenant context
 */
export async function findUserWithTenant(
  usernameOrEmail: string,
  tenantId?: string
): Promise<{
  user: any | null
  tenant: TenantInfo | null
  isPrefixed: boolean
  originalUsername: string
}> {
  // First, try to parse as prefixed username
  const parsed = parsePrefixedUsername(usernameOrEmail)
  
  let user = null
  let tenant = null
  
  if (parsed.isPrefixed && parsed.tenantPrefix) {
    // Look up tenant by prefix
    tenant = await getTenantByPrefix(parsed.tenantPrefix)
    
    if (tenant) {
      // Search for user with original username in this tenant
      try {
        user = await prisma.user.findFirst({
          where: {
            OR: [
              { username: parsed.originalUsername },
              { email: parsed.originalUsername }
            ],
            tenantId: tenant.id,
            isActive: true
          }
        })
      } catch (error) {
        console.warn('Error finding user with tenant context:', error)
      }
    }
  } else {
    // Try to find user by email or username
    // If tenantId is provided, search within that tenant
    const whereClause: any = {
      OR: [
        { username: usernameOrEmail },
        { email: usernameOrEmail }
      ],
      isActive: true
    }
    
    if (tenantId) {
      whereClause.tenantId = tenantId
      // Also get tenant info
      try {
        tenant = await prisma.tenant.findUnique({
          where: { id: tenantId, isActive: true }
        })
      } catch (error) {
        console.warn('Error finding tenant:', error)
      }
    }

    try {
      user = await prisma.user.findFirst({
        where: whereClause
      })
    } catch (error) {
      console.warn('Error finding user:', error)
    }
  }

  return {
    user,
    tenant,
    isPrefixed: parsed.isPrefixed,
    originalUsername: parsed.originalUsername || usernameOrEmail
  }
}

/**
 * Create a new tenant with auto-generated prefix
 */
export async function createTenant(data: {
  name: string
  slug?: string
  domain?: string
  subdomain?: string
}): Promise<TenantInfo> {
  const prefix = await generateUniqueTenantPrefix(data.name)
  const slug = data.slug || data.name.toLowerCase().replace(/[^\w]+/g, '-')

  try {
    const tenant = await prisma.tenant.create({
      data: {
        name: data.name,
        slug,
        prefix,
        domain: data.domain,
        subdomain: data.subdomain,
        isActive: true
      }
    })
    return tenant
  } catch (error) {
    throw new Error(`Failed to create tenant: ${error}`)
  }
}

/**
 * Utility function to check if user is super admin (can access all tenants)
 */
export function isSuperAdmin(userRole: string): boolean {
  return userRole === 'SUPER_ADMIN' || userRole === 'SYSTEM_ADMIN'
}

/**
 * Get all available tenants (for super admin or tenant selection)
 */
export async function getAllTenants(): Promise<TenantInfo[]> {
  try {
    const tenants = await prisma.tenant.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' }
    })
    return tenants
  } catch (error) {
    console.warn('Error fetching tenants:', error)
    return []
  }
}

/**
 * Migration helper: Convert existing usernames to prefixed format
 */
export async function migrateToPrefixedUsername(
  userId: string,
  tenantId: string
): Promise<{ success: boolean, newUsername?: string, error?: string }> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      return { success: false, error: 'User not found' }
    }

    const tenant = await prisma.tenant.findUnique({
      where: { id: tenantId }
    })

    if (!tenant) {
      return { success: false, error: 'Tenant not found' }
    }

    // Check if username is already prefixed
    const parsed = parsePrefixedUsername(user.username)
    if (parsed.isPrefixed) {
      return { 
        success: true, 
        newUsername: user.username 
      }
    }

    // Create new prefixed username
    const newUsername = createPrefixedUsername(tenant.prefix, user.username)

    // Check if new username conflicts
    const existingUser = await prisma.user.findUnique({
      where: { username: newUsername }
    })

    if (existingUser) {
      return { 
        success: false, 
        error: `Prefixed username ${newUsername} already exists` 
      }
    }

    // Update user with new prefixed username and tenant
    await prisma.user.update({
      where: { id: userId },
      data: { 
        username: newUsername,
        tenantId: tenantId
      }
    })

    return { 
      success: true, 
      newUsername 
    }
  } catch (error) {
    return { 
      success: false, 
      error: `Migration failed: ${error}` 
    }
  }
}