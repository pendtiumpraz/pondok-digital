'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Line,
  Bar,
  Doughnut
} from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js';
import {
  BanknotesIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  BuildingOfficeIcon,
  ArrowDownTrayIcon,
} from '@heroicons/react/24/outline';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface RevenueData {
  summary: {
    totalRevenue: number;
    avgMonthlyRevenue: number;
    currentMonthRevenue: number;
    growth: number;
  };
  monthlyRevenue: Array<{
    month: number;
    monthName: string;
    revenue: number;
    subscriptions: number;
  }>;
  tierRevenue: Array<{
    tier: string;
    count: number;
    monthlyRevenue: number;
  }>;
  topTenants: Array<{
    id: string;
    name: string;
    tier: string;
    totalRevenue: number;
    users: number;
    students: number;
  }>;
}

export default function RevenuePage() {
  const [revenueData, setRevenueData] = useState<RevenueData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('year');

  useEffect(() => {
    fetchRevenueData();
  }, []);

  const fetchRevenueData = async () => {
    try {
      const response = await fetch('/api/super-admin/revenue');
      const data = await response.json();
      if (data.success) {
        setRevenueData(data.data);
      }
    } catch (error) {
      console.error('Error fetching revenue data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getTierColor = (tier: string) => {
    switch(tier) {
      case 'BASIC': return '#3B82F6';
      case 'STANDARD': return '#8B5CF6';
      case 'PREMIUM': return '#F59E0B';
      default: return '#6B7280';
    }
  };

  const getTierBadge = (tier: string) => {
    const colors: any = {
      TRIAL: 'bg-gray-100 text-gray-800',
      BASIC: 'bg-blue-100 text-blue-800',
      STANDARD: 'bg-purple-100 text-purple-800',
      PREMIUM: 'bg-gradient-to-r from-yellow-400 to-orange-400 text-white'
    };
    return <Badge className={colors[tier] || 'bg-gray-100'}>{tier}</Badge>;
  };

  const chartOptions: ChartOptions<any> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += formatCurrency(context.parsed.y);
            }
            return label;
          }
        }
      }
    },
    scales: {
      y: {
        ticks: {
          callback: function(value: any) {
            return formatCurrency(value);
          }
        }
      }
    }
  };

  const monthlyChartData = {
    labels: revenueData?.monthlyRevenue.map(m => m.monthName) || [],
    datasets: [
      {
        label: 'Revenue',
        data: revenueData?.monthlyRevenue.map(m => m.revenue) || [],
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        tension: 0.4
      }
    ]
  };

  const tierChartData = {
    labels: revenueData?.tierRevenue.map(t => t.tier) || [],
    datasets: [
      {
        data: revenueData?.tierRevenue.map(t => t.monthlyRevenue) || [],
        backgroundColor: revenueData?.tierRevenue.map(t => getTierColor(t.tier)) || [],
        borderWidth: 0
      }
    ]
  };

  const subscriptionChartData = {
    labels: revenueData?.monthlyRevenue.map(m => m.monthName) || [],
    datasets: [
      {
        label: 'Active Subscriptions',
        data: revenueData?.monthlyRevenue.map(m => m.subscriptions) || [],
        backgroundColor: 'rgba(139, 92, 246, 0.8)',
      }
    ]
  };

  const exportData = () => {
    if (!revenueData) return;
    
    const csvContent = [
      ['Month', 'Revenue', 'Subscriptions'],
      ...revenueData.monthlyRevenue.map(m => [
        m.monthName,
        m.revenue,
        m.subscriptions
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `revenue-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Revenue Analytics</h1>
            <p className="text-gray-600 mt-2">Track revenue trends and financial performance</p>
          </div>
          <Button 
            onClick={exportData}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
          >
            <ArrowDownTrayIcon className="w-5 h-5 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold">{formatCurrency(revenueData?.summary.totalRevenue || 0)}</p>
            </div>
            <BanknotesIcon className="w-8 h-8 text-green-600" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Monthly</p>
              <p className="text-2xl font-bold">{formatCurrency(revenueData?.summary.avgMonthlyRevenue || 0)}</p>
            </div>
            <ChartBarIcon className="w-8 h-8 text-blue-600" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">This Month</p>
              <p className="text-2xl font-bold">{formatCurrency(revenueData?.summary.currentMonthRevenue || 0)}</p>
            </div>
            <CalendarIcon className="w-8 h-8 text-purple-600" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Growth</p>
              <div className="flex items-center gap-2">
                <p className="text-2xl font-bold">{revenueData?.summary.growth || 0}%</p>
                {Number(revenueData?.summary.growth) > 0 ? (
                  <ArrowTrendingUpIcon className="w-5 h-5 text-green-500" />
                ) : (
                  <ArrowTrendingDownIcon className="w-5 h-5 text-red-500" />
                )}
              </div>
            </div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              Number(revenueData?.summary.growth) > 0 ? 'bg-green-100' : 'bg-red-100'
            }`}>
              <div className={`w-3 h-3 rounded-full ${
                Number(revenueData?.summary.growth) > 0 ? 'bg-green-500' : 'bg-red-500'
              }`}></div>
            </div>
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Monthly Revenue Trend</h3>
          <div style={{ height: '300px' }}>
            <Line data={monthlyChartData} options={chartOptions} />
          </div>
        </Card>
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Revenue by Tier</h3>
          <div style={{ height: '300px' }}>
            <Doughnut data={tierChartData} options={{
              ...chartOptions,
              plugins: {
                ...chartOptions.plugins,
                tooltip: {
                  callbacks: {
                    label: function(context: any) {
                      const label = context.label || '';
                      const value = formatCurrency(context.parsed);
                      return `${label}: ${value}`;
                    }
                  }
                }
              }
            }} />
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Subscription Growth</h3>
          <div style={{ height: '300px' }}>
            <Bar data={subscriptionChartData} options={{
              ...chartOptions,
              scales: {
                y: {
                  ticks: {
                    callback: function(value: any) {
                      return value;
                    }
                  }
                }
              },
              plugins: {
                ...chartOptions.plugins,
                tooltip: {
                  callbacks: {
                    label: function(context: any) {
                      return `Subscriptions: ${context.parsed.y}`;
                    }
                  }
                }
              }
            }} />
          </div>
        </Card>

        {/* Tier Distribution */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Tier Distribution</h3>
          <div className="space-y-4">
            {revenueData?.tierRevenue.map((tier) => (
              <div key={tier.tier} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: getTierColor(tier.tier) }}
                  ></div>
                  <span className="font-medium">{tier.tier}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-600">{tier.count} tenants</span>
                  <span className="font-semibold">{formatCurrency(tier.monthlyRevenue)}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Top Tenants */}
      <Card className="overflow-hidden">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold">Top Revenue Generating Tenants</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rank
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tenant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tier
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Users
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Students
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Revenue
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {revenueData?.topTenants.map((tenant, index) => (
                <tr key={tenant.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold">
                      {index + 1}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <BuildingOfficeIcon className="w-5 h-5 text-gray-400 mr-2" />
                      <span className="text-sm font-medium text-gray-900">{tenant.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getTierBadge(tenant.tier)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {tenant.users}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {tenant.students}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-semibold text-gray-900">
                      {formatCurrency(tenant.totalRevenue)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}