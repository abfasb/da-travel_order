'use client'

import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from 'recharts'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'

const chartData = [
  { province: 'Oriental Mindoro', travels: 40 },
  { province: 'Palawan', travels: 18 },
  { province: 'Marinduque', travels: 12 },
  { province: 'Occidental Mindoro', travels: 10 },
  { province: 'Romblon', travels: 8 },
]

const chartConfig = {
  travels: {
    label: 'Total Travels',
    color: '#2F6B3E',
  },
} satisfies ChartConfig

export default function ProvinceChart() {
  return (
    <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
      <BarChart
        accessibilityLayer
        data={chartData}
        layout="vertical"
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid horizontal={false} strokeDasharray="3 3" className="stroke-muted" />
        <XAxis type="number" dataKey="travels" hide />
        <YAxis
          dataKey="province"
          type="category"
          tickLine={false}
          axisLine={false}
          hide
        />
        <ChartTooltip
          cursor={{ fill: 'var(--theme-primary)', opacity: 0.1 }}
          content={<ChartTooltipContent indicator="line" />}
        />
        <Bar
          dataKey="travels"
          layout="vertical"
          fill="var(--color-travels)"
          radius={[0, 6, 6, 0]}
          barSize={40}
        >
          <LabelList
            dataKey="province"
            position="insideLeft"
            offset={16}
            className="fill-white font-semibold text-sm drop-shadow-sm"
          />
          <LabelList
            dataKey="travels"
            position="right"
            offset={12}
            className="fill-foreground font-bold text-sm"
          />
        </Bar>
      </BarChart>
    </ChartContainer>
  )
}