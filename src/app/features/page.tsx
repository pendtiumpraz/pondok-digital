'use client'

import { useLanguage } from '@/contexts/LanguageContext'
import { motion } from 'framer-motion'
import { 
  BookOpen, Users, DollarSign, FileText, Heart, BarChart3,
  Calendar, School, Shield, Globe, Smartphone, Cloud,
  CheckCircle, ArrowRight, Zap, Lock, RefreshCw, HeartHandshake,
  GraduationCap, Building, UserCheck, CreditCard, PieChart, Bell
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import SaasHeader from '@/components/layout/SaasHeader'
import SaasFooter from '@/components/layout/SaasFooter'
import Link from 'next/link'

export default function FeaturesPage() {
  const { language } = useLanguage()

  const translations = {
    id: {
      title: 'Fitur Lengkap untuk',
      titleHighlight: ' Pesantren Modern',
      subtitle: 'Platform all-in-one yang mengintegrasikan semua aspek manajemen pesantren, dari akademik hingga keuangan, dalam satu sistem yang mudah digunakan',
      viewDemo: 'Lihat Demo',
      viewPricing: 'Lihat Harga',
      benefitsTitle: 'Keuntungan Menggunakan Pondok Digital',
      benefitsSubtitle: 'Lebih dari sekedar software, kami adalah partner transformasi digital Anda',
      ctaTitle: 'Siap Transformasi Digital?',
      ctaSubtitle: 'Bergabung dengan ratusan pesantren yang telah meningkatkan efisiensi operasional hingga 80% dengan Pondok Digital',
      startFree: 'Mulai Gratis Sekarang',
      consultation: 'Konsultasi Gratis',
      footer: 'Tidak perlu kartu kredit • Setup instan • Cancel kapan saja'
    },
    en: {
      title: 'Complete Features for',
      titleHighlight: ' Modern Pesantren',
      subtitle: 'An all-in-one platform that integrates all aspects of pesantren management, from academics to finance, in one easy-to-use system',
      viewDemo: 'View Demo',
      viewPricing: 'View Pricing',
      benefitsTitle: 'Benefits of Using Pondok Digital',
      benefitsSubtitle: 'More than just software, we are your digital transformation partner',
      ctaTitle: 'Ready for Digital Transformation?',
      ctaSubtitle: 'Join hundreds of pesantren that have increased operational efficiency by up to 80% with Pondok Digital',
      startFree: 'Start Free Now',
      consultation: 'Free Consultation',
      footer: 'No credit card required • Instant setup • Cancel anytime'
    }
  }

  const t = translations[language]

  const features = [
    {
      category: language === 'id' ? 'Akademik' : 'Academic',
      icon: GraduationCap,
      color: 'from-blue-500 to-indigo-600',
      items: [
        {
          title: language === 'id' ? 'Manajemen Kurikulum' : 'Curriculum Management',
          description: language === 'id' ? 'Kelola kurikulum diniyah dan formal dengan mudah' : 'Manage diniyah and formal curricula with ease',
          icon: BookOpen
        },
        {
          title: language === 'id' ? 'Jadwal Pelajaran' : 'Class Schedule',
          description: language === 'id' ? 'Atur jadwal otomatis untuk semua tingkatan' : 'Automatic scheduling for all levels',
          icon: Calendar
        },
        {
          title: language === 'id' ? 'Penilaian Digital' : 'Digital Assessment',
          description: language === 'id' ? 'Input nilai dan generate rapor otomatis' : 'Input grades and generate automatic reports',
          icon: FileText
        },
        {
          title: language === 'id' ? 'E-Learning' : 'E-Learning',
          description: language === 'id' ? 'Platform pembelajaran online terintegrasi' : 'Integrated online learning platform',
          icon: School
        }
      ]
    },
    {
      category: language === 'id' ? 'Keuangan' : 'Finance',
      icon: DollarSign,
      color: 'from-green-500 to-emerald-600',
      items: [
        {
          title: language === 'id' ? 'Pembukuan Otomatis' : 'Automatic Bookkeeping',
          description: language === 'id' ? 'Pencatatan keuangan real-time dan akurat' : 'Real-time and accurate financial recording',
          icon: PieChart
        },
        {
          title: language === 'id' ? 'Payment Gateway' : 'Payment Gateway',
          description: language === 'id' ? 'Terima pembayaran SPP online' : 'Accept online tuition payments',
          icon: CreditCard
        },
        {
          title: language === 'id' ? 'Laporan Keuangan' : 'Financial Reports',
          description: language === 'id' ? 'Dashboard keuangan transparan' : 'Transparent financial dashboard',
          icon: BarChart3
        },
        {
          title: language === 'id' ? 'Manajemen Donasi' : 'Donation Management',
          description: language === 'id' ? 'Kelola donasi dan wakaf digital' : 'Manage digital donations and waqf',
          icon: HeartHandshake
        }
      ]
    },
    {
      category: language === 'id' ? 'Santri & Wali' : 'Students & Parents',
      icon: Users,
      color: 'from-purple-500 to-pink-600',
      items: [
        {
          title: language === 'id' ? 'Database Santri' : 'Student Database',
          description: language === 'id' ? 'Profil lengkap santri dan riwayat pendidikan' : 'Complete student profiles and educational history',
          icon: UserCheck
        },
        {
          title: language === 'id' ? 'Absensi Digital' : 'Digital Attendance',
          description: language === 'id' ? 'Presensi dengan QR code atau biometrik' : 'Attendance with QR code or biometric',
          icon: Shield
        },
        {
          title: language === 'id' ? 'Portal Wali Santri' : 'Parent Portal',
          description: language === 'id' ? 'Akses informasi santri untuk orang tua' : 'Student information access for parents',
          icon: Smartphone
        },
        {
          title: language === 'id' ? 'Notifikasi Real-time' : 'Real-time Notifications',
          description: language === 'id' ? 'Update instant ke wali santri' : 'Instant updates to parents',
          icon: Bell
        }
      ]
    },
    {
      category: language === 'id' ? 'Manajemen Yayasan' : 'Foundation Management',
      icon: Building,
      color: 'from-orange-500 to-red-600',
      items: [
        {
          title: language === 'id' ? 'Multi-Lembaga' : 'Multi-Institution',
          description: language === 'id' ? 'Kelola TK, SD, SMP, SMA dalam satu sistem' : 'Manage KG, Primary, Middle, High School in one system',
          icon: Building
        },
        {
          title: language === 'id' ? 'Manajemen SDM' : 'HR Management',
          description: language === 'id' ? 'Database guru, ustadz, dan karyawan' : 'Database of teachers, ustadz, and employees',
          icon: Users
        },
        {
          title: language === 'id' ? 'Inventaris & Aset' : 'Inventory & Assets',
          description: language === 'id' ? 'Tracking aset dan inventaris yayasan' : 'Foundation asset and inventory tracking',
          icon: FileText
        },
        {
          title: language === 'id' ? 'Dokumen Digital' : 'Digital Documents',
          description: language === 'id' ? 'Arsip digital dengan backup otomatis' : 'Digital archive with automatic backup',
          icon: Cloud
        }
      ]
    }
  ]

  const benefits = [
    {
      icon: Zap,
      title: language === 'id' ? 'Hemat Waktu' : 'Save Time',
      description: language === 'id' ? 'Otomasi tugas administratif hingga 80%' : 'Automate administrative tasks up to 80%'
    },
    {
      icon: Shield,
      title: language === 'id' ? 'Keamanan Data' : 'Data Security',
      description: language === 'id' ? 'Enkripsi tingkat bank untuk semua data' : 'Bank-level encryption for all data'
    },
    {
      icon: RefreshCw,
      title: language === 'id' ? 'Update Otomatis' : 'Automatic Updates',
      description: language === 'id' ? 'Fitur baru setiap bulan tanpa biaya tambahan' : 'New features every month at no extra cost'
    },
    {
      icon: Globe,
      title: language === 'id' ? 'Akses Dimana Saja' : 'Access Anywhere',
      description: language === 'id' ? 'Cloud-based, akses dari perangkat apapun' : 'Cloud-based, access from any device'
    },
    {
      icon: HeartHandshake,
      title: language === 'id' ? 'Support 24/7' : '24/7 Support',
      description: language === 'id' ? 'Tim support siap membantu kapan saja' : 'Support team ready to help anytime'
    },
    {
      icon: Lock,
      title: language === 'id' ? 'Backup Otomatis' : 'Automatic Backup',
      description: language === 'id' ? 'Data aman dengan backup harian' : 'Safe data with daily backup'
    }
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <SaasHeader />
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
              {t.title}
              <span className="text-green-600">{t.titleHighlight}</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              {t.subtitle}
            </p>
            <div className="flex gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/yayasan/imam-syafii">
                  {t.viewDemo}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/pricing">
                  {t.viewPricing}
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
              {t.benefitsTitle}
            </h2>
            <p className="text-xl text-gray-600">
              {t.benefitsSubtitle}
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
              {t.ctaTitle}
            </h2>
            <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
              {t.ctaSubtitle}
            </p>
            <div className="flex gap-4 justify-center">
              <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100" asChild>
                <Link href="/onboarding">
                  {t.startFree}
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10">
                <Link href="/contact">
                  {t.consultation}
                </Link>
              </Button>
            </div>
            <p className="text-sm text-green-100 mt-4">
              {t.footer}
            </p>
          </motion.div>
        </div>
      </section>
      </div>
      <SaasFooter />
    </div>
  )
}