import { PricingPlan, SubscriptionTier, SubscriptionFeatures, UsageLimits } from './types'

// Indonesian Rupiah pricing
export const PRICING_PLANS: PricingPlan[] = [
  {
    tier: SubscriptionTier.TRIAL,
    name: 'Trial Gratis',
    description: 'Coba semua fitur selama 14 hari',
    price: 0,
    billingCycle: 'MONTHLY',
    trialDays: 14,
    features: {
      studentManagement: true,
      teacherManagement: true,
      academicRecords: true,
      financialManagement: true,
      hafalanTracking: true,
      donationCampaigns: false,
      reportGeneration: true,
      bulkOperations: false,
      apiAccess: false,
      customBranding: false,
      priority_support: false,
      dataExport: false,
      integrations: [],
      customReports: false,
      multiTenant: false
    },
    limits: {
      maxStudents: 50,
      maxTeachers: 10,
      maxStorageGB: 1,
      maxApiCalls: 0,
      maxSMSPerMonth: 50,
      maxEmailsPerMonth: 100,
      maxReportsPerMonth: 10,
      customFieldsLimit: 5,
      dataRetentionMonths: 3
    }
  },
  {
    tier: SubscriptionTier.BASIC,
    name: 'Paket Dasar',
    description: 'Cocok untuk pondok pesantren kecil hingga menengah',
    price: 500000,
    billingCycle: 'MONTHLY',
    features: {
      studentManagement: true,
      teacherManagement: true,
      academicRecords: true,
      financialManagement: true,
      hafalanTracking: true,
      donationCampaigns: true,
      reportGeneration: true,
      bulkOperations: true,
      apiAccess: false,
      customBranding: false,
      priority_support: false,
      dataExport: true,
      integrations: ['whatsapp'],
      customReports: false,
      multiTenant: false
    },
    limits: {
      maxStudents: 500,
      maxTeachers: 50,
      maxStorageGB: 10,
      maxApiCalls: 0,
      maxSMSPerMonth: 500,
      maxEmailsPerMonth: 1000,
      maxReportsPerMonth: 50,
      customFieldsLimit: 20,
      dataRetentionMonths: 12
    }
  },
  {
    tier: SubscriptionTier.STANDARD,
    name: 'Paket Standar',
    description: 'Fitur lengkap untuk pondok pesantren menengah hingga besar',
    price: 1000000,
    billingCycle: 'MONTHLY',
    isPopular: true,
    features: {
      studentManagement: true,
      teacherManagement: true,
      academicRecords: true,
      financialManagement: true,
      hafalanTracking: true,
      donationCampaigns: true,
      reportGeneration: true,
      bulkOperations: true,
      apiAccess: true,
      customBranding: true,
      priority_support: false,
      dataExport: true,
      integrations: ['whatsapp', 'email', 'sms'],
      customReports: true,
      multiTenant: false
    },
    limits: {
      maxStudents: 1000,
      maxTeachers: 100,
      maxStorageGB: 50,
      maxApiCalls: 10000,
      maxSMSPerMonth: 2000,
      maxEmailsPerMonth: 5000,
      maxReportsPerMonth: 200,
      customFieldsLimit: 50,
      dataRetentionMonths: 24
    }
  },
  {
    tier: SubscriptionTier.PREMIUM,
    name: 'Paket Premium',
    description: 'Solusi terbaik untuk pondok pesantren besar dengan fitur enterprise',
    price: 2500000,
    billingCycle: 'MONTHLY',
    features: {
      studentManagement: true,
      teacherManagement: true,
      academicRecords: true,
      financialManagement: true,
      hafalanTracking: true,
      donationCampaigns: true,
      reportGeneration: true,
      bulkOperations: true,
      apiAccess: true,
      customBranding: true,
      priority_support: true,
      dataExport: true,
      integrations: ['whatsapp', 'email', 'sms', 'bank_api', 'government_api'],
      customReports: true,
      multiTenant: true
    },
    limits: {
      maxStudents: 2500,
      maxTeachers: 250,
      maxStorageGB: 200,
      maxApiCalls: 50000,
      maxSMSPerMonth: 10000,
      maxEmailsPerMonth: 25000,
      maxReportsPerMonth: 1000,
      customFieldsLimit: 100,
      dataRetentionMonths: 60
    }
  },
  {
    tier: SubscriptionTier.ENTERPRISE,
    name: 'Paket Enterprise',
    description: 'Solusi khusus untuk jaringan pondok pesantren dan organisasi besar',
    price: 0, // Custom pricing
    billingCycle: 'YEARLY',
    isCustom: true,
    features: {
      studentManagement: true,
      teacherManagement: true,
      academicRecords: true,
      financialManagement: true,
      hafalanTracking: true,
      donationCampaigns: true,
      reportGeneration: true,
      bulkOperations: true,
      apiAccess: true,
      customBranding: true,
      priority_support: true,
      dataExport: true,
      integrations: ['all'],
      customReports: true,
      multiTenant: true
    },
    limits: {
      maxStudents: -1, // Unlimited
      maxTeachers: -1, // Unlimited
      maxStorageGB: -1, // Unlimited
      maxApiCalls: -1, // Unlimited
      maxSMSPerMonth: -1, // Unlimited
      maxEmailsPerMonth: -1, // Unlimited
      maxReportsPerMonth: -1, // Unlimited
      customFieldsLimit: -1, // Unlimited
      dataRetentionMonths: -1 // Unlimited
    }
  }
]

