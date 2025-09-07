'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Menu } from 'lucide-react'
import { useState } from 'react'

interface TenantHeaderProps {
  tenantName: string
}

export default function TenantHeader({ tenantName }: TenantHeaderProps) {
  const params = useParams()
  const slug = params.slug as string
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const menuItems = [
    { label: 'Beranda', href: `/yayasan/${slug}` },
    { label: 'Tentang', href: `/yayasan/${slug}/about` },
    { label: 'PPDB', href: `/yayasan/${slug}/ppdb` },
    { label: 'Galeri', href: `/yayasan/${slug}/gallery` },
    { label: 'Kajian', href: `/yayasan/${slug}/kajian` },
    { label: 'Perpustakaan', href: `/yayasan/${slug}/library` },
    { label: 'Donasi', href: `/yayasan/${slug}/donasi` },
    { label: 'Kegiatan', href: `/yayasan/${slug}/kegiatan` },
  ]

  return (
    <header className="bg-green-700 text-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Name */}
          <div className="flex items-center space-x-4">
            <Link href={`/yayasan/${slug}`} className="font-bold text-xl">
              {tenantName}
            </Link>
          </div>

          {/* Desktop Menu */}
          <nav className="hidden md:flex space-x-6">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="hover:text-green-200 transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Login Button */}
          <div className="hidden md:block">
            <Button variant="secondary" size="sm" asChild>
              <Link href={`/yayasan/${slug}/auth/signin`}>Masuk</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-4 border-t border-green-600">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block py-2 hover:text-green-200 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-4 border-t border-green-600 mt-4">
              <Button variant="secondary" size="sm" asChild className="w-full">
                <Link href={`/yayasan/${slug}/auth/signin`}>Masuk</Link>
              </Button>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}