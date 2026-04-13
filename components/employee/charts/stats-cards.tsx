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
    { label: 'Total Travels', value: total, icon: FileText, color: 'bg-slate-50 text-slate-700', iconBg: 'bg-slate-100' },
    { label: 'Pending/Review', value: pending, icon: Clock, color: 'bg-amber-50 text-amber-700', iconBg: 'bg-amber-100' },
    { label: 'Approved', value: approved, icon: CheckCircle, color: 'bg-emerald-50 text-emerald-700', iconBg: 'bg-emerald-100' },
    { label: 'Completed', value: completed, icon: CalendarCheck, color: 'bg-blue-50 text-blue-700', iconBg: 'bg-blue-100' },
    { label: 'Destinations', value: destinations, icon: MapPin, color: 'bg-purple-50 text-purple-700', iconBg: 'bg-purple-100' },
  ]

  return (
    <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
      {stats.map(stat => (
        <Card key={stat.label} className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">{stat.label}</CardTitle>
            <div className={`rounded-lg p-2 ${stat.iconBg}`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}