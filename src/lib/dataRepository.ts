import { initializeApp } from 'firebase/app';
import { getDatabase, ref, get, set, update, remove, onValue } from 'firebase/database';
import {
  Member,
  OtherTermin,
  SpielTermin,
  Termin,
  TerminStatus,
  TrainingTermin,
  Umfrage,
} from '../types';

const app = initializeApp({
  apiKey: "AIzaSyBIgqHehZiY2sSv4vP4sEsE13x9fzgwOrM",
  authDomain: "h03-app.firebaseapp.com",
  databaseURL: "https://h03-app-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "h03-app",
  storageBucket: "h03-app.firebasestorage.app",
  messagingSenderId: "633481815584",
  appId: "1:633481815584:web:572e46528aaeaff523fe45",
  measurementId: "G-5XMH1L9DSQ"
});
const db = getDatabase(app);

type Collection = 'mitglieder' | 'termine' | 'umfragen';
type RecordValue = Record<string, unknown>;
type Listener<T> = (value: T) => void;
type NewTermin = Omit<TrainingTermin, 'id'> | Omit<SpielTermin, 'id'> | Omit<OtherTermin, 'id'>;

function createId(prefix: string) {
  return `${prefix}-${crypto.randomUUID()}`;
}

async function getCollection<T>(collection: Collection): Promise<Record<string, T>> {
  const snapshot = await get(ref(db, collection));
  return snapshot.exists() ? snapshot.val() : {};
}

async function getItem<T>(collection: Collection, id: string): Promise<T | null> {
  const snapshot = await get(ref(db, `${collection}/${id}`));
  return snapshot.exists() ? snapshot.val() : null;
}

async function setItem<T>(collection: Collection, id: string, value: T | null) {
  if (value === null) {
    await remove(ref(db, `${collection}/${id}`));
  } else {
    await set(ref(db, `${collection}/${id}`), value);
  }
}

async function updateItem(collection: Collection, id: string, updates: RecordValue) {
  await update(ref(db, `${collection}/${id}`), updates);
}

async function removeItem(collection: Collection, id: string) {
  await remove(ref(db, `${collection}/${id}`));
}

async function createItems<T extends { id: string }>(collection: Collection, items: T[]) {
  const updates: Record<string, unknown> = {};
  items.forEach(item => {
    updates[`${collection}/${item.id}`] = item;
  });
  await update(ref(db), updates);
}

function watch<T>(path: string, listener: Listener<T>) {
  const dbRef = ref(db, path);
  const unsubscribe = onValue(dbRef, (snapshot) => {
    listener(snapshot.exists() ? snapshot.val() : null);
  });
  return () => unsubscribe();
}

export function watchMembers(listener: Listener<Record<string, Member>>) {
  return watch<Record<string, Member>>('mitglieder', (val) => listener(val || {}));
}

export function watchEvents(listener: Listener<Record<string, Termin>>) {
  return watch<Record<string, Termin>>('termine', (val) => listener(val || {}));
}

export function watchPolls(listener: Listener<Record<string, Umfrage>>) {
  return watch<Record<string, Umfrage>>('umfragen', (val) => listener(val || {}));
}

export function watchPoll(id: string, listener: Listener<Umfrage | null>) {
  return watch<Umfrage | null>(`umfragen/${id}`, listener);
}

export function getMembers() {
  return getCollection<Member>('mitglieder');
}

export function getEvents() {
  return getCollection<Termin>('termine');
}

export function getPolls() {
  return getCollection<Umfrage>('umfragen');
}

export function getPoll(id: string) {
  return getItem<Umfrage>('umfragen', id);
}

export function updateMember(id: string, updates: Partial<Member>) {
  return updateItem('mitglieder', id, updates);
}

export function createEvent(event: NewTermin & { id?: string }) {
  const value = { ...event, id: event.id || createId('event') } as Termin;
  return setItem('termine', value.id, value).then(() => value);
}

export function createEvents(events: Termin[]) {
  return createItems('termine', events);
}

export function updateEvent(id: string, updates: Partial<Termin>) {
  return updateItem('termine', id, updates as RecordValue);
}

export function updateEvents(ids: string[], updates: Partial<Termin>) {
  const allUpdates: Record<string, unknown> = {};
  ids.forEach(id => {
    Object.keys(updates).forEach(key => {
      allUpdates[`termine/${id}/${key}`] = (updates as Record<string, unknown>)[key];
    });
  });
  return update(ref(db), allUpdates);
}

export function deleteEvent(id: string) {
  return removeItem('termine', id);
}

export function deleteEvents(ids: string[]) {
  const allUpdates: Record<string, unknown> = {};
  ids.forEach(id => {
    allUpdates[`termine/${id}`] = null;
  });
  return update(ref(db), allUpdates);
}

export function updateEventStatus(id: string, memberId: string, status: TerminStatus | null) {
  return set(ref(db, `termine/${id}/status/${memberId}`), status);
}

export function createPoll(poll: Omit<Umfrage, 'id'> & { id?: string }) {
  const value = { ...poll, id: poll.id || createId('poll') } as Umfrage;
  return setItem('umfragen', value.id, value).then(() => value);
}

export function setPollVote(id: string, memberId: string, vote: string | null) {
  return set(ref(db, `umfragen/${id}/votes/${memberId}`), vote);
}

export function updatePollStatus(id: string, status: Umfrage['status']) {
  return updateItem('umfragen', id, { status });
}

export function deletePoll(id: string) {
  return removeItem('umfragen', id);
}

export async function seedCollections(data: {
  members?: Record<string, Member>;
  events?: Record<string, Termin>;
  polls?: Record<string, Umfrage>;
}) {
  const updates: Record<string, unknown> = {};
  if (data.members) updates['mitglieder'] = data.members;
  if (data.events) updates['termine'] = data.events;
  if (data.polls) updates['umfragen'] = data.polls;
  await update(ref(db), updates);
}
