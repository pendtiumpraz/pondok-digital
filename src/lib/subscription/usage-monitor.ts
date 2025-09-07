import { prisma } from '../prisma'
import { PricingService } from './pricing'
import { 
  Usage, 
  UsageLimits, 
  SubscriptionTier, 
  SubscriptionStatus,
  BillingEvent 
} from './types'

export interface UsageWarning {
  limitType: keyof UsageLimits
  current: number
  limit: number
  percentage: number
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
}

export interface UsageCheckResult {
  isWithinLimits: boolean
  exceededLimits: string[]
  warnings: UsageWarning[]
  blockedOperations: string[]
  recommendedTier?: SubscriptionTier
}

export class UsageMonitor {
  /**
   * Get current usage for an organization
   */
  static async getCurrentUsage(organizationId: string): Promise<Usage> {
    const now = new Date()
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
    
    // Count students
    const studentCount = await prisma.student.count({
      where: { 
        organizationId,
        isActive: true
      }
    })

    // Count teachers/staff
    const teacherCount = await prisma.user.count({
      where: { 
        tenantId: organizationId,
        isActive: true,
        OR: [
          { role: 'TEACHER' },
          { role: 'USTADZ' },
          { isUstadz: true }
        ]
      }
    })

    // Calculate storage usage (approximation)
    const storageUsed = await this.calculateStorageUsage(organizationId)

    // Count API calls this month (if tracking is implemented)
    const apiCallsThisMonth = await this.getApiCallsCount(organizationId, monthStart)

    // Count SMS sent this month
    const smsUsedThisMonth = await this.getSMSUsage(organizationId, monthStart)

    // Count emails sent this month
    const emailsUsedThisMonth = await this.getEmailUsage(organizationId, monthStart)

    // Count reports generated this month
    const reportsThisMonth = await this.getReportsCount(organizationId, monthStart)

    // Count custom fields used
    const customFieldsUsed = await this.getCustomFieldsCount(organizationId)

    return {
      students: studentCount,
      teachers: teacherCount,
      storageUsedGB: storageUsed,
      apiCallsThisMonth,
      smsUsedThisMonth,
      emailsUsedThisMonth,
      reportsGeneratedThisMonth: reportsThisMonth,
      customFieldsUsed,
      lastUpdated: now
    }
  }

  /**
   * Check if organization is within subscription limits
   */
  static async checkUsageLimits(organizationId: string): Promise<UsageCheckResult> {
    // Get organization's subscription
    const subscription = await prisma.subscription?.findFirst({
      where: { 
        organizationId,
        status: 'ACTIVE'
      }
    })

    if (!subscription) {
      throw new Error('No active subscription found')
    }

    const currentUsage = await this.getCurrentUsage(organizationId)
    const plan = PricingService.getPlan(subscription.tier as SubscriptionTier)
    
    if (!plan) {
      throw new Error('Invalid subscription tier')
    }

    const exceededLimits: string[] = []
    const warnings: UsageWarning[] = []
    const blockedOperations: string[] = []

    // Check each limit
    const limits: Array<{key: keyof UsageLimits, usage: number}> = [
      { key: 'maxStudents', usage: currentUsage.students },
      { key: 'maxTeachers', usage: currentUsage.teachers },
      { key: 'maxStorageGB', usage: currentUsage.storageUsedGB },
      { key: 'maxApiCalls', usage: currentUsage.apiCallsThisMonth },
      { key: 'maxSMSPerMonth', usage: currentUsage.smsUsedThisMonth },
      { key: 'maxEmailsPerMonth', usage: currentUsage.emailsUsedThisMonth },
      { key: 'maxReportsPerMonth', usage: currentUsage.reportsGeneratedThisMonth },
      { key: 'customFieldsLimit', usage: currentUsage.customFieldsUsed }
    ]

    for (const { key, usage } of limits) {
      const limit = plan.limits[key]
      
      if (limit === -1) continue // Unlimited
      
      const percentage = limit > 0 ? (usage / limit) * 100 : 0
      
      if (usage > limit) {
        exceededLimits.push(key)
        this.addBlockedOperations(key, blockedOperations)
      } else if (percentage >= 90) {
        warnings.push({
          limitType: key,
          current: usage,
          limit,
          percentage,
          severity: 'CRITICAL'
        })
      } else if (percentage >= 80) {
        warnings.push({
          limitType: key,
          current: usage,
          limit,
          percentage,
          severity: 'HIGH'
        })
      } else if (percentage >= 70) {
        warnings.push({
          limitType: key,
          current: usage,
          limit,
          percentage,
          severity: 'MEDIUM'
        })
      } else if (percentage >= 50) {
        warnings.push({
          limitType: key,
          current: usage,
          limit,
          percentage,
          severity: 'LOW'
        })
      }
    }

    const recommendedTier = exceededLimits.length > 0 
      ? PricingService.getRecommendedTier(currentUsage)
      : undefined

    return {
      isWithinLimits: exceededLimits.length === 0,
      exceededLimits,
      warnings,
      blockedOperations,
      recommendedTier
    }
  }

