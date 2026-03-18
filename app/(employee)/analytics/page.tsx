// app/(employee)/analytics/page.tsx
import { MonthlyTravelChart } from '@/components/employee/charts/monthly-travel-chart'
import { DivisionChart } from '@/components/employee/charts/division-chart'
import { ProvinceChart } from '@/components/employee/charts/province-chart'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Travels</CardTitle>
          </CardHeader>
          <CardContent>
            <MonthlyTravelChart />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Travels by Division</CardTitle>
          </CardHeader>
          <CardContent>
            <DivisionChart />
          </CardContent>
        </Card>
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Travels by Province</CardTitle>
          </CardHeader>
          <CardContent>
            <ProvinceChart />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}