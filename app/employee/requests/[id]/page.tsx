import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'
import { redirect, notFound } from 'next/navigation'
import TravelOrderDocument from '@/app/sample/page'
import ProposedItineraryDocument from '@/app/sample/itinerary/page'
import CertificationDocument from '@/app/sample/certification/page'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, FileText } from 'lucide-react'
import Link from 'next/link'
import PrintButton from '@/components/employee/PrintButton'

interface PageProps {
  params: Promise<{ id: string }>
}

// Helper for status colors
const getStatusColor = (status: string) => {
  switch (status) {
    case 'PENDING': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    case 'APPROVED': return 'bg-green-100 text-green-800 border-green-200'
    case 'REJECTED': return 'bg-red-100 text-red-800 border-red-200'
    default: return 'bg-slate-100 text-slate-800 border-slate-200'
  }
}

export default async function TravelOrderPage({ params }: PageProps) {
  const { id } = await params

  const cookieStore = await cookies()
  const userId = cookieStore.get('auth_session')?.value
  const role = cookieStore.get('user_role')?.value

  if (!userId || role !== 'STAFF') {
    redirect('/login')
  }

  const travelOrder = await prisma.travelOrderRequest.findUnique({
    where: { id },
    include: {
      user: true,
      itineraryItems: true,
      //@ts-ignore
      approvals: {
        include: {
          approver: true,
        },
        orderBy: {
          createdAt: 'asc',
        },
      },
    },
  })

  if (!travelOrder) {
    notFound()
  }

  if (travelOrder.userId !== userId) {
    redirect('/employee/history')
  }

  return (
    // Note: print:bg-white and print:block are crucial here to reset the layout for the printer
    <div className="min-h-screen bg-slate-50 print:bg-white print:block">
      
      {/* --- DASHBOARD HEADER (Hidden on Print) --- */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-20 print:hidden shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-6">
              <Button variant="outline" size="icon" className="rounded-full hover:bg-slate-100" asChild>
                <Link href="/employee/history">
                  <ArrowLeft className="h-5 w-5 text-slate-600" />
                </Link>
              </Button>
              
              <div className="flex flex-col">
                <div className="flex items-center gap-3">
                  <h1 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-2">
                    <FileText className="w-5 h-5 text-emerald-600" />
                    Travel Order Details
                  </h1>
                  <Badge variant="outline" className={`${getStatusColor(travelOrder.status)}`}>
                    {travelOrder.status}
                  </Badge>
                </div>
                <p className="text-sm font-medium text-slate-500 mt-1">
                  Reference: <span className="text-emerald-600 uppercase">
                    {/* @ts-ignore */}
                    {travelOrder.travelOrderNumber || 'PENDING ASSIGNMENT'}
                  </span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <PrintButton />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto py-12 px-4 flex flex-col gap-16 print:block print:max-w-none print:p-0 print:m-0">
        
        {/* PAGE 1: Travel Order */}
        <div className="bg-white shadow-2xl rounded-lg overflow-hidden border print:shadow-none print:border-none print:rounded-none print:break-after-page flex justify-center">
          <TravelOrderDocument data={travelOrder} />
        </div>

        {travelOrder.employmentStatus !== 'PERMANENT' && (
          <>
            <div className="bg-white shadow-2xl shadow-slate-200/50 rounded-lg overflow-hidden border border-slate-200/60 print:shadow-none print:border-none print:rounded-none print:break-after-page flex justify-center">
              <ProposedItineraryDocument data={travelOrder} />
            </div>

            <div className="bg-white shadow-2xl shadow-slate-200/50 rounded-lg overflow-hidden border border-slate-200/60 print:shadow-none print:border-none print:rounded-none print:break-after-page flex justify-center">
              <CertificationDocument data={travelOrder} />
            </div>
          </>
        )}

      </div>
    </div>
  )
}