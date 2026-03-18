'use client'

import React, { use } from 'react'
import Link from 'next/link'
import { ArrowLeft, Printer } from 'lucide-react'
import { Button } from '@/components/ui/button'
import TravelOrderDocument from '@/app/sample/page'

export default function TravelOrderViewPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const travelId = resolvedParams.id

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between bg-white p-4 border-b rounded-t-xl mb-4 print:hidden shadow-sm">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/employee/history">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h2 className="font-bold text-lg">Viewing Request</h2>
            <p className="text-xs text-muted-foreground text-emerald-600 font-medium">
              {travelId}
            </p>
          </div>
        </div>

        <Button 
          onClick={() => window.print()} 
          className="bg-emerald-600 hover:bg-emerald-700 text-white"
        >
          <Printer className="w-4 h-4 mr-2" />
          Print Document
        </Button>
      </div>

      <div className="flex-1 overflow-auto rounded-xl">
        <TravelOrderDocument />
      </div>
    </div>
  )
}