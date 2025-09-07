import crypto from 'crypto';
import { PAYMENT_CONFIGS, TIER_PRICING } from './payment-config';

interface MidtransTransaction {
  transaction_details: {
    order_id: string;
    gross_amount: number;
  };
  customer_details: {
    first_name: string;
    last_name?: string;
    email: string;
    phone: string;
  };
  item_details?: Array<{
    id: string;
    price: number;
    quantity: number;
    name: string;
  }>;
  callbacks?: {
    finish: string;
  };
}

export class MidtransService {
  private serverKey: string;
  private clientKey: string;
  private apiUrl: string;
  private snapUrl: string;

  constructor() {
    const config = PAYMENT_CONFIGS.MIDTRANS;
    this.serverKey = config.serverKey;
    this.clientKey = config.clientKey;
    this.apiUrl = config.isProduction
      ? 'https://api.midtrans.com'
      : 'https://api.sandbox.midtrans.com';
    this.snapUrl = config.isProduction
      ? 'https://app.midtrans.com/snap/v1'
      : 'https://app.sandbox.midtrans.com/snap/v1';
  }

  /**
   * Create payment transaction
   */
  async createTransaction(
    orderId: string,
    amount: number,
    customerDetails: {
      firstName: string;
      lastName?: string;
      email: string;
      phone: string;
    },
    itemDetails?: Array<{
      id: string;
      price: number;
      quantity: number;
      name: string;
    }>
  ) {
    const transaction: MidtransTransaction = {
      transaction_details: {
        order_id: orderId,
        gross_amount: amount,
      },
      customer_details: {
        first_name: customerDetails.firstName,
        last_name: customerDetails.lastName,
        email: customerDetails.email,
        phone: customerDetails.phone,
      },
      item_details: itemDetails,
      callbacks: {
        finish: `${process.env.NEXT_PUBLIC_URL}/subscription/success?order_id=${orderId}`,
      },
    };

    try {
      const response = await fetch(`${this.snapUrl}/transactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${Buffer.from(this.serverKey + ':').toString('base64')}`,
        },
        body: JSON.stringify(transaction),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error_messages?.[0] || 'Failed to create transaction');
      }

      return {
        token: data.token,
        redirect_url: data.redirect_url,
      };
    } catch (error) {
      console.error('Midtrans transaction error:', error);
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

    const orderId = `SUB-${tenantId}-${Date.now()}`;
    
    const itemDetails = [{
      id: `${tier}-${billingPeriod}`,
      price: amount,
      quantity: 1,
      name: `${tierConfig.name} - ${billingPeriod === 'monthly' ? 'Bulanan' : 'Tahunan'}`,
    }];

    const [firstName, ...lastNameParts] = customerDetails.name.split(' ');
    
    return await this.createTransaction(
      orderId,
      amount,
      {
        firstName,
        lastName: lastNameParts.join(' ') || undefined,
        email: customerDetails.email,
        phone: customerDetails.phone,
      },
      itemDetails
    );
  }

  /**
   * Verify notification signature
   */
  verifyNotification(
    orderId: string,
    statusCode: string,
    grossAmount: string,
    signature: string
  ): boolean {
    const signatureKey = crypto
      .createHash('sha512')
      .update(`${orderId}${statusCode}${grossAmount}${this.serverKey}`)
      .digest('hex');
    
    return signatureKey === signature;
  }

  /**
   * Get transaction status
   */
  async getTransactionStatus(orderId: string) {
    try {
      const response = await fetch(`${this.apiUrl}/v2/${orderId}/status`, {
        headers: {
          'Authorization': `Basic ${Buffer.from(this.serverKey + ':').toString('base64')}`,
        },
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error_messages?.[0] || 'Failed to get transaction status');
      }

      return {
        transaction_status: data.transaction_status,
        fraud_status: data.fraud_status,
        payment_type: data.payment_type,
        status_code: data.status_code,
        gross_amount: data.gross_amount,
      };
    } catch (error) {
      console.error('Error getting transaction status:', error);
      throw error;
    }
  }

  /**
   * Cancel transaction
   */
  async cancelTransaction(orderId: string) {
    try {
      const response = await fetch(`${this.apiUrl}/v2/${orderId}/cancel`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${Buffer.from(this.serverKey + ':').toString('base64')}`,
        },
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error_messages?.[0] || 'Failed to cancel transaction');
      }

      return data;
    } catch (error) {
      console.error('Error canceling transaction:', error);
      throw error;
    }
  }
}