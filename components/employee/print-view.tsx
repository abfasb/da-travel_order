'use client'

import { useEffect, useRef } from 'react'
import TravelOrderDocument from '@/app/sample/page'
import ProposedItineraryDocument from '@/app/sample/itinerary/page'
import CertificationDocument from '@/app/sample/certification/page'
import { Button } from '@/components/ui/button'
import { Printer } from 'lucide-react'

export default function PrintView({ order }: { order: any }) {
  const hasPrinted = useRef(false)

  useEffect(() => {
    if (!hasPrinted.current) {
      hasPrinted.current = true
      // Use requestAnimationFrame to ensure DOM is fully rendered
      const frame = requestAnimationFrame(() => {
        setTimeout(() => {
          window.print()
        }, 300)
      })
      return () => {
        cancelAnimationFrame(frame)
      }
    }
  }, [])

  const isPermanent = order.employmentStatus === 'PERMANENT'

  return (
    <>
      <style jsx global>{`
        /* Reset all margins/paddings for print */
        @media print {
          @page {
            size: A4;
            margin: 12mm;
          }

          html, body {
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }

            html, body {
            overflow: hidden !important;
            height: auto !important;
            margin: 0 !important;
            padding: 0 !important;
          }
            

         
        * {
          -ms-overflow-style: none !important;  /* IE and Edge */
          scrollbar-width: none !important;     /* Firefox */
        }

        *::-webkit-scrollbar {
          display: none !important;            
        }

          /* Hide all UI chrome */
          aside, .sidebar, nav, header, footer, .print-button, .no-print {
            display: none !important;
          }

          /* Ensure print content takes full width */
          .print-content {
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
          }

          /* Remove shadows and borders from document containers */
          .print-content > div,
          .print-content > section {
            box-shadow: none !important;
            border: none !important;
            background: white !important;
          }

          /* Clean page breaks */
          .page-break {
            page-break-before: always;
            break-before: page;
          }

          /* Force hardware acceleration for smoother scrolling */
          .print-content * {
            -webkit-transform: translateZ(0);
            transform: translateZ(0);
          }
        }

        /* Screen-only styles (visible before print) */
        .print-content {
          background: #f5f5f5;
          min-height: 100vh;
          padding: 20px 0;
        }

        .print-content > div {
          margin: 0 auto;
          background: white;
        }
      `}</style>

      {/* Manual print button */}
      <div className="print-button fixed top-4 right-4 z-50">
        <Button onClick={() => window.print()} className="shadow-lg">
          <Printer className="mr-2 h-4 w-4" />
          Print Documents
        </Button>
      </div>

      {/* Document container */}
      <div className="print-content">
        <div className="mx-auto max-w-none bg-white shadow-none">
          <TravelOrderDocument data={order} />

          {!isPermanent && (
            <>
              <div className="" />
              <ProposedItineraryDocument data={order} />
              <div className="" />
              <CertificationDocument data={order} />
            </>
          )}
        </div>
      </div>
    </>
  )
}