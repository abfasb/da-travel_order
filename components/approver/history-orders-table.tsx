// components/approver/history-orders-table.tsx
'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { format } from 'date-fns'
import { Eye, Search, ChevronUp, ChevronDown } from 'lucide-react'
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
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface HistoryOrdersTableProps {
  orders: any[]
  userRole: string
}

export default function HistoryOrdersTable({ orders }: HistoryOrdersTableProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortField, setSortField] = useState<keyof any>('updatedAt')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const statusColor: Record<string, string> = {
    APPROVED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    REJECTED: 'bg-red-50 text-red-700 border-red-200',
  }

  // Filter orders
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const fullName = `${order.user.firstName} ${order.user.lastName}`.toLowerCase()
      const dest = order.destinationProvince?.toLowerCase() || ''
      const term = searchTerm.toLowerCase()
      return fullName.includes(term) || dest.includes(term)
    })
  }, [orders, searchTerm])

  // Sort orders
  const sortedOrders = useMemo(() => {
    return [...filteredOrders].sort((a, b) => {
      let aVal: any = a[sortField]
      let bVal: any = b[sortField]

      if (sortField === 'updatedAt' || sortField === 'departureDate' || sortField === 'returnDate') {
        aVal = new Date(aVal).getTime()
        bVal = new Date(bVal).getTime()
      } else if (sortField === 'employee') {
        aVal = `${a.user.firstName} ${a.user.lastName}`
        bVal = `${b.user.firstName} ${b.user.lastName}`
      } else if (sortField === 'decision') {
        aVal = a.approvals[0]?.status || ''
        bVal = b.approvals[0]?.status || ''
      }

      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1
      return 0
    })
  }, [filteredOrders, sortField, sortDirection])

  // Pagination
  const paginatedOrders = useMemo(() => {
    const start = (page - 1) * pageSize
    return sortedOrders.slice(start, start + pageSize)
  }, [sortedOrders, page, pageSize])

  const totalPages = Math.ceil(sortedOrders.length / pageSize)

  const handleSort = (field: keyof any) => {
    if (field === sortField) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('desc')
    }
    setPage(1)
  }

  const SortIcon = ({ field }: { field: keyof any }) => {
    if (sortField !== field) return <ChevronUp className="ml-1 h-3 w-3 opacity-50" />
    return sortDirection === 'asc' ? <ChevronUp className="ml-1 h-3 w-3" /> : <ChevronDown className="ml-1 h-3 w-3" />
  }

  return (
    <Card className="border-0 shadow-lg overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 border-b">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <CardTitle>Previously Processed</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {filteredOrders.length} {filteredOrders.length === 1 ? 'record' : 'records'} found
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search employee or destination..."
                className="pl-8 w-full md:w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={pageSize.toString()} onValueChange={(v) => setPageSize(parseInt(v))}>
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5 / page</SelectItem>
                <SelectItem value="10">10 / page</SelectItem>
                <SelectItem value="20">20 / page</SelectItem>
                <SelectItem value="50">50 / page</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/20">
                <TableHead className="cursor-pointer" onClick={() => handleSort('employee')}>
                  <div className="flex items-center">
                    Employee
                    <SortIcon field="employee" />
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort('destinationProvince')}>
                  <div className="flex items-center">
                    Destination
                    <SortIcon field="destinationProvince" />
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort('departureDate')}>
                  <div className="flex items-center">
                    Travel Dates
                    <SortIcon field="departureDate" />
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort('decision')}>
                  <div className="flex items-center">
                    Your Decision
                    <SortIcon field="decision" />
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort('updatedAt')}>
                  <div className="flex items-center">
                    Processed On
                    <SortIcon field="updatedAt" />
                  </div>
                </TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedOrders.map((order) => {
                const myApproval = order.approvals[0]
                return (
                  <TableRow key={order.id} className="hover:bg-muted/30 transition-colors">
                    <TableCell className="font-medium">
                      <div className="flex flex-col">
                        <span>{order.user.firstName} {order.user.lastName}</span>
                        <span className="text-xs text-muted-foreground">{order.user.division}</span>
                      </div>
                    </TableCell>
                    <TableCell>{order.destinationProvince || order.destination || '—'}</TableCell>
                    <TableCell>
                      {format(new Date(order.departureDate), 'MMM d')} –{' '}
                      {format(new Date(order.returnDate), 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell>
                      <Badge className={`${statusColor[myApproval?.status]} border`}>
                        {myApproval?.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {format(new Date(order.updatedAt), 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" asChild className="hover:bg-muted">
                        <Link href={`/employee/requests/${order.id}`} target="_blank">
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">View</span>
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })}
              {paginatedOrders.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                    No history found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t">
            <div className="text-sm text-muted-foreground">
              Showing {Math.min((page - 1) * pageSize + 1, sortedOrders.length)} to{' '}
              {Math.min(page * pageSize, sortedOrders.length)} of {sortedOrders.length} results
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}