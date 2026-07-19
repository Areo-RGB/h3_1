import React, { useState, useCallback } from 'react';
import { MapPin, Clock } from 'lucide-react';
import { ViewHeader } from '../../components/ui/ViewHeader';
import { FormSection } from '../../components/ui/FormSection';
import { BottomAction } from '../../components/ui/BottomAction';
import { Input } from '../../components/ui/input';
import { Field, FieldLabel } from '../../components/ui/field';
import { createEvent } from '../../lib/dataRepository';
import { SpielTermin } from '../../types';

const HOME_GAME_ADDRESS = 'Ernst-Reuter-Sportfeld';

interface CreateSpielProps {
  onBack: () => void;
  onSuccess: () => void;
}

export const CreateSpiel: React.FC<CreateSpielProps> = ({ onBack, onSuccess }) => {
  const [opponent, setOpponent] = useState('');
  const [isHome, setIsHome] = useState(true);
  const [spieltyp, setSpieltyp] = useState('Punktspiel');
  const [infos, setInfos] = useState('');

  const [date, setDate] = useState('');
  const [treffTime, setTreffTime] = useState('');
  const [startTime, setStartTime] = useState('15:00');
  const [endTime, setEndTime] = useState('');

  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!opponent.trim() || !date) return;

      setLoading(true);
      try {
        const [year, month, day] = date.split('-').map(Number);
        const d = new Date(year, month - 1, day);
        const daysShort = ['So.', 'Mo.', 'Di.', 'Mi.', 'Do.', 'Fr.', 'Sa.'];
        const dayShort = daysShort[d.getDay()];
        const dStr = `${day.toString().padStart(2, '0')}.${month.toString().padStart(2, '0')}`;

        const newTermin: Omit<SpielTermin, 'id'> = {
          type: 'spiel',
          opponent: opponent.trim(),
          isHome,
          spieltyp,
          title: opponent.trim(),
          date: dStr,
          day: dayShort,
          fullDate: date,
          startTime,
          endTime,
          treffTime,
          address: isHome ? HOME_GAME_ADDRESS : address.trim(),
          additionalInfo: infos,
          status: {},
        };

        await createEvent(newTermin);
        onSuccess();
      } catch (error) {
        console.error('Error creating spiel:', error);
      } finally {
        setLoading(false);
      }
    },
    [opponent, isHome, spieltyp, infos, date, treffTime, startTime, endTime, address, onSuccess],
  );

  return (
    <div className="animate-in slide-in-from-right duration-300 flex flex-col h-full bg-white overflow-hidden">
      <ViewHeader id="create-spiel" title="Spiel erstellen" onBack={onBack} />

      <form
        id="create-spiel-form"
        onSubmit={handleSubmit}
        className="flex-1 overflow-y-auto p-4 pb-32 flex flex-col gap-8"
      >
        <FormSection id="opponent-info">
          <Field id="field-opponent">
            <FieldLabel>Gegner</FieldLabel>
            <Input
              id="input-opponent"
              value={opponent}
              onChange={(e) => setOpponent(e.target.value)}
              placeholder="z.B. SV Adler Berlin"
              required
            />
          </Field>

          <div className="flex bg-slate-100 p-1 rounded-xl">
            <button
              id="toggle-home"
              type="button"
              onClick={() => setIsHome(true)}
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${isHome ? 'bg-white shadow-sm text-[#00479e]' : 'text-slate-500'}`}
            >
              Heimspiel
            </button>
            <button
              id="toggle-away"
              type="button"
              onClick={() => setIsHome(false)}
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${!isHome ? 'bg-white shadow-sm text-[#00479e]' : 'text-slate-500'}`}
            >
              Auswärts
            </button>
          </div>

          <Field id="field-type">
            <FieldLabel>Spieltyp</FieldLabel>
            <select
              id="select-type"
              value={spieltyp}
              onChange={(e) => setSpieltyp(e.target.value)}
              className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2"
            >
              <option value="Punktspiel">Punktspiel</option>
              <option value="Freundschaftsspiel">Freundschaftsspiel</option>
              <option value="Pokalspiel">Pokalspiel</option>
              <option value="Testspiel">Testspiel</option>
            </select>
          </Field>
        </FormSection>

        <FormSection id="timing-info" title="Datum & Uhrzeit" icon={<Clock size={20} />}>
          <Field id="field-date">
            <FieldLabel>Datum</FieldLabel>
            <Input
              id="input-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </Field>
          <div className="grid grid-cols-3 gap-3">
            <Field id="field-treff">
              <FieldLabel>Treffzeit</FieldLabel>
              <Input
                id="input-treff"
                type="time"
                value={treffTime}
                onChange={(e) => setTreffTime(e.target.value)}
              />
            </Field>
            <Field id="field-start">
              <FieldLabel>Anpfiff</FieldLabel>
              <Input
                id="input-start"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
              />
            </Field>
            <Field id="field-end">
              <FieldLabel>Ende</FieldLabel>
              <Input
                id="input-end"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </Field>
          </div>
        </FormSection>

        <FormSection id="location-info" title="Ort" icon={<MapPin size={20} />}>
          <Field id="field-address">
            <FieldLabel>Adresse</FieldLabel>
            <Input
              id="input-address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder={isHome ? 'Heimarena (eigene Adresse)' : 'Adresse des Gegners'}
            />
          </Field>
        </FormSection>

        <FormSection id="additional-info">
          <Field id="field-infos">
            <FieldLabel>Zusätzliche Infos</FieldLabel>
            <textarea
              id="textarea-infos"
              value={infos}
              onChange={(e) => setInfos(e.target.value)}
              placeholder="Wichtige Hinweise zum Spiel..."
              className="flex min-h-[100px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2"
            />
          </Field>
        </FormSection>

        <BottomAction id="submit-spiel" label="Spiel erstellen" type="submit" loading={loading} />
      </form>
    </div>
  );
};
