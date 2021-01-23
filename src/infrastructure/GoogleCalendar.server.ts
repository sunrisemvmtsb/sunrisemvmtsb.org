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


const FIVE_MINUTES = 1000 * 60 * 5

export default class GoogleCalendar {
  private _lastFetched: number
  private _cache: Array<CalendarEvent>
  private readonly _auth: string
  private readonly _calendar: string

  constructor({
    auth,
    calendar,
  }: {
    auth: string,
    calendar: string,
  }) {
    this._lastFetched = 0
    this._cache = []
    this._auth = auth
    this._calendar = calendar
  }

  async load(): Promise<Array<CalendarEvent>> {
    const now = Date.now()
    if (now - this._lastFetched > FIVE_MINUTES) {
      try {
        const data = await this._fetch()
        this._lastFetched = now
        this._cache = data
      } catch { }
    }

    return this._cache
  }

  private async _fetch(): Promise<Array<CalendarEvent>> {
    const url = new URL(`https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(this._calendar)}/events`)
    url.searchParams.append('orderBy', 'startTime')
    url.searchParams.append('singleEvents', 'true')
    url.searchParams.append('timeMin', formatDate(new Date()))
    url.searchParams.append('maxResults', '4')
    url.searchParams.append('key', this._auth)
    const response = await fetch(url.href)
    const data = await response.json()
    return data.items.map((event: any) => ({
      id: event.id,
      summary: event.summary,
      description: event.description ?? '',
      location: event.location ?? null,
      htmlLink: event.htmlLink,
      start: event.start,
    })) as Array<CalendarEvent>
  }
}
