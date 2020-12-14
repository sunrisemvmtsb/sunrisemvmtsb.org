export type CalendarEvent = {
  id: string,
  summary: string,
  description: string,
  location: string | null,
  htmlLink: string,
  start: { dateTime: string } | { date: string },
}

const formatDate = (input: Date) => {
  return [
    input.getUTCFullYear(),
    '-',
    (input.getUTCMonth() + 1).toString().padStart(2, '0'),
    '-',
    input.getUTCDate().toString().padStart(2, '0'),
    'T',
    input.getUTCHours().toString().padStart(2, '0'),
    ':',
    input.getUTCMinutes().toString().padStart(2, '0'),
    ':',
    input.getUTCSeconds().toString().padStart(2, '0'),
    'Z'
  ].join('')
}

export default class GoogleCalendar {
  async events(): Promise<Array<CalendarEvent>> {
    const url = new URL(`https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent('sunrisemvmtsb@gmail.com')}/events`)
    url.searchParams.append('orderBy', 'startTime')
    url.searchParams.append('singleEvents', 'true')
    url.searchParams.append('timeMin', formatDate(new Date()))
    url.searchParams.append('maxResults', '4')
    url.searchParams.append('key', process.env.GOOGLE_CALENDAR_API_KEY)
    const response = await fetch(url.href)
    const data = await response.json()
    return data.items.map((event) => ({
      id: event.id,
      summary: event.summary,
      description: event.description ?? '',
      location: event.location ?? null,
      htmlLink: event.htmlLink,
      start: event.start,
    })) as Array<CalendarEvent>
  }
}
