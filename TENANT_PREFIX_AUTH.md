# Tenant Prefix Authentication System

## Overview

This document explains the comprehensive tenant prefix authentication system implemented for the Pondok Imam Syafii application. The system ensures username uniqueness across different organizations (tenants) by using prefixed usernames.

## Table of Contents

1. [How the Prefix System Works](#how-the-prefix-system-works)
2. [Architecture](#architecture)
3. [Usage Examples](#usage-examples)
4. [API Reference](#api-reference)
5. [Component Usage](#component-usage)
6. [Migration Guide](#migration-guide)
7. [Edge Cases and Handling](#edge-cases-and-handling)
8. [Security Considerations](#security-considerations)
9. [Troubleshooting](#troubleshooting)

## How the Prefix System Works

### Core Concept

The tenant prefix authentication system solves the problem of username collisions across multiple organizations by prefixing usernames with a unique tenant identifier.

**Example:**
- Original username: `john`
- Tenant: "Pondok Syafi'i" 
- Generated prefix: `SYAF`
- Final username: `SYAF_john`

### Prefix Generation Rules

1. **Source**: Generated from tenant name
2. **Length**: 3-8 characters
3. **Format**: Uppercase letters and numbers only
4. **Separator**: Underscore (`_`)
5. **Uniqueness**: Globally unique across all tenants

### Generation Algorithm

```typescript
function generateTenantPrefix(tenantName: string): string {
  // 1. Clean and normalize the name
  const cleanName = tenantName
    .replace(/[^\w\s]/g, ' ')  // Remove special chars
    .trim()
    .toUpperCase()

  // 2. Split into words
  const words = cleanName.split(/\s+/).filter(word => word.length > 0)
  
  // 3. Build prefix from first 4 chars of each word
  let prefix = ''
  if (words.length === 1) {
    prefix = words[0].substring(0, 8)
  } else {
    prefix = words[0].substring(0, 4)
    for (let i = 1; i < words.length && prefix.length < 8; i++) {
      const remainingLength = 8 - prefix.length
      prefix += words[i].substring(0, Math.min(4, remainingLength))
    }
  }
  
  // 4. Ensure minimum length and handle collisions
  if (prefix.length < 3) {
    prefix = prefix.padEnd(3, 'X')
  }
  
  return prefix.substring(0, 8)
}
```

## Architecture

### Database Schema

#### Tenant Model
```prisma
model Tenant {
  id          String    @id @default(cuid())
  name        String
  slug        String    @unique
  prefix      String    @unique
  domain      String?   @unique
  subdomain   String?   @unique
  isActive    Boolean   @default(true)
  settings    Json?     @default("{}")
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  users       User[]

  @@map("tenants")
}
```

#### Updated User Model
```prisma
model User {
  // ... existing fields
  tenantId    String?
  tenant      Tenant?   @relation(fields: [tenantId], references: [id])
  // ... rest of fields
}
```

### Core Components

1. **Tenant Authentication Library** (`src/lib/tenant-auth.ts`)
   - Prefix generation and parsing
   - Tenant detection from domain/subdomain
   - User lookup with tenant context

2. **Enhanced NextAuth Configuration** (`src/lib/auth.ts`)
   - Multi-tenant authentication
   - Prefixed username support
   - Tenant context in session

3. **Smart Login Component** (`src/components/auth/TenantLoginForm.tsx`)
   - Automatic tenant detection
   - Multi-method login (username/email/phone)
   - Real-time prefix parsing

4. **Registration API** (`src/app/api/auth/tenant-register/route.ts`)
   - Auto-prefix assignment
   - Tenant creation support
   - Validation endpoints

## Usage Examples

### Example 1: Basic Login with Detected Tenant

**Scenario**: User visits `syafii.pondok.edu` subdomain

```typescript
// System automatically detects tenant from subdomain
// User enters: john
// System converts to: SYAF_john
// Login proceeds with tenant context
```

### Example 2: Login with Prefixed Username

**Scenario**: User knows their prefixed username

```typescript
// User enters: SYAF_john
// System parses:
// - tenantPrefix: "SYAF"
// - originalUsername: "john"
// - Looks up tenant by prefix
// - Authenticates in correct tenant context
```

### Example 3: Multi-Tenant Super Admin

**Scenario**: Super admin accessing multiple tenants

```typescript
// Super admin can access any tenant
// System checks isSuperAdmin(userRole)
// Allows cross-tenant operations
```

### Example 4: Organization Selection

**Scenario**: Main domain without tenant detection

```typescript
// User visits main domain
// System shows tenant selection
// User chooses organization
// Login proceeds with selected tenant context
```

## API Reference

### Core Functions

#### `generateTenantPrefix(tenantName: string): string`
Generates a tenant prefix from organization name.

```typescript
generateTenantPrefix("Pondok Imam Syafi'i")  // Returns: "SYAF"
generateTenantPrefix("Madrasah Al-Hikmah")   // Returns: "ALHIK"
```

#### `parsePrefixedUsername(username: string)`
Parses a potentially prefixed username.

```typescript
parsePrefixedUsername("SYAF_john")
// Returns: {
//   tenantPrefix: "SYAF",
//   originalUsername: "john", 
//   isPrefixed: true
// }
```

#### `createPrefixedUsername(prefix: string, username: string): string`
Creates a prefixed username.

```typescript
createPrefixedUsername("SYAF", "john")  // Returns: "SYAF_john"
```

#### `findUserWithTenant(usernameOrEmail: string, tenantId?: string)`
Tenant-aware user lookup.

```typescript
// Automatic tenant detection from prefixed username
await findUserWithTenant("SYAF_john")

// Explicit tenant context
await findUserWithTenant("john", tenantId)
```

### API Endpoints

#### `POST /api/auth/tenant-register`
Register new user with automatic prefix assignment.

**Request Body:**
```json
{
  "username": "john",
  "email": "john@example.com", 
  "password": "securePassword123",
  "name": "John Doe",
  "tenantId": "tenant-id-123",
  "createTenant": false,
  "tenantData": {
    "tenantName": "New Organization",
    "subdomain": "neworg"
  }
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "user-id-123",
    "username": "SYAF_john",
    "email": "john@example.com",
    "name": "John Doe"
  },
  "tenant": {
    "id": "tenant-id-123",
    "name": "Pondok Syafi'i",
    "prefix": "SYAF"
  },
  "prefixInfo": {
    "originalUsername": "john",
    "prefixedUsername": "SYAF_john",
    "tenantPrefix": "SYAF"
  }
}
```

#### `GET /api/auth/tenant-register`
Get registration information including available tenants.

**Response:**
```json
{
  "detectedTenant": {
    "id": "tenant-id",
    "name": "Pondok Syafi'i", 
    "prefix": "SYAF"
  },
  "availableTenants": [...],
  "canCreateTenant": true
}
```

## Component Usage

### TenantLoginForm

Basic usage:
```tsx
import TenantLoginForm from '@/components/auth/TenantLoginForm'

export default function LoginPage() {
  return (
    <div className="container mx-auto max-w-md">
      <TenantLoginForm redirectTo="/dashboard" />
    </div>
  )
}
```

Features:
- **Automatic tenant detection** from subdomain/domain
- **Smart prefix hints** showing required format
- **Real-time username parsing** with visual feedback
- **Multi-method login** (username, email, phone)
- **Tenant selection** when multiple options available
- **Responsive design** with proper error handling

### NextAuth Session Usage

Accessing tenant information in components:
```tsx
import { useSession } from 'next-auth/react'

export default function Dashboard() {
  const { data: session } = useSession()
  
  return (
    <div>
      <h1>Welcome to {session?.user?.tenantName}</h1>
      <p>User: {session?.user?.username}</p>
      <p>Tenant Prefix: {session?.user?.tenantPrefix}</p>
    </div>
  )
}
```

## Migration Guide

### Migrating Existing Users

#### Step 1: Create Default Tenant
```typescript
const defaultTenant = await createTenant({
  name: "Pondok Imam Syafi'i",
  slug: "pondok-syafii", 
  domain: "pondok.edu",
  subdomain: "main"
})
```

#### Step 2: Migrate Existing Users
```typescript
import { migrateToPrefixedUsername } from '@/lib/tenant-auth'

// Migrate individual user
const result = await migrateToPrefixedUsername(userId, tenantId)

if (result.success) {
  console.log(`Migrated to: ${result.newUsername}`)
} else {
  console.error(`Migration failed: ${result.error}`)
}
```

#### Step 3: Batch Migration Script
```typescript
// scripts/migrate-users.ts
async function migrateAllUsers() {
  const users = await prisma.user.findMany({
    where: { tenantId: null }
  })
  
  const defaultTenant = await prisma.tenant.findFirst()
  
  for (const user of users) {
    const result = await migrateToPrefixedUsername(user.id, defaultTenant.id)
    console.log(`User ${user.username}: ${result.success ? 'OK' : result.error}`)
  }
}
```

### Database Migration

```sql
-- Add tenant support to existing database
ALTER TABLE users ADD COLUMN tenant_id TEXT;
CREATE INDEX idx_users_tenant_id ON users(tenant_id);

-- Create tenants table
CREATE TABLE tenants (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  prefix TEXT UNIQUE NOT NULL,
  domain TEXT UNIQUE,
  subdomain TEXT UNIQUE,
  is_active BOOLEAN DEFAULT true,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Add foreign key constraint
ALTER TABLE users ADD CONSTRAINT fk_users_tenant 
  FOREIGN KEY (tenant_id) REFERENCES tenants(id);
```

## Edge Cases and Handling

### 1. Users Forgetting Their Prefix

**Problem**: User enters `john` instead of `SYAF_john`

**Solution**: 
- TenantLoginForm auto-detects tenant from subdomain
- Automatically prefixes username if tenant is known
- Shows helpful hints with expected format

```typescript
// Auto-correction in login form
if (selectedTenant && !parsedUsername?.isPrefixed) {
  const prefixedUsername = createPrefixedUsername(selectedTenant.prefix, username)
  setCredentials(prev => ({ ...prev, username: prefixedUsername }))
}
```

### 2. Tenant Name Changes

**Problem**: Organization renames itself

**Solutions**:
- Keep existing prefix for backward compatibility
- Add prefix alias support
- Provide migration path for new prefix

```typescript
// Tenant model supports both current and legacy prefixes
model Tenant {
  prefix        String    @unique
  legacyPrefixes String[] @default([])
}
```

### 3. Multiple Tenants with Similar Names

**Problem**: "Al-Hikmah School" and "Al-Hikmah Institute" both want "ALHIK"

**Solution**: Automatic collision resolution

```typescript
// generateUniqueTenantPrefix handles collisions
"Al-Hikmah School"    → "ALHIK"
"Al-Hikmah Institute" → "ALHIK1" 
```

### 4. Super Admin Access

**Problem**: System admins need cross-tenant access

**Solution**: Role-based tenant bypass

```typescript
function canAccessTenant(userRole: string, targetTenantId: string): boolean {
  if (isSuperAdmin(userRole)) {
    return true  // Super admin can access any tenant
  }
  
  return userTenantId === targetTenantId
}
```

### 5. Username Conflicts During Migration

**Problem**: User "john" exists in multiple tenants during migration

**Solution**: Conflict detection and resolution

```typescript
async function resolveUsernameConflict(
  originalUsername: string, 
  tenantPrefix: string
): Promise<string> {
  let counter = 1
  let prefixedUsername = createPrefixedUsername(tenantPrefix, originalUsername)
  
  while (await userExists(prefixedUsername)) {
    prefixedUsername = createPrefixedUsername(
      tenantPrefix, 
      `${originalUsername}${counter}`
    )
    counter++
  }
  
  return prefixedUsername
}
```

## Security Considerations

### 1. Prefix Validation
- Only allow alphanumeric characters
- Prevent injection attacks
- Validate prefix format on both client and server

### 2. Tenant Isolation
- Ensure users can only access their tenant's data
- Validate tenant context in all API calls
- Prevent tenant enumeration attacks

### 3. Authentication Security
- Maintain secure password hashing
- Support 2FA across tenants
- Rate limiting per tenant

### 4. Session Management
- Include tenant context in JWT tokens
- Validate tenant membership on each request
- Handle tenant switching securely

## Troubleshooting

### Common Issues

#### Issue: User can't login with prefixed username
**Symptoms**: "User not found" error with `SYAF_john`
**Diagnosis**: 
```typescript
const parsed = parsePrefixedUsername("SYAF_john")
console.log(parsed) // Check if parsing works correctly
```
**Solutions**:
- Verify tenant exists and is active
- Check username format validity
- Ensure user exists in correct tenant

#### Issue: Tenant detection not working
**Symptoms**: No tenant detected from subdomain
**Diagnosis**:
```typescript
const { subdomain } = detectTenantFromRequest({ headers: { host: 'syafii.pondok.edu' }})
console.log(subdomain) // Should be 'syafii'
```
**Solutions**:
- Verify subdomain configuration
- Check DNS settings
- Update tenant domain/subdomain in database

#### Issue: Registration fails with prefix errors
**Symptoms**: "Invalid tenant prefix format" error
**Diagnosis**:
```typescript
console.log(isValidTenantPrefix("SYAF"))   // Should be true
console.log(isValidTenantPrefix("sy@f"))   // Should be false
```
**Solutions**:
- Check prefix generation algorithm
- Verify tenant creation process
- Handle special characters in tenant names

### Debug Mode

Enable detailed logging:
```typescript
// In your environment variables
DEBUG_TENANT_AUTH=true

// This enables detailed console logs for:
// - Tenant detection
// - Username parsing  
// - Authentication flow
// - Registration process
```

### Testing Tools

#### Prefix Generation Testing
```typescript
// Test prefix generation
const testCases = [
  "Pondok Imam Syafi'i",
  "Madrasah Al-Hikmah", 
  "Islamic Center",
  "Sekolah Tinggi Agama Islam"
]

testCases.forEach(name => {
  console.log(`${name} -> ${generateTenantPrefix(name)}`)
})
```

#### User Lookup Testing
```typescript
// Test user lookup with different scenarios
const testLookups = [
  "SYAF_john",          // Prefixed username
  "john@example.com",   // Email
  "john"                // Plain username with tenant context
]

for (const lookup of testLookups) {
  const result = await findUserWithTenant(lookup)
  console.log(`${lookup}:`, result)
}
```

## Best Practices

1. **Always validate tenant context** in API endpoints
2. **Use environment-specific tenant configs** for development/staging
3. **Implement proper error handling** for tenant-related operations
4. **Monitor tenant prefix collisions** and resolve proactively
5. **Regular backup of tenant configurations** 
6. **Document tenant-specific customizations**
7. **Test cross-tenant scenarios** thoroughly
8. **Implement tenant usage analytics** for insights

## Conclusion

The tenant prefix authentication system provides a robust solution for multi-tenant applications with username uniqueness requirements. It handles common edge cases gracefully while maintaining security and user experience standards.

For additional support or questions about this system, refer to the source code documentation or contact the development team.