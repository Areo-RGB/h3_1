import React, { useState, useEffect, useCallback, useMemo, memo } from 'react';
import { TerminStatus, Member, Termin } from '../../types';
import { TerminCard } from '../../components/home/TerminCard';
import { ActionDrawer } from '../../components/ui/ActionDrawer';
import { ActionDrawerItem } from '../../components/ui/ActionDrawerItem';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Field, FieldLabel } from '../../components/ui/field';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../../components/ui/dialog';
import {
  deleteEvent,
  deleteEvents,
  updateEvent,
  updateEvents,
  updateEventStatus,
  watchEvents,
} from '../../lib/dataRepository';
import { displayTerminTitle } from '../../lib/terminDisplay';
import FussballdeWidget from '../../components/FussballdeWidget';

const HOME_GAME_ADDRESS = 'Ernst-Reuter-Sportfeld';

function getISOWeekNumber(d: Date) {
  const date = new Date(d.getTime());
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + 3 - ((date.getDay() + 6) % 7));
  const week1 = new Date(date.getFullYear(), 0, 4);
  return (
    1 +
    Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + ((week1.getDay() + 6) % 7)) / 7)
  );
}

interface EventsDashboardProps {
  currentUser: Member;
}

export const EventsDashboard = memo(({ currentUser }: EventsDashboardProps) => {
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [termine, setTermine] = useState<Termin[]>([]);

  // Editing state
  const [editingTermin, setEditingTermin] = useState<Termin | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editDate, setEditDate] = useState('');
  const [editStartTime, setEditStartTime] = useState('');
  const [editEndTime, setEditEndTime] = useState('');
  const [editAddress, setEditAddress] = useState('');

  const groupedTermine = useMemo(() => {
    const trainings = termine
      .filter((termin) => termin.type === 'training' || termin.type === 'spiel')
      .sort((a, b) => (a.fullDate || '').localeCompare(b.fullDate || ''));
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const nextUpcomingId = trainings.find((termin) => {
      if (termin.type !== 'training' || !termin.fullDate) return false;
      return new Date(`${termin.fullDate}T00:00:00`) >= today;
    })?.id;
    const groups: Array<{ week: number; items: Termin[] }> = [];

    trainings.forEach((termin) => {
      const date = termin.fullDate ? new Date(`${termin.fullDate}T00:00:00`) : null;
      if (!date) return;
      const week = getISOWeekNumber(date);
      const group = groups.find((item) => item.week === week);
      if (group) group.items.push(termin);
      else groups.push({ week, items: [termin] });
    });

    return { groups, nextUpcomingId };
  }, [termine]);

  useEffect(() => {
    return watchEvents((data) => {
      setTermine(Object.keys(data).map((key) => ({ ...data[key], id: data[key].id || key })));
    });
  }, []);

  const handleDeleteTermin = useCallback(async (id: string | null) => {
    if (!id || !confirm('Möchtest du diesen Termin wirklich löschen?')) return;
    setActiveMenu(null);
    await deleteEvent(id);
  }, []);

  const handleDeleteSeries = useCallback(
    async (seriesId: string | null) => {
      if (!seriesId || !confirm('Möchtest du die gesamte Serie wirklich löschen?')) return;
      setActiveMenu(null);
      const seriesTermine = termine.filter((t) => t.seriesId === seriesId);
      await deleteEvents(seriesTermine.map((termin) => termin.id));
    },
    [termine],
  );

  const handleEditTerminOpen = useCallback(() => {
    if (activeMenu) {
      const termin = termine.find((t) => t.id === activeMenu);
      if (termin) {
        setEditingTermin(termin);
        setEditTitle(displayTerminTitle(termin));
        setEditDate(termin.date);
        setEditStartTime(termin.startTime || '');
        setEditEndTime(termin.endTime || '');
        setEditAddress(
          termin.type === 'spiel' && termin.isHome ? HOME_GAME_ADDRESS : termin.address || '',
        );
        setShowEditDialog(true);
      }
    }
    setActiveMenu(null);
  }, [activeMenu, termine]);

  const handleUpdateTermin = useCallback(
    async (e: React.FormEvent, updateSeries: boolean = false) => {
      e.preventDefault();
      if (!editingTermin) return;

      if (updateSeries && editingTermin.seriesId) {
        const seriesTermine = termine.filter((t) => t.seriesId === editingTermin.seriesId);
        await updateEvents(
          seriesTermine.map((termin) => termin.id),
          {
            title: editTitle.trim(),
            startTime: editStartTime,
            endTime: editEndTime,
            address: editAddress,
          },
        );
      } else {
        const updates = {
          title: editTitle.trim(),
          date: editDate,
          startTime: editStartTime,
          endTime: editEndTime,
          address:
            editingTermin.type === 'spiel' && editingTermin.isHome
              ? HOME_GAME_ADDRESS
              : editAddress,
        };
        await updateEvent(editingTermin.id, updates);
      }

      setShowEditDialog(false);
    },
    [editingTermin, termine, editTitle, editDate, editStartTime, editEndTime, editAddress],
  );

  const handleStatusUpdate = useCallback(
    (terminId: string, status: TerminStatus) => {
      const previousTermin = termine.find((termin) => termin.id === terminId);
      const previousStatus = previousTermin?.status?.[currentUser.id] || null;

      setTermine((current) =>
        current.map((termin) => {
          if (termin.id !== terminId) return termin;
          const nextStatus = { ...termin.status };
          if (status === null) delete nextStatus[currentUser.id];
          else nextStatus[currentUser.id] = status;
          return { ...termin, status: nextStatus };
        }),
      );

      void updateEventStatus(terminId, currentUser.id, status).catch((error) => {
        console.error(error);
        setTermine((current) =>
          current.map((termin) => {
            if (termin.id !== terminId) return termin;
            const nextStatus = { ...termin.status };
            if (previousStatus === null) delete nextStatus[currentUser.id];
            else nextStatus[currentUser.id] = previousStatus;
            return { ...termin, status: nextStatus };
          }),
        );
      });
    },
    [currentUser.id, termine],
  );

  return (
    <div id="events-dashboard-view" className="view-layout pb-8">
      <div className="px-3 pt-4 pb-2">
        <FussballdeWidget id="4406d4cd-6750-42ff-9e6a-616c8b66dc9e" type="next-match" />
      </div>
      {groupedTermine.groups.length === 0 ? (
        <div className="p-8 text-center text-slate-500 italic">Keine Termine vorhanden.</div>
      ) : (
        groupedTermine.groups.map((group) => (
          <section key={group.week}>
            <div className="flex items-center gap-3 px-3 py-3 mt-1">
              <span className="text-sm font-bold text-slate-500 uppercase tracking-wide">
                KW {group.week}
              </span>
              <div className="h-px flex-1 bg-slate-200" />
            </div>
            {group.items.map((termin) => (
              <div
                key={termin.id}
                className={
                  termin.id === groupedTermine.nextUpcomingId
                    ? 'ring-2 ring-[#00479e] ring-inset bg-blue-50/20'
                    : ''
                }
              >
                <TerminCard
                  day={termin.day}
                  date={termin.date}
                  title={displayTerminTitle(termin)}
                  className={termin.type === 'spiel' ? 'bg-blue-50/60' : undefined}
                  location={
                    termin.type === 'spiel'
                      ? termin.isHome
                        ? 'Heim'
                        : 'Auswärts'
                      : termin.type === 'training'
                        ? `Beginn ${termin.startTime || ''}`.trim()
                        : termin.address
                  }
                  status={termin.status?.[currentUser.id] || null}
                  onStatusUpdate={(newStatus) =>
                    handleStatusUpdate(
                      termin.id,
                      newStatus === (termin.status?.[currentUser.id] || null) ? null : newStatus,
                    )
                  }
                  isExpanded={!!expandedCards[termin.id]}
                  onToggleExpand={() =>
                    setExpandedCards((prev) => ({ ...prev, [termin.id]: !prev[termin.id] }))
                  }
                  onMenuClick={(e) => {
                    e.stopPropagation();
                    setActiveMenu(termin.id);
                  }}
                  isAdmin={currentUser.type === 'admin'}
                >
                  <div className="p-4 flex flex-col gap-3">
                    {termin.type === 'spiel' && (
                      <div className="flex flex-col gap-1 px-1">
                        <div className="flex items-center gap-2 text-slate-500 text-sm">
                          <div className="size-2 rounded-full bg-blue-500" /> Gegner
                        </div>
                        <div className="font-semibold text-black text-lg pl-4">
                          {termin.opponent || 'Gegner'}
                        </div>
                      </div>
                    )}
                    <div className="grid grid-cols-3 divide-x divide-slate-100">
                      {[
                        {
                          label: 'Treffen',
                          time: termin.startTime || (termin.type === 'spiel' ? '10:00' : '18:00'),
                        },
                        {
                          label: termin.type === 'spiel' ? 'Anpfiff' : 'Beginn',
                          time: termin.startTime || (termin.type === 'spiel' ? '11:00' : '18:30'),
                        },
                        {
                          label: 'Ende',
                          time: termin.endTime || (termin.type === 'spiel' ? '13:00' : '20:00'),
                        },
                      ].map((item, idx) => (
                        <div key={idx} className="text-center px-1">
                          <div className="font-bold text-black text-lg">{item.time}</div>
                          <div className="text-[12px] text-slate-500 uppercase">{item.label}</div>
                        </div>
                      ))}
                    </div>
                    {termin.additionalInfo && (
                      <div className="mt-2 p-3 bg-slate-50 rounded-lg text-sm text-slate-600 italic">
                        {termin.additionalInfo}
                      </div>
                    )}
                  </div>
                </TerminCard>
              </div>
            ))}
          </section>
        ))
      )}

      <ActionDrawer isOpen={activeMenu !== null} onClose={() => setActiveMenu(null)}>
        {currentUser.type === 'admin' && activeMenu && (
          <>
            <ActionDrawerItem label="Bearbeiten" onClick={handleEditTerminOpen} showBorder />
            {termine.find((t) => t.id === activeMenu)?.seriesId && (
              <ActionDrawerItem
                label="Ganze Serie löschen"
                onClick={() =>
                  handleDeleteSeries(termine.find((t) => t.id === activeMenu)?.seriesId || null)
                }
                colorClass="text-destructive"
                showBorder
              />
            )}
            <ActionDrawerItem
              label="Löschen"
              onClick={() => handleDeleteTermin(activeMenu)}
              colorClass="text-destructive"
            />
          </>
        )}
      </ActionDrawer>

      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Termin bearbeiten</DialogTitle>
          </DialogHeader>
          <form onSubmit={(e) => handleUpdateTermin(e, false)} className="flex flex-col gap-4">
            <Field>
              <FieldLabel>Titel</FieldLabel>
              <Input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} required />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel>Datum (DD.MM.)</FieldLabel>
                <Input value={editDate} onChange={(e) => setEditDate(e.target.value)} required />
              </Field>
              <Field>
                <FieldLabel>Ort</FieldLabel>
                <Input value={editAddress} onChange={(e) => setEditAddress(e.target.value)} />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel>Beginn</FieldLabel>
                <Input value={editStartTime} onChange={(e) => setEditStartTime(e.target.value)} />
              </Field>
              <Field>
                <FieldLabel>Ende</FieldLabel>
                <Input value={editEndTime} onChange={(e) => setEditEndTime(e.target.value)} />
              </Field>
            </div>
            <DialogFooter className="flex flex-col gap-2">
              <Button type="submit" className="bg-[#00479e] text-white w-full">
                Nur diesen Termin speichern
              </Button>
              {editingTermin?.seriesId && (
                <Button
                  type="button"
                  onClick={(e) => handleUpdateTermin(e, true)}
                  className="bg-slate-800 text-white w-full"
                >
                  Ganze Serie speichern
                </Button>
              )}
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowEditDialog(false)}
                className="w-full"
              >
                Abbrechen
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
});

EventsDashboard.displayName = 'EventsDashboard';
