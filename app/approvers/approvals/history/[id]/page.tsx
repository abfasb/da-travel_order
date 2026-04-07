import { cookies } from 'next/headers'
import { redirect, notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
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
  XCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import TravelOrderDocument from '@/app/sample/page'
import ProposedItineraryDocument from '@/app/sample/itinerary/page'
import CertificationDocument from '@/app/sample/certification/page'

export default async function HistoryViewPage({ params }: { params: Promise<{ id: string }> }) {
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

  // Find the current user's approval (they must have already acted on it)
  const myApproval = travelOrder.approvals.find(a => a.approverRole === userRole)
  if (!myApproval || (myApproval.status !== 'APPROVED' && myApproval.status !== 'REJECTED')) {
    // If not processed, redirect to the live signing page
    redirect(`/approvers/approvals/${id}`)
  }

  const isFieldOps = travelOrder.user?.division === 'field_ops'
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

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return { color: 'emerald', icon: CheckCircle, bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' }
      case 'REJECTED':
        return { color: 'red', icon: XCircle, bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' }
      default:
        return { color: 'slate', icon: Clock, bg: 'bg-muted', text: 'text-muted-foreground', border: 'border-muted' }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      <div className="container mx-auto py-4 sm:py-8 px-3 sm:px-4 md:px-6 max-w-7xl">
        
        {/* Header Section */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-muted-foreground mb-4">
            <Link href="/dashboard" className="hover:text-foreground transition-colors">
              Dashboard
            </Link>
            <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
            <Link href="/approvers/approvals" className="hover:text-foreground transition-colors">
              Approvals
            </Link>
            <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="text-foreground font-medium">History – Travel Order</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
                Travel Order (Read‑only)
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                You {myApproval.status === 'APPROVED' ? 'approved' : 'rejected'} this request on{' '}
                {new Date(myApproval.updatedAt).toLocaleDateString()}.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge
                variant="outline"
                className="gap-1.5 px-2 py-1 sm:px-3 sm:py-1.5 bg-background/50 backdrop-blur-sm border-primary/30 text-primary shadow-sm text-xs sm:text-sm"
              >
                <ShieldCheck className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="font-semibold tracking-wide">VIEW ONLY</span>
              </Badge>
              <Button variant="outline" size="sm" asChild className="gap-2 shadow-sm text-xs sm:text-sm">
                <Link href="/approvers/approvals">
                  <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4" />
                  Back
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Your Decision Card */}
        <div className="mb-6 sm:mb-10">
          <Card className={`border-0 shadow-lg overflow-hidden ${myApproval.status === 'APPROVED' ? 'bg-emerald-50/30' : 'bg-red-50/30'}`}>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className={`p-2 sm:p-3 rounded-full ${myApproval.status === 'APPROVED' ? 'bg-emerald-100' : 'bg-red-100'}`}>
                  {myApproval.status === 'APPROVED' ? (
                    <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-600" />
                  ) : (
                    <XCircle className="h-5 w-5 sm:h-6 sm:w-6 text-red-600" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-base sm:text-lg font-bold mb-1">
                    Your Decision: {myApproval.status}
                  </h3>
                  {myApproval.comment && (
                    <p className="text-xs sm:text-sm text-muted-foreground mb-2">
                      <span className="font-medium">Comment:</span> {myApproval.comment}
                    </p>
                  )}
                  {myApproval.signatureData && (
                    <div className="mt-2">
                      <p className="text-xs font-medium text-muted-foreground mb-1">Your Digital Signature:</p>
                      <img src={myApproval.signatureData} alt="Signature" className="h-10 sm:h-12 object-contain border rounded bg-white p-1" />
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mb-6 sm:mb-10">
          <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm overflow-hidden">
            <div className="bg-slate-50/50 border-b p-2 sm:p-3 px-4 sm:px-6 flex items-center gap-2">
              <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground" />
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Approval Workflow</span>
            </div>
            <CardContent className="p-4 sm:p-6">
              <div className="overflow-x-auto">
                <div className="relative min-w-[500px] sm:min-w-0">
                  <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20 -translate-y-1/2 hidden sm:block" />
                  <div className="flex flex-row sm:flex-row justify-between gap-4 sm:gap-6 relative">
                    {timeline.map((step) => {
                      const config = getStatusConfig(step.status)
                      const Icon = config.icon
                      return (
                        <div key={step.role} className="flex flex-col items-center gap-2 flex-1 text-center">
                          <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center border-2 ${config.border} ${config.bg}`}>
                            <Icon className={`h-4 w-4 sm:h-5 sm:w-5 ${config.text}`} />
                          </div>
                          <div>
                            <p className={`text-xs sm:text-sm font-semibold ${config.text}`}>{step.label}</p>
                            {step.date && <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">{step.date}</p>}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 sm:gap-8">
          <div className="xl:col-span-2 space-y-6">
            <Card className="border-0 shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white">
                <div className="flex flex-wrap items-center justify-between p-3 sm:p-5 gap-2">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="p-1.5 sm:p-2 bg-white/10 rounded-lg">
                      <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-400" />
                    </div>
                    <div>
                      <h2 className="text-sm sm:text-lg font-semibold tracking-wide">Official Documents</h2>
                      <p className="text-[10px] sm:text-xs text-slate-300">Scroll to review all attached pages</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="secondary" size="sm" className="gap-1 sm:gap-2 bg-white/10 hover:bg-white/20 text-white border-0 text-xs sm:text-sm">
                      <Printer className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="hidden sm:inline">Print</span>
                    </Button>
                    <Button variant="secondary" size="sm" className="gap-1 sm:gap-2 bg-white/10 hover:bg-white/20 text-white border-0 text-xs sm:text-sm">
                      <Download className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="hidden sm:inline">Download PDF</span>
                    </Button>
                  </div>
                </div>
              </div>
              <ScrollArea className="h-[calc(100vh-350px)] min-h-[600px] overflow-auto">
                <div className="bg-slate-100 dark:bg-slate-900/50 p-3 sm:p-6 flex flex-col items-center gap-6 sm:gap-10">
                  <div className=" mr-48 overflow-x-auto flex justify-center">
                    <div className="origin-top scale-[0.85] sm:scale-100 transition-transform">
                      <div className="shadow-2xl bg-white rounded-md overflow-hidden border border-slate-200">
                        <TravelOrderDocument data={travelOrder} />
                      </div>
                    </div>
                  </div>
                  {travelOrder.employmentStatus !== 'PERMANENT' && (
                    <>
                      <div className="w-full mr-32 overflow-x-auto flex justify-center">
                        <div className="origin-top scale-[0.85] sm:scale-100 transition-transform">
                            <ProposedItineraryDocument data={travelOrder} />
                        </div>
                      </div>
                      <div className="w-full mr-32 overflow-x-auto flex justify-center">
                        <div className="origin-top scale-[0.85] sm:scale-100 transition-transform">
                            <CertificationDocument data={travelOrder} />
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </ScrollArea>
            </Card>
          </div>

          {/* Summary Card (read‑only, no signature modal) */}
          <div className="space-y-6">
            <Card className="border-0 shadow-lg overflow-hidden">
              <div className="bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 p-4 sm:p-5 border-b">
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4 sm:h-5 sm:w-5 text-slate-600" />
                  <h2 className="text-base sm:text-lg font-bold text-slate-800">Travel Order Summary</h2>
                </div>
              </div>
              <CardContent className="p-0">
                <div className="p-4 sm:p-5 space-y-4 sm:space-y-5">
                  <div className="flex items-start gap-2 sm:gap-3">
                    <div className="p-1.5 sm:p-2 bg-slate-100 rounded-lg">
                      <CalendarDays className="h-3 w-3 sm:h-4 sm:w-4 text-slate-600" />
                    </div>
                    <div>
                      <p className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider mb-0.5">Travel Period</p>
                      <p className="text-xs sm:text-sm font-medium text-slate-900">
                        {new Date(travelOrder.departureDate).toLocaleDateString()} -{' '}
                        {new Date(travelOrder.returnDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 sm:gap-3">
                    <div className="p-1.5 sm:p-2 bg-slate-100 rounded-lg">
                      <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-slate-600" />
                    </div>
                    <div>
                      <p className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider mb-0.5">Destination</p>
                      <p className="text-xs sm:text-sm font-medium text-slate-900">
                        {travelOrder.specificLocation}, {travelOrder.destinationProvince}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 sm:gap-3">
                    <div className="p-1.5 sm:p-2 bg-slate-100 rounded-lg">
                      <UserCheck className="h-3 w-3 sm:h-4 sm:w-4 text-slate-600" />
                    </div>
                    <div>
                      <p className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider mb-0.5">Requested By</p>
                      <p className="text-xs sm:text-sm font-medium text-slate-900">
                        {travelOrder.requestorName || travelOrder.user?.email}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        <div className="mt-12 sm:mt-16 pt-6 sm:pt-8 border-t text-center">
          <p className="text-xs sm:text-sm text-slate-500 font-medium">Department of Agriculture • Region IV-B (MIMAROPA)</p>
          <p className="text-[10px] sm:text-xs text-slate-400 mt-1">This is an official government document. Your signature is legally binding.</p>
        </div>
      </div>
    </div>
  )
}