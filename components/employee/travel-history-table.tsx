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
import { Eye } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const allTravels = Array.from({ length: 25 }, (_, i) => ({
  id: `TO-2026-${(100 + i).toString().padStart(3, '0')}`,
  destination: ['Palawan', 'Oriental Mindoro', 'Marinduque', 'Romblon', 'Occidental Mindoro'][i % 5],
  purpose: ['Inspection', 'Training', 'Meeting', 'Monitoring', 'Seminar'][i % 5],
  startDate: new Date(2026, 2, 10 + i).toISOString().split('T')[0],
  endDate: new Date(2026, 2, 12 + i).toISOString().split('T')[0],
  status: ['Pending Review', 'Approved', 'Rejected', 'HR Processing', 'Completed'][i % 5],
}))

const statusColorMap: Record<string, string> = {
  'Pending Review': 'bg-yellow-100 text-yellow-800 border-yellow-200',
  'Approved': 'bg-green-100 text-green-800 border-green-200',
  'Rejected': 'bg-red-100 text-red-800 border-red-200',
  'HR Processing': 'bg-blue-100 text-blue-800 border-blue-200',
  'Completed': 'bg-gray-100 text-gray-800 border-gray-200',
}

const ITEMS_PER_PAGE = 10

export function TravelHistoryTable() {
  const [currentPage, setCurrentPage] = useState(1)
  const totalPages = Math.ceil(allTravels.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const paginatedTravels = allTravels.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Travel History</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Travel No.</TableHead>
                <TableHead>Destination</TableHead>
                <TableHead>Purpose</TableHead>
                <TableHead>Travel Dates</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedTravels.map((travel) => (
                <TableRow key={travel.id}>
                  <TableCell className="font-medium">{travel.id}</TableCell>
                  <TableCell>{travel.destination}</TableCell>
                  <TableCell>{travel.purpose}</TableCell>
                  <TableCell>
                    {new Date(travel.startDate).toLocaleDateString()} –{' '}
                    {new Date(travel.endDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Badge className={statusColorMap[travel.status] || ''} variant="outline">
                      {travel.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" asChild>
                      <a href={`/employee/requests/${travel.id}`}>
                        <Eye className="h-4 w-4" />
                      </a>
                    </Button>
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