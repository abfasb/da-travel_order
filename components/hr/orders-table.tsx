'use client'

import { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Eye, Printer, Hash, Search, Filter } from 'lucide-react'

// Mock data
const allOrders = Array.from({ length: 50 }, (_, i) => ({
  id: `${i}`,
  travelOrderNumber: i % 3 === 0 ? `TO-2026-${100 + i}` : null,
  requestorName: `Employee ${i + 1}`,
  destinationProvince: ['Palawan', 'Oriental Mindoro', 'Marinduque', 'Romblon', 'Occidental Mindoro'][i % 5],
  departureDate: `2026-03-${10 + (i % 20)}`,
  returnDate: `2026-03-${12 + (i % 20)}`,
  status: ['PENDING', 'APPROVED', 'HR_PROCESSING', 'COMPLETED'][i % 4],
}))

const statusColorMap: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  APPROVED: 'bg-green-100 text-green-800 border-green-200',
  HR_PROCESSING: 'bg-blue-100 text-blue-800 border-blue-200',
  COMPLETED: 'bg-gray-100 text-gray-800 border-gray-200',
}

const ITEMS_PER_PAGE = 10

export function OrdersTable() {
  const [currentPage, setCurrentPage] = useState(1)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')

  const filteredOrders = allOrders.filter((order) => {
    const matchesSearch = order.requestorName.toLowerCase().includes(search.toLowerCase()) ||
      (order.travelOrderNumber && order.travelOrderNumber.includes(search))
    const matchesStatus = statusFilter === 'ALL' || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const paginatedOrders = filteredOrders.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Travel Orders</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by employee or TO number..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Statuses</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="APPROVED">Approved</SelectItem>
              <SelectItem value="HR_PROCESSING">HR Processing</SelectItem>
              <SelectItem value="COMPLETED">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>TO Number</TableHead>
                <TableHead>Employee</TableHead>
                <TableHead>Destination</TableHead>
                <TableHead>Travel Dates</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">
                    {order.travelOrderNumber || <span className="text-muted-foreground italic">Not assigned</span>}
                  </TableCell>
                  <TableCell>{order.requestorName}</TableCell>
                  <TableCell>{order.destinationProvince}</TableCell>
                  <TableCell>
                    {new Date(order.departureDate).toLocaleDateString()} –{' '}
                    {new Date(order.returnDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Badge className={statusColorMap[order.status]} variant="outline">
                      {order.status.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-1">
                    {!order.travelOrderNumber && (
                      <Button variant="ghost" size="sm">
                        <Hash className="h-4 w-4" />
                      </Button>
                    )}
                    <Button variant="ghost" size="sm" asChild>
                      <a href={`/hr/orders/${order.id}`} target="_blank">
                        <Eye className="h-4 w-4" />
                      </a>
                    </Button>
                    {order.travelOrderNumber && (
                      <Button variant="ghost" size="sm">
                        <Printer className="h-4 w-4" />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  if (currentPage > 1) setCurrentPage(currentPage - 1)
                }}
                className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
              />
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    setCurrentPage(page)
                  }}
                  isActive={currentPage === page}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  if (currentPage < totalPages) setCurrentPage(currentPage + 1)
                }}
                className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </CardContent>
    </Card>
  )
}