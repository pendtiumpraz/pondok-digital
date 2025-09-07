// Force dynamic rendering to prevent static generation issues
export const dynamic = 'force-dynamic'

import ZakatCalculatorClient from './ZakatCalculatorClient'
import { useRouter, useSearchParams } from 'next/navigation'
import { ZakatType, ZakatCalculationInputs } from '@/types'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  CurrencyDollarIcon,
  ScaleIcon,
  BuildingStorefrontIcon,
  SparklesIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline'

interface ZakatCalculatorPageProps {}

export default function ZakatCalculatorPage({}: ZakatCalculatorPageProps) {
  return <ZakatCalculatorClient />
}