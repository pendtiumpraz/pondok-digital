# Vercel Environment Variables Setup

## Required Environment Variables

Pastikan environment variables ini sudah diset di Vercel Dashboard:

### 1. NextAuth Configuration
```env
NEXTAUTH_URL=https://pondok-digital.vercel.app
NEXTAUTH_SECRET=your-super-secret-key-here-min-32-chars-1234567890
```

⚠️ **PENTING**: 
- `NEXTAUTH_SECRET` harus minimal 32 karakter
- Gunakan string random yang kuat, bisa generate dengan:
  ```bash
  openssl rand -base64 32
  ```

### 2. Database Configuration (Postgres Vercel)
```env
DATABASE_URL=postgres://user:password@host:port/database
POSTGRES_URL=postgres://user:password@host:port/database
```

Biasanya otomatis diset jika menggunakan Vercel Postgres.

### 3. Additional Configuration
```env
INIT_SECRET=init-secret-2024
NODE_ENV=production
```

## Cara Setup di Vercel

1. **Login ke Vercel Dashboard**
   - Buka https://vercel.com/dashboard
   - Pilih project "pondok-digital"

2. **Masuk ke Settings → Environment Variables**
   - Click tab "Settings"
   - Pilih "Environment Variables" dari sidebar

3. **Tambahkan Environment Variables**
   
   Untuk setiap variable:
   - Name: Nama variable (contoh: `NEXTAUTH_SECRET`)
   - Value: Nilai variable
   - Environment: Pilih "Production", "Preview", dan "Development"
   - Click "Save"

4. **Redeploy Aplikasi**
   - Setelah semua variables ditambahkan
   - Go to "Deployments" tab
   - Click "..." pada deployment terakhir
   - Pilih "Redeploy"

## Generate NEXTAUTH_SECRET

### Option 1: Menggunakan OpenSSL
```bash
openssl rand -base64 32
```

### Option 2: Menggunakan Node.js
```javascript
require('crypto').randomBytes(32).toString('base64')
```

### Option 3: Online Generator
Gunakan https://generate-secret.vercel.app/32

## Verifikasi Environment Variables

Setelah setup, verifikasi dengan:

1. **Check Environment (Development Only)**
   ```
   https://pondok-digital.vercel.app/api/check-env?secret=check-env-2024
   ```

2. **Test Login**
   ```
   https://pondok-digital.vercel.app/auth/admin-signin
   Username: admin
   Password: admin123
   ```

3. **Initialize Users**
   ```
   https://pondok-digital.vercel.app/api/auth/init?secret=init-secret-2024
   ```

## Troubleshooting

### Error: "Server error - There is a problem with the server configuration"
**Penyebab**: NEXTAUTH_SECRET tidak diset atau tidak valid

**Solusi**:
1. Set NEXTAUTH_SECRET di Vercel Environment Variables
2. Pastikan panjangnya minimal 32 karakter
3. Redeploy aplikasi

### Error: "NEXTAUTH_URL mismatch"
**Penyebab**: NEXTAUTH_URL tidak sesuai dengan domain aktual

**Solusi**:
1. Set NEXTAUTH_URL ke domain production
2. Untuk custom domain: `https://yourdomain.com`
3. Untuk Vercel domain: `https://pondok-digital.vercel.app`

### Database Connection Error
**Penyebab**: DATABASE_URL tidak diset atau tidak valid

**Solusi**:
1. Pastikan Vercel Postgres sudah disetup
2. Check DATABASE_URL dan POSTGRES_URL di Environment Variables
3. Test connection dengan Prisma Studio

## Environment Variables List

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| NEXTAUTH_URL | ✅ | URL aplikasi production | https://pondok-digital.vercel.app |
| NEXTAUTH_SECRET | ✅ | Secret key untuk JWT | Random 32+ char string |
| DATABASE_URL | ✅ | PostgreSQL connection string | postgres://... |
| POSTGRES_URL | ✅ | PostgreSQL direct URL | postgres://... |
| INIT_SECRET | ❌ | Secret untuk init API | init-secret-2024 |
| NODE_ENV | ❌ | Environment mode | production |

## Security Notes

⚠️ **JANGAN PERNAH**:
- Commit `.env` file ke repository
- Share NEXTAUTH_SECRET publicly
- Gunakan secret yang mudah ditebak
- Gunakan development secret di production

✅ **SELALU**:
- Gunakan secret yang kuat dan random
- Set environment variables melalui Vercel Dashboard
- Gunakan environment variables yang berbeda untuk dev dan production
- Backup secret keys dengan aman