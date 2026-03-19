'use client'

import * as React from 'react'
import { TrendingUp } from 'lucide-react'
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from 'recharts'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'

const chartData = [
  { month: 'January', travels: 186 },
  { month: 'February', travels: 305 },
  { month: 'March', travels: 237 },
  { month: 'April', travels: 273 },
  { month: 'May', travels: 209 },
  { month: 'June', travels: 214 },
]

const chartConfig = {
  travels: {
    label: 'Travels',
    color: '#2F6B3E', 
  },
} satisfies ChartConfig

export function ChartRadar() {
  // FIX: Add this state to track if the browser has loaded
  const [isMounted, setIsMounted] = React.useState(false)

  React.useEffect(() => {
    setIsMounted(true)
  }, [])

  // FIX: Return a loading skeleton while the server is rendering
  if (!isMounted) {
    return (
      <Card className="h-[400px] flex flex-col items-center justify-center bg-slate-50 animate-pulse">
        <p className="text-muted-foreground text-sm">Loading Radar...</p>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="items-center">
        <CardTitle>Monthly Travel Distribution</CardTitle>
        <CardDescription>January - June 2026</CardDescription>
      </CardHeader>
      <CardContent className="pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <RadarChart data={chartData}>
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <PolarAngleAxis dataKey="month" />
            <PolarGrid />
            <Radar
              dataKey="travels"
              fill="var(--color-travels)"
              fillOpacity={0.6}
              dot={{
                r: 4,
                fillOpacity: 1,
              }}
            />
          </RadarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="flex items-center gap-2 leading-none text-muted-foreground">
          Based on approved travel orders
        </div>
      </CardFooter>
    </Card>
  )
}