import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import HistoryOrdersTable from '@/components/approver/history-orders-table'
import PendingOrdersTable from '@/components/approver/pending-orders-table'

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

  console.log(`User role: ${userRole}, pendingOrders count: ${pendingOrders.length}`)
  for (const order of pendingOrders) {
    console.log(`Order ${order.id}: approvals:`, order.approvals)
  }

const apcoApprovals = await prisma.approval.count({
  where: { approverRole: 'APCO' }
})
console.log(`Total APCO approval records in DB: ${apcoApprovals}`)

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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Approvals</h1>
        <p className="text-muted-foreground">Manage travel orders awaiting your signature.</p>
      </div>

      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pending">Pending ({pendingOrders.length})</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
          <PendingOrdersTable orders={pendingOrders} userRole={userRole} />
        </TabsContent>

        <TabsContent value="history">
          <HistoryOrdersTable orders={historyOrders} userRole={userRole} />
        </TabsContent>
      </Tabs>
    </div>
  )
}