'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Printer, FileText, Download } from 'lucide-react'
import Link from 'next/link'

export default function QuickActions() {
  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <Button className="w-full justify-start" variant="outline" asChild>
          <Link href="/hr/orders?status=HR_PROCESSING">
            <Printer className="mr-2 h-4 w-4" /> Print Ready Orders
          </Link>
        </Button>
        <Button className="w-full justify-start" variant="outline">
          <FileText className="mr-2 h-4 w-4" /> Generate Monthly Report
        </Button>
        <Button className="w-full justify-start" variant="outline" asChild>
          <Link href="/hr/users/new">
            <Download className="mr-2 h-4 w-4" /> Add New User
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}