# Pondok Digital - Subscription Management System

A comprehensive subscription management system with Midtrans payment integration for Indonesian markets.

## Features

### 🏷️ Pricing Tiers
- **TRIAL**: 14-day free trial with basic features
- **BASIC**: Rp 500,000/month - For small institutions
- **STANDARD**: Rp 1,000,000/month - Most popular for medium institutions  
- **PREMIUM**: Rp 2,500,000/month - Advanced features for large institutions
- **ENTERPRISE**: Custom pricing with unlimited features

### 💳 Payment Integration
- **Midtrans Gateway**: Complete integration with Indonesian payment methods
- **Bank Transfer**: BCA, BNI, BRI, Mandiri, Permata Virtual Accounts
- **E-Wallets**: GoPay, OVO, DANA, LinkAja, ShopeePay
- **QRIS**: Universal QR code payments
- **Automatic Renewals**: Seamless subscription renewals

### 📊 Usage Monitoring
- Real-time usage tracking for all subscription limits
- Automatic warnings at 70%, 80%, and 95% usage thresholds
- Usage enforcement to prevent overages
- Detailed analytics and reporting

### 🧾 Invoice System
- Automatic invoice generation with PDF support
- Indonesian Rupiah formatting and tax calculations (PPN 11%)
- Professional invoice templates
- Overdue invoice management

### ⚡ Automation
- **Renewal Reminders**: 7, 3, and 1 day before renewal
- **Grace Period**: 7-day grace period for failed payments
- **Automatic Suspension**: After grace period expiry
- **Trial Management**: Automatic trial-to-paid conversions

## Installation

### 1. Environment Variables

Add to your `.env.local`:

```env
# Midtrans Configuration
MIDTRANS_SERVER_KEY=your_server_key_here
MIDTRANS_CLIENT_KEY=your_client_key_here  
MIDTRANS_IS_PRODUCTION=false

# Subscription System
CRON_SECRET=your-secure-cron-token
NEXT_PUBLIC_BASE_URL=http://localhost:3030

# Database (if using separate subscription DB)
SUBSCRIPTION_DATABASE_URL=your_subscription_db_url
```

### 2. Database Schema

The system requires these additional Prisma models (add to your schema.prisma):

```prisma
model Subscription {
  id                    String            @id @default(cuid())
  organizationId        String
  tier                  String            // SubscriptionTier enum
  status                String            // SubscriptionStatus enum
  startDate             DateTime
  endDate               DateTime
  trialEndDate          DateTime?
  isTrialUsed           Boolean           @default(false)
  gracePeriodEndDate    DateTime?
  autoRenew             Boolean           @default(true)
  currentPeriodStart    DateTime
  currentPeriodEnd      DateTime
  billingCycle          String            // MONTHLY | YEARLY
  price                 Int
  currency              String            @default("IDR")
  paymentMethod         String?
  discountPercent       Float?
  discountEndDate       DateTime?
  nextBillingDate       DateTime?
  lastPaymentDate       DateTime?
  features              Json
  limits                Json
  createdAt             DateTime          @default(now())
  updatedAt             DateTime          @updatedAt
  cancelledAt           DateTime?
  cancelReason          String?

  // Relations
  organization          Organization      @relation(fields: [organizationId], references: [id])
  invoices              Invoice[]
  transactions          PaymentTransaction[]
  
  @@map("subscriptions")
}

model Invoice {
  id                    String            @id @default(cuid())
  subscriptionId        String
  organizationId        String
  invoiceNumber         String            @unique
  amount                Int
  currency              String            @default("IDR")
  status                String            // PaymentStatus enum
  dueDate               DateTime
  paidDate              DateTime?
  items                 Json
  subtotal              Int
  tax                   Int
  discount              Int
  total                 Int
  paymentMethod         String?
  transactionId         String?
  notes                 String?
  createdAt             DateTime          @default(now())
  updatedAt             DateTime          @updatedAt

  // Relations
  subscription          Subscription      @relation(fields: [subscriptionId], references: [id])
  organization          Organization      @relation(fields: [organizationId], references: [id])
  transactions          PaymentTransaction[]
  
  @@map("invoices")
}

model PaymentTransaction {
  id                    String            @id @default(cuid())
  invoiceId             String
  subscriptionId        String
  organizationId        String
  amount                Int
  currency              String            @default("IDR")
  status                String            // PaymentStatus enum
  paymentMethod         String
  paymentGateway        String            @default("MIDTRANS")
  gatewayTransactionId  String?
  gatewayResponse       Json?
  paidAt                DateTime?
  failureReason         String?
  refundedAt            DateTime?
  refundAmount          Int?
  createdAt             DateTime          @default(now())
  updatedAt             DateTime          @updatedAt

  // Relations
  invoice               Invoice           @relation(fields: [invoiceId], references: [id])
  subscription          Subscription      @relation(fields: [subscriptionId], references: [id])
  organization          Organization      @relation(fields: [organizationId], references: [id])
  
  @@map("payment_transactions")
}

model BillingEvent {
  id                    String            @id @default(cuid())
  type                  String
  subscriptionId        String
  organizationId        String
  data                  Json
  createdAt             DateTime          @default(now())

  @@map("billing_events")
}
```

