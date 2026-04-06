import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { startOfMonth, endOfMonth, startOfYear, endOfYear } from 'date-fns'
import { StatsCard } from '@/components/employee/stats-card'
import { RecentRequestsTable } from '@/components/employee/recent-requests-table'
import { TravelCalendar } from '@/components/employee/travel-calendar'
import { TravelFrequencyChart } from '@/components/employee/charts/travel-frequency-chart'
import { Clock, CheckCircle, Plane } from 'lucide-react'
import { MonthlyTrendChart } from '@/components/employee/charts/monthly-trend-chart'

export default async function DashboardPage() {
  const cookieStore = await cookies()
  const userId = cookieStore.get('auth_session')?.value

  if (!userId) {
    return <div className="p-8 text-center">Please log in to view your dashboard.</div>
  }

  const now = new Date()
  const firstDayOfMonth = startOfMonth(now)
  const lastDayOfMonth = endOfMonth(now)
  const firstDayOfYear = startOfYear(now)
  const lastDayOfYear = endOfYear(now)

  // Stats
  const pendingCount = await prisma.travelOrderRequest.count({
    where: { userId, status: 'PENDING' },
  })
  const approvedThisMonth = await prisma.travelOrderRequest.count({
    where: {
      userId,
      status: 'APPROVED',
      createdAt: { gte: firstDayOfMonth, lte: lastDayOfMonth },
    },
  })
  const totalTravelsThisYear = await prisma.travelOrderRequest.count({
    where: {
      userId,
      status: 'APPROVED',
      createdAt: { gte: firstDayOfYear, lte: lastDayOfYear },
    },
  })

  const stats = [
    { title: 'Pending Requests', value: pendingCount, icon: <Clock className="h-4 w-4" /> },
    { title: 'Approved This Month', value: approvedThisMonth, icon: <CheckCircle className="h-4 w-4" /> },
    { title: 'Total Travels (2026)', value: totalTravelsThisYear, icon: <Plane className="h-4 w-4" /> },
  ]

  // Calendar events (upcoming travels only)
  const today = new Date()
  const travelOrdersForCalendar = await prisma.travelOrderRequest.findMany({
    where: {
      userId,
      departureDate: { gte: today },
    },
    select: {
      id: true,
      travelOrderNumber: true,
      purpose: true,
      destinationProvince: true,
      specificLocation: true,
      departureDate: true,
      status: true,
    },
    orderBy: { departureDate: 'asc' },
  })

  const calendarEvents = travelOrdersForCalendar.map(order => ({
    id: order.travelOrderNumber || order.id,
    title: order.purpose.substring(0, 40),
    destination: order.destinationProvince,
    location: order.specificLocation,
    date: order.departureDate,
    status: order.status === 'APPROVED' ? 'Approved' : order.status === 'PENDING' ? 'Pending' : order.status,
  }))

  const frequencyData = await prisma.travelOrderRequest.groupBy({
    by: ['destinationProvince'],
    where: { userId, status: 'APPROVED' },
    _count: { destinationProvince: true },
  })

  const chartData = frequencyData
    .map(item => ({ province: item.destinationProvince, travels: item._count.destinationProvince }))
    .sort((a, b) => b.travels - a.travels)
    .slice(0, 5)

  const rawMonthly = await prisma.$queryRaw<{ month: string; count: number }[]>`
    SELECT 
      TO_CHAR(DATE_TRUNC('month', "createdAt"), 'Mon YYYY') as month,
      COUNT(*)::int as count
    FROM travel_orders
    WHERE "userId" = ${userId} AND status = 'APPROVED'
    GROUP BY DATE_TRUNC('month', "createdAt")
    ORDER BY DATE_TRUNC('month', "createdAt") DESC
    LIMIT 12
  `
  const monthlyData = rawMonthly.reverse()

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <StatsCard key={stat.title} {...stat} />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <RecentRequestsTable />
        <TravelCalendar events={calendarEvents} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border bg-card p-6">
          <h2 className="mb-4 text-lg font-semibold">Your Travel Frequency (by Province)</h2>
          <TravelFrequencyChart data={chartData} />
        </div>
        <div className="rounded-lg border bg-card p-6">
          <h2 className="mb-4 text-lg font-semibold">Monthly Travel Trend</h2>
          <MonthlyTrendChart data={monthlyData} />
        </div>
      </div>
    </div>
  )
}