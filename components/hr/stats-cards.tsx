import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, CheckCircle, Clock, Archive } from 'lucide-react'

const stats = [
  {
    title: 'Pending Numbers',
    value: '8',
    icon: Clock,
    description: 'awaiting assignment',
    change: '+2',
  },
  {
    title: 'Ready to Print',
    value: '5',
    icon: FileText,
    description: 'numbers assigned',
    change: '-1',
  },
  {
    title: 'Completed',
    value: '124',
    icon: CheckCircle,
    description: 'total processed',
    change: '+12',
  },
  {
    title: 'Archived',
    value: '1,203',
    icon: Archive,
    description: 'all time',
    change: '',
  },
]

export default function StatsCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <div className="rounded-lg bg-emerald-100 p-2 text-emerald-700">
              <stat.icon className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">
              {stat.change && (
                <span className={stat.change.startsWith('+') ? 'text-emerald-600' : 'text-rose-600'}>
                  {stat.change}{' '}
                </span>
              )}
              {stat.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}