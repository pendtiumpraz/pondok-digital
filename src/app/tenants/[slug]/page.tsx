import { redirect } from 'next/navigation'

export default function TenantPage({
  params
}: {
  params: { slug: string }
}) {
  // Redirect to tenant dashboard
  redirect(`/tenants/${params.slug}/dashboard`)
}