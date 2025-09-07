'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Users, 
  GraduationCap, 
  BookOpen, 
  Heart,
  Calendar,
  MapPin,
  Phone,
  Mail,
  ChevronRight,
  Star,
  Award,
  Building
} from 'lucide-react'

export default function YayasanPublicPage() {
  const params = useParams()
  const slug = params.slug as string
  
  const tenantName = slug === 'imam-syafii' 
    ? 'Pondok Pesantren Imam Syafii Blitar'
    : slug

  // Stats data
  const stats = [
    { label: 'Santri Aktif', value: '250+', icon: Users },
    { label: 'Tenaga Pengajar', value: '35', icon: GraduationCap },
    { label: 'Program Unggulan', value: '12', icon: Award },
    { label: 'Alumni Sukses', value: '1000+', icon: Star }
  ]

  // Programs
  const programs = [
    {
      title: 'TK Islam',
      description: 'Pendidikan usia dini dengan kurikulum Islam terpadu',
      icon: Building,
      color: 'bg-blue-500'
    },
    {
      title: 'SD Islam', 
      description: 'Sekolah dasar dengan program tahfidz dan akademik unggul',
      icon: BookOpen,
      color: 'bg-green-500'
    },
    {
      title: 'Pondok Pesantren',
      description: 'Program boarding school dengan fokus tahfidz 30 juz',
      icon: BookOpen,
      color: 'bg-purple-500'
    },
    {
      title: 'Program Tahfidz',
      description: 'Target hafalan 30 juz dengan metode mutqin',
      icon: BookOpen,
      color: 'bg-orange-500'
    }
  ]

  // Activities/Events
  const activities = [
    {
      title: 'Wisuda Hafidz Quran',
      date: '15 Desember 2024',
      image: '/api/placeholder/400/300'
    },
    {
      title: 'Lomba Tahfidz Nasional',
      date: '20 November 2024',
      image: '/api/placeholder/400/300'
    },
    {
      title: 'Khataman Akbar',
      date: '10 Oktober 2024',
      image: '/api/placeholder/400/300'
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-green-600 to-green-800 text-white py-20">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              {tenantName}
            </h1>
            <p className="text-xl mb-8">
              Membentuk Generasi Qurani, Berakhlak Mulia, dan Berprestasi
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild>
                <Link href={`/yayasan/${slug}/ppdb`}>
                  Pendaftaran Santri Baru
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="bg-white/10 text-white border-white hover:bg-white hover:text-green-700" asChild>
                <Link href={`/yayasan/${slug}/about`}>
                  Tentang Kami
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center">
                <CardContent className="pt-6">
                  <stat.icon className="w-12 h-12 mx-auto mb-4 text-green-600" />
                  <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-sm text-gray-600 mt-1">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Program Pendidikan</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Kami menyediakan program pendidikan berkualitas dari tingkat TK hingga Pondok Pesantren
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {programs.map((program, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className={`w-16 h-16 ${program.color} rounded-lg flex items-center justify-center mb-4`}>
                    <program.icon className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-xl">{program.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm">{program.description}</p>
                  <Link 
                    href={`/yayasan/${slug}/about`} 
                    className="inline-flex items-center text-green-600 hover:text-green-700 mt-4 text-sm font-medium"
                  >
                    Pelajari Lebih Lanjut
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Activities Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Kegiatan Terkini</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Ikuti berbagai kegiatan dan prestasi santri kami
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {activities.map((activity, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-48 bg-gray-200 relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <div className="flex items-center gap-2 text-sm mb-2">
                      <Calendar className="w-4 h-4" />
                      {activity.date}
                    </div>
                  </div>
                </div>
                <CardContent className="pt-4">
                  <h3 className="font-semibold text-lg mb-2">{activity.title}</h3>
                  <Link 
                    href={`/yayasan/${slug}/kegiatan`}
                    className="text-green-600 hover:text-green-700 text-sm font-medium"
                  >
                    Baca Selengkapnya →
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-8">
            <Button variant="outline" asChild>
              <Link href={`/yayasan/${slug}/kegiatan`}>
                Lihat Semua Kegiatan
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-green-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Bergabunglah Bersama Kami</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Daftarkan putra-putri Anda untuk mendapatkan pendidikan Islam terbaik
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link href={`/yayasan/${slug}/ppdb`}>
                Daftar Sekarang
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="bg-transparent text-white border-white hover:bg-white hover:text-green-600" asChild>
              <Link href={`/yayasan/${slug}/donasi`}>
                <Heart className="w-5 h-5 mr-2" />
                Program Donasi
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl text-center">Hubungi Kami</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6 text-center">
                  <div>
                    <MapPin className="w-8 h-8 mx-auto mb-3 text-green-600" />
                    <h3 className="font-semibold mb-2">Alamat</h3>
                    <p className="text-sm text-gray-600">
                      Jl. Contoh No. 123<br />
                      Blitar, Jawa Timur
                    </p>
                  </div>
                  <div>
                    <Phone className="w-8 h-8 mx-auto mb-3 text-green-600" />
                    <h3 className="font-semibold mb-2">Telepon</h3>
                    <p className="text-sm text-gray-600">
                      (0342) 123456<br />
                      0812-3456-7890
                    </p>
                  </div>
                  <div>
                    <Mail className="w-8 h-8 mx-auto mb-3 text-green-600" />
                    <h3 className="font-semibold mb-2">Email</h3>
                    <p className="text-sm text-gray-600">
                      info@{slug}.sch.id<br />
                      ppdb@{slug}.sch.id
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}