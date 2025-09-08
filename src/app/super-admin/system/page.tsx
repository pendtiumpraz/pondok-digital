'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  CpuChipIcon,
  ServerIcon,
  CircleStackIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  ClockIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
} from '@heroicons/react/24/outline';

interface SystemHealth {
  healthScore: number;
  systemMetrics: {
    cpu: {
      usage: number;
      cores: number;
      model: string;
    };
    memory: {
      total: number;
      free: number;
      used: number;
      usage: number;
    };
    uptime: {
      system: number;
      process: number;
    };
    platform: {
      type: string;
      platform: string;
      release: string;
      hostname: string;
    };
  };
  databaseStats: {
    totalRecords: number;
    tables: {
      users: number;
      tenants: number;
      students: number;
      transactions: number;
    };
    size: number;
  };
  healthChecks: {
    database: {
      status: string;
      message: string;
      responseTime: number;
    };
    api: {
      status: string;
      message: string;
      responseTime: number;
    };
    storage: {
      status: string;
      message: string;
      availableSpace: number;
    };
  };
  recentErrors: Array<{
    id: string;
    message: string;
    timestamp: string;
    entity: string;
  }>;
}

export default function SystemPage() {
  const [health, setHealth] = useState<SystemHealth | null>(null);
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(false);

  useEffect(() => {
    fetchSystemHealth();
    
    if (autoRefresh) {
      const interval = setInterval(fetchSystemHealth, 5000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const fetchSystemHealth = async () => {
    try {
      const response = await fetch('/api/super-admin/system-health');
      const data = await response.json();
      if (data.success) {
        setHealth(data.data);
      }
    } catch (error) {
      console.error('Error fetching system health:', error);
    } finally {
      setLoading(false);
    }
  };

  const getHealthColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getHealthBadge = (status: string) => {
    if (status === 'healthy') {
      return <Badge variant="success">Healthy</Badge>;
    } else if (status === 'warning') {
      return <Badge variant="secondary">Warning</Badge>;
    } else {
      return <Badge variant="destructive">Unhealthy</Badge>;
    }
  };

  const getHealthIcon = (status: string) => {
    if (status === 'healthy') {
      return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
    } else if (status === 'warning') {
      return <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500" />;
    } else {
      return <XCircleIcon className="w-5 h-5 text-red-500" />;
    }
  };

  const formatUptime = (hours: number) => {
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;
    if (days > 0) {
      return `${days}d ${remainingHours}h`;
    }
    return `${hours}h`;
  };

  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return `${bytes} MB`;
    return `${(bytes / 1024).toFixed(2)} GB`;
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!health) {
    return (
      <div className="p-6">
        <Card className="p-12 text-center">
          <ExclamationTriangleIcon className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Failed to load system health</h2>
          <Button onClick={fetchSystemHealth}>Retry</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">System Health</h1>
            <p className="text-gray-600 mt-2">Monitor system performance and health status</p>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant={autoRefresh ? 'default' : 'outline'}
              onClick={() => setAutoRefresh(!autoRefresh)}
            >
              <ArrowPathIcon className={`w-4 h-4 mr-2 ${autoRefresh ? 'animate-spin' : ''}`} />
              {autoRefresh ? 'Auto Refreshing' : 'Auto Refresh'}
            </Button>
            <Button onClick={fetchSystemHealth} variant="outline">
              <ArrowPathIcon className="w-4 h-4 mr-2" />
              Refresh Now
            </Button>
          </div>
        </div>
      </div>

      {/* Health Score */}
      <Card className="p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold mb-2">Overall Health Score</h2>
            <div className="flex items-center gap-4">
              <span className={`text-4xl font-bold ${getHealthColor(health.healthScore)}`}>
                {health.healthScore}%
              </span>
              <Progress value={health.healthScore} className="w-64" />
            </div>
          </div>
          <div className={`w-24 h-24 rounded-full flex items-center justify-center ${
            health.healthScore >= 80 ? 'bg-green-100' :
            health.healthScore >= 60 ? 'bg-yellow-100' : 'bg-red-100'
          }`}>
            {health.healthScore >= 80 ? (
              <CheckCircleIcon className="w-12 h-12 text-green-600" />
            ) : health.healthScore >= 60 ? (
              <ExclamationTriangleIcon className="w-12 h-12 text-yellow-600" />
            ) : (
              <XCircleIcon className="w-12 h-12 text-red-600" />
            )}
          </div>
        </div>
      </Card>

      {/* System Metrics */}
      <div className="grid grid-cols-3 gap-6 mb-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">CPU</h3>
            <CpuChipIcon className="w-6 h-6 text-indigo-600" />
          </div>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Usage</span>
                <span className="font-medium">{health.systemMetrics.cpu.usage}%</span>
              </div>
              <Progress value={health.systemMetrics.cpu.usage} />
            </div>
            <div className="text-sm space-y-1">
              <div className="flex justify-between">
                <span className="text-gray-600">Cores</span>
                <span>{health.systemMetrics.cpu.cores}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Model</span>
                <span className="text-xs truncate max-w-[150px]" title={health.systemMetrics.cpu.model}>
                  {health.systemMetrics.cpu.model}
                </span>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Memory</h3>
            <ServerIcon className="w-6 h-6 text-purple-600" />
          </div>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Usage</span>
                <span className="font-medium">{health.systemMetrics.memory.usage}%</span>
              </div>
              <Progress value={health.systemMetrics.memory.usage} />
            </div>
            <div className="text-sm space-y-1">
              <div className="flex justify-between">
                <span className="text-gray-600">Used</span>
                <span>{health.systemMetrics.memory.used.toFixed(2)} GB</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Free</span>
                <span>{health.systemMetrics.memory.free.toFixed(2)} GB</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total</span>
                <span>{health.systemMetrics.memory.total.toFixed(2)} GB</span>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">System Info</h3>
            <ClockIcon className="w-6 h-6 text-blue-600" />
          </div>
          <div className="text-sm space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Platform</span>
              <span>{health.systemMetrics.platform.platform}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Type</span>
              <span>{health.systemMetrics.platform.type}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">System Uptime</span>
              <span>{formatUptime(health.systemMetrics.uptime.system)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Process Uptime</span>
              <span>{formatUptime(health.systemMetrics.uptime.process)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Hostname</span>
              <span className="text-xs truncate max-w-[100px]" title={health.systemMetrics.platform.hostname}>
                {health.systemMetrics.platform.hostname}
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* Health Checks & Database Stats */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Service Health Checks</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                {getHealthIcon(health.healthChecks.database.status)}
                <div>
                  <p className="font-medium">Database</p>
                  <p className="text-sm text-gray-600">{health.healthChecks.database.message}</p>
                </div>
              </div>
              <div className="text-right">
                {getHealthBadge(health.healthChecks.database.status)}
                <p className="text-xs text-gray-500 mt-1">
                  {health.healthChecks.database.responseTime}ms
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                {getHealthIcon(health.healthChecks.api.status)}
                <div>
                  <p className="font-medium">API</p>
                  <p className="text-sm text-gray-600">{health.healthChecks.api.message}</p>
                </div>
              </div>
              <div className="text-right">
                {getHealthBadge(health.healthChecks.api.status)}
                <p className="text-xs text-gray-500 mt-1">
                  {health.healthChecks.api.responseTime}ms
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                {getHealthIcon(health.healthChecks.storage.status)}
                <div>
                  <p className="font-medium">Storage</p>
                  <p className="text-sm text-gray-600">{health.healthChecks.storage.message}</p>
                </div>
              </div>
              <div className="text-right">
                {getHealthBadge(health.healthChecks.storage.status)}
                <p className="text-xs text-gray-500 mt-1">
                  {health.healthChecks.storage.availableSpace.toFixed(2)} GB free
                </p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Database Statistics</h3>
            <CircleStackIcon className="w-6 h-6 text-green-600" />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Database Size</span>
              <Badge variant="secondary">{formatBytes(health.databaseStats.size)}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Records</span>
              <span className="font-semibold">{health.databaseStats.totalRecords.toLocaleString()}</span>
            </div>
            <div className="border-t pt-3 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Users</span>
                <span>{health.databaseStats.tables.users}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tenants</span>
                <span>{health.databaseStats.tables.tenants}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Students</span>
                <span>{health.databaseStats.tables.students}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Transactions</span>
                <span>{health.databaseStats.tables.transactions}</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Errors */}
      {health.recentErrors.length > 0 && (
        <Card className="overflow-hidden">
          <div className="p-6 border-b">
            <h3 className="font-semibold">Recent Errors</h3>
          </div>
          <div className="divide-y">
            {health.recentErrors.slice(0, 5).map((error) => (
              <div key={error.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <ExclamationTriangleIcon className="w-5 h-5 text-red-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{error.message}</p>
                      <p className="text-xs text-gray-500">
                        Entity: {error.entity} • {new Date(error.timestamp).toLocaleString('id-ID')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}