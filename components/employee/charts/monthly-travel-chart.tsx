'use client'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

const data = [
  { month: 'Jan', travels: 32 },
  { month: 'Feb', travels: 25 },
  { month: 'Mar', travels: 40 },
  { month: 'Apr', travels: 38 },
  { month: 'May', travels: 45 },
  { month: 'Jun', travels: 42 },
]

export function MonthlyTravelChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis dataKey="month" className="text-xs" />
        <YAxis className="text-xs" />
        <Tooltip
          contentStyle={{
            backgroundColor: 'hsl(var(--background))',
            borderColor: 'hsl(var(--border))',
            borderRadius: '0.5rem',
          }}
        />
        <Line
          type="monotone"
          dataKey="travels"
          stroke="#2F6B3E"
          strokeWidth={3}
          dot={{ fill: '#2F6B3E', r: 4 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}