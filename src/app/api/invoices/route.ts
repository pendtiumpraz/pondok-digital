import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { InvoiceGenerator } from '@/lib/subscription/invoice-generator'
import { PaymentStatus } from '@/lib/subscription/types'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const organizationId = session.user.tenantId
    if (!organizationId) {
      return NextResponse.json({ error: 'No organization found' }, { status: 400 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status') as PaymentStatus | null
    const dateFrom = searchParams.get('dateFrom')
    const dateTo = searchParams.get('dateTo')

    const options = {
      limit,
      offset: (page - 1) * limit,
      status: status || undefined,
      dateFrom: dateFrom ? new Date(dateFrom) : undefined,
      dateTo: dateTo ? new Date(dateTo) : undefined
    }

    const result = await InvoiceGenerator.getInvoicesForOrganization(organizationId, options)

    return NextResponse.json({
      success: true,
      data: {
        invoices: result.invoices,
        pagination: {
          page,
          limit,
          total: result.total,
          totalPages: Math.ceil(result.total / limit)
        }
      }
    })

  } catch (error) {
    console.error('Error fetching invoices:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const organizationId = session.user.tenantId
    if (!organizationId) {
      return NextResponse.json({ error: 'No organization found' }, { status: 400 })
    }

    const body = await request.json()
    const {
      subscriptionId,
      amount,
      description,
      dueDate,
      items,
      discountPercent,
      notes
    } = body

    if (!subscriptionId || !amount || !description) {
      return NextResponse.json(
        { error: 'Missing required fields: subscriptionId, amount, description' },
        { status: 400 }
      )
    }

    const invoiceId = await InvoiceGenerator.createInvoice({
      subscriptionId,
      organizationId,
      amount: parseFloat(amount),
      description,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      items,
      discountPercent: discountPercent ? parseFloat(discountPercent) : undefined,
      notes
    })

    return NextResponse.json({
      success: true,
      data: {
        invoiceId,
        message: 'Invoice created successfully'
      }
    })

  } catch (error) {
    console.error('Error creating invoice:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}