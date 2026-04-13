'use client'

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
  if (data.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-slate-500">
        No data available
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} layout="vertical" margin={{ top: 5, right: 20, left: 60, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
        <XAxis type="number" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
        <YAxis type="category" dataKey="name" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} width={80} />
        <Tooltip
          contentStyle={{
            backgroundColor: '#fff',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
          }}
          cursor={{ fill: '#f1f5f9' }}
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