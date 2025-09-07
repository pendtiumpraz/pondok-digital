'use client'

import { SessionProvider } from 'next-auth/react'
import { OfflineProvider } from '@/components/offline-provider'
import { PWAProvider } from '@/components/pwa/pwa-provider'
import { LanguageProvider } from '@/contexts/LanguageContext'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <LanguageProvider>
        <PWAProvider>
          <OfflineProvider>
            {children}
          </OfflineProvider>
        </PWAProvider>
      </LanguageProvider>
    </SessionProvider>
  )
}