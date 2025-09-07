// Force dynamic rendering to prevent static generation issues
export const dynamic = 'force-dynamic'

import DonatePageClient from './DonatePageClient'

interface DonatePageProps {}

export default function DonatePage({}: DonatePageProps) {
  return <DonatePageClient />
}