'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'

interface TravelTrendChartProps {
  data: { month: string; count: number }[]
}

const chartConfig = {
  count: {
    label: 'Travel Orders',
    color: 'hsl(var(--primary))',
  },
} satisfies ChartConfig

export function TravelTrendChart({ data }: TravelTrendChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground">
        No travel data for this year yet.
      </div>
    )
  }

  return (
    <ChartContainer config={chartConfig} className="h-full w-full">
      <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
        <XAxis
          dataKey="month"
          tick={{ fontSize: 12 }}
          className="fill-muted-foreground"
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 12 }}
          className="fill-muted-foreground"
          axisLine={false}
          tickLine={false}
          allowDecimals={false}
        />
        <ChartTooltip
          cursor={{ fill: 'hsl(var(--muted))' }}
          content={<ChartTooltipContent indicator="line" />}
        />
        <Bar dataKey="count" fill="var(--color-count)" radius={[4, 4, 0, 0]} barSize={40} />
      </BarChart>
    </ChartContainer>
  )
}