'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import ProvinceChart from '@/components/employee/charts/province-chart'
import { MonthlyTrendChart } from '@/components/employee/charts/monthly-travel-chart'
import { DivisionChart } from '@/components/employee/charts/division-chart'
import { ChartBarInteractive } from '@/components/hr/charts/chart-bar-interactive'
import { ChartRadar } from '@/components/hr/charts/radar.-chart'

export default function HRAnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">HR Analytics</h1>
        <p className="text-muted-foreground">Overall travel statistics and insights.</p>
      </div>

      <ChartBarInteractive />

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Travel Volume</CardTitle>
          </CardHeader>
          <CardContent>
            <MonthlyTrendChart />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Travels by Province</CardTitle>
          </CardHeader>
          <CardContent>
            <ProvinceChart />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Travels by Division</CardTitle>
          </CardHeader>
          <CardContent>
            <DivisionChart />
          </CardContent>
        </Card>
        <ChartRadar />
      </div>
    </div>
  )
}