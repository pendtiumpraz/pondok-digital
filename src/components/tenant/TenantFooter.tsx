'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'

interface TenantFooterProps {
  tenantName: string
}

export default function TenantFooter({ tenantName }: TenantFooterProps) {
  const params = useParams()
  const slug = params.slug as string

  return (
    <footer className="bg-gray-800 text-white mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="font-bold text-lg mb-4">{tenantName}</h3>
            <p className="text-sm text-gray-300">
              Lembaga pendidikan Islam yang berkomitmen membentuk generasi 
              berakhlak mulia dan berprestasi.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-4">Menu Cepat</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href={`/yayasan/${slug}/about`} className="text-gray-300 hover:text-white">
                  Tentang Kami
                </Link>
              </li>
              <li>
                <Link href={`/yayasan/${slug}/ppdb`} className="text-gray-300 hover:text-white">
                  PPDB Online
                </Link>
              </li>
              <li>
                <Link href={`/yayasan/${slug}/kegiatan`} className="text-gray-300 hover:text-white">
                  Kegiatan
                </Link>
              </li>
              <li>
                <Link href={`/yayasan/${slug}/donasi`} className="text-gray-300 hover:text-white">
                  Donasi
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-lg mb-4">Kontak</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>📍 Jl. Contoh No. 123</li>
              <li>📞 (0342) 123456</li>
              <li>✉️ info@{slug}.sch.id</li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="font-bold text-lg mb-4">Media Sosial</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white">
                Facebook
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                Instagram
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                YouTube
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; 2024 {tenantName}. All rights reserved.</p>
          <p className="mt-2">
            Powered by{' '}
            <Link href="/" className="text-green-400 hover:text-green-300">
              Pondok Digital
            </Link>
          </p>
        </div>
      </div>
    </footer>
  )
}