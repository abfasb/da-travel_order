'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
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
import { Hash, Eye, Printer } from 'lucide-react'
import AssignNumberModal from './assign-number-modal'
import { format } from 'date-fns'
import Link from 'next/link'

interface Order {
  id: string
  requestorName: string
  destinationProvince: string
  departureDate: string
  returnDate: string
  status: string
  travelOrderNumber: string | null
}

interface RecentOrdersTableProps {
  initialOrders: Order[]
}

export default function RecentOrdersTable({ initialOrders }: RecentOrdersTableProps) {
  const router = useRouter()
  const [orders, setOrders] = useState(initialOrders)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  const handleAssignNumber = (order: Order) => {
    setSelectedOrder(order)
    setModalOpen(true)
  }

  const handleNumberAssigned = (orderId: string, travelOrderNumber: string) => {
    // Remove the order from the list
    setOrders(prev => prev.filter(o => o.id !== orderId))
    // Refresh the page data (optional)
    router.refresh()
  }

  const handlePrint = (order: Order) => {
    // Open print view
    window.open(`/hr/orders/${order.id}/print`, '_blank')
  }

  return (
    <>
      <Card className="border-0 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Awaiting Number Assignment</CardTitle>
          <Button variant="outline" size="sm" asChild>
            <Link href="/hr/orders">View All</Link>
          </Button>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              No orders awaiting number assignment.
            </div>
          ) : (
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
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.requestorName}</TableCell>
                    <TableCell>{order.destinationProvince}</TableCell>
                    <TableCell>
                      {format(new Date(order.departureDate), 'MMM dd')} –{' '}
                      {format(new Date(order.returnDate), 'MMM dd, yyyy')}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        Approved
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleAssignNumber(order)}
                          title="Assign Travel Order Number"
                        >
                          <Hash className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/hr/orders/${order.id}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handlePrint(order)}
                          disabled={!order.travelOrderNumber}
                          title="Print Travel Order"
                        >
                          <Printer className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <AssignNumberModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        order={selectedOrder}
        onSuccess={handleNumberAssigned}
      />
    </>
  )
}