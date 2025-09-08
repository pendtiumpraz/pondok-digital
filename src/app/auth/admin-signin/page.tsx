'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Shield, AlertCircle } from 'lucide-react'
import SaasHeader from '@/components/layout/SaasHeader'
import SaasFooter from '@/components/layout/SaasFooter'

export default function AdminSignInPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const result = await signIn('credentials', {
        username,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError('Username atau password salah')
      } else {
        // Check if we have user session to determine redirect
        const response = await fetch('/api/auth/session')
        const session = await response.json()
        
        if (session?.user?.role === 'SUPER_ADMIN') {
          router.push('/super-admin')
        } else if (session?.user?.role === 'ADMIN') {
          // Admin should go to their yayasan dashboard
          router.push('/yayasan/imam-syafii/dashboard')
        } else {
          // Staff or other roles go to default dashboard
          router.push('/dashboard')
        }
      }
    } catch (error) {
      setError('Terjadi kesalahan. Silakan coba lagi.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <SaasHeader />
      <div className="flex-grow flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-green-50 py-12">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl">Login Admin Yayasan</CardTitle>
            <CardDescription>
              Khusus untuk Admin Yayasan dan Super Admin Platform
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
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Masukkan username (admin/superadmin)"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
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
                <Link href="/auth/forgot-password" className="text-green-600 hover:underline">
                  Lupa password?
                </Link>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Masuk...' : 'Masuk sebagai Admin'}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t text-center text-sm text-gray-600">
              <p>Bukan admin yayasan?</p>
              <p className="mt-2">
                Silakan login melalui halaman yayasan Anda
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
      <SaasFooter />
    </div>
  )
}