  /**
   * Enforce usage limits for specific operations
   */
  static async enforceLimit(
    organizationId: string, 
    operation: keyof UsageLimits
  ): Promise<boolean> {
    const usageCheck = await this.checkUsageLimits(organizationId)
    
    const operationMap: Record<keyof UsageLimits, string[]> = {
      maxStudents: ['CREATE_STUDENT', 'IMPORT_STUDENTS'],
      maxTeachers: ['CREATE_TEACHER', 'IMPORT_TEACHERS'],
      maxStorageGB: ['UPLOAD_FILE', 'IMPORT_BULK_DATA'],
      maxApiCalls: ['API_CALL'],
      maxSMSPerMonth: ['SEND_SMS', 'BULK_SMS'],
      maxEmailsPerMonth: ['SEND_EMAIL', 'BULK_EMAIL'],
      maxReportsPerMonth: ['GENERATE_REPORT', 'EXPORT_DATA'],
      customFieldsLimit: ['CREATE_CUSTOM_FIELD'],
      dataRetentionMonths: []
    }

    const blockedOps = operationMap[operation] || []
    
    return !usageCheck.blockedOperations.some(blocked => 
      blockedOps.includes(blocked)
    )
  }

  /**
   * Track usage increment
   */
  static async trackUsage(
    organizationId: string,
    usageType: keyof Usage,
    increment: number = 1
  ): Promise<void> {
    try {
      // Check if operation is allowed before tracking
      const isAllowed = await this.enforceLimit(organizationId, this.mapUsageToLimit(usageType))
      
      if (!isAllowed) {
        throw new Error(`Usage limit exceeded for ${usageType}`)
      }

      // Log the usage (could be stored in a separate usage_logs table)
      await this.logUsageEvent(organizationId, usageType, increment)
      
      // Check if we need to send warnings
      await this.checkAndSendWarnings(organizationId)
      
    } catch (error) {
      console.error('Error tracking usage:', error)
      throw error
    }
  }

  /**
   * Send usage warnings to organization admins
   */
  private static async checkAndSendWarnings(organizationId: string): Promise<void> {
    const usageCheck = await this.checkUsageLimits(organizationId)
    
    for (const warning of usageCheck.warnings) {
      if (warning.severity === 'CRITICAL' || warning.severity === 'HIGH') {
        await this.sendUsageWarning(organizationId, warning)
      }
    }

    if (!usageCheck.isWithinLimits) {
      await this.sendLimitExceededNotification(organizationId, usageCheck)
    }
  }

  /**
   * Calculate approximate storage usage
   */
  private static async calculateStorageUsage(organizationId: string): Promise<number> {
    // This would need to be implemented based on actual file storage
    // For now, return approximate calculation
    try {
      const fileCount = await prisma.ebook?.count({
        where: { organizationId }
      }) || 0

      const avgFileSizeMB = 5 // Average file size estimation
      const totalMB = fileCount * avgFileSizeMB
      
      return Math.ceil(totalMB / 1024) // Convert to GB
    } catch (error) {
      return 0
    }
  }

  /**
   * Get API calls count (would need API tracking implementation)
   */
  private static async getApiCallsCount(organizationId: string, since: Date): Promise<number> {
    // This would require API call logging
    // For now, return 0
    return 0
  }

  /**
   * Get SMS usage count
   */
  private static async getSMSUsage(organizationId: string, since: Date): Promise<number> {
    try {
      // Count from notification or message logs if available
      return await prisma.message?.count({
        where: {
          organizationId,
          type: 'SMS',
          createdAt: { gte: since }
        }
      }) || 0
    } catch (error) {
      return 0
    }
  }

  /**
   * Get email usage count
   */
  private static async getEmailUsage(organizationId: string, since: Date): Promise<number> {
    try {
      return await prisma.message?.count({
        where: {
          organizationId,
          type: 'EMAIL',
          createdAt: { gte: since }
        }
      }) || 0
    } catch (error) {
      return 0
    }
  }

  /**
   * Get reports count
   */
  private static async getReportsCount(organizationId: string, since: Date): Promise<number> {
    try {
      return await prisma.financialReport?.count({
        where: {
          organizationId,
          createdAt: { gte: since }
        }
      }) || 0
    } catch (error) {
      return 0
    }
  }

  /**
   * Get custom fields count
   */
  private static async getCustomFieldsCount(organizationId: string): Promise<number> {
    // This would need custom fields table
    return 0
  }

  /**
   * Add blocked operations based on exceeded limit
   */
  private static addBlockedOperations(limitType: keyof UsageLimits, blockedOps: string[]): void {
    const operationMap: Record<keyof UsageLimits, string[]> = {
      maxStudents: ['CREATE_STUDENT', 'IMPORT_STUDENTS'],
      maxTeachers: ['CREATE_TEACHER', 'IMPORT_TEACHERS'],
      maxStorageGB: ['UPLOAD_FILE', 'IMPORT_BULK_DATA'],
      maxApiCalls: ['API_CALL'],
      maxSMSPerMonth: ['SEND_SMS', 'BULK_SMS'],
      maxEmailsPerMonth: ['SEND_EMAIL', 'BULK_EMAIL'],
      maxReportsPerMonth: ['GENERATE_REPORT', 'EXPORT_DATA'],
      customFieldsLimit: ['CREATE_CUSTOM_FIELD'],
      dataRetentionMonths: []
    }

    const operations = operationMap[limitType] || []
    blockedOps.push(...operations)
  }

