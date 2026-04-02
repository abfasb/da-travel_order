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

/* ─── Status config ─────────────────────────────────────── */
const getStatusConfig = (status: string) => {
  const configs: Record<string, { color: string; dot: string; label: string; glow: string }> = {
    PENDING:        { color: '#b45309', dot: '#f59e0b', label: 'Pending',        glow: 'rgba(245,158,11,0.18)' },
    APPROVED:       { color: '#065f46', dot: '#10b981', label: 'Approved',       glow: 'rgba(16,185,129,0.18)' },
    REJECTED:       { color: '#991b1b', dot: '#ef4444', label: 'Rejected',       glow: 'rgba(239,68,68,0.18)'  },
    HR_PROCESSING:  { color: '#5b21b6', dot: '#8b5cf6', label: 'HR Processing',  glow: 'rgba(139,92,246,0.18)' },
    COMPLETED:      { color: '#0f4c81', dot: '#3b82f6', label: 'Completed',      glow: 'rgba(59,130,246,0.18)' },
  }
  return configs[status] || configs['PENDING']
}

/* ─── Role display titles ───────────────────────────────── */
const roleTitles: Record<string, string> = {
  APCO:                  'Agricultural Program Coordinating Office',
  CHIEF_AGRICULTURIST:   'Chief Agriculturist – Regulatory Division',
  CHIEF_ADMINISTRATIVE:  'Chief Administrative Officer',
  REGIONAL_EXECUTIVE:    'Regional Executive Director',
}

