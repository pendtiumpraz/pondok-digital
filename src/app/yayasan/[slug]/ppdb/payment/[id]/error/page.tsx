'use client'

import { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { XCircleIcon } from '@heroicons/react/24/outline'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function PaymentErrorPage() {
  const params = useParams()
  const router = useRouter()
  const paymentId = params.id as string

  useEffect(() => {
    // Redirect to main payment page after 5 seconds
    const timeout = setTimeout(() => {
      router.replace(`/ppdb/payment/${paymentId}`)
    }, 5000)

    return () => clearTimeout(timeout)
  }, [paymentId, router])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
      <div className="max-w-md mx-auto px-4">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-8 text-center">
            <XCircleIcon className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-red-800 mb-2">
              Payment Error
            </h1>
            <p className="text-red-700 mb-6">
              There was an error processing your payment. This could be due to network issues, payment gateway problems, or other technical difficulties.
            </p>
            <div className="space-y-3">
              <Button 
                onClick={() => router.replace(`/ppdb/payment/${paymentId}`)}
                className="w-full"
              >
                Try Again
              </Button>
              <Button 
                variant="outline" 
                onClick={() => router.push('/ppdb/register')}
                className="w-full"
              >
                Back to Registration
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => window.location.href = 'mailto:info@pondokimamsyafii.com'}
                className="w-full text-sm"
              >
                Contact Support
              </Button>
            </div>
            <p className="text-sm text-gray-600 mt-4">
              Redirecting to payment page in 5 seconds...
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}