### 3. Install Dependencies

```bash
npm install jspdf
# or
yarn add jspdf
```

## Usage

### Basic Implementation

```typescript
import { 
  SubscriptionManager, 
  PricingService, 
  MidtransSubscriptionGateway,
  SubscriptionTier 
} from '@/lib/subscription'

// Create a new subscription
const subscriptionId = await SubscriptionManager.createSubscription({
  organizationId: 'org_123',
  tier: SubscriptionTier.BASIC,
  billingCycle: 'MONTHLY'
})

// Process payment
const gateway = new MidtransSubscriptionGateway()
const paymentResult = await gateway.createSubscriptionPayment({
  organizationId: 'org_123',
  subscriptionTier: SubscriptionTier.BASIC,
  billingCycle: 'MONTHLY',
  amount: 500000,
  customerDetails: {
    firstName: 'John',
    email: 'john@example.com',
    phone: '+6281234567890'
  },
  itemDetails: [{
    id: 'basic',
    name: 'Basic Plan - Monthly',
    price: 500000,
    quantity: 1
  }]
})
```

### Usage Monitoring

```typescript
import { UsageMonitor } from '@/lib/subscription'

// Check if action is allowed
const isAllowed = await UsageMonitor.enforceLimit(
  'org_123', 
  'maxStudents'
)

if (isAllowed) {
  // Proceed with adding student
  await UsageMonitor.trackUsage('org_123', 'students', 1)
} else {
  // Show upgrade prompt
}
```

### Automatic Scheduling

Set up a cron job to call the scheduler daily:

```bash
# Add to your crontab or deployment platform
0 9 * * * curl -X POST -H "Authorization: Bearer your-cron-token" https://yourapp.com/api/cron/subscription-scheduler
```

## API Endpoints

### Subscription Management
- `GET /api/subscription` - Get current subscription
- `POST /api/subscription` - Create subscription  
- `PUT /api/subscription` - Update subscription
- `DELETE /api/subscription` - Cancel subscription

### Pricing & Usage
- `GET /api/subscription/pricing` - Get pricing plans
- `POST /api/subscription/pricing` - Calculate proration
- `GET /api/subscription/usage` - Get usage data
- `POST /api/subscription/usage` - Track usage

### Billing & Payments
- `POST /api/billing/subscription-payment` - Create payment
- `GET /api/billing/subscription-payment` - Get payment methods
- `POST /api/billing/webhook` - Midtrans webhook

### Invoices
- `GET /api/invoices` - List invoices
- `POST /api/invoices` - Create invoice
- `GET /api/invoices/[id]` - Get specific invoice
- `GET /api/invoices/[id]?format=pdf` - Download PDF
- `PUT /api/invoices/[id]` - Update invoice

## Configuration

### Pricing Customization

Modify pricing in `/src/lib/subscription/pricing.ts`:

```typescript
export const PRICING_PLANS: PricingPlan[] = [
  {
    tier: SubscriptionTier.BASIC,
    name: 'Paket Dasar',
    price: 750000, // Update price
    // ... other configuration
  }
  // ... more plans
]
```

### Usage Limits

Customize limits in the same pricing file:

```typescript
limits: {
  maxStudents: 1000,        // Increase student limit
  maxTeachers: 100,
  maxStorageGB: 50,
  // ... other limits
}
```

### Scheduler Configuration

Customize scheduler behavior:

```typescript
const scheduler = new SubscriptionScheduler({
  renewalReminderDays: [10, 5, 1],  // Send reminders 10, 5, 1 days before
  gracePeriodDays: 14,              // 14-day grace period
  suspensionWarningDays: [7, 3, 1], // Grace period warnings
  usageLimitWarningThresholds: [60, 80, 95] // Usage warning thresholds
})
```

## Dashboard Integration

The billing dashboard is available at `/billing` for authenticated admin users. It shows:

- Current subscription status and tier
- Usage statistics with progress bars  
- Recent invoices and payment history
- Upgrade/downgrade options
- Usage warnings and recommendations

## Security Considerations

1. **Webhook Validation**: All Midtrans webhooks are signature-validated
2. **CRON Protection**: Scheduler endpoint requires secret token
3. **Role-based Access**: Admin-only access to billing operations
4. **Organization Isolation**: All data is isolated by organization ID

## Monitoring & Alerts

The system automatically sends notifications for:
- Subscription renewal reminders (7, 3, 1 days before)
- Failed renewal payments
- Usage limit warnings (70%, 85%, 95% thresholds)  
- Grace period warnings
- Account suspension notices

## Support & Troubleshooting

### Common Issues

1. **Payment Failures**: Check Midtrans credentials and webhook URL
2. **Usage Not Updating**: Ensure usage tracking calls are implemented
3. **Scheduler Not Running**: Verify cron job configuration and token
4. **PDF Generation Issues**: Check jsPDF dependency installation

### Logging

Enable detailed logging by setting:

```env
DEBUG=subscription:*
```

## License

This subscription system is proprietary to Pondok Digital Indonesia.