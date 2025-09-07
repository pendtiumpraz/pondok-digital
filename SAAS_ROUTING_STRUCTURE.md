# SAAS Routing Structure - Pondok Digital

## 🏢 Platform SAAS Routes (Root Level)
```
/                           # SAAS landing page
/pricing                    # Pricing plans
/auth/admin-signin          # Admin & Super Admin login
/auth/register-yayasan      # Register new yayasan
/super-admin/*              # Super admin dashboard (manage all yayasan)
/docs/*                     # Platform documentation
```

## 🕌 Yayasan/Tenant Routes
All yayasan-specific routes are under `/yayasan/[slug]/`

### Public Pages (No Login Required)
```
/yayasan/[slug]/                    # Yayasan homepage
/yayasan/[slug]/about               # About pages
/yayasan/[slug]/about/yayasan       # About yayasan
/yayasan/[slug]/about/pondok        # About pondok
/yayasan/[slug]/about/tk            # About TK
/yayasan/[slug]/about/sd            # About SD
/yayasan/[slug]/about/pengajar      # Teachers
/yayasan/[slug]/about/struktur      # Organization structure

/yayasan/[slug]/ppdb                # PPDB Online registration
/yayasan/[slug]/ppdb/register       # Registration form
/yayasan/[slug]/ppdb/status         # Check registration status

/yayasan/[slug]/donasi              # Donation page
/yayasan/[slug]/donasi/campaign/*   # Donation campaigns
/yayasan/[slug]/donasi/ota          # OTA program

/yayasan/[slug]/gallery             # Photo gallery
/yayasan/[slug]/kajian              # Video kajian
/yayasan/[slug]/library             # Digital library
/yayasan/[slug]/kegiatan            # Activities/events
/yayasan/[slug]/tanya-ustadz        # Q&A with ustadz
```

### Authentication
```
/yayasan/[slug]/auth/signin         # User login (teacher, student, parent)
/yayasan/[slug]/auth/signout        # Logout
/yayasan/[slug]/auth/forgot         # Forgot password
```

### Authenticated Pages (Login Required)
All authenticated pages are under `(authenticated)` route group:

```
/yayasan/[slug]/(authenticated)/dashboard      # User dashboard
/yayasan/[slug]/(authenticated)/siswa          # Student management
/yayasan/[slug]/(authenticated)/akademik       # Academic management
/yayasan/[slug]/(authenticated)/hafalan        # Hafalan tracking
/yayasan/[slug]/(authenticated)/keuangan       # Finance management
/yayasan/[slug]/(authenticated)/spp            # SPP billing
/yayasan/[slug]/(authenticated)/alumni         # Alumni management
/yayasan/[slug]/(authenticated)/pengajar       # Teacher management
/yayasan/[slug]/(authenticated)/settings       # User settings
/yayasan/[slug]/(authenticated)/kegiatan       # Activity management
/yayasan/[slug]/(authenticated)/ppdb-admin     # PPDB administration
/yayasan/[slug]/(authenticated)/donasi-admin   # Donation administration
/yayasan/[slug]/(authenticated)/ota-admin      # OTA administration
```

## 🔐 Access Control

### Super Admin
- Can access `/super-admin/*`
- Can manage all yayasan
- Can access any yayasan dashboard

### Yayasan Admin
- Can access `/yayasan/[their-slug]/(authenticated)/*`
- Full control over their yayasan
- Cannot access other yayasan data

### Teacher (Guru)
- Can access limited `/yayasan/[their-slug]/(authenticated)/*` pages
- Can manage students, grades, attendance
- View-only for finance

### Student (Siswa)
- Can access `/yayasan/[their-slug]/(authenticated)/dashboard`
- View their grades, attendance, bills
- Access learning materials

### Parent (Orang Tua)
- Can access `/yayasan/[their-slug]/(authenticated)/dashboard`
- View children's progress
- Pay bills online

## 📁 File Structure
```
src/app/
├── page.tsx                          # SAAS landing
├── pricing/
├── auth/
│   ├── admin-signin/
│   └── register-yayasan/
├── super-admin/
│   └── (dashboard pages)
└── yayasan/
    └── [slug]/
        ├── page.tsx                  # Yayasan homepage
        ├── layout.tsx                # Yayasan layout with header/footer
        ├── about/
        ├── ppdb/
        ├── donasi/
        ├── gallery/
        ├── kajian/
        ├── library/
        ├── kegiatan/
        ├── tanya-ustadz/
        ├── auth/
        │   └── signin/
        └── (authenticated)/
            ├── layout.tsx            # Auth check & sidebar
            ├── dashboard/
            ├── siswa/
            ├── akademik/
            ├── hafalan/
            ├── keuangan/
            ├── spp/
            └── settings/
```

## 🎯 Key Points

1. **Clear Separation**: Platform routes vs Yayasan routes
2. **Multi-tenant**: Each yayasan has isolated data and routes
3. **Role-based Access**: Different access levels for different user types
4. **Public vs Private**: Clear distinction between public and authenticated pages
5. **Scalable**: Easy to add new yayasan without affecting others

## 🚀 Migration Notes

When migrating from non-SAAS to SAAS:
1. Move all public pages under `/yayasan/[slug]/`
2. Move all authenticated pages under `/yayasan/[slug]/(authenticated)/`
3. Update all links and navigation
4. Add tenant context to all API calls
5. Implement tenant isolation in database queries