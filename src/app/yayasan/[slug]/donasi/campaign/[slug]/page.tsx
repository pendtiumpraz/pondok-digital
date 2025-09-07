'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { DonationCampaign, CampaignUpdate, Donation } from '@/types'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  HeartIcon, 
  ShareIcon,
  CalendarIcon,
  UserGroupIcon,
  ClockIcon,
  PhotoIcon,
  PlayIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline'
import { 
  HeartIcon as HeartSolidIcon,
  FireIcon 
} from '@heroicons/react/24/solid'

interface CampaignDetailPageProps {}

export default function CampaignDetailPage({}: CampaignDetailPageProps) {
  const params = useParams()
  const slug = params.slug as string
  
  const [campaign, setCampaign] = useState<DonationCampaign | null>(null)
  const [updates, setUpdates] = useState<CampaignUpdate[]>([])
  const [donations, setDonations] = useState<Donation[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'story' | 'updates' | 'donors'>('story')

  useEffect(() => {
    if (slug) {
      fetchCampaignData()
    }
  }, [slug])

  const fetchCampaignData = async () => {
    try {
      const [campaignRes, updatesRes, donationsRes] = await Promise.all([
        fetch(`/api/donations/campaigns/${slug}`),
        fetch(`/api/donations/campaigns/${slug}/updates`),
        fetch(`/api/donations/campaigns/${slug}/donations?limit=50`)
      ])

      if (campaignRes.ok) {
        const campaignData = await campaignRes.json()
        setCampaign(campaignData)
      }

      if (updatesRes.ok) {
        const updatesData = await updatesRes.json()
        setUpdates(updatesData.updates || [])
      }

      if (donationsRes.ok) {
        const donationsData = await donationsRes.json()
        setDonations(donationsData.donations || [])
      }
    } catch (error) {
      console.error('Error fetching campaign data:', error)
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
    
    if (diff <= 0) return 'Campaign Berakhir'
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    if (days > 0) return `${days} hari lagi`
    
    const hours = Math.floor(diff / (1000 * 60 * 60))
    return `${hours} jam lagi`
  }

  const handleShare = async () => {
    const shareData = {
      title: campaign?.title || 'Campaign Donasi',
      text: campaign?.description || 'Mari berdonasi untuk kebaikan',
      url: window.location.href,
    }

    if (navigator.share) {
      try {
        await navigator.share(shareData)
      } catch (error) {
        console.log('Sharing cancelled or failed')
      }
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(window.location.href)
      alert('Link berhasil disalin ke clipboard!')
    }

    // Track share count
    if (campaign) {
      fetch(`/api/donations/campaigns/${campaign.slug}/share`, { method: 'POST' })
        .catch(console.error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="animate-pulse">
          <div className="h-96 bg-gray-300"></div>
          <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="bg-gray-300 h-64 rounded-lg mb-4"></div>
                <div className="bg-gray-300 h-32 rounded-lg"></div>
              </div>
              <div className="bg-gray-300 h-96 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!campaign) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Campaign Tidak Ditemukan</h1>
          <p className="text-gray-600 mb-6">Campaign yang Anda cari tidak ada atau sudah dihapus.</p>
          <Link href="/donasi">
            <Button>Kembali ke Donasi</Button>
          </Link>
        </div>
      </div>
    )
  }

  const progress = calculateProgress(campaign.currentAmount, campaign.targetAmount)
  const donorCount = donations.filter(d => d.paymentStatus === 'VERIFIED').length

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative">
        {campaign.mainImage ? (
          <div className="relative h-96 lg:h-[500px]">
            <Image
              src={campaign.mainImage}
              alt={campaign.title}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/40"></div>
          </div>
        ) : (
          <div className="h-96 lg:h-[500px] bg-gradient-to-br from-green-600 to-green-800"></div>
        )}
        
        {/* Status Badges */}
        <div className="absolute top-6 left-6">
          {campaign.isUrgent && (
            <Badge className="bg-red-500 text-white mb-2 block">
              <FireIcon className="w-3 h-3 mr-1" />
              Mendesak
            </Badge>
          )}
          {campaign.isFeatured && (
            <Badge className="bg-yellow-500 text-white">
              ⭐ Pilihan
            </Badge>
          )}
        </div>

        {/* Share Button */}
        <div className="absolute top-6 right-6">
          <Button
            onClick={handleShare}
            variant="secondary"
            size="sm"
            className="bg-white/90 hover:bg-white"
          >
            <ShareIcon className="w-4 h-4 mr-2" />
            Bagikan ({campaign.shareCount})
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Campaign Title */}
            <div className="mb-6">
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                {campaign.title}
              </h1>
              <p className="text-lg text-gray-600 mb-4">
                {campaign.description}
              </p>
              
              {/* Category and Time */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center">
                  <DocumentTextIcon className="w-4 h-4 mr-1" />
                  {campaign.category?.name}
                </div>
                <div className="flex items-center">
                  <CalendarIcon className="w-4 h-4 mr-1" />
                  Dimulai {new Date(campaign.startDate).toLocaleDateString('id-ID')}
                </div>
                {campaign.endDate && (
                  <div className="flex items-center">
                    <ClockIcon className="w-4 h-4 mr-1" />
                    {formatTimeRemaining(campaign.endDate)}
                  </div>
                )}
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 mb-6">
              <nav className="flex space-x-8">
                <button
                  onClick={() => setActiveTab('story')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'story'
                      ? 'border-green-500 text-green-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Cerita Campaign
                </button>
                <button
                  onClick={() => setActiveTab('updates')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'updates'
                      ? 'border-green-500 text-green-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Update ({updates.length})
                </button>
                <button
                  onClick={() => setActiveTab('donors')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'donors'
                      ? 'border-green-500 text-green-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Donatur ({donorCount})
                </button>
              </nav>
            </div>

            {/* Tab Content */}
            <div className="min-h-[400px]">
              {activeTab === 'story' && (
                <div>
                  {/* Campaign Story */}
                  {campaign.story && (
                    <div className="prose max-w-none mb-8">
                      <div 
                        className="text-gray-700 leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: campaign.story.replace(/\n/g, '<br>') }}
                      />
                    </div>
                  )}

                  {/* Campaign Video */}
                  {campaign.video && (
                    <div className="mb-8">
                      <h3 className="text-xl font-semibold mb-4">Video Campaign</h3>
                      <div className="relative bg-gray-900 rounded-lg overflow-hidden">
                        <video 
                          controls 
                          className="w-full"
                          poster={campaign.mainImage}
                        >
                          <source src={campaign.video} type="video/mp4" />
                          Browser Anda tidak mendukung pemutar video.
                        </video>
                      </div>
                    </div>
                  )}

                  {/* Additional Images */}
                  {campaign.images.length > 0 && (
                    <div className="mb-8">
                      <h3 className="text-xl font-semibold mb-4">Dokumentasi</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {campaign.images.map((image, index) => (
                          <div key={index} className="relative group">
                            <Image
                              src={image}
                              alt={`${campaign.title} - ${index + 1}`}
                              width={300}
                              height={200}
                              className="w-full h-40 object-cover rounded-lg"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity rounded-lg flex items-center justify-center">
                              <PhotoIcon className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'updates' && (
                <div className="space-y-6">
                  {updates.length === 0 ? (
                    <div className="text-center py-12">
                      <DocumentTextIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Belum Ada Update</h3>
                      <p className="text-gray-500">Update campaign akan ditampilkan di sini.</p>
                    </div>
                  ) : (
                    updates.map((update) => (
                      <Card key={update.id} className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <h3 className="text-xl font-semibold text-gray-900">{update.title}</h3>
                          <span className="text-sm text-gray-500">
                            {new Date(update.createdAt).toLocaleDateString('id-ID', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </span>
                        </div>
                        <div 
                          className="text-gray-700 mb-4"
                          dangerouslySetInnerHTML={{ __html: update.content.replace(/\n/g, '<br>') }}
                        />
                        {update.images.length > 0 && (
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {update.images.map((image, index) => (
                              <Image
                                key={index}
                                src={image}
                                alt={`Update ${update.title} - ${index + 1}`}
                                width={200}
                                height={150}
                                className="w-full h-32 object-cover rounded-lg"
                              />
                            ))}
                          </div>
                        )}
                      </Card>
                    ))
                  )}
                </div>
              )}

              {activeTab === 'donors' && (
                <div className="space-y-4">
                  {donations.filter(d => d.paymentStatus === 'VERIFIED').length === 0 ? (
                    <div className="text-center py-12">
                      <UserGroupIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Belum Ada Donatur</h3>
                      <p className="text-gray-500">Jadilah donatur pertama untuk campaign ini!</p>
                    </div>
                  ) : (
                    donations
                      .filter(d => d.paymentStatus === 'VERIFIED')
                      .map((donation) => (
                        <Card key={donation.id} className="p-4">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-semibold">
                              {donation.isAnonymous ? '?' : (donation.donorName?.[0] || '?')}
                            </div>
                            <div className="flex-1">
                              <div className="font-medium text-gray-900">
                                {donation.isAnonymous ? 'Hamba Allah' : donation.donorName || 'Anonim'}
                              </div>
                              <div className="text-sm text-green-600 font-semibold">
                                {formatCurrency(donation.amount)}
                              </div>
                              <div className="text-xs text-gray-500">
                                {new Date(donation.createdAt).toLocaleDateString('id-ID', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </div>
                            </div>
                          </div>
                          {donation.message && (
                            <div className="mt-4 pt-4 border-t border-gray-100">
                              <p className="text-sm text-gray-600 italic">"{donation.message}"</p>
                            </div>
                          )}
                        </Card>
                      ))
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 space-y-6">
              {/* Progress Card */}
              <Card className="p-6">
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Terkumpul</span>
                    <span className="text-sm text-gray-600">{Math.round(progress)}%</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    {formatCurrency(campaign.currentAmount)}
                  </div>
                  <div className="text-sm text-gray-500 mb-4">
                    dari target {formatCurrency(campaign.targetAmount)}
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className={`h-3 rounded-full transition-all ${
                        campaign.isUrgent ? 'bg-red-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{donorCount}</div>
                    <div className="text-sm text-gray-600">Donatur</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">
                      {campaign.endDate ? (
                        Math.max(0, Math.ceil((new Date(campaign.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))
                      ) : '∞'}
                    </div>
                    <div className="text-sm text-gray-600">Hari Tersisa</div>
                  </div>
                </div>

                <Link href={`/donasi/donate?campaign=${campaign.id}`}>
                  <Button 
                    size="lg" 
                    className={`w-full ${
                      campaign.isUrgent 
                        ? 'bg-red-500 hover:bg-red-600' 
                        : 'bg-green-500 hover:bg-green-600'
                    }`}
                  >
                    <HeartSolidIcon className="w-5 h-5 mr-2" />
                    Donasi Sekarang
                  </Button>
                </Link>
              </Card>

              {/* Quick Donation Amounts */}
              <Card className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Donasi Cepat</h3>
                <div className="grid grid-cols-2 gap-3">
                  {[50000, 100000, 250000, 500000].map((amount) => (
                    <Link 
                      key={amount}
                      href={`/donasi/donate?campaign=${campaign.id}&amount=${amount}`}
                    >
                      <Button variant="outline" size="sm" className="w-full">
                        {formatCurrency(amount)}
                      </Button>
                    </Link>
                  ))}
                </div>
              </Card>

              {/* Campaign Info */}
              <Card className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Informasi Campaign</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Kategori:</span>
                    <span className="font-medium">{campaign.category?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Dibuat:</span>
                    <span>{new Date(campaign.createdAt).toLocaleDateString('id-ID')}</span>
                  </div>
                  {campaign.endDate && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Berakhir:</span>
                      <span>{new Date(campaign.endDate).toLocaleDateString('id-ID')}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <Badge 
                      variant={campaign.status === 'ACTIVE' ? 'default' : 'secondary'}
                    >
                      {campaign.status}
                    </Badge>
                  </div>
                </div>
              </Card>

              {/* Share Campaign */}
              <Card className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Bagikan Campaign</h3>
                <div className="space-y-3">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={handleShare}
                  >
                    <ShareIcon className="w-4 h-4 mr-2" />
                    Bagikan ke Teman
                  </Button>
                  <div className="text-xs text-gray-500 text-center">
                    Sudah dibagikan {campaign.shareCount} kali
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}