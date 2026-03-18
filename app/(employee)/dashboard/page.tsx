// app/(employee)/dashboard/page.tsx
import { StatsCard } from '@/components/employee/stats-card'
import { RecentRequestsTable } from '@/components/employee/recent-requests-table'
import { TravelCalendar } from '@/components/employee/travel-calendar'
import { TravelFrequencyChart } from '@/components/employee/charts/travel-frequency-chart'

export default function DashboardPage() {
  // Mock data – replace with real data fetching
  const stats = [
    { title: 'Pending Requests', value: 3, icon: 'Clock', change: '+1' },
    { title: 'Approved This Month', value: 5, icon: 'CheckCircle', change: '+2' },
    { title: 'Total Travels (2026)', value: 12, icon: 'Plane', change: '+4' },
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <StatsCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* Two column layout */}
      <div className="grid gap-6 lg:grid-cols-2">
        <RecentRequestsTable />
        <TravelCalendar />
      </div>

      {/* Chart */}
      <div className="rounded-lg border bg-card p-6">
        <h2 className="mb-4 text-lg font-semibold">Your Travel Frequency</h2>
        <TravelFrequencyChart />
      </div>
    </div>
  )
}