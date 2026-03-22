import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Activity, Clock, CheckCircle, XCircle } from 'lucide-react'
import PendingOrdersTable from '@/components/approver/pending-orders-table'
import HistoryOrdersTable from '@/components/approver/history-orders-table'

export default async function ApprovalsPage() {
  const cookieStore = await cookies()
  const userId = cookieStore.get('auth_session')?.value
  const userRole = cookieStore.get('user_role')?.value

  if (!userId || !userRole || !['APCO', 'CHIEF_AGRICULTURIST', 'CHIEF_ADMINISTRATIVE', 'REGIONAL_EXECUTIVE'].includes(userRole)) {
    redirect('/login')
  }

  const sequence = ['APCO', 'CHIEF_AGRICULTURIST', 'CHIEF_ADMINISTRATIVE', 'REGIONAL_EXECUTIVE']
  const currentIndex = sequence.indexOf(userRole)

  const pendingConditions: any[] = [
    { status: { notIn: ['REJECTED', 'COMPLETED'] } },
    { approvals: { some: { approverRole: userRole, status: 'PENDING' } } },
  ]

  for (let i = 0; i < currentIndex; i++) {
    pendingConditions.push({
      approvals: { some: { approverRole: sequence[i], status: 'APPROVED' } },
    })
  }

  const pendingOrders = await prisma.travelOrderRequest.findMany({
    where: { AND: pendingConditions },
    include: {
      user: { select: { firstName: true, lastName: true, division: true } },
      approvals: true,
    },
    orderBy: { createdAt: 'desc' },
  })

  const historyOrders = await prisma.travelOrderRequest.findMany({
    where: {
      approvals: {
        some: {
          approverRole: userRole as any,
          status: { in: ['APPROVED', 'REJECTED'] },
        },
      },
    },
    include: {
      user: { select: { firstName: true, lastName: true, division: true } },
      approvals: {
        where: { approverRole: userRole as any },
      },
    },
    orderBy: { updatedAt: 'desc' },
    take: 20,
  })

  const pendingCount = pendingOrders.length
  const approvedCount = historyOrders.filter(o => o.approvals[0]?.status === 'APPROVED').length
  const rejectedCount = historyOrders.filter(o => o.approvals[0]?.status === 'REJECTED').length

  const roleDisplay: Record<string, string> = {
    APCO: 'APCO',
    CHIEF_AGRICULTURIST: 'Chief Agriculturist',
    CHIEF_ADMINISTRATIVE: 'Chief Administrative Officer',
    REGIONAL_EXECUTIVE: 'Regional Executive Director',
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      <div className="container mx-auto py-8 px-4 md:px-6 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
            Approval Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Welcome back, {roleDisplay[userRole]}. Review and manage travel orders awaiting your signature.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <Card className="border-0 shadow-md bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pending Approvals</p>
                  <p className="text-3xl font-bold">{pendingCount}</p>
                </div>
                <Clock className="h-12 w-12 text-yellow-500/80" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-md bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Approved</p>
                  <p className="text-3xl font-bold">{approvedCount}</p>
                </div>
                <CheckCircle className="h-12 w-12 text-emerald-500/80" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-md bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Rejected</p>
                  <p className="text-3xl font-bold">{rejectedCount}</p>
                </div>
                <XCircle className="h-12 w-12 text-red-500/80" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-md bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Processed</p>
                  <p className="text-3xl font-bold">{historyOrders.length}</p>
                </div>
                <Activity className="h-12 w-12 text-blue-500/80" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="pending" className="space-y-6">
          <div className="bg-background/50 backdrop-blur-sm rounded-lg p-1">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="pending" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                Pending ({pendingCount})
              </TabsTrigger>
              <TabsTrigger value="history" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                History ({historyOrders.length})
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="pending">
            <PendingOrdersTable orders={pendingOrders} userRole={userRole} />
          </TabsContent>
          <TabsContent value="history">
            <HistoryOrdersTable orders={historyOrders} userRole={userRole} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}