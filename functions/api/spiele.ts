const CALENDAR_ICS_URL = 'https://calendar.google.com/calendar/ical/09d3a4912c1f0189356e2efffafd8eedafbabedb79b3a6a4080ed47dadcb6626%40group.calendar.google.com/public/basic.ics';

interface SpieleEvent {
  date: string;
  summary: string;
}

function getProperty(lines: string[], name: string): string {
  const line = lines.find((candidate) => candidate.startsWith(`${name}:`) || candidate.startsWith(`${name};`));
  return line?.slice(line.indexOf(':') + 1) ?? '';
}

function unescapeIcalText(value: string): string {
  return value
    .replace(/\\n/gi, ' ')
    .replace(/\\,/g, ',')
    .replace(/\\;/g, ';')
    .replace(/\\\\/g, '\\');
}
const berlinDateFormatter = new Intl.DateTimeFormat('en-US', {
  timeZone: 'Europe/Berlin',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

function formatBerlinDate(date: Date): string {
  const parts = berlinDateFormatter.formatToParts(date);
  const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));

  return `${values.year}-${values.month}-${values.day}`;
}

function parseEventDate(value: string): string {
  const match = value.match(/^(\d{4})(\d{2})(\d{2})(?:T(\d{2})(\d{2})(\d{2})?)?(Z)?$/);

  if (!match) {
    return '';
  }

  if (match[7] && match[4] && match[5]) {
    const timestamp = `${match[1]}-${match[2]}-${match[3]}T${match[4]}:${match[5]}:${match[6] ?? '00'}Z`;
    return formatBerlinDate(new Date(timestamp));
  }

  return `${match[1]}-${match[2]}-${match[3]}`;
}


export function parseSpieleEvents(ics: string, today: string): SpieleEvent[] {
  const unfolded = ics.replace(/\r?\n[ \t]/g, '');
  const events = [...unfolded.matchAll(/BEGIN:VEVENT\r?\n([\s\S]*?)END:VEVENT/g)]
    .map((match) => {
      const lines = match[1].split(/\r?\n/);
      const summary = unescapeIcalText(getProperty(lines, 'SUMMARY'));
      const categories = unescapeIcalText(getProperty(lines, 'CATEGORIES'));
      const date = parseEventDate(getProperty(lines, 'DTSTART'));

      return {
        date,
        summary,
        categories,
        status: getProperty(lines, 'STATUS'),
      };
    })
    .filter(({ date, summary, categories, status }) =>
      date >= today
      && status.toUpperCase() !== 'CANCELLED'
      && (/(^|\W)spiele?(\W|$)/i.test(`${summary} ${categories}`) || /\s[-–—]\s/.test(summary)),
    )
    .map(({ date, summary }) => ({ date, summary }))
    .sort((a, b) => a.date.localeCompare(b.date) || a.summary.localeCompare(b.summary));

  return events.filter((event, index) =>
    index === 0 || event.date !== events[index - 1].date || event.summary !== events[index - 1].summary,
  );
}


export const onRequestGet = async (): Promise<Response> => {
  const response = await fetch(CALENDAR_ICS_URL);

  if (!response.ok) {
    return Response.json({ error: 'Calendar unavailable' }, { status: 502 });
  }

  const events = parseSpieleEvents(await response.text(), formatBerlinDate(new Date()));

  return Response.json(
    { nextDate: events[0]?.date ?? null, events },
    { headers: { 'Cache-Control': 'public, max-age=300' } },
  );
};
