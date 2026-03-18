import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'
import { TravelHistoryTable } from '@/components/employee/travel-history-table' // Adjust your import path

export default async function TravelHistoryPage() {
  const cookieStore = await cookies()
  const userId = cookieStore.get('auth_session')?.value

  if (!userId) return null;

  const travelOrders = await prisma.travelOrderRequest.findMany({
    where: { userId: userId },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="p-6">
      <TravelHistoryTable data={travelOrders} />
    </div>
  )
}