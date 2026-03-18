'use client'

import { useState } from 'react'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { 
  CalendarDays, 
  MapPin, 
  Clock, 
  Plane, 
  ChevronRight 
} from 'lucide-react'
import { format, isSameDay, isAfter, startOfToday } from 'date-fns'
import { cn } from '@/lib/utils'


const travelEvents = [
  {
    id: 'TO-2026-012',
    title: 'Field Inspection',
    destination: 'Palawan',
    location: 'Puerto Princesa',
    date: new Date(2026, 2, 15), // March 15, 2026
    status: 'Approved',
  },
  {
    id: 'TO-2026-011',
    title: 'Rice Technology Training',
    destination: 'Oriental Mindoro',
    location: 'DA Victoria',
    date: new Date(2026, 2, 18),
    status: 'Approved',
  },
  {
    id: 'TO-2026-010',
    title: 'Coordination Meeting',
    destination: 'Marinduque',
    location: 'Boac',
    date: new Date(2026, 2, 22),
    status: 'Pending',
  },
  {
    id: 'TO-2026-009',
    title: 'Monitoring & Evaluation',
    destination: 'Romblon',
    location: 'Odiongan',
    date: new Date(2026, 2, 25),
    status: 'Approved',
  },
  {
    id: 'TO-2026-008',
    title: 'Fisheries Seminar',
    destination: 'Occidental Mindoro',
    location: 'San Jose',
    date: new Date(2026, 2, 28),
    status: 'Approved',
  },
  {
    id: 'TO-2026-007',
    title: 'Pest Control Training',
    destination: 'Palawan',
    location: 'Roxas',
    date: new Date(2026, 3, 2), // April 2
    status: 'Draft',
  },
]

// Helper to get events for a specific day
const getEventsForDay = (day: Date) => {
  return travelEvents.filter((event) => isSameDay(event.date, day))
}

// Helper to get upcoming travels (next 5 days from today)
const getUpcomingTravels = () => {
  const today = startOfToday()
  return travelEvents
    .filter((event) => isAfter(event.date, today))
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(0, 5)
}

