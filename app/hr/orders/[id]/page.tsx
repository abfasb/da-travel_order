import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  ArrowLeft, CheckCircle, XCircle, Clock, UserCheck,
  MapPin, CalendarDays, Award, FileText, ChevronRight,
} from 'lucide-react'
import TravelOrderDocument from '@/app/sample/page'
import ProposedItineraryDocument from '@/app/sample/itinerary/page'
import CertificationDocument from '@/app/sample/certification/page'

interface PageProps {
  params: Promise<{ id: string }>
}

const getStatusConfig = (status: string) => {
  const configs: Record<string, { color: string; dot: string; label: string; glow: string }> = {
    PENDING:        { color: '#b45309', dot: '#f59e0b', label: 'Pending',        glow: 'rgba(245,158,11,0.12)' },
    APPROVED:       { color: '#065f46', dot: '#10b981', label: 'Approved',       glow: 'rgba(16,185,129,0.12)' },
    REJECTED:       { color: '#991b1b', dot: '#ef4444', label: 'Rejected',       glow: 'rgba(239,68,68,0.12)'  },
    HR_PROCESSING:  { color: '#5b21b6', dot: '#8b5cf6', label: 'HR Processing',  glow: 'rgba(139,92,246,0.12)' },
    COMPLETED:      { color: '#0f4c81', dot: '#3b82f6', label: 'Completed',      glow: 'rgba(59,130,246,0.12)' },
  }
  return configs[status] || configs['PENDING']
}

const roleTitles: Record<string, string> = {
  APCO:                  'Agricultural Program Coordinating Office',
  CHIEF_AGRICULTURIST:   'Chief Agriculturist – Regulatory Division',
  CHIEF_ADMINISTRATIVE:  'Chief Administrative Officer',
  REGIONAL_EXECUTIVE:    'Regional Executive Director',
}

