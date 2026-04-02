import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import OrdersTable from '@/components/hr/orders-table'

export default async function OrdersPage() {
  const cookieStore = await cookies()
  const role = cookieStore.get('user_role')?.value

  if (role !== 'HR' && role !== 'ADMIN') {
    redirect('/dashboard')
  }

  const travelOrders = await prisma.travelOrderRequest.findMany({
    include: {
      user: { select: { firstName: true, lastName: true, division: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">All Travel Orders</h1>
        <p className="text-muted-foreground">View, filter, and manage all travel requests.</p>
      </div>
      <OrdersTable initialOrders={travelOrders} />
    </div>
  )
}