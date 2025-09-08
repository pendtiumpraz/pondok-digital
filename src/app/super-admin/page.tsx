'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  BuildingOfficeIcon,
  UsersIcon,
  BanknotesIcon,
  ChartBarIcon,
  GlobeAltIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  CalendarIcon,
  BellIcon,
  Cog6ToothIcon,
  ShieldCheckIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';

interface Tenant {
  id: string;
  name: string;
  domain: string;
  plan: 'starter' | 'pro' | 'enterprise';
  status: 'active' | 'suspended' | 'trial' | 'expired';
  users: number;
  revenue: number;
  createdAt: string;
  lastActive: string;
  adminEmail: string;
  usage: {
    storage: number;
    bandwidth: number;
    apiCalls: number;
  };
}

const SuperAdminDashboard = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPlan, setFilterPlan] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'revenue' | 'users' | 'created'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);

  const handleLogout = async () => {
    await signOut({ redirect: true, callbackUrl: '/auth/admin-signin' });
  };

  // Fetch real data from API
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch tenants
      const tenantsRes = await fetch('/api/super-admin/tenants');
      const tenantsData = await tenantsRes.json();
      
      // Fetch stats
      const statsRes = await fetch('/api/super-admin/stats');
      const statsData = await statsRes.json();
      
      if (tenantsData.success) {
        setTenants(tenantsData.tenants);
      }
      
      if (statsData.success) {
        setStats(statsData.stats);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Keep mock data as fallback for now
  const mockTenants = [
    {
      id: '1',
      name: 'TechCorp Solutions',
      domain: 'techcorp.yoursaas.com',
      plan: 'enterprise',
      status: 'active',
      users: 150,
      revenue: 1999000 * 12,
      createdAt: '2024-01-15',
      lastActive: '2024-09-07',
      adminEmail: 'admin@techcorp.com',
      usage: { storage: 2500, bandwidth: 450, apiCalls: 45000 }
    },
    {
      id: '2',
      name: 'StartupXYZ',
      domain: 'startupxyz.yoursaas.com',
      plan: 'pro',
      status: 'active',
      users: 25,
      revenue: 799000 * 12,
      createdAt: '2024-03-20',
      lastActive: '2024-09-06',
      adminEmail: 'founder@startupxyz.com',
      usage: { storage: 850, bandwidth: 120, apiCalls: 12000 }
    },
    {
      id: '3',
      name: 'Local Business Co',
      domain: 'localbiz.yoursaas.com',
      plan: 'starter',
      status: 'trial',
      users: 5,
      revenue: 0,
      createdAt: '2024-08-25',
      lastActive: '2024-09-07',
      adminEmail: 'owner@localbiz.com',
      usage: { storage: 120, bandwidth: 25, apiCalls: 1500 }
    },
    {
      id: '4',
      name: 'Enterprise Ltd',
      domain: 'enterprise.yoursaas.com',
      plan: 'enterprise',
      status: 'active',
      users: 500,
      revenue: 1999000 * 12,
      createdAt: '2023-11-10',
      lastActive: '2024-09-07',
      adminEmail: 'it@enterprise.com',
      usage: { storage: 5000, bandwidth: 1200, apiCalls: 120000 }
    },
    {
      id: '5',
      name: 'Creative Agency',
      domain: 'creative.yoursaas.com',
      plan: 'pro',
      status: 'suspended',
      users: 15,
      revenue: 799000 * 8, // 8 months active
      createdAt: '2024-01-05',
      lastActive: '2024-08-15',
      adminEmail: 'hello@creative.com',
      usage: { storage: 650, bandwidth: 80, apiCalls: 8500 }
    },
  ]);

  // Use real stats if available, otherwise use calculated stats
  const displayStats = stats ? [
    {
      title: 'Total Tenants',
      value: stats.tenants.total,
      change: `+${stats.tenants.growth}%`,
      changeType: 'increase' as const,
      icon: BuildingOfficeIcon,
      color: 'from-blue-500 to-indigo-600',
    },
    {
      title: 'Active Users',
      value: stats.users.total,
      change: `+${stats.users.growth}%`,
      changeType: 'increase' as const,
      icon: UsersIcon,
      color: 'from-emerald-500 to-green-600',
    },
    {
      title: 'Monthly Revenue',
      value: stats.revenue.monthly,
      change: `+${stats.revenue.growth}%`,
      changeType: 'increase' as const,
      icon: BanknotesIcon,
      color: 'from-purple-500 to-pink-600',
    },
    {
      title: 'System Health',
      value: stats.health.score,
      change: '+0.1%',
      changeType: 'increase' as const,
      icon: ChartBarIcon,
      color: 'from-orange-500 to-red-600',
    },
  ] : [
    {
      title: 'Total Tenants',
      value: tenants.length,
      change: '+12%',
      changeType: 'increase' as const,
      icon: BuildingOfficeIcon,
      color: 'from-blue-500 to-indigo-600',
    },
    {
      title: 'Active Users',
      value: tenants.reduce((sum, t) => sum + t.users, 0),
      change: '+8%',
      changeType: 'increase' as const,
      icon: UsersIcon,
      color: 'from-emerald-500 to-green-600',
    },
    {
      title: 'Monthly Revenue',
      value: tenants.filter(t => t.status === 'active').reduce((sum, t) => sum + t.revenue, 0) / 12,
      change: '+23%',
      changeType: 'increase' as const,
      icon: BanknotesIcon,
      color: 'from-purple-500 to-pink-600',
    },
    {
      title: 'System Health',
      value: 99.9,
      change: '+0.1%',
      changeType: 'increase' as const,
      icon: ChartBarIcon,
      color: 'from-orange-500 to-red-600',
    },
  ];

  const recentActivity = [
    { id: 1, type: 'tenant_created', tenant: 'Local Business Co', timestamp: '2 hours ago' },
    { id: 2, type: 'payment_received', tenant: 'TechCorp Solutions', timestamp: '5 hours ago' },
    { id: 3, type: 'user_limit_exceeded', tenant: 'StartupXYZ', timestamp: '1 day ago' },
    { id: 4, type: 'tenant_suspended', tenant: 'Creative Agency', timestamp: '2 days ago' },
    { id: 5, type: 'plan_upgraded', tenant: 'Enterprise Ltd', timestamp: '3 days ago' },
  ];

  const filteredTenants = tenants
    .filter(tenant => 
      tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tenant.domain.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tenant.adminEmail.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(tenant => filterStatus === 'all' || tenant.status === filterStatus)
    .filter(tenant => filterPlan === 'all' || tenant.plan === filterPlan)
    .sort((a, b) => {
      let aValue: any, bValue: any;
      switch (sortBy) {
        case 'name':
          aValue = a.name;
          bValue = b.name;
          break;
        case 'revenue':
          aValue = a.revenue;
          bValue = b.revenue;
          break;
        case 'users':
          aValue = a.users;
          bValue = b.users;
          break;
        case 'created':
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
          break;
        default:
          return 0;
      }
      
      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

  const getStatusBadge = (status: Tenant['status']) => {
    const variants = {
      active: 'success',
      trial: 'info',
      suspended: 'warning',
      expired: 'destructive',
    };
    return <Badge variant={variants[status] as any}>{status.toUpperCase()}</Badge>;
  };

  const getPlanBadge = (plan: Tenant['plan']) => {
    const variants = {
      starter: 'outline',
      pro: 'default',
      enterprise: 'secondary',
    };
    return <Badge variant={variants[plan] as any}>{plan.toUpperCase()}</Badge>;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
                <ShieldCheckIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Super Admin Dashboard</h1>
                <p className="text-gray-600">Manage all tenants and system operations</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Button variant="outline" className="flex items-center gap-2">
                <BellIcon className="w-4 h-4" />
                Alerts (3)
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Cog6ToothIcon className="w-4 h-4" />
                Settings
              </Button>
              <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white flex items-center gap-2">
                <PlusIcon className="w-4 h-4" />
                Add Tenant
              </Button>
              <Button 
                onClick={handleLogout}
                variant="destructive" 
                className="flex items-center gap-2"
              >
                <ArrowRightOnRectangleIcon className="w-4 h-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">
                      {stat.title.includes('Revenue') || stat.title.includes('Health') 
                        ? stat.title.includes('Revenue') 
                          ? formatCurrency(stat.value)
                          : `${stat.value}%`
                        : formatNumber(stat.value)
                      }
                    </p>
                    <div className={`flex items-center gap-1 mt-2 text-sm ${
                      stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stat.changeType === 'increase' ? (
                        <ArrowUpIcon className="w-4 h-4" />
                      ) : (
                        <ArrowDownIcon className="w-4 h-4" />
                      )}
                      <span>{stat.change}</span>
                      <span className="text-gray-500">vs last month</span>
                    </div>
                  </div>
                  <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Tenants Table */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Tenants</h2>
                <div className="flex items-center gap-4">
                  {/* Search */}
                  <div className="relative">
                    <MagnifyingGlassIcon className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input
                      placeholder="Search tenants..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                  
                  {/* Filters */}
                  <div className="flex items-center gap-2">
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                    >
                      <option value="all">All Status</option>
                      <option value="active">Active</option>
                      <option value="trial">Trial</option>
                      <option value="suspended">Suspended</option>
                      <option value="expired">Expired</option>
                    </select>
                    
                    <select
                      value={filterPlan}
                      onChange={(e) => setFilterPlan(e.target.value)}
                      className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                    >
                      <option value="all">All Plans</option>
                      <option value="starter">Starter</option>
                      <option value="pro">Pro</option>
                      <option value="enterprise">Enterprise</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-2 font-semibold text-gray-700">
                        <button 
                          onClick={() => setSortBy('name')}
                          className="flex items-center gap-1 hover:text-gray-900"
                        >
                          Tenant
                          {sortBy === 'name' && (
                            sortOrder === 'asc' ? <ArrowUpIcon className="w-4 h-4" /> : <ArrowDownIcon className="w-4 h-4" />
                          )}
                        </button>
                      </th>
                      <th className="text-left py-3 px-2 font-semibold text-gray-700">Status</th>
                      <th className="text-left py-3 px-2 font-semibold text-gray-700">Plan</th>
                      <th className="text-left py-3 px-2 font-semibold text-gray-700">
                        <button 
                          onClick={() => setSortBy('users')}
                          className="flex items-center gap-1 hover:text-gray-900"
                        >
                          Users
                          {sortBy === 'users' && (
                            sortOrder === 'asc' ? <ArrowUpIcon className="w-4 h-4" /> : <ArrowDownIcon className="w-4 h-4" />
                          )}
                        </button>
                      </th>
                      <th className="text-left py-3 px-2 font-semibold text-gray-700">
                        <button 
                          onClick={() => setSortBy('revenue')}
                          className="flex items-center gap-1 hover:text-gray-900"
                        >
                          Revenue
                          {sortBy === 'revenue' && (
                            sortOrder === 'asc' ? <ArrowUpIcon className="w-4 h-4" /> : <ArrowDownIcon className="w-4 h-4" />
                          )}
                        </button>
                      </th>
                      <th className="text-left py-3 px-2 font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTenants.map((tenant) => (
                      <tr key={tenant.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-4 px-2">
                          <div>
                            <div className="font-semibold text-gray-900">{tenant.name}</div>
                            <div className="text-sm text-gray-600">{tenant.domain}</div>
                            <div className="text-xs text-gray-500">{tenant.adminEmail}</div>
                          </div>
                        </td>
                        <td className="py-4 px-2">
                          {getStatusBadge(tenant.status)}
                        </td>
                        <td className="py-4 px-2">
                          {getPlanBadge(tenant.plan)}
                        </td>
                        <td className="py-4 px-2 text-gray-700">
                          {formatNumber(tenant.users)}
                        </td>
                        <td className="py-4 px-2 text-gray-700">
                          {formatCurrency(tenant.revenue / 12)}/mo
                        </td>
                        <td className="py-4 px-2">
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setSelectedTenant(tenant)}
                            >
                              <EyeIcon className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <PencilIcon className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <TrashIcon className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Activity */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-indigo-600 rounded-full mt-2 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">
                        {activity.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </p>
                      <p className="text-sm text-gray-600">{activity.tenant}</p>
                      <p className="text-xs text-gray-500">{activity.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* System Status */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">System Status</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">API Response Time</span>
                  <span className="text-sm font-semibold text-green-600">142ms</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Database Health</span>
                  <Badge variant="success">Optimal</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Server Load</span>
                  <span className="text-sm font-semibold text-gray-900">68%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Storage Usage</span>
                  <span className="text-sm font-semibold text-gray-900">2.1TB / 10TB</span>
                </div>
              </div>
            </Card>

            {/* Quick Actions */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <PlusIcon className="w-4 h-4 mr-2" />
                  Create New Tenant
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <ChartBarIcon className="w-4 h-4 mr-2" />
                  Generate Report
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <ExclamationTriangleIcon className="w-4 h-4 mr-2" />
                  View Alerts
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Cog6ToothIcon className="w-4 h-4 mr-2" />
                  System Settings
                </Button>
              </div>
            </Card>
          </div>
        </div>

        {/* Tenant Detail Modal */}
        {selectedTenant && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{selectedTenant.name}</h2>
                    <p className="text-gray-600">{selectedTenant.domain}</p>
                  </div>
                  <button
                    onClick={() => setSelectedTenant(null)}
                    className="text-gray-400 hover:text-gray-600 text-2xl"
                  >
                    ×
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Tenant Information</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        {getStatusBadge(selectedTenant.status)}
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Plan:</span>
                        {getPlanBadge(selectedTenant.plan)}
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Users:</span>
                        <span className="font-semibold">{formatNumber(selectedTenant.users)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Monthly Revenue:</span>
                        <span className="font-semibold">{formatCurrency(selectedTenant.revenue / 12)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Created:</span>
                        <span className="font-semibold">{selectedTenant.createdAt}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Last Active:</span>
                        <span className="font-semibold">{selectedTenant.lastActive}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Usage Analytics</h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-gray-600">Storage</span>
                          <span className="font-semibold">{selectedTenant.usage.storage} MB</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-indigo-600 h-2 rounded-full"
                            style={{ width: `${Math.min(selectedTenant.usage.storage / 10000 * 100, 100)}%` }}
                          />
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-gray-600">Bandwidth</span>
                          <span className="font-semibold">{selectedTenant.usage.bandwidth} GB</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-emerald-600 h-2 rounded-full"
                            style={{ width: `${Math.min(selectedTenant.usage.bandwidth / 1000 * 100, 100)}%` }}
                          />
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-gray-600">API Calls</span>
                          <span className="font-semibold">{formatNumber(selectedTenant.usage.apiCalls)}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-purple-600 h-2 rounded-full"
                            style={{ width: `${Math.min(selectedTenant.usage.apiCalls / 100000 * 100, 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex justify-end gap-4">
                  <Button variant="outline">
                    <PencilIcon className="w-4 h-4 mr-2" />
                    Edit Tenant
                  </Button>
                  <Button variant="outline">
                    <GlobeAltIcon className="w-4 h-4 mr-2" />
                    View Dashboard
                  </Button>
                  <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                    <Cog6ToothIcon className="w-4 h-4 mr-2" />
                    Manage
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SuperAdminDashboard;