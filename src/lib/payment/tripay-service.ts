import crypto from 'crypto';
import { PAYMENT_CONFIGS, TIER_PRICING } from './payment-config';

interface TripayTransaction {
  method: string;
  merchant_ref: string;
  amount: number;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  order_items: Array<{
    sku: string;
    name: string;
    price: number;
    quantity: number;
  }>;
  return_url: string;
  expired_time: number;
  signature: string;
}

export class TripayService {
  private apiKey: string;
  private privateKey: string;
  private merchantCode: string;
  private apiUrl: string;

  constructor() {
    const config = PAYMENT_CONFIGS.TRIPAY;
    this.apiKey = config.apiKey;
    this.privateKey = config.privateKey;
    this.merchantCode = config.merchantId;
    this.apiUrl = config.isProduction
      ? 'https://tripay.co.id/api'
      : 'https://tripay.co.id/api-sandbox';
  }

  /**
   * Generate signature for transaction
   */
  private generateSignature(merchantRef: string, amount: number): string {
    const signString = `${this.merchantCode}${merchantRef}${amount}`;
    return crypto
      .createHmac('sha256', this.privateKey)
      .update(signString)
      .digest('hex');
  }

  /**
   * Get available payment channels
   */
  async getPaymentChannels() {
    try {
      const response = await fetch(`${this.apiUrl}/merchant/payment-channel`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
      });

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to get payment channels');
      }

      return data.data;
    } catch (error) {
      console.error('Error getting payment channels:', error);
      throw error;
    }
  }

  /**
   * Create transaction
   */
  async createTransaction(
    method: string,
    merchantRef: string,
    amount: number,
    customerDetails: {
      name: string;
      email: string;
      phone: string;
    },
    orderItems: Array<{
      sku: string;
      name: string;
      price: number;
      quantity: number;
    }>,
    expiredTime?: number
  ) {
    const signature = this.generateSignature(merchantRef, amount);
    const expiryTime = expiredTime || Math.floor(Date.now() / 1000) + (24 * 60 * 60); // 24 hours

    const transaction: TripayTransaction = {
      method,
      merchant_ref: merchantRef,
      amount,
      customer_name: customerDetails.name,
      customer_email: customerDetails.email,
      customer_phone: customerDetails.phone,
      order_items: orderItems,
      return_url: `${process.env.NEXT_PUBLIC_URL}/subscription/success?ref=${merchantRef}`,
      expired_time: expiryTime,
      signature,
    };

    try {
      const response = await fetch(`${this.apiUrl}/transaction/create`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transaction),
      });

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to create transaction');
      }

      return {
        reference: data.data.reference,
        merchant_ref: data.data.merchant_ref,
        payment_selection_type: data.data.payment_selection_type,
        payment_method: data.data.payment_method,
        payment_name: data.data.payment_name,
        customer_name: data.data.customer_name,
        customer_email: data.data.customer_email,
        customer_phone: data.data.customer_phone,
        amount: data.data.amount,
        fee_merchant: data.data.fee_merchant,
        fee_customer: data.data.fee_customer,
        total_fee: data.data.total_fee,
        amount_received: data.data.amount_received,
        pay_code: data.data.pay_code,
        pay_url: data.data.pay_url,
        checkout_url: data.data.checkout_url,
        status: data.data.status,
        expired_time: data.data.expired_time,
        qr_string: data.data.qr_string,
        qr_url: data.data.qr_url,
      };
    } catch (error) {
      console.error('Tripay transaction error:', error);
      throw error;
    }
  }

  /**
   * Create subscription payment
   */
  async createSubscriptionPayment(
    tenantId: string,
    userId: string,
    tier: keyof typeof TIER_PRICING,
    billingPeriod: 'monthly' | 'yearly',
    paymentMethod: string,
    customerDetails: {
      name: string;
      email: string;
      phone: string;
    }
  ) {
    const tierConfig = TIER_PRICING[tier];
    const amount = billingPeriod === 'monthly' 
      ? tierConfig.monthly 
      : tierConfig.yearly;

    if (!amount) {
      throw new Error('Invalid tier or billing period');
    }

    const merchantRef = `SUB-${tenantId}-${Date.now()}`;
    
    const orderItems = [{
      sku: `${tier}-${billingPeriod}`,
      name: `${tierConfig.name} - ${billingPeriod === 'monthly' ? 'Bulanan' : 'Tahunan'}`,
      price: amount,
      quantity: 1,
    }];

    return await this.createTransaction(
      paymentMethod,
      merchantRef,
      amount,
      customerDetails,
      orderItems
    );
  }

  /**
   * Verify callback signature
   */
  verifyCallback(callbackSignature: string, json: string): boolean {
    const signature = crypto
      .createHmac('sha256', this.privateKey)
      .update(json)
      .digest('hex');
    
    return signature === callbackSignature;
  }

  /**
   * Get transaction detail
   */
  async getTransactionDetail(reference: string) {
    try {
      const response = await fetch(`${this.apiUrl}/transaction/detail?reference=${reference}`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
      });

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to get transaction detail');
      }

      return data.data;
    } catch (error) {
      console.error('Error getting transaction detail:', error);
      throw error;
    }
  }

  /**
   * Calculate fee
   */
  async calculateFee(amount: number, paymentMethod: string) {
    try {
      const response = await fetch(`${this.apiUrl}/merchant/fee-calculator`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          code: paymentMethod,
        }),
      });

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to calculate fee');
      }

      return data.data;
    } catch (error) {
      console.error('Error calculating fee:', error);
      throw error;
    }
  }
}