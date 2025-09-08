'use client';

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { motion } from 'framer-motion';
import {
  HomeIcon,
  BuildingOfficeIcon,
  UsersIcon,
  BanknotesIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  DocumentTextIcon,
  ShieldCheckIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  BellIcon,
  CreditCardIcon,
  ServerStackIcon,
  ExclamationTriangleIcon,
  ClipboardDocumentListIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const menuItems = [
  {
    title: 'Dashboard',
    href: '/super-admin',
    icon: HomeIcon,
  },
  {
    title: 'Tenants',
    href: '/super-admin/tenants',
    icon: BuildingOfficeIcon,
  },
  {
    title: 'Users',
    href: '/super-admin/users',
    icon: UsersIcon,
  },
  {
    title: 'Subscriptions',
    href: '/super-admin/subscriptions',
    icon: CreditCardIcon,
  },
  {
    title: 'Revenue',
    href: '/super-admin/revenue',
    icon: BanknotesIcon,
  },
  {
    title: 'Reports',
    href: '/super-admin/reports',
    icon: ChartBarIcon,
  },
  {
    title: 'Audit Logs',
    href: '/super-admin/audit',
    icon: ClipboardDocumentListIcon,
  },
  {
    title: 'System Health',
    href: '/super-admin/health',
    icon: ServerStackIcon,
  },
  {
    title: 'Settings',
    href: '/super-admin/settings',
    icon: Cog6ToothIcon,
  },
];

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({ redirect: true, callbackUrl: '/auth/admin-signin' });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: sidebarOpen ? 0 : -300 }}
        transition={{ duration: 0.3 }}
        className={`fixed lg:relative z-40 h-screen bg-gradient-to-b from-indigo-900 via-indigo-800 to-purple-900 text-white transition-all duration-300 ${
          sidebarOpen ? 'w-64' : 'w-0'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-indigo-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <ShieldCheckIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Super Admin</h2>
                <p className="text-xs text-indigo-200">System Control</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 overflow-y-auto">
            <ul className="space-y-2">
              {menuItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                        isActive
                          ? 'bg-white/20 text-white shadow-lg'
                          : 'text-indigo-100 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                      <span className="font-medium">{item.title}</span>
                      {item.title === 'Tenants' && (
                        <span className="ml-auto bg-white/20 text-xs px-2 py-1 rounded-full">
                          12
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Bottom Section */}
          <div className="p-4 border-t border-indigo-700">
            <div className="bg-yellow-500/20 rounded-lg p-3 mb-4">
              <div className="flex items-start gap-2">
                <ExclamationTriangleIcon className="w-5 h-5 text-yellow-300 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-yellow-100">System Alert</p>
                  <p className="text-xs text-yellow-200 mt-1">
                    3 tenants need attention
                  </p>
                </div>
              </div>
            </div>
            
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-red-200 hover:bg-red-500/20 hover:text-red-100 rounded-lg transition-all"
            >
              <ArrowRightOnRectangleIcon className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </motion.aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b sticky top-0 z-20">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  {sidebarOpen ? (
                    <XMarkIcon className="w-6 h-6 text-gray-600" />
                  ) : (
                    <Bars3Icon className="w-6 h-6 text-gray-600" />
                  )}
                </button>
                
                <div>
                  <h1 className="text-xl font-bold text-gray-900">
                    {pathname === '/super-admin' ? 'Dashboard Overview' :
                     pathname === '/super-admin/tenants' ? 'Tenant Management' :
                     pathname === '/super-admin/users' ? 'User Management' :
                     pathname === '/super-admin/subscriptions' ? 'Subscriptions' :
                     pathname === '/super-admin/revenue' ? 'Revenue Analytics' :
                     pathname === '/super-admin/reports' ? 'System Reports' :
                     pathname === '/super-admin/health' ? 'System Health' :
                     pathname === '/super-admin/settings' ? 'Settings' :
                     'Super Admin Panel'}
                  </h1>
                  <p className="text-sm text-gray-500">
                    Manage all tenants and system operations
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* Notifications */}
                <Button variant="outline" size="icon" className="relative">
                  <BellIcon className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    3
                  </span>
                </Button>

                {/* User Profile */}
                <div className="flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">SA</span>
                  </div>
                  <div className="hidden md:block">
                    <p className="text-sm font-medium text-gray-900">Super Admin</p>
                    <p className="text-xs text-gray-500">System Administrator</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}