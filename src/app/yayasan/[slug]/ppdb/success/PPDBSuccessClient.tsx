'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  CheckCircle,
  Download,
  Printer,
  CreditCard,
  FileCheck,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Clock,
  Star,
  Gift,
  Heart,
  Sparkles,
  Copy,
  Check,
  ArrowRight,
  User,
  School,
  Home,
} from 'lucide-react';

interface RegistrationData {
  id: string;
  registrationNo: string;
  fullName: string;
  level: string;
  createdAt: string;
  status: string;
}

export default function PPDBSuccessClient() {
  const searchParams = useSearchParams();
  const [registrationData, setRegistrationData] = useState<RegistrationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const registrationId = searchParams.get('id');
  const registrationNo = searchParams.get('no');

  useEffect(() => {
    const fetchRegistrationData = async () => {
      if (!registrationId) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/ppdb/${registrationId}`);
        if (response.ok) {
          const data = await response.json();
          setRegistrationData(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch registration data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRegistrationData();
  }, [registrationId]);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleDownloadReceipt = () => {
    // In a real application, this would generate and download a PDF receipt
    const receiptData = {
      registrationNo: registrationNo || 'PPDB-2025-0001',
      fullName: registrationData?.fullName || 'Calon Siswa',
      level: registrationData?.level || 'SD',
      registrationDate: new Date().toLocaleDateString('id-ID'),
      status: 'Terdaftar',
    };

    // Generate receipt content
    const receiptContent = `
TANDA BUKTI PENDAFTARAN
Pondok Pesantren Imam Syafi'i Blitar
Tahun Ajaran 2025/2026

No. Pendaftaran: ${receiptData.registrationNo}
Nama Lengkap: ${receiptData.fullName}
Jenjang: ${receiptData.level}
Tanggal Daftar: ${receiptData.registrationDate}
Status: ${receiptData.status}

Simpan tanda bukti ini dengan baik.
Hubungi kami: 0812-3456-7890
    `;

    // Create and download file
    const element = document.createElement('a');
    const file = new Blob([receiptContent], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `tanda-bukti-${receiptData.registrationNo}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handlePrintReceipt = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const receiptHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Tanda Bukti Pendaftaran - ${registrationNo}</title>
          <style>
            body { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { text-align: center; border-bottom: 2px solid #16a34a; padding-bottom: 20px; margin-bottom: 20px; }
            .content { line-height: 1.6; }
            .highlight { font-weight: bold; color: #16a34a; }
            .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #666; }
            @media print { .no-print { display: none; } }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Tanda Bukti Pendaftaran</h1>
            <h2>Pondok Pesantren Imam Syafi'i Blitar</h2>
            <p>Tahun Ajaran 2025/2026</p>
          </div>
          <div class="content">
            <p><strong>No. Pendaftaran:</strong> <span class="highlight">${registrationNo || 'PPDB-2025-0001'}</span></p>
            <p><strong>Nama Lengkap:</strong> ${registrationData?.fullName || 'Calon Siswa'}</p>
            <p><strong>Jenjang:</strong> ${registrationData?.level || 'SD'}</p>
            <p><strong>Tanggal Daftar:</strong> ${new Date().toLocaleDateString('id-ID')}</p>
            <p><strong>Status:</strong> <span class="highlight">Terdaftar</span></p>
          </div>
          <div class="footer">
            <p>Simpan tanda bukti ini dengan baik</p>
            <p>Hubungi kami: 0812-3456-7890 | ppdb@ponpesimamsyafii.id</p>
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(receiptHTML);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  const timeline = [
    {
      date: '1-3 hari',
      title: 'Verifikasi Dokumen',
      description: 'Tim kami akan memverifikasi dokumen yang telah Anda upload',
      icon: FileCheck,
      status: 'upcoming'
    },
    {
      date: '3-5 hari',
      title: 'Konfirmasi Pembayaran',
      description: 'Lakukan pembayaran biaya pendaftaran sebesar Rp 150.000',
      icon: CreditCard,
      status: 'upcoming'
    },
    {
      date: '1-2 minggu',
      title: 'Jadwal Test Masuk',
      description: 'Kami akan mengirim jadwal test dan wawancara melalui WhatsApp',
      icon: Calendar,
      status: 'upcoming'
    },
    {
      date: '3-4 minggu',
      title: 'Pengumuman Hasil',
      description: 'Hasil seleksi akan diumumkan melalui website dan WhatsApp',
      icon: Star,
      status: 'upcoming'
    },
  ];

  const paymentMethods = [
    {
      bank: 'BRI',
      account: '1234-5678-9012',
      name: 'Yayasan Imam Syafi\'i',
    },
    {
      bank: 'BCA',
      account: '2345-6789-0123',
      name: 'Yayasan Imam Syafi\'i',
    },
    {
      bank: 'Mandiri',
      account: '3456-7890-1234',
      name: 'Yayasan Imam Syafi\'i',
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat data pendaftaran...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white">
      {/* Celebration Animation */}
      <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            initial={{
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
              y: -10,
              rotate: 0,
              opacity: 1,
            }}
            animate={{
              y: (typeof window !== 'undefined' ? window.innerHeight : 1000) + 10,
              rotate: 360,
              opacity: 0,
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              delay: Math.random() * 2,
              repeat: Infinity,
              repeatDelay: 5,
            }}
            style={{
              left: Math.random() * 100 + '%',
            }}
          >
            {i % 4 === 0 && <Sparkles className="w-6 h-6 text-yellow-400" />}
            {i % 4 === 1 && <Star className="w-5 h-5 text-green-400" />}
            {i % 4 === 2 && <Heart className="w-4 h-4 text-pink-400" />}
            {i % 4 === 3 && <Gift className="w-5 h-5 text-purple-400" />}
          </motion.div>
        ))}
      </div>

      <div className="relative z-20 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Success Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl"
            >
              <CheckCircle className="w-12 h-12 text-white" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl font-bold text-gray-900 mb-4"
            >
              Pendaftaran Berhasil!
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl text-gray-600 mb-2"
            >
              Selamat! Pendaftaran PPDB Anda telah berhasil disubmit.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-green-100 border border-green-300 rounded-lg p-4 inline-block"
            >
              <p className="text-green-800 font-semibold text-lg">
                Nomor Pendaftaran Anda:
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-2xl font-bold text-green-900 font-mono">
                  {registrationNo || 'PPDB-2025-0001'}
                </span>
                <button
                  onClick={() => copyToClipboard(registrationNo || 'PPDB-2025-0001')}
                  className="p-2 hover:bg-green-200 rounded-lg transition-colors"
                  title="Copy nomor pendaftaran"
                >
                  {copied ? (
                    <Check className="w-5 h-5 text-green-600" />
                  ) : (
                    <Copy className="w-5 h-5 text-green-600" />
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>

          {/* Registration Details Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-2xl shadow-xl p-8 mb-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <User className="w-6 h-6 text-green-600" />
              <h2 className="text-2xl font-semibold text-gray-900">Detail Pendaftaran</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Nama Lengkap</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {registrationData?.fullName || 'Calon Siswa Baru'}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Jenjang Pendidikan</p>
                  <div className="flex items-center gap-2">
                    <School className="w-5 h-5 text-blue-600" />
                    <p className="text-lg font-semibold text-gray-900">
                      {registrationData?.level || 'SD'}
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Tanggal Pendaftaran</p>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-purple-600" />
                    <p className="text-lg font-semibold text-gray-900">
                      {new Date().toLocaleDateString('id-ID', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Status</p>
                  <span className="inline-flex items-center gap-2 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full font-medium">
                    <Clock className="w-4 h-4" />
                    Menunggu Verifikasi
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 mt-8 pt-6 border-t">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleDownloadReceipt}
                className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors shadow-lg"
              >
                <Download className="w-5 h-5" />
                Download Tanda Bukti
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handlePrintReceipt}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg"
              >
                <Printer className="w-5 h-5" />
                Print Tanda Bukti
              </motion.button>
            </div>
          </motion.div>

          {/* Next Steps Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white rounded-2xl shadow-xl p-8 mb-8"
          >
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-3">
              <ArrowRight className="w-6 h-6 text-green-600" />
              Langkah Selanjutnya
            </h2>

            <div className="space-y-6">
              {(timeline || []).map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  className="flex gap-4 p-4 rounded-xl bg-gradient-to-r from-gray-50 to-white border border-gray-100 hover:shadow-md transition-shadow"
                >
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white shadow-lg">
                      <step.icon className="w-6 h-6" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{step.title}</h3>
                      <span className="text-sm font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">
                        {step.date}
                      </span>
                    </div>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Payment Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-white rounded-2xl shadow-xl p-8 mb-8"
          >
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-3">
              <CreditCard className="w-6 h-6 text-blue-600" />
              Informasi Pembayaran
            </h2>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  i
                </div>
                <div>
                  <h3 className="font-semibold text-blue-900 mb-2">Biaya Pendaftaran</h3>
                  <p className="text-3xl font-bold text-blue-900 mb-2">Rp 150.000</p>
                  <p className="text-blue-700 text-sm">
                    Biaya ini tidak dapat dikembalikan dan wajib dibayar untuk melanjutkan proses seleksi.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              {(paymentMethods || []).map((method, index) => (
                <div key={index} className="border border-gray-200 rounded-xl p-4">
                  <div className="text-center">
                    <h4 className="font-semibold text-gray-900 mb-2">Bank {method.bank}</h4>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-600">No. Rekening:</p>
                      <div className="flex items-center justify-center gap-2">
                        <p className="font-mono font-bold text-gray-900">{method.account}</p>
                        <button
                          onClick={() => copyToClipboard(method.account)}
                          className="p-1 hover:bg-gray-100 rounded"
                          title="Copy nomor rekening"
                        >
                          <Copy className="w-4 h-4 text-gray-600" />
                        </button>
                      </div>
                      <p className="text-sm text-gray-600 mt-2">a.n. {method.name}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
              <p className="text-yellow-800 font-medium">
                📝 Penting: Setelah transfer, kirim bukti pembayaran ke WhatsApp kami dengan format:
              </p>
              <div className="mt-2 p-3 bg-white rounded-lg font-mono text-sm">
                <p>Nama: [Nama Lengkap]</p>
                <p>No. Pendaftaran: {registrationNo || 'PPDB-2025-0001'}</p>
                <p>Bank: [Bank Transfer]</p>
                <p>Jumlah: Rp 150.000</p>
              </div>
            </div>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="bg-gradient-to-br from-green-600 to-emerald-700 rounded-2xl shadow-xl p-8 text-white"
          >
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3">
              <Phone className="w-6 h-6" />
              Butuh Bantuan?
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Sekretariat PPDB</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-medium">Alamat:</p>
                      <p className="text-green-100">
                        Jl. Imam Syafi'i No. 123<br />
                        Blitar, Jawa Timur 66111
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5" />
                    <div>
                      <p className="font-medium">Telepon:</p>
                      <p className="text-green-100">0342-123456</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5" />
                    <div>
                      <p className="font-medium">WhatsApp:</p>
                      <p className="text-green-100">0812-3456-7890</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5" />
                    <div>
                      <p className="font-medium">Email:</p>
                      <p className="text-green-100">ppdb@ponpesimamsyafii.id</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Jam Pelayanan</h3>
                <div className="space-y-2 text-green-100">
                  <p>Senin - Jumat: 08:00 - 15:00 WIB</p>
                  <p>Sabtu: 08:00 - 12:00 WIB</p>
                  <p>Minggu & Hari Libur: Tutup</p>
                </div>

                <div className="mt-6">
                  <a
                    href="https://wa.me/6281234567890"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-white text-green-700 font-semibold rounded-lg hover:shadow-lg transition-all"
                  >
                    <Phone className="w-5 h-5" />
                    Chat WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Footer Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
            className="text-center mt-8 p-6 bg-white/50 backdrop-blur rounded-2xl border border-white/20"
          >
            <div className="flex justify-center mb-4">
              <Heart className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Terima Kasih Telah Mempercayai Kami
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Kami berkomitmen memberikan pendidikan terbaik dengan nilai-nilai Islam yang kuat. 
              Semoga anak Anda menjadi generasi yang sholeh, cerdas, dan bermanfaat untuk umat.
            </p>
            <p className="text-green-600 font-semibold mt-4">
              Barakallahu fiikum wa fi awladikum
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}