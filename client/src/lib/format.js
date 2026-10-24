// Dates render in the viewer's timezone unless VITE_EVENT_TIMEZONE is set
// (e.g. "Europe/Tirane"), which keeps the time correct for guests abroad.
const TIME_ZONE = import.meta.env.VITE_EVENT_TIMEZONE || undefined

export const formatDate = (date, options) =>
  new Intl.DateTimeFormat('en-GB', { timeZone: TIME_ZONE, ...options }).format(new Date(date))

export const dateParts = (date) => ({
  weekday: formatDate(date, { weekday: 'long' }),
  day: formatDate(date, { day: '2-digit' }),
  month: formatDate(date, { month: 'long' }),
  monthNum: formatDate(date, { month: '2-digit' }),
  year: formatDate(date, { year: 'numeric' }),
  time: formatDate(date, { hour: '2-digit', minute: '2-digit', hour12: false }),
})

export const initials = (a = '', b = '') => `${a.trim()[0] ?? ''}${b.trim()[0] ?? ''}`.toUpperCase()

export const mapsUrl = (venue) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(venue)}`

// Google Calendar "add event" link; assumes a 6 hour celebration.
export function calendarUrl({ title, date, venue, hours = 6 }) {
  const stamp = (d) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')
  const start = new Date(date)
  const end = new Date(start.getTime() + hours * 3600_000)
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: title,
    dates: `${stamp(start)}/${stamp(end)}`,
    location: venue,
  })
  return `https://calendar.google.com/calendar/render?${params}`
}
