'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  CreditCard, 
  Users, 
  Server, 
  Mail, 
  MessageSquare,
  FileText,
  Settings,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Download,
  Eye
} from 'lucide-react'

interface SubscriptionData {
  subscription: {
    id: string
    tier: string
    status: string
    startDate: string
    endDate: string
    nextBillingDate: string
    price: number
    billingCycle: string
    autoRenew: boolean
  }
  usage: {
    usage: {
      students: number
      teachers: number
      storageUsedGB: number
      smsUsedThisMonth: number
      emailsUsedThisMonth: number
      reportsGeneratedThisMonth: number
    }
    limits: {
      maxStudents: number
      maxTeachers: number
      maxStorageGB: number
      maxSMSPerMonth: number
      maxEmailsPerMonth: number
      maxReportsPerMonth: number
    }
    usagePercentages: Record<string, number>
    tier: string
    warnings: Array<{
      limitType: string
      current: number
      limit: number
      percentage: number
      severity: string
    }>
  }
  warnings: Array<any>
  isWithinLimits: boolean
}

interface Invoice {
  id: string
  invoiceNumber: string
  amount: number
  status: string
  dueDate: string
  paidDate?: string
  createdAt: string
}

export default function BillingDashboard() {
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionData | null>(null)
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSubscriptionData()
    fetchInvoices()
  }, [])

  const fetchSubscriptionData = async () => {
    try {
      const response = await fetch('/api/subscription')
      const result = await response.json()
      
      if (result.success) {
        setSubscriptionData(result.data)
      }
    } catch (error) {
      console.error('Failed to fetch subscription data:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchInvoices = async () => {
    try {
      const response = await fetch('/api/invoices?limit=5')
      const result = await response.json()
      
      if (result.success) {
        setInvoices(result.data.invoices)
      }
    } catch (error) {
      console.error('Failed to fetch invoices:', error)
    }
  }

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'default'
      case 'trial':
        return 'secondary'
      case 'cancelled':
      case 'suspended':
        return 'destructive'
      case 'grace_period':
        return 'outline'
      default:
        return 'secondary'
    }
  }

  const getUsageIcon = (type: string) => {
    switch (type) {
      case 'maxStudents':
        return <Users className="h-4 w-4" />
      case 'maxTeachers':
        return <Users className="h-4 w-4" />
      case 'maxStorageGB':
        return <Server className="h-4 w-4" />
      case 'maxSMSPerMonth':
        return <MessageSquare className="h-4 w-4" />
      case 'maxEmailsPerMonth':
        return <Mail className="h-4 w-4" />
      case 'maxReportsPerMonth':
        return <FileText className="h-4 w-4" />
      default:
        return <Settings className="h-4 w-4" />
    }
  }

  const getUsageLabel = (type: string) => {
    const labels = {
      maxStudents: 'Siswa',
      maxTeachers: 'Guru',
      maxStorageGB: 'Penyimpanan (GB)',
      maxSMSPerMonth: 'SMS / Bulan',
      maxEmailsPerMonth: 'Email / Bulan',
      maxReportsPerMonth: 'Laporan / Bulan'
    }
    return labels[type as keyof typeof labels] || type
  }

  const getCurrentUsage = (type: string) => {
    if (!subscriptionData) return 0
    const usageMap = {
      maxStudents: subscriptionData.usage.usage.students,
      maxTeachers: subscriptionData.usage.usage.teachers,
      maxStorageGB: subscriptionData.usage.usage.storageUsedGB,
      maxSMSPerMonth: subscriptionData.usage.usage.smsUsedThisMonth,
      maxEmailsPerMonth: subscriptionData.usage.usage.emailsUsedThisMonth,
      maxReportsPerMonth: subscriptionData.usage.usage.reportsGeneratedThisMonth
    }
    return usageMap[type as keyof typeof usageMap] || 0
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (!subscriptionData) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="flex items-center justify-center h-64">
            <div className="text-center">
              <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Tidak Ada Berlangganan</h3>
              <p className="text-gray-500 mb-4">Anda belum memiliki berlangganan aktif</p>
              <Button>Mulai Berlangganan</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Billing Dashboard</h1>
        <Button>
          <Settings className="h-4 w-4 mr-2" />
          Kelola Berlangganan
        </Button>
      </div>

      {/* Subscription Overview */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paket Saat Ini</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{subscriptionData.subscription.tier}</div>
            <p className="text-xs text-muted-foreground">
              <Badge variant={getStatusBadgeVariant(subscriptionData.subscription.status)}>
                {subscriptionData.subscription.status}
              </Badge>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tagihan Berikutnya</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatPrice(subscriptionData.subscription.price)}
            </div>
            <p className="text-xs text-muted-foreground">
              {new Date(subscriptionData.subscription.nextBillingDate).toLocaleDateString('id-ID')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Status Penggunaan</CardTitle>
            {subscriptionData.isWithinLimits ? (
              <CheckCircle className="h-4 w-4 text-green-500" />
            ) : (
              <AlertTriangle className="h-4 w-4 text-red-500" />
            )}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {subscriptionData.isWithinLimits ? 'Normal' : 'Melampaui Batas'}
            </div>
            <p className="text-xs text-muted-foreground">
              {subscriptionData.warnings.length} peringatan
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Berakhir Pada</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Date(subscriptionData.subscription.endDate).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'short'
              })}
            </div>
            <p className="text-xs text-muted-foreground">
              {subscriptionData.subscription.billingCycle === 'YEARLY' ? 'Tahunan' : 'Bulanan'}
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="usage" className="space-y-6">
        <TabsList>
          <TabsTrigger value="usage">Penggunaan</TabsTrigger>
          <TabsTrigger value="invoices">Tagihan</TabsTrigger>
          <TabsTrigger value="analytics">Analitik</TabsTrigger>
        </TabsList>

        <TabsContent value="usage" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Penggunaan Saat Ini</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {Object.entries(subscriptionData.usage.limits)
                .filter(([key]) => key !== 'dataRetentionMonths')
                .map(([key, limit]) => {
                const percentage = subscriptionData.usage.usagePercentages[key] || 0
                const current = getCurrentUsage(key)
                const isUnlimited = limit === -1
                
                return (
                  <div key={key} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {getUsageIcon(key)}
                        <span className="text-sm font-medium">{getUsageLabel(key)}</span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {isUnlimited ? (
                          <span>Unlimited</span>
                        ) : (
                          <span>{current.toLocaleString()} / {limit.toLocaleString()}</span>
                        )}
                      </div>
                    </div>
                    {!isUnlimited && (
                      <Progress 
                        value={percentage} 
                        className={`h-2 ${
                          percentage >= 90 ? 'bg-red-100' :
                          percentage >= 70 ? 'bg-yellow-100' : 'bg-green-100'
                        }`}
                      />
                    )}
                    {percentage >= 90 && !isUnlimited && (
                      <p className="text-xs text-red-600">
                        Mendekati batas! Pertimbangkan untuk upgrade.
                      </p>
                    )}
                  </div>
                )
              })}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="invoices" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Tagihan Terbaru</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {invoices.map((invoice) => (
                  <div key={invoice.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">{invoice.invoiceNumber}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(invoice.createdAt).toLocaleDateString('id-ID')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{formatPrice(invoice.amount)}</p>
                      <Badge 
                        variant={
                          invoice.status === 'SUCCESS' ? 'default' :
                          invoice.status === 'PENDING' ? 'secondary' :
                          'destructive'
                        }
                      >
                        {invoice.status}
                      </Badge>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                {invoices.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">
                    Belum ada tagihan
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Analitik Penggunaan</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Fitur analitik akan segera hadir...
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}