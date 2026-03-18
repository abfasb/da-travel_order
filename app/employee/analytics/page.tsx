import { Metadata } from 'next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { MonthlyTrendChart } from '@/components/employee/charts/monthly-travel-chart'
import { StatsCards } from '@/components/employee/charts/stats-cards'
import { TravelFrequencyChart } from '@/components/employee/charts/travel-frequency-chart'
import { DivisionChart } from '@/components/employee/charts/division-chart'
import { RecentTravelsTable } from '@/components/employee/recent-travels-table-analytics'

export const metadata: Metadata = {
  title: 'Analytics | TOMS Employee',
  description: 'Travel analytics and insights',
}

export default async function AnalyticsPage() {
  // In a real app, fetch data from your API
  // const analyticsData = await fetchAnalytics()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
        <p className="text-muted-foreground">Overview of your travel activities and insights.</p>
      </div>

      {/* Key Metrics */}
      <StatsCards />

      {/* Tabs for different views */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="detailed">Detailed Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Two column layout for charts */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            {/* Travel Frequency by Province – takes 4 columns on large screens */}
            <Card className="md:col-span-2 lg:col-span-4">
              <CardHeader>
                <CardTitle>Travel Frequency by Province</CardTitle>
                <CardDescription>Your travels across MIMAROPA (2026)</CardDescription>
              </CardHeader>
              <CardContent>
                <TravelFrequencyChart />
              </CardContent>
            </Card>

            {/* Travels by Division – takes 3 columns */}
            <Card className="md:col-span-2 lg:col-span-3">
              <CardHeader>
                <CardTitle>Travels by Division</CardTitle>
                <CardDescription>Distribution of your trips</CardDescription>
              </CardHeader>
              <CardContent>
                <DivisionChart />
              </CardContent>
            </Card>
          </div>

          {/* Monthly Trend Chart – full width */}
          <Card>
            <CardHeader>
              <CardTitle>Monthly Travel Trends</CardTitle>
              <CardDescription>Number of trips per month in 2026</CardDescription>
            </CardHeader>
            <CardContent>
              <MonthlyTrendChart />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="detailed" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Travels</CardTitle>
              <CardDescription>Your latest travel orders</CardDescription>
            </CardHeader>
            <CardContent>
              <RecentTravelsTable />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}