import { cookies } from 'next/headers'
import { redirect, notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { SignatureForm } from '@/components/approver/signature-form'
import { OrderSummary } from '@/components/approver/order-summary'
import TravelOrderDocument from '@/app/sample/page'
import { ArrowLeft, CheckCircle, Circle, Clock } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

export default async function SignaturePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const cookieStore = await cookies()
  const userId = cookieStore.get('auth_session')?.value
  const userRole = cookieStore.get('user_role')?.value

  if (!userId || !userRole || !['APCO', 'CHIEF_AGRICULTURIST', 'CHIEF_ADMINISTRATIVE', 'REGIONAL_EXECUTIVE'].includes(userRole)) {
    redirect('/login')
  }

  const travelOrder = await prisma.travelOrderRequest.findUnique({
    where: { id },
    include: {
      user: true,
      approvals: {
        orderBy: { createdAt: 'asc' },
      },
    },
  })

  if (!travelOrder) notFound()

  const currentApproval = travelOrder.approvals.find(a => a.approverRole === userRole)
  if (!currentApproval || currentApproval.status !== 'PENDING') {
    redirect('/approvals')
  }

  const sequence = ['APCO', 'CHIEF_AGRICULTURIST', 'CHIEF_ADMINISTRATIVE', 'REGIONAL_EXECUTIVE']
  const currentIndex = sequence.indexOf(userRole)
  for (let i = 0; i < currentIndex; i++) {
    const prevApproval = travelOrder.approvals.find(a => a.approverRole === sequence[i])
    if (!prevApproval || prevApproval.status !== 'APPROVED') {
      redirect('/approvals')
    }
  }

  // Build approval timeline data
  const timeline = sequence.map(role => {
    const approval = travelOrder.approvals.find(a => a.approverRole === role)
    return {
      role,
      status: approval?.status || 'PENDING',
      label: role.replace(/_/g, ' '),
    }
  })

  return (
    <div className="space-y-6">
      {/* Back button */}
      <Button variant="ghost" asChild className="mb-2">
        <Link href="/approvals">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Approvals
        </Link>
      </Button>

      {/* Approval Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Approval Workflow</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-4">
            {timeline.map((step, index) => (
              <div key={step.role} className="flex items-center gap-2">
                <div className="flex items-center">
                  {step.status === 'APPROVED' && (
                    <CheckCircle className="h-5 w-5 text-emerald-600" />
                  )}
                  {step.status === 'PENDING' && (
                    <Clock className="h-5 w-5 text-yellow-600" />
                  )}
                  {step.status === 'REJECTED' && (
                    <Circle className="h-5 w-5 text-red-600" />
                  )}
                  <span className="ml-2 text-sm font-medium">{step.label}</span>
                </div>
                {index < timeline.length - 1 && (
                  <Separator orientation="vertical" className="h-4 mx-2" />
                )}
              </div>
            ))}
            <Badge variant="outline" className="ml-auto">
              Current: {userRole.replace(/_/g, ' ')}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Travel Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <OrderSummary order={travelOrder} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Official Document Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg overflow-auto max-h-[500px] bg-white p-4">
                <TravelOrderDocument data={travelOrder} />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                This is the official travel order that will be generated after all approvals.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Your Signature</CardTitle>
            </CardHeader>
            <CardContent>
              <SignatureForm
                orderId={travelOrder.id}
                approvalId={currentApproval.id}
                userRole={userRole}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}