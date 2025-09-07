'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { DonationCategory, DonationCampaign, DonationFormData } from '@/types'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  HeartIcon, 
  CurrencyDollarIcon,
  UserIcon,
  PhoneIcon,
  EnvelopeIcon,
  ChatBubbleLeftRightIcon,
  CreditCardIcon,
  BanknotesIcon,
  DevicePhoneMobileIcon,
  QrCodeIcon
} from '@heroicons/react/24/outline'
import { 
  HeartIcon as HeartSolidIcon,
  CheckCircleIcon
} from '@heroicons/react/24/solid'

export default function DonatePageClient() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [categories, setCategories] = useState<DonationCategory[]>([])
  const [campaigns, setCampaigns] = useState<DonationCampaign[]>([])
  const [selectedCampaign, setSelectedCampaign] = useState<DonationCampaign | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  
  // Form state
  const [formData, setFormData] = useState<DonationFormData>({
    campaignId: '',
    categoryId: '',
    amount: 0,
    message: '',
    donorName: '',
    donorEmail: '',
    donorPhone: '',
    isAnonymous: false,
    paymentMethod: '',
    paymentChannel: ''
  })

  // Preset amounts
  const presetAmounts = [25000, 50000, 100000, 250000, 500000, 1000000]
  const [customAmount, setCustomAmount] = useState('')

  useEffect(() => {
    fetchInitialData()
    
    // Set initial values from URL params
    const campaignId = searchParams.get('campaign')
    const categoryId = searchParams.get('category') 
    const amount = searchParams.get('amount')
    
    if (campaignId) {
      setFormData(prev => ({ ...prev, campaignId }))
    }
    if (categoryId) {
      setFormData(prev => ({ ...prev, categoryId }))
    }
    if (amount) {
      setFormData(prev => ({ ...prev, amount: parseInt(amount) }))
    }
  }, [searchParams])

  const fetchInitialData = async () => {
    try {
      const [categoriesRes, campaignsRes] = await Promise.all([
        fetch('/api/donations/categories?active=true'),
        fetch('/api/donations/campaigns?status=ACTIVE&limit=50')
      ])

      const categoriesData = await categoriesRes.json()
      const campaignsData = await campaignsRes.json()

      setCategories(categoriesData)
      setCampaigns(campaignsData.campaigns || [])

      // If campaign ID is provided, find and set the campaign
      const campaignId = searchParams.get('campaign')
      if (campaignId) {
        const campaign = campaignsData.campaigns?.find((c: DonationCampaign) => c.id === campaignId)
        if (campaign) {
          setSelectedCampaign(campaign)
          setFormData(prev => ({ 
            ...prev, 
            campaignId: campaign.id,
            categoryId: campaign.categoryId 
          }))
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const handleAmountSelect = (amount: number) => {
    setFormData(prev => ({ ...prev, amount }))
    setCustomAmount('')
  }

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value)
    const numericValue = parseInt(value.replace(/\D/g, ''))
    if (!isNaN(numericValue)) {
      setFormData(prev => ({ ...prev, amount: numericValue }))
    }
  }

  const handleCampaignSelect = (campaign: DonationCampaign) => {
    setSelectedCampaign(campaign)
    setFormData(prev => ({ 
      ...prev, 
      campaignId: campaign.id,
      categoryId: campaign.categoryId 
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (formData.amount < 1000) {
      alert('Minimal donasi adalah Rp 1.000')
      return
    }

    if (!formData.categoryId) {
      alert('Silakan pilih kategori donasi')
      return
    }

    if (!formData.paymentMethod) {
      alert('Silakan pilih metode pembayaran')
      return
    }

    if (!formData.isAnonymous && (!formData.donorName || !formData.donorEmail)) {
      alert('Silakan lengkapi nama dan email donatur')
      return
    }

    setSubmitting(true)

    try {
      const response = await fetch('/api/donations/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          source: 'WEB',
          ipAddress: window.location.hostname,
          userAgent: navigator.userAgent,
          referrer: document.referrer
        }),
      })

      const result = await response.json()

      if (response.ok) {
        // Redirect to payment page or success page
        if (result.paymentUrl) {
          window.location.href = result.paymentUrl
        } else {
          router.push(`/donasi/success?donation=${result.donationNo}`)
        }
      } else {
        alert(result.error || 'Terjadi kesalahan saat memproses donasi')
      }
    } catch (error) {
      console.error('Error submitting donation:', error)
      alert('Terjadi kesalahan sistem. Silakan coba lagi.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="animate-pulse container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gray-300 h-8 w-64 mx-auto mb-8 rounded"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-gray-300 h-96 rounded-lg"></div>
              <div className="bg-gray-300 h-96 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Form Donasi</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Barakallahu fiik atas niat baik Anda untuk berdonasi. Semoga Allah SWT membalas kebaikan Anda.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Form */}
              <div className="space-y-6">
                {/* Campaign Selection */}
                <Card className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Pilih Campaign (Opsional)</h2>
                  
                  {selectedCampaign ? (
                    <div className="border border-green-200 rounded-lg p-4 bg-green-50">
                      <div className="flex items-start space-x-4">
                        {selectedCampaign.mainImage && (
                          <Image
                            src={selectedCampaign.mainImage}
                            alt={selectedCampaign.title}
                            width={80}
                            height={60}
                            className="rounded-lg object-cover"
                          />
                        )}
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{selectedCampaign.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {selectedCampaign.description.substring(0, 100)}...
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-sm text-green-600">
                              {formatCurrency(selectedCampaign.currentAmount)} terkumpul
                            </span>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedCampaign(null)
                                setFormData(prev => ({ ...prev, campaignId: '', categoryId: '' }))
                              }}
                            >
                              Ganti
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="mb-4">
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full"
                          onClick={() => setFormData(prev => ({ ...prev, campaignId: '', categoryId: '' }))}
                        >
                          Donasi Umum (Tanpa Campaign Tertentu)
                        </Button>
                      </div>
                      
                      <div className="space-y-3 max-h-60 overflow-y-auto">
                        {campaigns.map((campaign) => (
                          <div
                            key={campaign.id}
                            className="border border-gray-200 rounded-lg p-3 hover:border-green-300 cursor-pointer transition-colors"
                            onClick={() => handleCampaignSelect(campaign)}
                          >
                            <div className="flex items-start space-x-3">
                              {campaign.mainImage && (
                                <Image
                                  src={campaign.mainImage}
                                  alt={campaign.title}
                                  width={60}
                                  height={45}
                                  className="rounded object-cover"
                                />
                              )}
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-sm text-gray-900 line-clamp-1">
                                  {campaign.title}
                                </h4>
                                <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                                  {campaign.description}
                                </p>
                                <div className="text-xs text-green-600 mt-1">
                                  {formatCurrency(campaign.currentAmount)} / {formatCurrency(campaign.targetAmount)}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </Card>

                {/* Category Selection */}
                {!selectedCampaign && (
                  <Card className="p-6">
                    <h2 className="text-xl font-semibold mb-4">Kategori Donasi</h2>
                    <div className="grid grid-cols-2 gap-3">
                      {categories.map((category) => (
                        <button
                          key={category.id}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, categoryId: category.id }))}
                          className={`p-4 rounded-lg border text-left transition-colors ${
                            formData.categoryId === category.id
                              ? 'border-green-500 bg-green-50'
                              : 'border-gray-200 hover:border-green-300'
                          }`}
                        >
                          <div 
                            className="w-8 h-8 rounded-full text-white text-sm flex items-center justify-center mb-2"
                            style={{ backgroundColor: category.color || '#10B981' }}
                          >
                            {category.icon || '💝'}
                          </div>
                          <h3 className="font-medium text-gray-900 text-sm">{category.name}</h3>
                          <p className="text-xs text-gray-600 mt-1">{category.description}</p>
                        </button>
                      ))}
                    </div>
                  </Card>
                )}

                {/* Amount Selection */}
                <Card className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Jumlah Donasi</h2>
                  
                  {/* Preset amounts */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                    {presetAmounts.map((amount) => (
                      <button
                        key={amount}
                        type="button"
                        onClick={() => handleAmountSelect(amount)}
                        className={`p-3 rounded-lg border text-center transition-colors ${
                          formData.amount === amount && !customAmount
                            ? 'border-green-500 bg-green-50 text-green-700'
                            : 'border-gray-200 hover:border-green-300'
                        }`}
                      >
                        <div className="font-semibold text-sm">
                          {formatCurrency(amount)}
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Custom amount */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Atau masukkan jumlah lain:
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                        Rp
                      </span>
                      <Input
                        type="text"
                        placeholder="0"
                        value={customAmount}
                        onChange={(e) => handleCustomAmountChange(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  {formData.amount > 0 && (
                    <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="text-sm text-blue-800">
                        <strong>Total Donasi: {formatCurrency(formData.amount)}</strong>
                      </div>
                    </div>
                  )}
                </Card>

                {/* Donor Information */}
                <Card className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Informasi Donatur</h2>
                  
                  <div className="mb-4">
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={formData.isAnonymous}
                        onChange={(e) => setFormData(prev => ({ ...prev, isAnonymous: e.target.checked }))}
                        className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                      />
                      <span className="text-sm font-medium text-gray-700">
                        Donasi secara anonim
                      </span>
                    </label>
                  </div>

                  {!formData.isAnonymous && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nama Lengkap *
                        </label>
                        <div className="relative">
                          <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <Input
                            type="text"
                            required={!formData.isAnonymous}
                            placeholder="Masukkan nama lengkap"
                            value={formData.donorName}
                            onChange={(e) => setFormData(prev => ({ ...prev, donorName: e.target.value }))}
                            className="pl-10"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email *
                        </label>
                        <div className="relative">
                          <EnvelopeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <Input
                            type="email"
                            required={!formData.isAnonymous}
                            placeholder="email@example.com"
                            value={formData.donorEmail}
                            onChange={(e) => setFormData(prev => ({ ...prev, donorEmail: e.target.value }))}
                            className="pl-10"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nomor Telepon
                        </label>
                        <div className="relative">
                          <PhoneIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <Input
                            type="tel"
                            placeholder="08xxxxxxxxxx"
                            value={formData.donorPhone}
                            onChange={(e) => setFormData(prev => ({ ...prev, donorPhone: e.target.value }))}
                            className="pl-10"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pesan untuk Penerima Manfaat (Opsional)
                    </label>
                    <div className="relative">
                      <ChatBubbleLeftRightIcon className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                      <textarea
                        rows={3}
                        placeholder="Tuliskan pesan atau doa untuk penerima manfaat..."
                        value={formData.message}
                        onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                      />
                    </div>
                  </div>
                </Card>

                {/* Payment Method */}
                <Card className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Metode Pembayaran</h2>
                  
                  <div className="space-y-3">
                    {/* Bank Transfer */}
                    <div>
                      <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-green-300 transition-colors">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="TRANSFER"
                          checked={formData.paymentMethod === 'TRANSFER'}
                          onChange={(e) => setFormData(prev => ({ ...prev, paymentMethod: e.target.value }))}
                          className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"
                        />
                        <BanknotesIcon className="w-5 h-5 text-gray-500" />
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">Transfer Bank</div>
                          <div className="text-sm text-gray-500">BCA, BNI, Mandiri, BRI</div>
                        </div>
                      </label>
                    </div>

                    {/* Virtual Account */}
                    <div>
                      <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-green-300 transition-colors">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="VA"
                          checked={formData.paymentMethod === 'VA'}
                          onChange={(e) => setFormData(prev => ({ ...prev, paymentMethod: e.target.value }))}
                          className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"
                        />
                        <CreditCardIcon className="w-5 h-5 text-gray-500" />
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">Virtual Account</div>
                          <div className="text-sm text-gray-500">Nomor VA otomatis</div>
                        </div>
                      </label>
                    </div>

                    {/* E-Wallet */}
                    <div>
                      <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-green-300 transition-colors">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="EWALLET"
                          checked={formData.paymentMethod === 'EWALLET'}
                          onChange={(e) => setFormData(prev => ({ ...prev, paymentMethod: e.target.value }))}
                          className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"
                        />
                        <DevicePhoneMobileIcon className="w-5 h-5 text-gray-500" />
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">E-Wallet</div>
                          <div className="text-sm text-gray-500">GoPay, OVO, Dana, LinkAja</div>
                        </div>
                      </label>
                    </div>

                    {/* QRIS */}
                    <div>
                      <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-green-300 transition-colors">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="QRIS"
                          checked={formData.paymentMethod === 'QRIS'}
                          onChange={(e) => setFormData(prev => ({ ...prev, paymentMethod: e.target.value }))}
                          className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"
                        />
                        <QrCodeIcon className="w-5 h-5 text-gray-500" />
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">QRIS</div>
                          <div className="text-sm text-gray-500">Scan QR dengan aplikasi bank/e-wallet</div>
                        </div>
                      </label>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Right Column - Summary */}
              <div className="lg:sticky lg:top-4 lg:self-start">
                <Card className="p-6">
                  <h2 className="text-xl font-semibold mb-6">Ringkasan Donasi</h2>
                  
                  {/* Campaign Info */}
                  {selectedCampaign ? (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                      <h3 className="font-medium text-green-900 mb-2">Campaign Terpilih</h3>
                      <p className="text-sm text-green-700">{selectedCampaign.title}</p>
                    </div>
                  ) : formData.categoryId ? (
                    <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <h3 className="font-medium text-blue-900 mb-2">Kategori</h3>
                      <p className="text-sm text-blue-700">
                        {categories.find(c => c.id === formData.categoryId)?.name}
                      </p>
                    </div>
                  ) : null}

                  {/* Amount */}
                  <div className="border-b border-gray-200 pb-4 mb-4">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-900">Jumlah Donasi</span>
                      <span className="text-xl font-bold text-gray-900">
                        {formData.amount > 0 ? formatCurrency(formData.amount) : 'Rp 0'}
                      </span>
                    </div>
                  </div>

                  {/* Donor Info */}
                  <div className="border-b border-gray-200 pb-4 mb-4">
                    <h3 className="font-medium text-gray-900 mb-2">Donatur</h3>
                    <p className="text-sm text-gray-600">
                      {formData.isAnonymous 
                        ? 'Hamba Allah (Anonim)'
                        : formData.donorName || 'Belum diisi'
                      }
                    </p>
                    {!formData.isAnonymous && formData.donorEmail && (
                      <p className="text-sm text-gray-600">{formData.donorEmail}</p>
                    )}
                  </div>

                  {/* Payment Method */}
                  <div className="border-b border-gray-200 pb-4 mb-6">
                    <h3 className="font-medium text-gray-900 mb-2">Metode Pembayaran</h3>
                    <p className="text-sm text-gray-600">
                      {formData.paymentMethod || 'Belum dipilih'}
                    </p>
                  </div>

                  {/* Certificate Info */}
                  <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-start space-x-2">
                      <CheckCircleIcon className="w-5 h-5 text-yellow-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-yellow-900 text-sm">Sertifikat Donasi</h4>
                        <p className="text-xs text-yellow-700 mt-1">
                          Anda akan menerima sertifikat donasi setelah pembayaran terverifikasi
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <Button 
                    type="submit" 
                    disabled={submitting || formData.amount < 1000 || !formData.categoryId}
                    className="w-full bg-green-600 hover:bg-green-700 text-lg py-3"
                  >
                    {submitting ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Memproses...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <HeartSolidIcon className="w-5 h-5 mr-2" />
                        Lanjutkan Pembayaran
                      </div>
                    )}
                  </Button>

                  <p className="text-xs text-gray-500 text-center mt-4">
                    Dengan melanjutkan, Anda menyetujui syarat dan ketentuan donasi
                  </p>
                </Card>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}