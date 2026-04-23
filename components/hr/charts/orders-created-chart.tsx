"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

interface OrdersCreatedChartProps {
  data: { date: string; count: number }[]
}

const chartConfig = {
  orders: {
    label: "Travel Orders Created",
    // This color is used for the tiny square in the tooltip
    color: "currentColor", 
  },
} satisfies ChartConfig

export function OrdersCreatedChart({ data }: OrdersCreatedChartProps) {
  const total = React.useMemo(
    () => data.reduce((acc, curr) => acc + curr.count, 0),
    [data]
  )

  if (data.length === 0) {
    return (
      <Card className="border-border/50 dark:border-white/10 dark:bg-zinc-950/50">
        <CardHeader>
          <CardTitle className="dark:text-zinc-100">Daily Travel Orders Created</CardTitle>
          <CardDescription className="dark:text-zinc-400">Last 30 days</CardDescription>
        </CardHeader>
        <CardContent className="flex h-[250px] items-center justify-center">
          <p className="text-muted-foreground dark:text-zinc-500">No order data available.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="overflow-hidden border-border/50 dark:border-white/10 dark:bg-zinc-950/40 shadow-sm dark:shadow-none transition-colors">
      <CardHeader className="flex flex-col items-stretch border-b border-border/50 dark:border-white/10 p-0 sm:flex-row dark:bg-gradient-to-b dark:from-white/[0.02] dark:to-transparent">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 pt-4 pb-3 sm:py-0">
          <CardTitle className="dark:text-zinc-100">Daily Orders Created</CardTitle>
          <CardDescription className="dark:text-zinc-400">Last 30 days</CardDescription>
        </div>
        <div className="flex">
          <div className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t border-border/50 dark:border-white/10 px-6 py-4 text-left sm:border-t-0 sm:border-l sm:px-8 sm:py-6 bg-muted/50 dark:bg-white/[0.03]">
            <span className="text-xs text-muted-foreground dark:text-zinc-400">Total Orders</span>
            <span className="text-lg leading-none font-bold sm:text-3xl dark:text-zinc-100">
              {total.toLocaleString()}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6 ">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full text-zinc-900 dark:text-zinc-100"
        >
          <BarChart
            accessibilityLayer
            data={data}
            margin={{ left: 12, right: 12 }}
          >
            <CartesianGrid vertical={false} strokeOpacity={0.2} className="dark:stroke-white/10" />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              className="dark:fill-zinc-400"
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px] dark:bg-zinc-900 dark:border-white/10 dark:text-zinc-100"
                  nameKey="orders"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  }}
                />
              }
            />
            <Bar 
              dataKey="count" 
              fill="currentColor" 
              radius={[4, 4, 0, 0]} 
              className="text-zinc-900 dark:text-green-400 dark:opacity-90 hover:dark:opacity-100 transition-opacity" 
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}