import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'
import { redirect, notFound } from 'next/navigation'
import { Button } from '@/components/ui/button'
import TravelOrderDocument from '@/app/sample/page'
import { ArrowLeft, Printer } from 'lucide-react'
import Link from 'next/link'

export default async function HRPrintPage({ params }: { params: { id: string } }) {
  const cookieStore = await cookies()
  const role = cookieStore.get('user_role')?.value
  if (!role || role !== 'HR') redirect('/login')

  const travelOrder = await prisma.travelOrderRequest.findUnique({
    where: { id: params.id },
    include: { user: true, approvals: { include: { approver: true } } },
  })


  if (!travelOrder) notFound()

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between bg-white p-4 border-b rounded-t-xl mb-4 print:hidden shadow-sm">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/hr/orders">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h2 className="font-bold text-lg">Travel Order</h2>
            <p className="text-xs text-muted-foreground text-emerald-600 font-medium">
              {travelOrder.travelOrderNumber || 'No number'}
            </p>
          </div>
        </div>
        <Button onClick={() => window.print()} className="bg-emerald-600 hover:bg-emerald-700 text-white">
          <Printer className="w-4 h-4 mr-2" />
          Print Document
        </Button>
      </div>
      <div className="flex-1 overflow-auto rounded-xl">
        <TravelOrderDocument data={travelOrder} />
      </div>
    </div>
  )
}