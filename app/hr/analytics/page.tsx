import { getCurrentUser } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { MonthlyTrendChart } from '@/components/hr/charts/monthly-trend-chart'
import { DivisionPieChart } from '@/components/hr/charts/division-pie-chart'
import { ProvinceBarChart } from '@/components/hr/charts/province-bar-chart'
import { StatusBreakdownInteractive } from '@/components/hr/charts/status-breakdown-interactive'

export const dynamic = 'force-dynamic'

// Full professional division labels matching registration form
const divisionLabels: Record<string, string> = {
  regulatory: 'Regulatory Division',
  laboratory: 'Integrated Laboratory Division',
  research: 'Research Division',
  field_ops: 'Field Operations Division',
  agri_marketing: 'Agribusiness and Marketing Assistance Division',
  engineering: 'Regional Agricultural Engineering Division',
  planning: 'Planning, Monitoring and Evaluation Division',
  info_section: 'Regional Agriculture & Fisheries Information Section',
  admin_finance: 'Administrative & Finance Division',
  procurement: 'Procurement of Goods and Infrastructure',
}

export default async function HRAnalyticsPage() {
  const user = await getCurrentUser()
  if (!user || user.role !== 'HR') redirect('/login')

  // Fetch all necessary data
  const [
    totalOrders,
    approved,
    hrProcessing,
    completed,
    rejected,
    pendingReview,
    totalEmployees,
    monthlyRaw,
    provinceRaw,
    allOrdersForTimeline,
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
    prisma.travelOrderRequest.findMany({
      select: {
        id: true,
        status: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    }),
  ])

  const pendingHRAction = approved + hrProcessing

  const divisionData = await prisma.user.groupBy({
    by: ['division'],
    where: { division: { not: null } },
    _count: { id: true },
  })

  const divisionChartData = divisionData
    .filter(d => d.division)
    .map(d => ({
      name: divisionLabels[d.division!] || d.division!,
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
          <TabsTrigger value="timeline">Status Timeline</TabsTrigger>
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
              <CardTitle>Staff Distribution by Division</CardTitle>
            </CardHeader>
            <CardContent className="h-96">
              <DivisionPieChart data={divisionChartData} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timeline">
          <StatusBreakdownInteractive orders={allOrdersForTimeline} />
        </TabsContent>
      </Tabs>
    </div>
  )
}