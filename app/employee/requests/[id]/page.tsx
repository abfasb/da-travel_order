import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'
import { redirect, notFound } from 'next/navigation'
import TravelOrderDocument from '@/app/sample/page'
import ProposedItineraryDocument from '@/app/sample/itinerary/page'
import CertificationDocument from '@/app/sample/certification/page'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ArrowLeft, CheckCircle, XCircle, Clock, UserCheck, MapPin, CalendarDays,
  User, Building, Calendar, Map, FileCheck, Hourglass, Bell, Hash,
  Paperclip, Download, FileText, Image as ImageIcon,
} from 'lucide-react'
import Link from 'next/link'
import PrintButton from '@/components/employee/PrintButton'
import { PDFDownloadButton } from '@/components/division-head/pdf-download-button'

interface PageProps {
  params: Promise<{ id: string }>
}

const getStatusConfig = (status: string) => {
  const configs: Record<string, { color: string, bg: string, border: string, icon: any, label: string }> = {
    'PENDING': { 
      color: 'text-amber-700 dark:text-amber-300', 
      bg: 'bg-amber-50 dark:bg-amber-950/30', 
      border: 'border-amber-200 dark:border-amber-800', 
      icon: Hourglass, 
      label: 'Pending Review' 
    },
    'REVIEWING': { 
      color: 'text-blue-700 dark:text-blue-300', 
      bg: 'bg-blue-50 dark:bg-blue-950/30', 
      border: 'border-blue-200 dark:border-blue-800', 
      icon: Clock, 
      label: 'Under Review' 
    },
    'APPROVED': { 
      color: 'text-emerald-700 dark:text-emerald-300', 
      bg: 'bg-emerald-50 dark:bg-emerald-950/30', 
      border: 'border-emerald-200 dark:border-emerald-800', 
      icon: CheckCircle, 
      label: 'Approved' 
    },
    'REJECTED': { 
      color: 'text-rose-700 dark:text-rose-300', 
      bg: 'bg-rose-50 dark:bg-rose-950/30', 
      border: 'border-rose-200 dark:border-rose-800', 
      icon: XCircle, 
      label: 'Rejected' 
    },
    'HR_PROCESSING': { 
      color: 'text-purple-700 dark:text-purple-300', 
      bg: 'bg-purple-50 dark:bg-purple-950/30', 
      border: 'border-purple-200 dark:border-purple-800', 
      icon: FileCheck, 
      label: 'HR Processing' 
    },
    'COMPLETED': { 
      color: 'text-slate-700 dark:text-slate-300', 
      bg: 'bg-slate-100 dark:bg-slate-800', 
      border: 'border-slate-300 dark:border-slate-700', 
      icon: CheckCircle, 
      label: 'Completed' 
    },
  }
  return configs[status] || configs['PENDING']
}

const roleTitles: Record<string, string> = {
  'APCO': 'Agricultural Program Coordinating Office',
  'CHIEF_AGRICULTURIST': 'Chief Agriculturist – Regulatory Division',
  'CHIEF_ADMINISTRATIVE': 'Chief Administrative Officer',
  'REGIONAL_EXECUTIVE': 'Regional Executive Director',
}

