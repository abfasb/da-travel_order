import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'
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

  const pendingWhere: any = {
    status: { notIn: ['REJECTED', 'COMPLETED'] },
    approvals: { some: { approverRole: userRole, status: 'PENDING' } },
  }

  if (userRole === 'APCO') {
    pendingWhere.user = { division: 'field_ops' }
  } else if (userRole === 'CHIEF_AGRICULTURIST') {
    pendingWhere.user = { division: 'field_ops' }
  } else if (userRole === 'CHIEF_ADMINISTRATIVE') {
    pendingWhere.OR = [
      {
        user: { division: 'field_ops' },
        AND: [
          { approvals: { some: { approverRole: 'APCO', status: 'APPROVED' } } },
          { approvals: { some: { approverRole: 'CHIEF_AGRICULTURIST', status: 'APPROVED' } } }
        ]
      },
      {
        user: {
          OR: [
            { division: { not: 'field_ops' } },
            { division: null }
          ]
        }
      }
    ]
  } else if (userRole === 'REGIONAL_EXECUTIVE') {
    pendingWhere.AND = [
      { approvals: { some: { approverRole: 'CHIEF_ADMINISTRATIVE', status: 'APPROVED' } } }
    ]
  }

  const pendingOrders = await prisma.travelOrderRequest.findMany({
    where: pendingWhere,
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
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 relative">
      {/* Green ambient glow – dark mode only */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-emerald-500/10 dark:bg-emerald-400/8 rounded-full blur-3xl" />
        <div className="absolute bottom-20 -left-20 w-[500px] h-[500px] bg-green-600/5 dark:bg-green-500/6 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto py-8 px-4 md:px-6 max-w-7xl relative z-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
            Approval Dashboard
          </h1>
          <p className="text-muted-foreground mt-1 text-base">
            Welcome back, <span className="font-semibold">{roleDisplay[userRole]}</span>. Review and manage travel orders awaiting your signature.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <Card className="border-0 shadow-md bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 dark:shadow-emerald-900/5">
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
          <Card className="border-0 shadow-md bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 dark:shadow-emerald-900/5">
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
          <Card className="border-0 shadow-md bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 dark:shadow-emerald-900/5">
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
          <Card className="border-0 shadow-md bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 dark:shadow-emerald-900/5">
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