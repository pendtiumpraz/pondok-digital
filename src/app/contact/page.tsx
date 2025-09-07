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
import SaasHeader from '@/components/layout/SaasHeader'
import SaasFooter from '@/components/layout/SaasFooter'
import { useLanguage } from '@/contexts/LanguageContext'

export default function ContactPage() {
  const { language } = useLanguage()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    yayasan: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const translations = {
    id: {
      title: 'Hubungi',
      titleHighlight: 'Kami',
      subtitle: 'Tim kami siap membantu Anda dalam transformasi digital pesantren. Konsultasi gratis untuk mengetahui solusi terbaik untuk yayasan Anda.',
      phone: 'Telepon',
      phoneSubtitle: 'Senin - Jumat, 08:00 - 17:00 WIB',
      email: 'Email',
      address: 'Alamat',
      addressContent: 'Jl. Teknologi No. 123',
      addressSubcontent: 'Jakarta Selatan, Indonesia 12345',
      whatsapp: 'WhatsApp',
      whatsappSubtitle: 'Respon cepat via WhatsApp',
      sendMessage: 'Kirim Pesan',
      fullName: 'Nama Lengkap',
      fullNamePlaceholder: 'Nama Anda',
      emailPlaceholder: 'email@example.com',
      phoneLabel: 'No. Telepon',
      phonePlaceholder: '+62 812-xxxx-xxxx',
      foundationName: 'Nama Yayasan',
      foundationPlaceholder: 'Yayasan/Pesantren Anda',
      messageLabel: 'Pesan',
      messagePlaceholder: 'Ceritakan kebutuhan Anda...',
      sending: 'Mengirim...',
      sent: 'Pesan Terkirim!',
      send: 'Kirim Pesan',
      operatingHours: 'Jam Operasional',
      monday: 'Senin - Jumat',
      saturday: 'Sabtu',
      sunday: 'Minggu & Hari Libur',
      closed: 'Tutup',
      responseTime: 'Respon email dalam 1x24 jam pada hari kerja',
      followUs: 'Ikuti Kami',
      followSubtitle: 'Dapatkan update terbaru dan tips manajemen pesantren di media sosial kami',
      mapLocation: 'Peta Lokasi',
      mapIntegration: 'Google Maps integration',
      otherQuestions: 'Punya Pertanyaan Lain?',
      otherSubtitle: 'Cek halaman FAQ kami atau langsung konsultasi dengan tim sales',
      viewFaq: 'Lihat FAQ',
      chatWhatsapp: 'Chat WhatsApp'
    },
    en: {
      title: 'Contact',
      titleHighlight: 'Us',
      subtitle: 'Our team is ready to help you with pesantren digital transformation. Free consultation to find the best solution for your foundation.',
      phone: 'Phone',
      phoneSubtitle: 'Monday - Friday, 08:00 - 17:00 WIB',
      email: 'Email',
      address: 'Address',
      addressContent: 'Jl. Teknologi No. 123',
      addressSubcontent: 'South Jakarta, Indonesia 12345',
      whatsapp: 'WhatsApp',
      whatsappSubtitle: 'Quick response via WhatsApp',
      sendMessage: 'Send Message',
      fullName: 'Full Name',
      fullNamePlaceholder: 'Your Name',
      emailPlaceholder: 'email@example.com',
      phoneLabel: 'Phone Number',
      phonePlaceholder: '+62 812-xxxx-xxxx',
      foundationName: 'Foundation Name',
      foundationPlaceholder: 'Your Foundation/Pesantren',
      messageLabel: 'Message',
      messagePlaceholder: 'Tell us your needs...',
      sending: 'Sending...',
      sent: 'Message Sent!',
      send: 'Send Message',
      operatingHours: 'Operating Hours',
      monday: 'Monday - Friday',
      saturday: 'Saturday',
      sunday: 'Sunday & Holidays',
      closed: 'Closed',
      responseTime: 'Email response within 24 hours on working days',
      followUs: 'Follow Us',
      followSubtitle: 'Get the latest updates and pesantren management tips on our social media',
      mapLocation: 'Map Location',
      mapIntegration: 'Google Maps integration',
      otherQuestions: 'Have Other Questions?',
      otherSubtitle: 'Check our FAQ page or directly consult with our sales team',
      viewFaq: 'View FAQ',
      chatWhatsapp: 'Chat WhatsApp'
    }
  }

  const t = translations[language]

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
      title: t.phone,
      content: '+62 812-3456-7890',
      subContent: t.phoneSubtitle
    },
    {
      icon: Mail,
      title: t.email,
      content: 'info@pondokdigital.id',
      subContent: 'support@pondokdigital.id'
    },
    {
      icon: MapPin,
      title: t.address,
      content: t.addressContent,
      subContent: t.addressSubcontent
    },
    {
      icon: MessageSquare,
      title: t.whatsapp,
      content: '+62 812-3456-7890',
      subContent: t.whatsappSubtitle
    }
  ]

  const socialMedia = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Youtube, href: '#', label: 'YouTube' }
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <SaasHeader />
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
              {t.title} <span className="text-green-600">{t.titleHighlight}</span>
            </h1>
            <p className="text-xl text-gray-600">
              {t.subtitle}
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
                  {t.sendMessage}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t.fullName} *
                      </label>
                      <Input
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder={t.fullNamePlaceholder}
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
                        placeholder={t.emailPlaceholder}
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t.phoneLabel}
                      </label>
                      <Input
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder={t.phonePlaceholder}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t.foundationName}
                      </label>
                      <Input
                        name="yayasan"
                        value={formData.yayasan}
                        onChange={handleChange}
                        placeholder={t.foundationPlaceholder}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t.messageLabel} *
                    </label>
                    <Textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      placeholder={t.messagePlaceholder}
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
                        {t.sent}
                      </>
                    ) : isSubmitting ? (
                      t.sending
                    ) : (
                      <>
                        <Send className="mr-2 h-5 w-5" />
                        {t.send}
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
                  {t.operatingHours}
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-gray-600">{t.monday}</span>
                    <span className="font-medium text-gray-900">08:00 - 17:00 WIB</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-gray-600">{t.saturday}</span>
                    <span className="font-medium text-gray-900">09:00 - 15:00 WIB</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600">{t.sunday}</span>
                    <span className="font-medium text-red-600">{t.closed}</span>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-800">
                    <Clock className="inline-block w-4 h-4 mr-1" />
                    {t.responseTime}
                  </p>
                </div>
              </Card>

              {/* Social Media */}
              <Card className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {t.followUs}
                </h3>
                <p className="text-gray-600 mb-6">
                  {t.followSubtitle}
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
                  <p className="text-gray-600">{t.mapLocation}</p>
                  <p className="text-sm text-gray-500">{t.mapIntegration}</p>
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
              {t.otherQuestions}
            </h2>
            <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
              {t.otherSubtitle}
            </p>
            <div className="flex gap-4 justify-center">
              <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100">
                {t.viewFaq}
              </Button>
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10">
                {t.chatWhatsapp}
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
      </div>
      <SaasFooter />
    </div>
  )
}