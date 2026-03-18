import { RecentRequestsTable } from '@/components/employee/recent-requests-table'
import { TravelCalendar } from '@/components/employee/travel-calendar'
import { TravelFrequencyChart } from '@/components/employee/charts/travel-frequency-chart'
import { StatsCard } from '@/components/employee/stats-card'
import { Clock, CheckCircle, Plane } from 'lucide-react'

export default function DashboardPage() {
  const stats = [
    { title: 'Pending Requests', value: 3, icon: <Clock className="h-4 w-4" />, change: '+1' },
    { title: 'Approved This Month', value: 5, icon: <CheckCircle className="h-4 w-4" />, change: '+2' },
    { title: 'Total Travels (2026)', value: 12, icon: <Plane className="h-4 w-4" />, change: '+4' },
  ]

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
        <TravelCalendar />
      </div>

      <div className="rounded-lg border bg-card p-6">
        <h2 className="mb-4 text-lg font-semibold">Your Travel Frequency</h2>
        <TravelFrequencyChart />
      </div>
    </div>
  )
}