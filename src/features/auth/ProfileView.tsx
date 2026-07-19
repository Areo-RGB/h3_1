import {
  UserCog,
  ChevronRight,
  ChevronDown,
  LogOut,
  Check,
  Database,
  BarChart3,
  UserPlus,
} from 'lucide-react';
import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { watchEvents, updateMember } from '../../lib/dataRepository';
import { Member, Termin, TerminStatus } from '../../types';
import { Avatar, AvatarImage, AvatarFallback } from '../../components/ui/avatar';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { seedDatabase } from '../../lib/seed';
import { displayTerminTitle } from '../../lib/terminDisplay';

interface ProfileViewProps {
  currentUser: Member;
  onLogout: () => void;
}

export const ProfileView = React.memo(({ currentUser, onLogout }: ProfileViewProps) => {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [firstName, setFirstName] = useState(currentUser.firstName || '');
  const [lastName, setLastName] = useState(currentUser.lastName || '');
  const [birthDate, setBirthDate] = useState(currentUser.birthDate || '');
  const [contact, setContact] = useState(currentUser.contact || '');
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [isSeeding, setIsSeeding] = useState(false);
  const [seedMessage, setSeedMessage] = useState('');
  const [members] = useState<Member[]>([]);
  const [termine, setTermine] = useState<Termin[]>([]);
  const [selectedMemberId, setSelectedMemberId] = useState('');
  const [newUserName, setNewUserName] = useState('');
  const [userMessage, setUserMessage] = useState('');

  useEffect(() => {
    if (currentUser.type !== 'admin') return;

    const unsubscribeTermine = watchEvents((data) => {
      setTermine(Object.keys(data).map((id) => ({ ...data[id], id: data[id].id || id })));
    });

    return () => {
      unsubscribeTermine();
    };
  }, [currentUser.type]);

  const selectedMember = useMemo(
    () => members.find((member) => member.id === selectedMemberId) || null,
    [members, selectedMemberId],
  );

  const playerStats = useMemo(() => {
    if (!selectedMember) {
      return {
        accepted: 0,
        declined: 0,
        open: 0,
        participationPercentage: 0,
        events: [] as Termin[],
      };
    }

    const events = termine
      .filter((termin) => termin.type === 'training' || termin.type === 'spiel')
      .sort((a, b) => (a.fullDate || '').localeCompare(b.fullDate || ''));
    const counts = events.reduce(
      (stats, event) => {
        const status: TerminStatus = event.status?.[selectedMember.id] || null;
        if (status === 'accepted') stats.accepted += 1;
        else if (status === 'declined') stats.declined += 1;
        else stats.open += 1;
        return stats;
      },
      { accepted: 0, declined: 0, open: 0 },
    );

    const participationPercentage = events.length
      ? Math.round((counts.accepted / events.length) * 100)
      : 0;

    return { ...counts, participationPercentage, events };
  }, [selectedMember, termine]);

  const handleSave = useCallback(async () => {
    setIsSaving(true);
    try {
      await updateMember(currentUser.id, {
        firstName,
        lastName,
        birthDate,
        contact,
      });
      setSaveMessage('Erfolgreich gespeichert!');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (e) {
      console.error(e);
      setSaveMessage('Fehler beim Speichern');
    } finally {
      setIsSaving(false);
    }
  }, [currentUser.id, firstName, lastName, birthDate, contact]);

  const handleSeed = useCallback(async () => {
    if (!confirm('Datenbank initialisieren?')) return;
    setIsSeeding(true);
    try {
      await seedDatabase(currentUser);
      setSeedMessage('Initialisierung erfolgreich!');
      setTimeout(() => setSeedMessage(''), 3000);
    } catch (e) {
      console.error(e);
      setSeedMessage('Fehler');
    } finally {
      setIsSeeding(false);
    }
  }, [currentUser]);

  const handleCreateUser = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const name = newUserName.trim();
      if (!name) return;
      if (members.some((member) => member.name.toLowerCase() === name.toLowerCase())) {
        setUserMessage('Dieser Name existiert bereits.');
        return;
      }
    },
    [members, newUserName],
  );

  return (
    <div id="profile-view" className="view-layout pb-10 overflow-y-auto h-full bg-[#f8fafc]">
      <div id="profile-view-header" className="flex flex-col items-center py-6 shrink-0">
        <Avatar className="size-28 border-4 border-white shadow-xl">
          <AvatarImage src={currentUser.avatarUrl || '/logo.webp'} className="object-cover" />
          <AvatarFallback>{currentUser.name[0]}</AvatarFallback>
        </Avatar>
        <h2 id="profile-view-name" className="text-2xl font-black uppercase tracking-tighter mt-4 text-slate-900">
          {currentUser.name}
        </h2>
        <p className="text-sm font-bold text-[#00479e] uppercase tracking-widest mt-1 opacity-70">
          {currentUser.type}
        </p>
      </div>

      <div className="px-4 flex flex-col gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="flex items-center gap-4 p-5 border-b border-slate-100">
            <div className="p-2 bg-slate-100 rounded-xl text-slate-900">
              <UserCog size={22} />
            </div>
            <span className="font-bold text-[17px] text-slate-900">Persönliche Daten</span>
          </div>
          <div className="px-5 py-5 flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstname" className="text-xs font-bold text-slate-500 uppercase mb-1 block">
                    Vorname
                  </label>
                  <Input id="firstname" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                </div>
                <div>
                  <label htmlFor="lastname" className="text-xs font-bold text-slate-500 uppercase mb-1 block">
                    Nachname
                  </label>
                  <Input id="lastname" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                </div>
              </div>
              <div>
                <label htmlFor="birthdate" className="text-xs font-bold text-slate-500 uppercase mb-1 block">
                  Geburtsdatum
                </label>
                <Input
                  id="birthdate"
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="contact-info" className="text-xs font-bold text-slate-500 uppercase mb-1 block">
                  Kontakt (Tel. / Email)
                </label>
                <Input id="contact-info" value={contact} onChange={(e) => setContact(e.target.value)} />
              </div>
              <div className="pt-2 flex items-center justify-between">
                <span className="text-sm font-bold text-green-600">{saveMessage}</span>
                <Button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="bg-slate-900 text-white font-bold px-6"
                >
                  Speichern {isSaving ? '...' : <Check size={18} className="ml-2" />}
                </Button>
              </div>
            </div>
        </div>

        {currentUser.type === 'admin' && (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <button
              onClick={() => setExpandedSection(expandedSection === 'admin' ? null : 'admin')}
              className="flex items-center justify-between p-5 w-full"
            >
              <div className="flex items-center gap-4">
                <div className="p-2 bg-slate-100 rounded-xl text-slate-900">
                  <Database size={22} />
                </div>
                <span className="font-bold text-[17px] text-slate-900">Administration</span>
              </div>
              {expandedSection === 'admin' ? (
                <ChevronDown size={20} className="text-slate-400" />
              ) : (
                <ChevronRight size={20} className="text-slate-400" />
              )}
            </button>
            {expandedSection === 'admin' && (
              <div className="px-5 pb-5 flex flex-col gap-4 animate-in fade-in slide-in-from-top-2">
                <p className="text-sm text-slate-500">
                  Datenbank mit Beispieldaten initialisieren.
                </p>
                <Button
                  onClick={handleSeed}
                  disabled={isSeeding}
                  className="bg-amber-600 text-white hover:bg-amber-700 w-full font-bold"
                >
                  {isSeeding ? 'Wird geladen...' : 'Beispieldaten laden'}
                </Button>
                {seedMessage && (
                  <p className="text-sm font-bold text-center text-green-600">{seedMessage}</p>
                )}

                <div className="border-t border-slate-100 pt-4 flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <UserPlus size={18} className="text-[#00479e]" />
                    <h3 className="font-bold text-slate-900">Spieler verwalten</h3>
                  </div>
                  <form onSubmit={handleCreateUser} className="flex flex-col gap-2">
                    <label htmlFor="new-user-name" className="sr-only">Name des neuen Spielers</label>
                    <Input
                      id="new-user-name"
                      value={newUserName}
                      onChange={(event) => setNewUserName(event.target.value)}
                      placeholder="Name des neuen Spielers"
                      required
                    />
                    <Button
                      type="submit"
                      className="bg-[#00479e] text-white font-bold"
                    >
                      Spieler erstellen
                    </Button>
                  </form>
                  {userMessage && (
                    <p className="text-sm font-bold text-center text-green-600">{userMessage}</p>
                  )}
                </div>

                <div className="border-t border-slate-100 pt-4 flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <BarChart3 size={18} className="text-[#00479e]" />
                    <h3 className="font-bold text-slate-900">Spieler-RSVP-Statistik</h3>
                  </div>
                  <label htmlFor="stats-member-select" className="sr-only">Spieler für Statistik auswählen</label>
                  <select
                    id="stats-member-select"
                    value={selectedMemberId}
                    onChange={(event) => setSelectedMemberId(event.target.value)}
                    className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm"
                  >
                    <option value="">Spieler auswählen</option>
                    {members
                      .filter((member) => member.type !== 'admin')
                      .sort((a, b) => a.name.localeCompare(b.name))
                      .map((member) => (
                        <option key={member.id} value={member.id}>
                          {member.name}
                        </option>
                      ))}
                  </select>

                  {selectedMember && (
                    <>
                      <div className="rounded-lg bg-blue-50 p-3">
                        <div className="flex items-center justify-between text-sm font-bold text-blue-700">
                          <span>Teilnahmequote</span>
                          <span>{playerStats.participationPercentage}%</span>
                        </div>
                        <div className="mt-2 h-2 overflow-hidden rounded-full bg-blue-100">
                          <div
                            className="h-full rounded-full bg-[#00479e] transition-all"
                            style={{ width: `${playerStats.participationPercentage}%` }}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="rounded-lg bg-green-50 p-2">
                          <div className="text-lg font-black text-green-700">
                            {playerStats.accepted}
                          </div>
                          <div className="text-[10px] font-bold uppercase text-green-700">
                            Dabei
                          </div>
                        </div>
                        <div className="rounded-lg bg-red-50 p-2">
                          <div className="text-lg font-black text-red-700">
                            {playerStats.declined}
                          </div>
                          <div className="text-[10px] font-bold uppercase text-red-700">
                            Nicht dabei
                          </div>
                        </div>
                        <div className="rounded-lg bg-slate-100 p-2">
                          <div className="text-lg font-black text-slate-700">
                            {playerStats.open}
                          </div>
                          <div className="text-[10px] font-bold uppercase text-slate-700">
                            Offen
                          </div>
                        </div>
                      </div>
                      <div className="max-h-64 overflow-y-auto divide-y divide-slate-100 rounded-lg border border-slate-100">
                        {playerStats.events.map((event) => {
                          const status = event.status?.[selectedMember.id] || null;
                          return (
                            <div
                              key={event.id}
                              className="flex items-center justify-between px-3 py-2 text-sm"
                            >
                              <div className="min-w-0">
                                <div className="truncate font-semibold text-slate-900">
                                  {displayTerminTitle(event)}
                                </div>
                                <div className="text-xs text-slate-500">
                                  {event.date} · {event.type === 'spiel' ? 'Spiel' : 'Training'}
                                </div>
                              </div>
                              <span
                                className={`ml-2 shrink-0 text-xs font-bold ${
                                  status === 'accepted'
                                    ? 'text-green-700'
                                    : status === 'declined'
                                      ? 'text-red-700'
                                      : 'text-slate-500'
                                }`}
                              >
                                {status === 'accepted'
                                  ? 'Dabei'
                                  : status === 'declined'
                                    ? 'Nicht dabei'
                                    : 'Offen'}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        <button
          onClick={onLogout}
          className="flex items-center justify-center p-5 bg-white rounded-2xl border border-red-200 shadow-sm hover:bg-red-50 hover:border-red-300 transition-all active:scale-[0.98] group mt-8 w-full"
        >
          <div className="flex items-center gap-3 text-red-600">
            <LogOut size={20} strokeWidth={2.5} />
            <span className="font-bold text-[17px] tracking-tight uppercase">Abmelden</span>
          </div>
        </button>
      </div>
    </div>
  );
});

ProfileView.displayName = 'ProfileView';
