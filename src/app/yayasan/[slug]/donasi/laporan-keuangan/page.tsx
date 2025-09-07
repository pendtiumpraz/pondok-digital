'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'
import { Line, Bar, Doughnut } from 'react-chartjs-2'
import {
  BanknotesIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ChartBarIcon,
  CalendarIcon,
  DocumentTextIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  BuildingLibraryIcon,
} from '@heroicons/react/24/outline'
import { Card } from '@/components/ui/card'

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

interface FinancialData {
  year: number
  monthlyData: Array<{
    month: number
    monthName: string
    income: number
    expense: number
    netCashflow: number
    donations: number
    nonDonations: number
  }>
  yearlyTotals: {
    totalIncome: number
    totalExpense: number
    totalDonations: number
    totalNonDonations: number
    netCashflow: number
  }
  programs: Array<{
    id: string
    name: string
    target: number
    collected: number
    percentage: number
    status: string
    category: string
  }>
  incomeBreakdown: {
    donations: number
    studentPayments: number
    otherIncome: number
  }
  expenseCategories: Record<string, number>
  recentDonations: Array<{
    id: string
    donorName: string
    amount: number
    campaign: string
    date: string
  }>
}

export default function LaporanKeuanganPage() {
  const { slug } = useParams()
  const [financialData, setFinancialData] = useState<FinancialData | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedView, setSelectedView] = useState<'monthly' | 'yearly'>('monthly')

  useEffect(() => {
    fetchFinancialData()
  }, [slug])

  const fetchFinancialData = async () => {
    try {
      const response = await fetch(`/api/yayasan/${slug}/financial-report`)
      const data = await response.json()
      setFinancialData(data)
    } catch (error) {
      console.error('Error fetching financial data:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000000) {
      return `${(num / 1000000000).toFixed(1)}M`
    } else if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}Jt`
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}Rb`
    }
    return num.toString()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    )
  }

  if (!financialData) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Data tidak tersedia</p>
      </div>
    )
  }

  // Chart data for monthly cashflow
  const cashflowChartData = {
    labels: financialData.monthlyData.map(m => m.monthName),
    datasets: [
      {
        label: 'Pemasukan',
        data: financialData.monthlyData.map(m => m.income),
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Pengeluaran',
        data: financialData.monthlyData.map(m => m.expense),
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  }

  // Chart data for income breakdown
  const incomeBreakdownData = {
    labels: ['Donasi', 'SPP & Pendaftaran', 'Pemasukan Lain'],
    datasets: [
      {
        data: [
          financialData.incomeBreakdown.donations,
          financialData.incomeBreakdown.studentPayments,
          financialData.incomeBreakdown.otherIncome,
        ],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(251, 146, 60, 0.8)',
        ],
        borderColor: [
          'rgb(34, 197, 94)',
          'rgb(59, 130, 246)',
          'rgb(251, 146, 60)',
        ],
        borderWidth: 1,
      },
    ],
  }

  // Chart data for expense categories
  const expenseData = {
    labels: Object.keys(financialData.expenseCategories),
    datasets: [
      {
        label: 'Pengeluaran',
        data: Object.values(financialData.expenseCategories),
        backgroundColor: 'rgba(239, 68, 68, 0.6)',
        borderColor: 'rgb(239, 68, 68)',
        borderWidth: 1,
      },
    ],
  }

  // Chart data for donation vs non-donation
  const donationComparisonData = {
    labels: financialData.monthlyData.map(m => m.monthName),
    datasets: [
      {
        label: 'Donasi',
        data: financialData.monthlyData.map(m => m.donations),
        backgroundColor: 'rgba(34, 197, 94, 0.6)',
      },
      {
        label: 'Non-Donasi',
        data: financialData.monthlyData.map(m => m.nonDonations),
        backgroundColor: 'rgba(59, 130, 246, 0.6)',
      },
    ],
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Laporan Keuangan {financialData.year}
                </h1>
                <p className="text-gray-600 mt-2">
                  Transparansi keuangan yayasan periode Januari - Desember {financialData.year}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedView('monthly')}
                  className={`px-4 py-2 rounded-lg ${
                    selectedView === 'monthly'
                      ? 'bg-green-600 text-white'
                      : 'bg-white text-gray-700 border border-gray-300'
                  }`}
                >
                  Bulanan
                </button>
                <button
                  onClick={() => setSelectedView('yearly')}
                  className={`px-4 py-2 rounded-lg ${
                    selectedView === 'yearly'
                      ? 'bg-green-600 text-white'
                      : 'bg-white text-gray-700 border border-gray-300'
                  }`}
                >
                  Tahunan
                </button>
              </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card className="p-6 bg-gradient-to-r from-green-500 to-green-600 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100">Total Pemasukan</p>
                      <p className="text-2xl font-bold mt-2">
                        {formatCurrency(financialData.yearlyTotals.totalIncome)}
                      </p>
                      <p className="text-sm text-green-100 mt-1">
                        +{formatNumber(financialData.yearlyTotals.totalDonations)} dari donasi
                      </p>
                    </div>
                    <ArrowTrendingUpIcon className="w-12 h-12 text-green-200" />
                  </div>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="p-6 bg-gradient-to-r from-red-500 to-red-600 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-red-100">Total Pengeluaran</p>
                      <p className="text-2xl font-bold mt-2">
                        {formatCurrency(financialData.yearlyTotals.totalExpense)}
                      </p>
                      <p className="text-sm text-red-100 mt-1">
                        {Object.keys(financialData.expenseCategories).length} kategori
                      </p>
                    </div>
                    <ArrowTrendingDownIcon className="w-12 h-12 text-red-200" />
                  </div>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="p-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100">Arus Kas Bersih</p>
                      <p className="text-2xl font-bold mt-2">
                        {formatCurrency(financialData.yearlyTotals.netCashflow)}
                      </p>
                      <p className="text-sm text-blue-100 mt-1">
                        {financialData.yearlyTotals.netCashflow > 0 ? 'Surplus' : 'Defisit'}
                      </p>
                    </div>
                    <BanknotesIcon className="w-12 h-12 text-blue-200" />
                  </div>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card className="p-6 bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-100">Program Aktif</p>
                      <p className="text-2xl font-bold mt-2">
                        {financialData.programs.length}
                      </p>
                      <p className="text-sm text-purple-100 mt-1">
                        {financialData.programs.filter(p => p.status === 'active').length} berjalan
                      </p>
                    </div>
                    <ChartBarIcon className="w-12 h-12 text-purple-200" />
                  </div>
                </Card>
              </motion.div>
            </div>
          </motion.div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Cashflow Chart */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Arus Kas Bulanan
                </h2>
                <Line
                  data={cashflowChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'top' as const,
                      },
                      tooltip: {
                        callbacks: {
                          label: (context) => {
                            return `${context.dataset.label}: ${formatCurrency(context.parsed.y)}`
                          },
                        },
                      },
                    },
                    scales: {
                      y: {
                        ticks: {
                          callback: (value) => formatNumber(value as number),
                        },
                      },
                    },
                  }}
                  height={300}
                />
              </Card>
            </motion.div>

            {/* Income Breakdown */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Sumber Pemasukan
                </h2>
                <Doughnut
                  data={incomeBreakdownData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'bottom' as const,
                      },
                      tooltip: {
                        callbacks: {
                          label: (context) => {
                            const label = context.label || '';
                            const value = formatCurrency(context.parsed);
                            const percentage = Math.round(
                              (context.parsed / financialData.yearlyTotals.totalIncome) * 100
                            );
                            return `${label}: ${value} (${percentage}%)`
                          },
                        },
                      },
                    },
                  }}
                  height={300}
                />
              </Card>
            </motion.div>
          </div>

          {/* Donation vs Non-Donation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mb-8"
          >
            <Card className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Perbandingan Donasi vs Non-Donasi
              </h2>
              <Bar
                data={donationComparisonData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'top' as const,
                    },
                    tooltip: {
                      callbacks: {
                        label: (context) => {
                          return `${context.dataset.label}: ${formatCurrency(context.parsed.y)}`
                        },
                      },
                    },
                  },
                  scales: {
                    y: {
                      stacked: true,
                      ticks: {
                        callback: (value) => formatNumber(value as number),
                      },
                    },
                    x: {
                      stacked: true,
                    },
                  },
                }}
                height={100}
              />
            </Card>
          </motion.div>

          {/* Programs Progress */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mb-8"
          >
            <Card className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Program Donasi Tahun Ini
              </h2>
              <div className="space-y-4">
                {financialData.programs.map((program, index) => (
                  <motion.div
                    key={program.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="border rounded-lg p-4"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold text-gray-900">{program.name}</h3>
                        <p className="text-sm text-gray-600">
                          Target: {formatCurrency(program.target)}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          program.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {program.status === 'active' ? 'Aktif' : 'Selesai'}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-green-600 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(program.percentage, 100)}%` }}
                      />
                    </div>
                    <div className="flex justify-between mt-2">
                      <span className="text-sm text-gray-600">
                        Terkumpul: {formatCurrency(program.collected)}
                      </span>
                      <span className="text-sm font-semibold text-green-600">
                        {program.percentage}%
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Expense Categories */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9 }}
            >
              <Card className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Kategori Pengeluaran
                </h2>
                <Bar
                  data={expenseData}
                  options={{
                    responsive: true,
                    indexAxis: 'y' as const,
                    plugins: {
                      legend: {
                        display: false,
                      },
                      tooltip: {
                        callbacks: {
                          label: (context) => {
                            return formatCurrency(context.parsed.x)
                          },
                        },
                      },
                    },
                    scales: {
                      x: {
                        ticks: {
                          callback: (value) => formatNumber(value as number),
                        },
                      },
                    },
                  }}
                  height={300}
                />
              </Card>
            </motion.div>

            {/* Recent Donations */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1 }}
            >
              <Card className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Donasi Terbaru
                </h2>
                <div className="space-y-3 max-h-[300px] overflow-y-auto">
                  {financialData.recentDonations.map((donation) => (
                    <div
                      key={donation.id}
                      className="flex justify-between items-center py-2 border-b"
                    >
                      <div>
                        <p className="font-medium text-gray-900">{donation.donorName}</p>
                        <p className="text-sm text-gray-600">{donation.campaign}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-green-600">
                          {formatCurrency(donation.amount)}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(donation.date).toLocaleDateString('id-ID')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Monthly Details Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
          >
            <Card className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Detail Arus Kas Bulanan
              </h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Bulan
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Pemasukan
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Donasi
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Non-Donasi
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Pengeluaran
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Arus Kas Bersih
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {financialData.monthlyData.map((month) => (
                      <tr key={month.month}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {month.monthName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatCurrency(month.income)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatCurrency(month.donations)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatCurrency(month.nonDonations)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatCurrency(month.expense)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <span
                            className={
                              month.netCashflow >= 0
                                ? 'text-green-600'
                                : 'text-red-600'
                            }
                          >
                            {formatCurrency(month.netCashflow)}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {/* Total Row */}
                    <tr className="bg-gray-50 font-bold">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        TOTAL
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(financialData.yearlyTotals.totalIncome)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(financialData.yearlyTotals.totalDonations)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(financialData.yearlyTotals.totalNonDonations)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(financialData.yearlyTotals.totalExpense)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span
                          className={
                            financialData.yearlyTotals.netCashflow >= 0
                              ? 'text-green-600'
                              : 'text-red-600'
                          }
                        >
                          {formatCurrency(financialData.yearlyTotals.netCashflow)}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Card>
          </motion.div>

          {/* Footer Note */}
          <div className="mt-8 text-center text-sm text-gray-600">
            <p>
              Laporan keuangan ini diperbarui secara otomatis dari sistem database yayasan.
            </p>
            <p>
              Terakhir diperbarui: {new Date().toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
        </div>
    </div>
  )
}