/* ─── ApprovalStep (Light Theme) ───────────────────────── */
const ApprovalStep = ({
  role, title, status, approver, placeSigned,
  signedAt, signatureData, comment, isLast, index,
}: any) => {
  const isApproved = status === 'APPROVED'
  const isRejected = status === 'REJECTED'
  const isPending  = status === 'PENDING'

  return (
    <>
      <style>{`
        @keyframes stepIn {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .step-card {
          animation: stepIn 0.4s ease both;
          animation-delay: calc(${index} * 80ms);
        }
        @keyframes pulseLight {
          0%,100% { opacity: 0.7; } 50% { opacity: 1; }
        }
      `}</style>

      <div className="step-card relative flex gap-5">
        {/* Timeline spine */}
        <div className="flex flex-col items-center" style={{ width: 40, flexShrink: 0 }}>
          <div style={{
            width: 38, height: 38,
            borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
            background: isApproved ? '#ecfdf5'
                       : isRejected ? '#fef2f2'
                       : '#f1f5f9',
            border: `2px solid ${isApproved ? '#10b981' : isRejected ? '#ef4444' : '#cbd5e1'}`,
            boxShadow: isApproved ? '0 0 0 4px rgba(16,185,129,0.1)'
                      : isRejected ? '0 0 0 4px rgba(239,68,68,0.1)' : 'none',
            zIndex: 1, position: 'relative',
          }}>
            {isApproved && <CheckCircle size={16} color="#10b981" />}
            {isRejected && <XCircle    size={16} color="#ef4444" />}
            {isPending  && <Clock      size={16} color="#64748b" />}
          </div>
          {!isLast && (
            <div style={{
              width: 2, flex: 1, marginTop: 4,
              background: isApproved
                ? 'linear-gradient(180deg, #10b981, #d1fae5)'
                : '#e2e8f0',
              minHeight: 32,
            }} />
          )}
        </div>

        {/* Card */}
        <div style={{
          flex: 1, marginBottom: 20,
          borderRadius: 12,
          border: `1px solid ${isApproved ? '#d1fae5' : isRejected ? '#fee2e2' : '#e2e8f0'}`,
          background: isApproved ? '#f0fdf4'
                     : isRejected ? '#fef2f2'
                     : '#ffffff',
          padding: '16px 18px',
          transition: 'box-shadow 0.2s ease',
          boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
        }}
        >
          {/* Row header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
            <div>
              <p style={{ fontWeight: 600, color: '#0f172a', fontSize: 13.5, margin: 0 }}>
                {role.replace(/_/g, ' ')}
              </p>
              <p style={{ color: '#64748b', fontSize: 11.5, marginTop: 2 }}>{title}</p>
            </div>
            <span style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 10, fontWeight: 500,
              padding: '3px 8px', borderRadius: 5,
              letterSpacing: '0.06em',
              background: isApproved ? '#d1fae5'
                         : isRejected ? '#fee2e2' : '#fef3c7',
              color: isApproved ? '#065f46' : isRejected ? '#991b1b' : '#b45309',
              border: `1px solid ${isApproved ? '#a7f3d0' : isRejected ? '#fecaca' : '#fde68a'}`,
            }}>
              {status}
            </span>
          </div>

          {/* Approved details */}
          {isApproved && approver && (
            <div style={{
              marginTop: 14, paddingTop: 14,
              borderTop: '1px solid #e2e8f0',
              display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
              gap: '10px 24px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <UserCheck size={13} color="#059669" />
                <span style={{ fontSize: 12.5, color: '#334155', fontWeight: 500 }}>
                  {approver.firstName} {approver.lastName}
                </span>
              </div>
              {placeSigned && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                  <MapPin size={13} color="#059669" />
                  <span style={{ fontSize: 12.5, color: '#475569' }}>{placeSigned}</span>
                </div>
              )}
              {signedAt && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                  <CalendarDays size={13} color="#059669" />
                  <span style={{ fontSize: 12.5, color: '#475569' }}>
                    {new Date(signedAt).toLocaleString()}
                  </span>
                </div>
              )}
              {signatureData && (
                <div style={{ gridColumn: '1/-1', marginTop: 4 }}>
                  <p style={{ fontSize: 10.5, color: '#64748b', marginBottom: 6, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                    Digital Signature
                  </p>
                  <img
                    src={signatureData}
                    alt="Signature"
                    style={{
                      height: 44, objectFit: 'contain',
                      background: '#f8fafc',
                      borderRadius: 6, padding: '4px 12px',
                      border: '1px solid #e2e8f0',
                    }}
                  />
                </div>
              )}
            </div>
          )}

          {/* Pending notice */}
          {isPending && (
            <div style={{
              marginTop: 12, paddingTop: 12,
              borderTop: '1px solid #e2e8f0',
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <span style={{
                width: 6, height: 6, borderRadius: '50%',
                background: '#f59e0b',
                boxShadow: '0 0 0 3px rgba(245,158,11,0.25)',
                animation: 'pulseLight 2s ease-in-out infinite',
                flexShrink: 0,
                display: 'inline-block',
              }} />
              <span style={{ fontSize: 12, color: '#b45309' }}>Awaiting approval from this officer</span>
            </div>
          )}

          {/* Rejected comment */}
          {isRejected && comment && (
            <div style={{
              marginTop: 12, paddingTop: 12,
              borderTop: '1px solid #e2e8f0',
            }}>
              <span style={{ fontSize: 12, color: '#dc2626' }}>
                <strong style={{ color: '#b91c1c' }}>Reason: </strong>{comment}
              </span>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

/* ─── Page (Light Theme) ───────────────────────────────── */
export default async function HROrderDetailPage({ params }: PageProps) {
  const { id } = await params

  const cookieStore = await cookies()
  const role = cookieStore.get('user_role')?.value
  if (role !== 'HR' && role !== 'ADMIN') redirect('/dashboard')

  const travelOrder = await prisma.travelOrderRequest.findUnique({
    where: { id },
    include: {
      user: true,
      itineraryItems: true,
      approvals: { include: { approver: true }, orderBy: { createdAt: 'asc' } },
    },
  })
  if (!travelOrder) notFound()

  const statusConfig   = getStatusConfig(travelOrder.status)
  const currentStepIdx = travelOrder.approvals.findIndex(a => a.status === 'PENDING')
  const totalSteps     = travelOrder.approvals.length
  const progressPct    = currentStepIdx === -1 ? 100 : Math.round((currentStepIdx / totalSteps) * 100)
  const completedSteps = currentStepIdx === -1 ? totalSteps : currentStepIdx

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap');

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes progressFill {
          from { width: 0; }
          to   { width: ${progressPct}%; }
        }

        .od-root {
          font-family: 'DM Sans', sans-serif;
          min-height: 100vh;
          background: #f1f5f9;
          color: #0f172a;
        }

        /* ── sticky header (light) ── */
        .od-header {
          position: sticky; top: 0; z-index: 50;
          background: rgba(255,255,255,0.92);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-bottom: 1px solid #e2e8f0;
        }
        .od-header::after {
          content: '';
          position: absolute; bottom: -1px; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, transparent, #10b981 30%, #059669 60%, transparent);
          opacity: 0.4;
        }
        .od-header-inner {
          max-width: 1200px; margin: 0 auto;
          padding: 16px 28px;
          display: flex; align-items: center; gap: 16px;
        }
        .od-back-btn {
          width: 36px; height: 36px; border-radius: 9px;
          border: 1px solid #e2e8f0;
          background: #ffffff;
          color: #64748b;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; text-decoration: none;
          transition: all 0.15s ease;
          flex-shrink: 0;
        }
        .od-back-btn:hover { background: #f1f5f9; color: #0f172a; border-color: #cbd5e1; }

        .od-header-meta { flex: 1; min-width: 0; }
        .od-header-row  { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
        .od-title {
          font-size: 18px; font-weight: 700; color: #0f172a;
          letter-spacing: -0.01em; margin: 0;
        }
        .od-status-pill {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 4px 10px; border-radius: 20px;
          font-size: 11.5px; font-weight: 600;
          letter-spacing: 0.04em;
          border: 1px solid;
        }
        .od-status-dot {
          width: 6px; height: 6px; border-radius: 50%;
          animation: pulseLight 2s ease-in-out infinite;
        }
        .od-ref {
          margin-top: 4px;
          font-size: 12.5px; color: #64748b;
          display: flex; align-items: center; gap: 6px;
        }
        .od-ref-val {
          font-family: 'DM Mono', monospace;
          font-size: 11.5px; font-weight: 500;
          color: #059669;
          background: #ecfdf5;
          border: 1px solid #a7f3d0;
          border-radius: 5px; padding: 1px 7px;
          letter-spacing: 0.06em;
        }

        /* ── page body ── */
        .od-body {
          max-width: 1200px; margin: 0 auto;
          padding: 36px 28px 80px;
          display: flex; flex-direction: column; gap: 32px;
        }

        /* ── section card (light) ── */
        .od-card {
          border-radius: 16px;
          border: 1px solid #e2e8f0;
          background: #ffffff;
          overflow: hidden;
          animation: fadeUp 0.45s ease both;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }
        .od-card:nth-child(1) { animation-delay: 0ms; }
        .od-card:nth-child(2) { animation-delay: 80ms; }
        .od-card:nth-child(3) { animation-delay: 160ms; }

        .od-card-head {
          padding: 20px 24px 18px;
          border-bottom: 1px solid #e2e8f0;
          display: flex; align-items: center; justify-content: space-between;
          background: #fafcff;
        }
        .od-card-title {
          display: flex; align-items: center; gap: 9px;
          font-size: 14px; font-weight: 600; color: #0f172a;
          margin: 0;
        }
        .od-card-icon {
          width: 30px; height: 30px; border-radius: 8px;
          background: #ecfdf5;
          border: 1px solid #a7f3d0;
          display: flex; align-items: center; justify-content: center;
          color: #059669;
          flex-shrink: 0;
        }
        .od-card-body { padding: 24px; }

        /* ── progress bar ── */
        .od-prog-row {
          display: flex; align-items: center;
          justify-content: space-between; gap: 16px;
          margin-top: 14px;
        }
        .od-prog-track {
          flex: 1; height: 5px; border-radius: 99px;
          background: #e2e8f0; overflow: hidden;
        }
        .od-prog-fill {
          height: 100%; border-radius: 99px;
          background: linear-gradient(90deg, #059669, #10b981);
          animation: progressFill 1s cubic-bezier(.4,0,.2,1) both;
          animation-delay: 200ms;
          box-shadow: 0 0 4px rgba(16,185,129,0.4);
        }
        .od-prog-label {
          font-family: 'DM Mono', monospace;
          font-size: 11px; font-weight: 500;
          color: #64748b;
          white-space: nowrap;
        }
        .od-prog-label strong { color: #059669; }

        /* ── rejection banner (light) ── */
        .od-rejection-banner {
          margin-bottom: 24px;
          padding: 14px 18px;
          border-radius: 10px;
          border: 1px solid #fecaca;
          background: #fef2f2;
          display: flex; align-items: flex-start; gap: 12px;
        }
        .od-rejection-icon {
          width: 30px; height: 30px; border-radius: 8px;
          background: #fee2e2;
          border: 1px solid #fecaca;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }

        /* ── special step boxes (light) ── */
        .od-special-step {
          display: flex; gap: 16px; align-items: flex-start;
        }
        .od-special-dot {
          width: 38px; height: 38px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .od-special-card {
          flex: 1; border-radius: 10px; padding: 14px 18px;
          border: 1px solid;
        }

        /* ── document wrappers (light) with distinct background ── */
        .od-doc-section {
          display: flex; flex-direction: column; gap: 28px;
        }
        .od-doc-card {
          border-radius: 16px;
          background: #eef2f6;  /* soft gray background to make white document stand out */
          border: 1px solid #cbd5e1;
          overflow: hidden;
          box-shadow: 0 8px 20px rgba(0,0,0,0.08);
          animation: fadeUp 0.5s ease both;
        }
        .od-doc-card:nth-child(1) { animation-delay: 200ms; }
        .od-doc-card:nth-child(2) { animation-delay: 300ms; }
        .od-doc-card:nth-child(3) { animation-delay: 400ms; }
        .od-doc-label {
          display: flex; align-items: center; gap: 9px;
          padding: 12px 20px;
          background: #ffffff;
          border-bottom: 1px solid #e2e8f0;
          font-size: 11.5px; font-weight: 600;
          letter-spacing: 0.08em; text-transform: uppercase;
          color: #1e293b;
        }
        .od-doc-label span {
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          background: #ecfdf5; color: #059669;
          border: 1px solid #a7f3d0;
          border-radius: 4px; padding: 1px 6px;
          letter-spacing: 0.06em;
        }
        /* Inner document wrapper – white paper effect */
        .od-doc-paper {
          background: white;
          margin: 20px;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
          overflow: hidden;
        }
      `}</style>

      <div className="od-root">

        {/* ── Header ── */}
        <header className="od-header">
          <div className="od-header-inner">
            <Link href="/hr/orders" className="od-back-btn">
              <ArrowLeft size={15} strokeWidth={2.5} />
            </Link>
            <div className="od-header-meta">
              <div className="od-header-row">
                <h1 className="od-title">Travel Order Details</h1>
                <span
                  className="od-status-pill"
                  style={{
                    color: statusConfig.dot,
                    borderColor: `${statusConfig.dot}44`,
                    background: statusConfig.glow,
                  }}
                >
                  <span className="od-status-dot" style={{ background: statusConfig.dot }} />
                  {statusConfig.label}
                </span>
              </div>
              <div className="od-ref">
                Reference
                <span className="od-ref-val">
                  {travelOrder.travelOrderNumber || 'Not assigned'}
                </span>
              </div>
            </div>
          </div>
        </header>

        <div className="od-body">

          {/* ── Approval Workflow Card ── */}
          <div className="od-card">
            <div className="od-card-head">
              <h2 className="od-card-title">
                <span className="od-card-icon"><Award size={14} /></span>
                Approval Workflow
              </h2>
              {travelOrder.status !== 'REJECTED' && travelOrder.status !== 'COMPLETED' && (
                <div className="od-prog-row" style={{ marginTop: 0, minWidth: 220 }}>
                  <div className="od-prog-track">
                    <div className="od-prog-fill" style={{ width: `${progressPct}%`, animation: 'none' }} />
                  </div>
                  <span className="od-prog-label">
                    <strong>{completedSteps}</strong>/{totalSteps}
                  </span>
                </div>
              )}
            </div>

            <div className="od-card-body">
              {/* Progress bar (full-width under header) */}
              {travelOrder.status !== 'REJECTED' && travelOrder.status !== 'COMPLETED' && (
                <div style={{ marginBottom: 28 }}>
                  <div className="od-prog-track" style={{ height: 4 }}>
                    <div className="od-prog-fill" style={{ width: `${progressPct}%` }} />
                  </div>
                </div>
              )}

              {/* Rejection banner */}
              {travelOrder.status === 'REJECTED' && travelOrder.rejectionReason && (
                <div className="od-rejection-banner">
                  <div className="od-rejection-icon">
                    <XCircle size={15} color="#dc2626" />
                  </div>
                  <div>
                    <p style={{ fontWeight: 600, color: '#991b1b', margin: '0 0 3px', fontSize: 13 }}>
                      Travel Request Rejected
                    </p>
                    <p style={{ color: '#b91c1c', fontSize: 12.5, margin: 0 }}>
                      {travelOrder.rejectionReason}
                    </p>
                  </div>
                </div>
              )}

              {/* Steps */}
              {travelOrder.approvals.map((approval, idx) => (
                <ApprovalStep
                  key={approval.id}
                  index={idx}
                  role={approval.approverRole}
                  title={roleTitles[approval.approverRole] || approval.approverRole}
                  status={approval.status}
                  approver={approval.approver}
                  placeSigned={approval.placeSigned}
                  signedAt={approval.updatedAt}
                  signatureData={approval.signatureData}
                  comment={approval.comment}
                  isLast={idx === travelOrder.approvals.length - 1 && travelOrder.status !== 'HR_PROCESSING' && travelOrder.status !== 'COMPLETED'}
                />
              ))}

              {/* HR Processing step */}
              {travelOrder.status === 'HR_PROCESSING' && (
                <div className="od-special-step" style={{ marginTop: 8 }}>
                  <div className="od-special-dot" style={{ background: '#f3e8ff', border: '2px solid #8b5cf6', boxShadow: '0 0 0 4px rgba(139,92,246,0.1)' }}>
                    <Clock size={16} color="#8b5cf6" />
                  </div>
                  <div className="od-special-card" style={{ borderColor: '#e9d5ff', background: '#faf5ff' }}>
                    <p style={{ fontWeight: 600, color: '#6d28d9', margin: '0 0 4px', fontSize: 13 }}>HR Processing</p>
                    <p style={{ color: '#7c3aed', fontSize: 12.5, margin: 0 }}>
                      This travel order is awaiting HR processing. A travel number will be assigned.
                    </p>
                  </div>
                </div>
              )}

              {/* Completed step */}
              {travelOrder.status === 'COMPLETED' && travelOrder.travelOrderNumber && (
                <div className="od-special-step" style={{ marginTop: 8 }}>
                  <div className="od-special-dot" style={{ background: '#ecfdf5', border: '2px solid #10b981', boxShadow: '0 0 0 4px rgba(16,185,129,0.1)' }}>
                    <CheckCircle size={16} color="#10b981" />
                  </div>
                  <div className="od-special-card" style={{ borderColor: '#a7f3d0', background: '#f0fdf4' }}>
                    <p style={{ fontWeight: 600, color: '#065f46', margin: '0 0 4px', fontSize: 13 }}>Completed</p>
                    <p style={{ color: '#047857', fontSize: 12.5, margin: 0 }}>
                      Travel Order Number:{' '}
                      <span style={{ fontFamily: "'DM Mono', monospace", fontWeight: 700, color: '#059669', letterSpacing: '0.06em' }}>
                        {travelOrder.travelOrderNumber}
                      </span>
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ── Documents ── */}
          <div className="od-doc-section">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 30, height: 30, borderRadius: 8,
                background: '#ecfdf5',
                border: '1px solid #a7f3d0',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <FileText size={14} color="#059669" />
              </div>
              <h2 style={{ fontSize: 14, fontWeight: 600, color: '#0f172a', margin: 0 }}>
                Supporting Documents
              </h2>
            </div>

            {/* Travel Order Form */}
            <div className="od-doc-card">
              <div className="od-doc-label">
                <FileText size={12} />
                Travel Order Form
                <span>DOC 01</span>
              </div>
              <div className="od-doc-paper">
                <TravelOrderDocument data={travelOrder} />
              </div>
            </div>

            {travelOrder.employmentStatus !== 'PERMANENT' && (
              <>
                {/* Proposed Itinerary */}
                <div className="od-doc-card">
                  <div className="od-doc-label">
                    <FileText size={12} />
                    Proposed Itinerary
                    <span>DOC 02</span>
                  </div>
                  <div className="od-doc-paper">
                    <ProposedItineraryDocument data={travelOrder} />
                  </div>
                </div>

                <div className="od-doc-card">
                  <div className="od-doc-label">
                    <FileText size={12} />
                    Certification Document
                    <span>DOC 03</span>
                  </div>
                  <div className="od-doc-paper">
                    <CertificationDocument data={travelOrder} />
                  </div>
                </div>
              </>
            )}
          </div>

        </div>
      </div>
    </>
  )
}