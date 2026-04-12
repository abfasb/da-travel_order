import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, CheckCircle, Clock, Archive } from 'lucide-react'

interface StatsCardsProps {
  pending: number
  ready: number
  completed: number
  archived: number
}

export default function StatsCards({ pending, ready, completed, archived }: StatsCardsProps) {
  const stats = [
    {
      title: 'Pending Numbers',
      value: pending,
      icon: Clock,
      description: 'awaiting assignment',
      color: 'bg-amber-50 text-amber-700',
      iconBg: 'bg-amber-100',
    },
    {
      title: 'Ready to Print',
      value: ready,
      icon: FileText,
      description: 'numbers assigned',
      color: 'bg-blue-50 text-blue-700',
      iconBg: 'bg-blue-100',
    },
    {
      title: 'Completed',
      value: completed,
      icon: CheckCircle,
      description: 'total processed',
      color: 'bg-emerald-50 text-emerald-700',
      iconBg: 'bg-emerald-100',
    },
    {
      title: 'Archived',
      value: archived,
      icon: Archive,
      description: 'all time',
      color: 'bg-slate-50 text-slate-700',
      iconBg: 'bg-slate-100',
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title} className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              {stat.title}
            </CardTitle>
            <div className={`rounded-lg p-2 ${stat.iconBg}`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
            <p className="text-xs text-slate-500">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}