import { NextRequest, NextResponse } from 'next/server'
import { generatePDF } from '@/lib/pdf-generator'

export async function POST(req: NextRequest) {
  try {
    const { html } = await req.json()

    if (!html) {
      return NextResponse.json({ error: 'HTML content required' }, { status: 400 })
    }

    const pdfBuffer = await generatePDF(html)

    //@ts-ignore
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="travel-order.pdf"',
      },
    })
  } catch (error) {
    console.error('PDF generation error:', error)
    return NextResponse.json({ error: 'Failed to generate PDF' }, { status: 500 })
  }
}