'use client'

import { ReactNode, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  DollarSign,
  Receipt,
  UserCheck,
  Settings,
  Calendar,
  Heart,
  Menu,
  X,
  LogOut,
  ChevronDown,
  Building,
  Home
} from 'lucide-react'

interface AuthenticatedLayoutProps {
  children: ReactNode
  tenantSlug?: string
}

export default function AuthenticatedLayout({ children, tenantSlug = 'imam-syafii' }: AuthenticatedLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null)
  const pathname = usePathname()

  const menuItems = [
    {
      title: 'Dashboard',
      href: `/yayasan/${tenantSlug}/(authenticated)/dashboard`,
      icon: LayoutDashboard,
    },
    {
      title: 'Akademik',
      icon: GraduationCap,
      subItems: [
        {
          title: 'Data Siswa',
          href: `/yayasan/${tenantSlug}/(authenticated)/siswa`,
          icon: Users,
        },
        {
          title: 'Manajemen Akademik',
          href: `/yayasan/${tenantSlug}/(authenticated)/akademik`,
          icon: BookOpen,
        },
        {
          title: 'Hafalan',
          href: `/yayasan/${tenantSlug}/(authenticated)/hafalan`,
          icon: BookOpen,
        },
        {
          title: 'Data Alumni',
          href: `/yayasan/${tenantSlug}/(authenticated)/alumni`,
          icon: UserCheck,
        },
      ],
    },
    {
      title: 'Keuangan',
      icon: DollarSign,
      subItems: [
        {
          title: 'Manajemen Keuangan',
          href: `/yayasan/${tenantSlug}/(authenticated)/keuangan`,
          icon: DollarSign,
        },
        {
          title: 'SPP & Billing',
          href: `/yayasan/${tenantSlug}/(authenticated)/spp`,
          icon: Receipt,
        },
      ],
    },
    {
      title: 'Administrasi',
      icon: Building,
      subItems: [
        {
          title: 'Data Pengajar',
          href: `/yayasan/${tenantSlug}/(authenticated)/pengajar`,
          icon: Users,
        },
        {
          title: 'Kegiatan',
          href: `/yayasan/${tenantSlug}/(authenticated)/kegiatan`,
          icon: Calendar,
        },
        {
          title: 'PPDB Admin',
          href: `/yayasan/${tenantSlug}/(authenticated)/ppdb-admin`,
          icon: UserCheck,
        },
        {
          title: 'Donasi Admin',
          href: `/yayasan/${tenantSlug}/(authenticated)/donasi-admin`,
          icon: Heart,
        },
      ],
    },
    {
      title: 'Pengaturan',
      href: `/yayasan/${tenantSlug}/(authenticated)/settings`,
      icon: Settings,
    },
  ]

  const isActiveRoute = (href: string) => {
    return pathname === href
  }

  const toggleSubmenu = (title: string) => {
    setExpandedMenu(expandedMenu === title ? null : title)
  }

  const handleSignOut = async () => {
    await signOut({ callbackUrl: `/yayasan/${tenantSlug}` })
  }

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 text-white transform transition-transform duration-200 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:inset-0
      `}>
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-800">
          <Link href={`/yayasan/${tenantSlug}`} className="flex items-center space-x-2">
            <Home className="w-6 h-6" />
            <span className="font-bold">Yayasan Portal</span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4">
          {menuItems.map((item) => (
            <div key={item.title}>
              {item.subItems ? (
                <div>
                  <button
                    onClick={() => toggleSubmenu(item.title)}
                    className="w-full flex items-center justify-between px-4 py-2 text-sm hover:bg-gray-800 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <item.icon className="w-5 h-5" />
                      <span>{item.title}</span>
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${
                        expandedMenu === item.title ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {expandedMenu === item.title && (
                    <div className="bg-gray-800">
                      {item.subItems.map((subItem) => (
                        <Link
                          key={subItem.href}
                          href={subItem.href}
                          className={`
                            flex items-center space-x-3 px-8 py-2 text-sm transition-colors
                            ${isActiveRoute(subItem.href)
                              ? 'bg-green-600 text-white'
                              : 'hover:bg-gray-700'
                            }
                          `}
                          onClick={() => setSidebarOpen(false)}
                        >
                          <subItem.icon className="w-4 h-4" />
                          <span>{subItem.title}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href={item.href!}
                  className={`
                    flex items-center space-x-3 px-4 py-2 text-sm transition-colors
                    ${isActiveRoute(item.href!)
                      ? 'bg-green-600 text-white'
                      : 'hover:bg-gray-800'
                    }
                  `}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.title}</span>
                </Link>
              )}
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-800">
          <Button
            variant="ghost"
            className="w-full justify-start text-white hover:bg-gray-800"
            onClick={handleSignOut}
          >
            <LogOut className="w-5 h-5 mr-3" />
            Keluar
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="bg-white shadow-sm h-16 flex items-center px-4 lg:px-8">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex-1 flex items-center justify-between ml-4 lg:ml-0">
            <h1 className="text-xl font-semibold text-gray-800">
              Portal Administrasi
            </h1>
            <div className="flex items-center space-x-4">
              {/* User info */}
              <div className="text-sm text-gray-600">
                <span>Admin</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-8 bg-gray-50">
          {children}
        </main>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  )
}