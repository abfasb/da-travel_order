'use client'

import { useState } from 'react'
import { renderToString } from 'react-dom/server'
import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'
import TravelOrderDocument from '@/app/sample/page'
import ProposedItineraryDocument from '@/app/sample/itinerary/page'
import CertificationDocument from '@/app/sample/certification/page'

interface PDFDownloadButtonProps {
  order: any
}

export function PDFDownloadButton({ order }: PDFDownloadButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false)

  const generatePDF = async () => {
    setIsGenerating(true)

    try {
      const isPermanent = order.employmentStatus === 'PERMANENT'

      // Render each document to static HTML
      const travelOrderHtml = renderToString(<TravelOrderDocument data={order} />)
      const itineraryHtml = !isPermanent
        ? renderToString(<ProposedItineraryDocument data={order} />)
        : ''
      const certificationHtml = !isPermanent
        ? renderToString(<CertificationDocument data={order} />)
        : ''

      // Get the current domain so Puppeteer can fetch images
      const origin = typeof window !== 'undefined' ? window.location.origin : ''

      const fullHtml = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            <base href="${origin}">
            
            <script src="https://cdn.tailwindcss.com"></script>
            
            <style>
              @page { size: A4; margin: 0; }
              body {
                margin: 0;
                padding: 0;
                background: white;
                /* Forces background colors and graphics to print */
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important; 
              }
              .page-break { page-break-before: always; }
              
              /* Hide Next.js specific injected elements if they bleed in */
              next-route-announcer { display: none !important; }
            </style>
          </head>
          <body>
            ${travelOrderHtml}
            ${!isPermanent ? `<div class="page-break"></div>${itineraryHtml}` : ''}
            ${!isPermanent ? `<div class=""></div>${certificationHtml}` : ''}
          </body>
        </html>
      `

      const response = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ html: fullHtml }),
      })

      if (!response.ok) throw new Error('PDF generation failed')

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${order.travelOrderNumber || 'travel-order'}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('PDF download error:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Button
      size="sm"
      className="bg-emerald-600 hover:bg-emerald-700 text-white"
      onClick={generatePDF}
      disabled={isGenerating}
    >
      <Download className="mr-2 h-4 w-4" />
      {isGenerating ? 'Generating...' : 'Download PDF'}
    </Button>
  )
}