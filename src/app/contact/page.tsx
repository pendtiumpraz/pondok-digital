'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Phone, Mail, MapPin, Clock, Send, MessageSquare,
  Facebook, Instagram, Twitter, Youtube, CheckCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    yayasan: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setIsSubmitting(false)
    setIsSubmitted(true)
    
    // Reset after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false)
      setFormData({
        name: '',
        email: '',
        phone: '',
        yayasan: '',
        message: ''
      })
    }, 3000)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const contactInfo = [
    {
      icon: Phone,
      title: 'Telepon',
      content: '+62 812-3456-7890',
      subContent: 'Senin - Jumat, 08:00 - 17:00 WIB'
    },
    {
      icon: Mail,
      title: 'Email',
      content: 'info@pondokdigital.id',
      subContent: 'support@pondokdigital.id'
    },
    {
      icon: MapPin,
      title: 'Alamat',
      content: 'Jl. Teknologi No. 123',
      subContent: 'Jakarta Selatan, Indonesia 12345'
    },
    {
      icon: MessageSquare,
      title: 'WhatsApp',
      content: '+62 812-3456-7890',
      subContent: 'Respon cepat via WhatsApp'
    }
  ]

  const socialMedia = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Youtube, href: '#', label: 'YouTube' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-blue-50 opacity-50" />
        <div className="container mx-auto relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Hubungi <span className="text-green-600">Kami</span>
            </h1>
            <p className="text-xl text-gray-600">
              Tim kami siap membantu Anda dalam transformasi digital pesantren. 
              Konsultasi gratis untuk mengetahui solusi terbaik untuk yayasan Anda.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((info, index) => (
              <motion.div
                key={info.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 h-full hover:shadow-lg transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-green-100 text-green-600 rounded-lg">
                      <info.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">{info.title}</h3>
                      <p className="text-gray-900 font-medium">{info.content}</p>
                      <p className="text-sm text-gray-600">{info.subContent}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Map */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Card className="p-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  Kirim Pesan
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nama Lengkap *
                      </label>
                      <Input
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="Nama Anda"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email *
                      </label>
                      <Input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="email@example.com"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        No. Telepon
                      </label>
                      <Input
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+62 812-xxxx-xxxx"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nama Yayasan
                      </label>
                      <Input
                        name="yayasan"
                        value={formData.yayasan}
                        onChange={handleChange}
                        placeholder="Yayasan/Pesantren Anda"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pesan *
                    </label>
                    <Textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      placeholder="Ceritakan kebutuhan Anda..."
                    />
                  </div>

                  <Button 
                    type="submit" 
                    size="lg" 
                    className="w-full"
                    disabled={isSubmitting || isSubmitted}
                  >
                    {isSubmitted ? (
                      <>
                        <CheckCircle className="mr-2 h-5 w-5" />
                        Pesan Terkirim!
                      </>
                    ) : isSubmitting ? (
                      'Mengirim...'
                    ) : (
                      <>
                        <Send className="mr-2 h-5 w-5" />
                        Kirim Pesan
                      </>
                    )}
                  </Button>
                </form>
              </Card>
            </motion.div>

            {/* Info & Map */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              {/* Office Hours */}
              <Card className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Jam Operasional
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-gray-600">Senin - Jumat</span>
                    <span className="font-medium text-gray-900">08:00 - 17:00 WIB</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-gray-600">Sabtu</span>
                    <span className="font-medium text-gray-900">09:00 - 15:00 WIB</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600">Minggu & Hari Libur</span>
                    <span className="font-medium text-red-600">Tutup</span>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-800">
                    <Clock className="inline-block w-4 h-4 mr-1" />
                    Respon email dalam 1x24 jam pada hari kerja
                  </p>
                </div>
              </Card>

              {/* Social Media */}
              <Card className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Ikuti Kami
                </h3>
                <p className="text-gray-600 mb-6">
                  Dapatkan update terbaru dan tips manajemen pesantren di media sosial kami
                </p>
                <div className="flex gap-4">
                  {socialMedia.map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      className="p-3 bg-gray-100 text-gray-600 rounded-lg hover:bg-green-100 hover:text-green-600 transition-colors"
                      aria-label={social.label}
                    >
                      <social.icon className="h-5 w-5" />
                    </a>
                  ))}
                </div>
              </Card>

              {/* Map Placeholder */}
              <Card className="p-8 h-64 flex items-center justify-center bg-gray-100">
                <div className="text-center">
                  <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600">Peta Lokasi</p>
                  <p className="text-sm text-gray-500">Google Maps integration</p>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ CTA */}
      <section className="py-20 px-4 bg-gradient-to-br from-green-600 to-blue-600">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Punya Pertanyaan Lain?
            </h2>
            <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
              Cek halaman FAQ kami atau langsung konsultasi dengan tim sales
            </p>
            <div className="flex gap-4 justify-center">
              <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100">
                Lihat FAQ
              </Button>
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10">
                Chat WhatsApp
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}