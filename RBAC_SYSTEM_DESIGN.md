# 🔐 Role-Based Access Control (RBAC) System untuk SaaS Pondok Pesantren

## 📊 Role Hierarchy

```
SUPER_ADMIN (Platform Owner)
    ↓
TENANT_OWNER (Pemilik Yayasan)
    ↓
ADMIN_YAYASAN (Admin Yayasan)
    ↓
KEPALA_PONDOK (Kepala Pondok)
    ↓
BENDAHARA (Bendahara/Keuangan)
    ↓
ADMIN_AKADEMIK (Admin Akademik)
    ↓
USTADZ (Pengajar)
    ↓
STAFF (Staff Umum)
    ↓
WALI_SANTRI (Orang Tua)
    ↓
SANTRI (Siswa)
```

## 🎭 Detailed Roles & Permissions

### 1. **SUPER_ADMIN** (Platform Owner)
**Access:** EVERYTHING + Cross-tenant operations
```javascript
permissions: [
  // Platform Management
  'platform.manage',
  'tenants.create',
  'tenants.read',
  'tenants.update', 
  'tenants.delete',
  'tenants.suspend',
  'billing.manage',
  'subscriptions.manage',
  
  // System
  'system.settings',
  'system.monitoring',
  'system.logs',
  'system.backup',
  
  // Support
  'support.tickets.manage',
  'support.announcements.create'
]
```

### 2. **TENANT_OWNER** (Pemilik Yayasan)
**Access:** Full control within their tenant
```javascript
permissions: [
  // Organization
  'organization.settings',
  'organization.billing',
  'organization.subscription',
  
  // User Management
  'users.create',
  'users.read',
  'users.update',
  'users.delete',
  'roles.assign',
  
  // All modules
  'students.*',
  'teachers.*',
  'finance.*',
  'academic.*',
  'facilities.*',
  'reports.*'
]
```

### 3. **ADMIN_YAYASAN** (Admin Yayasan)
**Access:** Operational management
```javascript
permissions: [
  // User Management
  'users.create',
  'users.read',
  'users.update',
  'roles.assign', // Limited roles
  
  // Core Operations
  'students.*',
  'teachers.*',
  'academic.*',
  'facilities.*',
  'announcements.*',
  'events.*',
  
  // Reports
  'reports.read',
  'reports.export'
]
```

### 4. **KEPALA_PONDOK** (Principal)
**Access:** Academic & strategic oversight
```javascript
permissions: [
  // Overview
  'dashboard.executive',
  
  // Academic
  'academic.curriculum',
  'academic.schedule.approve',
  'teachers.evaluate',
  'students.discipline',
  
  // Reports
  'reports.academic',
  'reports.discipline',
  'reports.performance',
  
  // Approvals
  'leave.approve',
  'events.approve',
  'budget.approve'
]
```

### 5. **BENDAHARA** (Treasurer)
**Access:** Financial management
```javascript
permissions: [
  // Finance
  'finance.transactions.create',
  'finance.transactions.read',
  'finance.transactions.update',
  'finance.reports',
  'finance.budget',
  
  // Billing
  'billing.spp.manage',
  'billing.invoices.create',
  'billing.payments.record',
  'billing.reminders.send',
  
  // Payroll
  'payroll.manage',
  'payroll.reports',
  
  // Reports
  'reports.financial',
  'reports.cashflow',
  'reports.outstanding'
]
```

### 6. **ADMIN_AKADEMIK** (Academic Admin)
**Access:** Academic administration
```javascript
permissions: [
  // Academic
  'academic.schedule.manage',
  'academic.curriculum.read',
  'academic.exams.manage',
  'academic.grades.manage',
  
  // Students
  'students.attendance',
  'students.grades.input',
  'students.reports.generate',
  
  // Classes
  'classes.manage',
  'classes.assign_students',
  'classes.assign_teachers'
]
```