const ApprovalStep = ({ 
  role, title, status, approver, placeSigned, signedAt, signatureData, comment, isLast 
}: any) => {
  const isApproved = status === 'APPROVED'
  const isRejected = status === 'REJECTED'
  const isPending = status === 'PENDING'

  return (
    <div className="relative flex gap-4 group">
      <div className="flex flex-col items-center">
        <div className={`w-11 h-11 rounded-full flex items-center justify-center border-2 transition-all duration-300 shadow-sm ${
          isApproved ? 'bg-emerald-100 dark:bg-emerald-900/50 border-emerald-500 text-emerald-600 dark:text-emerald-400' : 
          isRejected ? 'bg-rose-100 dark:bg-rose-900/50 border-rose-500 text-rose-600 dark:text-rose-400' : 
          'bg-background border-border text-muted-foreground'
        }`}>
          {isApproved ? <CheckCircle className="w-5 h-5" /> : isRejected ? <XCircle className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
        </div>
        {!isLast && <div className="w-0.5 flex-1 bg-gradient-to-b from-border to-border/30 mt-2" />}
      </div>
      <div className={`flex-1 mb-7 rounded-xl border p-5 transition-all duration-200 hover:shadow-md ${
        isPending ? 'bg-card' : isApproved ? 'bg-emerald-50/40 dark:bg-emerald-950/20' : 'bg-rose-50/40 dark:bg-rose-950/20'
      } border-border`}>
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <h3 className="font-semibold text-foreground text-lg">{role.replace(/_/g, ' ')}</h3>
            <p className="text-sm text-muted-foreground mt-0.5">{title}</p>
          </div>
          <Badge variant="outline" className={`px-3 py-1 text-xs font-medium ${
            isApproved ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800' : 
            isRejected ? 'bg-rose-100 dark:bg-rose-900/50 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800' : 
            'bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800'
          }`}>{status}</Badge>
        </div>
        {isApproved && approver && (
          <div className="mt-5 pt-4 border-t border-border space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <UserCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span className="font-medium text-foreground">{approver.firstName} {approver.lastName}</span>
              <span className="text-xs text-muted-foreground">({approver.email})</span>
            </div>
            {placeSigned && (
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span className="text-foreground">{placeSigned}</span>
              </div>
            )}
            {signedAt && (
              <div className="flex items-center gap-3 text-sm">
                <CalendarDays className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span className="text-foreground">{new Date(signedAt).toLocaleString()}</span>
              </div>
            )}
            {signatureData && (
              <div className="mt-3 pt-2">
                <p className="text-xs text-muted-foreground mb-1 font-medium">Digital Signature</p>
                <img src={signatureData} alt="Signature" className="h-12 object-contain border border-border rounded-lg bg-background p-1.5 shadow-sm" />
              </div>
            )}
          </div>
        )}
        {isPending && (
          <div className="mt-5 pt-4 border-t border-border">
            <p className="text-sm text-amber-600 dark:text-amber-400 flex items-center gap-2">
              <Bell className="w-4 h-4" /> Awaiting approval from this officer
            </p>
          </div>
        )}
        {isRejected && comment && (
          <div className="mt-5 pt-4 border-t border-rose-200 dark:border-rose-800">
            <p className="text-sm text-rose-700 dark:text-rose-300">
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
  let bgColor = 'bg-card'
  let borderColor = 'border-border'
  let iconBg = 'bg-purple-100 dark:bg-purple-900/50 border-purple-500 text-purple-600 dark:text-purple-400'
  let badgeClass = 'bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800'
  
  if (isCompleted) {
    bgColor = 'bg-emerald-50/40 dark:bg-emerald-950/20'
    borderColor = 'border-emerald-200 dark:border-emerald-800'
    iconBg = 'bg-emerald-100 dark:bg-emerald-900/50 border-emerald-500 text-emerald-600 dark:text-emerald-400'
    badgeClass = 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
  } else if (isWaiting) {
    bgColor = 'bg-muted/30'
    borderColor = 'border-border'
    iconBg = 'bg-muted border-border text-muted-foreground'
    badgeClass = 'bg-muted text-muted-foreground border-border'
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
            <h3 className="font-semibold text-foreground text-lg">Human Resources Office</h3>
            <p className="text-sm text-muted-foreground mt-0.5">Travel Order Number Assignment & Document Finalization</p>
          </div>
          <Badge variant="outline" className={`px-3 py-1 text-xs font-medium ${badgeClass}`}>
            {displayStatus === 'COMPLETED' ? 'COMPLETED' : displayStatus === 'HR_PROCESSING' ? 'HR PROCESSING' : 'PENDING'}
          </Badge>
        </div>
        {isCompleted && travelOrderNumber && (
          <div className="mt-5 pt-4 border-t border-emerald-200 dark:border-emerald-800">
            <div className="flex items-center gap-3">
              <Hash className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <div>
                <p className="text-xs text-muted-foreground">Travel Order Number</p>
                <p className="font-mono font-bold text-emerald-700 dark:text-emerald-300 text-lg">{travelOrderNumber}</p>
              </div>
            </div>
            <p className="text-sm text-emerald-700 dark:text-emerald-300 mt-3 flex items-center gap-2">
              <CheckCircle className="w-4 h-4" /> Travel order has been finalized. You may now print the official document.
            </p>
          </div>
        )}
        {isProcessing && (
          <div className="mt-5 pt-4 border-t border-purple-200 dark:border-purple-800">
            <div className="flex items-center gap-3">
              <Hourglass className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <p className="text-sm text-purple-700 dark:text-purple-300">
                All approvals received. HR officer will assign a travel order number and finalize the document shortly.
              </p>
            </div>
          </div>
        )}
        {isWaiting && (
          <div className="mt-5 pt-4 border-t border-border">
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <Clock className="w-4 h-4" /> Waiting for all officials to approve before HR processing begins.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

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
      attachments: true, // 🆕 fetch supporting documents
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
  const progressPercent = totalOfficials > 0 ? (approvedCount / totalOfficials) * 100 : 0
  const statusConfig = getStatusConfig(travelOrder.status)
  const StatusIcon = statusConfig.icon

  const showHRStep = allOfficialsApproved || isHRProcessing || isCompleted
  const hasAttachments = travelOrder.attachments?.length > 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted overflow-hidden print:bg-white print:block">
      
      {/* Sticky Header */}
      <div className="sticky top-0 z-20 bg-background/90 backdrop-blur-md border-b border-border print:hidden shadow-sm">
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between py-4 gap-3">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-muted" asChild>
                <Link href="/employee/history">
                  <ArrowLeft className="h-5 w-5 text-muted-foreground" />
                </Link>
              </Button>
              <div>
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
                    Travel Order Details
                  </h1>
                  <Badge variant="outline" className={`${statusConfig.bg} ${statusConfig.color} border ${statusConfig.border} px-3 py-1`}>
                    <StatusIcon className="w-3.5 h-3.5 mr-1.5" />
                    {statusConfig.label}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Reference: <span className="font-mono font-medium text-emerald-700 dark:text-emerald-400">
                    {travelOrder.travelOrderNumber || 'Awaiting HR assignment'}
                  </span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <PrintButton status={travelOrder.status} />
              {isCompleted && <PDFDownloadButton order={travelOrder} />}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 print:max-w-none print:p-0 space-y-8">
        
        {/* Request Summary */}
        <Card className="print:hidden border-0 shadow-xl bg-gradient-to-r from-card to-muted overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 dark:bg-emerald-400/5 rounded-full blur-3xl -translate-y-32 translate-x-32" />
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
              Request Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl">
                  <User className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Requestor</p>
                  <p className="font-semibold text-foreground">{travelOrder.requestorName}</p>
                  <p className="text-xs text-muted-foreground">{travelOrder.requestorPosition}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                  <Calendar className="w-5 h-5 text-blue-700 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Travel Period</p>
                  <p className="font-semibold text-foreground">
                    {new Date(travelOrder.departureDate).toLocaleDateString('en-PH')} – {new Date(travelOrder.returnDate).toLocaleDateString('en-PH')}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                  <Map className="w-5 h-5 text-purple-700 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Destination</p>
                  <p className="font-semibold text-foreground">{travelOrder.destinationProvince}</p>
                  <p className="text-xs text-muted-foreground truncate max-w-[180px]">{travelOrder.specificLocation}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-amber-100 dark:bg-amber-900/30 rounded-xl">
                  <Building className="w-5 h-5 text-amber-700 dark:text-amber-400" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Employment</p>
                  <p className="font-semibold text-foreground">{travelOrder.employmentStatus}</p>
                  <p className="text-xs text-muted-foreground">{travelOrder.requestorStation}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 🆕 Supporting Documents Card */}
        {hasAttachments && (
          <Card className="print:hidden border-0 shadow-xl bg-gradient-to-r from-card to-muted overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Paperclip className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                Supporting Documents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {travelOrder.attachments.map((att) => (
                  <div
                    key={att.id}
                    className="flex items-center gap-4 p-4 rounded-xl bg-muted/50 border border-border hover:shadow-md transition-shadow group"
                  >
                    <div className="shrink-0">
                      {att.mimeType.startsWith('image/') ? (
                        <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                          <ImageIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                      ) : (
                        <div className="h-10 w-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                          <FileText className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{att.fileName}</p>
                      <p className="text-xs text-muted-foreground">
                        {(att.fileSize / 1024).toFixed(1)} KB
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                      asChild
                    >
                      <a href={att.fileUrl} target="_blank" rel="noopener noreferrer" download>
                        <Download className="h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Approval Workflow */}
        <div className="print:hidden">
          <Card className="border-0 shadow-xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-muted to-card border-b border-border">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <CardTitle className="flex items-center gap-2 font-bold text-foreground">
                  Approval Workflow
                </CardTitle>
                {!isRejected && !isCompleted && (
                  <div className="text-sm text-muted-foreground bg-muted px-3 py-1 rounded-full">
                    Step {approvedCount} of {totalOfficials} approvals completed
                  </div>
                )}
              </div>
              {!isRejected && !isCompleted && totalOfficials > 0 && (
                <div className="mt-4">
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-700 ease-out"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
              )}
            </CardHeader>
            <CardContent className="pt-6">
              {isRejected && travelOrder.rejectionReason && (
                <div className="mb-6 p-5 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 rounded-xl flex items-start gap-3 shadow-sm">
                  <XCircle className="w-6 h-6 text-rose-600 dark:text-rose-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-bold text-rose-800 dark:text-rose-200">Travel Request Rejected</p>
                    <p className="text-sm text-rose-700 dark:text-rose-300 mt-1">{travelOrder.rejectionReason}</p>
                    <p className="text-xs text-rose-600 dark:text-rose-400 mt-2">Please review the reason and create a new travel request if needed.</p>
                  </div>
                </div>
              )}

              <div className="space-y-0">
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
                
                {showHRStep && (
                  <HRProcessingStep status={travelOrder.status} travelOrderNumber={travelOrder.travelOrderNumber} />
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Document Sections */}
        <div className="space-y-12 print:space-y-0">
          <div className="bg-card shadow-2xl rounded-xl overflow-hidden border border-border print:shadow-none print:border-none print:rounded-none print:break-after-page">
            <TravelOrderDocument data={travelOrder} />
          </div>

          {travelOrder.employmentStatus !== 'PERMANENT' && (
            <>
              <div className="bg-card shadow-2xl rounded-xl overflow-hidden border border-border print:shadow-none print:border-none print:rounded-none print:break-after-page">
                <ProposedItineraryDocument data={travelOrder} />
              </div>
              <div className="bg-card shadow-2xl rounded-xl overflow-hidden border border-border print:shadow-none print:border-none print:rounded-none print:break-after-page">
                <CertificationDocument data={travelOrder} />
              </div>
            </>
          )}
        </div>

      </div>
    </div>
  )
}