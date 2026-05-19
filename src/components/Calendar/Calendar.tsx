import React, { useState, useEffect, useRef } from 'react'
import { EVENTS_SETTINGS } from '../../config'
import { HiMapPin } from 'react-icons/hi2'

export interface CalendarEvent {
  id: string
  title: string
  description: string
  start: Date
  end: Date
  location?: string
  mapsUrl?: string
}

export interface CalendarProps {
  /** any date in the month you want to render */
  month?: Date
  events?: CalendarEvent[]
  googleCalendarUrl?: string
}

// Curated brand-aligned palette for event pills
const BRAND_PILL_CLASSES = [
  'bg-[#3D6B57]',  // forest green
  'bg-[#B25B36]',  // terracotta
  'bg-[#88B2A0]',  // sage
  'bg-[#7A5C3A]',  // warm brown
  'bg-[#5C4033]',  // dark umber
  'bg-[#4A7A5A]',  // medium green
  'bg-[#C4814F]',  // light terracotta
]

const generateCalendarGrid = (year: number, month: number): Date[][] => {
  const firstOfMonth = new Date(year, month, 1)
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const startWeekday = firstOfMonth.getDay()

  const dates: Date[] = []
  for (let i = startWeekday - 1; i >= 0; i--) {
    dates.push(new Date(year, month, -i))
  }
  for (let d = 1; d <= daysInMonth; d++) {
    dates.push(new Date(year, month, d))
  }
  while (dates.length % 7 !== 0) {
    const idx = dates.length - (startWeekday + daysInMonth)
    dates.push(new Date(year, month + 1, idx + 1))
  }

  const weeks: Date[][] = []
  for (let i = 0; i < dates.length; i += 7) {
    weeks.push(dates.slice(i, i + 7))
  }
  return weeks
}

const formatMonthYear = (d: Date) =>
  d.toLocaleString('default', { month: 'long', year: 'numeric' })

const formatDateKey = (d: Date) =>
  `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`

const eventsForDate = (events: CalendarEvent[], date: Date) =>
  events.filter(
    (e) =>
      e.start.getFullYear() === date.getFullYear() &&
      e.start.getMonth() === date.getMonth() &&
      e.start.getDate() === date.getDate()
  )

const formatDateLabel = (d: Date) =>
  d.toLocaleDateString('default', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })

