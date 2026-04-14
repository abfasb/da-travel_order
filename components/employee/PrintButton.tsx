'use client'

import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Printer } from 'lucide-react'
import Link from 'next/link'

interface PrintButtonProps {
  status?: string
}

export default function PrintButton({ status }: PrintButtonProps) {
  const params = useParams()
  const id = params?.id as string

  if (status !== 'COMPLETED') {
    return null
  }

  return (
    <Button asChild variant="outline" size="sm" className="gap-2">
      <Link href={`/employee/requests/${id}/print`} target="_blank">
        <Printer className="h-4 w-4" />
        Print
      </Link>
    </Button>
  )
}