import { prisma } from '../prisma'
import { PricingService } from './pricing'
import { UsageMonitor } from './usage-monitor'
import { 
  Subscription, 
  SubscriptionTier, 
  SubscriptionStatus, 
  BillingEvent,
  PricingPlan 
} from './types'

export interface CreateSubscriptionParams {
  organizationId: string
  tier: SubscriptionTier
  billingCycle: 'MONTHLY' | 'YEARLY'
  startDate?: Date
  paymentMethod?: string
  discountPercent?: number
  discountEndDate?: Date
}

export interface SubscriptionChangeParams {
  subscriptionId: string
  newTier: SubscriptionTier
  newBillingCycle?: 'MONTHLY' | 'YEARLY'
  effectiveDate?: Date
  prorationOption?: 'IMMEDIATE' | 'END_OF_CYCLE'
}

export class SubscriptionManager {
  /**
   * Create a new subscription
   */
  static async createSubscription(params: CreateSubscriptionParams): Promise<string> {
    const plan = PricingService.getPlan(params.tier, params.billingCycle)
    if (!plan) {
      throw new Error('Invalid subscription tier or billing cycle')
    }

    const startDate = params.startDate || new Date()
    const endDate = this.calculateEndDate(startDate, params.billingCycle)
    
    let trialEndDate: Date | undefined
    if (params.tier === SubscriptionTier.TRIAL && plan.trialDays) {
      trialEndDate = new Date(startDate.getTime() + (plan.trialDays * 24 * 60 * 60 * 1000))
    }

    try {
      // Check if organization already has an active subscription
      const existingSubscription = await prisma.subscription?.findFirst({
        where: {
          organizationId: params.organizationId,
          status: { in: ['ACTIVE', 'TRIAL'] }
        }
      })

      if (existingSubscription) {
        throw new Error('Organization already has an active subscription')
      }

      // Create the subscription
      const subscription = await prisma.subscription?.create({
        data: {
          organizationId: params.organizationId,
          tier: params.tier,
          status: params.tier === SubscriptionTier.TRIAL ? SubscriptionStatus.TRIAL : SubscriptionStatus.ACTIVE,
          startDate,
          endDate,
          trialEndDate,
          isTrialUsed: params.tier === SubscriptionTier.TRIAL,
          autoRenew: params.tier !== SubscriptionTier.TRIAL,
          currentPeriodStart: startDate,
          currentPeriodEnd: endDate,
          billingCycle: params.billingCycle,
          price: plan.price,
          currency: 'IDR',
          paymentMethod: params.paymentMethod,
          discountPercent: params.discountPercent,
          discountEndDate: params.discountEndDate,
          nextBillingDate: params.tier !== SubscriptionTier.TRIAL ? endDate : undefined
        }
      })

      if (!subscription) {
        throw new Error('Failed to create subscription')
      }

      // Create billing event
      await this.createBillingEvent({
        type: 'SUBSCRIPTION_CREATED',
        subscriptionId: subscription.id,
        organizationId: params.organizationId,
        data: {
          tier: params.tier,
          billingCycle: params.billingCycle,
          price: plan.price
        }
      })

      // Start trial event if applicable
      if (params.tier === SubscriptionTier.TRIAL) {
        await this.createBillingEvent({
          type: 'TRIAL_STARTED',
          subscriptionId: subscription.id,
          organizationId: params.organizationId,
          data: {
            trialEndDate,
            trialDays: plan.trialDays
          }
        })
      }

      return subscription.id
    } catch (error) {
      console.error('Error creating subscription:', error)
      throw error
    }
  }

  /**
   * Change subscription tier or billing cycle
   */
  static async changeSubscription(params: SubscriptionChangeParams): Promise<void> {
    const subscription = await prisma.subscription?.findUnique({
      where: { id: params.subscriptionId }
    })

    if (!subscription) {
      throw new Error('Subscription not found')
    }

    const currentPlan = PricingService.getPlan(subscription.tier as SubscriptionTier, subscription.billingCycle as any)
    const newPlan = PricingService.getPlan(params.newTier, params.newBillingCycle || subscription.billingCycle as any)
    
    if (!currentPlan || !newPlan) {
      throw new Error('Invalid subscription plan')
    }

    const effectiveDate = params.effectiveDate || new Date()
    let prorationAmount = 0

    // Calculate proration if changing immediately
    if (params.prorationOption === 'IMMEDIATE') {
      const daysRemaining = Math.ceil((subscription.currentPeriodEnd.getTime() - effectiveDate.getTime()) / (1000 * 60 * 60 * 24))
      const totalDays = subscription.billingCycle === 'YEARLY' ? 365 : 30
      
      prorationAmount = PricingService.calculateProration(
        currentPlan, 
        newPlan, 
        daysRemaining, 
        totalDays
      )
    }

    try {
      // Update subscription
      const newEndDate = params.prorationOption === 'IMMEDIATE' 
        ? this.calculateEndDate(effectiveDate, params.newBillingCycle || subscription.billingCycle as any)
        : subscription.endDate

      await prisma.subscription?.update({
        where: { id: params.subscriptionId },
        data: {
          tier: params.newTier,
          billingCycle: params.newBillingCycle || subscription.billingCycle,
          price: newPlan.price,
          ...(params.prorationOption === 'IMMEDIATE' && {
            currentPeriodStart: effectiveDate,
            currentPeriodEnd: newEndDate,
            endDate: newEndDate,
            nextBillingDate: newEndDate
          }),
          updatedAt: new Date()
        }
      })

      // Create billing event
      await this.createBillingEvent({
        type: 'SUBSCRIPTION_RENEWED', // This could be a new event type like SUBSCRIPTION_CHANGED
        subscriptionId: params.subscriptionId,
        organizationId: subscription.organizationId,
        data: {
          oldTier: subscription.tier,
          newTier: params.newTier,
          oldPrice: subscription.price,
          newPrice: newPlan.price,
          prorationAmount,
          effectiveDate,
          changeType: params.prorationOption
        }
      })

      // Generate invoice for proration if needed
      if (prorationAmount > 0) {
        await this.generateInvoice(params.subscriptionId, prorationAmount, 'Subscription Change Proration')
      }

    } catch (error) {
      console.error('Error changing subscription:', error)
      throw error
    }
  }

