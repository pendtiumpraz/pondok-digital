# 🚀 SaaS dengan Next.js (Tanpa Docker)

## ✅ **BISA! Malah Lebih Simple & Murah**

## 🎯 Deployment Options (Tanpa Docker)

### 1. **Vercel (RECOMMENDED)**
```bash
# Deploy command
vercel --prod

# Environment variables
NEXT_PUBLIC_APP_URL=https://sistempondok.id
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=...
```

**Kelebihan:**
- Auto-scaling
- Serverless (bayar per usage)
- Edge Functions
- Preview deployments
- Wildcard domains support untuk multi-tenant

**Setup Multi-Tenant di Vercel:**
```javascript
// vercel.json
{
  "rewrites": [
    {
      "source": "/:path*",
      "has": [
        {
          "type": "host",
          "value": "(?<tenant>.*)\\.sistempondok\\.id"
        }
      ],
      "destination": "/api/tenant/:tenant/:path*"
    }
  ]
}
```

### 2. **Railway.app**
```yaml
# railway.toml
[build]
builder = "nixpacks"

[deploy]
startCommand = "npm run start"
healthcheckPath = "/api/health"
```

**Kelebihan:**
- Built-in PostgreSQL
- Auto SSL
- Easy scaling
- Murah untuk startup

### 3. **Render.com**
```yaml
# render.yaml
services:
  - type: web
    name: pondok-saas
    env: node
    buildCommand: npm run build
    startCommand: npm run start
    envVars:
      - key: DATABASE_URL
        fromDatabase:
          name: pondok-db
          property: connectionString

databases:
  - name: pondok-db
    plan: starter
```

### 4. **Netlify + Supabase**
```javascript
// netlify.toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"

[[redirects]]
  from = "https://:tenant.sistempondok.id/*"
  to = "https://sistempondok.id/:splat"
  status = 200
```

## 📦 Database Options (Cloud-Based)

### 1. **Supabase (PostgreSQL)**
```javascript
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
)

// Row Level Security untuk multi-tenant
const { data, error } = await supabase
  .from('students')
  .select('*')
  .eq('tenant_id', tenantId)
```

### 2. **PlanetScale (MySQL)**
```javascript
// Serverless compatible
import { connect } from '@planetscale/database'

const conn = connect({
  url: process.env.DATABASE_URL
})

const results = await conn.execute(
  'SELECT * FROM students WHERE tenant_id = ?',
  [tenantId]
)
```

### 3. **Neon (PostgreSQL)**
```javascript
// Edge-compatible PostgreSQL
import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL)
const students = await sql`
  SELECT * FROM students 
  WHERE tenant_id = ${tenantId}
`
```

## 🔧 Next.js Multi-Tenant Setup

### 1. **Middleware untuk Tenant Detection**
```typescript
// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || ''
  
  // Extract tenant from subdomain
  const subdomain = hostname.split('.')[0]
  
  // Skip for main domain
  if (subdomain === 'www' || subdomain === 'sistempondok') {
    return NextResponse.next()
  }
  
  // Check if tenant exists
  const tenant = await getTenantBySlug(subdomain)
  
  if (!tenant) {
    return NextResponse.redirect(new URL('/404', request.url))
  }
  
  // Add tenant to headers
  const response = NextResponse.next()
  response.headers.set('x-tenant-id', tenant.id)
  response.headers.set('x-tenant-slug', tenant.slug)
  
  return response
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
```

### 2. **Server Components dengan Tenant Context**
```typescript
// app/layout.tsx
import { headers } from 'next/headers'

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const headersList = headers()
  const tenantId = headersList.get('x-tenant-id')
  
  const tenant = await prisma.tenant.findUnique({
    where: { id: tenantId }
  })
  
  return (
    <html>
      <body>
        <TenantProvider tenant={tenant}>
          {children}
        </TenantProvider>
      </body>
    </html>
  )
}
```

### 3. **API Routes dengan Tenant Isolation**
```typescript
// app/api/students/route.ts
import { headers } from 'next/headers'

export async function GET() {
  const headersList = headers()
  const tenantId = headersList.get('x-tenant-id')
  
  if (!tenantId) {
    return NextResponse.json({ error: 'Tenant not found' }, { status: 404 })
  }
  
  const students = await prisma.student.findMany({
    where: { tenantId }
  })
  
  return NextResponse.json(students)
}
```

## 💰 Payment Integration (Serverless)

