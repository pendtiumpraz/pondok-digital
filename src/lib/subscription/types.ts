export enum SubscriptionTier {
  TRIAL = 'TRIAL',
  BASIC = 'BASIC',
  STANDARD = 'STANDARD',
  PREMIUM = 'PREMIUM',
  ENTERPRISE = 'ENTERPRISE'
}

export enum SubscriptionStatus {
  ACTIVE = 'ACTIVE',
  CANCELLED = 'CANCELLED',
  EXPIRED = 'EXPIRED',
  SUSPENDED = 'SUSPENDED',
  TRIAL = 'TRIAL',
  GRACE_PERIOD = 'GRACE_PERIOD'
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED'
}

export interface PaymentNotification {
  transaction_time: string
  transaction_status: string
  transaction_id: string
  status_message: string
  status_code: string
  signature_key: string
  payment_type: string
  order_id: string
  merchant_id: string
  masked_card?: string
  gross_amount: string
  fraud_status?: string
  approval_code?: string
  currency?: string
}

export interface PricingPlan {
  tier: SubscriptionTier
  name: string
  description: string
  price: number
  billingCycle: 'MONTHLY' | 'YEARLY'
  trialDays?: number
  features: SubscriptionFeatures
  limits: UsageLimits
  isPopular?: boolean
  isCustom?: boolean
}

export interface SubscriptionFeatures {
  studentManagement: boolean
  teacherManagement: boolean
  academicRecords: boolean
  financialManagement: boolean
  hafalanTracking: boolean
  donationCampaigns: boolean
  reportGeneration: boolean
  bulkOperations: boolean
  apiAccess: boolean
  customBranding: boolean
  priority_support: boolean
  dataExport: boolean
  integrations: string[]
  customReports: boolean
  multiTenant: boolean
}

export interface UsageLimits {
  maxStudents: number
  maxTeachers: number
  maxStorageGB: number
  maxApiCalls: number
  maxSMSPerMonth: number
  maxEmailsPerMonth: number
  maxReportsPerMonth: number
  customFieldsLimit: number
  dataRetentionMonths: number
}

export interface Usage {
  students: number
  teachers: number
  storageUsedGB: number
  apiCallsThisMonth: number
  smsUsedThisMonth: number
  emailsUsedThisMonth: number
  reportsGeneratedThisMonth: number
  customFieldsUsed: number
  lastUpdated: Date
}

export interface Subscription {
  id: string
  organizationId: string
  tier: SubscriptionTier
  status: SubscriptionStatus
  startDate: Date
  endDate: Date
  trialEndDate?: Date
  isTrialUsed: boolean
  gracePeriodEndDate?: Date
  autoRenew: boolean
  currentPeriodStart: Date
  currentPeriodEnd: Date
  billingCycle: 'MONTHLY' | 'YEARLY'
  price: number
  currency: string
  usage: Usage
  limits: UsageLimits
  features: SubscriptionFeatures
  createdAt: Date
  updatedAt: Date
  cancelledAt?: Date
  cancelReason?: string
  nextBillingDate?: Date
  lastPaymentDate?: Date
  paymentMethod?: string
  discountPercent?: number
  discountEndDate?: Date
}

export interface Invoice {
  id: string
  subscriptionId: string
  organizationId: string
  invoiceNumber: string
  amount: number
  currency: string
  status: PaymentStatus
  dueDate: Date
  paidDate?: Date
  items: InvoiceItem[]
  subtotal: number
  tax: number
  discount: number
  total: number
  paymentMethod?: string
  transactionId?: string
  notes?: string
  createdAt: Date
  updatedAt: Date
}

export interface InvoiceItem {
  id: string
  description: string
  quantity: number
  unitPrice: number
  amount: number
  period?: {
    start: Date
    end: Date
  }
}

export interface PaymentTransaction {
  id: string
  invoiceId: string
  subscriptionId: string
  organizationId: string
  amount: number
  currency: string
  status: PaymentStatus
  paymentMethod: string
  paymentGateway: 'MIDTRANS'
  gatewayTransactionId?: string
  gatewayResponse?: any
  paidAt?: Date
  failureReason?: string
  refundedAt?: Date
  refundAmount?: number
  createdAt: Date
  updatedAt: Date
}

export interface SubscriptionAnalytics {
  totalRevenue: number
  monthlyRecurringRevenue: number
  annualRecurringRevenue: number
  averageRevenuePerUser: number
  customerLifetimeValue: number
  churnRate: number
  growthRate: number
  trialConversionRate: number
  subscriptionsByTier: Record<SubscriptionTier, number>
  paymentSuccessRate: number
  subscriptionRetentionRate: number
}

export interface BillingEvent {
  id: string
  type: 'SUBSCRIPTION_CREATED' | 'SUBSCRIPTION_RENEWED' | 'SUBSCRIPTION_CANCELLED' | 
        'SUBSCRIPTION_EXPIRED' | 'PAYMENT_SUCCESS' | 'PAYMENT_FAILED' | 'INVOICE_GENERATED' |
        'TRIAL_STARTED' | 'TRIAL_ENDED' | 'GRACE_PERIOD_STARTED' | 'USAGE_LIMIT_EXCEEDED'
  subscriptionId: string
  organizationId: string
  data: any
  createdAt: Date
}

export interface NotificationPreferences {
  subscriptionExpiring: boolean
  paymentFailed: boolean
  usageLimitWarning: boolean
  invoiceGenerated: boolean
  trialExpiring: boolean
}