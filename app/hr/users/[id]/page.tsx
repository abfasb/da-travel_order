import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Mail, Phone, MapPin, Eye } from 'lucide-react'
import Link from 'next/link'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { format } from 'date-fns'

const roleColorMap: Record<string, string> = {
  STAFF: 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700',
  DIVISION_HEAD: 'bg-teal-100 text-teal-800 border-teal-200 dark:bg-teal-900/30 dark:text-teal-300 dark:border-teal-800',
  APCO: 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800',
  CHIEF_AGRICULTURIST: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800',
  CHIEF_ADMINISTRATIVE: 'bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-800',
  REGIONAL_EXECUTIVE: 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800',
  HR: 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800',
  ADMIN: 'bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-900/30 dark:text-rose-300 dark:border-rose-800',
}

const statusVariants: Record<string, any> = {
  PENDING: 'secondary',
  REVIEWING: 'outline',
  APPROVED: 'default',
  REJECTED: 'destructive',
  COMPLETED: 'success',
  HR_PROCESSING: 'secondary',
}

export default async function UserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      _count: { select: { travelOrders: true } },
      travelOrders: {
        orderBy: { createdAt: 'desc' },
        take: 10, // Limit to recent 10, can add pagination later
      },
    },
  })

  if (!user) notFound()

  const initials = `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/hr/users">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">User Details</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardContent className="pt-6 flex flex-col items-center text-center">
            <Avatar className="h-24 w-24 mb-4">
              <AvatarImage src={user.avatarUrl || undefined} />
              <AvatarFallback className="text-2xl bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
                {initials}
              </AvatarFallback>
            </Avatar>
            <h2 className="text-xl font-bold text-foreground">
              {user.firstName} {user.middleInitial ? user.middleInitial + '. ' : ''}{user.lastName}
            </h2>
            <Badge className={`mt-2 ${roleColorMap[user.role]}`} variant="outline">
              {user.role.replace(/_/g, ' ')}
            </Badge>
            <div className="w-full mt-6 space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>{user.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>{user.mobileNumber}</span>
              </div>
              {user.officialStation && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{user.officialStation}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Division</p>
                <p className="font-medium text-foreground">{user.division || '—'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Employment Status</p>
                <p className="font-medium text-foreground">{user.employmentStatus || '—'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Official Station</p>
                <p className="font-medium text-foreground">{user.officialStation || '—'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Travel Orders</p>
                <p className="font-medium text-foreground">{user._count.travelOrders}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Joined</p>
                <p className="font-medium text-foreground">
                  {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Travel Orders Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Travel Orders</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              All travel requests submitted by this user.
            </p>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href={`/hr/orders?employee=${user.firstName}%20${user.lastName}`}>
              View All
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {user.travelOrders.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No travel orders found for this user.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>TO Number</TableHead>
                  <TableHead>Destination</TableHead>
                  <TableHead>Travel Dates</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {user.travelOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-mono text-sm">
                      {order.travelOrderNumber || '—'}
                    </TableCell>
                    <TableCell>{order.destinationProvince}</TableCell>
                    <TableCell>
                      {format(new Date(order.departureDate), 'MMM d, yyyy')} –{' '}
                      {format(new Date(order.returnDate), 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusVariants[order.status] || 'secondary'}>
                        {order.status.replace(/_/g, ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/hr/orders/${order.id}`}>
                          <Eye className="h-4 w-4 mr-1" /> View
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}