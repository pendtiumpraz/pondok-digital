import { PaymentGateway, PaymentRequest, MidtransResponse, PaymentNotification } from '../payment-gateway'
import { SubscriptionManager } from './subscription-manager'
import { InvoiceGenerator } from './invoice-generator'
import { prisma } from '../prisma'
import {
  PaymentTransaction,
  PaymentStatus,
  SubscriptionTier,
  Invoice,
  CreateInvoiceParams
} from './types'

export interface SubscriptionPaymentRequest extends Omit<PaymentRequest, 'orderId'> {
  subscriptionId?: string
  invoiceId?: string
  organizationId: string
  subscriptionTier: SubscriptionTier
  billingCycle: 'MONTHLY' | 'YEARLY'
  isRenewal?: boolean
  isUpgrade?: boolean
  prorationAmount?: number
}

export interface RecurringPaymentSetup {
  subscriptionId: string
  paymentMethod: string
  customerDetails: {
    firstName: string
    lastName?: string
    email: string
    phone: string
  }
  enableAutoRenewal: boolean
}

export class MidtransSubscriptionGateway extends PaymentGateway {
  /**
   * Create subscription payment
   */
  async createSubscriptionPayment(paymentData: SubscriptionPaymentRequest): Promise<{
    paymentResponse: MidtransResponse
    transactionId: string
    invoiceId: string
  }> {
    try {
      // Generate order ID for subscription payment
      const orderIdPrefix = paymentData.isRenewal ? 'RENEW' : 
                           paymentData.isUpgrade ? 'UPGRADE' : 'SUB'
      const orderId = this.generateOrderId(orderIdPrefix)

      // Create invoice if not provided
      let invoiceId = paymentData.invoiceId
      if (!invoiceId) {
        const invoiceParams: CreateInvoiceParams = {
          subscriptionId: paymentData.subscriptionId || '',
          organizationId: paymentData.organizationId,
          amount: paymentData.amount,
          description: this.getPaymentDescription(paymentData),
          items: paymentData.itemDetails.map(item => ({
            id: item.id,
            description: item.name,
            quantity: item.quantity,
            unitPrice: item.price,
            amount: item.price * item.quantity
          }))
        }
        
        invoiceId = await InvoiceGenerator.createInvoice(invoiceParams)
      }

      // Create payment request
      const paymentRequest: PaymentRequest = {
        ...paymentData,
        orderId
      }

      // Enhanced payment data for subscriptions
      const enhancedPayload = {
        ...paymentRequest,
        custom_field1: paymentData.subscriptionId,
        custom_field2: paymentData.organizationId,
        custom_field3: invoiceId,
        callbacks: {
          finish: `${process.env.NEXT_PUBLIC_BASE_URL}/billing/payment/${orderId}/finish`,
          unfinish: `${process.env.NEXT_PUBLIC_BASE_URL}/billing/payment/${orderId}`,
          error: `${process.env.NEXT_PUBLIC_BASE_URL}/billing/payment/${orderId}/error`,
          pending: `${process.env.NEXT_PUBLIC_BASE_URL}/billing/payment/${orderId}/pending`
        },
        credit_card: {
          secure: true,
          save_card: paymentData.isRenewal || false, // Save card for renewals
          channel: 'migs'
        }
      }

      // Create payment through base gateway
      const paymentResponse = await this.createPayment(enhancedPayload)

      // Create payment transaction record
      const transaction = await this.createPaymentTransaction({
        invoiceId,
        subscriptionId: paymentData.subscriptionId || '',
        organizationId: paymentData.organizationId,
        amount: paymentData.amount,
        paymentMethod: 'midtrans_snap',
        gatewayTransactionId: paymentResponse.transaction_id,
        gatewayResponse: paymentResponse,
        orderId
      })

      return {
        paymentResponse,
        transactionId: transaction.id,
        invoiceId
      }

    } catch (error) {
      console.error('Error creating subscription payment:', error)
      throw error
    }
  }

  /**
   * Setup recurring payment for subscription
   */
  async setupRecurringPayment(setup: RecurringPaymentSetup): Promise<{
    success: boolean
    recurringId?: string
  }> {
    try {
      // For Midtrans, we'll use saved card tokens for recurring payments
      // This is a placeholder implementation
      
      const subscription = await prisma.subscription?.findUnique({
        where: { id: setup.subscriptionId }
      })

      if (!subscription) {
        throw new Error('Subscription not found')
      }

      // Update subscription with recurring payment info
      await prisma.subscription?.update({
        where: { id: setup.subscriptionId },
        data: {
          autoRenew: setup.enableAutoRenewal,
          paymentMethod: setup.paymentMethod,
          updatedAt: new Date()
        }
      })

      return {
        success: true,
        recurringId: `RECURRING_${setup.subscriptionId}`
      }

    } catch (error) {
      console.error('Error setting up recurring payment:', error)
      throw error
    }
  }

