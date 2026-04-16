import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { PlaneTakeoff, Briefcase } from 'lucide-react'
import { RequestForm } from '@/components/employee/request-form'
import { prisma } from '@/lib/prisma'

export default async function EmployeeDashboardPage() {
  const cookieStore = await cookies()
  const role = cookieStore.get('user_role')?.value
  const userId = cookieStore.get('auth_session')?.value 

  if (!role || role !== 'STAFF' || !userId) {
    redirect('/login')
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      employmentStatus: true,
    },
  })

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="bg-emerald-900 dark:bg-emerald-950 text-white p-8 rounded-3xl shadow-lg flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-black mb-2 tracking-tight">My Workspace</h1>
            <p className="text-emerald-200/80 dark:text-emerald-300/80 font-medium tracking-wide">
              Official DA Employee Dashboard
            </p>
          </div>
          <div className="hidden md:flex h-16 w-16 bg-emerald-800 dark:bg-emerald-900 rounded-2xl items-center justify-center border border-emerald-700 dark:border-emerald-800">
            <Briefcase className="w-8 h-8 text-emerald-400 dark:text-emerald-300" />
          </div>
        </div>

        <div className="bg-card rounded-3xl shadow-sm border border-border overflow-hidden">
          <div className="border-b border-border bg-muted/50 p-8">
            <h2 className="text-2xl font-bold text-foreground flex items-center gap-3">
              <PlaneTakeoff className="text-emerald-600 dark:text-emerald-400 w-6 h-6" />
              File New Travel Order
            </h2>
            <p className="text-muted-foreground mt-1">Submit your official itinerary and request for approval.</p>
          </div>

          <div className="p-8">
            <RequestForm employmentStatus={user.employmentStatus} />
          </div>
        </div>
      </div>
    </div>
  )
}