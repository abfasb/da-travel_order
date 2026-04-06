// app/employee/travel-orders/[id]/page.tsx
import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'
import { redirect, notFound } from 'next/navigation'
import TravelOrderDocument from '@/app/sample/page'
import ProposedItineraryDocument from '@/app/sample/itinerary/page'
import CertificationDocument from '@/app/sample/certification/page'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { 
  ArrowLeft, FileText, CheckCircle, XCircle, Clock, UserCheck, MapPin, CalendarDays,
  Briefcase, DollarSign, Truck, Target, Globe, Award, Bell, Send, Printer, Hash,
  User, Building, Calendar, Map, Fuel, CreditCard, Users, FileCheck, Hourglass
} from 'lucide-react'
import Link from 'next/link'
import PrintButton from '@/components/employee/PrintButton'
import { FloatingPrintButton } from '@/components/employee/floatingprintbutton'

interface PageProps {
  params: Promise<{ id: string }>
}

// ========== Helper Functions ==========
const getStatusConfig = (status: string) => {
  const configs: Record<string, { color: string, bg: string, border: string, icon: any, label: string }> = {
    'PENDING': { color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200', icon: Hourglass, label: 'Pending Review' },
    'REVIEWING': { color: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200', icon: Clock, label: 'Under Review' },
    'APPROVED': { color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200', icon: CheckCircle, label: 'Approved' },
    'REJECTED': { color: 'text-rose-700', bg: 'bg-rose-50', border: 'border-rose-200', icon: XCircle, label: 'Rejected' },
    'HR_PROCESSING': { color: 'text-purple-700', bg: 'bg-purple-50', border: 'border-purple-200', icon: FileCheck, label: 'HR Processing' },
    'COMPLETED': { color: 'text-slate-700', bg: 'bg-slate-100', border: 'border-slate-300', icon: CheckCircle, label: 'Completed' },
  }
  return configs[status] || configs['PENDING']
}

const getApprovalStatusIcon = (status: string) => {
  switch(status) {
    case 'APPROVED': return <CheckCircle className="w-5 h-5" />
    case 'REJECTED': return <XCircle className="w-5 h-5" />
    default: return <Clock className="w-5 h-5" />
  }
}

const getApprovalStepClass = (status: string) => {
  if (status === 'APPROVED') return 'bg-emerald-100 border-emerald-500 text-emerald-600'
  if (status === 'REJECTED') return 'bg-rose-100 border-rose-500 text-rose-600'
  return 'bg-white border-slate-300 text-slate-400'
}

const roleTitles: Record<string, string> = {
  'APCO': 'Agricultural Program Coordinating Office',
  'CHIEF_AGRICULTURIST': 'Chief Agriculturist – Regulatory Division',
  'CHIEF_ADMINISTRATIVE': 'Chief Administrative Officer',
  'REGIONAL_EXECUTIVE': 'Regional Executive Director',
}

const ApprovalStep = ({ 
  role, 
  title, 
  status, 
  approver, 
  placeSigned, 
  signedAt, 
  signatureData, 
  comment,
  isLast 
}: { 
  role: string, 
  title: string, 
  status: string, 
  approver?: any, 
  placeSigned?: string, 
  signedAt?: Date, 
  signatureData?: string, 
  comment?: string,
  isLast?: boolean 
}) => {
  const isApproved = status === 'APPROVED'
  const isRejected = status === 'REJECTED'
  const isPending = status === 'PENDING'

  return (
    <div className="relative flex gap-4 group">
      {/* Left column: icon + vertical line */}
      <div className="flex flex-col items-center">
        <div className={`
          w-11 h-11 rounded-full flex items-center justify-center border-2 transition-all duration-300 shadow-sm
          ${getApprovalStepClass(status)}
        `}>
          {getApprovalStatusIcon(status)}
        </div>
        {!isLast && <div className="w-0.5 flex-1 bg-gradient-to-b from-slate-300 to-slate-100 mt-2" />}
      </div>

      {/* Right column: content */}
      <div className={`flex-1 mb-7 rounded-xl border p-5 transition-all duration-200 hover:shadow-md ${
        isPending ? 'bg-white' : isApproved ? 'bg-emerald-50/40' : 'bg-rose-50/40'
      }`}>
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <h3 className="font-semibold text-slate-800 text-lg">{role.replace(/_/g, ' ')}</h3>
            <p className="text-sm text-slate-500 mt-0.5">{title}</p>
          </div>
          <Badge variant="outline" className={`
            px-3 py-1 text-xs font-medium
            ${isApproved ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 
              isRejected ? 'bg-rose-100 text-rose-700 border-rose-200' : 
              'bg-amber-100 text-amber-700 border-amber-200'}
          `}>
            {status}
          </Badge>
        </div>

        {isApproved && approver && (
          <div className="mt-5 pt-4 border-t border-slate-200 space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <UserCheck className="w-4 h-4 text-emerald-600" />
              <span className="font-medium text-slate-700">{approver.firstName} {approver.lastName}</span>
              <span className="text-xs text-slate-400">({approver.email})</span>
            </div>
            {placeSigned && (
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="w-4 h-4 text-emerald-600" />
                <span className="text-slate-600">{placeSigned}</span>
              </div>
            )}
            {signedAt && (
              <div className="flex items-center gap-3 text-sm">
                <CalendarDays className="w-4 h-4 text-emerald-600" />
                <span className="text-slate-600">{new Date(signedAt).toLocaleString()}</span>
              </div>
            )}
            {signatureData && (
              <div className="mt-3 pt-2">
                <p className="text-xs text-slate-500 mb-1 font-medium">Digital Signature</p>
                <img src={signatureData} alt="Signature" className="h-12 object-contain border rounded-lg bg-white p-1.5 shadow-sm" />
              </div>
            )}
          </div>
        )}

        {isPending && (
          <div className="mt-5 pt-4 border-t border-slate-200">
            <p className="text-sm text-amber-600 flex items-center gap-2">
              <Bell className="w-4 h-4" />
              Awaiting approval from this officer
            </p>
          </div>
        )}

        {isRejected && comment && (
          <div className="mt-5 pt-4 border-t border-rose-200">
            <p className="text-sm text-rose-700">
              <span className="font-semibold">Rejection reason:</span> {comment}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

const HRProcessingStep = ({ status, travelOrderNumber }: { status: string, travelOrderNumber?: string | null }) => {
  const isCompleted = status === 'COMPLETED'
  const isProcessing = status === 'HR_PROCESSING'
  const isWaiting = status === 'APPROVED' 
  
  let displayStatus = status
  let bgColor = 'bg-purple-50/40'
  let borderColor = 'border-purple-200'
  let iconBg = 'bg-purple-100 border-purple-500 text-purple-600'
  let badgeClass = 'bg-purple-100 text-purple-700 border-purple-200'
  
  if (isCompleted) {
    bgColor = 'bg-emerald-50/40'
    borderColor = 'border-emerald-200'
    iconBg = 'bg-emerald-100 border-emerald-500 text-emerald-600'
    badgeClass = 'bg-emerald-100 text-emerald-700 border-emerald-200'
  } else if (isWaiting) {
    bgColor = 'bg-slate-50'
    borderColor = 'border-slate-200'
    iconBg = 'bg-slate-100 border-slate-400 text-slate-500'
    badgeClass = 'bg-slate-100 text-slate-600 border-slate-200'
    displayStatus = 'PENDING'
  }
  
  return (
    <div className="relative flex gap-4 group">
      <div className="flex flex-col items-center">
        <div className={`w-11 h-11 rounded-full flex items-center justify-center border-2 transition-all duration-300 shadow-sm ${iconBg}`}>
          {isCompleted ? <CheckCircle className="w-5 h-5" /> : <FileCheck className="w-5 h-5" />}
        </div>
      </div>
      <div className={`flex-1 rounded-xl border p-5 transition-all duration-200 hover:shadow-md ${bgColor} ${borderColor}`}>
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <h3 className="font-semibold text-slate-800 text-lg">Human Resources Office</h3>
            <p className="text-sm text-slate-500 mt-0.5">Travel Order Number Assignment & Document Finalization</p>
          </div>
          <Badge variant="outline" className={`px-3 py-1 text-xs font-medium ${badgeClass}`}>
            {displayStatus === 'COMPLETED' ? 'COMPLETED' : displayStatus === 'HR_PROCESSING' ? 'HR PROCESSING' : 'PENDING'}
          </Badge>
        </div>
        
        {isCompleted && travelOrderNumber && (
          <div className="mt-5 pt-4 border-t border-emerald-200">
            <div className="flex items-center gap-3">
              <Hash className="w-5 h-5 text-emerald-600" />
              <div>
                <p className="text-xs text-slate-500">Travel Order Number</p>
                <p className="font-mono font-bold text-emerald-700 text-lg">{travelOrderNumber}</p>
              </div>
            </div>
            <p className="text-sm text-emerald-700 mt-3 flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Travel order has been finalized. You may now print the official document.
            </p>
          </div>
        )}
        
        {isProcessing && (
          <div className="mt-5 pt-4 border-t border-purple-200">
            <div className="flex items-center gap-3">
              <Hourglass className="w-5 h-5 text-purple-600" />
              <p className="text-sm text-purple-700">
                All approvals received. HR officer will assign a travel order number and finalize the document shortly.
              </p>
            </div>
          </div>
        )}
        
        {isWaiting && (
          <div className="mt-5 pt-4 border-t border-slate-200">
            <p className="text-sm text-slate-500 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Waiting for all officials to approve before HR processing begins.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

// ========== Main Page Component ==========
export default async function TravelOrderPage({ params }: PageProps) {
  const { id } = await params

  const cookieStore = await cookies()
  const userId = cookieStore.get('auth_session')?.value
  const role = cookieStore.get('user_role')?.value

  if (!userId || role !== 'STAFF') redirect('/login')

  const travelOrder = await prisma.travelOrderRequest.findUnique({
    where: { id },
    include: {
      user: true,
      itineraryItems: true,
      approvals: { include: { approver: true }, orderBy: { createdAt: 'asc' } },
    },
  })

  if (!travelOrder) notFound()
  if (travelOrder.userId !== userId) redirect('/employee/history')

  const isRejected = travelOrder.status === 'REJECTED'
  const isHRProcessing = travelOrder.status === 'HR_PROCESSING'
  const isCompleted = travelOrder.status === 'COMPLETED'
  const allOfficialsApproved = travelOrder.approvals.every(a => a.status === 'APPROVED')
  const approvedCount = travelOrder.approvals.filter(a => a.status === 'APPROVED').length
  const totalOfficials = travelOrder.approvals.length
  const progressPercent = (approvedCount / totalOfficials) * 100
  const statusConfig = getStatusConfig(travelOrder.status)
  const StatusIcon = statusConfig.icon

  // Determine if we should show HR step
  const showHRStep = allOfficialsApproved || isHRProcessing || isCompleted

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 print:bg-white print:block">
      
      {/* Sticky Header */}
      <div className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-slate-200 print:hidden shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between py-4 gap-3">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-slate-100" asChild>
                <Link href="/employee/history">
                  <ArrowLeft className="h-5 w-5 text-slate-600" />
                </Link>
              </Button>
              <div>
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-xl font-bold tracking-tight text-slate-800 flex items-center gap-2">
                    Travel Order Details
                  </h1>
                  <Badge variant="outline" className={`${statusConfig.bg} ${statusConfig.color} border ${statusConfig.border} px-3 py-1`}>
                    <StatusIcon className="w-3.5 h-3.5 mr-1.5" />
                    {statusConfig.label}
                  </Badge>
                </div>
                <p className="text-sm text-slate-500 mt-0.5">
                  Reference: <span className="font-mono font-medium text-emerald-700">
                    {travelOrder.travelOrderNumber || 'Awaiting HR assignment'}
                  </span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <PrintButton />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 print:max-w-none print:p-0 space-y-8">
        
        {/* Summary Card */}
        <Card className="print:hidden border-0 shadow-xl bg-gradient-to-r from-white to-slate-50 overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -translate-y-32 translate-x-32" />
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold text-slate-700 flex items-center gap-2">
              Request Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-emerald-100 rounded-xl">
                  <User className="w-5 h-5 text-emerald-700" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wide">Requestor</p>
                  <p className="font-semibold text-slate-800">{travelOrder.requestorName}</p>
                  <p className="text-xs text-slate-500">{travelOrder.requestorPosition}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-blue-100 rounded-xl">
                  <Calendar className="w-5 h-5 text-blue-700" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wide">Travel Period</p>
                  <p className="font-semibold text-slate-800">
                    {new Date(travelOrder.departureDate).toLocaleDateString('en-PH')} – {new Date(travelOrder.returnDate).toLocaleDateString('en-PH')}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-purple-100 rounded-xl">
                  <Map className="w-5 h-5 text-purple-700" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wide">Destination</p>
                  <p className="font-semibold text-slate-800">{travelOrder.destinationProvince}</p>
                  <p className="text-xs text-slate-500 truncate max-w-[180px]">{travelOrder.specificLocation}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-amber-100 rounded-xl">
                  <Building className="w-5 h-5 text-amber-700" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wide">Employment</p>
                  <p className="font-semibold text-slate-800">{travelOrder.employmentStatus}</p>
                  <p className="text-xs text-slate-500">{travelOrder.requestorStation}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Approval Workflow Section */}
        <div className="print:hidden">
          <Card className="border-0 shadow-xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-slate-50 to-white border-b">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <CardTitle className="flex items-center gap-2 text-slate-800">
                  <Award className="w-5 h-5 text-emerald-600" />
                  Approval Workflow
                </CardTitle>
                {!isRejected && !isCompleted && (
                  <div className="text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                    Step {approvedCount} of {totalOfficials} approvals completed
                  </div>
                )}
              </div>
              {/* Progress Bar */}
              {!isRejected && !isCompleted && totalOfficials > 0 && (
                <div className="mt-4">
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-700 ease-out"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
              )}
            </CardHeader>
            <CardContent className="pt-6">
              {/* Rejection banner */}
              {isRejected && travelOrder.rejectionReason && (
                <div className="mb-6 p-5 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-3 shadow-sm">
                  <XCircle className="w-6 h-6 text-rose-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-bold text-rose-800">Travel Request Rejected</p>
                    <p className="text-sm text-rose-700 mt-1">{travelOrder.rejectionReason}</p>
                    <p className="text-xs text-rose-600 mt-2">Please review the reason and create a new travel request if needed.</p>
                  </div>
                </div>
              )}

              <div className="space-y-0">
                {/* Official Approvals */}
                {travelOrder.approvals.map((approval, idx) => (
                  <ApprovalStep
                    key={approval.id}
                    role={approval.approverRole}
                    title={roleTitles[approval.approverRole] || approval.approverRole}
                    status={approval.status}
                    approver={approval.approver}
                    placeSigned={(approval as any).placeSigned}
                    signedAt={approval.updatedAt}
                    signatureData={(approval as any).signatureData}
                    comment={(approval as any).comment}
                    isLast={idx === travelOrder.approvals.length - 1 && !showHRStep}
                  />
                ))}
                
                {/* HR Step (if applicable) */}
                {showHRStep && (
                  <HRProcessingStep status={travelOrder.status} travelOrderNumber={travelOrder.travelOrderNumber} />
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Document Sections (for printing) */}
        <div className="space-y-12 print:space-y-0">
          {/* Main Travel Order */}
          <div className="bg-white shadow-2xl rounded-xl overflow-hidden border border-slate-200 print:shadow-none print:border-none print:rounded-none print:break-after-page">
            <TravelOrderDocument data={travelOrder} />
          </div>

          {/* Additional documents for non-permanent employees */}
          {travelOrder.employmentStatus !== 'PERMANENT' && (
            <>
              <div className="bg-white shadow-2xl rounded-xl overflow-hidden border border-slate-200 print:shadow-none print:border-none print:rounded-none print:break-after-page">
                <ProposedItineraryDocument data={travelOrder} />
              </div>
              <div className="bg-white shadow-2xl rounded-xl overflow-hidden border border-slate-200 print:shadow-none print:border-none print:rounded-none print:break-after-page">
                <CertificationDocument data={travelOrder} />
              </div>
            </>
          )}
        </div>

          
        <FloatingPrintButton />
      </div>
    </div>
  )
}