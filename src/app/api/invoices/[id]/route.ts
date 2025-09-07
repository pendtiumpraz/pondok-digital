import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { InvoiceGenerator } from '@/lib/subscription/invoice-generator'

interface Params {
  id: string
}

export async function GET(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const invoiceId = params.id
    const { searchParams } = new URL(request.url)
    const format = searchParams.get('format')

    const invoice = await InvoiceGenerator.getInvoice(invoiceId)
    
    if (!invoice) {
      return NextResponse.json(
        { error: 'Invoice not found' },
        { status: 404 }
      )
    }

    // Check if user has access to this invoice
    if (invoice.organizationId !== session.user.tenantId) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    if (format === 'pdf') {
      try {
        const pdfBuffer = await InvoiceGenerator.generateInvoicePDF(invoiceId)
        
        return new NextResponse(pdfBuffer, {
          status: 200,
          headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="invoice-${invoice.invoiceNumber}.pdf"`
          }
        })
      } catch (error) {
        console.error('Error generating PDF:', error)
        return NextResponse.json(
          { error: 'Failed to generate PDF' },
          { status: 500 }
        )
      }
    }

    return NextResponse.json({
      success: true,
      data: invoice
    })

  } catch (error) {
    console.error('Error fetching invoice:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const invoiceId = params.id
    const body = await request.json()
    const { action, transactionId, reason } = body

    if (!action) {
      return NextResponse.json(
        { error: 'Missing required field: action' },
        { status: 400 }
      )
    }

    const invoice = await InvoiceGenerator.getInvoice(invoiceId)
    
    if (!invoice) {
      return NextResponse.json(
        { error: 'Invoice not found' },
        { status: 404 }
      )
    }

    // Check if user has access to this invoice
    if (invoice.organizationId !== session.user.tenantId) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    switch (action) {
      case 'mark_paid':
        await InvoiceGenerator.markInvoicePaid(invoiceId, transactionId)
        return NextResponse.json({
          success: true,
          data: { message: 'Invoice marked as paid' }
        })

      case 'mark_failed':
        await InvoiceGenerator.markInvoiceFailed(invoiceId, reason)
        return NextResponse.json({
          success: true,
          data: { message: 'Invoice marked as failed' }
        })

      case 'send_reminder':
        await InvoiceGenerator.sendInvoiceReminder(invoiceId)
        return NextResponse.json({
          success: true,
          data: { message: 'Reminder sent successfully' }
        })

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        )
    }

  } catch (error) {
    console.error('Error updating invoice:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}