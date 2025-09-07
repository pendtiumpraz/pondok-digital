import { SubscriptionManager } from './subscription-manager'
import { InvoiceGenerator } from './invoice-generator'
import { MidtransSubscriptionGateway } from './midtrans-subscription'
import { UsageMonitor } from './usage-monitor'
import { prisma } from '../prisma'
import { SubscriptionStatus, SubscriptionTier } from './types'

export interface SchedulerConfig {
  renewalReminderDays: number[]
  gracePeriodDays: number
  suspensionWarningDays: number[]
  usageLimitWarningThresholds: number[]
}

export class SubscriptionScheduler {
  private static readonly DEFAULT_CONFIG: SchedulerConfig = {
    renewalReminderDays: [7, 3, 1], // Send reminders 7, 3, and 1 days before renewal
    gracePeriodDays: 7,
    suspensionWarningDays: [5, 3, 1], // Send suspension warnings during grace period
    usageLimitWarningThresholds: [70, 85, 95] // Send usage warnings at these percentages
  }

  private config: SchedulerConfig

  constructor(config?: Partial<SchedulerConfig>) {
    this.config = { ...SubscriptionScheduler.DEFAULT_CONFIG, ...config }
  }

  /**
   * Main scheduler function - should be called daily via cron job
   */
  async runDailyScheduler(): Promise<void> {
    try {
      console.log('Starting subscription scheduler...')
      
      await Promise.all([
        this.processRenewalReminders(),
        this.processAutomaticRenewals(),
        this.processGracePeriodExpirations(),
        this.processTrialExpirations(),
        this.processUsageLimitWarnings(),
        this.processOverdueInvoices(),
        this.cleanupExpiredData()
      ])
      
      console.log('Subscription scheduler completed successfully')
    } catch (error) {
      console.error('Error in subscription scheduler:', error)
      throw error
    }
  }

  /**
   * Send renewal reminders
   */
  async processRenewalReminders(): Promise<void> {
    console.log('Processing renewal reminders...')
    
    for (const days of this.config.renewalReminderDays) {
      const targetDate = new Date()
      targetDate.setDate(targetDate.getDate() + days)
      targetDate.setHours(0, 0, 0, 0)
      
      const nextDay = new Date(targetDate)
      nextDay.setDate(nextDay.getDate() + 1)

      const subscriptions = await prisma.subscription?.findMany({
        where: {
          status: SubscriptionStatus.ACTIVE,
          autoRenew: true,
          nextBillingDate: {
            gte: targetDate,
            lt: nextDay
          }
        },
        include: {
          tenant: true
        }
      })

      if (!subscriptions) continue

      for (const subscription of subscriptions) {
        try {
          await this.sendRenewalReminder(subscription, days)
        } catch (error) {
          console.error(`Failed to send renewal reminder for subscription ${subscription.id}:`, error)
        }
      }
    }
  }

  /**
   * Process automatic renewals
   */
  async processAutomaticRenewals(): Promise<void> {
    console.log('Processing automatic renewals...')
    
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const subscriptionsToRenew = await prisma.subscription?.findMany({
      where: {
        status: SubscriptionStatus.ACTIVE,
        autoRenew: true,
        nextBillingDate: {
          gte: today,
          lt: tomorrow
        }
      },
      include: {
        tenant: true
      }
    })

    if (!subscriptionsToRenew) return

    const gateway = new MidtransSubscriptionGateway()

    for (const subscription of subscriptionsToRenew) {
      try {
        console.log(`Processing renewal for subscription ${subscription.id}`)
        
        // Try to process recurring payment
        const result = await gateway.processRecurringPayment(subscription.id)
        
        if (result.success) {
          console.log(`Auto-renewal successful for subscription ${subscription.id}`)
          await this.sendRenewalSuccessNotification(subscription)
        } else {
          console.log(`Auto-renewal failed for subscription ${subscription.id}, starting grace period`)
          await SubscriptionManager.handleExpiredSubscription(subscription.id)
          await this.sendRenewalFailedNotification(subscription, result.error)
        }
        
      } catch (error) {
        console.error(`Failed to auto-renew subscription ${subscription.id}:`, error)
        
        try {
          await SubscriptionManager.handleExpiredSubscription(subscription.id)
          await this.sendRenewalFailedNotification(subscription, 'Technical error during renewal')
        } catch (fallbackError) {
          console.error(`Failed to handle renewal failure for ${subscription.id}:`, fallbackError)
        }
      }
    }
  }

