# 🚀 Transformasi ke SaaS Multi-Tenant

## 📋 Perubahan Database (Multi-Tenancy)

### 1. Tambah Tabel Tenant
```prisma
model Tenant {
  id            String    @id @default(cuid())
  slug          String    @unique // subdomain: pondok-syafii.app.com
  name          String    // Nama Pondok/Yayasan
  logo          String?
  address       String?
  phone         String?
  email         String
  website       String?
  
  // Subscription Info
  plan          PlanType  @default(BASIC)
  status        TenantStatus @default(TRIAL)
  trialEndsAt   DateTime?
  subscribedAt  DateTime?
  validUntil    DateTime?
  
  // Limits based on plan
  maxStudents   Int       @default(100)
  maxTeachers   Int       @default(20)
  maxUsers      Int       @default(10)
  storageLimit  Int       @default(5) // GB
  
  // Settings
  features      Json      // Enabled features
  customDomain  String?   // custom.domain.com
  theme         Json?     // Custom branding
  
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  // Relations
  users         User[]
  students      Student[]
  teachers      Teacher[]
  payments      Payment[]
  // ... all other models
}

enum PlanType {
  TRIAL     // 14 hari gratis
  BASIC     // Rp 500rb/bulan - 100 santri
  STANDARD  // Rp 1jt/bulan - 500 santri  
  PREMIUM   // Rp 2.5jt/bulan - 1000 santri
  ENTERPRISE // Custom pricing - unlimited
}

enum TenantStatus {
  TRIAL
  ACTIVE
  SUSPENDED
  CANCELLED
}
```

### 2. Update Semua Model dengan tenantId
```prisma
model User {
  id        String   @id @default(cuid())
  tenantId  String   // ADD THIS
  tenant    Tenant   @relation(fields: [tenantId], references: [id])
  // ... existing fields
  
  @@index([tenantId])
  @@unique([tenantId, email]) // Email unique per tenant
}

model Student {
  id        String   @id @default(cuid())
  tenantId  String   // ADD THIS
  tenant    Tenant   @relation(fields: [tenantId], references: [id])
  // ... existing fields
  
  @@index([tenantId])
  @@unique([tenantId, nisn]) // NISN unique per tenant
}
```

## 🔐 Tenant Isolation Middleware

### 1. Create Tenant Context
```typescript
// src/lib/tenant-context.ts
import { headers } from 'next/headers'

export async function getCurrentTenant() {
  const headersList = headers()
  const host = headersList.get('host') || ''
  
  // Extract subdomain
  const subdomain = host.split('.')[0]
  
  // Or use custom domain
  const tenant = await prisma.tenant.findFirst({
    where: {
      OR: [
        { slug: subdomain },
        { customDomain: host }
      ]
    }
  })
  
  if (!tenant) throw new Error('Tenant not found')
  return tenant
}

// Prisma middleware untuk auto-filter by tenant
prisma.$use(async (params, next) => {
  if (params.model && params.args) {
    const tenantId = await getTenantIdFromContext()
    
    // Auto add tenantId to queries
    if (params.action === 'findMany' || params.action === 'findFirst') {
      params.args.where = {
        ...params.args.where,
        tenantId
      }
    }
    
    // Auto add tenantId to creates
    if (params.action === 'create') {
      params.args.data.tenantId = tenantId
    }
  }
  
  return next(params)
})
```

## 🎨 Tenant-Specific UI

### 1. Dynamic Subdomain Routing
```typescript
// next.config.js
module.exports = {
  async rewrites() {
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: '(?<tenant>.*)\\.yourdomain\\.com',
          },
        ],
        destination: '/:path*',
      },
    ]
  },
}
```

### 2. Landing Page & Onboarding
```typescript
// src/app/page.tsx - Main landing page
export default function LandingPage() {
  return (
    <div>
      <Hero />
      <Features />
      <Pricing />
      <SignUpForm /> // Tenant registration
    </div>
  )
}

// src/app/onboarding/page.tsx
export default function OnboardingPage() {
  // Step 1: Tenant Info (Nama Pondok, Alamat, dll)
  // Step 2: Choose Plan
  // Step 3: Payment (Midtrans/Xendit integration)
  // Step 4: Setup Admin Account
  // Step 5: Import Initial Data
}
```

## 💳 Subscription & Billing

### 1. Payment Integration
```typescript
// src/lib/payment-gateway.ts
import Midtrans from 'midtrans-client'

export async function createSubscription(tenant: Tenant, plan: PlanType) {
  const snap = new Midtrans.Snap({
    isProduction: false,
    serverKey: process.env.MIDTRANS_SERVER_KEY,
  })
  
  const transaction = {
    transaction_details: {
      order_id: `SUB-${tenant.id}-${Date.now()}`,
      gross_amount: getPlanPrice(plan)
    },
    customer_details: {
      email: tenant.email,
      phone: tenant.phone,
    },
    item_details: [{
      id: plan,
      price: getPlanPrice(plan),
      quantity: 1,
      name: `Subscription ${plan} - ${tenant.name}`
    }]
  }
  
  return await snap.createTransaction(transaction)
}
```

