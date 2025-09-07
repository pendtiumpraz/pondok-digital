'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  XCircleIcon, 
  ExclamationTriangleIcon,
  CheckIcon,
  ArrowRightIcon,
  PhoneIcon,
  ChatBubbleLeftRightIcon,
  CreditCardIcon,
  RocketLaunchIcon
} from '@heroicons/react/24/outline'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import Link from 'next/link'

function SubscriptionExpiredContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [selectedPlan, setSelectedPlan] = useState('STANDARD')
  const [loading, setLoading] = useState(false)
  
  const reason = searchParams.get('reason')
  const feature = searchParams.get('feature')
  const action = searchParams.get('action')

  const plans = [
    {
      tier: 'BASIC',
      name: 'Basic',
      price: 'Rp 299.000',
      period: '/bulan',
      features: [
        'Hingga 100 santri',
        '20 guru/ustadz',
        '5 GB storage',
        'Laporan dasar',
        'Support email',
      ],
      color: 'from-blue-500 to-indigo-600',
    },
    {
      tier: 'STANDARD',
      name: 'Standard',
      price: 'Rp 799.000',
      period: '/bulan',
      recommended: true,
      features: [
        'Hingga 500 santri',
        '50 guru/ustadz',
        '20 GB storage',
        'Laporan lengkap',
        'Support prioritas',
        'Integrasi WhatsApp',
        'Custom branding',
      ],
      color: 'from-green-500 to-emerald-600',
    },
    {
      tier: 'PREMIUM',
      name: 'Premium',
      price: 'Rp 1.999.000',
      period: '/bulan',
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
      color: 'from-purple-500 to-pink-600',
    },
  ]

  const handleUpgrade = async (tier: string) => {
    setLoading(true)
    try {
      // Call upgrade API
      const response = await fetch('/api/subscription/upgrade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier }),
      })
      
      const data = await response.json()
      
      if (data.paymentUrl) {
        // Redirect to payment page
        window.location.href = data.paymentUrl
      }
    } catch (error) {
      console.error('Error upgrading:', error)
    } finally {
      setLoading(false)
    }
  }

  const getMessage = () => {
    if (feature === 'restricted') {
      return {
        icon: XCircleIcon,
        title: 'Fitur Premium',
        message: 'Fitur ini hanya tersedia untuk pengguna berbayar. Upgrade sekarang untuk mengakses semua fitur.',
      }
    }
    
    if (action === 'modify') {
      return {
        icon: ExclamationTriangleIcon,
        title: 'Trial Sudah Berakhir',
        message: 'Periode trial Anda telah berakhir. Upgrade untuk melanjutkan menambah atau mengubah data.',
      }
    }
    
    if (reason === 'student-limit') {
      return {
        icon: ExclamationTriangleIcon,
        title: 'Batas Santri Tercapai',
        message: 'Anda telah mencapai batas maksimal santri. Upgrade untuk menambah lebih banyak santri.',
      }
    }
    
    return {
      icon: ExclamationTriangleIcon,
      title: 'Trial Anda Telah Berakhir',
      message: 'Terima kasih telah mencoba Pondok Digital. Upgrade sekarang untuk melanjutkan akses penuh.',
    }
  }

  const { icon: Icon, title, message } = getMessage()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-12">
        {/* Alert Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto mb-12"
        >
          <Card className="p-8 bg-red-50 border-red-200">
            <div className="flex items-start gap-4">
              <Icon className="w-8 h-8 text-red-600 flex-shrink-0 mt-1" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{title}</h1>
                <p className="text-gray-700">{message}</p>
                
                <div className="mt-6 p-4 bg-white rounded-lg">
                  <p className="text-sm text-gray-600 mb-3">
                    Butuh bantuan? Hubungi tim sales kami:
                  </p>
                  <div className="flex gap-4">
                    <a
                      href="https://wa.me/6281234567890"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-green-600 hover:text-green-700"
                    >
                      <ChatBubbleLeftRightIcon className="w-5 h-5" />
                      <span>WhatsApp</span>
                    </a>
                    <a
                      href="tel:+6281234567890"
                      className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
                    >
                      <PhoneIcon className="w-5 h-5" />
                      <span>0812-3456-7890</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Pricing Plans */}
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Pilih Paket yang Tepat untuk Pesantren Anda
            </h2>
            <p className="text-xl text-gray-600">
              Semua paket termasuk update gratis dan support teknis
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.tier}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <Card 
                  className={`relative p-6 h-full ${
                    plan.recommended 
                      ? 'ring-2 ring-green-500 shadow-xl' 
                      : 'shadow-lg'
                  } ${
                    selectedPlan === plan.tier 
                      ? 'bg-gradient-to-br from-gray-50 to-white' 
                      : 'bg-white'
                  }`}
                >
                  {plan.recommended && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="bg-green-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                        RECOMMENDED
                      </span>
                    </div>
                  )}

                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {plan.name}
                    </h3>
                    <div className="flex items-baseline justify-center">
                      <span className="text-4xl font-bold text-gray-900">
                        {plan.price}
                      </span>
                      <span className="text-gray-600 ml-2">{plan.period}</span>
                    </div>
                  </div>

                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2">
                        <CheckIcon className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    onClick={() => handleUpgrade(plan.tier)}
                    disabled={loading}
                    className={`w-full bg-gradient-to-r ${plan.color} text-white`}
                  >
                    {loading ? (
                      'Processing...'
                    ) : (
                      <>
                        Upgrade Sekarang
                        <ArrowRightIcon className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Special Offer */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-12"
          >
            <Card className="p-8 bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    🎉 Penawaran Khusus Trial User!
                  </h3>
                  <p className="text-gray-700">
                    Dapatkan diskon 20% untuk 3 bulan pertama. Gunakan kode: <strong>TRIAL20</strong>
                  </p>
                </div>
                <RocketLaunchIcon className="w-12 h-12 text-orange-500" />
              </div>
            </Card>
          </motion.div>

          {/* Alternative Actions */}
          <div className="mt-12 text-center">
            <p className="text-gray-600 mb-4">Belum siap upgrade?</p>
            <div className="flex gap-4 justify-center">
              <Link href="/dashboard">
                <Button variant="outline">
                  Kembali ke Dashboard (Read-Only)
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline">
                  Hubungi Sales
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function SubscriptionExpiredPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    }>
      <SubscriptionExpiredContent />
    </Suspense>
  )
}