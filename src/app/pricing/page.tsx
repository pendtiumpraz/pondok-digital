'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import SaasHeader from '@/components/layout/SaasHeader';
import SaasFooter from '@/components/layout/SaasFooter';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  CheckIcon,
  XMarkIcon,
  CurrencyDollarIcon,
  ArrowRightIcon,
  SparklesIcon,
  CloudIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  UsersIcon,
  CogIcon,
  GlobeAltIcon,
  StarIcon,
  QuestionMarkCircleIcon,
} from '@heroicons/react/24/outline';

const PricingPage = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [userCount, setUserCount] = useState(10);
  const [selectedPlan, setSelectedPlan] = useState<string>('pro');

  const plans = [
    {
      id: 'starter',
      name: 'Starter',
      description: 'Sempurna untuk yayasan kecil yang baru memulai',
      icon: SparklesIcon,
      color: 'from-blue-500 to-indigo-600',
      pricing: {
        monthly: 299000,
        annual: 2990000, // 2 bulan gratis
      },
      features: [
        'Hingga 5 anggota tim',
        'Dashboard dasar',
        'Penyimpanan 10GB',
        'Dukungan email',
        'Analitik dasar',
        'Template standar',
        'Akses aplikasi mobile',
        'Akses API (100 panggilan/hari)',
      ],
      limitations: [
        'Kustomisasi terbatas',
        'Tidak ada white-labeling',
        'Laporan dasar saja',
        'Tidak ada dukungan prioritas',
      ],
      popular: false,
    },
    {
      id: 'pro',
      name: 'Professional',
      description: 'Paling populer untuk yayasan yang berkembang',
      icon: ChartBarIcon,
      color: 'from-emerald-500 to-green-600',
      pricing: {
        monthly: 799000,
        annual: 7990000, // 2 bulan gratis
      },
      features: [
        'Hingga 25 anggota tim',
        'Dashboard lanjutan',
        'Penyimpanan 100GB',
        'Dukungan prioritas email & chat',
        'Analitik & laporan lanjutan',
        'Template kustom',
        'Akses aplikasi mobile',
        'Akses API (1.000 panggilan/hari)',
        'Integrasi kustom',
        'Izin berbasis peran',
        'Ekspor data',
        'Log audit',
      ],
      limitations: [
        'White-labeling terbatas',
        'SLA standar',
      ],
      popular: true,
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      description: 'Untuk yayasan besar dengan kebutuhan lanjutan',
      icon: ShieldCheckIcon,
      color: 'from-purple-500 to-pink-600',
      pricing: {
        monthly: 1999000,
        annual: 19990000, // 2 bulan gratis
      },
      features: [
        'Anggota tim tidak terbatas',
        'Dashboard enterprise',
        'Penyimpanan tidak terbatas',
        'Dukungan 24/7 telepon & chat',
        'Analitik enterprise',
        'Template kustom penuh',
        'Akses aplikasi mobile',
        'Akses API tidak terbatas',
        'Integrasi kustom',
        'Izin lanjutan',
        'Ekspor data',
        'Log audit penuh',
        'White-labeling lengkap',
        'Domain kustom',
        'Integrasi SSO',
        'Keamanan lanjutan',
        'Jaminan SLA',
        'Manajer akun khusus',
      ],
      limitations: [],
      popular: false,
    },
  ];

  const addOns = [
    {
      name: 'Pengguna Tambahan',
      description: 'Anggota tim ekstra melebihi batas paket',
      pricing: { monthly: 50000, annual: 500000 },
      unit: 'per pengguna/bulan',
    },
    {
      name: 'Penyimpanan Ekstra',
      description: 'Penyimpanan tambahan melebihi batas paket',
      pricing: { monthly: 100000, annual: 1000000 },
      unit: 'per 100GB/bulan',
    },
    {
      name: 'Dukungan Premium',
      description: 'Dukungan prioritas 24/7 dengan agen khusus',
      pricing: { monthly: 290000, annual: 2900000 },
      unit: 'per bulan',
    },
    {
      name: 'Keamanan Lanjutan',
      description: 'Fitur keamanan ditingkatkan dan kepatuhan',
      pricing: { monthly: 490000, annual: 4900000 },
      unit: 'per bulan',
    },
  ];

  const faq = [
    {
      question: 'Bagaimana sistem harga bekerja?',
      answer: 'Harga kami berdasarkan paket yang Anda pilih dan jumlah pengguna. Setiap paket mencakup jumlah pengguna dasar, dan Anda dapat menambahkan lebih banyak sesuai kebutuhan. Paket tahunan menghemat 2 bulan dibandingkan tagihan bulanan.',
    },
    {
      question: 'Bisakah saya mengubah paket kapan saja?',
      answer: 'Ya! Anda dapat meningkatkan atau menurunkan paket Anda kapan saja. Perubahan berlaku segera, dan tagihan akan disesuaikan secara proporsional.',
    },
    {
      question: 'Apa yang terjadi pada data saya jika saya membatalkan?',
      answer: 'Data Anda tersimpan dengan aman selama 30 hari setelah pembatalan. Anda dapat mengekspor semua data Anda selama periode ini. Setelah 30 hari, data akan dihapus secara permanen.',
    },
    {
      question: 'Apakah Anda menawarkan paket enterprise kustom?',
      answer: 'Ya! Untuk yayasan besar dengan kebutuhan khusus, kami menawarkan paket enterprise kustom dengan fitur, harga, dan dukungan yang disesuaikan.',
    },
    {
      question: 'Apakah ada uji coba gratis?',
      answer: 'Ya! Semua paket dilengkapi dengan uji coba gratis 14 hari. Tidak perlu kartu kredit untuk memulai.',
    },
    {
      question: 'Metode pembayaran apa yang Anda terima?',
      answer: 'Kami menerima semua kartu kredit utama, PayPal, dan transfer bank untuk pelanggan enterprise. Semua pembayaran diproses dengan aman.',
    },
  ];

  const calculatePrice = (plan: typeof plans[0]) => {
    const basePrice = plan.pricing[billingCycle];
    return billingCycle === 'annual' ? basePrice / 12 : basePrice;
  };

  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat('id-ID').format(amount);
  };

  const getSavings = (plan: typeof plans[0]) => {
    const monthlyTotal = plan.pricing.monthly * 12;
    const annualPrice = plan.pricing.annual;
    return monthlyTotal - annualPrice;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SaasHeader />
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-indigo-50 via-white to-purple-50">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 mb-6">
                Harga yang <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Sederhana & Transparan</span>
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                Pilih paket yang sempurna untuk yayasan Anda. Mulai dengan uji coba gratis dan berkembang seiring pertumbuhan yayasan.
              </p>
              
              {/* Billing Toggle */}
              <div className="flex items-center justify-center gap-4 mb-8">
                <span className={`text-lg font-medium ${billingCycle === 'monthly' ? 'text-gray-900' : 'text-gray-500'}`}>
                  Bulanan
                </span>
                <button
                  onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')}
                  className={`relative w-16 h-8 rounded-full transition-colors ${
                    billingCycle === 'annual' ? 'bg-indigo-600' : 'bg-gray-300'
                  }`}
                >
                  <div
                    className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform ${
                      billingCycle === 'annual' ? 'translate-x-9' : 'translate-x-1'
                    }`}
                  />
                </button>
                <div className="flex items-center gap-2">
                  <span className={`text-lg font-medium ${billingCycle === 'annual' ? 'text-gray-900' : 'text-gray-500'}`}>
                    Tahunan
                  </span>
                  <span className="bg-green-100 text-green-800 text-sm font-medium px-2 py-1 rounded-full">
                    Hemat 2 bulan
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Pricing Cards */}
            <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {plans.map((plan, index) => (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative"
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <div className="bg-gradient-to-r from-emerald-500 to-green-600 text-white px-6 py-2 rounded-full text-sm font-medium flex items-center gap-2">
                        <StarIcon className="w-4 h-4" />
                        Paling Populer
                      </div>
                    </div>
                  )}
                  
                  <Card className={`p-8 h-full relative overflow-hidden ${
                    plan.popular ? 'border-2 border-emerald-200 shadow-2xl scale-105' : 'border border-gray-200 shadow-lg'
                  }`}>
                    <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${plan.color} opacity-10 rounded-full -mr-16 -mt-16`} />
                    
                    <div className="relative">
                      {/* Header */}
                      <div className="text-center mb-8">
                        <div className={`w-16 h-16 bg-gradient-to-br ${plan.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                          <plan.icon className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                        <p className="text-gray-600">{plan.description}</p>
                      </div>

                      {/* Pricing */}
                      <div className="text-center mb-8">
                        <div className="flex items-baseline justify-center gap-1">
                          <span className="text-5xl font-bold text-gray-900">
                            Rp {formatRupiah(calculatePrice(plan))}
                          </span>
                          <span className="text-lg text-gray-600">/{billingCycle === 'monthly' ? 'bulan' : 'tahun'}</span>
                        </div>
                        {billingCycle === 'annual' && (
                          <div className="text-green-600 text-sm font-medium mt-2">
                            Hemat Rp {formatRupiah(getSavings(plan))} per tahun
                          </div>
                        )}
                      </div>

                      {/* CTA Button */}
                      <div className="mb-8">
                        <Link href="/onboarding">
                          <Button
                            className={`w-full py-3 text-lg font-semibold ${
                              plan.popular
                                ? 'bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700'
                                : 'bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-900 hover:to-black'
                            } text-white`}
                          >
                            Mulai Uji Coba Gratis
                            <ArrowRightIcon className="w-5 h-5 ml-2" />
                          </Button>
                        </Link>
                      </div>

                      {/* Features */}
                      <div className="space-y-4">
                        <h4 className="font-semibold text-gray-900 text-lg">Yang termasuk:</h4>
                        <ul className="space-y-3">
                          {plan.features.map((feature, featureIndex) => (
                            <li key={featureIndex} className="flex items-start gap-3">
                              <CheckIcon className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                              <span className="text-gray-600">{feature}</span>
                            </li>
                          ))}
                        </ul>

                        {plan.limitations.length > 0 && (
                          <div className="mt-6 pt-6 border-t border-gray-200">
                            <h5 className="font-medium text-gray-700 mb-3">Keterbatasan:</h5>
                            <ul className="space-y-2">
                              {plan.limitations.map((limitation, limIndex) => (
                                <li key={limIndex} className="flex items-start gap-3">
                                  <XMarkIcon className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                                  <span className="text-gray-500 text-sm">{limitation}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Enterprise CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-center mt-16"
            >
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-12 text-white max-w-4xl mx-auto">
                <h3 className="text-3xl font-bold mb-4">Butuh sesuatu yang lebih khusus?</h3>
                <p className="text-xl text-purple-100 mb-8">
                  Hubungi tim penjualan kami untuk solusi enterprise kustom dengan harga, fitur, dan dukungan yang disesuaikan.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/contact">
                    <Button className="bg-white text-purple-700 hover:bg-gray-100 font-semibold px-8 py-3">
                      Hubungi Tim Penjualan
                    </Button>
                  </Link>
                  <Link href="/demo">
                    <Button className="bg-purple-700/20 text-white border-2 border-white/20 hover:bg-purple-700/30 font-semibold px-8 py-3">
                      Jadwalkan Demo
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Add-ons Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Tingkatkan Paket Anda dengan <span className="text-indigo-600">Add-ons</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Sesuaikan paket Anda dengan fitur dan layanan tambahan untuk memenuhi kebutuhan spesifik Anda.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {addOns.map((addon, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="p-6 h-full hover:shadow-lg transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{addon.name}</h3>
                        <p className="text-gray-600">{addon.description}</p>
                      </div>
                      <div className="text-right flex-shrink-0 ml-4">
                        <div className="text-2xl font-bold text-gray-900">
                          Rp {formatRupiah(addon.pricing[billingCycle])}
                        </div>
                        <div className="text-sm text-gray-600">{addon.unit}</div>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full">
                      Tambahkan ke Paket
                    </Button>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Interactive Calculator */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Kalkulator <span className="text-indigo-600">Harga</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Sesuaikan paket Anda dan lihat dengan tepat berapa yang akan Anda bayar dengan kalkulator interaktif kami.
              </p>
            </motion.div>

            <div className="max-w-4xl mx-auto">
              <Card className="p-8">
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Calculator Controls */}
                  <div className="space-y-6">
                    <div>
                      <label className="block text-lg font-semibold text-gray-900 mb-4">
                        Pilih Paket
                      </label>
                      <div className="grid grid-cols-3 gap-3">
                        {plans.map((plan) => (
                          <button
                            key={plan.id}
                            onClick={() => setSelectedPlan(plan.id)}
                            className={`p-4 rounded-xl border-2 text-center transition-all ${
                              selectedPlan === plan.id
                                ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <plan.icon className="w-8 h-8 mx-auto mb-2" />
                            <div className="font-semibold text-sm">{plan.name}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-lg font-semibold text-gray-900 mb-4">
                        Ukuran Tim: {userCount} pengguna
                      </label>
                      <input
                        type="range"
                        min="1"
                        max="100"
                        value={userCount}
                        onChange={(e) => setUserCount(parseInt(e.target.value))}
                        className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                      <div className="flex justify-between text-sm text-gray-500 mt-2">
                        <span>1 pengguna</span>
                        <span>100+ pengguna</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-lg font-semibold text-gray-900 mb-4">
                        Siklus Tagihan
                      </label>
                      <div className="flex gap-4">
                        {['monthly', 'annual'].map((cycle) => (
                          <button
                            key={cycle}
                            onClick={() => setBillingCycle(cycle as 'monthly' | 'annual')}
                            className={`flex-1 p-4 rounded-xl border-2 text-center transition-all ${
                              billingCycle === cycle
                                ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <div className="font-semibold">{cycle === 'monthly' ? 'Bulanan' : 'Tahunan'}</div>
                            {cycle === 'annual' && (
                              <div className="text-sm text-green-600">Hemat 17%</div>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Pricing Summary */}
                  <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-2xl">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">Ringkasan Harga</h3>
                    
                    {(() => {
                      const selectedPlanData = plans.find(p => p.id === selectedPlan)!;
                      const basePrice = calculatePrice(selectedPlanData);
                      const extraUsers = Math.max(0, userCount - (selectedPlan === 'starter' ? 5 : selectedPlan === 'pro' ? 25 : 1000));
                      const extraUserCost = extraUsers * (billingCycle === 'annual' ? 41700 : 50000);
                      const totalMonthly = basePrice + extraUserCost;
                      const totalAnnual = totalMonthly * 12;

                      return (
                        <div className="space-y-4">
                          <div className="flex justify-between items-center py-3 border-b border-indigo-200">
                            <span className="text-gray-700">Paket Dasar ({selectedPlanData.name})</span>
                            <span className="font-semibold">Rp {formatRupiah(basePrice)}/bln</span>
                          </div>
                          
                          {extraUsers > 0 && (
                            <div className="flex justify-between items-center py-3 border-b border-indigo-200">
                              <span className="text-gray-700">{extraUsers} pengguna tambahan</span>
                              <span className="font-semibold">Rp {formatRupiah(extraUserCost)}/bln</span>
                            </div>
                          )}

                          <div className="flex justify-between items-center py-4 border-t-2 border-indigo-300">
                            <span className="text-xl font-bold text-gray-900">Total</span>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-indigo-600">
                                Rp {formatRupiah(totalMonthly)}/{billingCycle === 'monthly' ? 'bln' : 'thn'}
                              </div>
                              {billingCycle === 'annual' && (
                                <div className="text-sm text-gray-600">
                                  Rp {formatRupiah(totalAnnual)} ditagih tahunan
                                </div>
                              )}
                            </div>
                          </div>

                          <Link href="/onboarding">
                            <Button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3">
                              Mulai Uji Coba Gratis
                              <ArrowRightIcon className="w-5 h-5 ml-2" />
                            </Button>
                          </Link>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Pertanyaan yang <span className="text-indigo-600">Sering Ditanyakan</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Ada pertanyaan? Kami punya jawabannya. Jika Anda tidak dapat menemukan yang Anda cari, hubungi tim dukungan kami.
              </p>
            </motion.div>

            <div className="max-w-4xl mx-auto">
              <div className="space-y-6">
                {faq.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                          <QuestionMarkCircleIcon className="w-5 h-5 text-indigo-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900 mb-3">{item.question}</h3>
                          <p className="text-gray-600 leading-relaxed">{item.answer}</p>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-20 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-4xl mx-auto"
            >
              <h2 className="text-4xl lg:text-6xl font-bold text-white mb-6">
                Siap untuk Memulai?
              </h2>
              <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
                Bergabunglah dengan ribuan yayasan yang sudah menggunakan platform kami untuk mengembangkan operasi mereka.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/onboarding">
                  <Button className="bg-white text-indigo-700 hover:bg-gray-100 font-bold px-10 py-4 text-lg">
                    Mulai Uji Coba Gratis
                    <ArrowRightIcon className="w-6 h-6 ml-2" />
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button className="bg-white/10 backdrop-blur-sm text-white border-2 border-white/20 hover:bg-white/20 font-bold px-10 py-4 text-lg">
                    Hubungi Tim Penjualan
                  </Button>
                </Link>
              </div>

              <div className="mt-8 text-purple-200 text-sm">
                Tidak perlu kartu kredit • Uji coba gratis 14 hari • Batal kapan saja
              </div>
            </motion.div>
          </div>
        </section>
      </div>
      <SaasFooter />
    </div>
  );
};

export default PricingPage;