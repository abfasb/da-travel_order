'use client'

import { useState } from 'react'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { CalendarDays, MapPin, Clock, Plane } from 'lucide-react'
import { format, isSameDay, isAfter, startOfToday } from 'date-fns'
import { cn } from '@/lib/utils'

interface CalendarEvent {
  id: string
  title: string
  destination: string
  location: string
  date: Date
  status: string
}

interface TravelCalendarProps {
  events: CalendarEvent[]
}

export function TravelCalendar({ events }: TravelCalendarProps) {
  const [selectedDay, setSelectedDay] = useState<Date | undefined>(new Date())
  const eventsForSelectedDay = selectedDay ? events.filter(e => isSameDay(e.date, selectedDay)) : []
  const upcomingTravels = events
    .filter(e => isAfter(e.date, startOfToday()))
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(0, 5)

  const eventDates = events.map(e => e.date)

  return (
    <Card className="w-full shadow-lg border-0 overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-emerald-700 to-emerald-600 dark:from-emerald-900 dark:to-emerald-800 text-white p-6">
        <CardTitle className="flex items-center gap-3 text-xl">
          <CalendarDays className="h-6 w-6" />
          Travel Calendar
        </CardTitle>
        <p className="text-emerald-100 dark:text-emerald-200 text-sm mt-1">Your scheduled travels and official trips</p>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <Calendar
              mode="single"
              selected={selectedDay}
              onSelect={setSelectedDay}
              modifiers={{ event: eventDates }}
              modifiersClassNames={{
                event: 'relative after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-1 after:h-1 after:bg-emerald-500 after:rounded-full font-semibold text-emerald-700 dark:text-emerald-400',
              }}
              className="rounded-lg border-0 shadow-sm bg-card p-3"
              classNames={{
                months: 'flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0',
                month: 'space-y-4 w-full',
                caption: 'flex justify-center pt-1 relative items-center',
                caption_label: 'text-sm font-medium text-foreground',
                nav: 'space-x-1 flex items-center',
                nav_button: 'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 hover:bg-muted rounded-md transition-colors',
                nav_button_previous: 'absolute left-1',
                nav_button_next: 'absolute right-1',
                table: 'w-full border-collapse space-y-1',
                head_row: 'flex w-full',
                head_cell: 'text-muted-foreground rounded-md w-9 font-normal text-[0.8rem] uppercase tracking-wider',
                row: 'flex w-full mt-2',
                cell: 'text-center text-sm relative p-0 [&:has([aria-selected])]:bg-emerald-100 dark:[&:has([aria-selected])]:bg-emerald-900/30 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20',
                day: 'h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-muted rounded-full transition-all',
                day_selected: 'bg-emerald-600 text-white hover:bg-emerald-600 hover:text-white focus:bg-emerald-600 focus:text-white rounded-full',
                day_today: 'bg-amber-100 dark:bg-amber-900/30 text-amber-900 dark:text-amber-300 font-semibold border border-amber-200 dark:border-amber-800',
                day_outside: 'text-muted-foreground/50',
                day_disabled: 'text-muted-foreground/50',
                day_range_middle: 'aria-selected:bg-emerald-100 dark:aria-selected:bg-emerald-900/30 aria-selected:text-emerald-900 dark:aria-selected:text-emerald-300',
                day_hidden: 'invisible',
              }}
            />
            <div className="flex items-center gap-4 text-xs text-muted-foreground bg-muted p-2 rounded-lg">
              <div className="flex items-center gap-1"><div className="w-3 h-3 bg-emerald-500 rounded-full"></div><span>Has travel</span></div>
              <div className="flex items-center gap-1"><div className="w-3 h-3 bg-amber-100 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 rounded-full"></div><span>Today</span></div>
            </div>
          </div>
          <div className="space-y-6">
            <div className="bg-card rounded-xl border border-border shadow-sm p-4">
              <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <Plane className="h-4 w-4 text-emerald-600 dark:text-emerald-400" /> Upcoming travels
              </h4>
              <ScrollArea className="h-40 pr-3">
                <div className="space-y-2">
                  {upcomingTravels.map((travel) => (
                    <div key={travel.id} className="flex items-start gap-2 p-2 rounded-lg hover:bg-muted transition-colors cursor-pointer" onClick={() => setSelectedDay(travel.date)}>
                      <div className="w-1 h-full min-h-[40px] bg-emerald-400 rounded-full" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate text-foreground">{travel.title}</p>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="h-3 w-3" /><span className="truncate">{travel.destination}</span></div>
                        <p className="text-xs text-muted-foreground">{format(travel.date, 'MMM d, yyyy')}</p>
                      </div>
                      <Badge variant="outline" className={cn('shrink-0 text-[10px] px-1.5 py-0',
                        travel.status === 'Approved' && 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400',
                        travel.status === 'Pending' && 'border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-950/30 text-yellow-700 dark:text-yellow-400'
                      )}>{travel.status}</Badge>
                    </div>
                  ))}
                  {upcomingTravels.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">No upcoming travels</p>}
                </div>
              </ScrollArea>
            </div>
            <Separator className="bg-border" />
            <div className="bg-card rounded-xl border border-border shadow-sm p-4">
              <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <Clock className="h-4 w-4 text-emerald-600 dark:text-emerald-400" /> {selectedDay ? format(selectedDay, 'MMMM d, yyyy') : 'Select a day'}
              </h4>
              {eventsForSelectedDay.length > 0 ? (
                <ScrollArea className="h-40 pr-3">
                  <div className="space-y-3">
                    {eventsForSelectedDay.map((event) => (
                      <div key={event.id} className="border-l-2 border-emerald-400 pl-3">
                        <p className="text-sm font-medium text-foreground">{event.title}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1"><MapPin className="h-3 w-3" /><span>{event.location}, {event.destination}</span></div>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-xs text-muted-foreground">{event.id}</span>
                          <Badge variant="outline" className={cn('text-[10px] px-1.5 py-0',
                            event.status === 'Approved' && 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400',
                            event.status === 'Pending' && 'border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-950/30 text-yellow-700 dark:text-yellow-400'
                          )}>{event.status}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              ) : (
                <div className="flex flex-col items-center justify-center h-32 text-center">
                  <CalendarDays className="h-8 w-8 text-muted-foreground/50 mb-2" />
                  <p className="text-sm text-muted-foreground">No travels scheduled</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}