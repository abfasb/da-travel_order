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
import { format } from 'date-fns'

const recentTravels = [
  {
    id: 'TO-2026-012',
    destination: 'Palawan',
    purpose: 'Field Inspection',
    date: '2026-03-15',
    status: 'Approved',
  },
  {
    id: 'TO-2026-011',
    destination: 'Oriental Mindoro',
    purpose: 'Training',
    date: '2026-03-10',
    status: 'Approved',
  },
  {
    id: 'TO-2026-010',
    destination: 'Marinduque',
    purpose: 'Meeting',
    date: '2026-03-08',
    status: 'Rejected',
  },
  {
    id: 'TO-2026-009',
    destination: 'Romblon',
    purpose: 'Monitoring',
    date: '2026-03-05',
    status: 'Completed',
  },
  {
    id: 'TO-2026-008',
    destination: 'Occidental Mindoro',
    purpose: 'Seminar',
    date: '2026-03-01',
    status: 'Completed',
  },
]

const statusColorMap: Record<string, string> = {
  'Approved': 'border-green-200 bg-green-50 text-green-700',
  'Rejected': 'border-rose-200 bg-rose-50 text-rose-700',
  'Completed': 'border-gray-200 bg-gray-50 text-gray-700',
}

export function RecentTravelsTable() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Travel No.</TableHead>
          <TableHead>Destination</TableHead>
          <TableHead>Purpose</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {recentTravels.map((travel) => (
          <TableRow key={travel.id}>
            <TableCell className="font-medium">{travel.id}</TableCell>
            <TableCell>{travel.destination}</TableCell>
            <TableCell>{travel.purpose}</TableCell>
            <TableCell>{format(new Date(travel.date), 'MMM d, yyyy')}</TableCell>
            <TableCell>
              <Badge variant="outline" className={statusColorMap[travel.status]}>
                {travel.status}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}