  /**
   * Cancel subscription
   */
  static async cancelSubscription(
    subscriptionId: string, 
    reason?: string, 
    effectiveDate?: Date
  ): Promise<void> {
    const subscription = await prisma.subscription?.findUnique({
      where: { id: subscriptionId }
    })

    if (!subscription) {
      throw new Error('Subscription not found')
    }

    const cancelDate = effectiveDate || new Date()
    
    try {
      await prisma.subscription?.update({
        where: { id: subscriptionId },
        data: {
          status: SubscriptionStatus.CANCELLED,
          autoRenew: false,
          cancelledAt: cancelDate,
          cancelReason: reason,
          updatedAt: new Date()
        }
      })

      await this.createBillingEvent({
        type: 'SUBSCRIPTION_CANCELLED',
        subscriptionId,
        organizationId: subscription.organizationId,
        data: {
          cancelledAt: cancelDate,
          reason,
          remainingDays: Math.ceil((subscription.endDate.getTime() - cancelDate.getTime()) / (1000 * 60 * 60 * 24))
        }
      })

    } catch (error) {
      console.error('Error cancelling subscription:', error)
      throw error
    }
  }

  /**
   * Renew subscription
   */
  static async renewSubscription(subscriptionId: string, paymentTransactionId?: string): Promise<void> {
    const subscription = await prisma.subscription?.findUnique({
      where: { id: subscriptionId }
    })

    if (!subscription) {
      throw new Error('Subscription not found')
    }

    const plan = PricingService.getPlan(subscription.tier as SubscriptionTier, subscription.billingCycle as any)
    if (!plan) {
      throw new Error('Invalid subscription plan')
    }

    const newStartDate = subscription.endDate
    const newEndDate = this.calculateEndDate(newStartDate, subscription.billingCycle as any)

    try {
      await prisma.subscription?.update({
        where: { id: subscriptionId },
        data: {
          status: SubscriptionStatus.ACTIVE,
          currentPeriodStart: newStartDate,
          currentPeriodEnd: newEndDate,
          endDate: newEndDate,
          nextBillingDate: newEndDate,
          lastPaymentDate: paymentTransactionId ? new Date() : subscription.lastPaymentDate,
          updatedAt: new Date()
        }
      })

      await this.createBillingEvent({
        type: 'SUBSCRIPTION_RENEWED',
        subscriptionId,
        organizationId: subscription.organizationId,
        data: {
          renewedAt: new Date(),
          newEndDate,
          paymentTransactionId,
          price: subscription.price
        }
      })

      // Generate invoice for renewal
      await this.generateInvoice(subscriptionId, subscription.price, 'Subscription Renewal')

    } catch (error) {
      console.error('Error renewing subscription:', error)
      throw error
    }
  }

  /**
   * Handle subscription expiry
   */
  static async handleExpiredSubscription(subscriptionId: string): Promise<void> {
    const subscription = await prisma.subscription?.findUnique({
      where: { id: subscriptionId }
    })

    if (!subscription) {
      throw new Error('Subscription not found')
    }

    const gracePeriodDays = 7 // 7 days grace period
    const gracePeriodEndDate = new Date(subscription.endDate.getTime() + (gracePeriodDays * 24 * 60 * 60 * 1000))

    try {
      await prisma.subscription?.update({
        where: { id: subscriptionId },
        data: {
          status: SubscriptionStatus.GRACE_PERIOD,
          gracePeriodEndDate,
          updatedAt: new Date()
        }
      })

      await this.createBillingEvent({
        type: 'GRACE_PERIOD_STARTED',
        subscriptionId,
        organizationId: subscription.organizationId,
        data: {
          gracePeriodEndDate,
          gracePeriodDays
        }
      })

      // Send expiry notifications
      await this.sendExpiryNotifications(subscription.organizationId, gracePeriodEndDate)

    } catch (error) {
      console.error('Error handling expired subscription:', error)
      throw error
    }
  }

