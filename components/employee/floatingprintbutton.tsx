'use client'

import { Button } from '@/components/ui/button'
import { Printer } from 'lucide-react'

export function FloatingPrintButton() {
  return (
    <div className="fixed bottom-6 right-6 print:hidden md:hidden">
      <Button
        onClick={() => window.print()}
        className="rounded-full shadow-lg bg-emerald-600 hover:bg-emerald-700"
      >
        <Printer className="w-4 h-4 mr-2" />
        Print
      </Button>
    </div>
  )
}