export function TravelCalendar() {
  const [selectedDay, setSelectedDay] = useState<Date | undefined>(new Date())
  const eventsForSelectedDay = selectedDay ? getEventsForDay(selectedDay) : []
  const upcomingTravels = getUpcomingTravels()

  // Create a set of dates that have events (for modifiers)
  const eventDates = travelEvents.map((e) => e.date)

  return (
    <Card className="w-full shadow-lg border-0 overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-emerald-700 to-emerald-600 text-white p-6">
        <CardTitle className="flex items-center gap-3 text-xl">
          <CalendarDays className="h-6 w-6" />
          Travel Calendar
        </CardTitle>
        <p className="text-emerald-100 text-sm mt-1">
          Your scheduled travels and official trips
        </p>
      </CardHeader>

      <CardContent className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar Column */}
          <div className="lg:col-span-2 space-y-4">
            <Calendar
              mode="single"
              selected={selectedDay}
              onSelect={setSelectedDay}
              modifiers={{
                event: eventDates,
              }}
              modifiersClassNames={{
                event: 'relative after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-1 after:h-1 after:bg-emerald-500 after:rounded-full font-semibold text-emerald-700',
              }}
              className="rounded-lg border-0 shadow-sm bg-white p-3"
              classNames={{
                months: 'flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0',
                month: 'space-y-4 w-full',
                caption: 'flex justify-center pt-1 relative items-center',
                caption_label: 'text-sm font-medium text-gray-900',
                nav: 'space-x-1 flex items-center',
                nav_button: 'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 hover:bg-emerald-50 rounded-md transition-colors',
                nav_button_previous: 'absolute left-1',
                nav_button_next: 'absolute right-1',
                table: 'w-full border-collapse space-y-1',
                head_row: 'flex w-full',
                head_cell: 'text-gray-500 rounded-md w-9 font-normal text-[0.8rem] uppercase tracking-wider',
                row: 'flex w-full mt-2',
                cell: 'text-center text-sm relative p-0 [&:has([aria-selected])]:bg-emerald-50 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20',
                day: 'h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-emerald-100 hover:text-emerald-900 rounded-full transition-all',
                day_selected: 'bg-emerald-600 text-white hover:bg-emerald-600 hover:text-white focus:bg-emerald-600 focus:text-white rounded-full',
                day_today: 'bg-amber-50 text-amber-900 font-semibold border border-amber-200',
                day_outside: 'text-gray-300 opacity-50',
                day_disabled: 'text-gray-300 opacity-50',
                day_range_middle: 'aria-selected:bg-emerald-50 aria-selected:text-emerald-900',
                day_hidden: 'invisible',
              }}
            />
            
            {/* Mini Legend */}
            <div className="flex items-center gap-4 text-xs text-gray-600 bg-gray-50 p-2 rounded-lg">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                <span>Has travel</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-amber-100 border border-amber-300 rounded-full"></div>
                <span>Today</span>
              </div>
            </div>
          </div>

          {/* Sidebar: Upcoming & Selected Day Details */}
          <div className="space-y-6">
            {/* Upcoming travels */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <Plane className="h-4 w-4 text-emerald-600" />
                Upcoming travels
              </h4>
              <ScrollArea className="h-40 pr-3">
                <div className="space-y-2">
                  {upcomingTravels.map((travel) => (
                    <div
                      key={travel.id}
                      className="flex items-start gap-2 p-2 rounded-lg hover:bg-emerald-50 transition-colors cursor-pointer"
                      onClick={() => setSelectedDay(travel.date)}
                    >
                      <div className="w-1 h-full min-h-[40px] bg-emerald-400 rounded-full" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{travel.title}</p>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <MapPin className="h-3 w-3" />
                          <span className="truncate">{travel.destination}</span>
                        </div>
                        <p className="text-xs text-gray-400">
                          {format(travel.date, 'MMM d, yyyy')}
                        </p>
                      </div>
                      <Badge
                        variant="outline"
                        className={cn(
                          'shrink-0 text-[10px] px-1.5 py-0',
                          travel.status === 'Approved' && 'border-green-200 bg-green-50 text-green-700',
                          travel.status === 'Pending' && 'border-yellow-200 bg-yellow-50 text-yellow-700',
                          travel.status === 'Draft' && 'border-gray-200 bg-gray-50 text-gray-600'
                        )}
                      >
                        {travel.status}
                      </Badge>
                    </div>
                  ))}
                  {upcomingTravels.length === 0 && (
                    <p className="text-sm text-gray-400 text-center py-4">No upcoming travels</p>
                  )}
                </div>
              </ScrollArea>
            </div>

            <Separator />

            {/* Selected day details */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <Clock className="h-4 w-4 text-emerald-600" />
                {selectedDay ? format(selectedDay, 'MMMM d, yyyy') : 'Select a day'}
              </h4>
              {eventsForSelectedDay.length > 0 ? (
                <ScrollArea className="h-40 pr-3">
                  <div className="space-y-3">
                    {eventsForSelectedDay.map((event) => (
                      <div key={event.id} className="border-l-2 border-emerald-400 pl-3">
                        <p className="text-sm font-medium">{event.title}</p>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                          <MapPin className="h-3 w-3" />
                          <span>
                            {event.location}, {event.destination}
                          </span>
                        </div>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-xs text-gray-400">{event.id}</span>
                          <Badge
                            variant="outline"
                            className={cn(
                              'text-[10px] px-1.5 py-0',
                              event.status === 'Approved' && 'border-green-200 bg-green-50 text-green-700',
                              event.status === 'Pending' && 'border-yellow-200 bg-yellow-50 text-yellow-700',
                              event.status === 'Draft' && 'border-gray-200 bg-gray-50 text-gray-600'
                            )}
                          >
                            {event.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              ) : (
                <div className="flex flex-col items-center justify-center h-32 text-center">
                  <CalendarDays className="h-8 w-8 text-gray-300 mb-2" />
                  <p className="text-sm text-gray-400">No travels scheduled</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}