'use client'

import { useState } from 'react'
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
import { Eye, Printer, Hash } from 'lucide-react'
import { AssignNumberModal } from './assign-number-modal'

// Mock data – replace with real data
const pendingOrders = [
  {
    id: '1',
    travelOrderNumber: null,
    requestorName: 'Juan Dela Cruz',
    destinationProvince: 'Palawan',
    departureDate: '2026-03-20',
    returnDate: '2026-03-25',
    status: 'APPROVED',
  },
  {
    id: '2',
    travelOrderNumber: null,
    requestorName: 'Maria Santos',
    destinationProvince: 'Oriental Mindoro',
    departureDate: '2026-03-22',
    returnDate: '2026-03-24',
    status: 'APPROVED',
  },
  // ... more
]

export function RecentOrdersTable() {
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [modalOpen, setModalOpen] = useState(false)

  const handleAssignNumber = (order: any) => {
    setSelectedOrder(order)
    setModalOpen(true)
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Orders Awaiting Number Assignment</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Destination</TableHead>
                <TableHead>Travel Dates</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pendingOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.requestorName}</TableCell>
                  <TableCell>{order.destinationProvince}</TableCell>
                  <TableCell>
                    {new Date(order.departureDate).toLocaleDateString()} –{' '}
                    {new Date(order.returnDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Badge className="bg-green-100 text-green-800 border-green-200">
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-1">
                    <Button variant="ghost" size="sm" onClick={() => handleAssignNumber(order)}>
                      <Hash className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" asChild>
                      <a href={`/hr/orders/${order.id}`} target="_blank">
                        <Eye className="h-4 w-4" />
                      </a>
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Printer className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AssignNumberModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        order={selectedOrder}
      />
    </>
  )
}