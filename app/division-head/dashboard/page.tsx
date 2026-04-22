import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, Users, CheckCircle, Clock } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { format } from 'date-fns'
import { TravelTrendChart } from '@/components/division-head/travel-trend-chart'

export const dynamic = 'force-dynamic'

export default async function DivisionHeadDashboard() {
  const user = await getCurrentUser()
  if (!user || !user.division) return null

  const division = user.division
  const currentYear = new Date().getFullYear()

  // Fetch stats
  const [totalStaff, pendingReviews, activeTravels, completedThisMonth] = await Promise.all([
    prisma.user.count({ where: { division, role: 'STAFF' } }),
    prisma.travelOrderRequest.count({
      where: {
        user: { division },
        status: { in: ['PENDING', 'REVIEWING'] },
      },
    }),
    prisma.travelOrderRequest.count({
      where: {
        user: { division },
        status: 'APPROVED',
        departureDate: { lte: new Date() },
        returnDate: { gte: new Date() },
      },
    }),
    prisma.travelOrderRequest.count({
      where: {
        user: { division },
        status: 'COMPLETED',
        updatedAt: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        },
      },
    }),
  ])

  const recentOrders = await prisma.travelOrderRequest.findMany({
    where: { user: { division } },
    include: { user: { select: { firstName: true, lastName: true } } },
    orderBy: { createdAt: 'desc' },
    take: 5,
  })

  const monthlyData = await prisma.$queryRaw<{ month: string; count: number }[]>`
    SELECT 
      TO_CHAR(DATE_TRUNC('month', "createdAt"), 'Mon') as month,
      CAST(COUNT(*) AS INTEGER) as count
    FROM "travel_orders"
    WHERE "userId" IN (SELECT id FROM "users" WHERE division = ${division})
      AND EXTRACT(YEAR FROM "createdAt") = ${currentYear}
    GROUP BY DATE_TRUNC('month', "createdAt")
    ORDER BY DATE_TRUNC('month', "createdAt")
  `

  const statCards = [
    { title: 'Total Staff', value: totalStaff, icon: Users, color: 'bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400' },
    { title: 'Pending Reviews', value: pendingReviews, icon: Clock, color: 'bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400' },
    { title: 'Active Travels', value: activeTravels, icon: FileText, color: 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400' },
    { title: 'Completed (MTD)', value: completedThisMonth, icon: CheckCircle, color: 'bg-purple-50 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400' },
  ]

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      PENDING: 'secondary',
      REVIEWING: 'outline',
      APPROVED: 'default',
      REJECTED: 'destructive',
      COMPLETED: 'success',
    }
    return <Badge variant={variants[status] as any}>{status}</Badge>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, {user.firstName}!</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => (
          <Card key={card.title} className="border-0 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{card.title}</CardTitle>
              <div className={`rounded-full p-2 ${card.color}`}>
                <card.icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{card.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-7">
        <Card className="lg:col-span-4 border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Monthly Travel Trend ({currentYear})</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <TravelTrendChart data={monthlyData} />
          </CardContent>
        </Card>

        <Card className="lg:col-span-3 border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Travel Orders</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/division-head/travel-orders">View all</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {recentOrders.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No travel orders yet.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Destination</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">
                        {order.user.firstName} {order.user.lastName}
                      </TableCell>
                      <TableCell>{order.destinationProvince}</TableCell>
                      <TableCell>{getStatusBadge(order.status)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}