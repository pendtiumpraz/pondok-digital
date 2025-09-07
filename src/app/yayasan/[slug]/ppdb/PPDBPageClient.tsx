'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  GraduationCap,
  FileText,
  CreditCard,
  CheckCircle,
  Users,
  Calendar,
  MapPin,
  Phone,
  Mail,
  ArrowRight,
  Download,
  School,
  Baby,
  Home,
} from 'lucide-react';
import PublicLayout from '@/components/layout/PublicLayout';

export default function PPDBPageClient() {
  const [activeTab, setActiveTab] = useState('TK');

  const programs = [
    {
      icon: Baby,
      level: 'TK',
      title: 'Taman Kanak-Kanak',
      age: '4-6 tahun',
      seats: 60,
      available: 15,
      fee: 'Rp 3.000.000',
      features: [
        'Pembelajaran Al-Quran dasar',
        'Hafalan surat pendek',
        'Akhlak & adab',
        'Bermain sambil belajar'
      ]
    },
    {
      icon: School,
      level: 'SD',
      title: 'Sekolah Dasar',
      age: '7-12 tahun',
      seats: 120,
      available: 30,
      fee: 'Rp 5.000.000',
      features: [
        'Kurikulum Nasional + Diniyah',
        'Tahfidz 5 juz',
        'Bahasa Arab & Inggris',
        'Ekstrakurikuler'
      ]
    },
    {
      icon: Home,
      level: 'PONDOK',
      title: 'Pondok Pesantren',
      age: '13+ tahun',
      seats: 200,
      available: 50,
      fee: 'Rp 8.000.000',
      features: [
        'Program Tahfidz 30 juz',
        'Kitab kuning',
        'Bahasa Arab intensif',
        'Asrama & makan'
      ]
    }
  ];

  const timeline = [
    {
      date: '1 Jan - 28 Feb 2025',
      title: 'Gelombang 1',
      discount: '20%',
      status: 'active'
    },
    {
      date: '1 Mar - 30 Apr 2025',
      title: 'Gelombang 2',
      discount: '10%',
      status: 'upcoming'
    },
    {
      date: '1 Mei - 30 Jun 2025',
      title: 'Gelombang 3',
      discount: '0%',
      status: 'upcoming'
    }
  ];

  const steps = [
    {
      icon: FileText,
      title: 'Isi Formulir',
      description: 'Lengkapi formulir pendaftaran online'
    },
    {
      icon: CreditCard,
      title: 'Pembayaran',
      description: 'Bayar biaya pendaftaran Rp 150.000'
    },
    {
      icon: Calendar,
      title: 'Jadwal Test',
      description: 'Ikuti test sesuai jadwal yang ditentukan'
    },
    {
      icon: CheckCircle,
      title: 'Pengumuman',
      description: 'Cek hasil seleksi dan daftar ulang'
    }
  ];

  const requirements = {
    TK: [
      'Akta kelahiran',
      'Kartu Keluarga',
      'Pas foto 3x4 (3 lembar)',
      'Surat keterangan sehat'
    ],
    SD: [
      'Akta kelahiran',
      'Kartu Keluarga',
      'Ijazah TK (jika ada)',
      'Pas foto 3x4 (3 lembar)',
      'Surat keterangan sehat',
      'NISN (jika ada)'
    ],
    PONDOK: [
      'Akta kelahiran',
      'Kartu Keluarga',
      'Ijazah SD/MI',
      'SKHUN/Nilai UN',
      'Pas foto 3x4 (3 lembar)',
      'Surat keterangan sehat',
      'NISN',
      'Surat izin orang tua'
    ]
  };

  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-green-600 to-emerald-700 text-white">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative container mx-auto px-4 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Penerimaan Peserta Didik Baru
            </h1>
            <p className="text-xl mb-8 text-green-100">
              Tahun Ajaran 2025/2026 - Pondok Pesantren Imam Syafi'i Blitar
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/ppdb/register">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-white text-green-700 font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all flex items-center gap-2"
                >
                  <FileText className="w-5 h-5" />
                  Daftar Sekarang
                </motion.button>
              </Link>
              <Link href="/ppdb/status">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-green-800/30 backdrop-blur text-white font-bold rounded-xl border-2 border-white/30 hover:bg-green-800/50 transition-all flex items-center gap-2"
                >
                  <CheckCircle className="w-5 h-5" />
                  Cek Status
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Programs Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Program Pendidikan
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {programs.map((program, index) => (
              <motion.div
                key={program.level}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all"
              >
                <div className={`p-6 bg-gradient-to-br ${
                  program.level === 'TK' ? 'from-pink-500 to-rose-600' :
                  program.level === 'SD' ? 'from-blue-500 to-indigo-600' :
                  'from-green-500 to-emerald-600'
                } text-white`}>
                  <program.icon className="w-12 h-12 mb-4" />
                  <h3 className="text-2xl font-bold mb-2">{program.title}</h3>
                  <p className="text-white/90">Usia {program.age}</p>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <p className="text-sm text-gray-600">Kuota</p>
                      <p className="text-xl font-bold">{program.seats} siswa</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Tersisa</p>
                      <p className="text-xl font-bold text-green-600">{program.available}</p>
                    </div>
                  </div>
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-1">Biaya Masuk</p>
                    <p className="text-2xl font-bold text-gray-900">{program.fee}</p>
                  </div>
                  <ul className="space-y-2 mb-6">
                     {(program.features || []).map((feature, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href={`/ppdb/register?level=${program.level}`}>
                    <button className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all flex items-center justify-center gap-2">
                      Daftar {program.level}
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Jadwal Pendaftaran
          </h2>
          <div className="max-w-3xl mx-auto">
            {timeline.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`flex gap-4 mb-8 ${
                  item.status === 'active' ? 'scale-105' : ''
                }`}
              >
                <div className={`w-4 h-4 rounded-full mt-2 flex-shrink-0 ${
                  item.status === 'active' ? 'bg-green-500 ring-4 ring-green-200' : 'bg-gray-300'
                }`} />
                <div className={`flex-1 p-6 rounded-xl ${
                  item.status === 'active' ? 'bg-white shadow-xl border-2 border-green-500' : 'bg-white shadow'
                }`}>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-gray-900">{item.title}</h3>
                    {item.discount !== '0%' && (
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                        Diskon {item.discount}
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600">{item.date}</p>
                  {item.status === 'active' && (
                    <p className="mt-2 text-green-600 font-semibold">Sedang Dibuka</p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Alur Pendaftaran
          </h2>
          <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white">
                  <step.icon className="w-10 h-10" />
                </div>
                <h3 className="text-lg font-bold mb-2 text-gray-900">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
                {index < steps.length - 1 && (
                  <ArrowRight className="w-6 h-6 text-gray-400 mx-auto mt-4 hidden md:block" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Requirements Tabs */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Persyaratan Pendaftaran
          </h2>
          <div className="max-w-3xl mx-auto">
            <div className="flex gap-4 mb-8 justify-center">
              {Object.keys(requirements).map((level) => (
                <button
                  key={level}
                  onClick={() => setActiveTab(level)}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                    activeTab === level
                      ? 'bg-green-600 text-white shadow-lg'
                      : 'bg-white text-gray-700 hover:shadow'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-xl p-8"
            >
              <h3 className="text-xl font-bold mb-4 text-gray-900">
                Dokumen yang diperlukan untuk {activeTab}:
              </h3>
              <ul className="space-y-3">
                {(requirements[activeTab as keyof typeof requirements] || []).map((req, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{req}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-gradient-to-br from-green-600 to-emerald-700 rounded-2xl shadow-2xl overflow-hidden">
            <div className="p-8 md:p-12 text-white">
              <h2 className="text-3xl font-bold mb-6">Informasi & Kontak</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold mb-4">Sekretariat PPDB</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 flex-shrink-0 mt-1" />
                      <p>Jl. Imam Syafi'i No. 123<br />Blitar, Jawa Timur 66111</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5" />
                      <p>0342-123456 / 0812-3456-7890</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5" />
                      <p>ppdb@ponpesimamsyafii.id</p>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-4">Jam Pelayanan</h3>
                  <div className="space-y-2">
                    <p>Senin - Jumat: 08:00 - 15:00</p>
                    <p>Sabtu: 08:00 - 12:00</p>
                    <p>Minggu & Hari Libur: Tutup</p>
                  </div>
                  <button className="mt-6 px-6 py-3 bg-white text-green-700 font-semibold rounded-lg hover:shadow-lg transition-all flex items-center gap-2">
                    <Download className="w-5 h-5" />
                    Download Brosur
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}