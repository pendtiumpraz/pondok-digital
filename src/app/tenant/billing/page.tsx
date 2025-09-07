'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  CreditCardIcon,
  DocumentTextIcon,
  CurrencyDollarIcon,
  ClockIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  PencilIcon,
  TrashIcon,
  PlusIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  CalendarIcon,
  ChartBarIcon,
  ReceiptRefundIcon,
} from '@heroicons/react/24/outline';

interface BillingData {
  currentPlan: {
    name: string;
    price: number;
    billingCycle: 'monthly' | 'annual';
    users: number;
    storage: number;
    features: string[];
  };
  usage: {
    users: number;
    storage: number;
    bandwidth: number;
    apiCalls: number;
  };
  limits: {
    users: number;
    storage: number;
    bandwidth: number;
    apiCalls: number;
  };
  paymentMethod: {
    type: 'card';
    last4: string;
    brand: string;
    expiryMonth: number;
    expiryYear: number;
  };
  billingAddress: {
    name: string;
    company: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

interface Invoice {
  id: string;
  date: string;
  amount: number;
  status: 'paid' | 'pending' | 'failed';
  description: string;
  downloadUrl: string;
}

const TenantBillingPage = () => {
  const [activeTab, setActiveTab] = useState('overview');
  
  const [billingData] = useState<BillingData>({
    currentPlan: {
      name: 'Professional',
      price: 79,
      billingCycle: 'monthly',
      users: 25,
      storage: 100,
      features: [
        'Up to 25 team members',
        'Advanced dashboard',
        '100GB storage',
        'Priority support',
        'Advanced analytics',
        'Custom integrations',
      ],
    },
    usage: {
      users: 18,
      storage: 45,
      bandwidth: 320,
      apiCalls: 8450,
    },
    limits: {
      users: 25,
      storage: 100,
      bandwidth: 1000,
      apiCalls: 10000,
    },
    paymentMethod: {
      type: 'card',
      last4: '4242',
      brand: 'Visa',
      expiryMonth: 12,
      expiryYear: 2027,
    },
    billingAddress: {
      name: 'John Doe',
      company: 'TechCorp Solutions',
      address: '123 Main Street',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'United States',
    },
  });

  const [invoices] = useState<Invoice[]>([
    {
      id: 'INV-2024-001',
      date: '2024-09-01',
      amount: 79,
      status: 'paid',
      description: 'Professional Plan - September 2024',
      downloadUrl: '#',
    },
    {
      id: 'INV-2024-002',
      date: '2024-08-01',
      amount: 79,
      status: 'paid',
      description: 'Professional Plan - August 2024',
      downloadUrl: '#',
    },
    {
      id: 'INV-2024-003',
      date: '2024-07-01',
      amount: 79,
      status: 'paid',
      description: 'Professional Plan - July 2024',
      downloadUrl: '#',
    },
    {
      id: 'INV-2024-004',
      date: '2024-06-01',
      amount: 79,
      status: 'failed',
      description: 'Professional Plan - June 2024',
      downloadUrl: '#',
    },
  ]);

  const plans = [
    {
      id: 'starter',
      name: 'Starter',
      price: 29,
      features: ['Up to 5 users', 'Basic features', '10GB storage'],
      color: 'from-blue-500 to-indigo-600',
    },
    {
      id: 'pro',
      name: 'Professional',
      price: 79,
      features: ['Up to 25 users', 'Advanced features', '100GB storage'],
      color: 'from-emerald-500 to-green-600',
      current: true,
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 199,
      features: ['Unlimited users', 'All features', 'Unlimited storage'],
      color: 'from-purple-500 to-pink-600',
    },
  ];

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'usage', label: 'Usage & Limits' },
    { id: 'plans', label: 'Plans & Billing' },
    { id: 'payment', label: 'Payment Method' },
    { id: 'invoices', label: 'Invoices' },
    { id: 'billing-address', label: 'Billing Address' },
  ];

  const getUsagePercentage = (used: number, limit: number) => {
    return Math.round((used / limit) * 100);
  };