### 7. **USTADZ** (Teacher)
**Access:** Teaching-related features
```javascript
permissions: [
  // Teaching
  'classes.view_assigned',
  'students.view_assigned',
  'attendance.mark',
  'grades.input_own',
  'assignments.create',
  'assignments.grade',
  
  // Communication
  'announcements.class',
  'messages.parents',
  
  // Discipline
  'discipline.report',
  'discipline.view_own'
]
```

### 8. **STAFF** (General Staff)
**Access:** Limited operational tasks
```javascript
permissions: [
  // Basic Operations
  'attendance.view',
  'announcements.read',
  'events.read',
  'facilities.request',
  
  // Data Entry
  'data.entry', // Specific to assigned modules
  'documents.upload'
]
```

### 9. **WALI_SANTRI** (Parents)
**Access:** Child-specific information
```javascript
permissions: [
  // Child Info
  'children.view',
  'children.attendance',
  'children.grades',
  'children.payment_history',
  'children.discipline_records',
  
  // Communication
  'messages.teachers',
  'announcements.read',
  
  // Payments
  'payments.view_own',
  'payments.make',
  'invoices.view_own'
]
```

### 10. **SANTRI** (Student)
**Access:** Personal academic info
```javascript
permissions: [
  // Personal
  'profile.view_own',
  'grades.view_own',
  'attendance.view_own',
  'schedule.view_own',
  
  // Academic
  'assignments.view',
  'assignments.submit',
  'materials.download',
  
  // Communication
  'announcements.read',
  'messages.teachers' // Limited
]
```

## 💾 Database Schema

```prisma
// Role Management
model Role {
  id            String   @id @default(cuid())
  tenantId      String
  tenant        Tenant   @relation(fields: [tenantId], references: [id])
  
  name          String   // Display name
  code          String   // ADMIN_YAYASAN, USTADZ, etc
  description   String?
  level         Int      // Hierarchy level (1-10)
  isSystem      Boolean  @default(false) // Can't be deleted
  isActive      Boolean  @default(true)
  
  permissions   RolePermission[]
  users         User[]
  
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  @@unique([tenantId, code])
  @@index([tenantId])
}

model Permission {
  id            String   @id @default(cuid())
  
  module        String   // students, finance, academic
  action        String   // create, read, update, delete
  resource      String   // specific resource
  code          String   // students.create
  description   String?
  
  roles         RolePermission[]
  
  @@unique([code])
  @@index([module])
}

model RolePermission {
  id            String   @id @default(cuid())
  
  roleId        String
  role          Role     @relation(fields: [roleId], references: [id], onDelete: Cascade)
  
  permissionId  String
  permission    Permission @relation(fields: [permissionId], references: [id])
  
  conditions    Json?    // Additional conditions
  
  createdAt     DateTime @default(now())
  
  @@unique([roleId, permissionId])
  @@index([roleId])
  @@index([permissionId])
}

model User {
  id            String   @id @default(cuid())
  tenantId      String
  tenant        Tenant   @relation(fields: [tenantId], references: [id])
  
  email         String
  password      String
  name          String
  phone         String?
  
  roleId        String
  role          Role     @relation(fields: [roleId], references: [id])
  
  // Additional permissions
  customPermissions Permission[]
  
  isActive      Boolean  @default(true)
  isSuspended   Boolean  @default(false)
  
  lastLogin     DateTime?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  @@unique([tenantId, email])
  @@index([tenantId])
  @@index([roleId])
}
```

## 🛠️ Permission Checking Implementation

### 1. **Middleware untuk Permission Check**
```typescript
// middleware/withAuth.ts
import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'

export function withAuth(requiredPermissions: string[]) {
  return async function middleware(req: Request) {
    const session = await getServerSession()
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        role: {
          include: {
            permissions: {
              include: {
                permission: true
              }
            }
          }
        },
        customPermissions: true
      }
    })
    
    const userPermissions = [
      ...user.role.permissions.map(rp => rp.permission.code),
      ...user.customPermissions.map(p => p.code)
    ]
    
    const hasPermission = requiredPermissions.every(
      required => {
        // Check exact match
        if (userPermissions.includes(required)) return true
        
        // Check wildcard (e.g., 'students.*' matches 'students.create')
        const wildcardPermission = required.split('.')[0] + '.*'
        return userPermissions.includes(wildcardPermission)
      }
    )
    
    if (!hasPermission) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    
    return NextResponse.next()
  }
}
```

