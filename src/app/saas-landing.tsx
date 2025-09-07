'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, School, Users, Shield, Zap } from 'lucide-react'

export default function SAASLanding() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-600 to-green-800 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">
              Pondok Digital - Platform SAAS untuk Pesantren Modern
            </h1>
            <p className="text-xl mb-8">
              Kelola seluruh operasional pondok pesantren dengan satu platform terintegrasi.
              Dari PPDB online hingga manajemen keuangan, semua dalam satu sistem.
            </p>
            <div className="flex gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/auth/register">Mulai Trial 14 Hari</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/pricing">Lihat Harga</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Fitur Lengkap untuk Pesantren Digital
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader>
                <School className="w-10 h-10 text-green-600 mb-2" />
                <CardTitle>Manajemen Akademik</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                    <span>Kurikulum & Jadwal</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                    <span>Raport Digital</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                    <span>Hafalan Al-Quran</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Users className="w-10 h-10 text-green-600 mb-2" />
                <CardTitle>PPDB Online</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                    <span>Pendaftaran Online</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                    <span>Seleksi Otomatis</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                    <span>Pengumuman Digital</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Shield className="w-10 h-10 text-green-600 mb-2" />
                <CardTitle>Keuangan & SPP</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                    <span>Tagihan Otomatis</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                    <span>Payment Gateway</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                    <span>Laporan Keuangan</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Zap className="w-10 h-10 text-green-600 mb-2" />
                <CardTitle>Komunikasi</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                    <span>WhatsApp Blast</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                    <span>Parent Portal</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                    <span>Notifikasi Real-time</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Pilihan Paket Berlangganan
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Basic</CardTitle>
                <p className="text-2xl font-bold">Rp 299rb<span className="text-sm font-normal">/bulan</span></p>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">Hingga 100 santri</p>
              </CardContent>
            </Card>

            <Card className="border-green-600 border-2">
              <CardHeader>
                <CardTitle>Professional</CardTitle>
                <p className="text-2xl font-bold">Rp 999rb<span className="text-sm font-normal">/bulan</span></p>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">Hingga 500 santri</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Enterprise</CardTitle>
                <p className="text-2xl font-bold">Rp 2.999rb<span className="text-sm font-normal">/bulan</span></p>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">Unlimited santri</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Demo Tenants */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Lihat Demo Yayasan
          </h2>
          <div className="text-center">
            <p className="mb-6">Coba demo dari salah satu yayasan kami:</p>
            <Button asChild>
              <Link href="/yayasan/imam-syafii">
                Demo: Yayasan Pondok Imam Syafii Blitar
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}