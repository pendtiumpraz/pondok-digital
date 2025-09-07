import { ReactNode } from 'react'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import AuthenticatedLayout from '@/components/layout/AuthenticatedLayout'

export default async function YayasanAuthenticatedLayout({
  children,
  params
}: {
  children: ReactNode
  params: { slug: string }
}) {
  // Check authentication
  const session = await getServerSession()
  
  if (!session) {
    redirect(`/yayasan/${params.slug}/auth/signin`)
  }

  // TODO: Check if user belongs to this yayasan
  // const userBelongsToYayasan = await checkUserYayasan(session.user.id, params.slug)
  // if (!userBelongsToYayasan) {
  //   redirect(`/yayasan/${params.slug}`)
  // }

  return (
    <AuthenticatedLayout tenantSlug={params.slug}>
      {children}
    </AuthenticatedLayout>
  )
}