### 2. **Permission Hook untuk UI**
```typescript
// hooks/usePermissions.ts
export function usePermissions() {
  const { data: session } = useSession()
  
  const hasPermission = (permission: string): boolean => {
    if (!session?.user?.permissions) return false
    
    // Super admin has all permissions
    if (session.user.role === 'SUPER_ADMIN') return true
    
    // Check exact or wildcard match
    return session.user.permissions.some(p => {
      if (p === permission) return true
      if (p.endsWith('*')) {
        return permission.startsWith(p.slice(0, -1))
      }
      return false
    })
  }
  
  const hasAnyPermission = (permissions: string[]): boolean => {
    return permissions.some(p => hasPermission(p))
  }
  
  const hasAllPermissions = (permissions: string[]): boolean => {
    return permissions.every(p => hasPermission(p))
  }
  
  return { hasPermission, hasAnyPermission, hasAllPermissions }
}
```

### 3. **Protected Components**
```typescript
// components/ProtectedComponent.tsx
export function ProtectedComponent({ 
  permissions, 
  children,
  fallback = null 
}: {
  permissions: string[]
  children: React.ReactNode
  fallback?: React.ReactNode
}) {
  const { hasAllPermissions } = usePermissions()
  
  if (!hasAllPermissions(permissions)) {
    return fallback || null
  }
  
  return <>{children}</>
}

// Usage
<ProtectedComponent permissions={['finance.transactions.create']}>
  <Button>Create Transaction</Button>
</ProtectedComponent>
```

## 🎨 Role Management CRUD UI

### 1. **Super Admin - Role Management Page**
```typescript
// app/super-admin/roles/page.tsx
export default async function RolesManagement() {
  const roles = await prisma.role.findMany({
    include: {
      _count: {
        select: { users: true }
      },
      permissions: {
        include: {
          permission: true
        }
      }
    }
  })
  
  return (
    <div className="p-6">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Role Management</h1>
        <CreateRoleDialog />
      </div>
      
      <div className="grid gap-4">
        {roles.map(role => (
          <Card key={role.id}>
            <CardHeader>
              <div className="flex justify-between">
                <div>
                  <h3 className="font-semibold">{role.name}</h3>
                  <p className="text-sm text-gray-500">
                    {role._count.users} users
                  </p>
                </div>
                <div className="flex gap-2">
                  <EditRoleDialog role={role} />
                  {!role.isSystem && (
                    <DeleteRoleButton roleId={role.id} />
                  )}
                </div>
              </div>
            </CardHeader>
            <CardBody>
              <div className="flex flex-wrap gap-2">
                {role.permissions.map(rp => (
                  <Badge key={rp.id}>
                    {rp.permission.code}
                  </Badge>
                ))}
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  )
}
```

### 2. **Permission Matrix UI**
```typescript
// components/PermissionMatrix.tsx
export function PermissionMatrix({ roleId }: { roleId: string }) {
  const modules = [
    { name: 'Students', code: 'students' },
    { name: 'Teachers', code: 'teachers' },
    { name: 'Finance', code: 'finance' },
    { name: 'Academic', code: 'academic' }
  ]
  
  const actions = ['create', 'read', 'update', 'delete']
  
  return (
    <table className="w-full">
      <thead>
        <tr>
          <th>Module</th>
          {actions.map(action => (
            <th key={action}>{action}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {modules.map(module => (
          <tr key={module.code}>
            <td>{module.name}</td>
            {actions.map(action => (
              <td key={action}>
                <Checkbox
                  name={`${module.code}.${action}`}
                  onChange={(e) => togglePermission(
                    roleId,
                    `${module.code}.${action}`,
                    e.target.checked
                  )}
                />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
```

