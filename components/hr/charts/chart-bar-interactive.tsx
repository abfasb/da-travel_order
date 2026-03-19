'use client'

import * as React from 'react'
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'

// Extended data with random math (This is what was causing the hydration error!)
const extendedData = Array.from({ length: 90 }, (_, i) => {
  const date = new Date(2024, 3, 1 + i) // starting April 1
  return {
    date: date.toISOString().split('T')[0],
    approved: Math.floor(Math.random() * 20) + 5,
    pending: Math.floor(Math.random() * 10) + 1,
  }
})

const chartConfig = {
  views: {
    label: "Travel Orders",
  },
  approved: {
    label: "Approved",
    color: "#2F6B3E", // primary green
  },
  pending: {
    label: "Pending",
    color: "#EAB308", // yellow
  },
} satisfies ChartConfig

export function ChartBarInteractive() {
  const [activeChart, setActiveChart] = React.useState<keyof typeof chartConfig>('approved')
  
  // FIX: Add this state to track if the browser has loaded
  const [isMounted, setIsMounted] = React.useState(false)

  React.useEffect(() => {
    setIsMounted(true)
  }, [])

  const total = React.useMemo(
    () => ({
      approved: extendedData.reduce((acc, curr) => acc + curr.approved, 0),
      pending: extendedData.reduce((acc, curr) => acc + curr.pending, 0),
    }),
    []
  )

  // FIX: Return a loading skeleton while the server is rendering
  if (!isMounted) {
    return (
      <Card className="py-0 h-[400px] w-full flex items-center justify-center bg-slate-50 animate-pulse">
        <p className="text-muted-foreground text-sm">Loading Chart Data...</p>
      </Card>
    )
  }

  return (
    <Card className="py-0">
      <CardHeader className="flex flex-col items-stretch border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 pt-4 pb-3 sm:py-4">
          <CardTitle>Daily Travel Orders</CardTitle>
          <CardDescription>
            Approved vs Pending orders over the last 3 months
          </CardDescription>
        </div>
        <div className="flex">
          {['approved', 'pending'].map((key) => {
            const chart = key as keyof typeof chartConfig
            return (
              <button
                key={chart}
                data-active={activeChart === chart}
                className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-t-0 sm:border-l sm:px-8 sm:py-6"
                onClick={() => setActiveChart(chart)}
              >
                <span className="text-xs text-muted-foreground">
                  {chartConfig[chart].label}
                </span>
                <span className="text-lg leading-none font-bold sm:text-3xl">
                  {total[key as keyof typeof total].toLocaleString()}
                </span>
              </button>
            )
          })}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={extendedData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                })
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="views"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })
                  }}
                />
              }
            />
            <Bar dataKey={activeChart} fill={`var(--color-${activeChart})`} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}