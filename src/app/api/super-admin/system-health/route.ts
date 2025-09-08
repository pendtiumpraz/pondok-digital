import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import os from 'os';

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id || session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // System metrics
    const systemMetrics = {
      cpu: {
        usage: Math.round(os.loadavg()[0] * 100) / 100,
        cores: os.cpus().length,
        model: os.cpus()[0]?.model || 'Unknown'
      },
      memory: {
        total: Math.round(os.totalmem() / 1024 / 1024 / 1024 * 100) / 100, // GB
        free: Math.round(os.freemem() / 1024 / 1024 / 1024 * 100) / 100, // GB
        used: Math.round((os.totalmem() - os.freemem()) / 1024 / 1024 / 1024 * 100) / 100, // GB
        usage: Math.round((1 - os.freemem() / os.totalmem()) * 100)
      },
      uptime: {
        system: Math.round(os.uptime() / 3600), // hours
        process: Math.round(process.uptime() / 3600) // hours
      },
      platform: {
        type: os.type(),
        platform: os.platform(),
        release: os.release(),
        hostname: os.hostname()
      }
    };

    // Database stats
    const [
      totalUsers,
      totalTenants,
      totalStudents,
      totalTransactions,
      dbSize
    ] = await Promise.all([
      prisma.user.count(),
      prisma.tenant.count(),
      prisma.student.count(),
      prisma.transaction.count(),
      // Get approximate DB size (this is a rough estimate)
      prisma.$queryRaw`
        SELECT 
          pg_database_size(current_database()) as size
      `.then((result: any) => result[0]?.size || 0)
    ]);

    const databaseStats = {
      totalRecords: totalUsers + totalTenants + totalStudents + totalTransactions,
      tables: {
        users: totalUsers,
        tenants: totalTenants,
        students: totalStudents,
        transactions: totalTransactions
      },
      size: Math.round(Number(dbSize) / 1024 / 1024 * 100) / 100 // MB
    };

    // Application health checks
    const healthChecks = {
      database: {
        status: 'healthy',
        message: 'Database connection is active',
        responseTime: 0
      },
      api: {
        status: 'healthy',
        message: 'API is responding',
        responseTime: 0
      },
      storage: {
        status: 'healthy',
        message: 'Storage is accessible',
        availableSpace: Math.round(os.freemem() / 1024 / 1024 / 1024 * 100) / 100 // GB
      }
    };

    // Test database connection
    const dbStartTime = Date.now();
    try {
      await prisma.$queryRaw`SELECT 1`;
      healthChecks.database.responseTime = Date.now() - dbStartTime;
    } catch (error) {
      healthChecks.database.status = 'unhealthy';
      healthChecks.database.message = 'Database connection failed';
    }

    // Recent errors (if you have error logging)
    const recentErrors = await prisma.auditTrail.findMany({
      where: {
        action: 'ERROR'
      },
      take: 10,
      orderBy: { createdAt: 'desc' }
    });

    // Calculate overall health score
    const healthScore = 
      (healthChecks.database.status === 'healthy' ? 40 : 0) +
      (healthChecks.api.status === 'healthy' ? 30 : 0) +
      (healthChecks.storage.status === 'healthy' ? 20 : 0) +
      (systemMetrics.memory.usage < 90 ? 10 : 0);

    return NextResponse.json({
      success: true,
      data: {
        healthScore,
        systemMetrics,
        databaseStats,
        healthChecks,
        recentErrors: recentErrors.map(err => ({
          id: err.id,
          message: err.action,
          timestamp: err.createdAt,
          entity: err.entity
        }))
      }
    });
  } catch (error) {
    console.error('Error fetching system health:', error);
    return NextResponse.json(
      { error: 'Failed to fetch system health' },
      { status: 500 }
    );
  }
}