'use client'

import { Line, LineChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'

const chartData = [
  { month: 'Jan', trips: 4 },
  { month: 'Feb', trips: 3 },
  { month: 'Mar', trips: 5 },
  { month: 'Apr', trips: 2 },
  { month: 'May', trips: 6 },
  { month: 'Jun', trips: 4 },
  { month: 'Jul', trips: 7 },
  { month: 'Aug', trips: 5 },
  { month: 'Sep', trips: 3 },
  { month: 'Oct', trips: 4 },
  { month: 'Nov', trips: 2 },
  { month: 'Dec', trips: 3 },
]

const chartConfig = {
  trips: {
    label: 'Number of Trips',
    color: '#2F6B3E',
  },
} satisfies ChartConfig

export function MonthlyTrendChart() {
  return (
    <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
      <LineChart
        data={chartData}
        margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
      >
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tickMargin={10}
          className="text-xs"
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tickMargin={10}
          className="text-xs"
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="line" />}
        />
        <Line
          type="monotone"
          dataKey="trips"
          stroke="var(--color-trips)"
          strokeWidth={3}
          dot={{ fill: 'var(--color-trips)', r: 4 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ChartContainer>
  )
}