// Yearly pricing (with discount)
export const YEARLY_PRICING_PLANS: PricingPlan[] = PRICING_PLANS.map(plan => ({
  ...plan,
  billingCycle: 'YEARLY' as const,
  price: plan.tier === SubscriptionTier.TRIAL ? 0 : 
         plan.tier === SubscriptionTier.ENTERPRISE ? 0 : 
         Math.floor(plan.price * 12 * 0.85) // 15% discount for yearly
}))

export class PricingService {
  /**
   * Get pricing plan by tier
   */
  static getPlan(tier: SubscriptionTier, billingCycle: 'MONTHLY' | 'YEARLY' = 'MONTHLY'): PricingPlan | null {
    const plans = billingCycle === 'YEARLY' ? YEARLY_PRICING_PLANS : PRICING_PLANS
    return plans.find(plan => plan.tier === tier) || null
  }

  /**
   * Get all pricing plans
   */
  static getAllPlans(billingCycle: 'MONTHLY' | 'YEARLY' = 'MONTHLY'): PricingPlan[] {
    return billingCycle === 'YEARLY' ? YEARLY_PRICING_PLANS : PRICING_PLANS
  }

  /**
   * Get available upgrade paths from current tier
   */
  static getUpgradePaths(currentTier: SubscriptionTier): SubscriptionTier[] {
    const tierOrder = [
      SubscriptionTier.TRIAL,
      SubscriptionTier.BASIC,
      SubscriptionTier.STANDARD,
      SubscriptionTier.PREMIUM,
      SubscriptionTier.ENTERPRISE
    ]
    
    const currentIndex = tierOrder.indexOf(currentTier)
    return tierOrder.slice(currentIndex + 1)
  }

  /**
   * Calculate prorated amount for subscription changes
   */
  static calculateProration(
    currentPlan: PricingPlan,
    newPlan: PricingPlan,
    daysRemaining: number,
    totalDaysInCycle: number
  ): number {
    if (currentPlan.tier === SubscriptionTier.TRIAL) {
      return newPlan.price
    }

    const currentDailyRate = currentPlan.price / totalDaysInCycle
    const newDailyRate = newPlan.price / totalDaysInCycle
    
    const unusedCredit = currentDailyRate * daysRemaining
    const newChargeForRemaining = newDailyRate * daysRemaining
    
    return Math.max(0, newChargeForRemaining - unusedCredit)
  }

  /**
   * Format price in Indonesian Rupiah
   */
  static formatPrice(amount: number): string {
    if (amount === 0) return 'Gratis'
    if (amount === -1) return 'Custom' // Enterprise
    
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  /**
   * Calculate discount for yearly billing
   */
  static calculateYearlyDiscount(monthlyPrice: number): number {
    const yearlyPrice = monthlyPrice * 12 * 0.85 // 15% discount
    return (monthlyPrice * 12) - yearlyPrice
  }

  /**
   * Check if feature is available in tier
   */
  static hasFeature(tier: SubscriptionTier, feature: keyof SubscriptionFeatures): boolean {
    const plan = this.getPlan(tier)
    if (!plan) return false
    const featureValue = plan.features[feature]
    // If it's a boolean, return it directly
    if (typeof featureValue === 'boolean') return featureValue
    // If it's an array, check if it has items
    if (Array.isArray(featureValue)) return featureValue.length > 0
    return false
  }

  /**
   * Check if usage is within limits
   */
  static isWithinLimit(
    tier: SubscriptionTier, 
    limitType: keyof UsageLimits, 
    currentUsage: number
  ): boolean {
    const plan = this.getPlan(tier)
    if (!plan) return false
    
    const limit = plan.limits[limitType]
    if (limit === -1) return true // Unlimited
    
    return currentUsage <= limit
  }

  /**
   * Get usage percentage
   */
  static getUsagePercentage(
    tier: SubscriptionTier,
    limitType: keyof UsageLimits,
    currentUsage: number
  ): number {
    const plan = this.getPlan(tier)
    if (!plan) return 0
    
    const limit = plan.limits[limitType]
    if (limit === -1) return 0 // Unlimited
    if (limit === 0) return 0
    
    return Math.min(100, (currentUsage / limit) * 100)
  }

  /**
   * Get recommended tier based on usage
   */
  static getRecommendedTier(usage: Partial<UsageLimits>): SubscriptionTier {
    const plans = PRICING_PLANS.filter(p => p.tier !== SubscriptionTier.TRIAL)
    
    for (const plan of plans) {
      let withinLimits = true
      
      // Check each usage metric
      for (const [key, value] of Object.entries(usage)) {
        if (value && typeof value === 'number') {
          const limit = plan.limits[key as keyof UsageLimits]
          if (limit !== -1 && value > limit) {
            withinLimits = false
            break
          }
        }
      }
      
      if (withinLimits) {
        return plan.tier
      }
    }
    
    return SubscriptionTier.ENTERPRISE
  }
}

export default PricingService