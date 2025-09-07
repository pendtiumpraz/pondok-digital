'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { 
  Users, 
  Search,
  Filter,
  ArrowLeft,
  User,
  MapPin,
  GraduationCap,
  Award,
  Calendar,
  BookOpen,
  Mail,
  Phone,
  Building2,
  Star,
  UserCheck,
  Loader2,
  AlertCircle
} from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'

interface Teacher {
  id: string
  name: string
  title?: string
  gender: string
  position: string
  institution: string
  specialization?: string
  education?: string
  university?: string
  experience?: number
  photo?: string
  bio?: string
  phone?: string
  email?: string
  isUstadz: boolean
  status: string
  subjects: string[]
  certifications: string[]
  achievements: string[]
}

interface TeachersResponse {
  teachers: Teacher[]
  pagination: {
    currentPage: number
    totalPages: number
    totalItems: number
    itemsPerPage: number
  }
}

export default function PengajarPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [institutionFilter, setInstitutionFilter] = useState('all')
  const [activeTab, setActiveTab] = useState('all')

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  const stagger = {
    visible: {
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
    hover: { 
      scale: 1.02, 
      transition: { type: "spring" as const, stiffness: 300, damping: 20 } 
    }
  }

  // Fetch teachers data
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        setLoading(true)
        const queryParams = new URLSearchParams({
          limit: '50', // Get more teachers for better display
          status: 'ACTIVE'
        })
        
        const response = await fetch(`/api/teachers?${queryParams}`)
        if (!response.ok) {
          throw new Error('Failed to fetch teachers')
        }
        
        const data: TeachersResponse = await response.json()
        setTeachers(data.teachers)
        setError(null)
      } catch (error) {
        console.error('Error fetching teachers:', error)
        setError('Gagal memuat data pengajar. Silakan coba lagi.')
      } finally {
        setLoading(false)
      }
    }

    fetchTeachers()
  }, [])

  // Filter teachers based on search, institution, and gender
  const filteredTeachers = useMemo(() => {
    return teachers.filter(teacher => {
      const matchesSearch = !searchQuery || 
        teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        teacher.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (teacher.specialization && teacher.specialization.toLowerCase().includes(searchQuery.toLowerCase()))

      const matchesInstitution = institutionFilter === 'all' || 
        teacher.institution === institutionFilter ||
        teacher.institution === 'ALL'

      const matchesGender = activeTab === 'all' ||
        (activeTab === 'ustadz' && teacher.isUstadz) ||
        (activeTab === 'ustadzah' && !teacher.isUstadz)

      return matchesSearch && matchesInstitution && matchesGender
    })
  }, [teachers, searchQuery, institutionFilter, activeTab])

  // Get default avatar based on gender
  const getDefaultAvatar = (isUstadz: boolean) => {
    return isUstadz 
      ? '/api/placeholder/200/200?text=Ustadz' 
      : '/api/placeholder/200/200?text=Ustadzah'
  }

  // Get institution badge color
  const getInstitutionColor = (institution: string) => {
    switch (institution) {
      case 'TK': return 'bg-pink-100 text-pink-800 border-pink-300'
      case 'SD': return 'bg-blue-100 text-blue-800 border-blue-300'
      case 'PONDOK': return 'bg-green-100 text-green-800 border-green-300'
      case 'ALL': return 'bg-purple-100 text-purple-800 border-purple-300'
      default: return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  // Teacher card component
  const TeacherCard = ({ teacher }: { teacher: Teacher }) => (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      className="h-full"
    >
      <Card className="h-full hover:shadow-xl transition-shadow border-0 shadow-md bg-white/80 backdrop-blur-sm overflow-hidden">
        <CardHeader className="pb-4 relative">
          <div className="flex flex-col items-center text-center">
            {/* Photo */}
            <div className="relative w-24 h-24 mb-4">
              <div className="w-full h-full rounded-full overflow-hidden border-4 border-white shadow-lg">
                {teacher.photo ? (
                  <Image
                    src={teacher.photo}
                    alt={teacher.name}
                    fill
                    className="object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = getDefaultAvatar(teacher.isUstadz)
                    }}
                  />
                ) : (
                  <div className={`w-full h-full flex items-center justify-center ${teacher.isUstadz ? 'bg-blue-100' : 'bg-pink-100'}`}>
                    <User className={`w-12 h-12 ${teacher.isUstadz ? 'text-blue-600' : 'text-pink-600'}`} />
                  </div>
                )}
              </div>
            </div>

            {/* Name and Title */}
            <div className="space-y-2">
              <h3 className="font-bold text-lg text-gray-800 leading-tight">
                {teacher.name}
                {teacher.title && (
                  <span className="text-sm font-normal text-gray-600 block">
                    {teacher.title}
                  </span>
                )}
              </h3>
              
              {/* Institution Badge */}
              <Badge className={`${getInstitutionColor(teacher.institution)} border text-xs font-medium`}>
                {teacher.institution}
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0 space-y-4">
          {/* Position */}
          <div className="flex items-center gap-2 text-sm">
            <UserCheck className="w-4 h-4 text-gray-500 flex-shrink-0" />
            <span className="font-medium text-gray-700">{teacher.position}</span>
          </div>

          {/* Specialization */}
          {teacher.specialization && (
            <div className="flex items-center gap-2 text-sm">
              <Star className="w-4 h-4 text-yellow-500 flex-shrink-0" />
              <span className="text-gray-600">{teacher.specialization}</span>
            </div>
          )}

          {/* Education */}
          {teacher.education && (
            <div className="flex items-start gap-2 text-sm">
              <GraduationCap className="w-4 h-4 text-gray-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <span className="text-gray-600">{teacher.education}</span>
                {teacher.university && (
                  <div className="text-xs text-gray-500 mt-1">{teacher.university}</div>
                )}
              </div>
            </div>
          )}

          {/* Experience */}
          {teacher.experience && teacher.experience > 0 && (
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4 text-gray-500 flex-shrink-0" />
              <span className="text-gray-600">{teacher.experience} tahun pengalaman</span>
            </div>
          )}

          {/* Subjects */}
          {teacher.subjects && teacher.subjects.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <BookOpen className="w-4 h-4 text-gray-500 flex-shrink-0" />
                <span className="font-medium text-gray-700">Mata Pelajaran:</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {teacher.subjects.slice(0, 3).map((subject, index) => (
                  <Badge key={index} variant="outline" className="text-xs bg-gray-50">
                    {subject}
                  </Badge>
                ))}
                {teacher.subjects.length > 3 && (
                  <Badge variant="outline" className="text-xs bg-gray-50">
                    +{teacher.subjects.length - 3} lainnya
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* Bio */}
          {teacher.bio && (
            <div className="pt-2 border-t border-gray-100">
              <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">
                {teacher.bio}
              </p>
            </div>
          )}

          {/* Contact Info */}
          <div className="pt-2 border-t border-gray-100 space-y-2">
            {teacher.phone && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <span>{teacher.phone}</span>
              </div>
            )}
            {teacher.email && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">{teacher.email}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )

  const ustadzCount = teachers.filter(t => t.isUstadz).length
  const ustadzahCount = teachers.filter(t => !t.isUstadz).length

  return (
    <>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-green-600 via-emerald-600 to-teal-700 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-0 opacity-50" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />
        
        <div className="relative container mx-auto px-4">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="text-center"
          >
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 bg-white/20 px-6 py-3 rounded-full mb-8 backdrop-blur-sm">
              <Users className="w-5 h-5" />
              <span className="text-sm font-medium">
                {teachers.length} Pengajar Berpengalaman
              </span>
            </motion.div>
            
            <motion.h1 variants={fadeInUp} className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text">
              Para Pengajar
            </motion.h1>
            
            <motion.p variants={fadeInUp} className="text-xl md:text-2xl text-green-100 max-w-4xl mx-auto mb-8 leading-relaxed">
              Tenaga pendidik profesional dan berpengalaman yang mendedikasikan diri untuk mendidik generasi Qur'ani yang berakhlak mulia
            </motion.p>

            <motion.div variants={fadeInUp} className="flex flex-wrap justify-center gap-4 text-sm">
              <div className="bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm">
                <span className="font-semibold">{ustadzCount}</span> Ustadz
              </div>
              <div className="bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm">
                <span className="font-semibold">{ustadzahCount}</span> Ustadzah
              </div>
              <div className="bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm">
                <span className="font-semibold">{teachers.filter(t => t.institution === 'TK').length}</span> Pengajar TK
              </div>
              <div className="bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm">
                <span className="font-semibold">{teachers.filter(t => t.institution === 'SD').length}</span> Pengajar SD
              </div>
              <div className="bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm">
                <span className="font-semibold">{teachers.filter(t => t.institution === 'PONDOK').length}</span> Pengajar Pondok
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {/* Search and Filter Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      type="text"
                      placeholder="Cari nama pengajar, posisi, atau spesialisasi..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 py-3 border-gray-200 focus:border-green-500 focus:ring-green-500"
                    />
                  </div>

                  {/* Institution Filter */}
                  <div className="relative">
                    <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
                    <select
                      value={institutionFilter}
                      onChange={(e) => setInstitutionFilter(e.target.value)}
                      className="w-full pl-10 py-3 border border-gray-200 rounded-lg focus:border-green-500 focus:ring-green-500 bg-white appearance-none"
                    >
                      <option value="all">Semua Institusi</option>
                      <option value="TK">TK Islam</option>
                      <option value="SD">SD Islam</option>
                      <option value="PONDOK">Pondok Pesantren</option>
                      <option value="ALL">Semua Unit</option>
                    </select>
                  </div>
                </div>

                {/* Gender Tabs */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-3 bg-gray-100">
                    <TabsTrigger value="all" className="data-[state=active]:bg-white data-[state=active]:text-gray-900">
                      Semua ({filteredTeachers.length})
                    </TabsTrigger>
                    <TabsTrigger value="ustadz" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                      Ustadz ({teachers.filter(t => t.isUstadz).length})
                    </TabsTrigger>
                    <TabsTrigger value="ustadzah" className="data-[state=active]:bg-pink-500 data-[state=active]:text-white">
                      Ustadzah ({teachers.filter(t => !t.isUstadz).length})
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </CardContent>
            </Card>
          </motion.div>

          {/* Teachers Grid */}
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-20"
              >
                <Loader2 className="w-12 h-12 animate-spin text-green-600 mb-4" />
                <p className="text-lg text-gray-600">Memuat data pengajar...</p>
              </motion.div>
            ) : error ? (
              <motion.div
                key="error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-20"
              >
                <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
                <p className="text-lg text-red-600 mb-4">{error}</p>
                <Button
                  onClick={() => window.location.reload()}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Coba Lagi
                </Button>
              </motion.div>
            ) : filteredTeachers.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-20"
              >
                <Users className="w-16 h-16 text-gray-400 mb-4" />
                <p className="text-lg text-gray-600 mb-2">Tidak ada pengajar ditemukan</p>
                <p className="text-sm text-gray-500">Coba ubah kriteria pencarian Anda</p>
              </motion.div>
            ) : (
              <motion.div
                key="teachers"
                initial="hidden"
                animate="visible"
                variants={stagger}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                {filteredTeachers.map((teacher) => (
                  <TeacherCard key={teacher.id} teacher={teacher} />
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Results Summary */}
          {!loading && !error && filteredTeachers.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-12 text-center"
            >
              <Card className="inline-block bg-white/80 backdrop-blur-sm border-0 shadow-md">
                <CardContent className="p-4">
                  <p className="text-gray-600">
                    Menampilkan <span className="font-semibold text-green-600">{filteredTeachers.length}</span> dari{' '}
                    <span className="font-semibold">{teachers.length}</span> pengajar
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </section>
    </>
  )
}