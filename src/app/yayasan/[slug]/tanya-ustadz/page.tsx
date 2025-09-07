'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { 
  MessageSquare,
  Send,
  User,
  Mail,
  Phone,
  Clock,
  CheckCircle,
  AlertCircle,
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  Star,
  Heart,
  BookOpen,
  Users,
  Calendar,
  Eye,
  ArrowLeft,
  MessageCircle,
  HelpCircle,
  Sparkles
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

interface Question {
  id: string
  name: string
  email: string
  question: string
  category: string
  date: string
  answer?: string
  ustadz?: string
  answerDate?: string
  status: 'pending' | 'answered'
  isPublic: boolean
  likes: number
}

interface Ustadz {
  id: string
  name: string
  expertise: string[]
  photo: string
  bio: string
  totalAnswers: number
  rating: number
}

export default function TanyaUstadzPage() {
  const params = useParams()
  const slug = params.slug as string

  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    category: '',
    question: '',
    isPublic: true
  })

  const categories = [
    { value: 'all', label: 'Semua Kategori', color: 'bg-gray-100 text-gray-800' },
    { value: 'akidah', label: 'Akidah', color: 'bg-blue-100 text-blue-800' },
    { value: 'fiqih', label: 'Fiqih', color: 'bg-green-100 text-green-800' },
    { value: 'ibadah', label: 'Ibadah', color: 'bg-purple-100 text-purple-800' },
    { value: 'muamalah', label: 'Muamalah', color: 'bg-orange-100 text-orange-800' },
    { value: 'akhlak', label: 'Akhlak', color: 'bg-pink-100 text-pink-800' },
    { value: 'keluarga', label: 'Keluarga', color: 'bg-indigo-100 text-indigo-800' },
    { value: 'lainnya', label: 'Lainnya', color: 'bg-yellow-100 text-yellow-800' }
  ]

  const ustadzList: Ustadz[] = [
    {
      id: '1',
      name: 'Ustadz Ahmad Zainuddin, S.Pd.I',
      expertise: ['Fiqih', 'Akidah', 'Hadits'],
      photo: '/api/placeholder/80/80',
      bio: 'Lulusan Universitas Al-Azhar dengan pengalaman 15 tahun dalam bidang pendidikan Islam',
      totalAnswers: 245,
      rating: 4.9
    },
    {
      id: '2',
      name: 'Ustadzah Fatimah Azzahra, M.A',
      expertise: ['Akhlak', 'Keluarga', 'Pendidikan Anak'],
      photo: '/api/placeholder/80/80',
      bio: 'Spesialis konsultasi keluarga dan pendidikan anak dalam perspektif Islam',
      totalAnswers: 189,
      rating: 4.8
    },
    {
      id: '3',
      name: 'Ustadz Muhammad Hasan, Lc',
      expertise: ['Muamalah', 'Ekonomi Islam'],
      photo: '/api/placeholder/80/80',
      bio: 'Ahli dalam bidang ekonomi Islam dan transaksi keuangan syariah',
      totalAnswers: 156,
      rating: 4.7
    }
  ]

  const questions: Question[] = [
    {
      id: '1',
      name: 'Ahmad Rizki',
      email: 'ahmad@email.com',
      question: 'Bagaimana hukum berbisnis online di era digital ini? Apakah ada panduan khusus dalam Islam?',
      category: 'muamalah',
      date: '2024-01-15',
      answer: 'Berbisnis online dalam Islam pada dasarnya diperbolehkan selama memenuhi syarat-syarat: 1) Barang/jasa yang diperjualbelikan halal, 2) Tidak ada unsur penipuan, 3) Akad jual beli jelas, 4) Tidak mengandung riba atau gharar yang berlebihan. Pastikan untuk selalu jujur dalam promosi dan kualitas produk.',
      ustadz: 'Ustadz Muhammad Hasan, Lc',
      answerDate: '2024-01-16',
      status: 'answered',
      isPublic: true,
      likes: 15
    },
    {
      id: '2',
      name: 'Siti Aminah',
      email: 'siti@email.com',
      question: 'Bagaimana cara mendidik anak agar rajin sholat dan mengaji?',
      category: 'keluarga',
      date: '2024-01-14',
      answer: 'Beberapa tips mendidik anak rajin beribadah: 1) Berikan teladan yang baik, 2) Mulai dengan pembiasaan sejak dini, 3) Buat suasana ibadah menyenangkan, 4) Berikan pujian ketika anak melakukan kebaikan, 5) Sabar dan konsisten dalam mendidik, 6) Libatkan anak dalam aktivitas keagamaan keluarga.',
      ustadz: 'Ustadzah Fatimah Azzahra, M.A',
      answerDate: '2024-01-15',
      status: 'answered',
      isPublic: true,
      likes: 28
    },
    {
      id: '3',
      name: 'Budi Santoso',
      email: 'budi@email.com',
      question: 'Apakah boleh sholat dengan menggunakan aplikasi kompas qiblat di smartphone?',
      category: 'ibadah',
      date: '2024-01-13',
      status: 'pending',
      isPublic: true,
      likes: 0
    },
    {
      id: '4',
      name: 'Fatimah Zahra',
      email: 'fatimah@email.com',
      question: 'Bagaimana cara bertaubat yang benar menurut Islam?',
      category: 'akhlak',
      date: '2024-01-12',
      answer: 'Taubat yang benar memiliki 4 syarat: 1) Menyesal atas dosa yang telah dilakukan, 2) Istighfar (meminta ampun kepada Allah), 3) Azam (tekad) untuk tidak mengulangi dosa tersebut, 4) Jika berkaitan dengan hak manusia, harus meminta maaf dan mengembalikan haknya. Taubat sebaiknya dilakukan segera dan dengan penuh keikhlasan.',
      ustadz: 'Ustadz Ahmad Zainuddin, S.Pd.I',
      answerDate: '2024-01-13',
      status: 'answered',
      isPublic: true,
      likes: 35
    }
  ]

  const filteredQuestions = questions.filter(question => {
    const matchesCategory = selectedCategory === 'all' || question.category === selectedCategory
    const matchesSearch = question.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         question.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch && question.isPublic
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log('Form submitted:', formData)
    alert('Pertanyaan berhasil dikirim! Kami akan segera memberikan jawaban.')
    setFormData({
      name: '',
      email: '',
      phone: '',
      category: '',
      question: '',
      isPublic: true
    })
    setShowForm(false)
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Tanya Ustadz</h1>
            <p className="text-green-100 text-xl">Konsultasi Keagamaan dan Bimbingan Islami</p>
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
            className="text-center mb-12"
          >
            <motion.div variants={fadeInUp}>
              <Badge className="mb-4 bg-green-100 text-green-800 text-base px-4 py-2">
                <MessageCircle className="w-4 h-4 mr-2" />
                Konsultasi Gratis
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Ada Pertanyaan Seputar Islam?
              </h2>
              <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-8">
                Dapatkan jawaban dari ustadz dan ustadzah berpengalaman mengenai berbagai 
                aspek kehidupan Islami. Konsultasi gratis dan terpercaya untuk membantu 
                memperdalam pemahaman agama Anda.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Button 
                  onClick={() => setShowForm(true)}
                  className="bg-green-600 hover:bg-green-700 text-lg px-8 py-3"
                >
                  <MessageSquare className="w-5 h-5 mr-2" />
                  Ajukan Pertanyaan
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => document.getElementById('faq-section')?.scrollIntoView({ behavior: 'smooth' })}
                  className="text-lg px-8 py-3"
                >
                  <HelpCircle className="w-5 h-5 mr-2" />
                  Lihat Q&A
                </Button>
              </div>
            </motion.div>
          </motion.div>

          {/* Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <MessageSquare className="w-8 h-8 text-green-600 mx-auto mb-3" />
                <div className="text-3xl font-bold text-gray-900 mb-1">500+</div>
                <p className="text-gray-600 text-sm">Pertanyaan Terjawab</p>
              </CardContent>
            </Card>
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <Users className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                <div className="text-3xl font-bold text-gray-900 mb-1">{ustadzList.length}</div>
                <p className="text-gray-600 text-sm">Ustadz & Ustadzah</p>
              </CardContent>
            </Card>
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <Clock className="w-8 h-8 text-orange-600 mx-auto mb-3" />
                <div className="text-3xl font-bold text-gray-900 mb-1">24</div>
                <p className="text-gray-600 text-sm">Jam Respons</p>
              </CardContent>
            </Card>
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <Star className="w-8 h-8 text-yellow-600 mx-auto mb-3" />
                <div className="text-3xl font-bold text-gray-900 mb-1">4.8</div>
                <p className="text-gray-600 text-sm">Rating Kepuasan</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Ustadz Team */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Tim Ustadz & Ustadzah</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {ustadzList.map((ustadz, index) => (
              <motion.div
                key={ustadz.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="hover:shadow-xl transition-all">
                  <CardContent className="p-6 text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <User className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="font-bold text-lg mb-2">{ustadz.name}</h3>
                    <p className="text-gray-600 text-sm mb-4">{ustadz.bio}</p>
                    <div className="flex flex-wrap gap-1 justify-center mb-4">
                      {ustadz.expertise.map((skill) => (
                        <Badge key={skill} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center justify-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <MessageSquare className="w-4 h-4" />
                        <span>{ustadz.totalAnswers}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span>{ustadz.rating}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Q&A Section */}
      <section id="faq-section" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Pertanyaan & Jawaban</h2>
          
          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Cari pertanyaan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
              {categories.map((cat) => (
                <Button
                  key={cat.value}
                  variant={selectedCategory === cat.value ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(cat.value)}
                  className="whitespace-nowrap"
                >
                  {cat.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Questions List */}
          <div className="space-y-6">
            {filteredQuestions.map((question) => (
              <motion.div
                key={question.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <User className="w-4 h-4 text-gray-500" />
                          <span className="font-medium">{question.name}</span>
                          <Badge className={categories.find(c => c.value === question.category)?.color || 'bg-gray-100 text-gray-800'}>
                            {categories.find(c => c.value === question.category)?.label || question.category}
                          </Badge>
                          <Badge variant={question.status === 'answered' ? 'default' : 'secondary'}>
                            {question.status === 'answered' ? 'Terjawab' : 'Pending'}
                          </Badge>
                        </div>
                        <p className="text-gray-800 mb-3">{question.question}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(question.date).toLocaleDateString('id-ID')}</span>
                          </div>
                          {question.likes > 0 && (
                            <div className="flex items-center gap-1">
                              <Heart className="w-4 h-4 text-red-500" />
                              <span>{question.likes}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      {question.status === 'answered' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setExpandedQuestion(
                            expandedQuestion === question.id ? null : question.id
                          )}
                        >
                          {expandedQuestion === question.id ? 
                            <ChevronUp className="w-4 h-4" /> : 
                            <ChevronDown className="w-4 h-4" />
                          }
                        </Button>
                      )}
                    </div>

                    <AnimatePresence>
                      {expandedQuestion === question.id && question.answer && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="border-t pt-4 mt-4"
                        >
                          <div className="bg-green-50 p-4 rounded-lg">
                            <div className="flex items-center gap-2 mb-3">
                              <CheckCircle className="w-5 h-5 text-green-600" />
                              <span className="font-medium text-green-800">Jawaban dari {question.ustadz}</span>
                              <Badge variant="outline" className="text-xs">
                                {question.answerDate && new Date(question.answerDate).toLocaleDateString('id-ID')}
                              </Badge>
                            </div>
                            <p className="text-gray-700 leading-relaxed">{question.answer}</p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {filteredQuestions.length === 0 && (
            <div className="text-center py-12">
              <HelpCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Tidak ada pertanyaan yang sesuai dengan pencarian Anda.</p>
            </div>
          )}
        </div>
      </section>

      {/* Question Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowForm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Ajukan Pertanyaan</h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowForm(false)}
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </Button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Nama Lengkap *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        required
                        placeholder="Masukkan nama lengkap"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        required
                        placeholder="nama@email.com"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone">No. WhatsApp</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="081234567890"
                      />
                    </div>
                    <div>
                      <Label htmlFor="category">Kategori *</Label>
                      <select
                        id="category"
                        value={formData.category}
                        onChange={(e) => handleInputChange('category', e.target.value)}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      >
                        <option value="">Pilih kategori</option>
                        {categories.slice(1).map((cat) => (
                          <option key={cat.value} value={cat.value}>
                            {cat.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="question">Pertanyaan *</Label>
                    <Textarea
                      id="question"
                      value={formData.question}
                      onChange={(e) => handleInputChange('question', e.target.value)}
                      required
                      placeholder="Tulis pertanyaan Anda dengan jelas dan detail..."
                      rows={6}
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="isPublic"
                      checked={formData.isPublic}
                      onChange={(e) => handleInputChange('isPublic', e.target.checked)}
                      className="rounded"
                    />
                    <Label htmlFor="isPublic" className="text-sm">
                      Izinkan pertanyaan dan jawaban ini dipublikasikan untuk membantu orang lain
                    </Label>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div className="text-sm text-blue-800">
                        <p className="font-medium mb-1">Ketentuan:</p>
                        <ul className="space-y-1 text-xs">
                          <li>• Pertanyaan akan dijawab dalam 24-48 jam</li>
                          <li>• Jawaban akan dikirim via email</li>
                          <li>• Pertanyaan yang bersifat pribadi akan dijawab secara pribadi</li>
                          <li>• Harap menggunakan bahasa yang sopan dan jelas</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button
                      type="submit"
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Kirim Pertanyaan
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowForm(false)}
                    >
                      Batal
                    </Button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-green-700 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Sparkles className="w-16 h-16 mx-auto mb-6 text-green-200" />
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Masih Ada Pertanyaan?
            </h2>
            <p className="text-xl text-green-100 mb-8">
              Jangan ragu untuk bertanya. Tim ustadz kami siap membantu menjawab 
              pertanyaan seputar agama Islam dengan penuh kasih sayang.
            </p>
            <Button
              onClick={() => setShowForm(true)}
              size="lg"
              className="bg-white text-green-600 hover:bg-gray-100"
            >
              <MessageSquare className="w-5 h-5 mr-2" />
              Ajukan Pertanyaan Sekarang
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  )
}