  /**
   * Process recurring payment for renewal
   */
  async processRecurringPayment(subscriptionId: string): Promise<{
    success: boolean
    transactionId?: string
    error?: string
  }> {
    try {
      const subscription = await prisma.subscription?.findUnique({
        where: { id: subscriptionId },
        include: { organization: true }
      })

      if (!subscription) {
        throw new Error('Subscription not found')
      }

      if (!subscription.autoRenew) {
        throw new Error('Auto-renewal is not enabled for this subscription')
      }

      // Create renewal invoice
      const invoiceId = await InvoiceGenerator.createInvoice({
        subscriptionId,
        organizationId: subscription.organizationId,
        amount: subscription.price,
        description: 'Subscription Renewal'
      })

      // For now, we'll create a manual payment request
      // In a real implementation, you'd use saved payment methods
      const paymentData: SubscriptionPaymentRequest = {
        subscriptionId,
        invoiceId,
        organizationId: subscription.organizationId,
        subscriptionTier: subscription.tier as SubscriptionTier,
        billingCycle: subscription.billingCycle as any,
        amount: subscription.price,
        customerDetails: {
          firstName: subscription.organization?.name || 'Organization',
          email: subscription.organization?.email || '',
          phone: subscription.organization?.phone || ''
        },
        itemDetails: [{
          id: 'renewal',
          name: `Renewal - ${subscription.tier} (${subscription.billingCycle})`,
          price: subscription.price,
          quantity: 1
        }],
        isRenewal: true
      }

      const result = await this.createSubscriptionPayment(paymentData)

      return {
        success: true,
        transactionId: result.transactionId
      }

    } catch (error) {
      console.error('Error processing recurring payment:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  /**
   * Handle subscription-specific payment notifications
   */
  async processSubscriptionNotification(notification: PaymentNotification): Promise<void> {
    try {
      // Validate notification first
      if (!this.validateNotification(notification)) {
        throw new Error('Invalid notification signature')
      }

      // Get payment transaction
      const transaction = await prisma.paymentTransaction?.findFirst({
        where: { gatewayTransactionId: notification.transaction_id },
        include: {
          invoice: true,
          subscription: true
        }
      })

      if (!transaction) {
        console.warn(`Transaction not found for notification: ${notification.transaction_id}`)
        return
      }

      // Update transaction status
      let transactionStatus: PaymentStatus
      switch (notification.transaction_status) {
        case 'capture':
        case 'settlement':
          transactionStatus = PaymentStatus.SUCCESS
          break
        case 'pending':
          transactionStatus = PaymentStatus.PENDING
          break
        case 'deny':
        case 'cancel':
        case 'expire':
        case 'failure':
          transactionStatus = PaymentStatus.FAILED
          break
        default:
          transactionStatus = PaymentStatus.PENDING
      }

      await prisma.paymentTransaction?.update({
        where: { id: transaction.id },
        data: {
          status: transactionStatus,
          paidAt: transactionStatus === PaymentStatus.SUCCESS ? new Date(notification.transaction_time) : null,
          failureReason: transactionStatus === PaymentStatus.FAILED ? notification.status_message : null,
          gatewayResponse: notification,
          updatedAt: new Date()
        }
      })

      // Update invoice status
      if (transaction.invoice) {
        if (transactionStatus === PaymentStatus.SUCCESS) {
          await InvoiceGenerator.markInvoicePaid(transaction.invoiceId, transaction.id)
        } else if (transactionStatus === PaymentStatus.FAILED) {
          await InvoiceGenerator.markInvoiceFailed(transaction.invoiceId, notification.status_message)
        }
      }

      // Handle subscription-specific logic
      if (transaction.subscription && transactionStatus === PaymentStatus.SUCCESS) {
        // Check if this is a renewal payment
        const isRenewal = notification.order_id.startsWith('RENEW-')
        const isUpgrade = notification.order_id.startsWith('UPGRADE-')

        if (isRenewal) {
          await SubscriptionManager.renewSubscription(transaction.subscriptionId, transaction.id)
        } else if (isUpgrade) {
          // Handle upgrade completion
          // This would typically involve updating the subscription tier
        } else {
          // New subscription activation
          await prisma.subscription?.update({
            where: { id: transaction.subscriptionId },
            data: {
              status: 'ACTIVE',
              lastPaymentDate: new Date(notification.transaction_time),
              updatedAt: new Date()
            }
          })
        }
      }

      // Send success/failure notifications
      await this.sendPaymentNotification(transaction.organizationId, {
        success: transactionStatus === PaymentStatus.SUCCESS,
        amount: transaction.amount,
        invoiceNumber: transaction.invoice?.invoiceNumber || notification.order_id,
        subscriptionTier: transaction.subscription?.tier,
        transactionId: transaction.id
      })

    } catch (error) {
      console.error('Error processing subscription notification:', error)
      throw error
    }
  }

  /**
   * Cancel subscription payment
   */
  async cancelSubscriptionPayment(orderId: string, reason?: string): Promise<void> {
    try {
      // Cancel payment with Midtrans
      await this.cancelPayment(orderId)

      // Update transaction status
      const transaction = await prisma.paymentTransaction?.findFirst({
        where: { gatewayTransactionId: orderId }
      })

      if (transaction) {
        await prisma.paymentTransaction?.update({
          where: { id: transaction.id },
          data: {
            status: PaymentStatus.CANCELLED,
            failureReason: reason,
            updatedAt: new Date()
          }
        })

        // Update invoice status
        await InvoiceGenerator.markInvoiceFailed(transaction.invoiceId, `Payment cancelled: ${reason}`)
      }

    } catch (error) {
      console.error('Error cancelling subscription payment:', error)
      throw error
    }
  }

  /**
   * Get payment analytics for subscriptions
   */
  async getSubscriptionPaymentAnalytics(organizationId: string): Promise<{
    totalRevenue: number
    monthlyRevenue: number
    successfulPayments: number
    failedPayments: number
    averagePaymentAmount: number
    paymentMethodBreakdown: Record<string, number>
  }> {
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const transactions = await prisma.paymentTransaction?.findMany({
      where: {
        organizationId,
        createdAt: { gte: thirtyDaysAgo }
      }
    })

    if (!transactions) {
      return {
        totalRevenue: 0,
        monthlyRevenue: 0,
        successfulPayments: 0,
        failedPayments: 0,
        averagePaymentAmount: 0,
        paymentMethodBreakdown: {}
      }
    }

    const successfulTransactions = transactions.filter(t => t.status === PaymentStatus.SUCCESS)
    const failedTransactions = transactions.filter(t => t.status === PaymentStatus.FAILED)

    const totalRevenue = successfulTransactions.reduce((sum, t) => sum + t.amount, 0)
    const averagePaymentAmount = successfulTransactions.length > 0 
      ? totalRevenue / successfulTransactions.length 
      : 0

    const paymentMethodBreakdown: Record<string, number> = {}
    transactions.forEach(t => {
      const method = t.paymentMethod || 'unknown'
      paymentMethodBreakdown[method] = (paymentMethodBreakdown[method] || 0) + 1
    })

    return {
      totalRevenue,
      monthlyRevenue: totalRevenue, // Last 30 days
      successfulPayments: successfulTransactions.length,
      failedPayments: failedTransactions.length,
      averagePaymentAmount,
      paymentMethodBreakdown
    }
  }

  /**
   * Create payment transaction record
   */
  private async createPaymentTransaction(data: {
    invoiceId: string
    subscriptionId: string
    organizationId: string
    amount: number
    paymentMethod: string
    gatewayTransactionId: string
    gatewayResponse: any
    orderId: string
  }): Promise<PaymentTransaction> {
    const transaction = await prisma.paymentTransaction?.create({
      data: {
        invoiceId: data.invoiceId,
        subscriptionId: data.subscriptionId,
        organizationId: data.organizationId,
        amount: data.amount,
        currency: 'IDR',
        status: PaymentStatus.PENDING,
        paymentMethod: data.paymentMethod,
        paymentGateway: 'MIDTRANS',
        gatewayTransactionId: data.gatewayTransactionId,
        gatewayResponse: data.gatewayResponse
      }
    })

    if (!transaction) {
      throw new Error('Failed to create payment transaction')
    }

    return transaction as PaymentTransaction
  }

  /**
   * Get payment description based on payment data
   */
  private getPaymentDescription(paymentData: SubscriptionPaymentRequest): string {
    if (paymentData.isRenewal) {
      return `Renewal - ${paymentData.subscriptionTier} Plan (${paymentData.billingCycle})`
    } else if (paymentData.isUpgrade) {
      return `Upgrade to ${paymentData.subscriptionTier} Plan`
    } else {
      return `Subscription - ${paymentData.subscriptionTier} Plan (${paymentData.billingCycle})`
    }
  }

  /**
   * Send payment notification to organization
   */
  private async sendPaymentNotification(
    organizationId: string,
    data: {
      success: boolean
      amount: number
      invoiceNumber: string
      subscriptionTier?: SubscriptionTier
      transactionId: string
    }
  ): Promise<void> {
    try {
      const admins = await prisma.user.findMany({
        where: {
          tenantId: organizationId,
          role: 'ADMIN',
          isActive: true
        }
      })

      const title = data.success ? 'Pembayaran Berhasil' : 'Pembayaran Gagal'
      const message = data.success
        ? `Pembayaran untuk ${data.invoiceNumber} sebesar ${PaymentGateway.formatAmount(data.amount)} telah berhasil diproses.`
        : `Pembayaran untuk ${data.invoiceNumber} sebesar ${PaymentGateway.formatAmount(data.amount)} gagal diproses.`

      for (const admin of admins) {
        await prisma.notification?.create({
          data: {
            userId: admin.id,
            title,
            message,
            type: 'BILLING_ALERT',
            data: {
              success: data.success,
              amount: data.amount,
              invoiceNumber: data.invoiceNumber,
              subscriptionTier: data.subscriptionTier,
              transactionId: data.transactionId
            }
          }
        })
      }
    } catch (error) {
      console.error('Failed to send payment notification:', error)
    }
  }
}

export default MidtransSubscriptionGateway