'use client'

import { useTheme } from 'next-themes'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'

const statusColors: Record<string, string> = {
  PENDING: '#fbbf24',
  REVIEWING: '#60a5fa',
  APPROVED: '#34d399',
  REJECTED: '#f87171',
  HR_PROCESSING: '#a78bfa',
  COMPLETED: '#9ca3af',
}

interface StatusBreakdownChartProps {
  data: { name: string; value: number }[]
}

export function StatusBreakdownChart({ data }: StatusBreakdownChartProps) {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  if (data.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground">
        No data available
      </div>
    )
  }

  const axisColor = isDark ? '#94a3b8' : '#64748b'
  const gridColor = isDark ? '#334155' : '#e2e8f0'

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} layout="vertical" margin={{ top: 5, right: 20, left: 60, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} horizontal={false} />
        <XAxis type="number" tick={{ fontSize: 12, fill: axisColor }} axisLine={false} tickLine={false} />
        <YAxis type="category" dataKey="name" tick={{ fontSize: 12, fill: axisColor }} axisLine={false} tickLine={false} width={80} />
        <Tooltip
          contentStyle={{
            backgroundColor: isDark ? '#1e293b' : '#fff',
            border: isDark ? '1px solid #334155' : '1px solid #e2e8f0',
            borderRadius: '8px',
            color: isDark ? '#f1f5f9' : '#0f172a',
          }}
          cursor={{ fill: isDark ? '#334155' : '#f1f5f9' }}
        />
        <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={24}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={statusColors[entry.name] || '#6b7280'} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}