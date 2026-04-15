'use client'

import { useTheme } from 'next-themes'
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
    color: 'hsl(var(--primary))',
  },
} satisfies ChartConfig

export function MonthlyTrendChart({ data }: MonthlyTrendChartProps) {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  const chartData = data.map(item => ({
    month: item.month,
    trips: item.count,
  }))

  if (chartData.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground">
        No travel data available yet.
      </div>
    )
  }

  const axisColor = isDark ? '#94a3b8' : '#64748b'
  const gridColor = isDark ? '#334155' : '#e2e8f0'

  return (
    <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
      <LineChart data={chartData} margin={{ top: 20, right: 20, left: 0, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tickMargin={10}
          tick={{ fill: axisColor, fontSize: 12 }}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tickMargin={10}
          tick={{ fill: axisColor, fontSize: 12 }}
          allowDecimals={false}
        />
        <ChartTooltip
          cursor={{ stroke: isDark ? '#475569' : '#cbd5e1', strokeWidth: 1 }}
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