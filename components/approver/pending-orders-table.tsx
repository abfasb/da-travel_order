'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { format } from 'date-fns'
import { Eye, PenSquare, Search, ChevronUp, ChevronDown, MapPin, Calendar, Clock } from 'lucide-react'
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

const DIVISION_CHOICES = [
  { value: "regulatory", label: "Regulatory Division" },
  { value: "laboratory", label: "Integrated Laboratory Division" },
  { value: "research", label: "Research Division" },
  { value: "field_ops", label: "Field Operations Division" },
  { value: "agri_marketing", label: "Agribusiness and Marketing Assistance Division" },
  { value: "engineering", label: "Regional Agricultural Engineering Division" },
  { value: "planning", label: "Planning, Monitoring and Evaluation Division" },
  { value: "info_section", label: "Regional Agriculture & Fisheries Information Section" },
  { value: "admin_finance", label: "Administrative & Finance Division" },
  { value: "procurement", label: "Procurement of Goods and Infrastructure" },
] as const;

interface PendingOrdersTableProps {
  orders: any[]
  userRole: string
}

export default function PendingOrdersTable({ orders, userRole }: PendingOrdersTableProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortField, setSortField] = useState<keyof any>('createdAt')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const roleDisplayNames: Record<string, string> = {
    APCO: 'APCO',
    CHIEF_AGRICULTURIST: 'Chief Agriculturist',
    CHIEF_ADMINISTRATIVE: 'Chief Admin',
    REGIONAL_EXECUTIVE: 'Regional Director',
  }

  const getDivisionLabel = (val: string) => {
    return DIVISION_CHOICES.find(d => d.value === val)?.label || val || '—';
  }

  const getApprovalStep = (order: any) => {
    const isFieldOps = order.user?.division === 'field_ops'
    const roles = isFieldOps
      ? ['APCO', 'CHIEF_AGRICULTURIST', 'CHIEF_ADMINISTRATIVE', 'REGIONAL_EXECUTIVE']
      : ['CHIEF_ADMINISTRATIVE', 'REGIONAL_EXECUTIVE']

    const approvedRoles = order.approvals
      .filter((a: any) => a.status === 'APPROVED')
      .map((a: any) => a.approverRole)

    const pendingRoles = roles.filter(role => !approvedRoles.includes(role))

    if (pendingRoles.length === 0) return 'Completed'
    if (pendingRoles[0] === userRole) return 'Awaiting Your Approval'
    return `Waiting for: ${pendingRoles.map(r => roleDisplayNames[r] || r).join(', ')}`
  }

  const getStepBadgeColor = (step: string) => {
    if (step === 'Awaiting Your Approval') return 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20'
    if (step === 'Completed') return 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20'
    return 'bg-slate-500/10 text-slate-700 dark:text-slate-400 border-slate-500/20'
  }

  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const fullName = `${order.user.firstName} ${order.user.lastName}`.toLowerCase()
      const dest = order.destinationProvince?.toLowerCase() || ''
      const term = searchTerm.toLowerCase()
      return fullName.includes(term) || dest.includes(term)
    })
  }, [orders, searchTerm])

  const sortedOrders = useMemo(() => {
    return [...filteredOrders].sort((a, b) => {
      let aVal: any = a[sortField]
      let bVal: any = b[sortField]

      if (sortField === 'createdAt' || sortField === 'departureDate' || sortField === 'returnDate') {
        aVal = new Date(aVal).getTime()
        bVal = new Date(bVal).getTime()
      } else if (sortField === 'employee') {
        aVal = `${a.user.firstName} ${a.user.lastName}`
        bVal = `${b.user.firstName} ${b.user.lastName}`
      } else if (sortField === 'travelDates') {
        aVal = new Date(a.departureDate).getTime()
        bVal = new Date(b.departureDate).getTime()
      }

      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1
      return 0
    })
  }, [filteredOrders, sortField, sortDirection])

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
    if (sortField !== field) return <ChevronUp className="ml-1.5 h-3 w-3 opacity-0 group-hover:opacity-50 transition-opacity" />
    return sortDirection === 'asc' ? <ChevronUp className="ml-1.5 h-3 w-3 text-primary" /> : <ChevronDown className="ml-1.5 h-3 w-3 text-primary" />
  }

  if (orders.length === 0) {
    return (
      <Card className="border-border/50 shadow-sm">
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Clock className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">No Pending Requests</h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-sm">You're all caught up! There are no travel orders awaiting your approval at this time.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-border/50 shadow-sm overflow-hidden">
      <CardHeader className="bg-muted/30 border-b pb-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-lg font-semibold">Action Required</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Review and process {filteredOrders.length} {filteredOrders.length === 1 ? 'request' : 'requests'}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search employee or destination..."
                className="pl-8 w-full sm:w-64 bg-background"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={pageSize.toString()} onValueChange={(v) => { setPageSize(parseInt(v)); setPage(1); }}>
              <SelectTrigger className="w-full sm:w-[110px] bg-background">
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
              <TableRow className="hover:bg-transparent">
                <TableHead className="cursor-pointer group h-12 px-6" onClick={() => handleSort('employee')}>
                  <div className="flex items-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Employee <SortIcon field="employee" />
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer group h-12 px-6" onClick={() => handleSort('destinationProvince')}>
                  <div className="flex items-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Destination <SortIcon field="destinationProvince" />
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer group h-12 px-6" onClick={() => handleSort('travelDates')}>
                  <div className="flex items-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Travel Dates <SortIcon field="travelDates" />
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer group h-12 px-6" onClick={() => handleSort('createdAt')}>
                  <div className="flex items-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Submitted <SortIcon field="createdAt" />
                  </div>
                </TableHead>
                <TableHead className="h-12 px-6 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Status
                </TableHead>
                <TableHead className="text-right h-12 px-6 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedOrders.map((order) => {
                const step = getApprovalStep(order)
                return (
                  <TableRow key={order.id} className="hover:bg-muted/50 transition-colors group">
                    <TableCell className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-medium text-foreground">{order.user.firstName} {order.user.lastName}</span>
                        <span className="text-xs text-muted-foreground mt-0.5">{getDivisionLabel(order.user.division)}</span>
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-foreground">
                        <MapPin className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                        <span className="truncate max-w-[200px]">{order.destinationProvince || order.destination || '—'}</span>
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-foreground">
                        <Calendar className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                        <span>
                          {format(new Date(order.departureDate), 'MMM d')} – {format(new Date(order.returnDate), 'MMM d, yyyy')}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-sm text-muted-foreground">
                      {format(new Date(order.createdAt), 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <Badge variant="outline" className={`font-medium shadow-none ${getStepBadgeColor(step)}`}>
                        {step}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-right">
                      <div className="flex justify-center">
                        <Button variant="ghost" size="sm" asChild className="h-8 w-8 p-0 hover:bg-muted hover:text-foreground">
                          <Link href={`/approvers/approvals/${order.id}`} title="View Details">
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">View</span>
                          </Link>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
              {paginatedOrders.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                    No matching requests found for your search.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 border-t bg-muted/10 gap-4">
            <div className="text-sm text-muted-foreground">
              Showing <span className="font-medium text-foreground">{Math.min((page - 1) * pageSize + 1, sortedOrders.length)}</span> to{' '}
              <span className="font-medium text-foreground">{Math.min(page * pageSize, sortedOrders.length)}</span> of{' '}
              <span className="font-medium text-foreground">{sortedOrders.length}</span> results
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-8"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-8"
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