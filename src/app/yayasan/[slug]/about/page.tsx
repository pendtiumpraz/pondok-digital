'use client'

import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  Building2,
  Users,
  GraduationCap,
  BookOpen,
  Home,
  Baby,
  School,
  Award,
  ArrowRight,
  Eye,
  Target,
  Heart,
  Calendar,
  MapPin,
  Phone,
  Mail
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export default function AboutPage() {
  const params = useParams()
  const slug = params.slug as string

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  }

  const staggerChildren = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const aboutSections = [
    {
      title: 'Profil Yayasan',
      description: 'Sejarah, visi misi, dan profil lengkap yayasan',
      icon: Building2,
      href: `/yayasan/${slug}/about/yayasan`,
      color: 'from-blue-500 to-blue-600',
      stats: 'Sejak 1985'
    },
    {
      title: 'Pondok Pesantren',
      description: 'Program pendidikan pesantren dan kehidupan santri',
      icon: Home,
      href: `/yayasan/${slug}/about/pondok`,
      color: 'from-green-500 to-green-600',
      stats: '350+ Santri'
    },
    {
      title: 'Struktur Organisasi',
      description: 'Pengurus yayasan dan struktur kepemimpinan',
      icon: Users,
      href: `/yayasan/${slug}/about/struktur`,
      color: 'from-purple-500 to-purple-600',
      stats: '25+ Pengurus'
    },
    {
      title: 'TK Islam',
      description: 'Program pendidikan anak usia dini dengan nilai Islam',
      icon: Baby,
      href: `/yayasan/${slug}/about/tk`,
      color: 'from-pink-500 to-pink-600',
      stats: '120+ Siswa'
    },
    {
      title: 'SD Islam',
      description: 'Pendidikan dasar dengan kurikulum terpadu',
      icon: School,
      href: `/yayasan/${slug}/about/sd`,
      color: 'from-indigo-500 to-indigo-600',
      stats: '200+ Siswa'
    },
    {
      title: 'Tenaga Pengajar',
      description: 'Profil ustadz, ustadzah, dan guru',
      icon: GraduationCap,
      href: `/yayasan/${slug}/about/pengajar`,
      color: 'from-orange-500 to-orange-600',
      stats: '40+ Pendidik'
    }
  ]

  const highlights = [
    { number: '39+', label: 'Tahun Pengabdian', icon: Calendar },
    { number: '700+', label: 'Total Siswa', icon: Users },
    { number: '5000+', label: 'Alumni', icon: Award },
    { number: 'A', label: 'Akreditasi', icon: BookOpen }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Tentang Kami</h1>
            <p className="text-blue-100 text-xl">Mengenal lebih dekat Yayasan Pendidikan Islam Imam Syafi'i</p>
          </div>
        </div>
      </div>

      {/* Hero Overview */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="initial"
            animate="animate"
            variants={staggerChildren}
            className="text-center mb-16"
          >
            <motion.div variants={fadeInUp}>
              <Badge className="mb-4 bg-blue-100 text-blue-800 text-base px-4 py-2">
                <Heart className="w-4 h-4 mr-2" />
                Membentuk Generasi Qurani
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Yayasan Pendidikan Islam
                <span className="block text-blue-600">Imam Syafi'i Blitar</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                Sebuah lembaga pendidikan Islam yang berkomitmen untuk membentuk generasi muslim 
                yang beriman, bertaqwa, berakhlak mulia, cerdas, dan bermanfaat bagi umat dan bangsa. 
                Dengan pengalaman lebih dari 39 tahun, kami telah membuktikan dedikasi dalam dunia pendidikan Islam.
              </p>
            </motion.div>
          </motion.div>

          {/* Highlights */}
          <motion.div
            initial="initial"
            animate="animate"
            variants={staggerChildren}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
          >
            {highlights.map((item, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="text-center"
              >
                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <item.icon className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                    <div className="text-3xl font-bold text-gray-900 mb-1">{item.number}</div>
                    <p className="text-gray-600 text-sm">{item.label}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* About Sections Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerChildren}
          >
            <motion.div variants={fadeInUp} className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Jelajahi Lebih Lanjut
              </h2>
              <p className="text-xl text-gray-600">
                Ketahui informasi lengkap tentang unit-unit pendidikan dan organisasi kami
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {aboutSections.map((section, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  className="group"
                >
                  <Link href={section.href}>
                    <Card className="h-full hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                      <CardContent className="p-0">
                        <div className={`bg-gradient-to-br ${section.color} p-8 text-white relative overflow-hidden`}>
                          <div className="absolute -right-4 -top-4 opacity-20">
                            <section.icon className="w-24 h-24" />
                          </div>
                          <div className="relative z-10">
                            <section.icon className="w-12 h-12 mb-4" />
                            <Badge className="mb-3 bg-white/20 text-white border-white/30">
                              {section.stats}
                            </Badge>
                            <h3 className="text-xl font-bold mb-2">{section.title}</h3>
                          </div>
                        </div>
                        <div className="p-6">
                          <p className="text-gray-600 mb-4">{section.description}</p>
                          <div className="flex items-center text-blue-600 font-semibold group-hover:text-blue-700">
                            <span>Pelajari lebih lanjut</span>
                            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Vision Mission Quick View */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerChildren}
          >
            <motion.h2 variants={fadeInUp} className="text-3xl font-bold text-center mb-12">
              Visi & Misi Yayasan
            </motion.h2>
            <div className="grid md:grid-cols-2 gap-8">
              <motion.div variants={fadeInUp}>
                <Card className="h-full border-blue-200 hover:shadow-lg transition-shadow">
                  <CardContent className="p-8">
                    <Eye className="w-12 h-12 text-blue-600 mb-4" />
                    <h3 className="text-2xl font-bold mb-4 text-blue-600">Visi</h3>
                    <p className="text-gray-600 leading-relaxed">
                      "Menjadi yayasan pendidikan Islam terkemuka yang melahirkan generasi Qurani, 
                      berakhlak mulia, cerdas, mandiri, dan bermanfaat bagi umat serta bangsa."
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
              <motion.div variants={fadeInUp}>
                <Card className="h-full border-green-200 hover:shadow-lg transition-shadow">
                  <CardContent className="p-8">
                    <Target className="w-12 h-12 text-green-600 mb-4" />
                    <h3 className="text-2xl font-bold mb-4 text-green-600">Misi Utama</h3>
                    <ul className="space-y-3 text-gray-600">
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span>Menyelenggarakan pendidikan Islam berkualitas</span>
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span>Membentuk karakter santri berakhlakul karimah</span>
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span>Mengembangkan kurikulum terpadu</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ingin Bergabung dengan Keluarga Besar Kami?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Temukan informasi lengkap tentang pendaftaran dan program-program unggulan kami
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href={`/yayasan/${slug}/ppdb`}>
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                  <School className="w-5 h-5 mr-2" />
                  Info PPDB
                </Button>
              </Link>
              <Link href={`/yayasan/${slug}/donasi`}>
                <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10">
                  <Heart className="w-5 h-5 mr-2" />
                  Donasi
                </Button>
              </Link>
              <Link href={`/yayasan/${slug}/kegiatan`}>
                <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10">
                  <Calendar className="w-5 h-5 mr-2" />
                  Lihat Kegiatan
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Quick Contact */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Hubungi Kami</h2>
            <p className="text-gray-600">Kami siap membantu Anda dengan informasi yang dibutuhkan</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <MapPin className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                <h3 className="font-bold mb-2">Alamat</h3>
                <p className="text-sm text-gray-600">
                  Jl. Imam Syafi'i No. 123<br />
                  Kota Blitar, Jawa Timur 66111
                </p>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <Phone className="w-8 h-8 text-green-600 mx-auto mb-3" />
                <h3 className="font-bold mb-2">Telepon</h3>
                <p className="text-sm text-gray-600">
                  (0342) 123456<br />
                  +62 812-3456-7890
                </p>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <Mail className="w-8 h-8 text-purple-600 mx-auto mb-3" />
                <h3 className="font-bold mb-2">Email</h3>
                <p className="text-sm text-gray-600">
                  yayasan@imamsyafii-blitar.sch.id<br />
                  info@imamsyafii-blitar.sch.id
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}