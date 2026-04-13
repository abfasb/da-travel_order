'use client'

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
import { Eye } from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'

interface TravelOrder {
  id: string
  travelOrderNumber: string | null
  purpose: string
  destinationProvince: string
  departureDate: Date
  returnDate: Date
  status: string
}

const statusVariants: Record<string, any> = {
  PENDING: 'secondary',
  REVIEWING: 'outline',
  APPROVED: 'default',
  REJECTED: 'destructive',
  COMPLETED: 'success',
  HR_PROCESSING: 'secondary',
}

export function RecentTravelsTable({ orders }: { orders: TravelOrder[] }) {
  if (orders.length === 0) {
    return (
      <div className="text-center py-8 text-slate-500">
        No travel orders yet. Create your first travel request!
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>TO Number</TableHead>
          <TableHead>Purpose</TableHead>
          <TableHead>Destination</TableHead>
          <TableHead>Dates</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map(order => (
          <TableRow key={order.id}>
            <TableCell className="font-mono text-sm">
              {order.travelOrderNumber || 'Draft'}
            </TableCell>
            <TableCell className="max-w-[200px] truncate">{order.purpose}</TableCell>
            <TableCell>{order.destinationProvince}</TableCell>
            <TableCell>
              {format(new Date(order.departureDate), 'MMM dd')} –{' '}
              {format(new Date(order.returnDate), 'MMM dd, yyyy')}
            </TableCell>
            <TableCell>
              <Badge variant={statusVariants[order.status] || 'secondary'}>
                {order.status}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              <Button variant="ghost" size="sm" asChild>
                <Link href={`/employee/requests/${order.id}`}>
                  <Eye className="h-4 w-4 mr-1" /> View
                </Link>
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}