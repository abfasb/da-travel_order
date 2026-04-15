import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, Clock, CheckCircle, CalendarCheck, MapPin } from 'lucide-react'

interface StatsCardsProps {
  total: number
  pending: number
  approved: number
  completed: number
  destinations: number
}

export function StatsCards({ total, pending, approved, completed, destinations }: StatsCardsProps) {
  const stats = [
    { label: 'Total Travels', value: total, icon: FileText, color: 'text-slate-700 dark:text-slate-300', iconBg: 'bg-slate-100 dark:bg-slate-800' },
    { label: 'Pending/Review', value: pending, icon: Clock, color: 'text-amber-700 dark:text-amber-300', iconBg: 'bg-amber-100 dark:bg-amber-900/30' },
    { label: 'Approved', value: approved, icon: CheckCircle, color: 'text-emerald-700 dark:text-emerald-300', iconBg: 'bg-emerald-100 dark:bg-emerald-900/30' },
    { label: 'Completed', value: completed, icon: CalendarCheck, color: 'text-blue-700 dark:text-blue-300', iconBg: 'bg-blue-100 dark:bg-blue-900/30' },
    { label: 'Destinations', value: destinations, icon: MapPin, color: 'text-purple-700 dark:text-purple-300', iconBg: 'bg-purple-100 dark:bg-purple-900/30' },
  ]

  return (
    <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
      {stats.map(stat => (
        <Card key={stat.label} className="border-0 shadow-sm bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
            <div className={`rounded-lg p-2 ${stat.iconBg}`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}