  /**
   * Process grace period expirations
   */
  async processGracePeriodExpirations(): Promise<void> {
    console.log('Processing grace period expirations...')
    
    const today = new Date()
    today.setHours(23, 59, 59, 999)

    // Send warnings during grace period
    for (const days of this.config.suspensionWarningDays) {
      const warningDate = new Date()
      warningDate.setDate(warningDate.getDate() + days)
      warningDate.setHours(0, 0, 0, 0)
      
      const nextDay = new Date(warningDate)
      nextDay.setDate(nextDay.getDate() + 1)

      const subscriptionsForWarning = await prisma.subscription?.findMany({
        where: {
          status: SubscriptionStatus.GRACE_PERIOD,
          gracePeriodEndDate: {
            gte: warningDate,
            lt: nextDay
          }
        },
        include: {
          tenant: true
        }
      })

      if (subscriptionsForWarning) {
        for (const subscription of subscriptionsForWarning) {
          try {
            await this.sendSuspensionWarning(subscription, days)
          } catch (error) {
            console.error(`Failed to send suspension warning for ${subscription.id}:`, error)
          }
        }
      }
    }

    // Suspend expired grace period subscriptions
    const expiredSubscriptions = await prisma.subscription?.findMany({
      where: {
        status: SubscriptionStatus.GRACE_PERIOD,
        gracePeriodEndDate: {
          lte: today
        }
      }
    })

    if (expiredSubscriptions) {
      for (const subscription of expiredSubscriptions) {
        try {
          await SubscriptionManager.suspendSubscription(subscription.id)
          await this.sendSubscriptionSuspendedNotification(subscription)
        } catch (error) {
          console.error(`Failed to suspend subscription ${subscription.id}:`, error)
        }
      }
    }
  }

  /**
   * Process trial expirations
   */
  async processTrialExpirations(): Promise<void> {
    console.log('Processing trial expirations...')
    
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    // Send trial expiration warnings (1 day before)
    const trialExpiringTomorrow = await prisma.subscription?.findMany({
      where: {
        status: SubscriptionStatus.TRIAL,
        trialEndDate: {
          gte: today,
          lt: tomorrow
        }
      },
      include: {
        tenant: true
      }
    })

    if (trialExpiringTomorrow) {
      for (const subscription of trialExpiringTomorrow) {
        try {
          await this.sendTrialExpiringNotification(subscription)
        } catch (error) {
          console.error(`Failed to send trial expiring notification for ${subscription.id}:`, error)
        }
      }
    }

    // Expire trials that ended today
    const trialsToExpire = await prisma.subscription?.findMany({
      where: {
        status: SubscriptionStatus.TRIAL,
        trialEndDate: {
          lt: today
        }
      }
    })

    if (trialsToExpire) {
      for (const subscription of trialsToExpire) {
        try {
          await prisma.subscription?.update({
            where: { id: subscription.id },
            data: {
              status: SubscriptionStatus.EXPIRED,
              updatedAt: new Date()
            }
          })
          
          await this.sendTrialExpiredNotification(subscription)
        } catch (error) {
          console.error(`Failed to expire trial for subscription ${subscription.id}:`, error)
        }
      }
    }
  }

  /**
   * Process usage limit warnings
   */
  async processUsageLimitWarnings(): Promise<void> {
    console.log('Processing usage limit warnings...')
    
    const activeSubscriptions = await prisma.subscription?.findMany({
      where: {
        status: { in: [SubscriptionStatus.ACTIVE, SubscriptionStatus.TRIAL] }
      }
    })

    if (!activeSubscriptions) return

    for (const subscription of activeSubscriptions) {
      try {
        const usageAnalytics = await UsageMonitor.getUsageAnalytics(subscription.organizationId)
        
        // Check each usage metric
        for (const [limitType, percentage] of Object.entries(usageAnalytics.usagePercentages)) {
          for (const threshold of this.config.usageLimitWarningThresholds) {
            if (percentage >= threshold && percentage < threshold + 5) { // Small window to avoid spam
              await this.sendUsageLimitWarning(subscription, limitType, percentage)
              break
            }
          }
        }
        
        // Check for exceeded limits
        const usageCheck = await UsageMonitor.checkUsageLimits(subscription.organizationId)
        if (!usageCheck.isWithinLimits) {
          await this.sendUsageLimitExceededNotification(subscription, usageCheck)
        }
        
      } catch (error) {
        console.error(`Failed to check usage for subscription ${subscription.id}:`, error)
      }
    }
  }

  /**
   * Process overdue invoices
   */
  async processOverdueInvoices(): Promise<void> {
    console.log('Processing overdue invoices...')
    
    try {
      await InvoiceGenerator.processOverdueInvoices()
    } catch (error) {
      console.error('Failed to process overdue invoices:', error)
    }
  }

