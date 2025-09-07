import { ReactNode } from 'react'
import TenantHeader from '@/components/tenant/TenantHeader'
import TenantFooter from '@/components/tenant/TenantFooter'

export default function TenantLayout({
  children,
  params
}: {
  children: ReactNode
  params: { slug: string }
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <TenantHeader />
      <main className="flex-grow">
        {children}
      </main>
      <TenantFooter />
    </div>
  )
}