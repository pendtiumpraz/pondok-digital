export interface PaymentGatewayConfig {
  provider: 'MIDTRANS' | 'TRIPAY';
  serverKey: string;
  clientKey: string;
  merchantId?: string;
  apiKey?: string;
  privateKey?: string;
  isProduction: boolean;
  callbackUrl: string;
  returnUrl: string;
  notificationUrl: string;
}

export const PAYMENT_CONFIGS = {
  MIDTRANS: {
    provider: 'MIDTRANS' as const,
    serverKey: process.env.MIDTRANS_SERVER_KEY || '',
    clientKey: process.env.MIDTRANS_CLIENT_KEY || '',
    merchantId: process.env.MIDTRANS_MERCHANT_ID || '',
    isProduction: process.env.MIDTRANS_IS_PRODUCTION === 'true',
    callbackUrl: `${process.env.NEXT_PUBLIC_URL}/api/payment/callback/midtrans`,
    returnUrl: `${process.env.NEXT_PUBLIC_URL}/subscription/success`,
    notificationUrl: `${process.env.NEXT_PUBLIC_URL}/api/webhooks/midtrans`,
  },
  TRIPAY: {
    provider: 'TRIPAY' as const,
    apiKey: process.env.TRIPAY_API_KEY || '',
    privateKey: process.env.TRIPAY_PRIVATE_KEY || '',
    merchantId: process.env.TRIPAY_MERCHANT_CODE || '',
    serverKey: '', // Not used in Tripay
    clientKey: '', // Not used in Tripay
    isProduction: process.env.TRIPAY_IS_PRODUCTION === 'true',
    callbackUrl: `${process.env.NEXT_PUBLIC_URL}/api/payment/callback/tripay`,
    returnUrl: `${process.env.NEXT_PUBLIC_URL}/subscription/success`,
    notificationUrl: `${process.env.NEXT_PUBLIC_URL}/api/webhooks/tripay`,
  },
};

// Subscription tier pricing in IDR
export const TIER_PRICING = {
  BASIC: {
    monthly: 299000,
    yearly: 2990000, // 2 months free
    name: 'Paket Basic',
    features: [
      'Hingga 100 santri',
      '20 guru/ustadz',
      '5 GB storage',
      'Laporan dasar',
      'Support email',
    ],
  },
  STANDARD: {
    monthly: 799000,
    yearly: 7990000, // 2 months free
    name: 'Paket Standard',
    features: [
      'Hingga 500 santri',
      '50 guru/ustadz',
      '20 GB storage',
      'Laporan lengkap',
      'Support prioritas',
      'Integrasi WhatsApp',
      'Custom branding',
    ],
  },
  PREMIUM: {
    monthly: 1999000,
    yearly: 19990000, // 2 months free
    name: 'Paket Premium',
    features: [
      'Hingga 2000 santri',
      '200 guru/ustadz',
      '100 GB storage',
      'Laporan & analitik lengkap',
      'Support 24/7',
      'Integrasi WhatsApp & SMS',
      'Custom domain',
      'API access',
    ],
  },
  ENTERPRISE: {
    monthly: null, // Custom pricing
    yearly: null,
    name: 'Paket Enterprise',
    features: [
      'Santri unlimited',
      'Guru/ustadz unlimited',
      'Storage unlimited',
      'Semua fitur Premium',
      'Dedicated account manager',
      'SLA 99.9%',
      'Custom development',
      'Training on-site',
    ],
  },
};

// Payment methods available in each gateway
export const PAYMENT_METHODS = {
  MIDTRANS: [
    { code: 'credit_card', name: 'Kartu Kredit', logo: '/icons/credit-card.svg' },
    { code: 'bca_va', name: 'BCA Virtual Account', logo: '/icons/bca.svg' },
    { code: 'bni_va', name: 'BNI Virtual Account', logo: '/icons/bni.svg' },
    { code: 'bri_va', name: 'BRI Virtual Account', logo: '/icons/bri.svg' },
    { code: 'mandiri_va', name: 'Mandiri Virtual Account', logo: '/icons/mandiri.svg' },
    { code: 'permata_va', name: 'Permata Virtual Account', logo: '/icons/permata.svg' },
    { code: 'gopay', name: 'GoPay', logo: '/icons/gopay.svg' },
    { code: 'shopeepay', name: 'ShopeePay', logo: '/icons/shopeepay.svg' },
    { code: 'qris', name: 'QRIS', logo: '/icons/qris.svg' },
  ],
  TRIPAY: [
    { code: 'BCAVA', name: 'BCA Virtual Account', logo: '/icons/bca.svg' },
    { code: 'BNIVA', name: 'BNI Virtual Account', logo: '/icons/bni.svg' },
    { code: 'BRIVA', name: 'BRI Virtual Account', logo: '/icons/bri.svg' },
    { code: 'MANDIRIVA', name: 'Mandiri Virtual Account', logo: '/icons/mandiri.svg' },
    { code: 'PERMATAVA', name: 'Permata Virtual Account', logo: '/icons/permata.svg' },
    { code: 'QRIS', name: 'QRIS', logo: '/icons/qris.svg' },
    { code: 'QRISC', name: 'QRIS (Custom)', logo: '/icons/qris.svg' },
    { code: 'OVO', name: 'OVO', logo: '/icons/ovo.svg' },
    { code: 'DANA', name: 'DANA', logo: '/icons/dana.svg' },
    { code: 'SHOPEEPAY', name: 'ShopeePay', logo: '/icons/shopeepay.svg' },
  ],
};

export function getActivePaymentGateway(): PaymentGatewayConfig {
  const activeProvider = process.env.PAYMENT_GATEWAY || 'MIDTRANS';
  return PAYMENT_CONFIGS[activeProvider as keyof typeof PAYMENT_CONFIGS];
}