  /**
   * Cleanup expired data
   */
  async cleanupExpiredData(): Promise<void> {
    console.log('Cleaning up expired data...')
    
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

    try {
      await prisma.billingEvent?.deleteMany({
        where: {
          createdAt: { lt: sixMonthsAgo }
        }
      })

      // Clean up old notifications
      await prisma.notification?.deleteMany({
        where: {
          type: 'BILLING_ALERT',
          createdAt: { lt: sixMonthsAgo },
          isRead: true
        }
      })

    } catch (error) {
      console.error('Failed to cleanup expired data:', error)
    }
  }

  /**
   * Send renewal reminder notification
   */
  private async sendRenewalReminder(subscription: any, daysUntilRenewal: number): Promise<void> {
    const admins = await prisma.user.findMany({
      where: {
        tenantId: subscription.organizationId,
        role: 'ADMIN',
        isActive: true
      }
    })

    const message = `Berlangganan ${subscription.tier} akan diperpanjang dalam ${daysUntilRenewal} hari. ` +
                   `Pastikan saldo atau metode pembayaran Anda mencukupi.`

    for (const admin of admins) {
      await prisma.notification?.create({
        data: {
          userId: admin.id,
          title: 'Reminder Perpanjangan Berlangganan',
          message,
          type: 'BILLING_ALERT',
          data: JSON.stringify({
            subscriptionId: subscription.id,
            daysUntilRenewal,
            amount: subscription.price,
            tier: subscription.tier
          })
        }
      })
    }
  }

  /**
   * Send renewal success notification
   */
  private async sendRenewalSuccessNotification(subscription: any): Promise<void> {
    const admins = await prisma.user.findMany({
      where: {
        tenantId: subscription.organizationId,
        role: 'ADMIN',
        isActive: true
      }
    })

    const message = `Berlangganan ${subscription.tier} berhasil diperpanjang hingga ${subscription.endDate.toLocaleDateString('id-ID')}.`

    for (const admin of admins) {
      await prisma.notification?.create({
        data: {
          userId: admin.id,
          title: 'Berlangganan Diperpanjang',
          message,
          type: 'BILLING_SUCCESS',
          data: JSON.stringify({
            subscriptionId: subscription.id,
            tier: subscription.tier,
            endDate: subscription.endDate
          })
        }
      })
    }
  }

  /**
   * Send renewal failed notification
   */
  private async sendRenewalFailedNotification(subscription: any, error?: string): Promise<void> {
    const admins = await prisma.user.findMany({
      where: {
        tenantId: subscription.organizationId,
        role: 'ADMIN',
        isActive: true
      }
    })

    const message = `Perpanjangan otomatis berlangganan ${subscription.tier} gagal. ` +
                   `Anda memiliki masa tenggang ${this.config.gracePeriodDays} hari untuk menyelesaikan pembayaran.`

    for (const admin of admins) {
      await prisma.notification?.create({
        data: {
          userId: admin.id,
          title: 'Perpanjangan Berlangganan Gagal',
          message,
          type: 'BILLING_ALERT',
          data: JSON.stringify({
            subscriptionId: subscription.id,
            tier: subscription.tier,
            error,
            gracePeriodDays: this.config.gracePeriodDays
          })
        }
      })
    }
  }

  /**
   * Send suspension warning
   */
  private async sendSuspensionWarning(subscription: any, daysUntilSuspension: number): Promise<void> {
    const admins = await prisma.user.findMany({
      where: {
        tenantId: subscription.organizationId,
        role: 'ADMIN',
        isActive: true
      }
    })

    const message = `Akun akan dinonaktifkan dalam ${daysUntilSuspension} hari karena pembayaran tertunggak. ` +
                   `Segera lakukan pembayaran untuk menghindari penangguhan layanan.`

    for (const admin of admins) {
      await prisma.notification?.create({
        data: {
          userId: admin.id,
          title: 'Peringatan Penangguhan Akun',
          message,
          type: 'BILLING_CRITICAL',
          data: JSON.stringify({
            subscriptionId: subscription.id,
            daysUntilSuspension,
            tier: subscription.tier
          })
        }
      })
    }
  }

  /**
   * Send subscription suspended notification
   */
  private async sendSubscriptionSuspendedNotification(subscription: any): Promise<void> {
    const admins = await prisma.user.findMany({
      where: {
        tenantId: subscription.organizationId,
        role: 'ADMIN',
        isActive: true
      }
    })

    const message = `Akun telah dinonaktifkan karena pembayaran tertunggak. ` +
                   `Hubungi customer service untuk mengaktifkan kembali layanan.`

    for (const admin of admins) {
      await prisma.notification?.create({
        data: {
          userId: admin.id,
          title: 'Akun Dinonaktifkan',
          message,
          type: 'BILLING_CRITICAL',
          data: JSON.stringify({
            subscriptionId: subscription.id,
            tier: subscription.tier,
            suspendedAt: new Date()
          })
        }
      })
    }
  }

