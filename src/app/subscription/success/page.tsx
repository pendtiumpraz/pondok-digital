'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import confetti from 'canvas-confetti'
import { 
  CheckCircleIcon,
  SparklesIcon,
  ArrowRightIcon,
  DocumentTextIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import Link from 'next/link'

function SubscriptionSuccessContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [paymentDetails, setPaymentDetails] = useState<any>(null)

  const orderId = searchParams.get('order_id') || searchParams.get('ref')

  useEffect(() => {
    // Trigger confetti animation
    const duration = 3 * 1000
    const animationEnd = Date.now() + duration
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min
    }

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now()

      if (timeLeft <= 0) {
        return clearInterval(interval)
      }

      const particleCount = 50 * (timeLeft / duration)
      
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      })
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      })
    }, 250)

    // Fetch payment details if orderId exists
    if (orderId) {
      fetchPaymentDetails()
    } else {
      setLoading(false)
    }

    return () => clearInterval(interval)
  }, [orderId])

  const fetchPaymentDetails = async () => {
    try {
      const response = await fetch(`/api/payment/verify?orderId=${orderId}`)
      const data = await response.json()
      setPaymentDetails(data)
    } catch (error) {
      console.error('Error fetching payment details:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto"
        >
          {/* Success Card */}
          <Card className="p-8 md:p-12 bg-white shadow-2xl border-green-200">
            <div className="text-center">
              {/* Success Icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ 
                  delay: 0.2,
                  type: "spring",
                  stiffness: 200,
                  damping: 10
                }}
                className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-6"
              >
                <CheckCircleIcon className="w-16 h-16 text-green-600" />
              </motion.div>

              {/* Success Message */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Pembayaran Berhasil! 🎉
                </h1>
                <p className="text-lg text-gray-600 mb-8">
                  Selamat! Langganan Anda telah aktif dan siap digunakan.
                </p>
              </motion.div>

              {/* Order Details */}
              {paymentDetails && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-gray-50 rounded-lg p-6 mb-8 text-left"
                >
                  <h3 className="font-semibold text-gray-900 mb-3">Detail Pembayaran</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Order ID:</span>
                      <span className="font-medium text-gray-900">{orderId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Paket:</span>
                      <span className="font-medium text-gray-900">{paymentDetails.tier}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Periode:</span>
                      <span className="font-medium text-gray-900">
                        {paymentDetails.billingPeriod === 'YEARLY' ? 'Tahunan' : 'Bulanan'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total:</span>
                      <span className="font-medium text-gray-900">
                        Rp {paymentDetails.amount?.toLocaleString('id-ID')}
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Features Unlocked */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6 mb-8"
              >
                <div className="flex items-center justify-center gap-2 mb-3">
                  <SparklesIcon className="w-5 h-5 text-green-600" />
                  <h3 className="font-semibold text-gray-900">Fitur yang Telah Dibuka</h3>
                  <SparklesIcon className="w-5 h-5 text-green-600" />
                </div>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>✓ Akses penuh ke semua fitur</li>
                  <li>✓ Support prioritas 24/7</li>
                  <li>✓ Backup otomatis harian</li>
                  <li>✓ Integrasi WhatsApp & SMS</li>
                </ul>
              </motion.div>

              {/* Actions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="space-y-3"
              >
                <Link href="/dashboard">
                  <Button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white">
                    Ke Dashboard
                    <ArrowRightIcon className="w-4 h-4 ml-2" />
                  </Button>
                </Link>

                <div className="flex gap-3">
                  <Link href="/invoice" className="flex-1">
                    <Button variant="outline" className="w-full">
                      <DocumentTextIcon className="w-4 h-4 mr-2" />
                      Lihat Invoice
                    </Button>
                  </Link>
                  <a
                    href="https://wa.me/6281234567890?text=Saya%20baru%20saja%20melakukan%20pembayaran"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1"
                  >
                    <Button variant="outline" className="w-full">
                      <ChatBubbleLeftRightIcon className="w-4 h-4 mr-2" />
                      Hubungi Support
                    </Button>
                  </a>
                </div>
              </motion.div>

              {/* Next Steps */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="mt-8 pt-8 border-t border-gray-200"
              >
                <h3 className="font-semibold text-gray-900 mb-3">Langkah Selanjutnya</h3>
                <div className="text-sm text-gray-600 space-y-2 text-left">
                  <div className="flex items-start gap-2">
                    <span className="text-green-600 font-semibold">1.</span>
                    <span>Tim support kami akan menghubungi Anda dalam 24 jam untuk onboarding</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-600 font-semibold">2.</span>
                    <span>Lengkapi profil pesantren Anda di dashboard</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-600 font-semibold">3.</span>
                    <span>Mulai tambahkan data santri dan guru</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-600 font-semibold">4.</span>
                    <span>Eksplorasi semua fitur yang tersedia</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </Card>

          {/* Footer Note */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-center mt-6 text-sm text-gray-600"
          >
            <p>
              Invoice dan kwitansi telah dikirim ke email Anda.
              <br />
              Butuh bantuan? Hubungi support@pondokdigital.id
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default function SubscriptionSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    }>
      <SubscriptionSuccessContent />
    </Suspense>
  )
}