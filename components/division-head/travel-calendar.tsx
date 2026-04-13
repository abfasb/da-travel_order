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
import { CalendarIcon, MapPin, User, Briefcase, FileText, ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Calendar as CalendarPicker } from '@/components/ui/calendar'
import { cn } from '@/lib/utils'

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

// Custom Toolbar Component
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
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" className="font-semibold text-base">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {formattedDate}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <CalendarPicker
              mode="single"
              selected={date}
              onSelect={(newDate) => newDate && onNavigate('DATE', newDate)}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex items-center gap-3">
        {/* Status Legend */}
        <div className="hidden lg:flex items-center gap-2 mr-2">
          {Object.entries(statusLabels).slice(0, 4).map(([key, label]) => (
            <div key={key} className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: statusColors[key] }} />
              <span className="text-xs text-muted-foreground">{label}</span>
            </div>
          ))}
        </div>

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

export function TravelCalendar({ orders }: { orders: TravelOrder[] }) {
  const [view, setView] = useState<View>(Views.MONTH)
  const [date, setDate] = useState<Date>(new Date())
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const events: CalendarEvent[] = useMemo(() => {
    return orders.map(order => ({
      id: order.id,
      title: `${order.user.firstName} ${order.user.lastName} • ${order.destinationProvince}`,
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
        boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
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
          background: hsl(var(--background));
          color: hsl(var(--foreground));
        }
        .rbc-header {
          padding: 12px 4px;
          font-weight: 600;
          font-size: 12px;
          color: hsl(var(--muted-foreground));
          border-bottom: 1px solid hsl(var(--border));
          background: hsl(var(--muted));
          text-transform: uppercase;
          letter-spacing: 0.03em;
        }
        .rbc-month-view,
        .rbc-time-view {
          border: 1px solid hsl(var(--border));
          border-radius: 8px;
          overflow: hidden;
        }
        .rbc-month-row {
          border: none;
          border-bottom: 1px solid hsl(var(--border));
        }
        .rbc-day-bg {
          border-right: 1px solid hsl(var(--border));
        }
        .rbc-today {
          background-color: hsl(var(--accent)) !important;
        }
        .rbc-off-range-bg {
          background: hsl(var(--muted) / 0.5);
        }
        .rbc-event {
          border-radius: 4px !important;
          transition: all 0.15s;
        }
        .rbc-event:hover {
          opacity: 0.9;
          filter: brightness(1.05);
        }
        .rbc-toolbar {
          margin-bottom: 0;
        }
        .rbc-agenda-view table {
          border: 1px solid hsl(var(--border));
          border-radius: 8px;
          overflow: hidden;
        }
        .rbc-agenda-view table thead > tr > th {
          background: hsl(var(--muted));
          font-weight: 600;
          color: hsl(var(--muted-foreground));
          padding: 12px 16px;
          border-bottom: 1px solid hsl(var(--border));
        }
        .rbc-agenda-view table tbody > tr > td {
          padding: 10px 16px;
          border-bottom: 1px solid hsl(var(--border));
        }
        .rbc-agenda-view table tbody > tr:hover {
          background: hsl(var(--muted) / 0.5);
        }
        .rbc-show-more {
          color: hsl(var(--primary));
          font-weight: 500;
          font-size: 11px;
        }
        .rbc-show-more:hover {
          color: hsl(var(--primary) / 0.8);
        }

        /* Toolbar button overrides */
        .rbc-toolbar button {
          color: hsl(var(--foreground));
          background: hsl(var(--background));
          border: 1px solid hsl(var(--border));
        }
        .rbc-toolbar button:hover {
          background: hsl(var(--muted));
        }
        .rbc-toolbar button.rbc-active {
          background: hsl(var(--primary));
          border-color: hsl(var(--primary));
          color: hsl(var(--primary-foreground));
        }
        .rbc-toolbar button.rbc-active:hover {
          background: hsl(var(--primary) / 0.9);
        }
      `}</style>

      <div className="h-[750px] p-4">
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
            Travel Order
            {getStatusBadge()}
          </DialogTitle>
          <DialogDescription className="flex items-center gap-2">
            <span className="font-mono">{order.travelOrderNumber || 'Draft'}</span>
            <span>•</span>
            <span>Created {format(new Date(order.createdAt), 'PP')}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="flex items-start gap-3">
            <div className="p-1.5 rounded-lg bg-muted">
              <User className="h-4 w-4 text-muted-foreground" />
            </div>
            <div>
              <p className="font-medium text-foreground">
                {order.user.firstName} {order.user.lastName}
              </p>
              <p className="text-sm text-muted-foreground">{order.user.employmentStatus}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-1.5 rounded-lg bg-muted">
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </div>
            <div>
              <p className="font-medium text-foreground">{order.destinationProvince}</p>
              <p className="text-sm text-muted-foreground">{order.specificLocation}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-1.5 rounded-lg bg-muted">
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium w-20 text-foreground">Departure</span>
                <span className="text-sm text-muted-foreground">{format(new Date(order.departureDate), 'PPP')}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium w-20 text-foreground">Return</span>
                <span className="text-sm text-muted-foreground">{format(new Date(order.returnDate), 'PPP')}</span>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-1.5 rounded-lg bg-muted">
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </div>
            <div>
              <p className="font-medium text-sm text-foreground">Purpose</p>
              <p className="text-sm text-muted-foreground">{order.purpose}</p>
            </div>
          </div>

{ /* @ts-ignore */}
          {order.objectives && (
            <div className="flex items-start gap-3">
              <div className="p-1.5 rounded-lg bg-muted">
                <FileText className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <p className="font-medium text-sm text-foreground">Objectives</p>
{ /* @ts-ignore */}
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{order.objectives}</p>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button asChild>
            <Link href={`/division-head/travel-orders/${order.id}`}>
              View Full Details
            </Link>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}