### 2. Usage Monitoring
```typescript
// src/lib/usage-monitor.ts
export async function checkTenantLimits(tenantId: string) {
  const tenant = await prisma.tenant.findUnique({
    where: { id: tenantId },
    include: {
      _count: {
        select: {
          students: true,
          teachers: true,
          users: true
        }
      }
    }
  })
  
  return {
    students: {
      used: tenant._count.students,
      limit: tenant.maxStudents,
      percentage: (tenant._count.students / tenant.maxStudents) * 100
    },
    // ... other resources
  }
}
```

## 🛡️ Security & Performance

### 1. Row-Level Security
```sql
-- PostgreSQL RLS
ALTER TABLE students ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation ON students
  FOR ALL
  USING (tenant_id = current_setting('app.current_tenant_id')::uuid);
```

### 2. API Rate Limiting
```typescript
// src/middleware.ts
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(100, '1 m'), // 100 req/min
})

export async function middleware(request: NextRequest) {
  const tenant = await getCurrentTenant(request)
  const { success } = await ratelimit.limit(`tenant:${tenant.id}`)
  
  if (!success) {
    return new Response('Rate limit exceeded', { status: 429 })
  }
}
```

## 📊 Admin Dashboard (Super Admin)

### 1. Tenant Management
```typescript
// src/app/super-admin/tenants/page.tsx
- List all tenants
- Monitor usage & billing
- Suspend/activate tenants
- View tenant analytics
- Handle support tickets
```

### 2. Analytics Dashboard
```typescript
// Key metrics:
- Total tenants
- MRR (Monthly Recurring Revenue)
- Churn rate
- Feature usage statistics
- Storage usage per tenant
```

## 🚀 Deployment Architecture

### 1. Infrastructure
```yaml
# docker-compose.yml
services:
  app:
    image: your-saas-app
    scale: 3 # Multiple instances
    
  postgres:
    image: postgres:15
    volumes:
      - postgres_data:/var/lib/postgresql/data
    
  redis:
    image: redis:7
    # For caching & rate limiting
    
  minio:
    image: minio/minio
    # For file storage (tenant isolation)
```

### 2. Domain Setup
```
Main Domain: pondokdigital.id
Tenant Access:
- pondok-syafii.pondokdigital.id
- yayasan-abc.pondokdigital.id
- Custom: sistempondok.syafii.ac.id
```

## 📝 Migration Steps

### Phase 1: Database Migration
1. Backup existing data
2. Add tenant table
3. Add tenantId to all tables
4. Migrate existing data to default tenant

### Phase 2: Application Updates
1. Implement tenant middleware
2. Update all API endpoints
3. Add tenant context to UI
4. Implement subdomain routing

### Phase 3: Billing Integration
1. Setup payment gateway
2. Implement subscription logic
3. Add usage monitoring
4. Create billing dashboard

### Phase 4: Launch
1. Setup infrastructure
2. Configure domains
3. Migrate existing users
4. Launch marketing site

## 💰 Pricing Strategy

### Recommended Plans:
```
TRIAL (14 hari)
- Semua fitur
- Max 50 santri
- 1 GB storage

BASIC (Rp 500rb/bulan)
- 100 santri
- 20 ustadz
- 5 GB storage
- Email support

STANDARD (Rp 1jt/bulan)
- 500 santri
- 50 ustadz
- 20 GB storage
- Priority support
- Custom reports

PREMIUM (Rp 2.5jt/bulan)
- 1000 santri
- Unlimited ustadz
- 50 GB storage
- Phone support
- API access
- Custom domain

ENTERPRISE (Custom)
- Unlimited everything
- Dedicated support
- SLA guarantee
- On-premise option
```

## 🎯 Key Features to Add

1. **Tenant Onboarding Wizard**
2. **Multi-language Support**
3. **White-label Options**
4. **API for Third-party Integration**
5. **Mobile Apps (React Native)**
6. **Advanced Analytics**
7. **Automated Backups**
8. **Audit Logs**
9. **Two-Factor Authentication**
10. **SSO (Single Sign-On)**

## 📈 Success Metrics

- Customer Acquisition Cost (CAC)
- Lifetime Value (LTV)
- Monthly Recurring Revenue (MRR)
- Churn Rate
- Net Promoter Score (NPS)
- Feature Adoption Rate

## 🔄 Continuous Improvement

1. A/B Testing for pricing
2. Feature flag system
3. Customer feedback loop
4. Performance monitoring
5. Security audits
6. Scalability testing