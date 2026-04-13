'use client'

import { useState, useMemo, useCallback } from 'react'
import { format, parse, startOfWeek, getDay } from 'date-fns'
import { Calendar, dateFnsLocalizer, Views, Event, View } from 'react-big-calendar'
import { enUS } from 'date-fns/locale'
//@ts-ignore
import 'react-big-calendar/lib/css/react-big-calendar.css'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CalendarIcon, MapPin, Briefcase, FileText, Clock } from 'lucide-react'
import Link from 'next/link'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ChevronLeft, ChevronRight } from 'lucide-react'

// Localizer setup
const locales = { 'en-US': enUS }
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 0 }),
  getDay,
  locales,
})

interface TravelOrder {
  id: string
  travelOrderNumber: string | null
  purpose: string
  destinationProvince: string
  specificLocation: string
  departureDate: Date
  returnDate: Date
  status: string
  employmentStatus: string
  createdAt: Date
  user: {
    firstName: string
    lastName: string
    employmentStatus: string | null
  }
}

interface CalendarEvent extends Event {
  id: string
  title: string
  start: Date
  end: Date
  status: string
  order: TravelOrder
}

const statusColors: Record<string, string> = {
  PENDING: '#fbbf24',
  REVIEWING: '#60a5fa',
  APPROVED: '#34d399',
  REJECTED: '#f87171',
  HR_PROCESSING: '#a78bfa',
  COMPLETED: '#9ca3af',
}

const statusLabels: Record<string, string> = {
  PENDING: 'Pending',
  REVIEWING: 'Reviewing',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
  HR_PROCESSING: 'Processing',
  COMPLETED: 'Completed',
}

function CustomToolbar({ date, view, onNavigate, onView, views }: any) {
  const viewLabels: Record<string, string> = {
    month: 'Month',
    week: 'Week',
    day: 'Day',
    agenda: 'Agenda',
  }

  const handleToday = () => onNavigate('TODAY')
  const handlePrev = () => onNavigate('PREV')
  const handleNext = () => onNavigate('NEXT')

  const formattedDate = (() => {
    if (view === 'month') return format(date, 'MMMM yyyy')
    if (view === 'week') {
      const start = startOfWeek(date, { weekStartsOn: 0 })
      const end = new Date(start)
      end.setDate(end.getDate() + 6)
      return `${format(start, 'MMM d')} – ${format(end, 'MMM d, yyyy')}`
    }
    if (view === 'day') return format(date, 'EEEE, MMMM d, yyyy')
    return format(date, 'MMMM yyyy')
  })()

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 px-2">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={handleToday}>
          Today
        </Button>
        <div className="flex items-center">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handlePrev}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleNext}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <span className="font-semibold text-base ml-2">{formattedDate}</span>
      </div>

      <div className="flex items-center gap-3">
        <Select value={view} onValueChange={onView}>
          <SelectTrigger className="w-[120px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {views.map((v: string) => (
              <SelectItem key={v} value={v}>{viewLabels[v]}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

