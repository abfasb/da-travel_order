'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

interface MonthlyTrendChartProps {
  data: { month: string; pending: number; completed: number }[]
}

export function MonthlyTrendChart({ data }: MonthlyTrendChartProps) {
  if (data.length === 0) {
    return <div className="h-full flex items-center justify-center text-muted-foreground">No data</div>
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis dataKey="month" tick={{ fill: 'hsl(var(--foreground))' }} />
        <YAxis tick={{ fill: 'hsl(var(--foreground))' }} />
        <Tooltip
          contentStyle={{
            backgroundColor: 'hsl(var(--background))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '8px',
          }}
        />
        <Legend />
        <Line
          type="monotone"
          dataKey="pending"
          name="Pending HR Action"
          stroke="#f59e0b"
          strokeWidth={3}
          dot={{ fill: '#f59e0b', r: 4 }}
        />
        <Line
          type="monotone"
          dataKey="completed"
          name="Completed"
          stroke="#10b981"
          strokeWidth={3}
          dot={{ fill: '#10b981', r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}