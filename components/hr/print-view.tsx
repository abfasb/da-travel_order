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
      const timer = setTimeout(() => {
        window.print()
      }, 800) // Slightly longer delay to ensure images/logos load
      return () => clearTimeout(timer)
    }
  }, [])

  const isPermanent = order.employmentStatus === 'PERMANENT'

  return (
    <>
      <style jsx global>{`
        @media print {
          @page {
            size: A4;
            margin: 0; /* Let the components handle their own padding */
          }

          body {
            background: white !important;
          }

          /* Force the container to take the full width of the paper */
          .print-content {
            width: 100% !important;
            max-width: none !important;
            margin: 0 !important;
            padding: 0 !important;
          }

          .print-content > div, 
          .print-content > section,
          .print-content > article {
            width: 100% !important;
            max-width: none !important;
            margin: 0 !important;
            box-shadow: none !important;
          }

          .page-break {
            page-break-before: always;
            display: block;
            height: 0;
          }
        }

        .print-content {
          background: #f5f5f5;
          min-height: 100vh;
          padding: 2rem 0;
        }
      `}</style>

      <div className="print-button fixed top-4 right-4 z-50 no-print">
        <Button onClick={() => window.print()} className="shadow-lg">
          <Printer className="mr-2 h-4 w-4" />
          Print Documents
        </Button>
      </div>

      <div className="print-content">
        <div className="mx-auto bg-white shadow-none print:shadow-none">
          <TravelOrderDocument data={order} />
          
          {!isPermanent && (
            <>
              <div className="page-break" />
              <ProposedItineraryDocument data={order} />
              <div className="page-break" />
              <CertificationDocument data={order} />
            </>
          )}
        </div>
      </div>
    </>
  )
}