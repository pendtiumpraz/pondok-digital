# Tenant Isolation System Documentation

This document explains the comprehensive tenant isolation system implemented for the pondok-digital multi-tenant application.

## Overview

The tenant isolation system provides:
- Automatic tenant detection via subdomains and custom domains
- Row-level security with automatic data filtering
- Secure tenant context management
- Production-ready error handling and validation
- Comprehensive logging and audit trails

## Architecture Components

### 1. Tenant Context (`/src/lib/tenant-context.ts`)

The core tenant isolation module that handles:
- Tenant detection from HTTP requests
- Context management for server-side operations
- Automatic Prisma middleware for data filtering
- Row-level security helpers
- Tenant validation and authentication

### 2. Enhanced Middleware (`/src/middleware.ts`)

Next.js middleware that:
- Validates tenant access for all requests
- Injects tenant headers for downstream processing
- Handles tenant-specific error responses
- Adds security headers
- Bypasses validation for system routes

### 3. Tenant-Aware Prisma Client (`/src/lib/prisma.ts`)

Enhanced Prisma configuration with:
- Global tenant filtering middleware
- Development-time query warnings
- Slow query detection
- Audit logging capabilities

## Tenant Detection Methods

### 1. Subdomain Detection
```
Format: [tenant-slug].app.com
Example: pondok-syafii.app.com → tenant with subdomain "pondok-syafii"
```

### 2. Custom Domain Detection
```
Format: tenant-domain.com
Example: ponpes-alhuda.sch.id → tenant with custom domain
```

### 3. Header-Based Detection
```
Headers:
- x-tenant-id: Direct tenant ID
- x-tenant-slug: Tenant slug
```

## Usage Examples

### Server-Side Components (RSC)
```typescript
import { getCurrentTenantSSR } from '@/lib/tenant-context'

export default async function Page() {
  const tenant = await getCurrentTenantSSR()
  
  if (!tenant) {
    return <div>Tenant not found</div>
  }

  return <div>Welcome to {tenant.name}</div>
}
```

### API Routes
```typescript
import { getCurrentTenant, createTenantResponse } from '@/lib/tenant-context'
import { getTenantPrismaClient } from '@/lib/prisma'

export async function GET(request: Request) {
  const tenantContext = await getCurrentTenant(request as any)
  
  if (!tenantContext.tenant) {
    return new Response('Tenant not found', { status: 404 })
  }

  // Use tenant-aware Prisma client
  const db = getTenantPrismaClient(tenantContext.tenant.id)
  
  const users = await db.user.findMany() // Automatically filtered by tenant
  
  return createTenantResponse({ users })
}
```

### Database Operations
```typescript
import { getTenantPrismaClient, withTenantFilter } from '@/lib/tenant-context'

// Method 1: Use tenant-aware client (Recommended)
const db = getTenantPrismaClient()
const users = await db.user.findMany() // Automatically filtered

// Method 2: Manual tenant filtering
import { prisma } from '@/lib/prisma'
const users = await prisma.user.findMany({
  where: withTenantFilter({ isActive: true })
})
```

### Row-Level Security Validation
```typescript
import { validateTenantResource, requireTenantResource } from '@/lib/tenant-context'

// Validate resource belongs to current tenant
const isValid = await validateTenantResource(resource.tenantId)

// Throw error if resource doesn't belong to current tenant
await requireTenantResource(user.tenantId, 'user')
```

## Security Features

### 1. Automatic Data Filtering
- All tenant-sensitive models are automatically filtered by tenantId
- Prevents accidental data leakage between tenants
- Development warnings for queries without tenant context

### 2. Tenant Validation Middleware
- Validates tenant exists and is active
- Returns appropriate error responses
- Logs security audit trails

### 3. Row-Level Security Helpers
```typescript
// Filter arrays by tenant
const filteredData = filterByTenant(dataArray, tenantId)

// Validate user access to tenant
const hasAccess = validateTenantAccess(user.tenantId, user.role)

// Create database where clause with tenant filter
const where = withTenantFilter({ status: 'active' })
```

### 4. Security Headers
Automatically added to all responses:
- `x-frame-options: DENY`
- `x-content-type-options: nosniff`
- `referrer-policy: strict-origin-when-cross-origin`

## Configuration

### Environment Variables
```env
DATABASE_URL=postgresql://...
POSTGRES_URL=postgresql://...
NODE_ENV=development|production
```

