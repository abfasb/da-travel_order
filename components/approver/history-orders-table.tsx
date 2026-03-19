'use client'

import { format } from 'date-fns'
import { Eye } from 'lucide-react'
import Link from 'next/link'
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

export default function HistoryOrdersTable({ orders, userRole }: any) {
  const statusColor: Record<string, string> = {
    APPROVED: 'border-green-200 bg-green-50 text-green-700',
    REJECTED: 'border-red-200 bg-red-50 text-red-700',
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Previously Processed</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee</TableHead>
              <TableHead>Destination</TableHead>
              <TableHead>Travel Dates</TableHead>
              <TableHead>Your Decision</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order: any) => {
              const myApproval = order.approvals[0]
              return (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">
                    {order.user.firstName} {order.user.lastName}
                  </TableCell>
                  <TableCell>{order.destinationProvince}</TableCell>
                  <TableCell>
                    {format(new Date(order.departureDate), 'MMM d')} –{' '}
                    {format(new Date(order.returnDate), 'MMM d, yyyy')}
                  </TableCell>
                  <TableCell>
                    <Badge className={statusColor[myApproval?.status]}>
                      {myApproval?.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/employee/requests/${order.id}`} target="_blank">
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              )
            })}
            {orders.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  No history found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}