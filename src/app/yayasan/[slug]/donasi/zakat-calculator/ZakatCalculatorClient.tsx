'use client'

import { useState, useEffect } from 'react'
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

export default function ZakatCalculatorClient() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [selectedType, setSelectedType] = useState<ZakatType>('FITRAH')
  const [inputs, setInputs] = useState<ZakatCalculationInputs>({})
  const [result, setResult] = useState<{
    zakatAmount: number
    nisabAmount?: number
    wajibZakat: boolean
    explanation: string
  } | null>(null)
  const [loading, setLoading] = useState(false)
  const [donorInfo, setDonorInfo] = useState({
    name: '',
    email: '',
    phone: ''
  })

  useEffect(() => {
    const type = searchParams.get('type') as ZakatType
    if (type && ['FITRAH', 'MAL', 'EMAS', 'PERAK', 'PERDAGANGAN'].includes(type)) {
      setSelectedType(type)
    }
  }, [searchParams])

  const zakatTypes = [
    {
      type: 'FITRAH' as ZakatType,
      label: 'Zakat Fitrah',
      description: 'Zakat yang wajib dikeluarkan setiap Muslim menjelang Hari Raya Idul Fitri',
      icon: SparklesIcon,
      color: 'bg-green-500'
    },
    {
      type: 'MAL' as ZakatType,
      label: 'Zakat Mal',
      description: 'Zakat harta yang telah mencapai nisab dan haul',
      icon: CurrencyDollarIcon,
      color: 'bg-blue-500'
    },
    {
      type: 'EMAS' as ZakatType,
      label: 'Zakat Emas',
      description: 'Zakat untuk kepemilikan emas yang mencapai nisab',
      icon: SparklesIcon,
      color: 'bg-yellow-500'
    },
    {
      type: 'PERAK' as ZakatType,
      label: 'Zakat Perak',
      description: 'Zakat untuk kepemilikan perak yang mencapai nisab',
      icon: ScaleIcon,
      color: 'bg-gray-500'
    },
    {
      type: 'PERDAGANGAN' as ZakatType,
      label: 'Zakat Perdagangan',
      description: 'Zakat untuk modal dan keuntungan usaha dagang',
      icon: BuildingStorefrontIcon,
      color: 'bg-purple-500'
    }
  ]

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const calculateZakat = () => {
    setLoading(true)
    
    setTimeout(() => {
      let zakatAmount = 0
      let nisabAmount = 0
      let wajibZakat = false
      let explanation = ''

      switch (selectedType) {
        case 'FITRAH':
          const personCount = inputs.fitrah?.personCount || 0
          const ricePrice = inputs.fitrah?.ricePrice || 15000 // Default harga beras per kg
          const zakatFitrahPerPerson = 2.5 // kg per person
          
          zakatAmount = personCount * zakatFitrahPerPerson * ricePrice
          wajibZakat = personCount > 0
          explanation = `Zakat fitrah untuk ${personCount} orang dengan harga beras Rp ${ricePrice.toLocaleString('id-ID')} per kg. Setiap orang wajib mengeluarkan 2,5 kg beras atau setara uang.`
          break

        case 'MAL':
          const totalWealth = (inputs.mal?.totalWealth || 0) + (inputs.mal?.savings || 0) + (inputs.mal?.investments || 0)
          const debt = inputs.mal?.debt || 0
          const netWealth = totalWealth - debt
          
          nisabAmount = 85 * 4.25 * 1000000 // Nisab emas 85 gram × harga emas ± Rp 1jt/gram
          wajibZakat = netWealth >= nisabAmount
          zakatAmount = wajibZakat ? netWealth * 0.025 : 0 // 2.5%
          
          explanation = `Total harta bersih Anda ${formatCurrency(netWealth)}. Nisab zakat mal adalah ${formatCurrency(nisabAmount)}. ${wajibZakat ? 'Anda wajib membayar zakat 2,5% dari harta bersih.' : 'Harta Anda belum mencapai nisab.'}`
          break

        case 'EMAS':
          const goldWeight = inputs.emas?.goldWeight || 0 // gram
          const goldPrice = inputs.emas?.goldPrice || 1000000 // per gram
          const goldValue = goldWeight * goldPrice
          
          nisabAmount = 85 * goldPrice // 85 gram
          wajibZakat = goldWeight >= 85
          zakatAmount = wajibZakat ? goldValue * 0.025 : 0
          
          explanation = `Kepemilikan emas Anda ${goldWeight} gram senilai ${formatCurrency(goldValue)}. Nisab emas adalah 85 gram atau ${formatCurrency(nisabAmount)}. ${wajibZakat ? 'Anda wajib membayar zakat 2,5%.' : 'Emas Anda belum mencapai nisab.'}`
          break

        case 'PERAK':
          const silverWeight = inputs.perak?.silverWeight || 0 // gram
          const silverPrice = inputs.perak?.silverPrice || 15000 // per gram
          const silverValue = silverWeight * silverPrice
          
          nisabAmount = 595 * silverPrice // 595 gram
          wajibZakat = silverWeight >= 595
          zakatAmount = wajibZakat ? silverValue * 0.025 : 0
          
          explanation = `Kepemilikan perak Anda ${silverWeight} gram senilai ${formatCurrency(silverValue)}. Nisab perak adalah 595 gram atau ${formatCurrency(nisabAmount)}. ${wajibZakat ? 'Anda wajib membayar zakat 2,5%.' : 'Perak Anda belum mencapai nisab.'}`
          break

        case 'PERDAGANGAN':
          const inventory = inputs.perdagangan?.inventory || 0
          const receivables = inputs.perdagangan?.receivables || 0
          const cash = inputs.perdagangan?.cash || 0
          const businessDebt = inputs.perdagangan?.debt || 0
          const businessAssets = inventory + receivables + cash - businessDebt
          
          nisabAmount = 85 * 4.25 * 1000000 // Sama dengan nisab emas
          wajibZakat = businessAssets >= nisabAmount
          zakatAmount = wajibZakat ? businessAssets * 0.025 : 0
          
          explanation = `Total aset perdagangan Anda ${formatCurrency(businessAssets)} (inventory + piutang + kas - hutang). Nisab zakat perdagangan mengikuti nisab emas yaitu ${formatCurrency(nisabAmount)}. ${wajibZakat ? 'Anda wajib membayar zakat 2,5%.' : 'Aset perdagangan Anda belum mencapai nisab.'}`
          break
      }

      setResult({
        zakatAmount,
        nisabAmount,
        wajibZakat,
        explanation
      })
      
      setLoading(false)
    }, 1000)
  }

  const saveCalculation = async () => {
    if (!result) return

    try {
      const response = await fetch('/api/donations/zakat-calculation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          calculationType: selectedType,
          inputs,
          zakatAmount: result.zakatAmount,
          nisabAmount: result.nisabAmount,
          donorName: donorInfo.name || null,
          donorEmail: donorInfo.email || null,
          donorPhone: donorInfo.phone || null
        }),
      })

      if (response.ok) {
        alert('Perhitungan zakat berhasil disimpan')
      }
    } catch (error) {
      console.error('Error saving calculation:', error)
    }
  }

  const proceedToDonate = () => {
    if (!result?.wajibZakat) return

    const params = new URLSearchParams({
      amount: Math.round(result.zakatAmount).toString(),
      category: 'zakat',
      type: selectedType.toLowerCase()
    })

    if (donorInfo.name) params.set('name', donorInfo.name)
    if (donorInfo.email) params.set('email', donorInfo.email)
    if (donorInfo.phone) params.set('phone', donorInfo.phone)

    router.push(`/donasi/donate?${params.toString()}`)
  }

  const selectedTypeData = zakatTypes.find(t => t.type === selectedType)

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Kalkulator Zakat</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Hitung kewajiban zakat Anda dengan mudah dan akurat sesuai ketentuan syariat Islam
            </p>
          </div>

          {/* Type Selection */}
          <Card className="p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Pilih Jenis Zakat</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {zakatTypes.map((type) => {
                const Icon = type.icon
                return (
                  <button
                    key={type.type}
                    onClick={() => {
                      setSelectedType(type.type)
                      setResult(null)
                      setInputs({})
                    }}
                    className={`p-4 rounded-lg border text-left transition-all ${
                      selectedType === type.type
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-green-300'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-lg ${type.color} text-white flex items-center justify-center mb-3`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">{type.label}</h3>
                    <p className="text-xs text-gray-600">{type.description}</p>
                  </button>
                )
              })}
            </div>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Input Form */}
            <div>
              <Card className="p-6">
                <div className="flex items-center mb-4">
                  {selectedTypeData && (
                    <>
                      <div className={`w-10 h-10 rounded-lg ${selectedTypeData.color} text-white flex items-center justify-center mr-3`}>
                        <selectedTypeData.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold">{selectedTypeData.label}</h2>
                        <p className="text-sm text-gray-600">{selectedTypeData.description}</p>
                      </div>
                    </>
                  )}
                </div>

                <div className="space-y-4">
                  {/* Zakat Fitrah Form */}
                  {selectedType === 'FITRAH' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Jumlah Jiwa *
                        </label>
                        <Input
                          type="number"
                          placeholder="Masukkan jumlah jiwa"
                          value={inputs.fitrah?.personCount || ''}
                          onChange={(e) => setInputs({
                            ...inputs,
                            fitrah: {
                              personCount: parseInt(e.target.value) || 0,
                              ricePrice: inputs.fitrah?.ricePrice || 15000
                            }
                          })}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Termasuk diri sendiri, pasangan, anak, dan tanggungan
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Harga Beras per Kg
                        </label>
                        <Input
                          type="number"
                          placeholder="15000"
                          value={inputs.fitrah?.ricePrice || ''}
                          onChange={(e) => setInputs({
                            ...inputs,
                            fitrah: {
                              personCount: inputs.fitrah?.personCount || 1,
                              ricePrice: parseInt(e.target.value) || 15000
                            }
                          })}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Harga beras makanan pokok setempat
                        </p>
                      </div>
                    </>
                  )}

                  {/* Zakat Mal Form */}
                  {selectedType === 'MAL' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Total Kekayaan
                        </label>
                        <Input
                          type="number"
                          placeholder="0"
                          value={inputs.mal?.totalWealth || ''}
                          onChange={(e) => setInputs({
                            ...inputs,
                            mal: {
                              totalWealth: parseInt(e.target.value) || 0,
                              debt: inputs.mal?.debt || 0,
                              savings: inputs.mal?.savings || 0,
                              investments: inputs.mal?.investments || 0
                            }
                          })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Tabungan
                        </label>
                        <Input
                          type="number"
                          placeholder="0"
                          value={inputs.mal?.savings || ''}
                          onChange={(e) => setInputs({
                            ...inputs,
                            mal: {
                              totalWealth: inputs.mal?.totalWealth || 0,
                              debt: inputs.mal?.debt || 0,
                              savings: parseInt(e.target.value) || 0,
                              investments: inputs.mal?.investments || 0
                            }
                          })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Investasi
                        </label>
                        <Input
                          type="number"
                          placeholder="0"
                          value={inputs.mal?.investments || ''}
                          onChange={(e) => setInputs({
                            ...inputs,
                            mal: {
                              totalWealth: inputs.mal?.totalWealth || 0,
                              debt: inputs.mal?.debt || 0,
                              savings: inputs.mal?.savings || 0,
                              investments: parseInt(e.target.value) || 0
                            }
                          })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Hutang
                        </label>
                        <Input
                          type="number"
                          placeholder="0"
                          value={inputs.mal?.debt || ''}
                          onChange={(e) => setInputs({
                            ...inputs,
                            mal: {
                              totalWealth: inputs.mal?.totalWealth || 0,
                              debt: parseInt(e.target.value) || 0,
                              savings: inputs.mal?.savings || 0,
                              investments: inputs.mal?.investments || 0
                            }
                          })}
                        />
                      </div>
                    </>
                  )}

                  {/* Zakat Emas Form */}
                  {selectedType === 'EMAS' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Berat Emas (gram) *
                        </label>
                        <Input
                          type="number"
                          placeholder="0"
                          value={inputs.emas?.goldWeight || ''}
                          onChange={(e) => setInputs({
                            ...inputs,
                            emas: {
                              goldWeight: parseFloat(e.target.value) || 0,
                              goldPrice: inputs.emas?.goldPrice || 1000000
                            }
                          })}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Nisab emas adalah 85 gram
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Harga Emas per Gram
                        </label>
                        <Input
                          type="number"
                          placeholder="1000000"
                          value={inputs.emas?.goldPrice || ''}
                          onChange={(e) => setInputs({
                            ...inputs,
                            emas: {
                              goldWeight: inputs.emas?.goldWeight || 0,
                              goldPrice: parseInt(e.target.value) || 1000000
                            }
                          })}
                        />
                      </div>
                    </>
                  )}

                  {/* Zakat Perak Form */}
                  {selectedType === 'PERAK' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Berat Perak (gram) *
                        </label>
                        <Input
                          type="number"
                          placeholder="0"
                          value={inputs.perak?.silverWeight || ''}
                          onChange={(e) => setInputs({
                            ...inputs,
                            perak: {
                              silverWeight: parseFloat(e.target.value) || 0,
                              silverPrice: inputs.perak?.silverPrice || 15000
                            }
                          })}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Nisab perak adalah 595 gram
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Harga Perak per Gram
                        </label>
                        <Input
                          type="number"
                          placeholder="15000"
                          value={inputs.perak?.silverPrice || ''}
                          onChange={(e) => setInputs({
                            ...inputs,
                            perak: {
                              silverWeight: inputs.perak?.silverWeight || 0,
                              silverPrice: parseInt(e.target.value) || 15000
                            }
                          })}
                        />
                      </div>
                    </>
                  )}

                  {/* Zakat Perdagangan Form */}
                  {selectedType === 'PERDAGANGAN' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nilai Inventory/Stok
                        </label>
                        <Input
                          type="number"
                          placeholder="0"
                          value={inputs.perdagangan?.inventory || ''}
                          onChange={(e) => setInputs({
                            ...inputs,
                            perdagangan: {
                              inventory: parseInt(e.target.value) || 0,
                              receivables: inputs.perdagangan?.receivables || 0,
                              cash: inputs.perdagangan?.cash || 0,
                              debt: inputs.perdagangan?.debt || 0
                            }
                          })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Piutang Dagang
                        </label>
                        <Input
                          type="number"
                          placeholder="0"
                          value={inputs.perdagangan?.receivables || ''}
                          onChange={(e) => setInputs({
                            ...inputs,
                            perdagangan: {
                              inventory: inputs.perdagangan?.inventory || 0,
                              receivables: parseInt(e.target.value) || 0,
                              cash: inputs.perdagangan?.cash || 0,
                              debt: inputs.perdagangan?.debt || 0
                            }
                          })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Kas/Modal Tunai
                        </label>
                        <Input
                          type="number"
                          placeholder="0"
                          value={inputs.perdagangan?.cash || ''}
                          onChange={(e) => setInputs({
                            ...inputs,
                            perdagangan: {
                              inventory: inputs.perdagangan?.inventory || 0,
                              receivables: inputs.perdagangan?.receivables || 0,
                              cash: parseInt(e.target.value) || 0,
                              debt: inputs.perdagangan?.debt || 0
                            }
                          })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Hutang Usaha
                        </label>
                        <Input
                          type="number"
                          placeholder="0"
                          value={inputs.perdagangan?.debt || ''}
                          onChange={(e) => setInputs({
                            ...inputs,
                            perdagangan: {
                              inventory: inputs.perdagangan?.inventory || 0,
                              receivables: inputs.perdagangan?.receivables || 0,
                              cash: inputs.perdagangan?.cash || 0,
                              debt: parseInt(e.target.value) || 0
                            }
                          })}
                        />
                      </div>
                    </>
                  )}
                </div>

                <Button
                  onClick={calculateZakat}
                  disabled={loading}
                  className="w-full mt-6"
                >
                  {loading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Menghitung...
                    </div>
                  ) : (
                    'Hitung Zakat'
                  )}
                </Button>
              </Card>
            </div>

            {/* Result */}
            <div>
              {result ? (
                <div className="space-y-6">
                  {/* Result Card */}
                  <Card className={`p-6 ${result.wajibZakat ? 'border-green-500 bg-green-50' : 'border-yellow-500 bg-yellow-50'}`}>
                    <div className="flex items-start">
                      <div className={`w-12 h-12 rounded-full ${result.wajibZakat ? 'bg-green-500' : 'bg-yellow-500'} text-white flex items-center justify-center mr-4`}>
                        {result.wajibZakat ? (
                          <CurrencyDollarIcon className="w-6 h-6" />
                        ) : (
                          <InformationCircleIcon className="w-6 h-6" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className={`text-xl font-semibold ${result.wajibZakat ? 'text-green-900' : 'text-yellow-900'} mb-2`}>
                          {result.wajibZakat ? 'Anda Wajib Berzakat' : 'Belum Wajib Zakat'}
                        </h3>
                        {result.wajibZakat ? (
                          <div className="mb-4">
                            <div className={`text-3xl font-bold ${result.wajibZakat ? 'text-green-700' : 'text-yellow-700'} mb-2`}>
                              {formatCurrency(result.zakatAmount)}
                            </div>
                            <Badge className="bg-green-500 text-white">
                              Kewajiban Zakat Anda
                            </Badge>
                          </div>
                        ) : (
                          <div className="mb-4">
                            <Badge className="bg-yellow-500 text-white">
                              Harta Belum Mencapai Nisab
                            </Badge>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>

                  {/* Explanation */}
                  <Card className="p-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Penjelasan Perhitungan</h4>
                    <p className="text-gray-700 leading-relaxed">{result.explanation}</p>
                    
                    {result.nisabAmount && (
                      <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                        <h5 className="font-medium text-blue-900 mb-2">Informasi Nisab</h5>
                        <p className="text-blue-700 text-sm">
                          Nisab untuk {selectedTypeData?.label}: <strong>{formatCurrency(result.nisabAmount)}</strong>
                        </p>
                      </div>
                    )}
                  </Card>

                  {/* Donor Information */}
                  {result.wajibZakat && (
                    <Card className="p-6">
                      <h4 className="font-semibold text-gray-900 mb-4">Informasi Donatur (Opsional)</h4>
                      <div className="space-y-4">
                        <Input
                          placeholder="Nama lengkap"
                          value={donorInfo.name}
                          onChange={(e) => setDonorInfo({ ...donorInfo, name: e.target.value })}
                        />
                        <Input
                          type="email"
                          placeholder="Email"
                          value={donorInfo.email}
                          onChange={(e) => setDonorInfo({ ...donorInfo, email: e.target.value })}
                        />
                        <Input
                          type="tel"
                          placeholder="Nomor telepon"
                          value={donorInfo.phone}
                          onChange={(e) => setDonorInfo({ ...donorInfo, phone: e.target.value })}
                        />
                      </div>
                    </Card>
                  )}

                  {/* Actions */}
                  <div className="flex space-x-4">
                    <Button
                      onClick={saveCalculation}
                      variant="outline"
                      className="flex-1"
                    >
                      Simpan Perhitungan
                    </Button>
                    {result.wajibZakat && (
                      <Button
                        onClick={proceedToDonate}
                        className="flex-1 bg-green-600 hover:bg-green-700"
                      >
                        Bayar Zakat Sekarang
                      </Button>
                    )}
                  </div>
                </div>
              ) : (
                <Card className="p-8 text-center">
                  <CurrencyDollarIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Siap Menghitung</h3>
                  <p className="text-gray-600">
                    Isi form di sebelah kiri dan klik "Hitung Zakat" untuk melihat hasil perhitungan
                  </p>
                </Card>
              )}
            </div>
          </div>

          {/* Information */}
          <Card className="p-6 mt-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Informasi Penting</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-700">
              <div>
                <h4 className="font-medium mb-2">Syarat Wajib Zakat:</h4>
                <ul className="space-y-1 list-disc list-inside">
                  <li>Muslim</li>
                  <li>Baligh dan berakal</li>
                  <li>Merdeka</li>
                  <li>Harta mencapai nisab</li>
                  <li>Telah berlalu satu tahun (haul)</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Mustahiq Zakat:</h4>
                <ul className="space-y-1 list-disc list-inside">
                  <li>Fakir dan Miskin</li>
                  <li>Amil Zakat</li>
                  <li>Muallaf</li>
                  <li>Riqab (Memerdekakan Budak)</li>
                  <li>Gharim (Orang Berhutang)</li>
                  <li>Fi Sabilillah</li>
                  <li>Ibnu Sabil</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}