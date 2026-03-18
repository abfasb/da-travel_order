'use client'

import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ChevronRight } from 'lucide-react'

// Mock data – replace with real data fetching
const recentRequests = [
  {
    id: 'TO-2026-012',
    destination: 'Palawan',
    purpose: 'Field Inspection',
    date: '2026-03-15',
    status: 'Pending Review',
  },
  {
    id: 'TO-2026-011',
    destination: 'Oriental Mindoro',
    purpose: 'Training',
    date: '2026-03-10',
    status: 'Approved',
  },
  {
    id: 'TO-2026-010',
    destination: 'Marinduque',
    purpose: 'Meeting',
    date: '2026-03-08',
    status: 'Rejected',
  },
  {
    id: 'TO-2026-009',
    destination: 'Romblon',
    purpose: 'Monitoring',
    date: '2026-03-05',
    status: 'HR Processing',
  },
  {
    id: 'TO-2026-008',
    destination: 'Occidental Mindoro',
    purpose: 'Seminar',
    date: '2026-03-01',
    status: 'Completed',
  },
]

const statusColorMap: Record<string, string> = {
  'Pending Review': 'bg-yellow-100 text-yellow-800 border-yellow-200',
  'Approved': 'bg-green-100 text-green-800 border-green-200',
  'Rejected': 'bg-red-100 text-red-800 border-red-200',
  'HR Processing': 'bg-blue-100 text-blue-800 border-blue-200',
  'Completed': 'bg-gray-100 text-gray-800 border-gray-200',
}

export function RecentRequestsTable() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">Recent Travel Requests</CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/employee/requests" className="gap-1">
            View all <ChevronRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Travel No.</TableHead>
              <TableHead>Destination</TableHead>
              <TableHead>Purpose</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentRequests.map((req) => (
              <TableRow key={req.id}>
                <TableCell className="font-medium">{req.id}</TableCell>
                <TableCell>{req.destination}</TableCell>
                <TableCell>{req.purpose}</TableCell>
                <TableCell>{new Date(req.date).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Badge className={statusColorMap[req.status] || ''} variant="outline">
                    {req.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}