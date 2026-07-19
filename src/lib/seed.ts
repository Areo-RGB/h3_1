import { seedCollections, getEvents, getMembers } from './dataRepository';
import { Member, Umfrage, Termin } from '../types';

export const INITIAL_USERS = [
  'Silas',
  'Finley',
  'Arvid',
  'Lion',
  'Jakob',
  'Paul',
  'Lennox',
  'Levi',
  'Lasse',
  'Milan',
  'Lionel',
  'Arturo',
  'Peter',
  'Tommy',
  'Alex',
  'Tayo',
  'admin',
];

export async function seedDatabase(requester?: Pick<Member, 'id'>) {
  if (requester?.id) {
    const response = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        action: 'seed-users',
        adminId: requester.id,
        users: INITIAL_USERS.map((name, index) => ({
          id: `member_${index}`,
          name,
          type: name === 'admin' ? 'admin' : 'user',
        })),
      }),
    });
    if (!response.ok) throw new Error(await response.text());
  }

  const snapshot = await getMembers();

  const newMembers: Record<string, Member> = snapshot || {};
  let changed = false;

  INITIAL_USERS.forEach((name, index) => {
    const id = `member_${index}`;
    const lionAvatar =
      'https://pub-7c85e81a76e54ba9ad1dd7277f5a1013.r2.dev/profile.pics/liom.%20profile.png';

    if (!newMembers[id]) {
      newMembers[id] = {
        id,
        name,
        type: name === 'admin' ? 'admin' : 'user',
        avatarUrl: name === 'Lion' ? lionAvatar : undefined,
      };
      changed = true;
    } else {
      if (name === 'Lion' && newMembers[id].avatarUrl !== lionAvatar) {
        newMembers[id].avatarUrl = lionAvatar;
        changed = true;
      }
    }
  });

  const umfragenSnap = await fetch('/api/data', { method: 'POST', headers: {'content-type': 'application/json'}, body: JSON.stringify({ op: 'get', path: 'umfragen' }) }).then(r => r.json());
  let umfragenData = umfragenSnap || {};
  if (Object.keys(umfragenData).length === 0) {
    const initialUmfragen: Record<string, Umfrage> = {
      umfrage1: {
        id: 'umfrage1',
        title: 'Trainingsbeteiligung am Mittwoch',
        subtitle: 'Bitte bis Dienstagabend abstimmen',
        votes: {
          member_0: 'Ja', // Silas
          member_1: 'Nein', // Finley
        },
        options: ['Ja', 'Nein'],
        status: 'laufend',
      },
    };
    umfragenData = initialUmfragen;
    changed = true;
  }

  const termineSnap = await getEvents();
  let termineData = termineSnap || {};
  if (Object.keys(termineData).length === 0) {
    const initialTermine: Record<string, Termin> = {
      training_kw27_1: {
        id: 'training_kw27_1',
        day: 'Mo.',
        date: '29.06',
        fullDate: '2026-06-29',
        title: 'Training',
        type: 'training',
        startTime: '18:30',
        endTime: '20:00',
        address: 'Kunstrasenplatz',
        status: {},
      },
      training_kw27_2: {
        id: 'training_kw27_2',
        day: 'Mi.',
        date: '01.07',
        fullDate: '2026-07-01',
        title: 'Training',
        type: 'training',
        startTime: '18:30',
        endTime: '20:00',
        address: 'Kunstrasenplatz',
        status: {},
      },
      training_kw27_3: {
        id: 'training_kw27_3',
        day: 'Fr.',
        date: '03.07',
        fullDate: '2026-07-03',
        title: 'Training',
        type: 'training',
        startTime: '18:30',
        endTime: '20:00',
        address: 'Kunstrasenplatz',
        status: {},
      },
      spiel_kw27_1: {
        id: 'spiel_kw27_1',
        day: 'So.',
        date: '05.07',
        fullDate: '2026-07-05',
        title: 'FC Standard',
        type: 'spiel',
        startTime: '15:00',
        endTime: '17:00',
        opponent: 'FC Standard',
        isHome: true,
        address: 'Ernst-Reuter-Sportfeld',
        status: {},
      },
    };
    termineData = initialTermine;
    changed = true;
  }

  // Add a larger, deterministic sample schedule without overwriting existing data.
  const currentTermine: Record<string, Termin> = termineData;
  const trainingLocations = [
    'Kunstrasenplatz',
    'Sportplatz Körnerstraße',
    'Hauptplatz',
    'Nebenplatz',
  ];
  const opponents = [
    'FC Adler',
    'SV Nord',
    'TSV West',
    'VfB 08',
    'Rot-Weiß Mitte',
    'Union Süd',
    'SC Falken',
  ];
  const days = ['So.', 'Mo.', 'Di.', 'Mi.', 'Do.', 'Fr.', 'Sa.'];
  const baseDate = new Date('2026-07-13T12:00:00');
  const dateParts = (offset: number) => {
    const date = new Date(baseDate);
    date.setDate(baseDate.getDate() + offset);
    const fullDate = date.toISOString().slice(0, 10);
    return {
      fullDate,
      date: `${String(date.getDate()).padStart(2, '0')}.${String(date.getMonth() + 1).padStart(2, '0')}`,
      day: days[date.getDay()],
    };
  };

  for (let i = 0; i < 15; i++) {
    const id = `seed_training_${String(i + 1).padStart(2, '0')}`;
    if (!currentTermine[id]) {
      const schedule = dateParts(i * 3);
      currentTermine[id] = {
        id,
        ...schedule,
        title: 'Training',
        type: 'training',
        startTime: i % 2 === 0 ? '18:30' : '19:00',
        endTime: '20:00',
        address: trainingLocations[i % trainingLocations.length],
        status: {},
      };
      changed = true;
    }
  }

  for (let i = 0; i < 15; i++) {
    const id = `seed_game_${String(i + 1).padStart(2, '0')}`;
    if (!currentTermine[id]) {
      const schedule = dateParts(6 + i * 7);
      currentTermine[id] = {
        id,
        ...schedule,
        title: opponents[i % opponents.length],
        type: 'spiel',
        startTime: `${String(13 + (i % 4)).padStart(2, '0')}:00`,
        endTime: `${String(15 + (i % 4)).padStart(2, '0')}:00`,
        opponent: opponents[i % opponents.length],
        isHome: i % 2 === 0,
        address: i % 2 === 0 ? 'Ernst-Reuter-Sportfeld' : 'Sportplatz am Park',
        status: {},
      };
      changed = true;
    }
  }

  if (changed) {
    await seedCollections({
      members: newMembers,
      events: currentTermine,
      polls: umfragenData
    });
  }
}
