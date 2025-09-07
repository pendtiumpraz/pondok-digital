'use client'

import { motion } from 'framer-motion'
import { 
  BookOpen, Users, DollarSign, FileText, Heart, BarChart3,
  Calendar, School, Shield, Globe, Smartphone, Cloud,
  CheckCircle, ArrowRight, Zap, Lock, RefreshCw, HeartHandshake,
  GraduationCap, Building, UserCheck, CreditCard, PieChart, Bell
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function FeaturesPage() {
  const features = [
    {
      category: 'Akademik',
      icon: GraduationCap,
      color: 'from-blue-500 to-indigo-600',
      items: [
        {
          title: 'Manajemen Kurikulum',
          description: 'Kelola kurikulum diniyah dan formal dengan mudah',
          icon: BookOpen
        },
        {
          title: 'Jadwal Pelajaran',
          description: 'Atur jadwal otomatis untuk semua tingkatan',
          icon: Calendar
        },
        {
          title: 'Penilaian Digital',
          description: 'Input nilai dan generate rapor otomatis',
          icon: FileText
        },
        {
          title: 'E-Learning',
          description: 'Platform pembelajaran online terintegrasi',
          icon: School
        }
      ]
    },
    {
      category: 'Keuangan',
      icon: DollarSign,
      color: 'from-green-500 to-emerald-600',
      items: [
        {
          title: 'Pembukuan Otomatis',
          description: 'Pencatatan keuangan real-time dan akurat',
          icon: PieChart
        },
        {
          title: 'Payment Gateway',
          description: 'Terima pembayaran SPP online',
          icon: CreditCard
        },
        {
          title: 'Laporan Keuangan',
          description: 'Dashboard keuangan transparan',
          icon: BarChart3
        },
        {
          title: 'Manajemen Donasi',
          description: 'Kelola donasi dan wakaf digital',
          icon: HeartHandshake
        }
      ]
    },
    {
      category: 'Santri & Wali',
      icon: Users,
      color: 'from-purple-500 to-pink-600',
      items: [
        {
          title: 'Database Santri',
          description: 'Profil lengkap santri dan riwayat pendidikan',
          icon: UserCheck
        },
        {
          title: 'Absensi Digital',
          description: 'Presensi dengan QR code atau biometrik',
          icon: Shield
        },
        {
          title: 'Portal Wali Santri',
          description: 'Akses informasi santri untuk orang tua',
          icon: Smartphone
        },
        {
          title: 'Notifikasi Real-time',
          description: 'Update instant ke wali santri',
          icon: Bell
        }
      ]
    },
    {
      category: 'Manajemen Yayasan',
      icon: Building,
      color: 'from-orange-500 to-red-600',
      items: [
        {
          title: 'Multi-Lembaga',
          description: 'Kelola TK, SD, SMP, SMA dalam satu sistem',
          icon: Building
        },
        {
          title: 'Manajemen SDM',
          description: 'Database guru, ustadz, dan karyawan',
          icon: Users
        },
        {
          title: 'Inventaris & Aset',
          description: 'Tracking aset dan inventaris yayasan',
          icon: FileText
        },
        {
          title: 'Dokumen Digital',
          description: 'Arsip digital dengan backup otomatis',
          icon: Cloud
        }
      ]
    }
  ]

  const benefits = [
    {
      icon: Zap,
      title: 'Hemat Waktu',
      description: 'Otomasi tugas administratif hingga 80%'
    },
    {
      icon: Shield,
      title: 'Keamanan Data',
      description: 'Enkripsi tingkat bank untuk semua data'
    },
    {
      icon: RefreshCw,
      title: 'Update Otomatis',
      description: 'Fitur baru setiap bulan tanpa biaya tambahan'
    },
    {
      icon: Globe,
      title: 'Akses Dimana Saja',
      description: 'Cloud-based, akses dari perangkat apapun'
    },
    {
      icon: HeartHandshake,
      title: 'Support 24/7',
      description: 'Tim support siap membantu kapan saja'
    },
    {
      icon: Lock,
      title: 'Backup Otomatis',
      description: 'Data aman dengan backup harian'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-blue-50 opacity-50" />
        <div className="container mx-auto relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Fitur Lengkap untuk
              <span className="text-green-600"> Pesantren Modern</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Platform all-in-one yang mengintegrasikan semua aspek manajemen pesantren, 
              dari akademik hingga keuangan, dalam satu sistem yang mudah digunakan
            </p>
            <div className="flex gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/yayasan/imam-syafii">
                  Lihat Demo
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/pricing">
                  Lihat Harga
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="space-y-20">
            {features.map((category, categoryIndex) => (
              <motion.div
                key={category.category}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: categoryIndex * 0.1 }}
              >
                <div className="flex items-center gap-4 mb-8">
                  <div className={`p-3 rounded-lg bg-gradient-to-br ${category.color} text-white`}>
                    <category.icon className="h-8 w-8" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900">{category.category}</h2>
                </div>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {category.items.map((item, index) => (
                    <motion.div
                      key={item.title}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-gray-100 rounded-lg">
                          <item.icon className="h-6 w-6 text-gray-700" />
                        </div>
                        <h3 className="font-semibold text-gray-900">{item.title}</h3>
                      </div>
                      <p className="text-gray-600 text-sm">{item.description}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Keuntungan Menggunakan Pondok Digital
            </h2>
            <p className="text-xl text-gray-600">
              Lebih dari sekedar software, kami adalah partner transformasi digital Anda
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 text-green-600 rounded-full mb-4">
                  <benefit.icon className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-green-600 to-blue-600">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Siap Transformasi Digital?
            </h2>
            <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
              Bergabung dengan ratusan pesantren yang telah meningkatkan efisiensi 
              operasional hingga 80% dengan Pondok Digital
            </p>
            <div className="flex gap-4 justify-center">
              <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100">
                <Link href="/auth/register-yayasan">
                  Mulai Gratis Sekarang
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10">
                <Link href="/contact">
                  Konsultasi Gratis
                </Link>
              </Button>
            </div>
            <p className="text-sm text-green-100 mt-4">
              Tidak perlu kartu kredit • Setup instan • Cancel kapan saja
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  )
}