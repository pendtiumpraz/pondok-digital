import { prisma } from '../prisma'
import { 
  Invoice, 
  InvoiceItem, 
  PaymentStatus, 
  SubscriptionTier,
  PaymentTransaction,
  CreateInvoiceParams
} from './types'
import { PricingService } from './pricing'
import jsPDF from 'jspdf'


export interface InvoiceTemplate {
  companyName: string
  companyAddress: string
  companyPhone: string
  companyEmail: string
  companyWebsite: string
  logoUrl?: string
  taxRate: number
}

export class InvoiceGenerator {
  private static readonly TAX_RATE = 0.11 // PPN 11%
  
  private static readonly COMPANY_INFO: InvoiceTemplate = {
    companyName: 'Pondok Digital Indonesia',
    companyAddress: 'Jl. Teknologi No. 123, Jakarta Selatan 12345',
    companyPhone: '+62 21 1234 5678',
    companyEmail: 'billing@pondokdigital.id',
    companyWebsite: 'www.pondokdigital.id',
    taxRate: 0.11
  }

  /**
   * Create a new invoice
   */
  static async createInvoice(params: CreateInvoiceParams): Promise<string> {
    const invoiceNumber = this.generateInvoiceNumber()
    const dueDate = params.dueDate || this.getDefaultDueDate()
    
    // Calculate amounts
    const subtotal = params.amount
    const discount = params.discountPercent ? (subtotal * (params.discountPercent / 100)) : 0
    const taxableAmount = subtotal - discount
    const tax = taxableAmount * this.TAX_RATE
    const total = taxableAmount + tax

    // Default invoice items if not provided
    const items = params.items || [{
      id: `item-${Date.now()}`,
      description: params.description,
      quantity: 1,
      unitPrice: params.amount,
      amount: params.amount
    }]

    try {
      const invoice = await prisma.invoice.create({
        data: {
          subscriptionId: params.subscriptionId,
          organizationId: params.organizationId,
          invoiceNumber,
          amount: params.amount,
          currency: 'IDR',
          status: PaymentStatus.PENDING,
          dueDate,
          subtotal,
          tax,
          discount,
          total,
          notes: params.notes ? params.notes : (items ? JSON.stringify(items) : null)
        }
      })

      if (!invoice) {
        throw new Error('Failed to create invoice')
      }

      // Generate PDF invoice
      await this.generateInvoicePDF(invoice.id)

      return invoice.id
    } catch (error) {
      console.error('Error creating invoice:', error)
      throw error
    }
  }

