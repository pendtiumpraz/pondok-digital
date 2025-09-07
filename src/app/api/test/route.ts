import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    return NextResponse.json({ 
      status: 'ok',
      message: 'API is working',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Test API Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', details: String(error) },
      { status: 500 }
    );
  }
}