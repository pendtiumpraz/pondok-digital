'use client'

import { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ClockIcon } from '@heroicons/react/24/outline'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function PaymentPendingPage() {
  const params = useParams()
  const router = useRouter()
  const paymentId = params.id as string

  useEffect(() => {
    // Redirect to main payment page after 3 seconds
    const timeout = setTimeout(() => {
      router.replace(`/ppdb/payment/${paymentId}`)
    }, 3000)

    return () => clearTimeout(timeout)
  }, [paymentId, router])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
      <div className="max-w-md mx-auto px-4">
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="p-8 text-center">
            <ClockIcon className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-yellow-800 mb-2">
              Payment Pending
            </h1>
            <p className="text-yellow-700 mb-6">
              Your payment is being processed. Please complete the payment according to the instructions provided, or it will expire automatically.
            </p>
            <div className="space-y-3">
              <Button 
                onClick={() => router.replace(`/ppdb/payment/${paymentId}`)}
                className="w-full"
              >
                View Payment Instructions
              </Button>
              <Button 
                variant="outline" 
                onClick={() => router.push('/ppdb/status')}
                className="w-full"
              >
                Check Registration Status
              </Button>
            </div>
            <p className="text-sm text-gray-600 mt-4">
              Redirecting to payment details in 3 seconds...
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}