/* ─── ApprovalStep ──────────────────────────────────────── */
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
      `}</style>

      <div className="step-card relative flex gap-5">
        {/* Timeline spine */}
        <div className="flex flex-col items-center" style={{ width: 40, flexShrink: 0 }}>
          <div style={{
            width: 38, height: 38,
            borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
            background: isApproved ? 'rgba(16,185,129,0.1)'
                       : isRejected ? 'rgba(239,68,68,0.1)'
                       : 'rgba(255,255,255,0.06)',
            border: `2px solid ${isApproved ? '#10b981' : isRejected ? '#ef4444' : 'rgba(255,255,255,0.15)'}`,
            boxShadow: isApproved ? '0 0 12px rgba(16,185,129,0.2)'
                      : isRejected ? '0 0 12px rgba(239,68,68,0.2)' : 'none',
            zIndex: 1, position: 'relative',
          }}>
            {isApproved && <CheckCircle size={16} color="#10b981" />}
            {isRejected && <XCircle    size={16} color="#ef4444" />}
            {isPending  && <Clock      size={16} color="#94a3b8" />}
          </div>
          {!isLast && (
            <div style={{
              width: 2, flex: 1, marginTop: 4,
              background: isApproved
                ? 'linear-gradient(180deg, #10b981, rgba(16,185,129,0.1))'
                : 'rgba(255,255,255,0.08)',
              minHeight: 32,
            }} />
          )}
        </div>

        {/* Card */}
        <div style={{
          flex: 1, marginBottom: 20,
          borderRadius: 12,
          border: `1px solid ${isApproved ? 'rgba(16,185,129,0.2)' : isRejected ? 'rgba(239,68,68,0.2)' : 'rgba(255,255,255,0.08)'}`,
          background: isApproved ? 'rgba(16,185,129,0.04)'
                     : isRejected ? 'rgba(239,68,68,0.04)'
                     : 'rgba(255,255,255,0.03)',
          padding: '16px 18px',
          transition: 'box-shadow 0.2s ease',
        }}
        >
          {/* Row header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
            <div>
              <p style={{ fontWeight: 600, color: '#f1f5f9', fontSize: 13.5, margin: 0 }}>
                {role.replace(/_/g, ' ')}
              </p>
              <p style={{ color: 'rgba(255,255,255,0.38)', fontSize: 11.5, marginTop: 2 }}>{title}</p>
            </div>
            <span style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 10, fontWeight: 500,
              padding: '3px 8px', borderRadius: 5,
              letterSpacing: '0.06em',
              background: isApproved ? 'rgba(16,185,129,0.1)'
                         : isRejected ? 'rgba(239,68,68,0.1)' : 'rgba(245,158,11,0.1)',
              color: isApproved ? '#34d399' : isRejected ? '#f87171' : '#fbbf24',
              border: `1px solid ${isApproved ? 'rgba(52,211,153,0.25)' : isRejected ? 'rgba(248,113,113,0.25)' : 'rgba(251,191,36,0.25)'}`,
            }}>
              {status}
            </span>
          </div>

          {/* Approved details */}
          {isApproved && approver && (
            <div style={{
              marginTop: 14, paddingTop: 14,
              borderTop: '1px solid rgba(255,255,255,0.07)',
              display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
              gap: '10px 24px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <UserCheck size={13} color="#4ade80" />
                <span style={{ fontSize: 12.5, color: '#cbd5e1', fontWeight: 500 }}>
                  {approver.firstName} {approver.lastName}
                </span>
              </div>
              {placeSigned && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                  <MapPin size={13} color="#4ade80" />
                  <span style={{ fontSize: 12.5, color: '#94a3b8' }}>{placeSigned}</span>
                </div>
              )}
              {signedAt && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                  <CalendarDays size={13} color="#4ade80" />
                  <span style={{ fontSize: 12.5, color: '#94a3b8' }}>
                    {new Date(signedAt).toLocaleString()}
                  </span>
                </div>
              )}
              {signatureData && (
                <div style={{ gridColumn: '1/-1', marginTop: 4 }}>
                  <p style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.3)', marginBottom: 6, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                    Digital Signature
                  </p>
                  <img
                    src={signatureData}
                    alt="Signature"
                    style={{
                      height: 44, objectFit: 'contain',
                      background: 'rgba(255,255,255,0.96)',
                      borderRadius: 6, padding: '4px 12px',
                      border: '1px solid rgba(255,255,255,0.15)',
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
              borderTop: '1px solid rgba(255,255,255,0.07)',
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <span style={{
                width: 6, height: 6, borderRadius: '50%',
                background: '#f59e0b',
                boxShadow: '0 0 0 3px rgba(245,158,11,0.25)',
                animation: 'pulse 2s ease-in-out infinite',
                flexShrink: 0,
                display: 'inline-block',
              }} />
              <span style={{ fontSize: 12, color: '#fbbf24' }}>Awaiting approval from this officer</span>
            </div>
          )}

          {/* Rejected comment */}
          {isRejected && comment && (
            <div style={{
              marginTop: 12, paddingTop: 12,
              borderTop: '1px solid rgba(255,255,255,0.07)',
            }}>
              <span style={{ fontSize: 12, color: '#fca5a5' }}>
                <strong style={{ color: '#f87171' }}>Reason: </strong>{comment}
              </span>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

/* ─── Page ──────────────────────────────────────────────── */
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
        @keyframes pulse {
          0%,100% { opacity: 1; } 50% { opacity: 0.4; }
        }
        @keyframes progressFill {
          from { width: 0; }
          to   { width: ${progressPct}%; }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }

        .od-root {
          font-family: 'DM Sans', sans-serif;
          min-height: 100vh;
          background: #080a10;
          color: #f1f5f9;
        }

        /* ── sticky header ── */
        .od-header {
          position: sticky; top: 0; z-index: 50;
          background: rgba(8,10,16,0.85);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-bottom: 1px solid rgba(255,255,255,0.07);
        }
        .od-header::after {
          content: '';
          position: absolute; bottom: 0; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, transparent, #4ade80 30%, #16a34a 60%, transparent);
          opacity: 0.5;
        }
        .od-header-inner {
          max-width: 1200px; margin: 0 auto;
          padding: 16px 28px;
          display: flex; align-items: center; gap: 16px;
        }
        .od-back-btn {
          width: 36px; height: 36px; border-radius: 9px;
          border: 1px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.04);
          color: rgba(255,255,255,0.5);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; text-decoration: none;
          transition: all 0.15s ease;
          flex-shrink: 0;
        }
        .od-back-btn:hover { background: rgba(255,255,255,0.09); color: #f1f5f9; border-color: rgba(255,255,255,0.2); }

        .od-header-meta { flex: 1; min-width: 0; }
        .od-header-row  { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
        .od-title {
          font-size: 18px; font-weight: 700; color: #f1f5f9;
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
          animation: pulse 2s ease-in-out infinite;
        }
        .od-ref {
          margin-top: 4px;
          font-size: 12.5px; color: rgba(255,255,255,0.35);
          display: flex; align-items: center; gap: 6px;
        }
        .od-ref-val {
          font-family: 'DM Mono', monospace;
          font-size: 11.5px; font-weight: 500;
          color: #4ade80;
          background: rgba(74,222,128,0.08);
          border: 1px solid rgba(74,222,128,0.18);
          border-radius: 5px; padding: 1px 7px;
          letter-spacing: 0.06em;
        }

        /* ── page body ── */
        .od-body {
          max-width: 1200px; margin: 0 auto;
          padding: 36px 28px 80px;
          display: flex; flex-direction: column; gap: 32px;
        }

        /* ── section card ── */
        .od-card {
          border-radius: 16px;
          border: 1px solid rgba(255,255,255,0.07);
          background: rgba(255,255,255,0.025);
          overflow: hidden;
          animation: fadeUp 0.45s ease both;
        }
        .od-card:nth-child(1) { animation-delay: 0ms; }
        .od-card:nth-child(2) { animation-delay: 80ms; }
        .od-card:nth-child(3) { animation-delay: 160ms; }

        .od-card-head {
          padding: 20px 24px 18px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          display: flex; align-items: center; justify-content: space-between;
          background: rgba(255,255,255,0.02);
        }
        .od-card-title {
          display: flex; align-items: center; gap: 9px;
          font-size: 14px; font-weight: 600; color: #f1f5f9;
          margin: 0;
        }
        .od-card-icon {
          width: 30px; height: 30px; border-radius: 8px;
          background: rgba(74,222,128,0.1);
          border: 1px solid rgba(74,222,128,0.2);
          display: flex; align-items: center; justify-content: center;
          color: #4ade80;
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
          background: rgba(255,255,255,0.07); overflow: hidden;
        }
        .od-prog-fill {
          height: 100%; border-radius: 99px;
          background: linear-gradient(90deg, #16a34a, #4ade80);
          animation: progressFill 1s cubic-bezier(.4,0,.2,1) both;
          animation-delay: 200ms;
          box-shadow: 0 0 10px rgba(74,222,128,0.4);
        }
        .od-prog-label {
          font-family: 'DM Mono', monospace;
          font-size: 11px; font-weight: 500;
          color: rgba(255,255,255,0.35);
          white-space: nowrap;
        }
        .od-prog-label strong { color: #4ade80; }

        /* ── rejection banner ── */
        .od-rejection-banner {
          margin-bottom: 24px;
          padding: 14px 18px;
          border-radius: 10px;
          border: 1px solid rgba(239,68,68,0.25);
          background: rgba(239,68,68,0.06);
          display: flex; align-items: flex-start; gap: 12px;
        }
        .od-rejection-icon {
          width: 30px; height: 30px; border-radius: 8px;
          background: rgba(239,68,68,0.12);
          border: 1px solid rgba(239,68,68,0.2);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }

        /* ── special step boxes ── */
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

        /* ── document wrappers ── */
        .od-doc-section {
          display: flex; flex-direction: column; gap: 28px;
        }
        .od-doc-card {
          border-radius: 16px;
          border: 1px solid rgba(255,255,255,0.07);
          background: #ffffff;
          overflow: hidden;
          box-shadow: 0 8px 40px rgba(0,0,0,0.4);
          animation: fadeUp 0.5s ease both;
        }
        .od-doc-card:nth-child(1) { animation-delay: 200ms; }
        .od-doc-card:nth-child(2) { animation-delay: 300ms; }
        .od-doc-card:nth-child(3) { animation-delay: 400ms; }
        .od-doc-label {
          display: flex; align-items: center; gap: 9px;
          padding: 12px 20px;
          background: rgba(255,255,255,0.02);
          border-bottom: 1px solid rgba(255,255,255,0.07);
          font-size: 11.5px; font-weight: 600;
          letter-spacing: 0.08em; text-transform: uppercase;
          color: rgba(255,255,255,0.35);
        }
        .od-doc-label span {
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          background: rgba(74,222,128,0.1); color: #4ade80;
          border: 1px solid rgba(74,222,128,0.2);
          border-radius: 4px; padding: 1px 6px;
          letter-spacing: 0.06em;
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
                    background: `${statusConfig.glow}`,
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
                    <XCircle size={15} color="#f87171" />
                  </div>
                  <div>
                    <p style={{ fontWeight: 600, color: '#fca5a5', margin: '0 0 3px', fontSize: 13 }}>
                      Travel Request Rejected
                    </p>
                    <p style={{ color: '#f87171', fontSize: 12.5, margin: 0 }}>
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
                  <div className="od-special-dot" style={{ background: 'rgba(139,92,246,0.12)', border: '2px solid #8b5cf6', boxShadow: '0 0 12px rgba(139,92,246,0.25)' }}>
                    <Clock size={16} color="#8b5cf6" />
                  </div>
                  <div className="od-special-card" style={{ borderColor: 'rgba(139,92,246,0.2)', background: 'rgba(139,92,246,0.05)' }}>
                    <p style={{ fontWeight: 600, color: '#c4b5fd', margin: '0 0 4px', fontSize: 13 }}>HR Processing</p>
                    <p style={{ color: '#a78bfa', fontSize: 12.5, margin: 0 }}>
                      This travel order is awaiting HR processing. A travel number will be assigned.
                    </p>
                  </div>
                </div>
              )}

              {/* Completed step */}
              {travelOrder.status === 'COMPLETED' && travelOrder.travelOrderNumber && (
                <div className="od-special-step" style={{ marginTop: 8 }}>
                  <div className="od-special-dot" style={{ background: 'rgba(16,185,129,0.12)', border: '2px solid #10b981', boxShadow: '0 0 12px rgba(16,185,129,0.25)' }}>
                    <CheckCircle size={16} color="#10b981" />
                  </div>
                  <div className="od-special-card" style={{ borderColor: 'rgba(16,185,129,0.2)', background: 'rgba(16,185,129,0.04)' }}>
                    <p style={{ fontWeight: 600, color: '#6ee7b7', margin: '0 0 4px', fontSize: 13 }}>Completed</p>
                    <p style={{ color: '#a7f3d0', fontSize: 12.5, margin: 0 }}>
                      Travel Order Number:{' '}
                      <span style={{ fontFamily: "'DM Mono', monospace", fontWeight: 700, color: '#4ade80', letterSpacing: '0.06em' }}>
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
                background: 'rgba(74,222,128,0.1)',
                border: '1px solid rgba(74,222,128,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <FileText size={14} color="#4ade80" />
              </div>
              <h2 style={{ fontSize: 14, fontWeight: 600, color: '#f1f5f9', margin: 0 }}>
                Supporting Documents
              </h2>
            </div>

            <div className="od-doc-card">
              <div className="od-doc-label">
                <FileText size={12} />
                Travel Order Form
                <span>DOC 01</span>
              </div>
              <TravelOrderDocument data={travelOrder} />
            </div>

            {travelOrder.employmentStatus !== 'PERMANENT' && (
              <>
                <div className="od-doc-card">
                  <div className="od-doc-label">
                    <FileText size={12} />
                    Proposed Itinerary
                    <span>DOC 02</span>
                  </div>
                  <ProposedItineraryDocument data={travelOrder} />
                </div>
                <div className="od-doc-card">
                  <div className="od-doc-label">
                    <FileText size={12} />
                    Certification Document
                    <span>DOC 03</span>
                  </div>
                  <CertificationDocument data={travelOrder} />
                </div>
              </>
            )}
          </div>

        </div>
      </div>
    </>
  )
}