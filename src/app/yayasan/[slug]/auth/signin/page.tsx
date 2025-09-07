'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { User, AlertCircle } from 'lucide-react'
import TenantHeader from '@/components/tenant/TenantHeader'
import TenantFooter from '@/components/tenant/TenantFooter'

export default function YayasanSignInPage() {
  const params = useParams()
  const slug = params.slug as string
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const tenantName = slug === 'imam-syafii' 
    ? 'Pondok Pesantren Imam Syafii Blitar'
    : slug

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const result = await signIn('credentials', {
        email,
        password,
        tenantSlug: slug, // Pass tenant context
        redirect: false,
      })

      if (result?.error) {
        setError('Email atau password salah')
      } else {
        // Redirect to tenant dashboard based on user role
        router.push(`/yayasan/${slug}/dashboard`)
      }
    } catch (error) {
      setError('Terjadi kesalahan. Silakan coba lagi.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <TenantHeader />
      <div className="flex-grow flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-green-50 py-12">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl">Masuk</CardTitle>
            <CardDescription>
              {tenantName}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm">{error}</span>
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email">Email / Username</Label>
                <Input
                  id="email"
                  type="text"
                  placeholder="user@example.com atau username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span>Ingat saya</span>
                </label>
                <a href="#" className="text-green-600 hover:underline">
                  Lupa password?
                </a>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Masuk...' : 'Masuk'}
              </Button>
            </form>

            <div className="mt-6 space-y-3">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Atau masuk sebagai</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center">
                <Button variant="outline" size="sm" className="text-xs">
                  Siswa
                </Button>
                <Button variant="outline" size="sm" className="text-xs">
                  Guru
                </Button>
                <Button variant="outline" size="sm" className="text-xs">
                  Orang Tua
                </Button>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t text-center text-sm text-gray-600">
              <p>Admin yayasan?</p>
              <a href="/auth/admin-signin" className="text-green-600 hover:underline">
                Login sebagai Admin
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
      <TenantFooter />
    </div>
  )
}