  /**
   * Send trial expiring notification
   */
  private async sendTrialExpiringNotification(subscription: any): Promise<void> {
    const admins = await prisma.user.findMany({
      where: {
        tenantId: subscription.organizationId,
        role: 'ADMIN',
        isActive: true
      }
    })

    const message = `Masa trial akan berakhir besok. Upgrade ke paket berbayar untuk melanjutkan menggunakan layanan.`

    for (const admin of admins) {
      await prisma.notification?.create({
        data: {
          userId: admin.id,
          title: 'Trial Akan Berakhir',
          message,
          type: 'BILLING_ALERT',
          data: JSON.stringify({
            subscriptionId: subscription.id,
            trialEndDate: subscription.trialEndDate
          })
        }
      })
    }
  }

  /**
   * Send trial expired notification
   */
  private async sendTrialExpiredNotification(subscription: any): Promise<void> {
    const admins = await prisma.user.findMany({
      where: {
        tenantId: subscription.organizationId,
        role: 'ADMIN',
        isActive: true
      }
    })

    const message = `Masa trial telah berakhir. Upgrade ke paket berbayar untuk melanjutkan menggunakan layanan penuh.`

    for (const admin of admins) {
      await prisma.notification?.create({
        data: {
          userId: admin.id,
          title: 'Trial Berakhir',
          message,
          type: 'BILLING_CRITICAL',
          data: JSON.stringify({
            subscriptionId: subscription.id,
            expiredAt: new Date()
          })
        }
      })
    }
  }

  /**
   * Send usage limit warning
   */
  private async sendUsageLimitWarning(subscription: any, limitType: string, percentage: number): Promise<void> {
    const admins = await prisma.user.findMany({
      where: {
        tenantId: subscription.organizationId,
        role: 'ADMIN',
        isActive: true
      }
    })

    const limitTypeText = this.getLimitTypeText(limitType)
    const message = `Penggunaan ${limitTypeText} telah mencapai ${percentage.toFixed(0)}% dari batas paket ${subscription.tier}. ` +
                   `Pertimbangkan untuk upgrade jika diperlukan.`

    for (const admin of admins) {
      await prisma.notification?.create({
        data: {
          userId: admin.id,
          title: 'Peringatan Batas Penggunaan',
          message,
          type: 'USAGE_WARNING',
          data: JSON.stringify({
            subscriptionId: subscription.id,
            limitType,
            percentage,
            tier: subscription.tier
          })
        }
      })
    }
  }

  /**
   * Send usage limit exceeded notification
   */
  private async sendUsageLimitExceededNotification(subscription: any, usageCheck: any): Promise<void> {
    const admins = await prisma.user.findMany({
      where: {
        tenantId: subscription.organizationId,
        role: 'ADMIN',
        isActive: true
      }
    })

    const exceededLimitsText = usageCheck.exceededLimits
      .map((limit: string) => this.getLimitTypeText(limit))
      .join(', ')

    const message = `Batas penggunaan terlampaui: ${exceededLimitsText}. ` +
                   `Beberapa fitur mungkin dibatasi. Upgrade paket untuk menghilangkan batasan.`

    for (const admin of admins) {
      await prisma.notification?.create({
        data: {
          userId: admin.id,
          title: 'Batas Penggunaan Terlampaui',
          message,
          type: 'USAGE_CRITICAL',
          data: JSON.stringify({
            subscriptionId: subscription.id,
            exceededLimits: usageCheck.exceededLimits,
            recommendedTier: usageCheck.recommendedTier,
            tier: subscription.tier
          })
        }
      })
    }
  }

  /**
   * Get human-readable limit type text
   */
  private getLimitTypeText(limitType: string): string {
    const translations: Record<string, string> = {
      maxStudents: 'jumlah siswa',
      maxTeachers: 'jumlah guru',
      maxStorageGB: 'kapasitas penyimpanan',
      maxApiCalls: 'panggilan API',
      maxSMSPerMonth: 'SMS per bulan',
      maxEmailsPerMonth: 'email per bulan',
      maxReportsPerMonth: 'laporan per bulan',
      customFieldsLimit: 'field kustom'
    }
    
    return translations[limitType] || limitType
  }
}

export default SubscriptionScheduler