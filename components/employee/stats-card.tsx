'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface StatsCardProps {
  title: string
  value: string | number
  icon: React.ReactNode
  change?: string
  description?: string
  className?: string
}

export function StatsCard({ title, value, icon, change, description, className }: StatsCardProps) {
  const isPositiveChange = change?.startsWith('+')
  const changeColor = isPositiveChange ? 'text-emerald-600' : 'text-rose-600'

  return (
    <Card className={cn('overflow-hidden transition-all hover:shadow-md', className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className="rounded-lg bg-emerald-100 p-2 text-emerald-700">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {(change || description) && (
          <p className="text-xs text-muted-foreground mt-1">
            {change && <span className={cn('font-medium', changeColor)}>{change} </span>}
            {description}
          </p>
        )}
      </CardContent>
    </Card>
  )
}