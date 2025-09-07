'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { PAYMENT_METHODS, PaymentGateway } from '@/lib/payment-gateway'
import { 
  ClockIcon, 
  CheckCircleIcon, 
  XCircleIcon,
  ExclamationTriangleIcon,
  DocumentDuplicateIcon,
  QrCodeIcon,
  CreditCardIcon,
  BuildingLibraryIcon,
  DevicePhoneMobileIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline'
import { toast } from '@/components/ui/toast'

interface Payment {
  id: string
  paymentNo: string
  orderId?: string
  amount: number
  paymentType: string
  description?: string
  method: string
  channel?: string
  status: string
  vaNumber?: string
  expiredAt?: string
  paidAt?: string
  createdAt: string
  registration?: {
    id: string
    registrationNo: string
    fullName: string
    email: string
    phoneNumber: string
    level: string
    status: string
    paymentStatus: string
  }
  student?: {
    id: string
    nis: string
    fullName: string
    email: string
    phone: string
  }
}

interface GatewayResponse {
  token?: string
  redirect_url?: string
  va_numbers?: Array<{
    bank: string
    va_number: string
  }>
  permata_va_number?: string
  bca_va_number?: string
  bni_va_number?: string
  bri_va_number?: string
  cimb_va_number?: string
  other_va_number?: string
  qr_string?: string
  deeplink_redirect?: string
  expiry_time?: string
}

const PaymentStatusIcon = ({ status }: { status: string }) => {
  switch (status) {
    case 'SUCCESS':
      return <CheckCircleIcon className="w-6 h-6 text-green-500" />
    case 'PENDING':
      return <ClockIcon className="w-6 h-6 text-yellow-500" />
    case 'FAILED':
    case 'EXPIRED':
      return <XCircleIcon className="w-6 h-6 text-red-500" />
    default:
      return <ExclamationTriangleIcon className="w-6 h-6 text-gray-500" />
  }
}

const PaymentMethodIcon = ({ method, channel }: { method: string, channel?: string }) => {
  if (method === 'VA' || method === 'TRANSFER') {
    return <BuildingLibraryIcon className="w-5 h-5" />
  } else if (method === 'EWALLET') {
    return <DevicePhoneMobileIcon className="w-5 h-5" />
  } else if (method === 'QRIS') {
    return <QrCodeIcon className="w-5 h-5" />
  } else {
    return <CreditCardIcon className="w-5 h-5" />
  }
}

export default function PaymentPage() {
  const params = useParams()
  const router = useRouter()
  const paymentId = params.id as string

  const [payment, setPayment] = useState<Payment | null>(null)
  const [gatewayResponse, setGatewayResponse] = useState<GatewayResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [copying, setCopying] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Auto-refresh for pending payments
  useEffect(() => {
    if (payment?.status === 'PENDING') {
      const interval = setInterval(() => {
        checkPaymentStatus(true)
      }, 30000) // Check every 30 seconds

      return () => clearInterval(interval)
    }
  }, [payment?.status])

  useEffect(() => {
    if (paymentId) {
      checkPaymentStatus()
    }
  }, [paymentId])

  const checkPaymentStatus = async (silent = false) => {
    try {
      if (!silent) setLoading(true)
      if (silent) setRefreshing(true)

      const response = await fetch(`/api/payment/status/${paymentId}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch payment status')
      }

      setPayment(data.payment)
      setGatewayResponse(data.gatewayStatus)
      setError(null)
    } catch (err: any) {
      console.error('Error fetching payment:', err)
      setError(err.message)
      toast.error("Error: Failed to fetch payment status")
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const copyToClipboard = async (text: string, type: string) => {
    try {
      setCopying(type)
      await navigator.clipboard.writeText(text)
      toast.success(`${type} copied to clipboard`)
    } catch (err) {
      console.error('Failed to copy:', err)
      toast.error("Error: Failed to copy to clipboard")
    } finally {
      setTimeout(() => setCopying(null), 1000)
    }
  }

  const handleRefresh = () => {
    checkPaymentStatus()
  }

  const handleCancel = async () => {
    if (!confirm('Are you sure you want to cancel this payment?')) {
      return
    }

    try {
      setLoading(true)
      const response = await fetch(`/api/payment/status/${paymentId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'cancel' })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to cancel payment')
      }

      toast.info("Payment Cancelled: Payment has been cancelled successfully")

      // Refresh payment status
      checkPaymentStatus()
    } catch (err: any) {
      console.error('Error cancelling payment:', err)
      toast.error("Error")
    } finally {
      setLoading(false)
    }
  }

  const openPaymentGateway = () => {
    if (gatewayResponse?.redirect_url) {
      window.open(gatewayResponse.redirect_url, '_blank')
    } else if (gatewayResponse?.token) {
      // Open Midtrans Snap
      // @ts-ignore
      if (typeof window !== 'undefined' && window.snap) {
        // @ts-ignore
        window.snap.pay(gatewayResponse.token)
      }
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getPaymentMethodInfo = (method: string, channel?: string) => {
    if (channel) {
      const paymentMethod = (PAYMENT_METHODS || []).find(pm => pm.code === channel.toLowerCase())
      if (paymentMethod) {
        return paymentMethod
      }
    }
    
    return (PAYMENT_METHODS || []).find(pm => pm.code === method.toLowerCase()) || {
      type: 'bank_transfer' as const,
      name: method,
      code: method.toLowerCase(),
      description: `Payment via ${method}`
    }
  }

  const getTimeRemaining = (expiredAt: string) => {
    const now = new Date()
    const expiry = new Date(expiredAt)
    const diff = expiry.getTime() - now.getTime()

    if (diff <= 0) return 'Expired'

    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

    return `${hours}h ${minutes}m remaining`
  }

  if (loading && !payment) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading payment details...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error && !payment) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-4">
          <Card className="border-red-200">
            <CardContent className="p-6">
              <div className="text-center">
                <XCircleIcon className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Payment Not Found</h2>
                <p className="text-gray-600 mb-4">{error}</p>
                <Button onClick={() => router.back()}>
                  Go Back
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (!payment) return null

  const paymentMethodInfo = getPaymentMethodInfo(payment.method, payment.channel)
  const isExpired = payment.expiredAt && new Date(payment.expiredAt) < new Date()

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Details</h1>
          <p className="text-gray-600">
            {payment.registration 
              ? `Registration payment for ${payment.registration.fullName}`
              : payment.student
              ? `Payment for ${payment.student.fullName}`
              : 'Payment Details'
            }
          </p>
        </div>

        {/* Payment Status Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <PaymentStatusIcon status={payment.status} />
                <span className="text-lg">
                  {payment.status === 'SUCCESS' ? 'Payment Successful' :
                   payment.status === 'PENDING' ? 'Waiting for Payment' :
                   payment.status === 'FAILED' ? 'Payment Failed' :
                   payment.status === 'EXPIRED' ? 'Payment Expired' :
                   'Payment Status'}
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={refreshing}
              >
                <ArrowPathIcon className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-600">Payment Number</p>
                <div className="flex items-center gap-2">
                  <p className="font-mono font-medium">{payment.paymentNo}</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(payment.paymentNo, 'Payment Number')}
                    disabled={copying === 'Payment Number'}
                  >
                    <DocumentDuplicateIcon className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600">Amount</p>
                <p className="text-xl font-bold text-blue-600">
                  {formatCurrency(Number(payment.amount))}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-600">Payment Method</p>
                <div className="flex items-center gap-2 mt-1">
                  <PaymentMethodIcon method={payment.method} channel={payment.channel} />
                  <span className="font-medium">{paymentMethodInfo.name}</span>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <Badge 
                  variant={
                    payment.status === 'SUCCESS' ? 'default' :
                    payment.status === 'PENDING' ? 'secondary' :
                    'destructive'
                  }
                  className="mt-1"
                >
                  {payment.status}
                </Badge>
              </div>
            </div>

            {payment.description && (
              <div className="mb-4">
                <p className="text-sm text-gray-600">Description</p>
                <p className="font-medium">{payment.description}</p>
              </div>
            )}

            {payment.expiredAt && payment.status === 'PENDING' && (
              <div className="mb-4">
                <p className="text-sm text-gray-600">Time Remaining</p>
                <p className={`font-medium ${isExpired ? 'text-red-600' : 'text-orange-600'}`}>
                  {getTimeRemaining(payment.expiredAt)}
                </p>
              </div>
            )}

            {payment.paidAt && (
              <div className="mb-4">
                <p className="text-sm text-gray-600">Paid At</p>
                <p className="font-medium">{formatDateTime(payment.paidAt)}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Payment Instructions */}
        {payment.status === 'PENDING' && !isExpired && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Payment Instructions</CardTitle>
            </CardHeader>
            <CardContent>
              {payment.method === 'VA' && payment.vaNumber && (
                <div className="space-y-4">
                  <div>
                    <p className="font-semibold mb-2">Virtual Account Number:</p>
                    <div className="flex items-center gap-2 p-3 bg-gray-100 rounded-lg">
                      <code className="text-lg font-mono font-bold flex-1">
                        {payment.vaNumber}
                      </code>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(payment.vaNumber!, 'VA Number')}
                        disabled={copying === 'VA Number'}
                      >
                        <DocumentDuplicateIcon className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">
                    <h4 className="font-semibold mb-2">How to Pay:</h4>
                    <ol className="list-decimal list-inside space-y-1">
                      <li>Open your {paymentMethodInfo.name} mobile banking app or visit ATM</li>
                      <li>Select "Transfer" or "Virtual Account"</li>
                      <li>Enter the virtual account number above</li>
                      <li>Enter the exact amount: {formatCurrency(Number(payment.amount))}</li>
                      <li>Confirm the transaction</li>
                      <li>Keep your receipt as proof of payment</li>
                    </ol>
                  </div>
                </div>
              )}

              {payment.method === 'EWALLET' && (
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">
                    Click the button below to open {paymentMethodInfo.name} and complete your payment.
                  </p>
                  {gatewayResponse?.deeplink_redirect && (
                    <Button 
                      onClick={openPaymentGateway} 
                      className="w-full"
                      size="lg"
                    >
                      <DevicePhoneMobileIcon className="w-5 h-5 mr-2" />
                      Pay with {paymentMethodInfo.name}
                    </Button>
                  )}
                </div>
              )}

              {payment.method === 'QRIS' && (
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">
                    Scan the QR code below with any QRIS-compatible app (GoPay, OVO, DANA, etc.)
                  </p>
                  {gatewayResponse?.qr_string && (
                    <div className="flex justify-center p-4 bg-white border-2 border-dashed border-gray-300 rounded-lg">
                      <div className="text-center">
                        <QrCodeIcon className="w-48 h-48 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">QR Code will appear here</p>
                        <p className="text-xs text-gray-500 mt-2">
                          Amount: {formatCurrency(Number(payment.amount))}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {payment.method === 'TRANSFER' && (
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">
                    Transfer to the following account and upload proof of payment:
                  </p>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm text-gray-600">Bank:</span>
                        <span className="ml-2 font-semibold">BCA</span>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Account Number:</span>
                        <div className="flex items-center gap-2">
                          <code className="font-mono font-bold">1234567890</code>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard('1234567890', 'Account Number')}
                            disabled={copying === 'Account Number'}
                          >
                            <DocumentDuplicateIcon className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Account Name:</span>
                        <span className="ml-2 font-semibold">Pondok Imam Syafi'i</span>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Amount:</span>
                        <span className="ml-2 font-bold text-blue-600">
                          {formatCurrency(Number(payment.amount))}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <ExclamationTriangleIcon className="w-4 h-4 inline mr-1" />
                  Payment will automatically expire at{' '}
                  {payment.expiredAt && formatDateTime(payment.expiredAt)}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Success Message */}
        {payment.status === 'SUCCESS' && (
          <Card className="mb-6 border-green-200 bg-green-50">
            <CardContent className="p-6">
              <div className="text-center">
                <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-green-800 mb-2">
                  Payment Successful!
                </h2>
                <p className="text-green-700 mb-4">
                  Your payment has been processed successfully.
                  {payment.paidAt && ` Completed on ${formatDateTime(payment.paidAt)}.`}
                </p>
                {payment.registration && (
                  <p className="text-sm text-green-600">
                    Registration status has been updated. You will receive further instructions via email.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Failed/Expired Message */}
        {(payment.status === 'FAILED' || payment.status === 'EXPIRED') && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="p-6">
              <div className="text-center">
                <XCircleIcon className="w-16 h-16 text-red-500 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-red-800 mb-2">
                  {payment.status === 'EXPIRED' ? 'Payment Expired' : 'Payment Failed'}
                </h2>
                <p className="text-red-700 mb-4">
                  {payment.status === 'EXPIRED' 
                    ? 'This payment has expired. Please create a new payment to continue.'
                    : 'Payment could not be processed. Please try again or contact support.'
                  }
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => router.back()}>
            Go Back
          </Button>
          
          {payment.status === 'PENDING' && !isExpired && (
            <>
              {gatewayResponse?.redirect_url && (
                <Button onClick={openPaymentGateway} className="flex-1">
                  Complete Payment
                </Button>
              )}
              <Button variant="destructive" onClick={handleCancel}>
                Cancel Payment
              </Button>
            </>
          )}
          
          {(payment.status === 'FAILED' || payment.status === 'EXPIRED') && payment.registration && (
            <Button 
              onClick={() => router.push(`/ppdb/register?id=${payment.registration?.id}`)}
              className="flex-1"
            >
              Create New Payment
            </Button>
          )}
        </div>
      </div>

      {/* Midtrans Snap Script */}
      <script
        src={`https://app.${process.env.NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION === 'true' ? '' : 'sandbox.'}midtrans.com/snap/snap.js`}
        data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
      ></script>
    </div>
  )
}