import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { notFound, redirect } from 'next/navigation'
import TravelOrderDocument from '@/app/sample/page'
import ProposedItineraryDocument from '@/app/sample/itinerary/page'
import CertificationDocument from '@/app/sample/certification/page'

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

  const isPermanent = order.employmentStatus === 'PERMANENT'

  return (
    <div className="p-4 bg-white">
      <TravelOrderDocument data={order} />
      {!isPermanent && (
        <>
          <div className="page-break" />
          <ProposedItineraryDocument data={order} />
          <div className="page-break" />
          <CertificationDocument data={order} />
        </>
      )}
      <style>{`
        @media print {
          .page-break { page-break-before: always; }
        }
      `}</style>
    </div>
  )
}