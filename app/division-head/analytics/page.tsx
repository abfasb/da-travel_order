import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TravelTrendChart } from '@/components/division-head/travel-trend-chart';
import { TravelByProvinceChart } from '@/components/division-head/travel-by-province-chart';
import { StaffTravelFrequencyChart } from '@/components/division-head/staff-travel-frequency-chart';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default async function AnalyticsPage() {
  const user = await getCurrentUser();
  if (!user?.division) return null;

  const division = user.division;

  const totalTravels = await prisma.travelOrderRequest.count({
    where: { user: { division } },
  });

  const topDestinationResult = await prisma.travelOrderRequest.groupBy({
    by: ['destinationProvince'],
    where: { user: { division } },
    _count: { destinationProvince: true },
    orderBy: { _count: { destinationProvince: 'desc' } },
    take: 1,
  });
  const topDestination = topDestinationResult[0]?.destinationProvince || 'N/A';

  const avgDurationResult = await prisma.$queryRaw<{ avg_days: number }[]>`
    SELECT 
      ROUND(AVG(DATE_PART('day', "returnDate"::timestamp - "departureDate"::timestamp)))::int as avg_days
    FROM "travel_orders"
    WHERE "userId" IN (SELECT id FROM "users" WHERE division = ${division})
      AND "departureDate" IS NOT NULL 
      AND "returnDate" IS NOT NULL
  `;
  const avgDuration = avgDurationResult[0]?.avg_days || 0;

  const activeStaffResult = await prisma.$queryRaw<{ count: number }[]>`
    SELECT COUNT(DISTINCT "userId")::int as count
    FROM "travel_orders"
    WHERE "userId" IN (SELECT id FROM "users" WHERE division = ${division})
  `;
  const activeStaff = activeStaffResult[0]?.count || 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Analytics</h1>
        <p className="text-slate-500">Division travel insights and reports.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Travels</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTravels}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Top Destination</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{topDestination}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avg. Duration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgDuration} days</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Staff</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeStaff}</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Tabs */}
      <Tabs defaultValue="trends" className="space-y-4">
        <TabsList>
          <TabsTrigger value="trends">Monthly Trends</TabsTrigger>
          <TabsTrigger value="province">By Province</TabsTrigger>
          <TabsTrigger value="staff">Staff Frequency</TabsTrigger>
        </TabsList>

        <TabsContent value="trends">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Travel Volume</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <TravelTrendChart division={division} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="province">
          <Card>
            <CardHeader>
              <CardTitle>Travel by Province</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <TravelByProvinceChart division={division} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="staff">
          <Card>
            <CardHeader>
              <CardTitle>Staff Travel Frequency</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <StaffTravelFrequencyChart division={division} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}