import { getCurrentUser } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { AuditLogTable } from '@/components/hr/audit-log-table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Suspense } from 'react'
import { Skeleton } from '@/components/ui/skeleton'

export const dynamic = 'force-dynamic'

export default async function AuditLogsPage() {
  const user = await getCurrentUser()
  if (!user || (user.role !== 'HR' && user.role !== 'ADMIN')) {
    redirect('/login')
  }

  // Fetch all audit logs with related data
  const logs = await prisma.auditLog.findMany({
    include: {
      user: {
        select: {
          firstName: true,
          lastName: true,
          email: true,
          role: true,
        },
      },
      travelOrder: {
        select: {
          travelOrderNumber: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
    take: 1000, // adjust as needed, consider pagination later
  })

  return (
    <div className="space-y-6 p-6 lg:p-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Audit Logs</h1>
        <p className="text-slate-500 mt-1">
          Track all user actions and system events.
        </p>
      </div>

      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle>System Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<TableSkeleton />}>
            <AuditLogTable logs={logs} />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  )
}

function TableSkeleton() {
  return (
    <div className="space-y-2">
      <Skeleton className="h-10 w-full" />
      {[...Array(10)].map((_, i) => (
        <Skeleton key={i} className="h-12 w-full" />
      ))}
    </div>
  )
}