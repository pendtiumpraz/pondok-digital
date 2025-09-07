'use client'

import Link from 'next/link'
import { useLanguage } from '@/contexts/LanguageContext'

export default function SaasFooter() {
  const { language } = useLanguage()

  const translations = {
    id: {
      description: 'Platform SAAS untuk manajemen yayasan pendidikan Islam di Indonesia.',
      product: 'Produk',
      features: 'Fitur',
      pricing: 'Harga',
      demo: 'Demo',
      apiDocs: 'Dokumentasi API',
      company: 'Perusahaan',
      about: 'Tentang Kami',
      blog: 'Blog',
      careers: 'Karir',
      partners: 'Partner',
      support: 'Bantuan',
      helpCenter: 'Pusat Bantuan',
      documentation: 'Dokumentasi',
      contact: 'Kontak',
      serverStatus: 'Status Server',
      allRights: 'Hak Cipta',
      privacy: 'Kebijakan Privasi',
      terms: 'Syarat Layanan'
    },
    en: {
      description: 'SAAS platform for Islamic educational foundation management in Indonesia.',
      product: 'Product',
      features: 'Features',
      pricing: 'Pricing',
      demo: 'Demo',
      apiDocs: 'API Documentation',
      company: 'Company',
      about: 'About Us',
      blog: 'Blog',
      careers: 'Careers',
      partners: 'Partners',
      support: 'Support',
      helpCenter: 'Help Center',
      documentation: 'Documentation',
      contact: 'Contact',
      serverStatus: 'Server Status',
      allRights: 'All rights reserved',
      privacy: 'Privacy Policy',
      terms: 'Terms of Service'
    }
  }

  const t = translations[language]

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Company */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center text-white font-bold">
                PD
              </div>
              <span className="font-bold text-xl">Pondok Digital</span>
            </div>
            <p className="text-sm text-gray-400">
              {t.description}
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="font-semibold text-lg mb-4">{t.product}</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="/features" className="hover:text-white">
                  {t.features}
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-white">
                  {t.pricing}
                </Link>
              </li>
              <li>
                <Link href="/yayasan/imam-syafii" target="_blank" rel="noopener noreferrer" className="hover:text-white">
                  {t.demo}
                </Link>
              </li>
              <li>
                <Link href="/api-docs" className="hover:text-white">
                  {t.apiDocs}
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-lg mb-4">{t.company}</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="/about" className="hover:text-white">
                  {t.about}
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-white">
                  {t.blog}
                </Link>
              </li>
              <li>
                <Link href="/careers" className="hover:text-white">
                  {t.careers}
                </Link>
              </li>
              <li>
                <Link href="/partners" className="hover:text-white">
                  {t.partners}
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold text-lg mb-4">{t.support}</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="/help" className="hover:text-white">
                  {t.helpCenter}
                </Link>
              </li>
              <li>
                <Link href="/docs" className="hover:text-white">
                  {t.documentation}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white">
                  {t.contact}
                </Link>
              </li>
              <li>
                <Link href="/status" className="hover:text-white">
                  {t.serverStatus}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; 2024 Pondok Digital. {t.allRights}.</p>
          <div className="mt-2 space-x-4">
            <Link href="/privacy" className="hover:text-white">
              {t.privacy}
            </Link>
            <Link href="/terms" className="hover:text-white">
              {t.terms}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}