## 🔄 Dynamic Menu Based on Permissions

```typescript
// components/Sidebar.tsx
const menuItems = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: Home,
    permission: 'dashboard.view'
  },
  {
    title: 'Santri',
    href: '/students',
    icon: Users,
    permission: 'students.read',
    subItems: [
      {
        title: 'Daftar Santri',
        href: '/students',
        permission: 'students.read'
      },
      {
        title: 'Tambah Santri',
        href: '/students/new',
        permission: 'students.create'
      },
      {
        title: 'Absensi',
        href: '/students/attendance',
        permission: 'attendance.manage'
      }
    ]
  },
  {
    title: 'Keuangan',
    href: '/finance',
    icon: DollarSign,
    permission: 'finance.read',
    subItems: [
      {
        title: 'Transaksi',
        href: '/finance/transactions',
        permission: 'finance.transactions.read'
      },
      {
        title: 'SPP',
        href: '/finance/spp',
        permission: 'billing.spp.manage'
      },
      {
        title: 'Laporan',
        href: '/finance/reports',
        permission: 'reports.financial'
      }
    ]
  }
]

export function Sidebar() {
  const { hasPermission } = usePermissions()
  
  const visibleMenuItems = menuItems.filter(item => 
    hasPermission(item.permission)
  )
  
  return (
    <nav>
      {visibleMenuItems.map(item => (
        <div key={item.href}>
          <Link href={item.href}>
            <item.icon />
            {item.title}
          </Link>
          
          {item.subItems && (
            <div className="ml-4">
              {item.subItems
                .filter(sub => hasPermission(sub.permission))
                .map(sub => (
                  <Link key={sub.href} href={sub.href}>
                    {sub.title}
                  </Link>
                ))}
            </div>
          )}
        </div>
      ))}
    </nav>
  )
}
```

## 🚀 API Routes with Permission Check

```typescript
// app/api/students/route.ts
import { withAuth } from '@/middleware/withAuth'

export const GET = withAuth(['students.read'])(
  async function handler(req: Request) {
    const students = await prisma.student.findMany()
    return NextResponse.json(students)
  }
)

export const POST = withAuth(['students.create'])(
  async function handler(req: Request) {
    const data = await req.json()
    const student = await prisma.student.create({ data })
    return NextResponse.json(student)
  }
)
```

## 📊 Permission Analytics Dashboard

```typescript
// app/super-admin/permissions/analytics/page.tsx
export default async function PermissionAnalytics() {
  const stats = await prisma.$queryRaw`
    SELECT 
      r.name as role_name,
      COUNT(DISTINCT u.id) as user_count,
      COUNT(DISTINCT rp.permission_id) as permission_count
    FROM roles r
    LEFT JOIN users u ON u.role_id = r.id
    LEFT JOIN role_permissions rp ON rp.role_id = r.id
    GROUP BY r.id, r.name
  `
  
  return (
    <div className="grid grid-cols-3 gap-6">
      <Card>
        <CardHeader>
          <h3>Most Used Permissions</h3>
        </CardHeader>
        <CardBody>
          <PermissionUsageChart />
        </CardBody>
      </Card>
      
      <Card>
        <CardHeader>
          <h3>Role Distribution</h3>
        </CardHeader>
        <CardBody>
          <RoleDistributionPie data={stats} />
        </CardBody>
      </Card>
      
      <Card>
        <CardHeader>
          <h3>Permission Conflicts</h3>
        </CardHeader>
        <CardBody>
          <ConflictDetector />
        </CardBody>
      </Card>
    </div>
  )
}
```

## 🔐 Security Best Practices

1. **Principle of Least Privilege** - Give minimum required permissions
2. **Regular Audits** - Log all permission changes
3. **Two-Factor Authentication** - For admin roles
4. **Session Management** - Auto-logout for sensitive roles
5. **IP Restrictions** - For super admin access
6. **Activity Monitoring** - Track permission usage

**This RBAC system ensures secure, scalable multi-tenant access control for your SaaS platform!** 🚀