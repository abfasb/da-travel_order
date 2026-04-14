import { getCurrentUser } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { EmployeeTravelCalendar } from '@/components/employee/employee-travel-calendar'
import { Card, CardContent } from '@/components/ui/card'
import { Suspense } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { CalendarDays } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function EmployeeCalendarPage() {
  const user = await getCurrentUser()
  if (!user || user.role !== 'STAFF') {
    redirect('/login')
  }

  const travelOrders = await prisma.travelOrderRequest.findMany({
    where: { userId: user.id },
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
  const upcomingCount = travelOrders.filter(o => new Date(o.departureDate) > now).length
  const activeCount = travelOrders.filter(
    o => new Date(o.departureDate) <= now && new Date(o.returnDate) >= now
  ).length
  const completedCount = travelOrders.filter(o => o.status === 'COMPLETED').length

  return (
    <div className="p-6 lg:p-8 space-y-6 w-full mx-auto dark:bg-black">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground dark:text-white">My Travel Calendar</h1>
        <p className="text-muted-foreground">
          View your upcoming and past travel orders in a calendar view.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Upcoming Card */}
        <Card className="border-0 shadow-sm bg-gradient-to-br from-blue-50 to-blue-50/50 dark:from-blue-950/40 dark:to-blue-950/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Upcoming Travels</p>
                <p className="text-3xl font-bold text-blue-700 dark:text-blue-400">{upcomingCount}</p>
              </div>
              <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30">
                <CalendarDays className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Active Now Card */}
        <Card className="border-0 shadow-sm bg-gradient-to-br from-emerald-50 to-emerald-50/50 dark:from-emerald-950/40 dark:to-emerald-950/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Now</p>
                <p className="text-3xl font-bold text-emerald-700 dark:text-emerald-400">{activeCount}</p>
              </div>
              <div className="p-3 rounded-full bg-emerald-100 dark:bg-emerald-900/30">
                <CalendarDays className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Completed Card */}
        <Card className="border-0 shadow-sm bg-gradient-to-br from-purple-50 to-purple-50/50 dark:from-purple-950/40 dark:to-purple-950/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Completed</p>
                <p className="text-3xl font-bold text-purple-700 dark:text-purple-400">{completedCount}</p>
              </div>
              <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900/30">
                <CalendarDays className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Calendar Card */}
      <Card className="border-0 shadow-sm overflow-hidden bg-card">
        <CardContent className="p-0">
          <Suspense fallback={<CalendarSkeleton />}>
            <EmployeeTravelCalendar orders={travelOrders} />
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
        <Skeleton className="h-10 w-48" />
        <div className="flex gap-2">
          <Skeleton className="h-9 w-20" />
          <Skeleton className="h-9 w-20" />
        </div>
      </div>
      <Skeleton className="h-[600px] w-full rounded-lg" />
    </div>
  )
}