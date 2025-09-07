'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { 
  Calendar,
  MapPin,
  Clock,
  Users,
  Eye,
  Share2,
  Copy,
  Search,
  Filter,
  Grid3x3,
  List,
  ChevronLeft,
  ChevronRight,
  X,
  Play,
  Image as ImageIcon,
  Award,
  BookOpen,
  Heart,
  Star,
  Sparkles,
  Camera,
  Video,
  Music,
  Trophy,
  Handshake
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface Activity {
  id: string
  title: string
  description: string
  date: string
  endDate?: string
  location: string
  category: string
  status: 'upcoming' | 'ongoing' | 'completed'
  participants: number
  maxParticipants?: number
  images: string[]
  organizer: string
  contact: string
  isHighlight: boolean
  views: number
  likes: number
  tags: string[]
}

export default function KegiatanPage() {
  const params = useParams()
  const slug = params.slug as string

  const [activities, setActivities] = useState<Activity[]>([])
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const categories = [
    { value: 'all', label: 'Semua', color: 'bg-gray-100 text-gray-800', icon: Calendar },
    { value: 'akademik', label: 'Akademik', color: 'bg-blue-100 text-blue-800', icon: BookOpen },
    { value: 'keagamaan', label: 'Keagamaan', color: 'bg-green-100 text-green-800', icon: Heart },
    { value: 'kompetisi', label: 'Kompetisi', color: 'bg-purple-100 text-purple-800', icon: Trophy },
    { value: 'sosial', label: 'Sosial', color: 'bg-red-100 text-red-800', icon: Handshake },
    { value: 'seni_budaya', label: 'Seni & Budaya', color: 'bg-yellow-100 text-yellow-800', icon: Music },
    { value: 'olahraga', label: 'Olahraga', color: 'bg-orange-100 text-orange-800', icon: Award },
    { value: 'kunjungan', label: 'Kunjungan', color: 'bg-indigo-100 text-indigo-800', icon: Users },
  ]

  const statusOptions = [
    { value: 'all', label: 'Semua Status' },
    { value: 'upcoming', label: 'Akan Datang' },
    { value: 'ongoing', label: 'Sedang Berlangsung' },
    { value: 'completed', label: 'Selesai' }
  ]

  // Sample data - in real app, this would come from API
  const sampleActivities: Activity[] = [
    {
      id: '1',
      title: 'Pesantren Kilat Ramadhan 1445 H',
      description: 'Program pesantren kilat untuk mempersiapkan santri dalam menyambut bulan suci Ramadhan dengan berbagai kegiatan spiritual dan edukasi.',
      date: '2024-03-15',
      endDate: '2024-03-25',
      location: 'Pondok Pesantren Imam Syafi\'i',
      category: 'keagamaan',
      status: 'completed',
      participants: 150,
      maxParticipants: 200,
      images: ['/api/placeholder/800/600', '/api/placeholder/800/600', '/api/placeholder/800/600'],
      organizer: 'Bagian Kurikulum',
      contact: '081234567890',
      isHighlight: true,
      views: 1250,
      likes: 85,
      tags: ['ramadhan', 'spiritual', 'tahfidz', 'kajian']
    },
    {
      id: '2',
      title: 'Lomba Tilawah Al-Quran Tingkat Regional',
      description: 'Kompetisi tilawah Al-Quran untuk santri tingkat regional dengan berbagai kategori umur dan jenis tilawah.',
      date: '2024-02-20',
      location: 'Aula Utama Pondok',
      category: 'kompetisi',
      status: 'completed',
      participants: 75,
      images: ['/api/placeholder/800/600', '/api/placeholder/800/600'],
      organizer: 'Tim Tahfidz',
      contact: '081234567891',
      isHighlight: true,
      views: 890,
      likes: 65,
      tags: ['tilawah', 'quran', 'kompetisi', 'regional']
    },
    {
      id: '3',
      title: 'Bakti Sosial untuk Masyarakat Dhuafa',
      description: 'Program bakti sosial berupa pembagian sembako dan layanan kesehatan gratis untuk masyarakat kurang mampu di sekitar pondok.',
      date: '2024-01-28',
      location: 'Desa Sekitar Pondok',
      category: 'sosial',
      status: 'completed',
      participants: 50,
      images: ['/api/placeholder/800/600'],
      organizer: 'Badan Sosial Santri',
      contact: '081234567892',
      isHighlight: false,
      views: 650,
      likes: 42,
      tags: ['baksos', 'sosial', 'masyarakat', 'sembako']
    },
    {
      id: '4',
      title: 'Workshop Keterampilan Digital untuk Santri',
      description: 'Pelatihan keterampilan digital meliputi desain grafis, video editing, dan pemasaran online untuk mempersiapkan santri di era digital.',
      date: '2024-04-10',
      endDate: '2024-04-12',
      location: 'Lab Komputer Pondok',
      category: 'akademik',
      status: 'upcoming',
      participants: 25,
      maxParticipants: 30,
      images: ['/api/placeholder/800/600'],
      organizer: 'Tim IT Pondok',
      contact: '081234567893',
      isHighlight: false,
      views: 320,
      likes: 18,
      tags: ['digital', 'workshop', 'teknologi', 'keterampilan']
    },
    {
      id: '5',
      title: 'Festival Seni Budaya Islam',
      description: 'Pameran dan pertunjukan seni budaya Islam meliputi kaligrafi, nasyid, drama islami, dan pameran karya santri.',
      date: '2024-05-15',
      endDate: '2024-05-17',
      location: 'Kompleks Pondok Pesantren',
      category: 'seni_budaya',
      status: 'upcoming',
      participants: 0,
      maxParticipants: 500,
      images: ['/api/placeholder/800/600', '/api/placeholder/800/600'],
      organizer: 'Divisi Seni & Budaya',
      contact: '081234567894',
      isHighlight: true,
      views: 450,
      likes: 28,
      tags: ['seni', 'budaya', 'islam', 'festival', 'nasyid']
    },
    {
      id: '6',
      title: 'Turnamen Futsal Antar Pondok',
      description: 'Kompetisi futsal antar pondok pesantren se-Jawa Timur untuk mempererat silaturahmi dan sportivitas.',
      date: '2024-03-30',
      location: 'Lapangan Futsal Pondok',
      category: 'olahraga',
      status: 'ongoing',
      participants: 120,
      maxParticipants: 150,
      images: ['/api/placeholder/800/600'],
      organizer: 'Bagian Olahraga',
      contact: '081234567895',
      isHighlight: false,
      views: 720,
      likes: 55,
      tags: ['futsal', 'olahraga', 'turnamen', 'pondok']
    }
  ]

  useEffect(() => {
    setActivities(sampleActivities)
  }, [])

  const filteredActivities = activities.filter(activity => {
    const matchesSearch = activity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         activity.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         activity.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesCategory = selectedCategory === 'all' || activity.category === selectedCategory
    const matchesStatus = selectedStatus === 'all' || activity.status === selectedStatus
    return matchesSearch && matchesCategory && matchesStatus
  })

  const upcomingActivities = activities.filter(a => a.status === 'upcoming').slice(0, 3)
  const highlightActivities = activities.filter(a => a.isHighlight).slice(0, 2)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  const formatDateRange = (startDate: string, endDate?: string) => {
    if (!endDate) return formatDate(startDate)
    return `${formatDate(startDate)} - ${formatDate(endDate)}`
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      upcoming: { label: 'Akan Datang', color: 'bg-blue-100 text-blue-800' },
      ongoing: { label: 'Berlangsung', color: 'bg-green-100 text-green-800' },
      completed: { label: 'Selesai', color: 'bg-gray-100 text-gray-800' }
    }
    return statusConfig[status as keyof typeof statusConfig] || statusConfig.completed
  }

  const handleCopyToWhatsApp = async (activity: Activity) => {
    const text = `🕌 *${activity.title}*\n\n📅 ${formatDateRange(activity.date, activity.endDate)}\n📍 ${activity.location}\n👥 ${activity.participants} peserta\n\n${activity.description}\n\n🔗 Lihat selengkapnya: ${window.location.origin}/yayasan/${slug}/kegiatan`
    
    try {
      await navigator.clipboard.writeText(text)
      alert('Link kegiatan berhasil disalin ke clipboard!')
    } catch (err) {
      console.error('Failed to copy: ', err)
    }
  }

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Kegiatan Yayasan</h1>
            <p className="text-purple-100 text-xl">Berbagai Program dan Aktivitas Pendidikan</p>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="initial"
            animate="animate"
            variants={{ animate: { transition: { staggerChildren: 0.1 } } }}
            className="text-center mb-16"
          >
            <motion.div variants={fadeInUp}>
              <Badge className="mb-4 bg-purple-100 text-purple-800 text-base px-4 py-2">
                <Sparkles className="w-4 h-4 mr-2" />
                Program Terkini
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Kegiatan & Program Unggulan
              </h2>
              <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                Ikuti berbagai kegiatan menarik yang dirancang untuk mengembangkan potensi santri 
                dalam bidang akademik, spiritual, sosial, dan keterampilan hidup.
              </p>
            </motion.div>
          </motion.div>

          {/* Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <Calendar className="w-8 h-8 text-purple-600 mx-auto mb-3" />
                <div className="text-3xl font-bold text-gray-900 mb-1">{activities.length}</div>
                <p className="text-gray-600 text-sm">Total Kegiatan</p>
              </CardContent>
            </Card>
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <Users className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {activities.reduce((sum, a) => sum + a.participants, 0)}
                </div>
                <p className="text-gray-600 text-sm">Total Peserta</p>
              </CardContent>
            </Card>
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <Clock className="w-8 h-8 text-green-600 mx-auto mb-3" />
                <div className="text-3xl font-bold text-gray-900 mb-1">{upcomingActivities.length}</div>
                <p className="text-gray-600 text-sm">Akan Datang</p>
              </CardContent>
            </Card>
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <Star className="w-8 h-8 text-yellow-600 mx-auto mb-3" />
                <div className="text-3xl font-bold text-gray-900 mb-1">{highlightActivities.length}</div>
                <p className="text-gray-600 text-sm">Unggulan</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Highlight Activities */}
      {highlightActivities.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">Kegiatan Unggulan</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {highlightActivities.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="group cursor-pointer"
                  onClick={() => setSelectedActivity(activity)}
                >
                  <Card className="h-full hover:shadow-xl transition-all group-hover:scale-105">
                    <div className="relative h-64 overflow-hidden rounded-t-lg">
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center">
                        <Camera className="w-16 h-16 text-white/30" />
                      </div>
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-yellow-500 text-white">
                          <Star className="w-3 h-3 mr-1" />
                          Unggulan
                        </Badge>
                      </div>
                      <div className="absolute top-4 right-4">
                        <Badge className={getStatusBadge(activity.status).color}>
                          {getStatusBadge(activity.status).label}
                        </Badge>
                      </div>
                      <div className="absolute bottom-4 right-4">
                        <Badge variant="secondary" className="bg-white/90">
                          {activity.images.length} Foto
                        </Badge>
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <Badge className={categories.find(c => c.value === activity.category)?.color || 'bg-gray-100 text-gray-800'}>
                          {categories.find(c => c.value === activity.category)?.label || activity.category}
                        </Badge>
                      </div>
                      <h3 className="text-xl font-bold mb-3 group-hover:text-purple-600 transition-colors">
                        {activity.title}
                      </h3>
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {activity.description}
                      </p>
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDateRange(activity.date, activity.endDate)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          <span>{activity.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          <span>
                            {activity.participants} peserta
                            {activity.maxParticipants && ` dari ${activity.maxParticipants}`}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-4 pt-4 border-t">
                        <div className="flex items-center gap-3 text-gray-500 text-sm">
                          <div className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            <span>{activity.views}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Heart className="w-4 h-4" />
                            <span>{activity.likes}</span>
                          </div>
                        </div>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleCopyToWhatsApp(activity)
                          }}
                          className="text-[#25D366] hover:text-[#25D366] hover:bg-[#25D366]/10"
                          title="Salin untuk WhatsApp"
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Filters and Search */}
      <section className="py-12 bg-gray-50 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Cari kegiatan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('grid')}
              >
                <Grid3x3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('list')}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Category and Status Filters */}
          <div className="mt-6">
            <Tabs defaultValue="category" className="w-full">
              <TabsList className="grid w-full grid-cols-2 max-w-md">
                <TabsTrigger value="category">Kategori</TabsTrigger>
                <TabsTrigger value="status">Status</TabsTrigger>
              </TabsList>
              <TabsContent value="category" className="mt-4">
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {categories.map((cat) => (
                    <Button
                      key={cat.value}
                      variant={selectedCategory === cat.value ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedCategory(cat.value)}
                      className="whitespace-nowrap"
                    >
                      <cat.icon className="w-4 h-4 mr-2" />
                      {cat.label}
                    </Button>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="status" className="mt-4">
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {statusOptions.map((status) => (
                    <Button
                      key={status.value}
                      variant={selectedStatus === status.value ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedStatus(status.value)}
                      className="whitespace-nowrap"
                    >
                      {status.label}
                    </Button>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>

      {/* Activities Grid/List */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredActivities.length === 0 ? (
            <div className="text-center py-20">
              <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">Tidak ada kegiatan</h3>
              <p className="text-gray-500">
                {searchQuery ? 'Coba ubah kata kunci pencarian Anda.' : 'Belum ada kegiatan yang sesuai dengan filter Anda.'}
              </p>
            </div>
          ) : (
            <div className={viewMode === 'grid' 
              ? "grid md:grid-cols-2 lg:grid-cols-3 gap-8" 
              : "space-y-6"
            }>
              {filteredActivities.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card 
                    className={`overflow-hidden hover:shadow-xl transition-all cursor-pointer ${viewMode === 'list' ? 'flex flex-col md:flex-row' : ''}`}
                    onClick={() => setSelectedActivity(activity)}
                  >
                    <div className={`relative bg-gradient-to-br from-gray-200 to-gray-300 overflow-hidden ${
                      viewMode === 'list' ? 'md:w-80 h-48 md:h-auto' : 'h-48'
                    }`}>
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center">
                        <Camera className="w-12 h-12 text-white/30" />
                      </div>
                      <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                        <Badge className={getStatusBadge(activity.status).color}>
                          {getStatusBadge(activity.status).label}
                        </Badge>
                        {activity.isHighlight && (
                          <Badge className="bg-yellow-500 text-white">
                            <Star className="w-3 h-3 mr-1" />
                            Unggulan
                          </Badge>
                        )}
                      </div>
                      <div className="absolute bottom-4 right-4">
                        <Badge variant="secondary" className="bg-white/90">
                          {activity.images.length} Foto
                        </Badge>
                      </div>
                    </div>

                    <CardContent className={`p-6 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                      <div className="flex items-center gap-2 mb-3">
                        <Badge className={categories.find(c => c.value === activity.category)?.color || 'bg-gray-100 text-gray-800'}>
                          {categories.find(c => c.value === activity.category)?.label || activity.category}
                        </Badge>
                      </div>
                      
                      <h3 className={`font-bold mb-3 hover:text-purple-600 transition-colors ${
                        viewMode === 'list' ? 'text-xl' : 'text-lg'
                      }`}>
                        {activity.title}
                      </h3>
                      
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {activity.description}
                      </p>

                      <div className="space-y-2 text-sm text-gray-600 mb-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDateRange(activity.date, activity.endDate)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          <span>{activity.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          <span>
                            {activity.participants} peserta
                            {activity.maxParticipants && ` / ${activity.maxParticipants}`}
                          </span>
                        </div>
                      </div>

                      {activity.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-4">
                          {activity.tags.slice(0, 3).map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              #{tag}
                            </Badge>
                          ))}
                          {activity.tags.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{activity.tags.length - 3}
                            </Badge>
                          )}
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-4 border-t">
                        <div className="flex items-center gap-3 text-gray-500 text-sm">
                          <div className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            <span>{activity.views}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Heart className="w-4 h-4" />
                            <span>{activity.likes}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleCopyToWhatsApp(activity)
                            }}
                            className="text-[#25D366] hover:text-[#25D366] hover:bg-[#25D366]/10"
                            title="Salin untuk WhatsApp"
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Share2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Activity Detail Modal */}
      <AnimatePresence>
        {selectedActivity && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedActivity(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between z-10">
                <h2 className="text-2xl font-bold">{selectedActivity.title}</h2>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setSelectedActivity(null)}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="p-6">
                {/* Image Gallery */}
                <div className="mb-6">
                  <div className="relative h-96 bg-gray-200 rounded-lg overflow-hidden mb-4">
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-purple-400 to-purple-600">
                      <Camera className="w-24 h-24 text-white/30" />
                      <span className="absolute bottom-4 left-4 text-white/80">
                        Foto {selectedImageIndex + 1} dari {selectedActivity.images.length}
                      </span>
                    </div>
                    {selectedActivity.images.length > 1 && (
                      <>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white/90"
                          onClick={() => setSelectedImageIndex(Math.max(0, selectedImageIndex - 1))}
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white/90"
                          onClick={() => setSelectedImageIndex(Math.min(selectedActivity.images.length - 1, selectedImageIndex + 1))}
                        >
                          <ChevronRight className="w-5 h-5" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>

                {/* Activity Details */}
                <div className="space-y-6">
                  <div className="flex flex-wrap gap-2">
                    <Badge className={getStatusBadge(selectedActivity.status).color}>
                      {getStatusBadge(selectedActivity.status).label}
                    </Badge>
                    <Badge className={categories.find(c => c.value === selectedActivity.category)?.color || 'bg-gray-100 text-gray-800'}>
                      {categories.find(c => c.value === selectedActivity.category)?.label || selectedActivity.category}
                    </Badge>
                    {selectedActivity.isHighlight && (
                      <Badge className="bg-yellow-500 text-white">
                        <Star className="w-3 h-3 mr-1" />
                        Unggulan
                      </Badge>
                    )}
                  </div>

                  <p className="text-gray-700 leading-relaxed">
                    {selectedActivity.description}
                  </p>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-semibold text-gray-900">Informasi Kegiatan</h4>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <Calendar className="w-5 h-5 text-purple-600" />
                          <span>{formatDateRange(selectedActivity.date, selectedActivity.endDate)}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <MapPin className="w-5 h-5 text-red-600" />
                          <span>{selectedActivity.location}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Users className="w-5 h-5 text-blue-600" />
                          <span>
                            {selectedActivity.participants} peserta
                            {selectedActivity.maxParticipants && ` dari ${selectedActivity.maxParticipants}`}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Users className="w-5 h-5 text-green-600" />
                          <span>Penyelenggara: {selectedActivity.organizer}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-semibold text-gray-900">Statistik</h4>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <Eye className="w-5 h-5 text-gray-600" />
                          <span>{selectedActivity.views} kali dilihat</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Heart className="w-5 h-5 text-red-600" />
                          <span>{selectedActivity.likes} suka</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <ImageIcon className="w-5 h-5 text-purple-600" />
                          <span>{selectedActivity.images.length} foto</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {selectedActivity.tags.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Tag Kegiatan</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedActivity.tags.map((tag) => (
                          <Badge key={tag} variant="outline">
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-4 pt-6 border-t">
                    <Button 
                      onClick={() => handleCopyToWhatsApp(selectedActivity)}
                      className="flex-1 text-[#25D366] border-[#25D366] hover:bg-[#25D366]/10"
                      variant="outline"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Salin untuk WhatsApp
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <Share2 className="w-4 h-4 mr-2" />
                      Bagikan
                    </Button>
                    <div className="text-sm text-gray-500">
                      Kontak: {selectedActivity.contact}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-purple-700 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ingin Ikut Berpartisipasi?
            </h2>
            <p className="text-xl text-purple-100 mb-8">
              Bergabunglah dalam berbagai kegiatan menarik dan bermanfaat 
              untuk mengembangkan potensi diri Anda.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href={`/yayasan/${slug}/ppdb`}>
                <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100">
                  <Users className="w-5 h-5 mr-2" />
                  Daftar Sekarang
                </Button>
              </Link>
              <Link href={`/yayasan/${slug}/about`}>
                <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10">
                  <BookOpen className="w-5 h-5 mr-2" />
                  Tentang Kami
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}