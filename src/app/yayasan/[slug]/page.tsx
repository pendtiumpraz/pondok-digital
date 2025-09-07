import { redirect } from 'next/navigation'

export default function TenantPage({
  params
}: {
  params: { slug: string }
}) {
  // Redirect to yayasan dashboard
  redirect(`/yayasan/${params.slug}/dashboard`)
}