export const Calendar: React.FC<CalendarProps> = ({
  month: propMonth,
  events: propEvents,
  googleCalendarUrl = null,
}) => {
  const now = new Date()
  const defaultMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const month = propMonth || defaultMonth

  // Show empty state when no events provided
  const events: CalendarEvent[] = propEvents || []

  const sorted = [...events].sort((a, b) => a.start.getTime() - b.start.getTime())
  const pillColorMap: Record<string, string> = {}
  sorted.forEach((ev, i) => {
    pillColorMap[ev.id] = BRAND_PILL_CLASSES[i % BRAND_PILL_CLASSES.length]
  })

  const [selectedDateKey, setSelectedDateKey] = useState<string | null>(null)
  const modalRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  const year = month.getFullYear()
  const mIndex = month.getMonth()
  const weeks = generateCalendarGrid(year, mIndex)

  const handleCellClick = (date: Date, dayEvents: CalendarEvent[]) => {
    if (dayEvents.length) setSelectedDateKey(formatDateKey(date))
  }
  const closeModal = () => setSelectedDateKey(null)

  const selectedEvents = selectedDateKey
    ? events.filter((ev) => formatDateKey(ev.start) === selectedDateKey)
    : []

  // Focus trap for modal
  useEffect(() => {
    if (selectedDateKey && closeButtonRef.current) {
      closeButtonRef.current.focus()
    }
  }, [selectedDateKey])

  // Close modal on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedDateKey) {
        closeModal()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [selectedDateKey])

  const modalLabelId = 'calendar-modal-title'

  return (
    <section
      aria-label="Events Calendar"
      className="relative bg-[var(--color-paper)] w-full"
    >
      {/* Decorative backgrounds using brand cream variants */}
      <div className="bg-[var(--color-parchment)] w-full sm:w-40 h-40 rounded-full absolute top-1 max-sm:right-0 sm:left-56 opacity-30 z-0" />
      <div className="bg-[var(--color-stone)]/20 w-full sm:w-40 h-24 absolute top-0 left-0 opacity-30 z-0" />
      <div className="bg-[var(--color-parchment)] w-full sm:w-40 h-24 absolute top-40 left-0 opacity-20 z-0" />

      <div className="w-full py-24 relative z-10 backdrop-blur-3xl">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-12 gap-8">
            {/* Upcoming events list */}
            <div className="col-span-12 xl:col-span-5">
              <h2 className="type-heading-sm text-[var(--color-charcoal)] mb-4">Upcoming Events</h2>
              {sorted.length === 0 ? (
                <p className="type-body-md text-[var(--color-charcoal)]/70">No upcoming events scheduled.</p>
              ) : (
                <div className="space-y-4">
                  {sorted.map((ev) => (
                    <div key={ev.id} className="card p-4">
                      <div className="flex items-center mb-2 gap-2">
                        <span className={`w-3 h-3 rounded-full flex-shrink-0 ${pillColorMap[ev.id]}`} aria-hidden="true" />
                        <p className="type-body-xs text-[var(--color-charcoal)]">
                          <time dateTime={ev.start.toISOString()}>
                            {ev.start.toLocaleString()}
                          </time>
                          {' – '}
                          <time dateTime={ev.end.toISOString()}>
                            {ev.end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </time>
                        </p>
                      </div>
                      <h3 className="type-heading-xs">{ev.title}</h3>
                      <p className="type-body-sm text-[var(--color-charcoal)]/70 mb-2">{ev.description}</p>
                      {ev.location && ev.mapsUrl && (
                        <p className="type-body-sm flex items-center gap-1">
                          <HiMapPin aria-hidden="true" className="w-4 h-4 text-[var(--color-terracotta)] flex-shrink-0" />
                          <a
                            href={ev.mapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline text-[var(--color-terracotta)] hover:text-[var(--color-terracotta-dark)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-forest)] rounded-sm"
                          >
                            {ev.location}
                          </a>
                        </p>
                      )}
                      {ev.location && !ev.mapsUrl && (
                        <p className="type-body-sm flex items-center gap-1 text-[var(--color-charcoal)]/70">
                          <HiMapPin aria-hidden="true" className="w-4 h-4 flex-shrink-0" />
                          {ev.location}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Calendar grid */}
            <div className="col-span-12 xl:col-span-7">
              <h2 className="type-heading-xs text-[var(--color-charcoal)] mb-4">{formatMonthYear(month)}</h2>
              <div className="grid grid-cols-7 border border-[var(--color-stone)]/30 rounded-xl overflow-hidden">
                {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map((wd) => (
                  <div key={wd} className="py-2 bg-[var(--color-forest)] text-[var(--color-paper)] text-center type-body-xs font-medium">
                    {wd}
                  </div>
                ))}
                {weeks.flat().map((date, idx) => {
                  const inMonth = date.getMonth() === mIndex
                  const dayEvents = eventsForDate(events, date)
                  const dateKey = formatDateKey(date)
                  return (
                    <div
                      key={idx}
                      onClick={() => handleCellClick(date, dayEvents)}
                      role={dayEvents.length ? 'button' : undefined}
                      tabIndex={dayEvents.length ? 0 : undefined}
                      aria-label={dayEvents.length ? `${formatDateLabel(date)}, ${dayEvents.length} event${dayEvents.length > 1 ? 's' : ''}` : undefined}
                      onKeyDown={(e) => {
                        if (dayEvents.length && (e.key === 'Enter' || e.key === ' ')) {
                          e.preventDefault()
                          handleCellClick(date, dayEvents)
                        }
                      }}
                      className={[
                        'p-2 min-h-[80px] relative border-t border-l border-[var(--color-stone)]/30',
                        inMonth ? 'bg-white' : 'bg-[var(--color-parchment)]/40',
                        dayEvents.length ? 'cursor-pointer hover:bg-[var(--color-parchment)] focus-visible:outline-2 focus-visible:outline-[var(--color-forest)]' : '',
                      ].join(' ')}
                    >
                      <span className={`${inMonth ? 'text-[var(--color-charcoal)]' : 'text-[var(--color-charcoal)]/40'} text-xs font-semibold`}>
                        {date.getDate()}
                      </span>
                      <div className="mt-1 space-y-1">
                        {dayEvents.map((ev) => (
                          <span
                            key={ev.id}
                            className={`block truncate text-xs font-medium rounded-full px-2 py-0.5 text-white ${pillColorMap[ev.id]}`}
                          >
                            {ev.title}
                          </span>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for selected day */}
      {selectedDateKey && (
        <div
          className="fixed inset-0 bg-[var(--color-charcoal)]/50 flex items-center justify-center z-50 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) closeModal() }}
        >
          <div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={modalLabelId}
            className="bg-white rounded-xl shadow-xl p-6 w-80 max-w-[90vw]"
          >
            <h3
              id={modalLabelId}
              className="type-heading-xs text-[var(--color-charcoal)] mb-4"
            >
              Events on {selectedEvents[0] ? formatDateLabel(selectedEvents[0].start) : selectedDateKey}
            </h3>
            <div className="space-y-4 max-h-64 overflow-y-auto">
              {selectedEvents.map((ev) => (
                <div key={ev.id} className="border-b border-[var(--color-stone)]/30 pb-3">
                  <div className="flex items-center mb-1 gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${pillColorMap[ev.id]}`} aria-hidden="true" />
                    <h4 className="type-heading-xxs text-[var(--color-charcoal)]">{ev.title}</h4>
                  </div>
                  <p className="type-body-sm text-[var(--color-charcoal)]/70 mb-1">{ev.description}</p>
                  <p className="type-body-xs text-[var(--color-charcoal)]/50 mb-1">
                    <time dateTime={ev.start.toISOString()}>{ev.start.toLocaleString()}</time>
                    {' – '}
                    <time dateTime={ev.end.toISOString()}>{ev.end.toLocaleString()}</time>
                  </p>
                  {ev.location && ev.mapsUrl && (
                    <p className="type-body-sm flex items-center gap-1">
                      <HiMapPin aria-hidden="true" className="w-4 h-4 text-[var(--color-terracotta)] flex-shrink-0" />
                      <a
                        href={ev.mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline text-[var(--color-terracotta)] hover:text-[var(--color-terracotta-dark)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-forest)] rounded-sm"
                      >
                        {ev.location}
                      </a>
                    </p>
                  )}
                  {ev.location && !ev.mapsUrl && (
                    <p className="type-body-sm flex items-center gap-1 text-[var(--color-charcoal)]/70">
                      <HiMapPin aria-hidden="true" className="w-4 h-4 flex-shrink-0" />
                      {ev.location}
                    </p>
                  )}
                </div>
              ))}
            </div>
            <button
              ref={closeButtonRef}
              onClick={closeModal}
              className="mt-4 w-full py-2 rounded-lg bg-[var(--color-forest)] text-white type-button-sm hover:bg-[var(--color-forest-dark,#2d5040)] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-paper)]"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </section>
  )
}

// Pre-configured Calendar that reads settings from CMS
export const ConfiguredCalendar: React.FC<Omit<CalendarProps, 'googleCalendarUrl'>> = (props) => {
  return <Calendar {...props} googleCalendarUrl={EVENTS_SETTINGS.externalCalendarUrl} />
}