### 1. **Midtrans Webhook**
```typescript
// app/api/webhooks/midtrans/route.ts
export async function POST(request: Request) {
  const body = await request.json()
  const signature = request.headers.get('x-signature')
  
  // Verify webhook signature
  if (!verifyMidtransSignature(body, signature)) {
    return new Response('Invalid signature', { status: 401 })
  }
  
  // Update tenant subscription
  if (body.transaction_status === 'settlement') {
    await prisma.tenant.update({
      where: { id: body.custom_field1 }, // tenantId
      data: {
        status: 'ACTIVE',
        subscribedAt: new Date(),
        validUntil: addMonths(new Date(), 1)
      }
    })
  }
  
  return new Response('OK')
}
```

## 🌐 CDN & Static Assets

### 1. **Cloudflare R2 untuk File Storage**
```typescript
// lib/storage.ts
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'

const R2 = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
})

export async function uploadFile(
  file: File, 
  tenantId: string
) {
  const key = `${tenantId}/${Date.now()}-${file.name}`
  
  await R2.send(new PutObjectCommand({
    Bucket: 'pondok-files',
    Key: key,
    Body: Buffer.from(await file.arrayBuffer()),
  }))
  
  return `https://cdn.sistempondok.id/${key}`
}
```

## 📊 Analytics & Monitoring

### 1. **Vercel Analytics**
```typescript
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout() {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

### 2. **Sentry untuk Error Tracking**
```typescript
// sentry.client.config.ts
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  beforeSend(event) {
    // Add tenant context
    event.tags = {
      ...event.tags,
      tenant: getCurrentTenant(),
    }
    return event
  },
})
```

## 🚀 Scaling Strategy

### 1. **Database Connection Pooling**
```typescript
// lib/prisma.ts
import { PrismaClient } from '@prisma/client'
import { PrismaPlanetScale } from '@prisma/adapter-planetscale'
import { connect } from '@planetscale/database'

const connection = connect({ url: process.env.DATABASE_URL })
const adapter = new PrismaPlanetScale(connection)

const globalForPrisma = global as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? 
  new PrismaClient({ adapter })

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
```

### 2. **Edge Caching**
```typescript
// Use ISR for tenant-specific pages
export const revalidate = 3600 // 1 hour

export async function generateStaticParams() {
  const tenants = await prisma.tenant.findMany({
    where: { status: 'ACTIVE' }
  })
  
  return tenants.map((tenant) => ({
    tenant: tenant.slug,
  }))
}
```

## 💸 Cost Comparison

### Traditional VPS + Docker:
- VPS: Rp 500rb-2jt/bulan
- Database: Rp 300rb-1jt/bulan
- Backup: Rp 200rb/bulan
- SSL: Rp 500rb/tahun
- **Total: ~Rp 1-3jt/bulan**

### Serverless (Vercel + Supabase):
- Vercel Pro: $20/bulan (~Rp 300rb)
- Supabase: $25/bulan (~Rp 400rb)
- R2 Storage: $0.015/GB (~Rp 2rb/GB)
- **Total: ~Rp 700rb/bulan**
- **BONUS: Auto-scaling, no DevOps needed!**

## ✅ Advantages tanpa Docker:

1. **Zero DevOps** - Tidak perlu manage server
2. **Auto Scaling** - Handle traffic spike otomatis
3. **Global CDN** - Fast loading worldwide
4. **Serverless** - Bayar hanya yang dipakai
5. **Preview Deployments** - Test setiap PR
6. **Edge Functions** - Run code dekat user
7. **Built-in Analytics** - Monitor usage
8. **Automatic SSL** - Security by default

## 🎯 Quick Start Commands:

```bash
# 1. Setup project
npx create-next-app@latest pondok-saas --typescript --tailwind --app

# 2. Install dependencies
npm install @prisma/client prisma @supabase/supabase-js
npm install @vercel/analytics sentry

# 3. Setup Prisma
npx prisma init
npx prisma generate
npx prisma db push

# 4. Deploy to Vercel
vercel --prod

# 5. Add custom domain
vercel domains add "*.sistempondok.id"
```

## 🔑 Environment Variables:
```env
# .env.production
DATABASE_URL="postgresql://..."
NEXTAUTH_URL="https://sistempondok.id"
NEXTAUTH_SECRET="..."

# Supabase
NEXT_PUBLIC_SUPABASE_URL="..."
SUPABASE_SERVICE_KEY="..."

# Payment
MIDTRANS_SERVER_KEY="..."
MIDTRANS_CLIENT_KEY="..."

# Storage
R2_ENDPOINT="..."
R2_ACCESS_KEY_ID="..."
R2_SECRET_ACCESS_KEY="..."
```

**KESIMPULAN: Next.js PERFECT untuk SaaS! Lebih simple, murah, dan scalable tanpa Docker!** 🚀