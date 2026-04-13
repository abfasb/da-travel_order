import { getCurrentUser } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { TravelCalendar } from '@/components/division-head/travel-calendar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Suspense } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { CalendarDays, Users, MapPin, CheckCircle } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function CalendarPage() {
  const user = await getCurrentUser()
  if (!user || user.role !== 'DIVISION_HEAD' || !user.division) {
    redirect('/login')
  }

  const division = user.division

  const travelOrders = await prisma.travelOrderRequest.findMany({
    where: { user: { division } },
    include: {
      user: {
        select: {
          firstName: true,
          lastName: true,
          employmentStatus: true,
        },
      },
    },
    orderBy: { departureDate: 'asc' },
  })

  const now = new Date()
  const activeTravels = travelOrders.filter(
    o => new Date(o.departureDate) <= now && new Date(o.returnDate) >= now
  ).length
  const upcomingTravels = travelOrders.filter(
    o => new Date(o.departureDate) > now
  ).length
  const uniqueStaff = new Set(travelOrders.map(o => o.userId)).size
  const uniqueDestinations = new Set(travelOrders.map(o => o.destinationProvince)).size

  const stats = [
    { label: 'Total Travels', value: travelOrders.length, icon: CalendarDays, color: 'bg-blue-50 text-blue-600' },
    { label: 'Active Now', value: activeTravels, icon: CheckCircle, color: 'bg-emerald-50 text-emerald-600' },
    { label: 'Staff Traveling', value: uniqueStaff, icon: Users, color: 'bg-purple-50 text-purple-600' },
    { label: 'Destinations', value: uniqueDestinations, icon: MapPin, color: 'bg-amber-50 text-amber-600' },
  ]

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Travel Calendar</h1>
        <p className="text-slate-500">
          Visualize all scheduled travel for your division. Click any event for details.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map(stat => (
          <Card key={stat.label} className="border-0 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">{stat.label}</CardTitle>
              <div className={`rounded-lg p-2 ${stat.color}`}>
                <stat.icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-0 shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <Suspense fallback={<CalendarSkeleton />}>
            <TravelCalendar orders={travelOrders} />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  )
}

function CalendarSkeleton() {
  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-10 w-64" />
        <div className="flex gap-2">
          <Skeleton className="h-9 w-20" />
          <Skeleton className="h-9 w-20" />
          <Skeleton className="h-9 w-20" />
        </div>
      </div>
      <Skeleton className="h-[600px] w-full rounded-lg" />
    </div>
  )
}