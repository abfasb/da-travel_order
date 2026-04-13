'use client'

import { Line, LineChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'

interface MonthlyTrendChartProps {
  data: { month: string; count: number }[]
}

const chartConfig = {
  trips: {
    label: 'Number of Trips',
    color: '#10b981', 
  },
} satisfies ChartConfig

export function MonthlyTrendChart({ data }: MonthlyTrendChartProps) {
  const chartData = data.map(item => ({
    month: item.month,
    trips: item.count,
  }))

  if (chartData.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-slate-500">
        No travel data available yet.
      </div>
    )
  }

  return (
    <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
      <LineChart
        data={chartData}
        margin={{ top: 20, right: 20, left: 0, bottom: 20 }}
      >
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tickMargin={10}
          className="text-xs fill-slate-500"
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tickMargin={10}
          className="text-xs fill-slate-500"
          allowDecimals={false}
        />
        <ChartTooltip
          cursor={{ stroke: '#cbd5e1', strokeWidth: 1 }}
          content={<ChartTooltipContent indicator="line" />}
        />
        <Line
          type="monotone"
          dataKey="trips"
          stroke="var(--color-trips)"
          strokeWidth={3}
          dot={{ fill: 'var(--color-trips)', r: 4, strokeWidth: 0 }}
          activeDot={{ r: 6, fill: 'var(--color-trips)' }}
        />
      </LineChart>
    </ChartContainer>
  )
}