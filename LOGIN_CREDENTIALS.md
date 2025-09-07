# 🔐 Login Credentials untuk Testing

## ⚠️ IMPORTANT: GANTI PASSWORD SETELAH LOGIN PERTAMA!

## 🌟 Super Admin (Platform Owner)
**Akses:** Seluruh sistem, semua tenant, billing, subscription
```
Username: superadmin
Password: superadmin123
Email: superadmin@sistempondok.id
Role: SUPERADMIN
```

## 🏫 Admin Yayasan Imam Syafii
**Akses:** Manajemen pondok Imam Syafii
```
Username: admin_syafii
Password: admin123
Email: admin@pondokimamsyafii.com
Role: ADMIN
```

## 👨‍🏫 Ustadz Account
**Akses:** Kelas, nilai, absensi santri yang diajar
```
Username: ustadz
Password: ustadz123
Email: ustadz@pondokimamsyafii.com
Role: USTADZ
```

## 👤 Staff Account
**Akses:** View only, data entry
```
Username: staff
Password: staff123
Email: staff@pondokimamsyafii.com
Role: STAFF
```

---

## 📝 Cara Login

### 1. Development (Local)
```
URL: http://localhost:3030/login
```

### 2. Production (Future)
```
Main Platform: https://sistempondok.id/login
Tenant Syafii: https://syafii.sistempondok.id/login
```

---

## 🔄 Cara Ganti Password

1. Login dengan credentials di atas
2. Pergi ke **Settings** → **Account**
3. Klik **Change Password**
4. Masukkan password lama dan password baru
5. Klik **Save**

---

## 🛡️ Security Notes

1. **SEGERA GANTI PASSWORD** setelah login pertama
2. Gunakan password yang kuat (min 8 karakter, kombinasi huruf, angka, simbol)
3. Jangan share credentials dengan orang lain
4. Logout setelah selesai menggunakan sistem

---

## 🆘 Lupa Password?

1. Klik "Forgot Password" di halaman login
2. Masukkan email terdaftar
3. Cek email untuk link reset password
4. Buat password baru

---

## 📱 Multi-Factor Authentication (MFA)

Untuk keamanan ekstra, aktifkan 2FA:
1. Login → Settings → Security
2. Enable Two-Factor Authentication
3. Scan QR code dengan Google Authenticator
4. Masukkan kode verifikasi
5. Simpan backup codes

---

## 🎯 Role Capabilities

### SUPERADMIN dapat:
- ✅ Manage semua tenant
- ✅ Create/delete organizations
- ✅ Access billing & subscriptions
- ✅ System-wide settings
- ✅ View all analytics

### ADMIN dapat:
- ✅ Manage users dalam yayasan
- ✅ Full CRUD santri, ustadz, keuangan
- ✅ Generate reports
- ✅ Configure public pages
- ✅ Access all modules

### USTADZ dapat:
- ✅ View assigned classes
- ✅ Input grades
- ✅ Mark attendance
- ✅ Create assignments
- ❌ Cannot access finance

### STAFF dapat:
- ✅ View data
- ✅ Basic data entry
- ❌ Cannot delete records
- ❌ Cannot access sensitive data

---

## 🚀 Testing Scenarios

### Test Super Admin:
1. Login as `superadmin`
2. Create new tenant
3. Manage subscriptions
4. View platform analytics

### Test Admin Yayasan:
1. Login as `admin_syafii`
2. Add new santri
3. Create financial transaction
4. Configure public page

### Test Ustadz:
1. Login as `ustadz`
2. View assigned classes
3. Input student grades
4. Mark attendance

### Test Staff:
1. Login as `staff`
2. View reports
3. Try accessing restricted areas (should be blocked)

---

## 📞 Support

Jika ada masalah login:
- Email: support@sistempondok.id
- WhatsApp: +62 xxx-xxxx-xxxx
- Documentation: https://docs.sistempondok.id

---

**Last Updated:** December 2024
**Version:** 1.0.0