'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

const data = [
  { province: 'Oriental Mindoro', travels: 40 },
  { province: 'Palawan', travels: 18 },
  { province: 'Marinduque', travels: 12 },
  { province: 'Occidental Mindoro', travels: 10 },
  { province: 'Romblon', travels: 8 },
]

export function ProvinceChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 20, right: 30, left: 80, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis type="number" className="text-xs" />
        <YAxis type="category" dataKey="province" className="text-xs" />
        <Tooltip
          contentStyle={{
            backgroundColor: 'hsl(var(--background))',
            borderColor: 'hsl(var(--border))',
            borderRadius: '0.5rem',
          }}
        />
        <Bar dataKey="travels" fill="#2F6B3E" radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}