'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { DonationCategory, DonationCampaign, Donation } from '@/types'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  HeartIcon, 
  CurrencyDollarIcon,
  CalendarIcon,
  UserGroupIcon,
  ShareIcon,
  ClockIcon,
  DocumentDuplicateIcon
} from '@heroicons/react/24/outline'
import { 
  HeartIcon as HeartSolidIcon,
  FireIcon 
} from '@heroicons/react/24/solid'
import { formatDonationForWhatsApp, copyToClipboard, showCopyNotification } from '@/lib/whatsapp-formatter'
import PublicLayout from '@/components/layout/PublicLayout'

interface DonasiPageProps {}

export default function DonasiPage({}: DonasiPageProps) {
  const [categories, setCategories] = useState<DonationCategory[]>([])
  const [featuredCampaigns, setFeaturedCampaigns] = useState<DonationCampaign[]>([])
  const [urgentCampaigns, setUrgentCampaigns] = useState<DonationCampaign[]>([])
  const [recentDonations, setRecentDonations] = useState<Donation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDonasiData()
  }, [])

  const fetchDonasiData = async () => {
    try {
      const [categoriesRes, campaignsRes, donationsRes] = await Promise.all([
        fetch('/api/donations/categories'),
        fetch('/api/donations/campaigns?featured=true&limit=6'),
        fetch('/api/donations/list?limit=10&verified=true')
      ])

      const categoriesData = await categoriesRes.json()
      const campaignsData = await campaignsRes.json()
      const donationsData = await donationsRes.json()

      setCategories(categoriesData)
      setFeaturedCampaigns(campaignsData.campaigns || [])
      setUrgentCampaigns(campaignsData.campaigns?.filter((c: DonationCampaign) => c.isUrgent) || [])
      setRecentDonations(donationsData.donations || [])
    } catch (error) {
      console.error('Error fetching donasi data:', error)
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

  const calculateProgress = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100)
  }

  const formatTimeRemaining = (endDate: Date) => {
    const now = new Date()
    const end = new Date(endDate)
    const diff = end.getTime() - now.getTime()
    
    if (diff <= 0) return 'Berakhir'
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    if (days > 0) return `${days} hari lagi`
    
    const hours = Math.floor(diff / (1000 * 60 * 60))
    return `${hours} jam lagi`
  }

  const handleCopyToWhatsApp = async (campaign: DonationCampaign) => {
    const whatsappText = formatDonationForWhatsApp({
      campaignName: campaign.title,
      description: campaign.description,
      targetAmount: campaign.targetAmount,
      collectedAmount: campaign.currentAmount,
      percentage: Math.round(calculateProgress(campaign.currentAmount, campaign.targetAmount)),
      link: typeof window !== 'undefined' ? `${window.location.origin}/donasi/campaign/${campaign.slug}` : `https://pondokimamsyafii.sch.id/donasi/campaign/${campaign.slug}`
    })
    
    const success = await copyToClipboard(whatsappText)
    showCopyNotification(success)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="animate-pulse">
          <div className="h-96 bg-gray-300"></div>
          <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-gray-300 h-64 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <PublicLayout>
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-green-600 to-green-800 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 py-16 lg:py-24">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              Berbagi Keberkahan Bersama
            </h1>
            <p className="text-xl lg:text-2xl mb-8 text-green-100">
              Mari bersama membangun pondok yang lebih baik melalui donasi terbaik Anda
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/donasi/donate">
                <Button size="lg" className="bg-white text-green-600 hover:bg-green-50 text-lg px-8">
                  <HeartSolidIcon className="w-5 h-5 mr-2" />
                  Donasi Sekarang
                </Button>
              </Link>
              <Link href="#kalkulator-zakat">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-white text-white hover:bg-white hover:text-green-600 text-lg px-8"
                >
                  <CurrencyDollarIcon className="w-5 h-5 mr-2" />
                  Kalkulator Zakat
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Donation Categories */}
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Kategori Donasi</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Pilih jenis donasi yang ingin Anda salurkan untuk membantu program pondok
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {categories.map((category) => (
            <Link key={category.id} href={`/donasi/donate?category=${category.id}`}>
              <Card className="p-6 text-center hover:shadow-lg transition-shadow cursor-pointer">
                <div 
                  className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center text-white text-2xl"
                  style={{ backgroundColor: category.color || '#10B981' }}
                >
                  {category.icon || '💝'}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{category.name}</h3>
                <p className="text-sm text-gray-600">{category.description}</p>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Urgent Campaigns */}
      {urgentCampaigns.length > 0 && (
        <div className="bg-red-50 py-12">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10">
              <div className="flex items-center justify-center mb-4">
                <FireIcon className="w-8 h-8 text-red-500 mr-2" />
                <h2 className="text-3xl font-bold text-gray-900">Campaign Mendesak</h2>
              </div>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Campaign yang membutuhkan bantuan segera
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {urgentCampaigns.map((campaign) => (
                <Card key={campaign.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative">
                    {campaign.mainImage ? (
                      <Image
                        src={campaign.mainImage}
                        alt={campaign.title}
                        width={400}
                        height={200}
                        className="w-full h-48 object-cover"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                        <HeartIcon className="w-16 h-16 text-gray-400" />
                      </div>
                    )}
                    <div className="absolute top-3 right-3">
                      <Badge className="bg-red-500 text-white">
                        <FireIcon className="w-3 h-3 mr-1" />
                        Mendesak
                      </Badge>
                    </div>
                    {campaign.endDate && (
                      <div className="absolute top-3 left-3">
                        <Badge variant="secondary">
                          <ClockIcon className="w-3 h-3 mr-1" />
                          {formatTimeRemaining(campaign.endDate)}
                        </Badge>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-6">
                    <h3 className="font-semibold text-lg mb-3 line-clamp-2">{campaign.title}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">{campaign.description}</p>
                    
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">
                          {formatCurrency(campaign.currentAmount)}
                        </span>
                        <span className="text-sm text-gray-500">
                          Target: {formatCurrency(campaign.targetAmount)}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-red-500 h-2 rounded-full transition-all"
                          style={{ width: `${calculateProgress(campaign.currentAmount, campaign.targetAmount)}%` }}
                        ></div>
                      </div>
                      <div className="text-right mt-1">
                        <span className="text-xs text-gray-500">
                          {Math.round(calculateProgress(campaign.currentAmount, campaign.targetAmount))}%
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Link href={`/donasi/campaign/${campaign.slug}`}>
                          <Button variant="outline" size="sm">
                            Lihat Detail
                          </Button>
                        </Link>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleCopyToWhatsApp(campaign)}
                          className="text-[#25D366] border-[#25D366] hover:bg-[#25D366]/10"
                          title="Salin untuk WhatsApp"
                        >
                          <DocumentDuplicateIcon className="w-4 h-4" />
                        </Button>
                      </div>
                      <Link href={`/donasi/donate?campaign=${campaign.id}`}>
                        <Button size="sm" className="bg-red-500 hover:bg-red-600">
                          <HeartSolidIcon className="w-4 h-4 mr-1" />
                          Donasi
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Featured Campaigns */}
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Campaign Pilihan</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Program unggulan pondok yang sedang membutuhkan dukungan
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {featuredCampaigns.filter(c => !c.isUrgent).map((campaign) => (
            <Card key={campaign.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                {campaign.mainImage ? (
                  <Image
                    src={campaign.mainImage}
                    alt={campaign.title}
                    width={400}
                    height={200}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                    <HeartIcon className="w-16 h-16 text-gray-400" />
                  </div>
                )}
                {campaign.isFeatured && (
                  <div className="absolute top-3 left-3">
                    <Badge className="bg-yellow-500 text-white">
                      ⭐ Pilihan
                    </Badge>
                  </div>
                )}
                {campaign.endDate && (
                  <div className="absolute top-3 right-3">
                    <Badge variant="secondary">
                      <ClockIcon className="w-3 h-3 mr-1" />
                      {formatTimeRemaining(campaign.endDate)}
                    </Badge>
                  </div>
                )}
              </div>
              
              <div className="p-6">
                <h3 className="font-semibold text-lg mb-3 line-clamp-2">{campaign.title}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">{campaign.description}</p>
                
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      {formatCurrency(campaign.currentAmount)}
                    </span>
                    <span className="text-sm text-gray-500">
                      Target: {formatCurrency(campaign.targetAmount)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full transition-all"
                      style={{ width: `${calculateProgress(campaign.currentAmount, campaign.targetAmount)}%` }}
                    ></div>
                  </div>
                  <div className="text-right mt-1">
                    <span className="text-xs text-gray-500">
                      {Math.round(calculateProgress(campaign.currentAmount, campaign.targetAmount))}%
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Link href={`/donasi/campaign/${campaign.slug}`}>
                      <Button variant="outline" size="sm">
                        Lihat Detail
                      </Button>
                    </Link>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleCopyToWhatsApp(campaign)}
                      className="text-[#25D366] border-[#25D366] hover:bg-[#25D366]/10"
                      title="Salin untuk WhatsApp"
                    >
                      <DocumentDuplicateIcon className="w-4 h-4" />
                    </Button>
                  </div>
                  <Link href={`/donasi/donate?campaign=${campaign.id}`}>
                    <Button size="sm">
                      <HeartSolidIcon className="w-4 h-4 mr-1" />
                      Donasi
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Link href="/donasi/campaigns">
            <Button variant="outline" size="lg">
              Lihat Semua Campaign
            </Button>
          </Link>
        </div>
      </div>

      {/* Recent Donors */}
      <div className="bg-green-50 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Donatur Terbaru</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Terima kasih kepada para donatur yang telah berpartisipasi
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentDonations.map((donation) => (
              <Card key={donation.id} className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {donation.isAnonymous ? '?' : (donation.donorName?.[0] || '?')}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">
                      {donation.isAnonymous ? 'Hamba Allah' : donation.donorName || 'Anonim'}
                    </div>
                    <div className="text-sm text-gray-600">
                      {formatCurrency(donation.amount)}
                    </div>
                    {donation.campaign && (
                      <div className="text-xs text-gray-500">
                        untuk {donation.campaign.title}
                      </div>
                    )}
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(donation.createdAt).toLocaleDateString('id-ID')}
                  </div>
                </div>
                {donation.message && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-sm text-gray-600 italic">"{donation.message}"</p>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="container mx-auto px-4 py-12">
        <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl text-white p-8 lg:p-12">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              Mulai Berdonasi Hari Ini
            </h2>
            <p className="text-xl mb-8 text-blue-100">
              Setiap rupiah yang Anda donasikan akan memberikan dampak nyata bagi pendidikan dan dakwah
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/donasi/donate">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 text-lg px-8">
                  <HeartSolidIcon className="w-5 h-5 mr-2" />
                  Donasi Bebas
                </Button>
              </Link>
              <Link href="#kalkulator-zakat">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-white text-white hover:bg-white hover:text-blue-600 text-lg px-8"
                >
                  <CurrencyDollarIcon className="w-5 h-5 mr-2" />
                  Hitung Zakat
                </Button>
              </Link>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-blue-600 text-lg px-8"
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: 'Portal Donasi Pondok Imam Syafi\'i',
                      text: 'Mari berdonasi untuk membangun pendidikan Islam yang lebih baik',
                      url: window.location.href,
                    })
                  } else {
                    navigator.clipboard.writeText(window.location.href)
                    alert('Link berhasil disalin!')
                  }
                }}
              >
                <ShareIcon className="w-5 h-5 mr-2" />
                Bagikan
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Zakat Calculator Section */}
      <div id="kalkulator-zakat" className="bg-gray-100 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Kalkulator Zakat</h2>
            <p className="text-gray-600 mb-8">
              Hitung kewajiban zakat Anda dengan mudah dan akurat
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { type: 'fitrah', label: 'Zakat Fitrah', desc: 'Zakat yang wajib dikeluarkan setiap Muslim' },
                { type: 'mal', label: 'Zakat Mal', desc: 'Zakat harta yang telah mencapai nisab' },
                { type: 'emas', label: 'Zakat Emas', desc: 'Zakat untuk kepemilikan emas' },
                { type: 'perak', label: 'Zakat Perak', desc: 'Zakat untuk kepemilikan perak' },
                { type: 'perdagangan', label: 'Zakat Perdagangan', desc: 'Zakat untuk modal usaha' }
              ].map((item) => (
                <Link key={item.type} href={`/donasi/zakat-calculator?type=${item.type}`}>
                  <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer h-full">
                    <div className="text-center">
                      <CurrencyDollarIcon className="w-12 h-12 mx-auto text-green-500 mb-3" />
                      <h3 className="font-semibold text-gray-900 mb-2">{item.label}</h3>
                      <p className="text-sm text-gray-600">{item.desc}</p>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  )
}