  /**
   * Map usage type to limit type
   */
  private static mapUsageToLimit(usageType: keyof Usage): keyof UsageLimits {
    const mapping: Record<keyof Usage, keyof UsageLimits> = {
      students: 'maxStudents',
      teachers: 'maxTeachers',
      storageUsedGB: 'maxStorageGB',
      apiCallsThisMonth: 'maxApiCalls',
      smsUsedThisMonth: 'maxSMSPerMonth',
      emailsUsedThisMonth: 'maxEmailsPerMonth',
      reportsGeneratedThisMonth: 'maxReportsPerMonth',
      customFieldsUsed: 'customFieldsLimit',
      lastUpdated: 'dataRetentionMonths'
    }

    return mapping[usageType] || 'maxStudents'
  }

  /**
   * Log usage event
   */
  private static async logUsageEvent(
    organizationId: string,
    usageType: keyof Usage,
    increment: number
  ): Promise<void> {
    // This could be implemented with a usage_logs table
    console.log(`Usage tracked: ${organizationId} - ${usageType}: +${increment}`)
  }

  /**
   * Send usage warning notification
   */
  private static async sendUsageWarning(
    organizationId: string,
    warning: UsageWarning
  ): Promise<void> {
    try {
      await prisma.billingEvent?.create({
        data: {
          type: 'USAGE_LIMIT_EXCEEDED',
          organizationId,
          subscriptionId: '', // Would need to get from subscription
          data: {
            warning,
            timestamp: new Date().toISOString()
          }
        }
      })
    } catch (error) {
      console.error('Failed to send usage warning:', error)
    }
  }

  /**
   * Send limit exceeded notification
   */
  private static async sendLimitExceededNotification(
    organizationId: string,
    usageCheck: UsageCheckResult
  ): Promise<void> {
    try {
      // Send notification to organization admins
      const admins = await prisma.user.findMany({
        where: {
          tenantId: organizationId,
          role: 'ADMIN',
          isActive: true
        }
      })

      for (const admin of admins) {
        await prisma.notification?.create({
          data: {
            userId: admin.id,
            title: 'Batas Penggunaan Terlampaui',
            message: `Beberapa fitur telah dibatasi karena penggunaan melebihi paket berlangganan. ${usageCheck.recommendedTier ? `Pertimbangkan upgrade ke ${usageCheck.recommendedTier}.` : ''}`,
            type: 'BILLING_ALERT',
            data: {
              exceededLimits: usageCheck.exceededLimits,
              blockedOperations: usageCheck.blockedOperations,
              recommendedTier: usageCheck.recommendedTier
            }
          }
        })
      }
    } catch (error) {
      console.error('Failed to send limit exceeded notification:', error)
    }
  }

  /**
   * Get usage analytics for dashboard
   */
  static async getUsageAnalytics(organizationId: string): Promise<{
    usage: Usage
    limits: UsageLimits
    usagePercentages: Record<keyof UsageLimits, number>
    tier: SubscriptionTier
    warnings: UsageWarning[]
  }> {
    const usage = await this.getCurrentUsage(organizationId)
    const usageCheck = await this.checkUsageLimits(organizationId)
    
    const subscription = await prisma.subscription?.findFirst({
      where: { organizationId, status: 'ACTIVE' }
    })

    const tier = (subscription?.tier as SubscriptionTier) || SubscriptionTier.TRIAL
    const plan = PricingService.getPlan(tier)
    
    if (!plan) {
      throw new Error('Invalid subscription plan')
    }

    const usagePercentages: Record<keyof UsageLimits, number> = {
      maxStudents: PricingService.getUsagePercentage(tier, 'maxStudents', usage.students),
      maxTeachers: PricingService.getUsagePercentage(tier, 'maxTeachers', usage.teachers),
      maxStorageGB: PricingService.getUsagePercentage(tier, 'maxStorageGB', usage.storageUsedGB),
      maxApiCalls: PricingService.getUsagePercentage(tier, 'maxApiCalls', usage.apiCallsThisMonth),
      maxSMSPerMonth: PricingService.getUsagePercentage(tier, 'maxSMSPerMonth', usage.smsUsedThisMonth),
      maxEmailsPerMonth: PricingService.getUsagePercentage(tier, 'maxEmailsPerMonth', usage.emailsUsedThisMonth),
      maxReportsPerMonth: PricingService.getUsagePercentage(tier, 'maxReportsPerMonth', usage.reportsGeneratedThisMonth),
      customFieldsLimit: PricingService.getUsagePercentage(tier, 'customFieldsLimit', usage.customFieldsUsed),
      dataRetentionMonths: 0
    }

    return {
      usage,
      limits: plan.limits,
      usagePercentages,
      tier,
      warnings: usageCheck.warnings
    }
  }
}

export default UsageMonitor