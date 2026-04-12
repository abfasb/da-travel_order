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
      }, 800) 
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
            margin: 0; 
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

          body {
            background: white !important;
          }

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
            overflow: hidden;
            break-before: page;
            clear: both;
          }
        }

        .print-content {
          overflow: visible !important; /* Ensure content isn't clipped */
          position: static !important;
          background: #f5f5f5;
          min-height: 90vh;
          padding: 0 0;
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