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
      <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
        No travel data for this year yet.
      </div>
    )
  }

  return (
    <ChartContainer config={chartConfig} className="h-full w-full">
      <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        {/* Added explicit dark mode stroke for the grid lines */}
        <CartesianGrid 
          strokeDasharray="3 3" 
          className="stroke-gray-200 dark:stroke-gray-700" 
          vertical={false} 
        />
        
        {/* Forced the text to turn light gray in dark mode using fill */}
        <XAxis
          dataKey="month"
          tick={{ fontSize: 12 }}
          className="fill-gray-600 dark:fill-gray-300"
          axisLine={false}
          tickLine={false}
        />
        
        <YAxis
          tick={{ fontSize: 12 }}
          className="fill-gray-600 dark:fill-gray-300"
          axisLine={false}
          tickLine={false}
          allowDecimals={false}
        />
        
        <ChartTooltip
          cursor={{ className: 'fill-gray-100 dark:fill-gray-800' }}
          content={<ChartTooltipContent indicator="line" className="dark:bg-black dark:border-gray-800" />}
        />
        
        <Bar 
          dataKey="count" 
          className="fill-slate-900 dark:fill-slate-200" 
          radius={[4, 4, 0, 0]} 
          barSize={40} 
        />
      </BarChart>
    </ChartContainer>
  )
}