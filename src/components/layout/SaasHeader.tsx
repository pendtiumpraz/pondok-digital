'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { Menu, X, Globe } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

export default function SaasHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { language, setLanguage } = useLanguage()

  const translations = {
    id: {
      menu: [
        { label: 'Beranda', href: '/' },
        { label: 'Fitur', href: '/features' },
        { label: 'Harga', href: '/pricing' },
        { label: 'Demo', href: '/yayasan/imam-syafii', target: '_blank' },
        { label: 'Kontak', href: '/contact' },
      ],
      loginAdmin: 'Masuk Admin',
      registerYayasan: 'Daftar Yayasan',
      languageLabel: 'EN'
    },
    en: {
      menu: [
        { label: 'Home', href: '/' },
        { label: 'Features', href: '/features' },
        { label: 'Pricing', href: '/pricing' },
        { label: 'Demo', href: '/yayasan/imam-syafii', target: '_blank' },
        { label: 'Contact', href: '/contact' },
      ],
      loginAdmin: 'Admin Login',
      registerYayasan: 'Register Foundation',
      languageLabel: 'ID'
    }
  }

  const currentLang = translations[language]
  const menuItems = currentLang.menu

  const toggleLanguage = () => {
    setLanguage(language === 'id' ? 'en' : 'id')
  }

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center text-white font-bold">
              PD
            </div>
            <span className="font-bold text-xl">Pondok Digital</span>
          </Link>

          {/* Desktop Menu */}
          <nav className="hidden md:flex items-center space-x-8">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                target={item.target}
                rel={item.target === '_blank' ? 'noopener noreferrer' : undefined}
                className="text-gray-600 hover:text-green-600 transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* CTA Buttons and Language Toggle */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={toggleLanguage}
              className="flex items-center space-x-1 px-3 py-2 text-gray-600 hover:text-green-600 transition-colors"
              title={language === 'id' ? 'Switch to English' : 'Ganti ke Bahasa Indonesia'}
            >
              <Globe className="w-4 h-4" />
              <span className="text-sm font-medium">{currentLang.languageLabel}</span>
            </button>
            <Button variant="outline" asChild>
              <Link href="/auth/admin-signin">{currentLang.loginAdmin}</Link>
            </Button>
            <Button asChild>
              <Link href="/onboarding">{currentLang.registerYayasan}</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-4 border-t">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                target={item.target}
                rel={item.target === '_blank' ? 'noopener noreferrer' : undefined}
                className="block py-2 text-gray-600 hover:text-green-600"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-4 border-t mt-4 space-y-2">
              <button
                onClick={toggleLanguage}
                className="flex items-center justify-center space-x-2 w-full py-2 text-gray-600 hover:text-green-600"
              >
                <Globe className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {language === 'id' ? 'English' : 'Bahasa Indonesia'}
                </span>
              </button>
              <Button variant="outline" asChild className="w-full">
                <Link href="/auth/admin-signin">{currentLang.loginAdmin}</Link>
              </Button>
              <Button asChild className="w-full">
                <Link href="/onboarding">{currentLang.registerYayasan}</Link>
              </Button>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}