const CALENDAR_ICS_URL = 'https://calendar.google.com/calendar/ical/09d3a4912c1f0189356e2efffafd8eedafbabedb79b3a6a4080ed47dadcb6626%40group.calendar.google.com/public/basic.ics';
const SPIELE_FORM_ID = '16ttyd6qu0NiYnTL2eDZizbDKSzOyrTIkAg3kDoaPNsM';
const SPIELE_ITEM_ID = '12912576';

interface SpieleEvent {
  date: string;
  summary: string;
  value: string;
}

interface ServiceAccount {
  client_email: string;
  private_key: string;
  token_uri: string;
}

interface Env {
  GOOGLE_SERVICE_ACCOUNT_JSON?: string;
}

interface PagesContext {
  env: Env;
}

const berlinDateFormatter = new Intl.DateTimeFormat('en-US', {
  timeZone: 'Europe/Berlin',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

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

function formatChoiceValue(summary: string, date: string): string {
  const [year, month, day] = date.split('-');
  return `${summary} – ${day}.${month}.${year}`;
}

export function parseSpieleEvents(ics: string, today: string): SpieleEvent[] {
  const unfolded = ics.replace(/\r?\n[ \t]/g, '');
  const events = [...unfolded.matchAll(/BEGIN:VEVENT\r?\n([\s\S]*?)END:VEVENT/g)]
    .map((match) => {
      const lines = match[1].split(/\r?\n/);
      const summary = unescapeIcalText(getProperty(lines, 'SUMMARY'));
      const categories = unescapeIcalText(getProperty(lines, 'CATEGORIES'));

      return {
        date: parseEventDate(getProperty(lines, 'DTSTART')),
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
    .map(({ date, summary }) => ({ date, summary, value: formatChoiceValue(summary, date) }))
    .sort((a, b) => a.date.localeCompare(b.date) || a.summary.localeCompare(b.summary));

  return events.filter((event, index) =>
    index === 0 || event.date !== events[index - 1].date || event.summary !== events[index - 1].summary,
  );
}

function toBase64Url(bytes: Uint8Array): string {
  let binary = '';
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }

  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function encodeJson(value: object): string {
  return toBase64Url(new TextEncoder().encode(JSON.stringify(value)));
}

async function getFormsAccessToken(serviceAccountJson: string): Promise<string> {
  const credentials = JSON.parse(serviceAccountJson) as ServiceAccount;
  const now = Math.floor(Date.now() / 1000);
  const unsignedToken = `${encodeJson({ alg: 'RS256', typ: 'JWT' })}.${encodeJson({
    iss: credentials.client_email,
    scope: 'https://www.googleapis.com/auth/forms.body',
    aud: credentials.token_uri,
    iat: now,
    exp: now + 3600,
  })}`;
  const privateKeyBytes = Uint8Array.from(
    atob(credentials.private_key.replace(/-----[^-]+-----|\s/g, '')),
    (character) => character.charCodeAt(0),
  );
  const privateKey = await crypto.subtle.importKey(
    'pkcs8',
    privateKeyBytes,
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const signature = await crypto.subtle.sign(
    'RSASSA-PKCS1-v1_5',
    privateKey,
    new TextEncoder().encode(unsignedToken),
  );
  const tokenResponse = await fetch(credentials.token_uri, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: `${unsignedToken}.${toBase64Url(new Uint8Array(signature))}`,
    }),
  });

  if (!tokenResponse.ok) {
    throw new Error(`Google token request failed: ${tokenResponse.status}`);
  }

  const token = await tokenResponse.json() as { access_token: string };
  return token.access_token;
}

async function synchronizeFormChoices(accessToken: string, events: SpieleEvent[]): Promise<void> {
  if (events.length === 0) {
    return;
  }

  const headers = { Authorization: `Bearer ${accessToken}` };
  const formResponse = await fetch(`https://forms.googleapis.com/v1/forms/${SPIELE_FORM_ID}`, { headers });

  if (!formResponse.ok) {
    throw new Error(`Google Form request failed: ${formResponse.status}`);
  }

  const form = await formResponse.json() as {
    revisionId: string;
    items?: Array<{
      itemId: string;
      title: string;
      questionItem?: { question?: { questionId?: string; required?: boolean; choiceQuestion?: { type?: string; options?: Array<{ value: string }> } } };
    }>;
  };
  const item = form.items?.find((candidate) => candidate.itemId === SPIELE_ITEM_ID);
  const question = item?.questionItem?.question;

  if (!item || !question?.questionId) {
    throw new Error('Spiele question not found');
  }
  const values = events.map(({ value }) => value);
  const currentValues = question?.choiceQuestion?.options?.map(({ value }) => value) ?? [];

  if (question?.choiceQuestion?.type === 'DROP_DOWN' && currentValues.join('\n') === values.join('\n')) {
    return;
  }

  const updateResponse = await fetch(`https://forms.googleapis.com/v1/forms/${SPIELE_FORM_ID}:batchUpdate`, {
    method: 'POST',
    headers: { ...headers, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      requests: [{
        updateItem: {
          item: {
            itemId: SPIELE_ITEM_ID,
            title: 'Spiele',
            questionItem: {
              question: {
                questionId: question.questionId,
                required: true,
                choiceQuestion: {
                  type: 'DROP_DOWN',
                  options: values.map((value) => ({ value })),
                  shuffle: false,
                },
              },
            },
          },
          location: { index: form.items?.indexOf(item) ?? 1 },
          updateMask: '*',
        },
      }],
      writeControl: { requiredRevisionId: form.revisionId },
    }),
  });

  if (!updateResponse.ok) {
    throw new Error(`Google Form update failed: ${updateResponse.status}`);
  }
}

export const onRequestGet = async ({ env }: PagesContext): Promise<Response> => {
  if (!env.GOOGLE_SERVICE_ACCOUNT_JSON) {
    return Response.json({ error: 'Calendar synchronization is not configured' }, { status: 500 });
  }

  const response = await fetch(CALENDAR_ICS_URL);

  if (!response.ok) {
    return Response.json({ error: 'Calendar unavailable' }, { status: 502 });
  }

  try {
    const events = parseSpieleEvents(await response.text(), formatBerlinDate(new Date()));
    const accessToken = await getFormsAccessToken(env.GOOGLE_SERVICE_ACCOUNT_JSON);
    await synchronizeFormChoices(accessToken, events);

    return Response.json(
      { events },
      { headers: { 'Cache-Control': 'public, max-age=300' } },
    );
  } catch (error) {
    console.error(error);
    return Response.json({ error: 'Calendar synchronization failed' }, { status: 502 });
  }
};
