'use client'

import { useParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, GraduationCap, DollarSign, BookOpen } from 'lucide-react'

export default function TenantDashboard() {
  const params = useParams()
  const tenantSlug = params.slug as string

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">
        Dashboard - {tenantSlug === 'imam-syafii' ? 'Pondok Imam Syafii' : tenantSlug}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Total Santri
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">250</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5" />
              Total Guru
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">35</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              SPP Terbayar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">85%</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Hafalan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">15 Juz</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}