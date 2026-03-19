'use client'

import Link from 'next/link'
import { format } from 'date-fns'
import { Eye, PenSquare } from 'lucide-react'
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface PendingOrdersTableProps {
  orders: any[]
  userRole: string
}

export default function PendingOrdersTable({ orders, userRole }: PendingOrdersTableProps) {
  const roleDisplayNames: Record<string, string> = {
    APCO: 'APCO',
    CHIEF_AGRICULTURIST: 'Chief Agriculturist',
    CHIEF_ADMINISTRATIVE: 'Chief Admin',
    REGIONAL_EXECUTIVE: 'Regional Director',
  }

  if (orders.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <p className="text-muted-foreground">No pending approvals for your role.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Travel Orders for {roleDisplayNames[userRole]}</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee</TableHead>
              <TableHead>Destination</TableHead>
              <TableHead>Travel Dates</TableHead>
              <TableHead>Submitted</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">
                  {order.user.firstName} {order.user.lastName}
                  <div className="text-xs text-muted-foreground">{order.user.division}</div>
                </TableCell>
                <TableCell>{order.destinationProvince}</TableCell>
                <TableCell>
                  {format(new Date(order.departureDate), 'MMM d')} – {format(new Date(order.returnDate), 'MMM d, yyyy')}
                </TableCell>
                <TableCell>{format(new Date(order.createdAt), 'MMM d, yyyy')}</TableCell>
                <TableCell className="text-right space-x-1">
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/approvers/approvals/${order.id}`}>
                      <PenSquare className="h-4 w-4" />
                      <span className="sr-only">Sign</span>
                    </Link>
                  </Button>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/employee/requests/${order.id}`} target="_blank">
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">View</span>
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}