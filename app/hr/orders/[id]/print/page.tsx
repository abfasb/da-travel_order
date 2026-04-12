import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { notFound, redirect } from 'next/navigation'
import PrintView from '@/components/hr/print-view'

export default async function PrintOrderPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser()
  if (!user || user.role !== 'HR') redirect('/login')

  const { id } = await params
  const order = await prisma.travelOrderRequest.findUnique({
    where: { id },
    include: {
      user: true,
      approvals: { include: { approver: true } },
      itineraryItems: true,
    },
  })

  if (!order || !order.travelOrderNumber) notFound()

  return <PrintView order={order} />
}