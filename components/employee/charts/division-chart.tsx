'use client'

import { Pie, PieChart, Cell, Legend } from 'recharts'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'

const chartData = [
  { division: 'Regulatory', travels: 45 },
  { division: 'Field Operations', travels: 38 },
  { division: 'Laboratory', travels: 21 },
  { division: 'Research', travels: 18 },
  { division: 'Admin & Finance', travels: 12 },
]

const chartConfig = {
  travels: {
    label: 'Travels',
  },
} satisfies ChartConfig

const COLORS = ['#2F6B3E', '#4A8B5C', '#6AA67A', '#8FC097', '#B4D9B2']

export function DivisionChart() {
  return (
    <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
      <PieChart>
        <Pie
          data={chartData}
          dataKey="travels"
          nameKey="division"
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          paddingAngle={2}
          label={(entry) => `${entry.division}`}
          labelLine={false}
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <ChartTooltip
          content={<ChartTooltipContent />}
        />
        <Legend
          layout="vertical"
          align="right"
          verticalAlign="middle"
          iconType="circle"
          iconSize={8}
          wrapperStyle={{ fontSize: '12px' }}
        />
      </PieChart>
    </ChartContainer>
  )
}