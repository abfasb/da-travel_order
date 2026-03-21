// app/approvals/signature/[id]/page.tsx
import { cookies } from 'next/headers'
import { redirect, notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { SignatureModal } from '@/components/approver/signature-modal'
import { OrderSummary } from '@/components/approver/order-summary'
import TravelOrderDocument from '@/app/sample/page'
import {
  ArrowLeft,
  CheckCircle,
  Circle,
  Clock,
  ChevronRight,
  FileText,
  ShieldCheck,
  UserCheck,
  CalendarDays,
  MapPin,
  Briefcase,
  Download,
  Printer,
} from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'

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
      date: approval?.updatedAt ? new Date(approval.updatedAt).toLocaleDateString() : null,
    }
  })

  const getStatusConfig = (status: string, isCurrent: boolean) => {
    switch (status) {
      case 'APPROVED':
        return { color: 'emerald', icon: CheckCircle, bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' }
      case 'REJECTED':
        return { color: 'red', icon: Circle, bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' }
      case 'PENDING':
        return isCurrent
          ? { color: 'primary', icon: Clock, bg: 'bg-primary/10', text: 'text-primary', border: 'border-primary/30 ring-2 ring-primary/20' }
          : { color: 'slate', icon: Clock, bg: 'bg-muted', text: 'text-muted-foreground', border: 'border-muted' }
      default:
        return { color: 'slate', icon: Circle, bg: 'bg-muted', text: 'text-muted-foreground', border: 'border-muted' }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      <div className="container mx-auto py-8 px-4 md:px-6 max-w-7xl">
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Link href="/dashboard" className="hover:text-foreground transition-colors">
              Dashboard
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/approvers/approvals" className="hover:text-foreground transition-colors">
              Approvals
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground font-medium">Review Travel Order</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
                Review Travel Order
              </h1>
              <p className="text-muted-foreground mt-1">
                Carefully review the travel order details before applying your digital signature.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge
                variant="outline"
                className="gap-1 px-3 py-1.5 bg-background/50 backdrop-blur-sm border-primary/30 text-primary"
              >
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>Acting as: {userRole.replace(/_/g, ' ')}</span>
              </Badge>
              <Button variant="outline" size="sm" asChild className="gap-2">
                <Link href="/approvers/approvals">
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Approval Timeline */}
        <div className="mb-10">
          <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="relative">
                <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20 -translate-y-1/2 hidden md:block" />
                <div className="flex flex-col md:flex-row md:justify-between gap-6 md:gap-0 relative">
                  {timeline.map((step, idx) => {
                    const isCurrent = step.role === userRole
                    const config = getStatusConfig(step.status, isCurrent)
                    const Icon = config.icon

                    return (
                      <div
                        key={step.role}
                        className="flex flex-col items-center gap-2 flex-1 text-center"
                      >
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${config.border} ${config.bg} transition-all duration-200 ${
                            isCurrent ? 'scale-110 shadow-md' : ''
                          }`}
                        >
                          <Icon className={`h-5 w-5 ${config.text}`} />
                        </div>
                        <div>
                          <p className={`text-sm font-semibold ${config.text}`}>{step.label}</p>
                          {step.date && (
                            <p className="text-xs text-muted-foreground mt-0.5">{step.date}</p>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Document Preview */}
          <div className="xl:col-span-2 space-y-6">
            <Card className="border-0 shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-primary/5 to-primary/10 border-b">
                <div className="flex items-center justify-between p-5">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    <h2 className="text-lg font-semibold">Official Travel Order Document</h2>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" className="gap-1">
                      <Printer className="h-4 w-4" />
                      <span className="hidden sm:inline">Print</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="gap-1">
                      <Download className="h-4 w-4" />
                      <span className="hidden sm:inline">Download PDF</span>
                    </Button>
                  </div>
                </div>
              </div>
              <ScrollArea className="h-[calc(100vh-350px)] min-h-[600px] overflow-auto">
                <div className=" bg-slate-50 dark:bg-slate-950 overflow-x-auto">
                      <TravelOrderDocument data={travelOrder} />
                </div>
              </ScrollArea>
            </Card>
          </div>

          <div className="space-y-6">
            {/* Summary Card */}
            <Card className="border-0 shadow-lg overflow-hidden">
              <div className="bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 p-5 border-b">
                <div className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-primary" />
                  <h2 className="text-lg font-semibold">Travel Order Summary</h2>
                </div>
                <p className="text-sm text-muted-foreground mt-1">Key details of this request</p>
              </div>
              <CardContent className="p-5">
                <OrderSummary order={travelOrder} />
              </CardContent>
            </Card>

            {/* Quick Info */}
            <Card className="border-0 shadow-lg overflow-hidden">
              <div className="p-5 space-y-4">
                <div className="flex items-start gap-3">
                  <CalendarDays className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Travel Period</p>
                    <p className="text-sm text-muted-foreground">
            {/* @ts-ignore */}
                      {new Date(travelOrder.startDate).toLocaleDateString()} -{' '}
            {/* @ts-ignore */}
                      {new Date(travelOrder.endDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Destination</p>
            {/* @ts-ignore */}
                    <p className="text-sm text-muted-foreground">{travelOrder.destination}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <UserCheck className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Requested by</p>
                    <p className="text-sm text-muted-foreground">
            {/* @ts-ignore */}
                      {travelOrder.user?.name || travelOrder.user?.email}
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="border-0 shadow-lg overflow-hidden relative bg-gradient-to-br from-primary/5 to-primary/10">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-primary/60" />
              <CardHeader className="pb-3 pt-5">
                <CardTitle className="text-xl">Ready to Sign?</CardTitle>
                <CardDescription>
                  Click below to open the signature panel and approve this travel order.
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-6">
                <SignatureModal
                  orderId={travelOrder.id}
                  approvalId={currentApproval.id}
                  userRole={userRole}
                />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-6 border-t text-center text-xs text-muted-foreground">
          <p>This is an official government document. Your signature is legally binding.</p>
        </div>
      </div>
    </div>
  )
}