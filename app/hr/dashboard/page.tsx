import { Suspense } from 'react'
import { getCurrentUser } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import StatsCards from '@/components/hr/stats-cards'
import RecentOrdersTable from '@/components/hr/recent-orders-table'
import QuickActions from '@/components/hr/quick-actions'
import MonthlyStats from '@/components/hr/monthly-stats'

export const dynamic = 'force-dynamic'

export default async function HRDashboardPage() {
  const user = await getCurrentUser()
  if (!user || user.role !== 'HR') {
    redirect('/login')
  }

  const [
    pendingNumbersCount,
    readyToPrintCount,
    completedCount,
    archivedCount,
    recentOrders,
  ] = await Promise.all([
    prisma.travelOrderRequest.count({
      where: { status: 'APPROVED', travelOrderNumber: null },
    }),
    prisma.travelOrderRequest.count({
      where: { status: 'HR_PROCESSING' },
    }),
    prisma.travelOrderRequest.count({
      where: { status: 'COMPLETED' },
    }),
    prisma.travelOrderRequest.count({
      where: { status: 'COMPLETED' }, // or a separate archive flag
    }),
    prisma.travelOrderRequest.findMany({
      where: { status: 'APPROVED', travelOrderNumber: null },
      include: {
        user: { select: { firstName: true, lastName: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
    }),
  ])

  // Format recent orders for the table
  const formattedOrders = recentOrders.map(order => ({
    id: order.id,
    requestorName: `${order.user.firstName} ${order.user.lastName}`,
    destinationProvince: order.destinationProvince,
    departureDate: order.departureDate.toISOString(),
    returnDate: order.returnDate.toISOString(),
    status: order.status,
    travelOrderNumber: order.travelOrderNumber,
  }))

  return (
    <div className="space-y-6 p-6 lg:p-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">HR Dashboard</h1>
        <p className="text-slate-500 mt-1">
          Manage travel orders, assign numbers, and print official documents.
        </p>
      </div>

      {/* Stats Cards */}
      <Suspense fallback={<StatsCardsSkeleton />}>
        <StatsCards
          pending={pendingNumbersCount}
          ready={readyToPrintCount}
          completed={completedCount}
          archived={archivedCount}
        />
      </Suspense>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Orders Table */}
        <div className="lg:col-span-2">
          <Suspense fallback={<TableSkeleton />}>
            <RecentOrdersTable initialOrders={formattedOrders} />
          </Suspense>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          <QuickActions />
          <Suspense fallback={<CardSkeleton />}>
            <MonthlyStats />
          </Suspense>
        </div>
      </div>
    </div>
  )
}

// Loading skeletons
function StatsCardsSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {[...Array(4)].map((_, i) => (
        <Card key={i}>
          <CardHeader className="pb-2">
            <Skeleton className="h-4 w-24" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-3 w-20 mt-2" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function TableSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-48" />
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function CardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-32" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-20 w-full" />
      </CardContent>
    </Card>
  )
}