### Middleware Configuration
The middleware automatically applies to all routes except:
- `/_next/*` (Next.js internals)
- `/favicon.ico`
- `/api/health` (Health checks)
- `/api/system` (System APIs)
- `/api/auth/*` (Authentication routes)
- `/api/webhooks/*` (Webhook endpoints)
- `/public/*` (Static files)

## Database Schema Requirements

Your Prisma schema should include:

```prisma
model Tenant {
  id        String   @id @default(cuid())
  name      String
  slug      String   @unique
  prefix    String   @unique
  domain    String?  @unique
  subdomain String?  @unique
  isActive  Boolean  @default(true)
  settings  Json?    @default("{}")
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  users     User[]
}

model User {
  id       String  @id @default(cuid())
  // ... other fields
  tenantId String?
  tenant   Tenant? @relation(fields: [tenantId], references: [id])
}

// Add tenantId to all tenant-specific models
model Student {
  id       String  @id @default(cuid())
  tenantId String?
  tenant   Tenant? @relation(fields: [tenantId], references: [id])
  // ... other fields
}
```

## Error Handling

### Common Error Responses

1. **Tenant Not Found (404)**
```json
{
  "error": "Tenant not found",
  "message": "Invalid tenant domain or subdomain",
  "code": "TENANT_NOT_FOUND"
}
```

2. **Tenant Inactive (403)**
```json
{
  "error": "Tenant inactive",
  "message": "This tenant account is currently inactive",
  "code": "TENANT_INACTIVE"
}
```

3. **Middleware Error (500)**
```json
{
  "error": "Tenant validation failed",
  "message": "Specific error message",
  "code": "MIDDLEWARE_ERROR"
}
```

## Development Features

### Query Warnings
In development mode, the system logs warnings for:
- Queries on tenant models without explicit tenant filters
- Slow queries (>1000ms)
- Create operations without tenantId

### Debug Headers
Responses include debug headers:
- `x-tenant-id`: Current tenant ID
- `x-tenant-slug`: Current tenant slug
- `x-tenant-name`: Current tenant name
- `x-detection-method`: How the tenant was detected

## Best Practices

### 1. Always Use Tenant-Aware Clients
```typescript
// ✅ Good
const db = getTenantPrismaClient()
const users = await db.user.findMany()

// ❌ Avoid
const users = await prisma.user.findMany() // No automatic filtering
```

### 2. Validate Tenant Access
```typescript
// ✅ Good
await requireTenantResource(resource.tenantId, 'resource')

// ❌ Avoid
// No validation - potential security risk
```

### 3. Use Tenant Context in Components
```typescript
// ✅ Good
const tenant = await getCurrentTenantSSR()
if (!tenant) return <NotFound />

// ❌ Avoid
// Operating without tenant context
```

### 4. Handle Multi-Tenant Scenarios
```typescript
// For super admin access
if (user.role === 'SUPER_ADMIN') {
  // Can access any tenant
  const db = createTenantPrismaClient(specificTenantId)
} else {
  // Regular user - use current tenant
  const db = getTenantPrismaClient()
}
```

## Testing

### Unit Testing
```typescript
import { extractTenantFromRequest, getCurrentTenant } from '@/lib/tenant-context'

// Mock request for subdomain
const mockRequest = {
  headers: new Headers({ host: 'pondok-syafii.app.com' }),
  nextUrl: { pathname: '/' }
} as NextRequest

const result = extractTenantFromRequest(mockRequest)
expect(result.subdomain).toBe('pondok-syafii')
```

### Integration Testing
Test tenant isolation by:
1. Creating test tenants in different environments
2. Verifying data isolation between tenants
3. Testing subdomain and domain routing
4. Validating error responses

## Monitoring and Logging

The system provides comprehensive logging:
- Tenant detection and validation
- Security audit trails
- Query performance monitoring
- Error tracking with tenant context

Monitor these metrics:
- Tenant resolution time
- Failed tenant validations
- Query performance per tenant
- Security violations

## Migration Guide

### From Single-Tenant to Multi-Tenant

1. **Add tenant fields to existing models**
2. **Update existing queries to use tenant-aware clients**
3. **Add tenant validation to API routes**
4. **Configure subdomain/domain routing**
5. **Test data isolation thoroughly**

### Migrating Existing Data

Use the migration helper in `tenant-auth.ts`:
```typescript
import { migrateToPrefixedUsername } from '@/lib/tenant-auth'

const result = await migrateToPrefixedUsername(userId, tenantId)
if (!result.success) {
  console.error('Migration failed:', result.error)
}
```

This comprehensive tenant isolation system ensures secure, scalable multi-tenancy for your application while maintaining development-friendly features and production-ready security.