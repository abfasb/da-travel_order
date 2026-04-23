"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import {
  Card,
  CardAction,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"
import { useIsMobile } from "@/hooks/use-mobile"

interface TravelOrder {
  id: string
  status: string
  createdAt: Date
}

interface StatusBreakdownInteractiveProps {
  orders: TravelOrder[]
}

const statusColors: Record<string, string> = {
  APPROVED: "#34d399",
  PENDING: "#fbbf24",
  REVIEWING: "#60a5fa",
  REJECTED: "#f87171",
  HR_PROCESSING: "#a78bfa",
  COMPLETED: "#9ca3af",
}

const statusLabels: Record<string, string> = {
  APPROVED: "Approved",
  PENDING: "Pending",
  REVIEWING: "Reviewing",
  REJECTED: "Rejected",
  HR_PROCESSING: "Processing",
  COMPLETED: "Completed",
}

export function StatusBreakdownInteractive({ orders }: StatusBreakdownInteractiveProps) {
  const isMobile = useIsMobile()
  const [timeRange, setTimeRange] = React.useState("90d")

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d")
    }
  }, [isMobile])

  const chartData = React.useMemo(() => {
    if (orders.length === 0) return []

    const today = new Date()
    let daysToSubtract = 90
    if (timeRange === "30d") daysToSubtract = 30
    else if (timeRange === "7d") daysToSubtract = 7
    const startDate = new Date(today)
    startDate.setDate(startDate.getDate() - daysToSubtract)
    startDate.setHours(0, 0, 0, 0)

    const dateMap: Record<string, Record<string, number>> = {}
    
    const currentDate = new Date(startDate)
    while (currentDate <= today) {
      const dateStr = currentDate.toISOString().split('T')[0]
      dateMap[dateStr] = {}
      Object.keys(statusLabels).forEach(status => {
        dateMap[dateStr][status] = 0
      })
      currentDate.setDate(currentDate.getDate() + 1)
    }

    orders.forEach(order => {
      const orderDate = new Date(order.createdAt)
      if (orderDate >= startDate) {
        const dateStr = orderDate.toISOString().split('T')[0]
        if (dateMap[dateStr]) {
          const status = order.status
          if (dateMap[dateStr][status] !== undefined) {
            dateMap[dateStr][status]++
          }
        }
      }
    })

    return Object.entries(dateMap)
      .map(([date, counts]) => ({
        date,
        ...counts,
      }))
      .sort((a, b) => a.date.localeCompare(b.date))
  }, [orders, timeRange])

  const activeStatuses = React.useMemo(() => {
    const statuses = new Set<string>()
    chartData.forEach(day => {
      Object.keys(statusLabels).forEach(status => {
        //@ts-ignore
        if (day[status] > 0) statuses.add(status)
      })
    })
    return Array.from(statuses)
  }, [chartData])

  const chartConfig = React.useMemo(() => {
    const config: ChartConfig = {
      visitors: { label: "Orders" },
    }
    activeStatuses.forEach(status => {
      config[status] = {
        label: statusLabels[status] || status,
        color: statusColors[status] || "#6b7280",
      }
    })
    return config
  }, [activeStatuses])

  if (orders.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Status Timeline</CardTitle>
          <CardDescription>Distribution of travel orders by status over time</CardDescription>
        </CardHeader>
        <CardContent className="flex h-[250px] items-center justify-center">
          <p className="text-muted-foreground">No travel orders yet.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Status Timeline</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Distribution of travel orders by status over time
          </span>
          <span className="@[540px]/card:hidden">Orders by status</span>
        </CardDescription>
        <CardAction>
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={setTimeRange}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:px-4! @[767px]/card:flex"
          >
            <ToggleGroupItem value="90d">Last 3 months</ToggleGroupItem>
            <ToggleGroupItem value="30d">Last 30 days</ToggleGroupItem>
            <ToggleGroupItem value="7d">Last 7 days</ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
              size="sm"
              aria-label="Select a value"
            >
              <SelectValue placeholder="Last 3 months" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d" className="rounded-lg">
                Last 3 months
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                Last 30 days
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                Last 7 days
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={chartData}>
            <defs>
              {activeStatuses.map(status => (
                <linearGradient
                  key={status}
                  id={`fill-${status}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor={`var(--color-${status})`}
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor={`var(--color-${status})`}
                    stopOpacity={0.1}
                  />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  }}
                  indicator="dot"
                />
              }
            />
            {activeStatuses.map(status => (
              <Area
                key={status}
                dataKey={status}
                type="natural"
                fill={`url(#fill-${status})`}
                stroke={`var(--color-${status})`}
                stackId="a"
              />
            ))}
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}