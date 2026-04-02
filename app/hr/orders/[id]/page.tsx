import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, CheckCircle, XCircle, Clock, UserCheck, MapPin, CalendarDays, Award } from 'lucide-react'
import TravelOrderDocument from '@/app/sample/page'
import ProposedItineraryDocument from '@/app/sample/itinerary/page'
import CertificationDocument from '@/app/sample/certification/page'

interface PageProps {
  params: Promise<{ id: string }>
}

const getStatusConfig = (status: string) => {
  const configs: Record<string, { color: string, bg: string, border: string, icon: any, label: string }> = {
    'PENDING': { color: 'text-yellow-700', bg: 'bg-yellow-50', border: 'border-yellow-200', icon: Clock, label: 'Pending' },
    'APPROVED': { color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200', icon: CheckCircle, label: 'Approved' },
    'REJECTED': { color: 'text-red-700', bg: 'bg-red-50', border: 'border-red-200', icon: XCircle, label: 'Rejected' },
    'HR_PROCESSING': { color: 'text-purple-700', bg: 'bg-purple-50', border: 'border-purple-200', icon: Clock, label: 'HR Processing' },
    'COMPLETED': { color: 'text-slate-700', bg: 'bg-slate-50', border: 'border-slate-200', icon: CheckCircle, label: 'Completed' },
  }
  return configs[status] || configs['PENDING']
}

const ApprovalStep = ({ role, title, status, approver, placeSigned, signedAt, signatureData, comment, isLast }: any) => {
  const isApproved = status === 'APPROVED'
  const isRejected = status === 'REJECTED'
  const isPending = status === 'PENDING'

  return (
    <div className="relative flex gap-4">
      <div className="flex flex-col items-center">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300
          ${isApproved ? 'bg-emerald-100 border-emerald-500 text-emerald-600' :
            isRejected ? 'bg-red-100 border-red-500 text-red-600' :
            'bg-white border-slate-300 text-slate-400'}`}>
          {isApproved ? <CheckCircle className="w-5 h-5" /> :
           isRejected ? <XCircle className="w-5 h-5" /> :
           <Clock className="w-5 h-5" />}
        </div>
        {!isLast && <div className="w-0.5 flex-1 bg-slate-200 mt-2" />}
      </div>
      <div className={`flex-1 mb-6 rounded-xl border p-4 transition-all hover:shadow-md ${isPending ? 'bg-white' : isApproved ? 'bg-emerald-50/30' : 'bg-red-50/30'}`}>
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <h3 className="font-semibold text-slate-800">{role.replace(/_/g, ' ')}</h3>
            <p className="text-xs text-slate-500 mt-0.5">{title}</p>
          </div>
          <Badge variant="outline" className={`
            ${isApproved ? 'bg-emerald-100 text-emerald-700 border-emerald-200' :
              isRejected ? 'bg-red-100 text-red-700 border-red-200' :
              'bg-yellow-100 text-yellow-700 border-yellow-200'}`}>
            {status}
          </Badge>
        </div>
        {isApproved && approver && (
          <div className="mt-4 pt-3 border-t border-slate-200 space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <UserCheck className="w-4 h-4 text-slate-400" />
              <span className="font-medium text-slate-700">{approver.firstName} {approver.lastName}</span>
            </div>
            {placeSigned && (
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4 text-slate-400" />
                <span className="text-slate-600">{placeSigned}</span>
              </div>
            )}
            {signedAt && (
              <div className="flex items-center gap-2 text-sm">
                <CalendarDays className="w-4 h-4 text-slate-400" />
                <span className="text-slate-600">{new Date(signedAt).toLocaleString()}</span>
              </div>
            )}
            {signatureData && (
              <div className="mt-2">
                <p className="text-xs text-slate-500 mb-1">Digital Signature</p>
                <img src={signatureData} alt="Signature" className="h-10 object-contain border rounded bg-white p-1" />
              </div>
            )}
          </div>
        )}
        {isPending && (
          <div className="mt-4 pt-3 border-t border-slate-200">
            <p className="text-sm text-amber-600 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Awaiting approval from this officer
            </p>
          </div>
        )}
        {isRejected && comment && (
          <div className="mt-4 pt-3 border-t border-slate-200">
            <p className="text-sm text-red-600"><span className="font-semibold">Reason:</span> {comment}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default async function HROrderDetailPage({ params }: PageProps) {
  const { id } = await params

  const cookieStore = await cookies()
  const role = cookieStore.get('user_role')?.value

  if (role !== 'HR' && role !== 'ADMIN') {
    redirect('/dashboard')
  }

  const travelOrder = await prisma.travelOrderRequest.findUnique({
    where: { id },
    include: {
      user: true,
      itineraryItems: true,
      approvals: { include: { approver: true }, orderBy: { createdAt: 'asc' } },
    },
  })

  if (!travelOrder) notFound()

  const isFieldOps = travelOrder.user?.division === 'field_ops'
  const allRoles = isFieldOps
    ? ['APCO', 'CHIEF_AGRICULTURIST', 'CHIEF_ADMINISTRATIVE', 'REGIONAL_EXECUTIVE']
    : ['CHIEF_ADMINISTRATIVE', 'REGIONAL_EXECUTIVE']

  const statusConfig = getStatusConfig(travelOrder.status)
  const StatusIcon = statusConfig.icon

  const roleTitles: Record<string, string> = {
    'APCO': 'Agricultural Program Coordinating Office',
    'CHIEF_AGRICULTURIST': 'Chief Agriculturist – Regulatory Division',
    'CHIEF_ADMINISTRATIVE': 'Chief Administrative Officer',
    'REGIONAL_EXECUTIVE': 'Regional Executive Director',
  }

  const currentStepIndex = travelOrder.approvals.findIndex(a => a.status === 'PENDING')
  const totalSteps = travelOrder.approvals.length
  const progressPercent = currentStepIndex === -1 ? 100 : (currentStepIndex / totalSteps) * 100

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/hr/orders">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-bold tracking-tight text-slate-800">
                  Travel Order Details
                </h1>
                <Badge variant="outline" className={`${statusConfig.bg} ${statusConfig.color} border ${statusConfig.border}`}>
                  <StatusIcon className="w-3 h-3 mr-1" />
                  {statusConfig.label}
                </Badge>
              </div>
              <p className="text-sm text-slate-500 mt-0.5">
                Reference: <span className="font-mono font-medium">{travelOrder.travelOrderNumber || 'Not assigned'}</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Approval Workflow */}
        <Card className="border-0 shadow-xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-slate-50 to-white border-b">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-slate-800">
                <Award className="w-5 h-5 text-emerald-600" />
                Approval Workflow
              </CardTitle>
              {travelOrder.status !== 'REJECTED' && travelOrder.status !== 'COMPLETED' && (
                <div className="text-sm text-slate-500">
                  Step {currentStepIndex === -1 ? totalSteps : currentStepIndex} of {totalSteps}
                </div>
              )}
            </div>
            {travelOrder.status !== 'REJECTED' && travelOrder.status !== 'COMPLETED' && (
              <div className="mt-4">
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full transition-all duration-700" style={{ width: `${progressPercent}%` }} />
                </div>
              </div>
            )}
          </CardHeader>
          <CardContent className="pt-6">
            {travelOrder.status === 'REJECTED' && travelOrder.rejectionReason && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                <XCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-red-800">Travel Request Rejected</p>
                  <p className="text-sm text-red-700 mt-1">{travelOrder.rejectionReason}</p>
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
                  placeSigned={approval.placeSigned}
                  signedAt={approval.updatedAt}
                  signatureData={approval.signatureData}
                  comment={approval.comment}
                  isLast={idx === travelOrder.approvals.length - 1}
                />
              ))}
              {travelOrder.status === 'HR_PROCESSING' && (
                <div className="relative flex gap-4 mt-2">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-purple-100 border-2 border-purple-500 flex items-center justify-center">
                      <Clock className="w-5 h-5 text-purple-600" />
                    </div>
                  </div>
                  <div className="flex-1 bg-purple-50 rounded-xl border border-purple-200 p-4">
                    <h3 className="font-semibold text-purple-800">HR Processing</h3>
                    <p className="text-sm text-purple-700 mt-1">
                      This travel order is awaiting HR processing. A travel number will be assigned.
                    </p>
                  </div>
                </div>
              )}
              {travelOrder.status === 'COMPLETED' && travelOrder.travelOrderNumber && (
                <div className="relative flex gap-4 mt-2">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 border-2 border-emerald-500 flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-emerald-600" />
                    </div>
                  </div>
                  <div className="flex-1 bg-emerald-50 rounded-xl border border-emerald-200 p-4">
                    <h3 className="font-semibold text-emerald-800">Completed</h3>
                    <p className="text-sm text-emerald-700 mt-1">
                      Travel Order Number: <span className="font-mono font-bold">{travelOrder.travelOrderNumber}</span>
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Documents */}
        <div className="space-y-12">
          <div className="bg-white shadow-2xl rounded-xl overflow-hidden border border-slate-200">
            <TravelOrderDocument data={travelOrder} />
          </div>
          {travelOrder.employmentStatus !== 'PERMANENT' && (
            <>
              <div className="bg-white shadow-2xl rounded-xl overflow-hidden border border-slate-200">
                <ProposedItineraryDocument data={travelOrder} />
              </div>
              <div className="bg-white shadow-2xl rounded-xl overflow-hidden border border-slate-200">
                <CertificationDocument data={travelOrder} />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}