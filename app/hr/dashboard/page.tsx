import { getCurrentUser } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  FileText,
  Clock,
  CheckCircle,
  Printer,
  Hash,
  Eye,
  TrendingUp,
  Users,
  Calendar,
  ArrowRight,
} from 'lucide-react'
import Link from 'next/link'
import { formatDistanceToNow, format } from 'date-fns'

export const dynamic = 'force-dynamic'

export default async function HRDashboardPage() {
  const user = await getCurrentUser()
  if (!user || user.role !== 'HR') redirect('/login')

  const [
    totalOrders,
    pendingAssignment,
    readyToPrint,
    completedThisMonth,
    totalEmployees,
    recentOrders,
    upcomingTravels,
  ] = await Promise.all([
    prisma.travelOrderRequest.count(),
    prisma.travelOrderRequest.count({
      where: { status: 'HR_PROCESSING', travelOrderNumber: null },
    }),
    prisma.travelOrderRequest.count({
      where: { status: 'HR_PROCESSING' },
    }),
    prisma.travelOrderRequest.count({
      where: {
        status: 'COMPLETED',
        updatedAt: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        },
      },
    }),
    prisma.user.count({ where: { role: 'STAFF' } }),
    prisma.travelOrderRequest.findMany({
      where: { status: { in: ['APPROVED', 'HR_PROCESSING'] } },
      include: {
        user: { select: { firstName: true, lastName: true, division: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
    }),
    prisma.travelOrderRequest.findMany({
      where: {
        status: 'APPROVED',
        departureDate: { gte: new Date() },
      },
      include: {
        user: { select: { firstName: true, lastName: true } },
      },
      orderBy: { departureDate: 'asc' },
      take: 5,
    }),
  ])

  const statCards = [
    {
      title: 'Total Orders',
      value: totalOrders,
      icon: FileText,
      color: 'bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400',
    },
    {
      title: 'Pending Assignment',
      value: pendingAssignment,
      icon: Clock,
      color: 'bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400',
    },
    {
      title: 'Ready to Print',
      value: readyToPrint,
      icon: Printer,
      color: 'bg-purple-50 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400',
    },
    {
      title: 'Completed (MTD)',
      value: completedThisMonth,
      icon: CheckCircle,
      color: 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400',
    },
  ]

  return (
    <div className="p-6 lg:p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Welcome back, {user.firstName}
          </h1>
          <p className="text-muted-foreground mt-1">
            Here's what's happening with travel orders today.
          </p>
        </div>
        <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
          <Link href="/hr/orders">
            <FileText className="mr-2 h-4 w-4" /> View All Orders
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.title} className="border-0 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`rounded-lg p-2 ${stat.color}`}>
                <stat.icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pending">
            <Clock className="mr-2 h-4 w-4" />
            Pending Assignment
          </TabsTrigger>
          <TabsTrigger value="upcoming">
            <Calendar className="mr-2 h-4 w-4" />
            Upcoming Travels
          </TabsTrigger>
          <TabsTrigger value="quick">
            <TrendingUp className="mr-2 h-4 w-4" />
            Quick Stats
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Orders Awaiting Number Assignment</CardTitle>
            </CardHeader>
            <CardContent>
              {recentOrders.filter(o => o.status === 'HR_PROCESSING').length === 0 ? (
                <p className="text-center py-8 text-muted-foreground">
                  No orders pending assignment.
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee</TableHead>
                      <TableHead>Division</TableHead>
                      <TableHead>Destination</TableHead>
                      <TableHead>Travel Dates</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentOrders
                      .filter(o => o.status === 'HR_PROCESSING')
                      .map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">
                            {order.user.firstName} {order.user.lastName}
                          </TableCell>
                          <TableCell>{order.user.division || '—'}</TableCell>
                          <TableCell>{order.destinationProvince}</TableCell>
                          <TableCell>
                            {format(new Date(order.departureDate), 'MMM d')} –{' '}
                            {format(new Date(order.returnDate), 'MMM d, yyyy')}
                          </TableCell>
                          <TableCell className="text-right space-x-1">
                            <Button variant="ghost" size="sm" asChild>
                              <Link href={`/hr/orders/${order.id}`}>
                                <Eye className="h-4 w-4" />
                              </Link>
                            </Button>
                            <Button variant="ghost" size="sm" asChild>
                              <Link href={`/hr/orders/${order.id}?action=assign`}>
                                <Hash className="h-4 w-4" />
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
        </TabsContent>

        <TabsContent value="upcoming" className="space-y-4">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Upcoming Approved Travels</CardTitle>
            </CardHeader>
            <CardContent>
              {upcomingTravels.length === 0 ? (
                <p className="text-center py-8 text-muted-foreground">
                  No upcoming travels.
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee</TableHead>
                      <TableHead>Destination</TableHead>
                      <TableHead>Departure</TableHead>
                      <TableHead>Return</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {upcomingTravels.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell>
                          {order.user.firstName} {order.user.lastName}
                        </TableCell>
                        <TableCell>{order.destinationProvince}</TableCell>
                        <TableCell>
                          {format(new Date(order.departureDate), 'MMM d, yyyy')}
                        </TableCell>
                        <TableCell>
                          {format(new Date(order.returnDate), 'MMM d, yyyy')}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quick" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalEmployees}</div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-sm font-medium">Avg. Processing Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2.4 days</div>
                <p className="text-xs text-muted-foreground">From approval to number</p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                  <Link href="/hr/users/new">
                    <Users className="mr-2 h-4 w-4" /> Add New User
                  </Link>
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                  <Link href="/hr/analytics">
                    <TrendingUp className="mr-2 h-4 w-4" /> View Analytics
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}