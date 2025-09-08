import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    // Check if init secret is provided
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get('secret');
    
    // You can set this in environment variable for security
    const INIT_SECRET = process.env.INIT_SECRET || 'init-secret-2024';
    
    if (secret !== INIT_SECRET) {
      return NextResponse.json(
        { error: 'Invalid initialization secret' },
        { status: 403 }
      );
    }

    const { default: prisma } = await import('@/lib/prisma');
    
    // First, create or get Imam Syafii tenant
    let imamSyafiiTenant = await prisma.tenant.findUnique({
      where: { slug: 'imam-syafii' }
    });
    
    if (!imamSyafiiTenant) {
      imamSyafiiTenant = await prisma.tenant.create({
        data: {
          name: 'Pondok Pesantren Imam Syafii Blitar',
          slug: 'imam-syafii',
          prefix: 'IMS',
          isActive: true,
          settings: {
            theme: 'green',
            locale: 'id',
            timezone: 'Asia/Jakarta'
          }
        }
      });
      
      // Create subscription for the tenant
      await prisma.subscription.create({
        data: {
          organizationId: imamSyafiiTenant.id,
          tier: 'TRIAL',
          status: 'ACTIVE',
          startDate: new Date(),
          trialEndDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days trial
          features: ['all'],
          maxUsers: 50,
          maxStudents: 100
        }
      });
    }
    
    // Check if super admin user already exists
    const existingSuperAdmin = await prisma.user.findUnique({
      where: { username: 'superadmin' }
    });
    
    // Create or update super admin user
    const superAdminPassword = await bcrypt.hash('superadmin2024', 10);
    
    let superAdminUser;
    if (!existingSuperAdmin) {
      superAdminUser = await prisma.user.create({
        data: {
          username: 'superadmin',
          email: 'superadmin@pondokdigital.id',
          password: superAdminPassword,
          name: 'Super Administrator',
          role: 'SUPER_ADMIN',
          isActive: true
        }
      });
    } else {
      // Update password if super admin exists
      superAdminUser = await prisma.user.update({
        where: { username: 'superadmin' },
        data: { 
          password: superAdminPassword,
          role: 'SUPER_ADMIN',
          isActive: true 
        }
      });
    }
    
    // Check if admin user already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { username: 'admin' }
    });
    
    // Create admin user and link to Imam Syafii tenant
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    let adminUser;
    if (!existingAdmin) {
      adminUser = await prisma.user.create({
        data: {
          username: 'admin',
          email: 'admin@ponpesimamsyafii.id',
          password: hashedPassword,
          name: 'Administrator Imam Syafii',
          role: 'ADMIN',
          isActive: true,
          tenantId: imamSyafiiTenant.id // Link to Imam Syafii tenant
        }
      });
    } else {
      // Update existing admin to link to tenant
      adminUser = await prisma.user.update({
        where: { username: 'admin' },
        data: {
          password: hashedPassword,
          tenantId: imamSyafiiTenant.id,
          isActive: true
        }
      });
    }
    
    // Create multiple role users for testing - all linked to Imam Syafii tenant
    const users = [
      {
        username: 'ustadz',
        email: 'ustadz@ponpesimamsyafii.id',
        password: 'ustadz123',
        name: 'Ustadz Ahmad',
        role: 'TEACHER',
        isUstadz: true,
        tenantId: imamSyafiiTenant.id
      },
      {
        username: 'bendahara',
        email: 'bendahara@ponpesimamsyafii.id',
        password: 'bendahara123',
        name: 'Bendahara Pesantren',
        role: 'TREASURER',
        isUstadz: false,
        tenantId: imamSyafiiTenant.id
      },
      {
        username: 'staff',
        email: 'staff@ponpesimamsyafii.id',
        password: 'staff123',
        name: 'Staff Administrasi',
        role: 'STAFF',
        isUstadz: false,
        tenantId: imamSyafiiTenant.id
      }
    ];

    const createdUsers = [];
    
    for (const userData of users) {
      const existing = await prisma.user.findUnique({
        where: { username: userData.username }
      });
      
      const hashedPwd = await bcrypt.hash(userData.password, 10);
      
      if (!existing) {
        const newUser = await prisma.user.create({
          data: {
            ...userData,
            password: hashedPwd,
            isActive: true
          }
        });
        createdUsers.push({
          username: newUser.username,
          email: newUser.email,
          role: newUser.role,
          password: userData.password // Original password for display
        });
      } else {
        // Update existing user
        await prisma.user.update({
          where: { username: userData.username },
          data: {
            password: hashedPwd,
            role: userData.role,
            isUstadz: userData.isUstadz,
            isActive: true
          }
        });
        createdUsers.push({
          username: existing.username,
          email: existing.email,
          role: userData.role,
          password: userData.password
        });
      }
    }
    
    return NextResponse.json({
      success: true,
      message: 'Users and tenant created/updated successfully',
      tenant: {
        name: imamSyafiiTenant.name,
        slug: imamSyafiiTenant.slug,
        prefix: imamSyafiiTenant.prefix,
        path: `/yayasan/${imamSyafiiTenant.slug}`
      },
      users: [
        {
          username: superAdminUser.username,
          email: superAdminUser.email,
          role: superAdminUser.role,
          password: 'superadmin2024',
          description: 'Super Admin - Full system access'
        },
        {
          username: adminUser.username,
          email: adminUser.email,
          role: adminUser.role,
          password: 'admin123',
          description: 'Admin Yayasan - Full yayasan access'
        },
        ...createdUsers.map(user => ({
          ...user,
          description: user.role === 'TEACHER' ? 'Ustadz - Menu akademik & hafalan' :
                      user.role === 'TREASURER' ? 'Bendahara - Menu keuangan & usaha' :
                      'Staff - Menu administrasi terbatas'
        }))
      ]
    });
  } catch (error) {
    console.error('Init error:', error);
    
    // If user already exists, try to update password
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      try {
        const { default: prisma } = await import('@/lib/prisma');
        const hashedPassword = await bcrypt.hash('admin123', 10);
        
        await prisma.user.update({
          where: { username: 'admin' },
          data: { 
            password: hashedPassword,
            isActive: true 
          }
        });
        
        return NextResponse.json({
          success: true,
          message: 'Admin password reset successfully',
          username: 'admin',
          password: 'admin123'
        });
      } catch (updateError) {
        return NextResponse.json(
          { error: 'Failed to update admin user' },
          { status: 500 }
        );
      }
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to initialize users',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}