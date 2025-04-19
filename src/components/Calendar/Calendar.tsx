import React, { useState } from 'react'

export interface CalendarEvent {
  id: string
  title: string
  description: string
  start: Date
  end: Date
  location?: string            // e.g. "123 Main St, Anytown"
  mapsUrl?: string             // e.g. "https://maps.google.com/?q=123+Main+St"
}

export interface CalendarProps {
  /** any date in the month you want to render */
  month?: Date                 // default: current month
  events?: CalendarEvent[]     // default: demo events
  googleCalendarUrl?: string   // default: null
}

// Seven fall‑themed Tailwind color classes for rotating pill backgrounds
const FALL_PILL_CLASSES = [
  'bg-amber-700',
  'bg-emerald-700',
  'bg-stone-700',
  'bg-orange-700',
  'bg-red-600',
  'bg-lime-700',
  'bg-yellow-700',
]

/**
 * Return a 2D array of Date objects, one sub-array per calendar week (Sun→Sat),
 * including spillover days from previous/next month.
 */
const generateCalendarGrid = (year: number, month: number): Date[][] => {
  const firstOfMonth = new Date(year, month, 1)
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const startWeekday = firstOfMonth.getDay()

  const dates: Date[] = []
  // Spillover from previous month
  for (let i = startWeekday - 1; i >= 0; i--) {
    dates.push(new Date(year, month, -i))
  }
  // Current month
  for (let d = 1; d <= daysInMonth; d++) {
    dates.push(new Date(year, month, d))
  }
  // Spillover to next month
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

export const Calendar: React.FC<CalendarProps> = ({
  month: propMonth,
  events: propEvents,
  googleCalendarUrl = null,
}) => {
  const now = new Date()
  const defaultMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const month = propMonth || defaultMonth

  // Demo events if none provided
  const events: CalendarEvent[] = propEvents || Array.from({ length: 10 }, (_, i) => {
    const day = (i % 5) + 1
    const start = new Date(month.getFullYear(), month.getMonth(), day, 10, 0)
    const end = new Date(month.getFullYear(), month.getMonth(), day, 11, 0)
    const location = `Location ${i + 1}`
    const mapsUrl = `https://maps.google.com/?q=${encodeURIComponent(location)}`
    return {
      id: `${i + 1}`,
      title: `Event ${i + 1}`,
      description: `Description for event ${i + 1}`,
      start,
      end,
      location,
      mapsUrl,
    }
  })

  // Optionally: fetch real Google Calendar events if googleCalendarUrl is provided
  // (Not implemented here—could be added via useEffect + fetch)

  // Sort and assign pill colors
  const sorted = [...events].sort((a, b) => a.start.getTime() - b.start.getTime())
  const pillColorMap: Record<string, string> = {}
  sorted.forEach((ev, i) => {
    pillColorMap[ev.id] = FALL_PILL_CLASSES[i % FALL_PILL_CLASSES.length]
  })

  const [selectedDateKey, setSelectedDateKey] = useState<string | null>(null)

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

  return (
    <section className="relative bg-stone-50 w-full">
      {/* Decorative backgrounds */}
      <div className="bg-yellow-200 w-full sm:w-40 h-40 rounded-full absolute top-1 max-sm:right-0 sm:left-56 opacity-20 z-0" />
      <div className="bg-orange-200 w-full sm:w-40 h-24 absolute top-0 left-0 opacity-20 z-0" />
      <div className="bg-red-200 w-full sm:w-40 h-24 absolute top-40 left-0 opacity-20 z-0" />

      <div className="w-full py-24 relative z-10 backdrop-blur-3xl">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-12 gap-8">
            {/* Upcoming events list */}
            <div className="col-span-12 xl:col-span-5">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">Upcoming Events</h2>
              <div className="space-y-4">
                {sorted.map((ev) => (
                  <div key={ev.id} className="p-4 rounded-xl bg-white shadow">
                    <div className="flex items-center mb-2 gap-2">
                      <span className={`w-3 h-3 rounded-full ${pillColorMap[ev.id]}`} />
                      <p className="text-sm font-medium text-gray-800">
                        {ev.start.toLocaleString()} – {ev.end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    <h3 className="text-lg font-semibold">{ev.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{ev.description}</p>
                    {ev.location && ev.mapsUrl && (
                      <p className="text-sm">
                        📍 <a href={ev.mapsUrl} target="_blank" rel="noopener noreferrer" className="underline">
                          {ev.location}
                        </a>
                      </p>
                    )}
                    {ev.location && !ev.mapsUrl && (
                      <p className="text-sm text-gray-500">📍 {ev.location}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Calendar grid */}
            <div className="col-span-12 xl:col-span-7">
              <h2 className="text-xl font-semibold mb-4">{formatMonthYear(month)}</h2>
              <div className="grid grid-cols-7 border border-indigo-200 rounded-xl overflow-hidden">
                {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map((wd) => (
                  <div key={wd} className="py-2 bg-indigo-50 text-indigo-600 text-center text-sm font-medium">
                    {wd}
                  </div>
                ))}
                {weeks.flat().map((date, idx) => {
                  const inMonth = date.getMonth() === mIndex
                  const dayEvents = eventsForDate(events, date)
                  return (
                    <div
                      key={idx}
                      onClick={() => handleCellClick(date, dayEvents)}
                      className={`p-2 min-h-[80px] relative cursor-pointer border-t border-l border-indigo-200 ${inMonth ? 'bg-white' : 'bg-gray-50'}`}
                    >
                      <span className={`${inMonth ? 'text-gray-900' : 'text-gray-400'} text-xs font-semibold`}>
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
        <div className="fixed inset-0 bg-neutral-50/30 flex items-center justify-center z-50 backdrop-blur-md">
          <div className="bg-white rounded-xl shadow-xl p-6 w-80">
            <h3 className="text-lg font-semibold mb-4">Events on {selectedDateKey}</h3>
            <div className="space-y-4 max-h-64 overflow-y-auto">
              {selectedEvents.map((ev) => (
                <div key={ev.id} className="border-b pb-3">
                  <div className="flex items-center mb-1 gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${pillColorMap[ev.id]}`} />
                    <h4 className="font-medium">{ev.title}</h4>
                  </div>
                  <p className="text-sm text-gray-700 mb-1">{ev.description}</p>
                  <p className="text-xs text-gray-500 mb-1">
                    {ev.start.toLocaleString()} – {ev.end.toLocaleString()}
                  </p>
                  {ev.location && ev.mapsUrl && (
                    <p className="text-sm">
                      📍 <a href={ev.mapsUrl} target="_blank" rel="noopener noreferrer" className="underline">
                        {ev.location}
                      </a>
                    </p>
                  )}
                  {ev.location && !ev.mapsUrl && (
                    <p className="text-sm text-gray-500">📍 {ev.location}</p>
                  )}
                </div>
              ))}
            </div>
            <button
              onClick={closeModal}
              className="mt-4 w-full py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </section>
  )
}
