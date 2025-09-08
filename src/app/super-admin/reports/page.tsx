'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  ChartBarIcon,
  DocumentArrowDownIcon,
  CalendarIcon,
  UsersIcon,
  BuildingOfficeIcon,
  BanknotesIcon,
  ClipboardDocumentListIcon,
  ArrowPathIcon,
  FunnelIcon,
} from '@heroicons/react/24/outline';

interface ReportData {
  type: string;
  data: any;
}

export default function ReportsPage() {
  const [reportType, setReportType] = useState('overview');
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState(
    new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0]
  );
  const [endDate, setEndDate] = useState(
    new Date().toISOString().split('T')[0]
  );

  const reportTypes = [
    { id: 'overview', name: 'Overview Report', icon: ChartBarIcon, color: 'bg-blue-500' },
    { id: 'financial', name: 'Financial Report', icon: BanknotesIcon, color: 'bg-green-500' },
    { id: 'tenants', name: 'Tenants Report', icon: BuildingOfficeIcon, color: 'bg-purple-500' },
    { id: 'users', name: 'Users Report', icon: UsersIcon, color: 'bg-indigo-500' },
    { id: 'activity', name: 'Activity Report', icon: ClipboardDocumentListIcon, color: 'bg-orange-500' },
  ];

  const fetchReport = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/super-admin/reports?type=${reportType}&startDate=${startDate}&endDate=${endDate}`
      );
      const data = await response.json();
      if (data.success) {
        setReportData(data);
      }
    } catch (error) {
      console.error('Error fetching report:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [reportType]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const exportReport = () => {
    if (!reportData) return;

    let csvContent = '';
    const data = reportData.data;

    switch (reportType) {
      case 'overview':
        csvContent = [
          ['Metric', 'Value'],
          ['Total Tenants', data.totalTenants],
          ['Active Tenants', data.activeTenants],
          ['Total Users', data.totalUsers],
          ['Total Students', data.totalStudents],
          ['Total Revenue', data.totalRevenue],
        ].map(row => row.join(',')).join('\n');
        break;

      case 'financial':
        csvContent = [
          ['Date', 'Transaction ID', 'Amount', 'Status', 'Organization'],
          ...data.transactions.map((tx: any) => [
            new Date(tx.date).toLocaleDateString('id-ID'),
            tx.id,
            tx.amount,
            tx.status,
            tx.organization || ''
          ])
        ].map(row => row.join(',')).join('\n');
        break;

      case 'tenants':
        csvContent = [
          ['Name', 'Tier', 'Status', 'Users', 'Students', 'Created'],
          ...data.tenants.map((t: any) => [
            t.name,
            t.tier,
            t.status,
            t.users,
            t.students,
            new Date(t.createdAt).toLocaleDateString('id-ID')
          ])
        ].map(row => row.join(',')).join('\n');
        break;

      case 'users':
        csvContent = [
          ['Role', 'Count'],
          ...data.usersByRole.map((u: any) => [u.role, u.count])
        ].map(row => row.join(',')).join('\n');
        break;

      case 'activity':
        csvContent = [
          ['Timestamp', 'User', 'Action', 'Entity'],
          ...data.recentActivities.map((a: any) => [
            new Date(a.timestamp).toLocaleString('id-ID'),
            a.user || 'Unknown',
            a.action,
            a.entity || ''
          ])
        ].map(row => row.join(',')).join('\n');
        break;
    }

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${reportType}-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const renderReportContent = () => {
    if (!reportData?.data) return null;
    const data = reportData.data;

    switch (reportType) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-5 gap-4">
              <Card className="p-4">
                <p className="text-sm text-gray-600">Total Tenants</p>
                <p className="text-2xl font-bold">{data.totalTenants}</p>
              </Card>
              <Card className="p-4">
                <p className="text-sm text-gray-600">Active Tenants</p>
                <p className="text-2xl font-bold">{data.activeTenants}</p>
              </Card>
              <Card className="p-4">
                <p className="text-sm text-gray-600">Total Users</p>
                <p className="text-2xl font-bold">{data.totalUsers}</p>
              </Card>
              <Card className="p-4">
                <p className="text-sm text-gray-600">Total Students</p>
                <p className="text-2xl font-bold">{data.totalStudents}</p>
              </Card>
              <Card className="p-4">
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-xl font-bold">{formatCurrency(data.totalRevenue)}</p>
              </Card>
            </div>
          </div>
        );

      case 'financial':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <Card className="p-4">
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold">{formatCurrency(data.totalRevenue)}</p>
              </Card>
              <Card className="p-4">
                <p className="text-sm text-gray-600">Total Transactions</p>
                <p className="text-2xl font-bold">{data.totalTransactions}</p>
              </Card>
              <Card className="p-4">
                <p className="text-sm text-gray-600">Success Rate</p>
                <p className="text-2xl font-bold">
                  {data.totalTransactions > 0 
                    ? Math.round((data.successfulTransactions / data.totalTransactions) * 100)
                    : 0}%
                </p>
              </Card>
            </div>

            <Card className="overflow-hidden">
              <div className="p-4 border-b">
                <h3 className="font-semibold">Recent Transactions</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Date</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Organization</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Amount</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Status</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Method</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {data.transactions?.slice(0, 10).map((tx: any) => (
                      <tr key={tx.id}>
                        <td className="px-4 py-2 text-sm">
                          {new Date(tx.date).toLocaleDateString('id-ID')}
                        </td>
                        <td className="px-4 py-2 text-sm">{tx.organization || '-'}</td>
                        <td className="px-4 py-2 text-sm font-medium">
                          {formatCurrency(tx.amount)}
                        </td>
                        <td className="px-4 py-2">
                          <Badge variant={tx.status === 'SUCCESS' ? 'success' : 'destructive'}>
                            {tx.status}
                          </Badge>
                        </td>
                        <td className="px-4 py-2 text-sm">{tx.method || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        );

      case 'tenants':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-4 gap-4">
              <Card className="p-4">
                <p className="text-sm text-gray-600">Total Tenants</p>
                <p className="text-2xl font-bold">{data.totalTenants}</p>
              </Card>
              <Card className="p-4">
                <p className="text-sm text-gray-600">Trial</p>
                <p className="text-2xl font-bold">{data.byTier.trial}</p>
              </Card>
              <Card className="p-4">
                <p className="text-sm text-gray-600">Basic</p>
                <p className="text-2xl font-bold">{data.byTier.basic}</p>
              </Card>
              <Card className="p-4">
                <p className="text-sm text-gray-600">Premium</p>
                <p className="text-2xl font-bold">{data.byTier.premium}</p>
              </Card>
            </div>

            <Card className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Name</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Tier</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Status</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Users</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Students</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {data.tenants?.map((tenant: any) => (
                      <tr key={tenant.id}>
                        <td className="px-4 py-2 text-sm font-medium">{tenant.name}</td>
                        <td className="px-4 py-2">
                          <Badge>{tenant.tier}</Badge>
                        </td>
                        <td className="px-4 py-2">
                          <Badge variant={tenant.status === 'ACTIVE' ? 'success' : 'secondary'}>
                            {tenant.status}
                          </Badge>
                        </td>
                        <td className="px-4 py-2 text-sm">{tenant.users}</td>
                        <td className="px-4 py-2 text-sm">{tenant.students}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        );

      case 'users':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <Card className="p-4">
                <p className="text-sm text-gray-600">Total Users</p>
                <p className="text-2xl font-bold">{data.totalUsers}</p>
              </Card>
              <Card className="p-4">
                <p className="text-sm text-gray-600">Active Users</p>
                <p className="text-2xl font-bold">{data.activeUsers}</p>
              </Card>
              <Card className="p-4">
                <p className="text-sm text-gray-600">Activity Rate</p>
                <p className="text-2xl font-bold">
                  {data.totalUsers > 0 
                    ? Math.round((data.activeUsers / data.totalUsers) * 100)
                    : 0}%
                </p>
              </Card>
            </div>

            <Card className="p-6">
              <h3 className="font-semibold mb-4">Users by Role</h3>
              <div className="space-y-3">
                {data.usersByRole?.map((role: any) => (
                  <div key={role.role} className="flex items-center justify-between">
                    <span className="font-medium">{role.role}</span>
                    <Badge>{role.count}</Badge>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        );

      case 'activity':
        return (
          <div className="space-y-6">
            <Card className="p-4">
              <p className="text-sm text-gray-600">Total Activities</p>
              <p className="text-2xl font-bold">{data.totalActivities}</p>
            </Card>

            <div className="grid grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Top Activities</h3>
                <div className="space-y-2">
                  {data.byAction?.slice(0, 5).map((action: any) => (
                    <div key={action.action} className="flex justify-between">
                      <span className="text-sm">{action.action}</span>
                      <Badge variant="secondary">{action.count}</Badge>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="font-semibold mb-4">Most Active Users</h3>
                <div className="space-y-2">
                  {data.byUser?.slice(0, 5).map((user: any) => (
                    <div key={user.user} className="flex justify-between">
                      <span className="text-sm">{user.user}</span>
                      <Badge variant="secondary">{user.count}</Badge>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">System Reports</h1>
            <p className="text-gray-600 mt-2">Generate and export comprehensive system reports</p>
          </div>
          <div className="flex items-center gap-4">
            <Button onClick={fetchReport} variant="outline">
              <ArrowPathIcon className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button 
              onClick={exportReport}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
              disabled={!reportData}
            >
              <DocumentArrowDownIcon className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </div>
      </div>

      {/* Report Type Selection */}
      <div className="grid grid-cols-5 gap-4 mb-6">
        {reportTypes.map((type) => {
          const Icon = type.icon;
          return (
            <Card
              key={type.id}
              className={`p-4 cursor-pointer transition-all ${
                reportType === type.id ? 'ring-2 ring-indigo-500' : ''
              }`}
              onClick={() => setReportType(type.id)}
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 ${type.color} rounded-lg flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-medium text-sm">{type.name}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Date Range Filter */}
      <Card className="p-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-gray-400" />
            <span className="text-sm font-medium">Date Range:</span>
          </div>
          <Input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-40"
          />
          <span className="text-gray-500">to</span>
          <Input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-40"
          />
          <Button onClick={fetchReport} size="sm">
            <FunnelIcon className="w-4 h-4 mr-2" />
            Apply Filter
          </Button>
        </div>
      </Card>

      {/* Report Content */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        renderReportContent()
      )}
    </div>
  );
}