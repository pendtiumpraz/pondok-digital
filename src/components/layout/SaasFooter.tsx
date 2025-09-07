'use client'

import Link from 'next/link'

export default function SaasFooter() {
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
              Platform SAAS untuk manajemen yayasan pendidikan Islam di Indonesia.
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Produk</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="#features" className="hover:text-white">
                  Fitur
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-white">
                  Harga
                </Link>
              </li>
              <li>
                <Link href="/yayasan/imam-syafii" className="hover:text-white">
                  Demo
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white">
                  API Docs
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Perusahaan</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="#" className="hover:text-white">
                  Tentang Kami
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white">
                  Karir
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white">
                  Partner
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Bantuan</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="#" className="hover:text-white">
                  Pusat Bantuan
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white">
                  Dokumentasi
                </Link>
              </li>
              <li>
                <Link href="#contact" className="hover:text-white">
                  Kontak
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white">
                  Status Server
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; 2024 Pondok Digital. All rights reserved.</p>
          <div className="mt-2 space-x-4">
            <Link href="#" className="hover:text-white">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-white">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}