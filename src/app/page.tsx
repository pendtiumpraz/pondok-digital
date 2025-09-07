'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import CountUp from 'react-countup';
import SaasHeader from '@/components/layout/SaasHeader';
import SaasFooter from '@/components/layout/SaasFooter';
import {
  CloudIcon,
  CogIcon,
  GlobeAltIcon,
  ShieldCheckIcon,
  ChartBarIcon,
  UsersIcon,
  BuildingOfficeIcon,
  CurrencyDollarIcon,
  SparklesIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  TrophyIcon,
  LightBulbIcon,
  RocketLaunchIcon,
  StarIcon,
} from '@heroicons/react/24/outline';

export default function HomePage() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // Translations
  const t = {
    badge: 'Platform Digital Pesantren Modern',
    heroTitle: 'Platform Digital untuk',
    heroHighlight: 'Pesantren Modern',
    heroSubtitle: 'Kelola pesantren, sekolah Islam, dan yayasan Anda dengan sistem terintegrasi yang mudah digunakan',
    heroDescription: 'Transformasi digital pesantren Anda dengan platform all-in-one yang mengelola akademik, keuangan, SDM, dan operasional dalam satu sistem terintegrasi.',
    startTrial: 'Mulai Uji Coba Gratis',
    viewPricing: 'Lihat Harga',
    noSetupFees: 'Tanpa biaya setup',
    cancelAnytime: 'Batal kapan saja',
    support247: 'Support 24/7',
    featuresTitle: 'Fitur Lengkap',
    featuresHighlight: 'untuk Pesantren Modern',
    featuresSubtitle: 'Semua yang Anda butuhkan untuk mengelola pesantren dalam satu platform',
    benefitsTitle: 'Keuntungan Menggunakan',
    benefitsHighlight: 'Pondok Digital',
    benefitsSubtitle: 'Platform terpadu yang dirancang khusus untuk kebutuhan pesantren Indonesia',
    trustedTitle: 'Dipercaya oleh Pesantren Terkemuka',
    trustedSubtitle: 'Bergabung dengan ratusan pesantren yang telah bertransformasi digital',
    reviews: 'ulasan',
    readyTitle: 'Siap Modernisasi Pesantren Anda?',
    readySubtitle: 'Bergabung dengan ratusan pesantren yang telah meningkatkan efisiensi operasional hingga 80%',
    scheduleDemo: 'Jadwalkan Demo',
    noCredit: 'Tidak perlu kartu kredit • Setup instan • Cancel kapan saja'
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const stagger = {
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const features = [
    {
      icon: CloudIcon,
      title: 'Multi-Tenant SaaS',
      description: 'Isolasi lengkap untuk setiap yayasan dengan branding dan domain khusus',
      color: 'from-blue-400 to-indigo-600',
      href: '/features',
    },
    {
      icon: ChartBarIcon,
      title: 'Analitik Canggih',
      description: 'Dashboard real-time dengan insight mendalam dan laporan yang dapat disesuaikan',
      color: 'from-emerald-400 to-green-600',
      href: '/features',
    },
    {
      icon: CogIcon,
      title: 'Konfigurasi Fleksibel',
      description: 'Opsi kustomisasi ekstensif untuk menyesuaikan platform dengan kebutuhan Anda',
      color: 'from-purple-400 to-pink-600',
      href: '/features',
    },
    {
      icon: ShieldCheckIcon,
      title: 'Keamanan Enterprise',
      description: 'Keamanan tingkat bank dengan enkripsi data dan proteksi berlapis',
      color: 'from-orange-400 to-red-600',
      href: '/features',
    },
    {
      icon: GlobeAltIcon,
      title: 'Skala Global',
      description: 'Deploy dimana saja dengan dukungan multi-region dan jaminan uptime 99.9%',
      color: 'from-teal-400 to-cyan-600',
      href: '/features',
    },
    {
      icon: UsersIcon,
      title: 'Kolaborasi Tim',
      description: 'Manajemen pengguna canggih dengan izin berbasis peran dan workflow tim',
      color: 'from-yellow-400 to-amber-600',
      href: '/features',
    },
  ];

  const stats = [
    { label: 'Yayasan Aktif', value: 100, suffix: '+', icon: BuildingOfficeIcon },
    { label: 'Pengguna Bulanan', value: 15000, suffix: '+', icon: UsersIcon },
    { label: 'Uptime', value: 99.9, suffix: '%', icon: ShieldCheckIcon },
    { label: 'Provinsi', value: 20, suffix: '+', icon: GlobeAltIcon },
  ];

  const benefits = [
    {
      icon: RocketLaunchIcon,
      title: 'Rapid Deployment',
      description: 'Launch your tenant in minutes, not months',
      color: 'from-blue-500 to-indigo-600'
    },
    {
      icon: CurrencyDollarIcon,
      title: 'Cost Effective',
      description: 'Reduce infrastructure costs by up to 70%',
      color: 'from-green-500 to-emerald-600'
    },
    {
      icon: TrophyIcon,
      title: 'Market Leader',
      description: 'Trusted by industry leaders worldwide',
      color: 'from-purple-500 to-pink-600'
    },
    {
      icon: LightBulbIcon,
      title: 'Innovation Ready',
      description: 'Built for the future with cutting-edge technology',
      color: 'from-amber-500 to-orange-600'
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <SaasHeader />
      {/* Hero Section */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={stagger}
        className="relative overflow-hidden bg-gradient-to-br from-indigo-900 via-blue-900 to-purple-900 min-h-screen flex items-center"
      >
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute -top-10 -right-10 w-96 h-96 bg-gradient-to-br from-cyan-400/20 to-blue-600/20 rounded-full"
          />
          <motion.div
            animate={{
              scale: [1, 1.5, 1],
              rotate: [360, 180, 0],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute bottom-10 -left-20 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-600/20 rounded-full"
          />
          
          {/* Floating Elements */}
          <div className="absolute inset-0">
            <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white/20 rounded-full animate-pulse"></div>
            <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-cyan-400/40 rounded-full animate-ping"></div>
            <div className="absolute bottom-1/4 left-1/3 w-3 h-3 bg-purple-400/30 rounded-full animate-pulse"></div>
          </div>
        </div>

        <div className="relative container mx-auto px-4 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div variants={fadeInUp} className="text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full text-white mb-8"
              >
                <SparklesIcon className="w-5 h-5 mr-2 text-cyan-400" />
                <span className="text-sm font-medium">{t.badge}</span>
              </motion.div>
              
              <motion.h1
                variants={fadeInUp}
                className="text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight"
              >
                {t.heroTitle}
                <span className="block bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                  {t.heroHighlight}
                </span>
                <span className="block text-4xl lg:text-5xl font-normal text-blue-100 mt-4">
                  {t.heroSubtitle}
                </span>
              </motion.h1>
              
              <motion.p
                variants={fadeInUp}
                className="text-xl text-blue-100 mb-8 leading-relaxed max-w-2xl"
              >
                {t.heroDescription}
              </motion.p>
              
              <motion.div
                variants={fadeInUp}
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              >
                <Link href="/onboarding">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center group"
                  >
                    {t.startTrial}
                    <ArrowRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </motion.button>
                </Link>
                
                <Link href="/pricing">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-bold rounded-xl border-2 border-white/20 hover:bg-white/20 transition-all duration-300"
                  >
                    {t.viewPricing}
                  </motion.button>
                </Link>
              </motion.div>

              {/* Trust Indicators */}
              <motion.div
                variants={fadeInUp}
                className="mt-12 flex items-center gap-8 justify-center lg:justify-start text-blue-200"
              >
                <div className="flex items-center gap-2">
                  <CheckCircleIcon className="w-5 h-5 text-green-400" />
                  <span className="text-sm">{t.noSetupFees}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircleIcon className="w-5 h-5 text-green-400" />
                  <span className="text-sm">{t.cancelAnytime}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircleIcon className="w-5 h-5 text-green-400" />
                  <span className="text-sm">{t.support247}</span>
                </div>
              </motion.div>
            </motion.div>

            {/* Hero Visual */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="relative lg:order-last"
            >
              <div className="relative w-full h-96 lg:h-[600px] rounded-3xl overflow-hidden">
                {/* Dashboard Preview */}
                <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-100 p-8">
                  <div className="h-full bg-white rounded-2xl shadow-2xl overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                            <ChartBarIcon className="w-5 h-5" />
                          </div>
                          <span className="font-semibold">Analytics Dashboard</span>
                        </div>
                        <div className="flex gap-2">
                          <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                          <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                          <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="p-6 space-y-6">
                      <div className="grid grid-cols-3 gap-4">
                        {stats.slice(0, 3).map((stat, index) => (
                          <div key={index} className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-xl">
                            <stat.icon className="w-6 h-6 text-indigo-600 mb-2" />
                            <div className="text-2xl font-bold text-gray-900">
                              {inView && <CountUp end={stat.value} duration={2} />}
                              {stat.suffix}
                            </div>
                            <div className="text-sm text-gray-600">{stat.label}</div>
                          </div>
                        ))}
                      </div>
                      
                      {/* Chart Placeholder */}
                      <div className="h-32 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-xl relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10">
                          <motion.div
                            animate={{
                              x: ["-100%", "100%"],
                            }}
                            transition={{
                              duration: 3,
                              repeat: Infinity,
                              ease: "linear",
                            }}
                            className="h-full w-32 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Stats Section */}
      <section className="py-16 -mt-8 relative z-10">
        <div className="container mx-auto px-4">
          <motion.div
            ref={ref}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            variants={stagger}
            className="grid grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ y: -5 }}
                className="bg-white rounded-2xl shadow-xl p-6 text-center group hover:shadow-2xl transition-all duration-300"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {inView && <CountUp end={stat.value} duration={2} />}
                  <span className="text-indigo-600">{stat.suffix || '+'}</span>
                </div>
                <p className="text-gray-600">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
              {t.featuresTitle} <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">{t.featuresHighlight}</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t.featuresSubtitle}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="group"
              >
                <Link href={feature.href}>
                  <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 h-full border border-gray-100 relative overflow-hidden">
                    <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${feature.color} opacity-10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500`} />
                    
                    <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                      <feature.icon className="w-8 h-8 text-white" />
                    </div>
                    
                    <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-indigo-600 transition-colors">
                      {feature.title}
                    </h3>
                    
                    <p className="text-gray-600 leading-relaxed mb-6">
                      {feature.description}
                    </p>
                    
                    <div className="flex items-center text-indigo-600 font-medium group-hover:translate-x-2 transition-transform">
                      <span>Pelajari lebih lanjut</span>
                      <ArrowRightIcon className="w-4 h-4 ml-2" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
              {t.benefitsTitle} <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">{t.benefitsHighlight}</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t.benefitsSubtitle}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="text-center"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className={`w-20 h-20 bg-gradient-to-br ${benefit.color} rounded-2xl flex items-center justify-center mx-auto mb-6`}
                >
                  <benefit.icon className="w-10 h-10 text-white" />
                </motion.div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-20 bg-gradient-to-br from-indigo-900 to-purple-900 text-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-6xl font-bold mb-6">
              {t.trustedTitle}
            </h2>
            <p className="text-xl text-indigo-200 max-w-3xl mx-auto">
              {t.trustedSubtitle}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { rating: 4.9, reviews: 1234, company: "TechCorp" },
              { rating: 5.0, reviews: 856, company: "StartupXYZ" },
              { rating: 4.8, reviews: 2341, company: "Enterprise Ltd" },
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 text-center"
              >
                <div className="flex justify-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon key={i} className="w-6 h-6 text-yellow-400 fill-current" />
                  ))}
                </div>
                <div className="text-3xl font-bold mb-2">{testimonial.rating}</div>
                <div className="text-indigo-200 mb-4">{testimonial.reviews} {t.reviews}</div>
                <div className="font-semibold">{testimonial.company}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-12 text-center text-white shadow-2xl relative overflow-hidden"
          >
            <div className="absolute inset-0 opacity-10">
              <motion.div
                animate={{
                  scale: [1, 1.5, 1],
                  rotate: [0, 180, 360],
                }}
                transition={{
                  duration: 30,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="absolute -top-20 -right-20 w-80 h-80 bg-cyan-400 rounded-full"
              />
            </div>
            
            <div className="relative">
              <h2 className="text-4xl lg:text-6xl font-bold mb-6">
                {t.readyTitle}
              </h2>
              <p className="text-xl text-purple-100 mb-8 max-w-3xl mx-auto">
                {t.readySubtitle}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/onboarding">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-10 py-5 bg-white text-indigo-700 font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-3"
                  >
                    <RocketLaunchIcon className="w-6 h-6" />
                    {t.startTrial}
                  </motion.button>
                </Link>
                <Link href="/demo">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-10 py-5 bg-white/10 backdrop-blur-sm text-white font-bold rounded-xl border-2 border-white/20 hover:bg-white/20 transition-all duration-300"
                  >
                    {t.scheduleDemo}
                  </motion.button>
                </Link>
              </div>

              <div className="mt-8 text-purple-200 text-sm">
                {t.noCredit}
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      <SaasFooter />
    </div>
  );
}