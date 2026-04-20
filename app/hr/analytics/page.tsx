import { getCurrentUser } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { MonthlyTrendChart } from '@/components/hr/charts/monthly-trend-chart'
import { DivisionPieChart } from '@/components/hr/charts/division-pie-chart'
import { ProvinceBarChart } from '@/components/hr/charts/province-bar-chart'

export const dynamic = 'force-dynamic'

const divisionLabels: Record<string, string> = {
  regulatory: 'Regulatory',
  laboratory: 'Laboratory',
  research: 'Research',
  field_ops: 'Field Ops',
  agri_marketing: 'Agri-Marketing',
  engineering: 'Engineering',
  planning: 'Planning',
  info_section: 'Info Section',
  admin_finance: 'Admin & Finance',
  procurement: 'Procurement',
}

export default async function HRAnalyticsPage() {
  const user = await getCurrentUser()
  if (!user || user.role !== 'HR') redirect('/login')

  // Fetch all necessary data
  const [
    totalOrders,
    approved,           // fully approved, waiting for HR number
    hrProcessing,       // HR has assigned number but not yet finalized? (optional)
    completed,          // finalized by HR
    rejected,
    pendingReview,      // still in approvers' queues (PENDING/REVIEWING)
    totalEmployees,
    monthlyRaw,
    provinceRaw,
  ] = await Promise.all([
    prisma.travelOrderRequest.count(),
    prisma.travelOrderRequest.count({ where: { status: 'APPROVED' } }),
    prisma.travelOrderRequest.count({ where: { status: 'HR_PROCESSING' } }),
    prisma.travelOrderRequest.count({ where: { status: 'COMPLETED' } }),
    prisma.travelOrderRequest.count({ where: { status: 'REJECTED' } }),
    prisma.travelOrderRequest.count({
      where: { status: { in: ['PENDING', 'REVIEWING'] } },
    }),
    prisma.user.count({ where: { role: 'STAFF' } }),
    prisma.$queryRaw<{ month: string; pending: number; completed: number }[]>`
      SELECT 
        TO_CHAR(DATE_TRUNC('month', "createdAt"), 'Mon') as month,
        COUNT(*) FILTER (WHERE status IN ('APPROVED', 'HR_PROCESSING'))::int as pending,
        COUNT(*) FILTER (WHERE status = 'COMPLETED')::int as completed
      FROM travel_orders
      GROUP BY DATE_TRUNC('month', "createdAt")
      ORDER BY DATE_TRUNC('month', "createdAt")
    `,
    prisma.travelOrderRequest.groupBy({
      by: ['destinationProvince'],
      _count: { destinationProvince: true },
      orderBy: { _count: { destinationProvince: 'desc' } },
      take: 10,
    }),
  ])

  // Combine APPROVED + HR_PROCESSING for "Pending HR Action" stat
  const pendingHRAction = approved + hrProcessing

  const divisionData = await prisma.user.groupBy({
    by: ['division'],
    where: { division: { not: null } },
    _count: { id: true },
  })

  const divisionChartData = divisionData
    .filter(d => d.division)
    .map(d => ({
      name: divisionLabels[d.division!] || d.division,
      value: d._count.id,
    }))

  const provinceChartData = provinceRaw.map(p => ({
    name: p.destinationProvince,
    value: p._count.destinationProvince,
  }))

  const monthlyChartData = monthlyRaw.map(d => ({
    month: d.month,
    pending: d.pending,
    completed: d.completed,
  }))

  return (
    <div className="p-6 lg:p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          HR Analytics
        </h1>
        <p className="text-muted-foreground">
          Comprehensive overview of travel order metrics and processing pipeline.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending Review
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
              {pendingReview}
            </div>
            <p className="text-xs text-muted-foreground">With approvers</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending HR
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {pendingHRAction}
            </div>
            <p className="text-xs text-muted-foreground">Awaiting number/print</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              {completed}
            </div>
            <p className="text-xs text-muted-foreground">Finalized</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Rejected
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
              {rejected}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Employees
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEmployees}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Completion Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalOrders > 0
                ? ((completed / totalOrders) * 100).toFixed(1)
                : '0'}%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Tabs */}
      <Tabs defaultValue="monthly" className="space-y-4">
        <TabsList>
          <TabsTrigger value="monthly">Monthly Trend</TabsTrigger>
          <TabsTrigger value="province">By Province</TabsTrigger>
          <TabsTrigger value="division">By Division</TabsTrigger>
        </TabsList>

        <TabsContent value="monthly">
          <Card>
            <CardHeader>
              <CardTitle>Pending (HR) vs Completed Orders</CardTitle>
            </CardHeader>
            <CardContent className="h-96">
              <MonthlyTrendChart data={monthlyChartData} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="province">
          <Card>
            <CardHeader>
              <CardTitle>Top Destinations</CardTitle>
            </CardHeader>
            <CardContent className="h-96">
              <ProvinceBarChart data={provinceChartData} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="division">
          <Card>
            <CardHeader>
              <CardTitle>Staff Distribution</CardTitle>
            </CardHeader>
            <CardContent className="h-96">
              { /* @ts-ignore */ }
              <DivisionPieChart data={divisionChartData} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}