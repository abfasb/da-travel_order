"use client" 

import { Button } from '@/components/ui/button'
import { Printer } from 'lucide-react'

export default function PrintButton() {
  return (
    <Button
      onClick={() => window.print()}
      className="bg-emerald-600 hover:bg-emerald-700 text-white"
    >
      <Printer className="w-4 h-4 mr-2" />
      Print Document
    </Button>
  )
}