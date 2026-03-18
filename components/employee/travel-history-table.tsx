'use client'

import { useState } from 'react'
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
import { Eye } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const statusColorMap: Record<string, string> = {
  'PENDING': 'bg-yellow-100 text-yellow-800 border-yellow-200',
  'REVIEWING': 'bg-blue-100 text-blue-800 border-blue-200',
  'APPROVED': 'bg-green-100 text-green-800 border-green-200',
  'REJECTED': 'bg-red-100 text-red-800 border-red-200',
  'HR_PROCESSING': 'bg-purple-100 text-purple-800 border-purple-200',
  'COMPLETED': 'bg-gray-100 text-gray-800 border-gray-200',
}

const ITEMS_PER_PAGE = 10

interface TravelHistoryTableProps {
  data: any[] 
}

export function TravelHistoryTable({ data = [] }: TravelHistoryTableProps) {
  const [currentPage, setCurrentPage] = useState(1)
  
  const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE) || 1
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const paginatedTravels = data.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  const formatDate = (dateString: string | Date) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }

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
                <TableHead className="pl-6">Travel No.</TableHead>
                <TableHead>Destination</TableHead>
                <TableHead>Purpose</TableHead>
                <TableHead>Travel Dates</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right pr-6">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedTravels.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                    No travel history found.
                  </TableCell>
                </TableRow>
              ) : (
                paginatedTravels.map((travel) => (
                  <TableRow key={travel.id}>
                    
                    {/* ID or Travel Order Number */}
                    <TableCell className="font-medium pl-6">
                      {travel.travelOrderNumber || 'Pending Assignment'}
                    </TableCell>
                    
                    <TableCell>{travel.destinationProvince}</TableCell>
                    
                    <TableCell className="max-w-[200px] truncate" title={travel.purpose}>
                      {travel.purpose}
                    </TableCell>
                    
                    <TableCell>
                      {formatDate(travel.departureDate)} – {formatDate(travel.returnDate)}
                    </TableCell>
                    
                    <TableCell>
                      <Badge className={statusColorMap[travel.status] || 'bg-gray-100'} variant="outline">
                        {travel.status.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    
                    <TableCell className="text-right pr-6">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/employee/requests/${travel.id}`}>
                          <Eye className="h-4 w-4 text-emerald-600 hover:text-emerald-700" />
                        </Link>
                      </Button>
                    </TableCell>
                    
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination Controls */}
        {data.length > ITEMS_PER_PAGE && (
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
  )
}