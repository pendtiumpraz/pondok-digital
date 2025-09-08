# Database Users Documentation

## Cara Mengecek User di Database Prisma

### 1. Menggunakan Prisma Studio (Recommended)
```bash
npx prisma studio
```
- Buka browser ke `http://localhost:5555`
- Klik tabel `users` untuk melihat semua user
- Dapat melihat, edit, dan hapus data dengan GUI

### 2. Menggunakan Prisma Console
```bash
# Masuk ke Prisma console
npx prisma db seed

# Atau buat script untuk query
node -e "
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function getUsers() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      username: true,
      email: true,
      name: true,
      role: true,
      isActive: true,
      createdAt: true
    }
  });
  console.log('All Users:', JSON.stringify(users, null, 2));
  await prisma.$disconnect();
}
getUsers();
"
```

### 3. Menggunakan API Route untuk Cek User
Buka browser atau gunakan curl:
```bash
# Untuk melihat semua user (jika ada API endpoint)
curl -X GET "https://your-domain.com/api/users"

# Atau buat API endpoint khusus untuk development
```

## Default Users yang Dibuat Sistem

### 1. Super Admin User
- **Username**: `superadmin`
- **Email**: `superadmin@pondokdigital.id`
- **Password**: `superadmin2024`
- **Role**: `SUPER_ADMIN`
- **Status**: Active
- **Dibuat oleh**: `/api/auth/init` route
- **Akses**: Full system access, semua tenant/yayasan

### 2. Admin User
- **Username**: `admin`
- **Email**: `admin@ponpesimamsyafii.id`
- **Password**: `admin123`
- **Role**: `ADMIN`
- **Status**: Active
- **Dibuat oleh**: `/api/auth/init` route
- **Akses**: Full access untuk tenant/yayasan tertentu

### 3. Staff User
- **Username**: `staff`
- **Email**: `staff@ponpesimamsyafii.id`
- **Password**: `staff123`
- **Role**: `STAFF`
- **Status**: Active
- **Dibuat oleh**: `/api/auth/init` route
- **Akses**: Operasional terbatas

## Cara Membuat User Default

### Menggunakan API Init
```bash
# Panggil API init dengan secret
curl "https://your-domain.com/api/auth/init?secret=init-secret-2024"
```

### Response yang diharapkan:
```json
{
  "success": true,
  "message": "Users created/updated successfully",
  "users": [
    {
      "username": "superadmin",
      "email": "superadmin@pondokdigital.id",
      "role": "SUPER_ADMIN",
      "password": "superadmin2024"
    },
    {
      "username": "admin",
      "email": "admin@ponpesimamsyafii.id",
      "role": "ADMIN",
      "password": "admin123"
    },
    {
      "username": "staff",
      "email": "staff@ponpesimamsyafii.id", 
      "role": "STAFF",
      "password": "staff123"
    }
  ]
}
```

## User Schema (Model Prisma)

```prisma
model User {
  id                        String                 @id @default(cuid())
  username                  String                 @unique
  email                     String                 @unique
  password                  String                 // Hashed dengan bcryptjs
  name                      String
  role                      String                 @default("STAFF")
  isUstadz                  Boolean                @default(false)
  isActive                  Boolean                @default(true)
  createdAt                 DateTime               @default(now())
  updatedAt                 DateTime               @updatedAt
  twoFactorEnabled          Boolean                @default(false)
  twoFactorSecret           String?
  backupCodes               String[]               @default([])
  phoneVerified             Boolean                @default(false)
  tenantId                  String?
  
  // Relations dengan tabel lain...
  tenant                    Tenant?                @relation(fields: [tenantId], references: [id])
}
```

## Roles yang Tersedia

### SUPER_ADMIN
- Akses penuh ke semua fitur sistem
- Dapat mengelola semua tenant/yayasan
- Akses ke dashboard analytics global

### ADMIN
- Akses penuh ke yayasan/tenant tertentu
- Dapat mengelola user, settings, dan semua data
- Akses ke laporan keuangan dan analytics

### STAFF
- Akses terbatas ke fitur operasional
- Dapat mengelola data santri, guru, kegiatan
- Tidak dapat mengubah settings atau user management

### TEACHER/USTADZ
- Akses khusus untuk guru/ustadz
- Dapat mengelola kelas, nilai, hafalan
- Akses terbatas pada data administrasi

### PARENT
- Akses khusus untuk orang tua
- Hanya dapat melihat data anak-anaknya
- Tidak dapat mengubah data sistem

## Environment Variables Terkait

```env
# Database
DATABASE_URL="postgresql://username:password@host:port/database"
POSTGRES_URL="postgresql://username:password@host:port/database"

# Authentication
NEXTAUTH_SECRET="your-nextauth-secret"
INIT_SECRET="init-secret-2024"  # Secret untuk API init
```

## Testing Login

### 1. Login sebagai Super Admin
- **URL**: `/auth/admin-signin` atau `/auth/signin`
- **Username**: `superadmin`
- **Password**: `superadmin2024`

### 2. Login sebagai Admin
- **URL**: `/auth/admin-signin` atau `/auth/signin`
- **Username**: `admin`
- **Password**: `admin123`

### 3. Login sebagai Staff
- **URL**: `/auth/signin` 
- **Username**: `staff`
- **Password**: `staff123`

## Commands Berguna

```bash
# Generate Prisma Client
npx prisma generate

# Push schema changes to database
npx prisma db push

# Reset database (HATI-HATI!)
npx prisma db push --force-reset

# View database schema
npx prisma db pull

# Create migration
npx prisma migrate dev --name add_users

# Apply migrations
npx prisma migrate deploy

# Seed database (jika ada seed script)
npx prisma db seed
```

## Troubleshooting

### User tidak bisa login
1. Cek apakah user ada di database
2. Cek apakah `isActive = true`
3. Cek apakah password ter-hash dengan benar
4. Cek environment variables NextAuth

### Database connection error
1. Cek DATABASE_URL di .env
2. Cek koneksi database
3. Pastikan Prisma generate sudah dijalankan

### Password reset
User admin dapat direset menggunakan `/api/auth/init` endpoint dengan secret yang benar.