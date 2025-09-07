'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

export default function SaasHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const menuItems = [
    { label: 'Beranda', href: '/' },
    { label: 'Fitur', href: '#features' },
    { label: 'Harga', href: '/pricing' },
    { label: 'Demo', href: '/yayasan/imam-syafii' },
    { label: 'Kontak', href: '#contact' },
  ]

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
                className="text-gray-600 hover:text-green-600 transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="outline" asChild>
              <Link href="/auth/admin-signin">Login Admin</Link>
            </Button>
            <Button asChild>
              <Link href="/auth/register-yayasan">Daftar Yayasan</Link>
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
                className="block py-2 text-gray-600 hover:text-green-600"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-4 border-t mt-4 space-y-2">
              <Button variant="outline" asChild className="w-full">
                <Link href="/auth/admin-signin">Login Admin</Link>
              </Button>
              <Button asChild className="w-full">
                <Link href="/auth/register-yayasan">Daftar Yayasan</Link>
              </Button>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}