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
  // TODO: Fetch tenant data based on slug
  const tenantName = params.slug === 'imam-syafii' 
    ? 'Pondok Pesantren Imam Syafii Blitar'
    : params.slug

  return (
    <div className="min-h-screen flex flex-col">
      <TenantHeader tenantName={tenantName} />
      <main className="flex-grow">
        {children}
      </main>
      <TenantFooter tenantName={tenantName} />
    </div>
  )
}