  const getUsageColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 75) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getInvoiceStatusBadge = (status: Invoice['status']) => {
    const variants = {
      paid: 'success',
      pending: 'warning',
      failed: 'destructive',
    };
    return variants[status];
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Billing & Usage</h1>
              <p className="text-gray-600 mt-1">Manage your subscription, usage, and payment details</p>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline">
                <DocumentTextIcon className="w-4 h-4 mr-2" />
                Download Invoice
              </Button>
              <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                <ArrowUpIcon className="w-4 h-4 mr-2" />
                Upgrade Plan
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Current Plan Overview */}
        <Card className="p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center">
                <CreditCardIcon className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{billingData.currentPlan.name} Plan</h2>
                <p className="text-gray-600">
                  {formatCurrency(billingData.currentPlan.price)} per {billingData.currentPlan.billingCycle}
                </p>
                <p className="text-sm text-green-600 font-medium">Active until October 1, 2024</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-gray-900">
                {formatCurrency(billingData.currentPlan.price)}
              </div>
              <div className="text-gray-600">Next billing: Oct 1</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="space-y-8">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid lg:grid-cols-3 gap-8"
            >
              {/* Usage Summary Cards */}
              <div className="lg:col-span-2 grid md:grid-cols-2 gap-6">
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900">Team Members</h3>
                    <Badge variant="info">{billingData.usage.users}/{billingData.limits.users}</Badge>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                    <div
                      className={`h-3 rounded-full ${getUsageColor(getUsagePercentage(billingData.usage.users, billingData.limits.users))}`}
                      style={{ width: `${getUsagePercentage(billingData.usage.users, billingData.limits.users)}%` }}
                    />
                  </div>
                  <p className="text-sm text-gray-600">
                    {getUsagePercentage(billingData.usage.users, billingData.limits.users)}% of limit used
                  </p>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900">Storage</h3>
                    <Badge variant="info">{billingData.usage.storage}GB/{billingData.limits.storage}GB</Badge>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                    <div
                      className={`h-3 rounded-full ${getUsageColor(getUsagePercentage(billingData.usage.storage, billingData.limits.storage))}`}
                      style={{ width: `${getUsagePercentage(billingData.usage.storage, billingData.limits.storage)}%` }}
                    />
                  </div>
                  <p className="text-sm text-gray-600">
                    {getUsagePercentage(billingData.usage.storage, billingData.limits.storage)}% of limit used
                  </p>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900">Bandwidth</h3>
                    <Badge variant="success">{billingData.usage.bandwidth}GB/{billingData.limits.bandwidth}GB</Badge>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                    <div
                      className={`h-3 rounded-full ${getUsageColor(getUsagePercentage(billingData.usage.bandwidth, billingData.limits.bandwidth))}`}
                      style={{ width: `${getUsagePercentage(billingData.usage.bandwidth, billingData.limits.bandwidth)}%` }}
                    />
                  </div>
                  <p className="text-sm text-gray-600">
                    {getUsagePercentage(billingData.usage.bandwidth, billingData.limits.bandwidth)}% of limit used
                  </p>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900">API Calls</h3>
                    <Badge variant="success">{billingData.usage.apiCalls.toLocaleString()}/{billingData.limits.apiCalls.toLocaleString()}</Badge>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                    <div
                      className={`h-3 rounded-full ${getUsageColor(getUsagePercentage(billingData.usage.apiCalls, billingData.limits.apiCalls))}`}
                      style={{ width: `${getUsagePercentage(billingData.usage.apiCalls, billingData.limits.apiCalls)}%` }}
                    />
                  </div>
                  <p className="text-sm text-gray-600">
                    {getUsagePercentage(billingData.usage.apiCalls, billingData.limits.apiCalls)}% of limit used
                  </p>
                </Card>
              </div>

              {/* Quick Actions */}
              <div className="space-y-6">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start">
                      <ArrowUpIcon className="w-4 h-4 mr-2" />
                      Upgrade Plan
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <PlusIcon className="w-4 h-4 mr-2" />
                      Add Payment Method
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <DocumentTextIcon className="w-4 h-4 mr-2" />
                      View All Invoices
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <PencilIcon className="w-4 h-4 mr-2" />
                      Update Billing Address
                    </Button>
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Method</h3>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-6 bg-blue-600 rounded text-white text-xs flex items-center justify-center font-bold">
                      {billingData.paymentMethod.brand.toUpperCase()}
                    </div>
                    <span className="text-gray-900">•••• {billingData.paymentMethod.last4}</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    Expires {billingData.paymentMethod.expiryMonth}/{billingData.paymentMethod.expiryYear}
                  </p>
                  <Button variant="outline" size="sm">
                    <PencilIcon className="w-4 h-4 mr-2" />
                    Update
                  </Button>
                </Card>
              </div>
            </motion.div>
          )}

          {/* Plans Tab */}
          {activeTab === 'plans' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose Your Plan</h2>
                <p className="text-gray-600">Upgrade or downgrade your plan anytime</p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                {plans.map((plan) => (
                  <Card
                    key={plan.id}
                    className={`p-6 relative ${
                      plan.current ? 'border-2 border-indigo-500' : ''
                    }`}
                  >
                    {plan.current && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <Badge variant="success">Current Plan</Badge>
                      </div>
                    )}
                    
                    <div className={`w-12 h-12 bg-gradient-to-r ${plan.color} rounded-xl flex items-center justify-center mb-4`}>
                      <CreditCardIcon className="w-6 h-6 text-white" />
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                    <div className="text-3xl font-bold text-gray-900 mb-4">
                      {formatCurrency(plan.price)}
                      <span className="text-lg text-gray-600">/month</span>
                    </div>
                    
                    <ul className="space-y-2 mb-6">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2 text-gray-600">
                          <CheckCircleIcon className="w-4 h-4 text-green-500 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    
                    <Button
                      className={`w-full ${
                        plan.current
                          ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                          : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                      }`}
                      disabled={plan.current}
                    >
                      {plan.current ? 'Current Plan' : 'Select Plan'}
                    </Button>
                  </Card>
                ))}
              </div>
            </motion.div>
          )}

          {/* Payment Method Tab */}
          {activeTab === 'payment' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-2xl"
            >
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Method</h2>
                <p className="text-gray-600">Manage your payment methods and billing information</p>
              </div>

              <Card className="p-6 mb-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Current Payment Method</h3>
                  <Badge variant="success">Primary</Badge>
                </div>
                
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-8 bg-blue-600 rounded text-white text-sm flex items-center justify-center font-bold">
                    {billingData.paymentMethod.brand.toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">•••• •••• •••• {billingData.paymentMethod.last4}</p>
                    <p className="text-sm text-gray-600">
                      Expires {billingData.paymentMethod.expiryMonth.toString().padStart(2, '0')}/{billingData.paymentMethod.expiryYear}
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <Button variant="outline">
                    <PencilIcon className="w-4 h-4 mr-2" />
                    Update Card
                  </Button>
                  <Button variant="outline">
                    <TrashIcon className="w-4 h-4 mr-2" />
                    Remove Card
                  </Button>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Add New Payment Method</h3>
                
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input id="cardNumber" placeholder="1234 5678 9012 3456" className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="cardName">Cardholder Name</Label>
                      <Input id="cardName" placeholder="John Doe" className="mt-1" />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="expiryMonth">Month</Label>
                      <select id="expiryMonth" className="mt-1 w-full h-10 border border-gray-300 rounded-md px-3">
                        {Array.from({ length: 12 }, (_, i) => (
                          <option key={i + 1} value={i + 1}>{(i + 1).toString().padStart(2, '0')}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="expiryYear">Year</Label>
                      <select id="expiryYear" className="mt-1 w-full h-10 border border-gray-300 rounded-md px-3">
                        {Array.from({ length: 10 }, (_, i) => (
                          <option key={i} value={2024 + i}>{2024 + i}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="cvv">CVV</Label>
                      <Input id="cvv" placeholder="123" className="mt-1" />
                    </div>
                  </div>
                  
                  <Button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                    <PlusIcon className="w-4 h-4 mr-2" />
                    Add Payment Method
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Invoices Tab */}
          {activeTab === 'invoices' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Invoices & Billing History</h2>
                <p className="text-gray-600">View and download your past invoices</p>
              </div>

              <Card className="p-6">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-2 font-semibold text-gray-700">Invoice</th>
                        <th className="text-left py-3 px-2 font-semibold text-gray-700">Date</th>
                        <th className="text-left py-3 px-2 font-semibold text-gray-700">Description</th>
                        <th className="text-left py-3 px-2 font-semibold text-gray-700">Amount</th>
                        <th className="text-left py-3 px-2 font-semibold text-gray-700">Status</th>
                        <th className="text-left py-3 px-2 font-semibold text-gray-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoices.map((invoice) => (
                        <tr key={invoice.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-4 px-2 font-mono text-sm">{invoice.id}</td>
                          <td className="py-4 px-2 text-gray-700">{formatDate(invoice.date)}</td>
                          <td className="py-4 px-2 text-gray-700">{invoice.description}</td>
                          <td className="py-4 px-2 font-semibold">{formatCurrency(invoice.amount)}</td>
                          <td className="py-4 px-2">
                            <Badge variant={getInvoiceStatusBadge(invoice.status) as any}>{invoice.status.toUpperCase()}</Badge>
                          </td>
                          <td className="py-4 px-2">
                            <div className="flex items-center gap-2">
                              <Button size="sm" variant="outline">
                                <DocumentTextIcon className="w-4 h-4" />
                              </Button>
                              {invoice.status === 'failed' && (
                                <Button size="sm" variant="outline">
                                  <ReceiptRefundIcon className="w-4 h-4" />
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Usage & Limits Tab */}
          {activeTab === 'usage' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Usage & Limits</h2>
                <p className="text-gray-600">Monitor your current usage against plan limits</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {[
                  {
                    title: 'Team Members',
                    used: billingData.usage.users,
                    limit: billingData.limits.users,
                    unit: 'users',
                    icon: '👥',
                  },
                  {
                    title: 'Storage',
                    used: billingData.usage.storage,
                    limit: billingData.limits.storage,
                    unit: 'GB',
                    icon: '💾',
                  },
                  {
                    title: 'Bandwidth',
                    used: billingData.usage.bandwidth,
                    limit: billingData.limits.bandwidth,
                    unit: 'GB',
                    icon: '🌐',
                  },
                  {
                    title: 'API Calls',
                    used: billingData.usage.apiCalls,
                    limit: billingData.limits.apiCalls,
                    unit: 'calls',
                    icon: '🔗',
                  },
                ].map((item, index) => (
                  <Card key={index} className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-2xl">
                        {item.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{item.title}</h3>
                        <p className="text-sm text-gray-600">
                          {item.used.toLocaleString()} / {item.limit.toLocaleString()} {item.unit}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900">
                          {getUsagePercentage(item.used, item.limit)}%
                        </div>
                        <div className="text-sm text-gray-600">used</div>
                      </div>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-4 mb-3">
                      <div
                        className={`h-4 rounded-full transition-all ${getUsageColor(getUsagePercentage(item.used, item.limit))}`}
                        style={{ width: `${getUsagePercentage(item.used, item.limit)}%` }}
                      />
                    </div>
                    
                    {getUsagePercentage(item.used, item.limit) >= 80 && (
                      <div className="flex items-center gap-2 text-sm text-orange-600">
                        <ExclamationTriangleIcon className="w-4 h-4" />
                        <span>Approaching limit - consider upgrading</span>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            </motion.div>
          )}

          {/* Billing Address Tab */}
          {activeTab === 'billing-address' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-2xl"
            >
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Billing Address</h2>
                <p className="text-gray-600">Update your billing address information</p>
              </div>

              <Card className="p-6">
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="billingName">Full Name</Label>
                      <Input
                        id="billingName"
                        value={billingData.billingAddress.name}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="billingCompany">Company</Label>
                      <Input
                        id="billingCompany"
                        value={billingData.billingAddress.company}
                        className="mt-1"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="billingAddress">Address</Label>
                    <Input
                      id="billingAddress"
                      value={billingData.billingAddress.address}
                      className="mt-1"
                    />
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="billingCity">City</Label>
                      <Input
                        id="billingCity"
                        value={billingData.billingAddress.city}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="billingState">State</Label>
                      <Input
                        id="billingState"
                        value={billingData.billingAddress.state}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="billingZip">ZIP Code</Label>
                      <Input
                        id="billingZip"
                        value={billingData.billingAddress.zipCode}
                        className="mt-1"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="billingCountry">Country</Label>
                    <select
                      id="billingCountry"
                      value={billingData.billingAddress.country}
                      className="mt-1 w-full h-10 border border-gray-300 rounded-md px-3"
                    >
                      <option value="United States">United States</option>
                      <option value="Canada">Canada</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="Germany">Germany</option>
                      <option value="France">France</option>
                    </select>
                  </div>
                  
                  <Button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                    Update Billing Address
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TenantBillingPage;