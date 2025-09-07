'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  CheckCircle,
  Clock,
  AlertCircle,
  FileText,
  CreditCard,
  Calendar,
  User,
  Phone,
  School,
  XCircle,
  Loader2,
} from 'lucide-react';

interface RegistrationData {
  id: string;
  registrationNo: string;
  fullName: string;
  level: string;
  status: string;
  statusDescription: string;
  paymentStatus: string;
  paymentStatusDescription: string;
  testSchedule?: string;
  testVenue?: string;
  testResult?: string;
  createdAt: string;
  submittedAt?: string;
}

export default function PPDBStatusPage() {
  const [registrationNo, setRegistrationNo] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [data, setData] = useState<RegistrationData | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setData(null);

    try {
      const response = await fetch('/api/ppdb/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ registrationNo, whatsapp }),
      });

      const result = await response.json();

      if (!result.success) {
        setError(result.error || 'Terjadi kesalahan');
      } else {
        setData(result.data);
      }
    } catch (err) {
      setError('Gagal menghubungi server. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'DRAFT':
        return <FileText className="w-6 h-6" />;
      case 'SUBMITTED':
      case 'DOCUMENT_CHECK':
      case 'VERIFIED':
        return <Clock className="w-6 h-6" />;
      case 'TEST_SCHEDULED':
      case 'TEST_TAKEN':
        return <Calendar className="w-6 h-6" />;
      case 'PASSED':
      case 'REGISTERED':
        return <CheckCircle className="w-6 h-6" />;
      case 'FAILED':
        return <XCircle className="w-6 h-6" />;
      default:
        return <AlertCircle className="w-6 h-6" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PASSED':
      case 'REGISTERED':
      case 'VERIFIED':
        return 'text-green-600 bg-green-100';
      case 'FAILED':
        return 'text-red-600 bg-red-100';
      case 'DRAFT':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-blue-600 bg-blue-100';
    }
  };

  const statusSteps = [
    { key: 'SUBMITTED', label: 'Pendaftaran Diterima' },
    { key: 'DOCUMENT_CHECK', label: 'Verifikasi Dokumen' },
    { key: 'VERIFIED', label: 'Dokumen Terverifikasi' },
    { key: 'TEST_SCHEDULED', label: 'Jadwal Test' },
    { key: 'TEST_TAKEN', label: 'Test Selesai' },
    { key: 'PASSED', label: 'Hasil Seleksi' },
    { key: 'REGISTERED', label: 'Terdaftar' },
  ];

  const getCurrentStep = (status: string) => {
    const index = statusSteps.findIndex((step) => step.key === status);
    return index >= 0 ? index : -1;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white py-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Cek Status Pendaftaran
            </h1>
            <p className="text-gray-600">
              Masukkan nomor pendaftaran dan nomor WhatsApp untuk melihat status pendaftaran Anda
            </p>
          </div>

          {/* Search Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nomor Pendaftaran
                </label>
                <input
                  type="text"
                  value={registrationNo}
                  onChange={(e) => setRegistrationNo(e.target.value)}
                  placeholder="Contoh: PPDB-2024-0001"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nomor WhatsApp
                </label>
                <input
                  type="text"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="Contoh: 081234567890"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Mencari...
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5" />
                    Cek Status
                  </>
                )}
              </button>
            </form>

            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700"
              >
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <p>{error}</p>
                </div>
              </motion.div>
            )}
          </div>

          {/* Result */}
          {data && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Basic Info */}
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Informasi Pendaftaran</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Nomor Pendaftaran</p>
                    <p className="text-lg font-semibold text-gray-900">{data.registrationNo}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Nama Lengkap</p>
                    <p className="text-lg font-semibold text-gray-900">{data.fullName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Program</p>
                    <p className="text-lg font-semibold text-gray-900">{data.level}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Tanggal Daftar</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {new Date(data.createdAt).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
              </div>

              {/* Status Progress */}
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Status Pendaftaran</h2>
                
                {/* Current Status Badge */}
                <div className="mb-8">
                  <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-full ${getStatusColor(data.status)}`}>
                    {getStatusIcon(data.status)}
                    <span className="font-semibold">{data.statusDescription}</span>
                  </div>
                </div>

                {/* Progress Steps */}
                <div className="relative">
                  <div className="absolute left-4 top-8 bottom-8 w-0.5 bg-gray-200" />
                  {(statusSteps || []).map((step, index) => {
                    const currentStep = getCurrentStep(data.status);
                    const isCompleted = index <= currentStep;
                    const isCurrent = index === currentStep;
                    
                    return (
                      <div key={step.key} className="relative flex items-start mb-8 last:mb-0">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center z-10 ${
                            isCompleted
                              ? isCurrent
                                ? 'bg-green-600 ring-4 ring-green-200'
                                : 'bg-green-600'
                              : 'bg-gray-300'
                          }`}
                        >
                          {isCompleted && (
                            <CheckCircle className="w-5 h-5 text-white" />
                          )}
                        </div>
                        <div className="ml-6">
                          <p className={`font-semibold ${isCompleted ? 'text-gray-900' : 'text-gray-400'}`}>
                            {step.label}
                          </p>
                          {isCurrent && (
                            <p className="text-sm text-gray-600 mt-1">Status saat ini</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Payment Status */}
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Status Pembayaran</h2>
                <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-full ${
                  data.paymentStatus === 'VERIFIED' ? 'bg-green-100 text-green-600' :
                  data.paymentStatus === 'PAID' ? 'bg-blue-100 text-blue-600' :
                  'bg-gray-100 text-gray-600'
                }`}>
                  <CreditCard className="w-5 h-5" />
                  <span className="font-semibold">{data.paymentStatusDescription}</span>
                </div>
              </div>

              {/* Test Schedule (if available) */}
              {data.testSchedule && (
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border-2 border-blue-200">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Jadwal Test</h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Tanggal & Waktu</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {new Date(data.testSchedule).toLocaleString('id-ID', {
                          weekday: 'long',
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                    {data.testVenue && (
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Lokasi</p>
                        <p className="text-lg font-semibold text-gray-900">{data.testVenue}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Test Result (if available) */}
              {data.testResult && (
                <div className={`rounded-2xl p-8 ${
                  data.testResult === 'PASSED' ? 'bg-green-50 border-2 border-green-200' :
                  data.testResult === 'FAILED' ? 'bg-red-50 border-2 border-red-200' :
                  'bg-gray-50 border-2 border-gray-200'
                }`}>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Hasil Seleksi</h2>
                  <p className="text-lg">
                    {data.testResult === 'PASSED' ? (
                      <span className="text-green-600 font-semibold">
                        Selamat! Anda dinyatakan LULUS seleksi. Silakan lakukan daftar ulang.
                      </span>
                    ) : data.testResult === 'FAILED' ? (
                      <span className="text-red-600 font-semibold">
                        Mohon maaf, Anda belum berhasil pada seleksi kali ini.
                      </span>
                    ) : (
                      <span className="text-gray-600">Menunggu hasil...</span>
                    )}
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}