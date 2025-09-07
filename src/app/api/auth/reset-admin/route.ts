import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    // Check secret for security
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get('secret');
    
    if (secret !== 'reset-2024') {
      return NextResponse.json(
        { error: 'Invalid secret' },
        { status: 403 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    // Check if admin exists
    const existingAdmin = await prisma.user.findUnique({
      where: { username: 'admin' }
    });
    
    if (existingAdmin) {
      // Update existing admin
      const updatedAdmin = await prisma.user.update({
        where: { username: 'admin' },
        data: {
          password: hashedPassword,
          isActive: true,
          role: 'ADMIN'
        }
      });
      
      return NextResponse.json({
        success: true,
        message: 'Admin password reset successfully',
        username: 'admin',
        password: 'admin123',
        role: updatedAdmin.role
      });
    } else {
      // Create new admin
      const newAdmin = await prisma.user.create({
        data: {
          username: 'admin',
          email: 'admin@ponpesimamsyafii.id',
          password: hashedPassword,
          name: 'Administrator',
          role: 'ADMIN',
          isActive: true
        }
      });
      
      return NextResponse.json({
        success: true,
        message: 'Admin user created successfully',
        username: 'admin',
        password: 'admin123',
        role: newAdmin.role
      });
    }
  } catch (error) {
    console.error('Reset admin error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to reset admin',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}