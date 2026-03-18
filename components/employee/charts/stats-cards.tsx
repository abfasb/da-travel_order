'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plane, CheckCircle, Clock, Calendar } from 'lucide-react'

const stats = [
  {
    title: 'Total Trips',
    value: '24',
    change: '+12%',
    icon: Plane,
    description: 'vs last year',
  },
  {
    title: 'Approved',
    value: '18',
    change: '+8%',
    icon: CheckCircle,
    description: 'vs last year',
  },
  {
    title: 'Pending',
    value: '3',
    change: '-2',
    icon: Clock,
    description: 'awaiting approval',
  },
  {
    title: 'This Month',
    value: '4',
    icon: Calendar,
    description: 'scheduled trips',
  },
]

export function StatsCards() {
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
            {(stat.change || stat.description) && (
              <p className="text-xs text-muted-foreground">
                {stat.change && (
                  <span className={stat.change.startsWith('+') ? 'text-emerald-600' : 'text-rose-600'}>
                    {stat.change}{' '}
                  </span>
                )}
                {stat.description}
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}