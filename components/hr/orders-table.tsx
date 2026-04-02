'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
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
import { Eye, Printer, Search, Filter } from 'lucide-react'
import { DownloadCloudIcon } from 'lucide-react'
import { toast } from 'sonner'
import { completeTravelOrder, getNextTravelNumber } from '@/app/actions/hr/travelAction'

interface Order {
  id: string
  travelOrderNumber: string | null
  user: { firstName: string; lastName: string; division: string | null }
  destinationProvince: string
  departureDate: Date
  returnDate: Date
  status: string
  employmentStatus: string
}

const statusColorMap: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  REVIEWING: 'bg-blue-100 text-blue-800 border-blue-200',
  APPROVED: 'bg-green-100 text-green-800 border-green-200',
  REJECTED: 'bg-red-100 text-red-800 border-red-200',
  HR_PROCESSING: 'bg-purple-100 text-purple-800 border-purple-200',
  COMPLETED: 'bg-gray-100 text-gray-800 border-gray-200',
}

const ITEMS_PER_PAGE = 10

export default function OrdersTable({ initialOrders }: { initialOrders: Order[] }) {
  const router = useRouter()
  const [currentPage, setCurrentPage] = useState(1)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [processingId, setProcessingId] = useState<string | null>(null)
  const [travelNumberInput, setTravelNumberInput] = useState('')
  const [assignModalOpen, setAssignModalOpen] = useState(false)
  const [assignOrderId, setAssignOrderId] = useState<string | null>(null)
  const [suggestedNumber, setSuggestedNumber] = useState<string>('')
  const [isLoadingNumber, setIsLoadingNumber] = useState(false)

  const filteredOrders = initialOrders.filter((order) => {
    const fullName = `${order.user.firstName} ${order.user.lastName}`.toLowerCase()
    const matchesSearch = fullName.includes(search.toLowerCase()) ||
      (order.travelOrderNumber && order.travelOrderNumber.includes(search))
    const matchesStatus = statusFilter === 'ALL' || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const paginatedOrders = filteredOrders.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  const handleAssignNumber = async (orderId: string) => {
    setAssignOrderId(orderId)
    setAssignModalOpen(true)
    setIsLoadingNumber(true)
    try {
      const nextNumber = await getNextTravelNumber()
      setSuggestedNumber(nextNumber)
      setTravelNumberInput(nextNumber)
    } catch (error) {
      console.error('Failed to generate travel number', error)
      setSuggestedNumber('')
    } finally {
      setIsLoadingNumber(false)
    }
  }

  const handleComplete = async () => {
    if (!assignOrderId || !travelNumberInput.trim()) {
      toast.error('Please enter a travel order number')
      return
    }
    setProcessingId(assignOrderId)
    const result = await completeTravelOrder(assignOrderId, travelNumberInput)
    if (result.success) {
      toast.success('Travel order completed')
      router.refresh()
      setAssignModalOpen(false)
    } else {
      toast.error(result.error)
    }
    setProcessingId(null)
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  return (
    <>
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
                <SelectItem value="REVIEWING">Reviewing</SelectItem>
                <SelectItem value="APPROVED">Approved</SelectItem>
                <SelectItem value="REJECTED">Rejected</SelectItem>
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
                      {order.travelOrderNumber || (
                        <span className="text-muted-foreground italic">Not assigned</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {order.user.firstName} {order.user.lastName}
                    </TableCell>
                    <TableCell>{order.destinationProvince}</TableCell>
                    <TableCell>
                      {formatDate(order.departureDate)} – {formatDate(order.returnDate)}
                    </TableCell>
                    <TableCell>
                      <Badge className={statusColorMap[order.status]} variant="outline">
                        {order.status.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right space-x-1">
                      {order.status === 'HR_PROCESSING' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleAssignNumber(order.id)}
                          disabled={processingId === order.id}
                        >
                          <DownloadCloudIcon className="h-4 w-4" />
                        </Button>
                      )}
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/hr/orders/${order.id}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                      {order.travelOrderNumber && order.status === 'COMPLETED' && (
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
          {totalPages > 1 && (
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
          )}
        </CardContent>
      </Card>

      {/* Assign Number Modal */}
      {assignModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-bold mb-4">Assign Travel Order Number</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Travel Order Number
                </label>
                <Input
                  placeholder="e.g., TO-2026-001"
                  value={travelNumberInput}
                  onChange={(e) => setTravelNumberInput(e.target.value)}
                  disabled={isLoadingNumber}
                />
                {isLoadingNumber && (
                  <p className="text-xs text-gray-500 mt-1">Generating suggested number...</p>
                )}
                {!isLoadingNumber && suggestedNumber && (
                  <p className="text-xs text-green-600 mt-1">
                    Suggested: {suggestedNumber}
                  </p>
                )}
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setAssignModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleComplete} disabled={!!processingId}>
                  {processingId ? 'Processing...' : 'Complete'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}