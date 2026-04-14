import { cookies } from 'next/headers'
import { redirect, notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import PrintView from '@/components/employee/print-view'

export default async function EmployeePrintPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const cookieStore = await cookies()
  const userId = cookieStore.get('auth_session')?.value
  const role = cookieStore.get('user_role')?.value

  if (!userId || role !== 'STAFF') redirect('/login')

  const order = await prisma.travelOrderRequest.findUnique({
    where: { id },
    include: {
      user: true,
      approvals: { include: { approver: true } },
      itineraryItems: true,
    },
  })

  if (!order || order.userId !== userId || order.status !== 'COMPLETED' || !order.travelOrderNumber) {
    notFound()
  }

  return <PrintView order={order} />
}