  /**
   * Suspend subscription (after grace period)
   */
  static async suspendSubscription(subscriptionId: string): Promise<void> {
    try {
      const subscription = await prisma.subscription?.update({
        where: { id: subscriptionId },
        data: {
          status: SubscriptionStatus.SUSPENDED,
          updatedAt: new Date()
        }
      })

      if (subscription) {
        await this.createBillingEvent({
          type: 'SUBSCRIPTION_EXPIRED',
          subscriptionId,
          organizationId: subscription.organizationId,
          data: {
            suspendedAt: new Date()
          }
        })
      }
    } catch (error) {
      console.error('Error suspending subscription:', error)
      throw error
    }
  }

  /**
   * Get subscription with usage analytics
   */
  static async getSubscriptionWithUsage(organizationId: string): Promise<{
    subscription: any
    usage: any
    warnings: any[]
    isWithinLimits: boolean
  } | null> {
    const subscription = await prisma.subscription?.findFirst({
      where: { 
        organizationId,
        status: { in: ['ACTIVE', 'TRIAL', 'GRACE_PERIOD'] }
      }
    })

    if (!subscription) {
      return null
    }

    const usageAnalytics = await UsageMonitor.getUsageAnalytics(organizationId)
    const usageCheck = await UsageMonitor.checkUsageLimits(organizationId)

    return {
      subscription,
      usage: usageAnalytics,
      warnings: usageCheck.warnings,
      isWithinLimits: usageCheck.isWithinLimits
    }
  }

  /**
   * Process automatic renewals
   */
  static async processAutomaticRenewals(): Promise<void> {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(0, 0, 0, 0)

    const subscriptionsToRenew = await prisma.subscription?.findMany({
      where: {
        autoRenew: true,
        status: SubscriptionStatus.ACTIVE,
        nextBillingDate: {
          lte: tomorrow
        }
      }
    })

    if (!subscriptionsToRenew) return

    for (const subscription of subscriptionsToRenew) {
      try {
        // Generate invoice first
        const invoiceId = await this.generateInvoice(subscription.id, subscription.price, 'Automatic Renewal')
        
        // Here you would typically process the payment
        // For now, we'll assume payment is successful
        await this.renewSubscription(subscription.id)
        
      } catch (error) {
        console.error(`Failed to auto-renew subscription ${subscription.id}:`, error)
        
        // Start grace period if auto-renewal fails
        await this.handleExpiredSubscription(subscription.id)
      }
    }
  }

  /**
   * Process grace period expirations
   */
  static async processGracePeriodExpirations(): Promise<void> {
    const today = new Date()
    today.setHours(23, 59, 59, 999)

    const expiredSubscriptions = await prisma.subscription?.findMany({
      where: {
        status: SubscriptionStatus.GRACE_PERIOD,
        gracePeriodEndDate: {
          lte: today
        }
      }
    })

    if (!expiredSubscriptions) return

    for (const subscription of expiredSubscriptions) {
      try {
        await this.suspendSubscription(subscription.id)
      } catch (error) {
        console.error(`Failed to suspend subscription ${subscription.id}:`, error)
      }
    }
  }

  /**
   * Calculate end date based on billing cycle
   */
  private static calculateEndDate(startDate: Date, billingCycle: 'MONTHLY' | 'YEARLY'): Date {
    const endDate = new Date(startDate)
    
    if (billingCycle === 'YEARLY') {
      endDate.setFullYear(endDate.getFullYear() + 1)
    } else {
      endDate.setMonth(endDate.getMonth() + 1)
    }
    
    return endDate
  }

  /**
   * Create billing event
   */
  private static async createBillingEvent(event: Omit<BillingEvent, 'id' | 'createdAt'>): Promise<void> {
    try {
      await prisma.billingEvent?.create({
        data: {
          ...event,
          createdAt: new Date()
        }
      })
    } catch (error) {
      console.error('Failed to create billing event:', error)
    }
  }

  /**
   * Generate invoice (placeholder)
   */
  private static async generateInvoice(
    subscriptionId: string, 
    amount: number, 
    description: string
  ): Promise<string> {
    // This would integrate with the invoice generation system
    // For now, return a placeholder invoice ID
    return `INV-${Date.now()}`
  }

  /**
   * Send expiry notifications
   */
  private static async sendExpiryNotifications(
    organizationId: string, 
    gracePeriodEndDate: Date
  ): Promise<void> {
    try {
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
            title: 'Berlangganan Telah Berakhir',
            message: `Berlangganan Anda telah berakhir. Anda memiliki masa tenggang hingga ${gracePeriodEndDate.toLocaleDateString('id-ID')} untuk memperpanjang.`,
            type: 'BILLING_ALERT',
            data: JSON.stringify({
              gracePeriodEndDate: gracePeriodEndDate.toISOString()
            })
          }
        })
      }
    } catch (error) {
      console.error('Failed to send expiry notifications:', error)
    }
  }
}

export default SubscriptionManager