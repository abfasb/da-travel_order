
import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'
import { redirect, notFound } from 'next/navigation'
import TravelOrderDocument from '@/app/sample/page'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Printer } from 'lucide-react'
import Link from 'next/link'
import PrintButton from '@/components/employee/PrintButton'

interface PageProps {
  params: Promise<{ id: string }>
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
    <div className="flex flex-col h-full">
      {/* Header with back button and print - visible only on screen */}
      <div className="flex items-center justify-between bg-white p-4 border-b rounded-t-xl mb-4 print:hidden shadow-sm">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/employee/history">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h2 className="font-bold text-lg">Travel Order</h2>
            <p className="text-xs text-muted-foreground text-emerald-600 font-medium">
             {/* @ts-ignore */}
              {travelOrder.travelOrderNumber || 'Pending Assignment'}
            </p>
          </div>
        </div>

        <PrintButton />
      </div>

      {/* Document */}
      <div className="flex-1 overflow-auto rounded-xl">
        <TravelOrderDocument data={travelOrder} />
      </div>
    </div>
  )
}