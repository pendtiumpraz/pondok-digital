'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'

type Language = 'id' | 'en'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const translations = {
  id: {
    // Hero Section
    'hero.title': 'Platform Digital untuk Pesantren Modern',
    'hero.subtitle': 'Kelola pesantren, sekolah Islam, dan yayasan Anda dengan sistem terintegrasi yang mudah digunakan',
    'hero.cta.demo': 'Lihat Demo',
    'hero.cta.register': 'Daftar Sekarang',
    'hero.stats.yayasan': 'Yayasan Terdaftar',
    'hero.stats.santri': 'Santri Terkelola',
    'hero.stats.guru': 'Guru & Ustadz',
    'hero.stats.uptime': 'Uptime',
    
    // Features Section
    'features.title': 'Fitur Lengkap untuk Manajemen Pesantren',
    'features.subtitle': 'Semua yang Anda butuhkan dalam satu platform',
    'features.academic.title': 'Manajemen Akademik',
    'features.academic.desc': 'Kelola kurikulum, jadwal, nilai, dan rapor digital dengan mudah',
    'features.finance.title': 'Manajemen Keuangan',
    'features.finance.desc': 'Transparansi keuangan dengan pembukuan otomatis dan laporan real-time',
    'features.student.title': 'Manajemen Santri',
    'features.student.desc': 'Database lengkap santri, absensi, dan monitoring perkembangan',
    'features.hr.title': 'Manajemen SDM',
    'features.hr.desc': 'Kelola data guru, ustadz, dan karyawan dengan sistem HR modern',
    'features.donation.title': 'Sistem Donasi Online',
    'features.donation.desc': 'Terima donasi online dengan payment gateway terintegrasi',
    'features.report.title': 'Laporan & Analitik',
    'features.report.desc': 'Dashboard analitik untuk monitoring kinerja yayasan',
    
    // Pricing Section
    'pricing.title': 'Pilih Paket yang Sesuai',
    'pricing.subtitle': 'Harga terjangkau untuk semua ukuran pesantren',
    'pricing.monthly': '/bulan',
    'pricing.yearly': '/tahun',
    'pricing.save': 'Hemat 20%',
    'pricing.starter.name': 'Starter',
    'pricing.starter.desc': 'Untuk pesantren kecil',
    'pricing.starter.students': 'Hingga 100 santri',
    'pricing.professional.name': 'Professional',
    'pricing.professional.desc': 'Untuk pesantren menengah',
    'pricing.professional.students': 'Hingga 500 santri',
    'pricing.enterprise.name': 'Enterprise',
    'pricing.enterprise.desc': 'Untuk pesantren besar',
    'pricing.enterprise.students': 'Santri tak terbatas',
    'pricing.cta': 'Mulai Gratis',
    'pricing.contact': 'Hubungi Kami',
    
    // CTA Section
    'cta.title': 'Siap Modernisasi Pesantren Anda?',
    'cta.subtitle': 'Bergabung dengan ratusan pesantren yang telah bertransformasi digital',
    'cta.button': 'Mulai Uji Coba Gratis',
    
    // Footer
    'footer.about': 'Tentang Kami',
    'footer.about.desc': 'Platform manajemen pesantren terpadu untuk era digital',
    'footer.product': 'Produk',
    'footer.features': 'Fitur',
    'footer.pricing': 'Harga',
    'footer.demo': 'Demo',
    'footer.support': 'Dukungan',
    'footer.docs': 'Dokumentasi',
    'footer.help': 'Bantuan',
    'footer.contact': 'Kontak',
    'footer.company': 'Perusahaan',
    'footer.about.link': 'Tentang',
    'footer.blog': 'Blog',
    'footer.careers': 'Karir',
    'footer.rights': 'Hak Cipta',
  },
  en: {
    // Hero Section
    'hero.title': 'Digital Platform for Modern Islamic Schools',
    'hero.subtitle': 'Manage your pesantren, Islamic schools, and foundation with an integrated, easy-to-use system',
    'hero.cta.demo': 'View Demo',
    'hero.cta.register': 'Register Now',
    'hero.stats.yayasan': 'Registered Foundations',
    'hero.stats.santri': 'Managed Students',
    'hero.stats.guru': 'Teachers & Ustadz',
    'hero.stats.uptime': 'Uptime',
    
    // Features Section
    'features.title': 'Complete Features for Pesantren Management',
    'features.subtitle': 'Everything you need in one platform',
    'features.academic.title': 'Academic Management',
    'features.academic.desc': 'Easily manage curriculum, schedules, grades, and digital report cards',
    'features.finance.title': 'Financial Management',
    'features.finance.desc': 'Financial transparency with automatic bookkeeping and real-time reports',
    'features.student.title': 'Student Management',
    'features.student.desc': 'Complete student database, attendance, and progress monitoring',
    'features.hr.title': 'HR Management',
    'features.hr.desc': 'Manage teacher, ustadz, and staff data with modern HR system',
    'features.donation.title': 'Online Donation System',
    'features.donation.desc': 'Receive online donations with integrated payment gateway',
    'features.report.title': 'Reports & Analytics',
    'features.report.desc': 'Analytics dashboard for monitoring foundation performance',
    
    // Pricing Section
    'pricing.title': 'Choose the Right Plan',
    'pricing.subtitle': 'Affordable pricing for all pesantren sizes',
    'pricing.monthly': '/month',
    'pricing.yearly': '/year',
    'pricing.save': 'Save 20%',
    'pricing.starter.name': 'Starter',
    'pricing.starter.desc': 'For small pesantren',
    'pricing.starter.students': 'Up to 100 students',
    'pricing.professional.name': 'Professional',
    'pricing.professional.desc': 'For medium pesantren',
    'pricing.professional.students': 'Up to 500 students',
    'pricing.enterprise.name': 'Enterprise',
    'pricing.enterprise.desc': 'For large pesantren',
    'pricing.enterprise.students': 'Unlimited students',
    'pricing.cta': 'Start Free',
    'pricing.contact': 'Contact Us',
    
    // CTA Section
    'cta.title': 'Ready to Modernize Your Pesantren?',
    'cta.subtitle': 'Join hundreds of pesantren that have digitally transformed',
    'cta.button': 'Start Free Trial',
    
    // Footer
    'footer.about': 'About Us',
    'footer.about.desc': 'Integrated pesantren management platform for the digital era',
    'footer.product': 'Product',
    'footer.features': 'Features',
    'footer.pricing': 'Pricing',
    'footer.demo': 'Demo',
    'footer.support': 'Support',
    'footer.docs': 'Documentation',
    'footer.help': 'Help',
    'footer.contact': 'Contact',
    'footer.company': 'Company',
    'footer.about.link': 'About',
    'footer.blog': 'Blog',
    'footer.careers': 'Careers',
    'footer.rights': 'All rights reserved',
  }
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('id')
  
  const t = (key: string): string => {
    return (translations[language] as any)[key] || key
  }
  
  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}