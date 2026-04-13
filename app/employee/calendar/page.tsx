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
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">My Travel Calendar</h1>
        <p className="text-slate-500">
          View your upcoming and past travel orders in a calendar view.
        </p>
      </div>

      {/* Simple Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-0 shadow-sm bg-gradient-to-br from-blue-50 to-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Upcoming Travels</p>
                <p className="text-3xl font-bold text-blue-700">{upcomingCount}</p>
              </div>
              <CalendarDays className="h-8 w-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm bg-gradient-to-br from-emerald-50 to-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Active Now</p>
                <p className="text-3xl font-bold text-emerald-700">{activeCount}</p>
              </div>
              <CalendarDays className="h-8 w-8 text-emerald-200" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm bg-gradient-to-br from-purple-50 to-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Completed</p>
                <p className="text-3xl font-bold text-purple-700">{completedCount}</p>
              </div>
              <CalendarDays className="h-8 w-8 text-purple-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-0 shadow-sm overflow-hidden">
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