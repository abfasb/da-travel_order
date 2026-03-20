import { cookies } from 'next/headers'
import { redirect, notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { SignatureForm } from '@/components/approver/signature-form'
import { OrderSummary } from '@/components/approver/order-summary'
import TravelOrderDocument from '@/app/sample/page'
import { ArrowLeft, CheckCircle, Circle, Clock, ChevronRight, FileText } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

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
    <div className="space-y-6 max-w-[1600px] mx-auto pb-10">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Button variant="ghost" asChild className="mb-2 -ml-4 text-muted-foreground hover:text-foreground">
            <Link href="/approvals">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Approvals
            </Link>
          </Button>
          <h1 className="text-2xl font-semibold tracking-tight">Review Travel Order</h1>
          <p className="text-sm text-muted-foreground">Review the document details before applying your signature.</p>
        </div>
        <Badge variant="secondary" className="w-fit text-sm px-3 py-1 bg-primary/10 text-primary border-primary/20">
          Acting as: {userRole.replace(/_/g, ' ')}
        </Badge>
      </div>

      {/* Approval Timeline */}
      <Card className="bg-muted/30 border-dashed">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-wrap items-center gap-2 sm:gap-4">
            {timeline.map((step, index) => (
              <div key={step.role} className="flex items-center gap-2 sm:gap-4">
                <div className={`flex items-center px-3 py-1.5 rounded-full border ${
                    step.status === 'APPROVED' ? 'bg-emerald-50 border-emerald-200' :
                    step.status === 'PENDING' && step.role === userRole ? 'bg-primary/10 border-primary/30 ring-2 ring-primary/20' :
                    step.status === 'REJECTED' ? 'bg-red-50 border-red-200' :
                    'bg-background border-muted'
                  }`}
                >
                  {step.status === 'APPROVED' && <CheckCircle className="h-4 w-4 text-emerald-600 mr-2" />}
                  {step.status === 'PENDING' && <Clock className="h-4 w-4 text-yellow-600 mr-2" />}
                  {step.status === 'REJECTED' && <Circle className="h-4 w-4 text-red-600 mr-2" />}
                  <span className={`text-xs sm:text-sm font-medium ${
                    step.status === 'APPROVED' ? 'text-emerald-700' :
                    step.status === 'REJECTED' ? 'text-red-700' :
                    'text-foreground'
                  }`}>
                    {step.label}
                  </span>
                </div>
                {index < timeline.length - 1 && (
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
        
        {/* Left Column: Document Preview (Wider) */}
        <div className="xl:col-span-2 space-y-6">
          <Card className="border-border/50 shadow-sm h-full">
            <CardHeader className="bg-muted/20 border-b pb-4">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-muted-foreground" />
                <CardTitle className="text-lg">Official Document Preview</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="bg-neutral-100 dark:bg-neutral-900 w-full overflow-x-auto p-4 sm:p-8 rounded-b-xl border-t-0 max-h-[800px] overflow-y-auto custom-scrollbar">
                <div className="min-w-[800px] max-w-4xl mx-auto bg-white dark:bg-background shadow-md ring-1 ring-border rounded-sm p-8">
                  <TravelOrderDocument data={travelOrder} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle>Travel Order Summary</CardTitle>
              <CardDescription>Key details extracted from the request</CardDescription>
            </CardHeader>
            <CardContent>
              <OrderSummary order={travelOrder} />
            </CardContent>
          </Card>

          <Card className="border-primary/20 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
            <CardHeader className="pb-4">
              <CardTitle>Your Signature</CardTitle>
              <CardDescription>Approve or reject this request</CardDescription>
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