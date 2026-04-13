import { Metadata } from 'next'
import { getCurrentUser } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { StatsCards } from '@/components/employee/charts/stats-cards'
import { MonthlyTrendChart } from '@/components/employee/charts/monthly-travel-chart'
import { DestinationChart } from '@/components/employee/charts/destination-chart'
import { StatusBreakdownChart } from '@/components/employee/charts/status-breakdown-chart'
import { RecentTravelsTable } from '@/components/employee/charts/recent-travels-table'
import { Suspense } from 'react'
import { Skeleton } from '@/components/ui/skeleton'

export const metadata: Metadata = {
  title: 'Analytics | TOMS Employee',
  description: 'Travel analytics and insights',
}

export const dynamic = 'force-dynamic'

export default async function AnalyticsPage() {
  const user = await getCurrentUser()
  if (!user || user.role !== 'STAFF') {
    redirect('/login')
  }

  // Fetch all travel orders for this employee
  const travelOrders = await prisma.travelOrderRequest.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
  })

  // Calculate stats
  const totalTravels = travelOrders.length
  const pendingCount = travelOrders.filter(o => o.status === 'PENDING' || o.status === 'REVIEWING').length
  const approvedCount = travelOrders.filter(o => o.status === 'APPROVED').length
  const completedCount = travelOrders.filter(o => o.status === 'COMPLETED').length
  const uniqueDestinations = new Set(travelOrders.map(o => o.destinationProvince)).size

  // Monthly data for charts
  const monthlyData: Record<string, number> = {}
  const destinationData: Record<string, number> = {}
  const statusData: Record<string, number> = {
    PENDING: 0,
    REVIEWING: 0,
    APPROVED: 0,
    REJECTED: 0,
    HR_PROCESSING: 0,
    COMPLETED: 0,
  }

  travelOrders.forEach(order => {
    // Monthly aggregation
    const month = order.createdAt.toLocaleString('default', { month: 'short' })
    monthlyData[month] = (monthlyData[month] || 0) + 1

    // Destination aggregation
    destinationData[order.destinationProvince] = (destinationData[order.destinationProvince] || 0) + 1

    // Status aggregation
    statusData[order.status] = (statusData[order.status] || 0) + 1
  })

  // Convert to arrays for charts
  const monthlyChartData = Object.entries(monthlyData).map(([month, count]) => ({ month, count }))
  const destinationChartData = Object.entries(destinationData).map(([name, value]) => ({ name, value }))
  const statusChartData = Object.entries(statusData)
    .filter(([_, value]) => value > 0)
    .map(([name, value]) => ({ name, value }))

  // Recent 5 orders for table
  const recentOrders = travelOrders.slice(0, 5)

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Analytics Dashboard</h1>
        <p className="text-slate-500">Overview of your travel activities and insights.</p>
      </div>

      <Suspense fallback={<StatsCardsSkeleton />}>
        <StatsCards
          total={totalTravels}
          pending={pendingCount}
          approved={approvedCount}
          completed={completedCount}
          destinations={uniqueDestinations}
        />
      </Suspense>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="detailed">Detailed Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle>Monthly Travel Trends</CardTitle>
                <CardDescription>Number of trips per month (all time)</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <Suspense fallback={<ChartSkeleton />}>
            {/* @ts-ignore */}
                  <MonthlyTrendChart data={monthlyChartData} />
                </Suspense>
              </CardContent>
            </Card>

            {/* Destination Distribution */}
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle>Travel by Destination</CardTitle>
                <CardDescription>Your most visited provinces</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <Suspense fallback={<ChartSkeleton />}>
                  <DestinationChart data={destinationChartData} />
                </Suspense>
              </CardContent>
            </Card>
          </div>

          {/* Status Breakdown */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Status Breakdown</CardTitle>
              <CardDescription>Distribution of your travel orders by status</CardDescription>
            </CardHeader>
            <CardContent className="h-72">
              <Suspense fallback={<ChartSkeleton />}>
                <StatusBreakdownChart data={statusChartData} />
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="detailed" className="space-y-6">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Recent Travel Orders</CardTitle>
              <CardDescription>Your latest travel requests</CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<TableSkeleton />}>
                <RecentTravelsTable orders={recentOrders} />
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Loading skeletons
function StatsCardsSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
      {[...Array(5)].map((_, i) => (
        <Card key={i} className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <Skeleton className="h-4 w-20" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-16" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function ChartSkeleton() {
  return <Skeleton className="h-full w-full rounded-lg" />
}

function TableSkeleton() {
  return (
    <div className="space-y-2">
      <Skeleton className="h-10 w-full" />
      {[...Array(5)].map((_, i) => (
        <Skeleton key={i} className="h-12 w-full" />
      ))}
    </div>
  )
}