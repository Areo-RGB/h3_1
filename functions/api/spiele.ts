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

export function parseSpieleEvents(ics: string, today: string): SpieleEvent[] {
  const unfolded = ics.replace(/\r?\n[ \t]/g, '');
  const events = [...unfolded.matchAll(/BEGIN:VEVENT\r?\n([\s\S]*?)END:VEVENT/g)]
    .map((match) => {
      const lines = match[1].split(/\r?\n/);
      const summary = unescapeIcalText(getProperty(lines, 'SUMMARY'));
      const categories = unescapeIcalText(getProperty(lines, 'CATEGORIES'));
      const dateMatch = getProperty(lines, 'DTSTART').match(/^(\d{4})(\d{2})(\d{2})/);

      return {
        date: dateMatch ? `${dateMatch[1]}-${dateMatch[2]}-${dateMatch[3]}` : '',
        summary,
        categories,
        status: getProperty(lines, 'STATUS'),
      };
    })
    .filter(({ date, summary, categories, status }) =>
      date >= today
      && status.toUpperCase() !== 'CANCELLED'
      && /(^|\W)spiele?(\W|$)/i.test(`${summary} ${categories}`),
    )
    .map(({ date, summary }) => ({ date, summary }))
    .sort((a, b) => a.date.localeCompare(b.date) || a.summary.localeCompare(b.summary));

  return events.filter((event, index) =>
    index === 0 || event.date !== events[index - 1].date || event.summary !== events[index - 1].summary,
  );
}

function getBerlinDate(): string {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Europe/Berlin',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date());
  const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));

  return `${values.year}-${values.month}-${values.day}`;
}

export const onRequestGet = async (): Promise<Response> => {
  const response = await fetch(CALENDAR_ICS_URL);

  if (!response.ok) {
    return Response.json({ error: 'Calendar unavailable' }, { status: 502 });
  }

  const events = parseSpieleEvents(await response.text(), getBerlinDate());

  return Response.json(
    { nextDate: events[0]?.date ?? null, events },
    { headers: { 'Cache-Control': 'public, max-age=300' } },
  );
};
