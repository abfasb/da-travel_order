'use client'

import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from 'recharts'
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'

interface ChartData {
  province: string
  travels: number
}

interface TravelFrequencyChartProps {
  data: ChartData[]
}

const chartConfig = {
  travels: {
    label: 'Total Travels',
    color: 'hsl(var(--primary))', // 👈 use theme primary
  },
} satisfies ChartConfig

export function TravelFrequencyChart({ data }: TravelFrequencyChartProps) {
  if (!data || data.length === 0) {
    return <div className="flex items-center justify-center h-[300px] text-muted-foreground">No travel data available.</div>
  }

  return (
    <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
      <BarChart accessibilityLayer data={data} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid horizontal={false} strokeDasharray="3 3" className="stroke-muted" />
        <XAxis type="number" dataKey="travels" hide />
        <YAxis dataKey="province" type="category" tickLine={false} axisLine={false} hide />
        <ChartTooltip cursor={{ fill: 'var(--theme-primary)', opacity: 0.1 }} content={<ChartTooltipContent indicator="line" />} />
        <Bar dataKey="travels" layout="vertical" fill="var(--color-travels)" radius={[0, 6, 6, 0]} barSize={40}>
          <LabelList dataKey="province" position="insideLeft" offset={16} className="fill-primary-foreground font-semibold text-sm drop-shadow-sm" />
          <LabelList dataKey="travels" position="right" offset={12} className="fill-foreground font-bold text-sm" />
        </Bar>
      </BarChart>
    </ChartContainer>
  )
}