  /**
   * Generate invoice PDF
   */
  static async generateInvoicePDF(invoiceId: string): Promise<Buffer> {
    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId },
      include: {
        subscription: true,
        tenant: true
      }
    })

    if (!invoice) {
      throw new Error('Invoice not found')
    }

    const pdf = new jsPDF('p', 'mm', 'a4')
    
    // Set fonts
    pdf.setFont('helvetica')
    
    // Company header
    pdf.setFontSize(20)
    pdf.setTextColor(51, 51, 51)
    pdf.text(this.COMPANY_INFO.companyName, 20, 25)
    
    pdf.setFontSize(10)
    pdf.setTextColor(102, 102, 102)
    pdf.text(this.COMPANY_INFO.companyAddress, 20, 35)
    pdf.text(`Tel: ${this.COMPANY_INFO.companyPhone}`, 20, 40)
    pdf.text(`Email: ${this.COMPANY_INFO.companyEmail}`, 20, 45)
    pdf.text(`Web: ${this.COMPANY_INFO.companyWebsite}`, 20, 50)

    // Invoice title
    pdf.setFontSize(24)
    pdf.setTextColor(51, 51, 51)
    pdf.text('INVOICE', 140, 25)

    // Invoice details box
    pdf.setFillColor(248, 249, 250)
    pdf.rect(140, 35, 50, 30, 'F')
    
    pdf.setFontSize(10)
    pdf.setTextColor(102, 102, 102)
    pdf.text('Invoice Number:', 145, 42)
    pdf.text('Invoice Date:', 145, 47)
    pdf.text('Due Date:', 145, 52)
    pdf.text('Status:', 145, 57)

    pdf.setTextColor(51, 51, 51)
    pdf.text(invoice.invoiceNumber, 145, 42)
    pdf.text(invoice.createdAt.toLocaleDateString('id-ID'), 145, 47)
    pdf.text(invoice.dueDate.toLocaleDateString('id-ID'), 145, 52)
    
    // Status with color
    const statusColor = this.getStatusColor(invoice.status as PaymentStatus)
    pdf.setTextColor(statusColor.r, statusColor.g, statusColor.b)
    pdf.text(this.getStatusText(invoice.status as PaymentStatus), 145, 57)

    // Bill to section
    pdf.setFontSize(12)
    pdf.setTextColor(51, 51, 51)
    pdf.text('TAGIHAN UNTUK:', 20, 80)

    pdf.setFontSize(10)
    pdf.text(invoice.tenant?.name || 'Unknown Organization', 20, 90)
    
    // Get contact info from settings if available
    const settings = (invoice.tenant?.settings as any) || {}
    if (settings.address) {
      pdf.text(settings.address, 20, 95)
    }
    if (settings.phone) {
      pdf.text(`Tel: ${settings.phone}`, 20, 100)
    }
    if (settings.email) {
      pdf.text(`Email: ${settings.email}`, 20, 105)
    }

    // Invoice items table
    const tableStartY = 125
    
    // Table header
    pdf.setFillColor(51, 51, 51)
    pdf.rect(20, tableStartY, 170, 8, 'F')
    
    pdf.setFontSize(10)
    pdf.setTextColor(255, 255, 255)
    pdf.text('DESKRIPSI', 25, tableStartY + 5)
    pdf.text('QTY', 120, tableStartY + 5)
    pdf.text('HARGA SATUAN', 135, tableStartY + 5)
    pdf.text('JUMLAH', 170, tableStartY + 5)

    // Table rows
    let currentY = tableStartY + 8
    pdf.setTextColor(51, 51, 51)
    
    const items = invoice.notes ? (typeof invoice.notes === 'string' ? JSON.parse(invoice.notes) : []) : []
    items.forEach((item: any, index: number) => {
      const rowY = currentY + (index * 8) + 5
      
      // Alternate row colors
      if (index % 2 === 1) {
        pdf.setFillColor(248, 249, 250)
        pdf.rect(20, currentY + (index * 8), 170, 8, 'F')
      }
      
      pdf.text(item.description, 25, rowY)
      pdf.text(item.quantity.toString(), 120, rowY)
      pdf.text(PricingService.formatPrice(item.unitPrice), 135, rowY)
      pdf.text(PricingService.formatPrice(item.amount), 170, rowY)
    })

    // Summary section
    const summaryStartY = currentY + (items.length * 8) + 20
    const summaryX = 130

    pdf.setFontSize(10)
    pdf.text('Subtotal:', summaryX, summaryStartY)
    pdf.text(PricingService.formatPrice(invoice.subtotal), 170, summaryStartY)

    if (invoice.discount > 0) {
      pdf.text('Diskon:', summaryX, summaryStartY + 8)
      pdf.text(`-${PricingService.formatPrice(invoice.discount)}`, 170, summaryStartY + 8)
    }

    pdf.text('PPN (11%):', summaryX, summaryStartY + 16)
    pdf.text(PricingService.formatPrice(invoice.tax), 170, summaryStartY + 16)

    // Total
    pdf.setFillColor(51, 51, 51)
    pdf.rect(summaryX - 5, summaryStartY + 20, 65, 8, 'F')
    
    pdf.setFontSize(12)
    pdf.setTextColor(255, 255, 255)
    pdf.text('TOTAL:', summaryX, summaryStartY + 26)
    pdf.text(PricingService.formatPrice(invoice.total), 170, summaryStartY + 26)

    // Payment instructions
    const paymentY = summaryStartY + 40
    pdf.setFontSize(12)
    pdf.setTextColor(51, 51, 51)
    pdf.text('PETUNJUK PEMBAYARAN:', 20, paymentY)

    pdf.setFontSize(10)
    pdf.setTextColor(102, 102, 102)
    const instructions = [
      '1. Pembayaran dapat dilakukan melalui transfer bank, e-wallet, atau QRIS',
      '2. Silakan gunakan nomor invoice sebagai referensi pembayaran',
      '3. Konfirmasi pembayaran akan dikirim otomatis setelah pembayaran terverifikasi',
      '4. Untuk bantuan, hubungi customer service kami'
    ]

    instructions.forEach((instruction, index) => {
      pdf.text(instruction, 20, paymentY + 10 + (index * 5))
    })

    // Footer
    pdf.setFontSize(8)
    pdf.setTextColor(153, 153, 153)
    pdf.text('Terima kasih atas kepercayaan Anda menggunakan layanan Pondok Digital Indonesia', 20, 280)
    
    return Buffer.from(pdf.output('arraybuffer'))
  }

  /**
   * Mark invoice as paid
   */
  static async markInvoicePaid(invoiceId: string, paymentTransactionId?: string): Promise<void> {
    try {
      await prisma.invoice.update({
        where: { id: invoiceId },
        data: {
          status: PaymentStatus.SUCCESS,
          paidDate: new Date(),
          transactionId: paymentTransactionId,
          updatedAt: new Date()
        }
      })
    } catch (error) {
      console.error('Error marking invoice as paid:', error)
      throw error
    }
  }

  /**
   * Mark invoice as failed
   */
  static async markInvoiceFailed(invoiceId: string, reason?: string): Promise<void> {
    try {
      await prisma.invoice.update({
        where: { id: invoiceId },
        data: {
          status: PaymentStatus.FAILED,
          notes: reason ? `${reason}` : undefined,
          updatedAt: new Date()
        }
      })
    } catch (error) {
      console.error('Error marking invoice as failed:', error)
      throw error
    }
  }

  /**
   * Get invoice by ID
   */
  static async getInvoice(invoiceId: string): Promise<any> {
    return await prisma.invoice.findUnique({
      where: { id: invoiceId },
      include: {
        subscription: true,
        tenant: true
      }
    })
  }

  /**
   * Get invoices for organization
   */
  static async getInvoicesForOrganization(
    organizationId: string,
    options: {
      limit?: number
      offset?: number
      status?: PaymentStatus
      dateFrom?: Date
      dateTo?: Date
    } = {}
  ): Promise<{invoices: any[], total: number}> {
    const where: any = { organizationId }
    
    if (options.status) {
      where.status = options.status
    }
    
    if (options.dateFrom || options.dateTo) {
      where.createdAt = {}
      if (options.dateFrom) where.createdAt.gte = options.dateFrom
      if (options.dateTo) where.createdAt.lte = options.dateTo
    }

    const [invoices, total] = await Promise.all([
      prisma.invoice.findMany({
        where,
        include: {
          subscription: true
        },
        orderBy: { createdAt: 'desc' },
        take: options.limit || 20,
        skip: options.offset || 0
      }),
      prisma.invoice.count({ where })
    ])

    return {
      invoices: invoices || [],
      total: total || 0
    }
  }

  /**
   * Get overdue invoices
   */
  static async getOverdueInvoices(): Promise<any[]> {
    const today = new Date()
    
    return await prisma.invoice.findMany({
      where: {
        status: PaymentStatus.PENDING,
        dueDate: { lt: today }
      },
      include: {
        subscription: true,
        tenant: true
      }
    }) || []
  }

  /**
   * Send invoice reminder
   */
  static async sendInvoiceReminder(invoiceId: string): Promise<void> {
    const invoice = await this.getInvoice(invoiceId)
    
    if (!invoice) {
      throw new Error('Invoice not found')
    }

    try {
      // Send notification to organization admins
      const admins = await prisma.user.findMany({
        where: {
          tenantId: invoice.tenantId,
          role: 'ADMIN',
          isActive: true
        }
      })

      const daysOverdue = Math.ceil((new Date().getTime() - invoice.dueDate.getTime()) / (1000 * 60 * 60 * 24))
      const isOverdue = daysOverdue > 0

      for (const admin of admins) {
        await prisma.notification?.create({
          data: {
            userId: admin.id,
            title: isOverdue ? 'Invoice Jatuh Tempo' : 'Reminder Pembayaran',
            message: isOverdue 
              ? `Invoice ${invoice.invoiceNumber} telah jatuh tempo ${daysOverdue} hari yang lalu. Total: ${PricingService.formatPrice(invoice.total)}`
              : `Invoice ${invoice.invoiceNumber} akan jatuh tempo pada ${invoice.dueDate.toLocaleDateString('id-ID')}. Total: ${PricingService.formatPrice(invoice.total)}`,
            type: 'BILLING_ALERT',
            data: JSON.stringify({
              invoiceId,
              invoiceNumber: invoice.invoiceNumber,
              amount: invoice.total,
              dueDate: invoice.dueDate,
              isOverdue,
              daysOverdue
            })
          }
        })
      }
    } catch (error) {
      console.error('Error sending invoice reminder:', error)
      throw error
    }
  }

  /**
   * Process overdue invoices
   */
  static async processOverdueInvoices(): Promise<void> {
    const overdueInvoices = await this.getOverdueInvoices()
    
    for (const invoice of overdueInvoices) {
      try {
        await this.sendInvoiceReminder(invoice.id)
        
        // Check if subscription should be suspended
        const daysOverdue = Math.ceil((new Date().getTime() - invoice.dueDate.getTime()) / (1000 * 60 * 60 * 24))
        
        if (daysOverdue >= 30) { // Suspend after 30 days overdue
          const subscription = await prisma.subscription.findUnique({
            where: { id: invoice.subscriptionId }
          })
          
          if (subscription && subscription.status !== 'SUSPENDED') {
            await prisma.subscription.update({
              where: { id: subscription.id },
              data: {
                status: 'SUSPENDED',
                updatedAt: new Date()
              }
            })
          }
        }
      } catch (error) {
        console.error(`Failed to process overdue invoice ${invoice.id}:`, error)
      }
    }
  }

  /**
   * Generate invoice number
   */
  private static generateInvoiceNumber(): string {
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const timestamp = now.getTime().toString().slice(-6)
    
    return `INV-${year}${month}-${timestamp}`
  }

  /**
   * Get default due date (14 days from now)
   */
  private static getDefaultDueDate(): Date {
    const dueDate = new Date()
    dueDate.setDate(dueDate.getDate() + 14)
    return dueDate
  }

  /**
   * Get status color for PDF
   */
  private static getStatusColor(status: PaymentStatus): {r: number, g: number, b: number} {
    switch (status) {
      case PaymentStatus.SUCCESS:
        return { r: 34, g: 197, b: 94 }
      case PaymentStatus.PENDING:
        return { r: 245, g: 158, b: 11 }
      case PaymentStatus.FAILED:
        return { r: 239, g: 68, b: 68 }
      case PaymentStatus.CANCELLED:
        return { r: 107, g: 114, b: 128 }
      default:
        return { r: 107, g: 114, b: 128 }
    }
  }

  /**
   * Get status text in Indonesian
   */
  private static getStatusText(status: PaymentStatus): string {
    switch (status) {
      case PaymentStatus.SUCCESS:
        return 'LUNAS'
      case PaymentStatus.PENDING:
        return 'MENUNGGU'
      case PaymentStatus.FAILED:
        return 'GAGAL'
      case PaymentStatus.CANCELLED:
        return 'DIBATALKAN'
      default:
        return 'TIDAK DIKETAHUI'
    }
  }
}

export default InvoiceGenerator