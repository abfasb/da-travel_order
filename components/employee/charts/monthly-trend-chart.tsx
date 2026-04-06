'use client'

import { Line, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface MonthlyTrendProps {
  data: { month: string; count: number }[]
}

export function MonthlyTrendChart({ data }: MonthlyTrendProps) {
  if (!data || data.length === 0) {
    return <div className="flex items-center justify-center h-[300px] text-muted-foreground">No monthly data available.</div>
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="count" stroke="#2F6B3E" strokeWidth={2} name="Approved Travels" />
      </LineChart>
    </ResponsiveContainer>
  )
}