import { cookies } from 'next/headers'
import { redirect, notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { SignatureModal } from '@/components/approver/signature-modal'
import { OrderSummary } from '@/components/approver/order-summary'
import TravelOrderDocument from '@/app/sample/page'
import ProposedItineraryDocument from '@/app/sample/itinerary/page'
import CertificationDocument from '@/app/sample/certification/page'
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
  PenTool,
  Lightbulb,
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
      itineraryItems: true,
      approvals: {
        orderBy: { createdAt: 'asc' },
        include: { approver: true },
      },
    },
  })

  if (!travelOrder) notFound()

  const currentApproval = travelOrder.approvals.find(a => a.approverRole === userRole)
  if (!currentApproval || currentApproval.status !== 'PENDING') {
    redirect('/approvals')
  }

  const isFieldOps = travelOrder.user?.division === 'field_ops'

  if (userRole === 'APCO' || userRole === 'CHIEF_AGRICULTURIST') {
    if (!isFieldOps) redirect('/approvals')
  }

  if (userRole === 'CHIEF_ADMINISTRATIVE') {
    if (isFieldOps) {
      const apco = travelOrder.approvals.find(a => a.approverRole === 'APCO')
      const agri = travelOrder.approvals.find(a => a.approverRole === 'CHIEF_AGRICULTURIST')
      if (apco?.status !== 'APPROVED' || agri?.status !== 'APPROVED') {
        redirect('/approvals')
      }
    }
  }

  if (userRole === 'REGIONAL_EXECUTIVE') {
    const admin = travelOrder.approvals.find(a => a.approverRole === 'CHIEF_ADMINISTRATIVE')
    if (admin?.status !== 'APPROVED') {
      redirect('/approvals')
    }
  }
  
  const sequence = isFieldOps
    ? ['APCO', 'CHIEF_AGRICULTURIST', 'CHIEF_ADMINISTRATIVE', 'REGIONAL_EXECUTIVE']
    : ['CHIEF_ADMINISTRATIVE', 'REGIONAL_EXECUTIVE']

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

  const getSignatureGuide = (role: string, isPermanent: boolean) => {
    if (role === 'APCO' || role === 'CHIEF_AGRICULTURIST') {
      return (
        <p>Your digital signature will only be applied to the <strong>Main Travel Order (Page 1)</strong>. The supplementary documents are designated for the Chief Admin and Regional Executive Director.</p>
      )
    }
    if (role === 'CHIEF_ADMINISTRATIVE') {
      return isPermanent ? (
        <p>Your digital signature will be applied to the <strong>Main Travel Order (Page 1)</strong>.</p>
      ) : (
        <p>Your digital signature will be applied to the <strong>Main Travel Order (Page 1)</strong> and the <strong>Proposed Itinerary (Page 2)</strong>.</p>
      )
    }
    if (role === 'REGIONAL_EXECUTIVE') {
      return isPermanent ? (
        <p>Your digital signature will be applied to the <strong>Main Travel Order (Page 1)</strong> for final approval.</p>
      ) : (
        <p>Your digital signature will be applied to the <strong>Main Travel Order (Page 1)</strong> and the <strong>Certification (Page 3)</strong> for final approval.</p>
      )
    }
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      <div className="container mx-auto py-8 px-4 md:px-6 max-w-7xl">
        
        {/* Header Section */}
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
              <p className="text-muted-foreground mt-1 text-base">
                Carefully review the travel order details before applying your digital signature.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge
                variant="outline"
                className="gap-1.5 px-3 py-1.5 bg-background/50 backdrop-blur-sm border-primary/30 text-primary shadow-sm"
              >
                <ShieldCheck className="h-4 w-4" />
                <span className="font-semibold tracking-wide">ACTING AS: {userRole.replace(/_/g, ' ')}</span>
              </Badge>
              <Button variant="outline" size="sm" asChild className="gap-2 shadow-sm">
                <Link href="/approvers/approvals">
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Timeline Section */}
        <div className="mb-10">
          <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm overflow-hidden">
            <div className="bg-slate-50/50 border-b p-3 px-6 flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Approval Workflow</span>
            </div>
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
                            isCurrent ? 'scale-110 shadow-md ring-4 ring-primary/10' : ''
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
          
          <div className="xl:col-span-2 space-y-6">
            <Card className="border-0 shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white">
                <div className="flex items-center justify-between p-5">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/10 rounded-lg">
                      <FileText className="h-5 w-5 text-emerald-400" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold tracking-wide">Official Documents</h2>
                      <p className="text-xs text-slate-300">Scroll to review all attached pages</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="secondary" size="sm" className="gap-2 bg-white/10 hover:bg-white/20 text-white border-0">
                      <Printer className="h-4 w-4" />
                      <span className="hidden sm:inline">Print</span>
                    </Button>
                    <Button variant="secondary" size="sm" className="gap-2 bg-white/10 hover:bg-white/20 text-white border-0">
                      <Download className="h-4 w-4" />
                      <span className="hidden sm:inline">Download PDF</span>
                    </Button>
                  </div>
                </div>
              </div>
              <ScrollArea className="h-[calc(100vh-350px)] min-h-[1200px] overflow-auto">
                <div className="bg-slate-100 dark:bg-slate-900/50 p-6 md:p-2 flex flex-col items-center gap-10 min-w-max">
                  
                  <div className="shadow-2xl bg-white rounded-md overflow-hidden border border-slate-200">
                    <TravelOrderDocument data={travelOrder} />
                  </div>

                  {travelOrder.employmentStatus !== 'PERMANENT' && (
                    <>
                      <div className="shadow-2xl bg-white rounded-md overflow-hidden border border-slate-200">
                        <ProposedItineraryDocument data={travelOrder} />
                      </div>

                      <div className="shadow-2xl bg-white rounded-md overflow-hidden border border-slate-200">
                        <CertificationDocument data={travelOrder} />
                      </div>
                    </>
                  )}

                </div>
              </ScrollArea>
            </Card>
          </div>

          <div className="space-y-6">
            
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                <Lightbulb className="w-24 h-24 text-emerald-600" />
              </div>
              <div className="flex items-start gap-3 relative z-10">
                <div className="p-2 bg-emerald-100 text-emerald-700 rounded-full mt-0.5">
                  <PenTool className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-emerald-900 mb-1 tracking-wide">SIGNATURE GUIDE</h3>
                  <div className="text-sm text-emerald-800 leading-relaxed">
                    {getSignatureGuide(userRole, travelOrder.employmentStatus === 'PERMANENT')}
                  </div>
                </div>
              </div>
            </div>

            <Card className="border-0 shadow-lg overflow-hidden">
              <div className="bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 p-5 border-b">
                <div className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-slate-600" />
                  <h2 className="text-lg font-bold text-slate-800">Travel Order Summary</h2>
                </div>
              </div>
              <CardContent className="p-0">
                <OrderSummary order={travelOrder} />
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg overflow-hidden">
              <div className="p-5 space-y-5">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-slate-100 rounded-lg">
                    <CalendarDays className="h-4 w-4 text-slate-600" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-0.5">Travel Period</p>
                    <p className="text-sm font-medium text-slate-900">
                      {new Date(travelOrder.departureDate).toLocaleDateString()} -{' '}
                      {new Date(travelOrder.returnDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-slate-100 rounded-lg">
                    <MapPin className="h-4 w-4 text-slate-600" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-0.5">Destination</p>
                    <p className="text-sm font-medium text-slate-900">
                      {travelOrder.specificLocation}, {travelOrder.destinationProvince}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-slate-100 rounded-lg">
                    <UserCheck className="h-4 w-4 text-slate-600" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-0.5">Requested By</p>
                    <p className="text-sm font-medium text-slate-900">
                      {travelOrder.requestorName || travelOrder.user?.email}
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="border-0 shadow-xl overflow-hidden relative bg-white ring-1 ring-slate-200">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-emerald-500" />
              <CardHeader className="pb-3 pt-6 text-center">
                <CardTitle className="text-2xl font-black text-slate-800">Ready to Sign?</CardTitle>
                <CardDescription className="text-sm mt-2">
                  Click below to securely authenticate and apply your digital signature.
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-8 pt-2">
                <SignatureModal
                  orderId={travelOrder.id}
                  approvalId={currentApproval.id}
                  userRole={userRole}
                />
              </CardContent>
            </Card>

          </div>
        </div>

        <div className="mt-16 pt-8 border-t text-center">
          <p className="text-sm text-slate-500 font-medium">Department of Agriculture • Region IV-B (MIMAROPA)</p>
          <p className="text-xs text-slate-400 mt-1">This is an official government document. Your signature is legally binding.</p>
        </div>
      </div>
    </div>
  )
}