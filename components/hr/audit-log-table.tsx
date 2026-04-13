'use client'

import { useState, useMemo } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Search, Filter, Calendar } from 'lucide-react'
import { format } from 'date-fns'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Calendar as CalendarComponent } from '@/components/ui/calendar'
import { cn } from '@/lib/utils'

interface AuditLogWithRelations {
  id: string
  action: string
  details: string | null
  ipAddress: string | null
  userAgent: string | null
  createdAt: Date
  user: {
    firstName: string
    lastName: string
    email: string
    role: string
  }
  travelOrder: {
    travelOrderNumber: string | null
  } | null
}

interface AuditLogTableProps {
  logs: AuditLogWithRelations[]
}

const actionColors: Record<string, string> = {
  CREATE: 'bg-blue-100 text-blue-800 border-blue-200',
  UPDATE: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  DELETE: 'bg-red-100 text-red-800 border-red-200',
  APPROVE: 'bg-green-100 text-green-800 border-green-200',
  REJECT: 'bg-red-100 text-red-800 border-red-200',
  ASSIGN_NUMBER: 'bg-purple-100 text-purple-800 border-purple-200',
  PRINT: 'bg-gray-100 text-gray-800 border-gray-200',
  LOGIN: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  LOGOUT: 'bg-slate-100 text-slate-800 border-slate-200',
  OTHER: 'bg-gray-100 text-gray-800 border-gray-200',
}

export function AuditLogTable({ logs }: AuditLogTableProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [actionFilter, setActionFilter] = useState<string>('ALL')
  const [userFilter, setUserFilter] = useState<string>('ALL')
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  })

  // Extract unique actions and users for filters
  const uniqueActions = useMemo(() => {
    const actions = new Set(logs.map(log => log.action))
    return ['ALL', ...Array.from(actions)]
  }, [logs])

  const uniqueUsers = useMemo(() => {
    const users = new Map<string, string>()
    logs.forEach(log => {
      const fullName = `${log.user.firstName} ${log.user.lastName}`
      users.set(log.user.email, fullName)
    })
    return Array.from(users.entries()).map(([email, name]) => ({ email, name }))
  }, [logs])

  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      // Search term
      const searchLower = searchTerm.toLowerCase()
      const matchesSearch =
        searchTerm === '' ||
        log.user.firstName.toLowerCase().includes(searchLower) ||
        log.user.lastName.toLowerCase().includes(searchLower) ||
        log.user.email.toLowerCase().includes(searchLower) ||
        log.action.toLowerCase().includes(searchLower) ||
        (log.details && log.details.toLowerCase().includes(searchLower)) ||
        (log.travelOrder?.travelOrderNumber && log.travelOrder.travelOrderNumber.toLowerCase().includes(searchLower))

      const matchesAction = actionFilter === 'ALL' || log.action === actionFilter

      const matchesUser = userFilter === 'ALL' || log.user.email === userFilter

      let matchesDate = true
      if (dateRange.from) {
        matchesDate = matchesDate && new Date(log.createdAt) >= dateRange.from
      }
      if (dateRange.to) {
        const toDate = new Date(dateRange.to)
        toDate.setHours(23, 59, 59, 999)
        matchesDate = matchesDate && new Date(log.createdAt) <= toDate
      }

      return matchesSearch && matchesAction && matchesUser && matchesDate
    })
  }, [logs, searchTerm, actionFilter, userFilter, dateRange])

  const clearFilters = () => {
    setSearchTerm('')
    setActionFilter('ALL')
    setUserFilter('ALL')
    setDateRange({ from: undefined, to: undefined })
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search by user, email, action, TO number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <Select value={actionFilter} onValueChange={setActionFilter}>
            <SelectTrigger className="w-[160px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Action" />
            </SelectTrigger>
            <SelectContent>
              {uniqueActions.map(action => (
                <SelectItem key={action} value={action}>
                  {action}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={userFilter} onValueChange={setUserFilter}>
            <SelectTrigger className="w-[200px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="User" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Users</SelectItem>
              {uniqueUsers.map(({ email, name }) => (
                <SelectItem key={email} value={email}>
                  {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'justify-start text-left font-normal',
                  !dateRange.from && !dateRange.to && 'text-muted-foreground'
                )}
              >
                <Calendar className="mr-2 h-4 w-4" />
                {dateRange.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, 'LLL dd, y')} -{' '}
                      {format(dateRange.to, 'LLL dd, y')}
                    </>
                  ) : (
                    format(dateRange.from, 'LLL dd, y')
                  )
                ) : (
                  'Date range'
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                initialFocus
                mode="range"
                defaultMonth={dateRange.from}
                selected={dateRange}
                onSelect={setDateRange}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>

          {(searchTerm || actionFilter !== 'ALL' || userFilter !== 'ALL' || dateRange.from) && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Timestamp</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Details</TableHead>
              <TableHead>Travel Order</TableHead>
              <TableHead>IP Address</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLogs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-slate-500 py-6">
                  No audit logs found.
                </TableCell>
              </TableRow>
            ) : (
              filteredLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="whitespace-nowrap text-sm">
                    {format(new Date(log.createdAt), 'MMM dd, yyyy HH:mm:ss')}
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">
                      {log.user.firstName} {log.user.lastName}
                    </div>
                    <div className="text-xs text-slate-500">{log.user.email}</div>
                    <Badge variant="outline" className="mt-1 text-xs">
                      {log.user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={actionColors[log.action] || actionColors.OTHER}
                      variant="outline"
                    >
                      {log.action}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-xs truncate text-sm">
                    {log.details || '—'}
                  </TableCell>
                  <TableCell>
                    {log.travelOrder?.travelOrderNumber ? (
                      <span className="font-mono text-sm">{log.travelOrder.travelOrderNumber}</span>
                    ) : (
                      '—'
                    )}
                  </TableCell>
                  <TableCell className="text-xs font-mono">
                    {log.ipAddress || '—'}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="text-xs text-slate-500">
        Showing {filteredLogs.length} of {logs.length} logs
      </div>
    </div>
  )
}