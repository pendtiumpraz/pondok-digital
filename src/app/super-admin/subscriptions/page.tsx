'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  CreditCardIcon,
  ChartBarIcon,
  UserGroupIcon,
  CalendarIcon,
  MagnifyingGlassIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';

interface Subscription {
  id: string;
  organizationId: string;
  organizationName: string;
  organizationSlug: string;
  tier: string;
  status: string;
  startDate: string;
  endDate: string | null;
  trialEndDate: string | null;
  billingPeriod: string;
  features: any;
  maxUsers: number;
  maxStudents: number;
  currentUsers: number;
  currentStudents: number;
  totalInvoices: number;
  totalTransactions: number;
  lastPayment: any;
  monthlyPrice: number;
}

export default function SubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [stats, setStats] = useState({
    active: 0,
    trial: 0,
    expired: 0,
    totalRevenue: 0,
    avgRevenue: 0
  });

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      const response = await fetch('/api/super-admin/subscriptions');
      const data = await response.json();
      if (data.success) {
        setSubscriptions(data.subscriptions);
        calculateStats(data.subscriptions);
      }
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (subs: Subscription[]) => {
    const active = subs.filter(s => s.status === 'ACTIVE').length;
    const trial = subs.filter(s => s.status === 'TRIAL').length;
    const expired = subs.filter(s => s.status === 'EXPIRED' || s.status === 'CANCELLED').length;
    const totalRevenue = subs
      .filter(s => s.status === 'ACTIVE')
      .reduce((sum, s) => sum + s.monthlyPrice, 0);
    const avgRevenue = active > 0 ? totalRevenue / active : 0;

    setStats({ active, trial, expired, totalRevenue, avgRevenue });
  };

  const filteredSubscriptions = subscriptions.filter(sub => {
    const matchesSearch = sub.organizationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          sub.organizationSlug.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || sub.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
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

  const getStatusBadge = (status: string) => {
    const variants: any = {
      ACTIVE: 'success',
      TRIAL: 'secondary',
      EXPIRED: 'destructive',
      CANCELLED: 'outline'
    };
    return <Badge variant={variants[status] || 'outline'}>{status}</Badge>;
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'ACTIVE': return <CheckCircleIcon className="w-4 h-4 text-green-500" />;
      case 'TRIAL': return <ClockIcon className="w-4 h-4 text-blue-500" />;
      case 'EXPIRED': return <XCircleIcon className="w-4 h-4 text-red-500" />;
      default: return null;
    }
  };

  const handleUpgrade = async (subscriptionId: string, currentTier: string) => {
    const nextTier = currentTier === 'BASIC' ? 'STANDARD' : 
                    currentTier === 'STANDARD' ? 'PREMIUM' : 'PREMIUM';
    
    try {
      const response = await fetch('/api/super-admin/subscriptions', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subscriptionId, tier: nextTier, status: 'ACTIVE' })
      });
      
      if (response.ok) {
        fetchSubscriptions();
      }
    } catch (error) {
      console.error('Error upgrading subscription:', error);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Subscriptions Management</h1>
        <p className="text-gray-600 mt-2">Monitor and manage all tenant subscriptions</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-5 gap-4 mb-6">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active</p>
              <p className="text-2xl font-bold">{stats.active}</p>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircleIcon className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Trial</p>
              <p className="text-2xl font-bold">{stats.trial}</p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <ClockIcon className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Expired</p>
              <p className="text-2xl font-bold">{stats.expired}</p>
            </div>
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <XCircleIcon className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Monthly Revenue</p>
              <p className="text-xl font-bold">{formatCurrency(stats.totalRevenue)}</p>
            </div>
            <ChartBarIcon className="w-8 h-8 text-purple-600" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Value</p>
              <p className="text-xl font-bold">{formatCurrency(stats.avgRevenue)}</p>
            </div>
            <CreditCardIcon className="w-8 h-8 text-indigo-600" />
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search organizations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2"
          >
            <option value="all">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="TRIAL">Trial</option>
            <option value="EXPIRED">Expired</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </Card>

      {/* Subscriptions Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Organization
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Plan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usage
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Billing
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Period
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
                  </td>
                </tr>
              ) : filteredSubscriptions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-gray-500">
                    No subscriptions found
                  </td>
                </tr>
              ) : (
                filteredSubscriptions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getStatusIcon(sub.status)}
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">{sub.organizationName}</div>
                          <div className="text-sm text-gray-500">/{sub.organizationSlug}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getTierBadge(sub.tier)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(sub.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <div className="flex items-center gap-2">
                          <UserGroupIcon className="w-4 h-4 text-gray-400" />
                          {sub.currentUsers}/{sub.maxUsers}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <CalendarIcon className="w-4 h-4 text-gray-400" />
                          {sub.currentStudents}/{sub.maxStudents}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">
                        <div className="font-medium text-gray-900">
                          {formatCurrency(sub.monthlyPrice)}
                        </div>
                        <div className="text-gray-500">
                          /{sub.billingPeriod || 'month'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {sub.trialEndDate && (
                          <div>Trial: {new Date(sub.trialEndDate).toLocaleDateString('id-ID')}</div>
                        )}
                        {sub.endDate && (
                          <div>Ends: {new Date(sub.endDate).toLocaleDateString('id-ID')}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        {sub.tier !== 'PREMIUM' && sub.status === 'ACTIVE' && (
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleUpgrade(sub.id, sub.tier)}
                          >
                            <ArrowUpIcon className="w-4 h-4 mr-1" />
                            Upgrade
                          </Button>
                        )}
                        <Button variant="ghost" size="sm">Details</Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}