export function EmployeeTravelCalendar({ orders }: { orders: TravelOrder[] }) {
  const [view, setView] = useState<View>(Views.MONTH)
  const [date, setDate] = useState<Date>(new Date())
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const events: CalendarEvent[] = useMemo(() => {
    return orders.map(order => ({
      id: order.id,
      title: `${order.destinationProvince} - ${order.purpose.substring(0, 30)}`,
      start: new Date(order.departureDate),
      end: new Date(order.returnDate),
      status: order.status,
      order: order,
    }))
  }, [orders])

  const handleSelectEvent = useCallback((event: CalendarEvent) => {
    setSelectedEvent(event)
    setDialogOpen(true)
  }, [])

  const handleNavigate = useCallback((newDate: Date) => setDate(newDate), [])
  const handleView = useCallback((newView: View) => setView(newView), [])

  const eventStyleGetter = useCallback((event: CalendarEvent) => {
    const backgroundColor = statusColors[event.status] || '#6b7280'
    return {
      style: {
        backgroundColor,
        borderRadius: '4px',
        opacity: 0.95,
        color: '#fff',
        border: 'none',
        display: 'block',
        fontSize: '11px',
        fontWeight: 500,
        padding: '2px 4px',
      },
    }
  }, [])

  const components = useMemo(() => ({
    toolbar: (props: any) => <CustomToolbar {...props} />,
  }), [])

  return (
    <>
      <style jsx global>{`
        .rbc-calendar {
          font-family: 'Inter', sans-serif;
          background: white;
        }
        .rbc-header {
          padding: 12px 4px;
          font-weight: 600;
          font-size: 12px;
          color: #64748b;
          border-bottom: 1px solid #e2e8f0;
          background: #f8fafc;
        }
        .rbc-month-view,
        .rbc-time-view {
          border: none;
        }
        .rbc-month-row {
          border-bottom: 1px solid #f1f5f9;
        }
        .rbc-day-bg {
          border-right: 1px solid #f1f5f9;
        }
        .rbc-today {
          background-color: #f0fdf4 !important;
        }
        .rbc-off-range-bg {
          background: #fafafa;
        }
        .rbc-event {
          border-radius: 4px !important;
          transition: all 0.15s;
        }
        .rbc-event:hover {
          opacity: 0.9;
        }
        .rbc-show-more {
          color: #10b981;
          font-weight: 500;
          font-size: 11px;
        }
      `}</style>

      <div className="h-[700px] p-4">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: '100%' }}
          view={view}
          onView={handleView}
          date={date}
          onNavigate={handleNavigate}
          onSelectEvent={handleSelectEvent}
          eventPropGetter={eventStyleGetter}
          popup
          tooltipAccessor={(event: CalendarEvent) => `${event.title}\n${format(event.start, 'PPP')} – ${format(event.end, 'PPP')}`}
          views={[Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA]}
          components={components}
        />
      </div>

      <EventDetailsDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        event={selectedEvent}
      />
    </>
  )
}

function EventDetailsDialog({
  open,
  onOpenChange,
  event,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  event: CalendarEvent | null
}) {
  if (!event) return null

  const { order } = event

  const getStatusBadge = () => {
    const variants: Record<string, any> = {
      PENDING: 'secondary',
      REVIEWING: 'outline',
      APPROVED: 'default',
      REJECTED: 'destructive',
      HR_PROCESSING: 'secondary',
      COMPLETED: 'success',
    }
    const variant = variants[order.status] || 'secondary'
    const label = statusLabels[order.status] || order.status
    return <Badge variant={variant}>{label}</Badge>
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Travel Order Details
            {getStatusBadge()}
          </DialogTitle>
          <DialogDescription>
            {order.travelOrderNumber || 'Draft'} • Created {format(new Date(order.createdAt), 'PP')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="flex items-start gap-3">
            <MapPin className="h-4 w-4 text-slate-400 mt-0.5" />
            <div>
              <p className="font-medium">{order.destinationProvince}</p>
              <p className="text-sm text-slate-500">{order.specificLocation}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <CalendarIcon className="h-4 w-4 text-slate-400 mt-0.5" />
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium w-20">Departure</span>
                <span className="text-sm">{format(new Date(order.departureDate), 'PPP')}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium w-20">Return</span>
                <span className="text-sm">{format(new Date(order.returnDate), 'PPP')}</span>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Briefcase className="h-4 w-4 text-slate-400 mt-0.5" />
            <div>
              <p className="font-medium text-sm">Purpose</p>
              <p className="text-sm text-slate-600">{order.purpose}</p>
            </div>
          </div>

{/*@ts-ignore */}
          {order.objectives && (
            <div className="flex items-start gap-3">
              <FileText className="h-4 w-4 text-slate-400 mt-0.5" />
              <div>
                <p className="font-medium text-sm">Objectives</p>
{/*@ts-ignore */}

                <p className="text-sm text-slate-600 whitespace-pre-wrap">{order.objectives}</p>
              </div>
            </div>
          )}

          <div className="flex items-start gap-3">
            <Clock className="h-4 w-4 text-slate-400 mt-0.5" />
            <div>
              <p className="font-medium text-sm">Status</p>
              <p className="text-sm text-slate-600">{getStatusBadge()}</p>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button asChild>
            <Link href={`/employee/requests/${order.id}`}>
              View Full Details
            </Link>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}