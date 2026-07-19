import React, { useState, useCallback } from 'react';
import { CalendarDays, Info, Clock, MapPin } from 'lucide-react';
import { ViewHeader } from '../../components/ui/ViewHeader';
import { FormSection } from '../../components/ui/FormSection';
import { BottomAction } from '../../components/ui/BottomAction';
import { Input } from '../../components/ui/input';
import { Field, FieldLabel } from '../../components/ui/field';
import { createEvents } from '../../lib/dataRepository';
import { Termin } from '../../types';

interface CreateTrainingProps {
  onBack: () => void;
  onSuccess: () => void;
}

export const CreateTraining: React.FC<CreateTrainingProps> = ({ onBack, onSuccess }) => {
  const [name, setName] = useState('Mannschaftstraining');
  const [wochentag, setWochentag] = useState('Dienstag');
  const [intervall, setIntervall] = useState('Wöchentlich');
  const [infos, setInfos] = useState('');

  // Series Range
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [signupStart] = useState('');
  const [signupEnd] = useState('');

  // Times
  const [treffTime, setTreffTime] = useState('');
  const [startTime, setStartTime] = useState('19:00');
  const [endTime, setEndTime] = useState('21:00');

  const [address, setAddress] = useState('Kunstrasenplatz');

  const [loading, setLoading] = useState(false);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!name.trim() || !startDate) return;

      setLoading(true);

      try {
        const seriesId = `series-${crypto.randomUUID()}`;

        const [sYear, sMonth, sDay] = startDate.split('-').map(Number);
        const start = new Date(sYear, sMonth - 1, sDay);

        let end: Date;
        if (endDate) {
          const [eYear, eMonth, eDay] = endDate.split('-').map(Number);
          end = new Date(eYear, eMonth - 1, eDay);
        } else {
          end = new Date(start.getTime() + 90 * 24 * 60 * 60 * 1000);
        }

        const events: Termin[] = [];
        const daysMap: Record<string, number> = {
          Sonntag: 0,
          Montag: 1,
          Dienstag: 2,
          Mittwoch: 3,
          Donnerstag: 4,
          Freitag: 5,
          Samstag: 6,
        };

        const targetDay = daysMap[wochentag] ?? 2;
        const current = new Date(start);
        while (current.getDay() !== targetDay) {
          current.setDate(current.getDate() + 1);
        }

        while (current <= end) {
          const id = `event-${crypto.randomUUID()}`;

          const daysShort = ['So.', 'Mo.', 'Di.', 'Mi.', 'Do.', 'Fr.', 'Sa.'];
          const dayShort = daysShort[current.getDay()];
          const curDay = current.getDate();
          const curMonth = current.getMonth() + 1;
          const curYear = current.getFullYear();

          const dStr = `${curDay.toString().padStart(2, '0')}.${curMonth.toString().padStart(2, '0')}`;
          const fullDate = `${curYear}-${curMonth.toString().padStart(2, '0')}-${curDay.toString().padStart(2, '0')}`;

          const newTermin: Termin = {
            id,
            type: 'training',
            title: name.trim(),
            date: dStr,
            day: dayShort,
            startTime,
            endTime,
            treffTime,
            address: address || 'Kunstrasenplatz',
            additionalInfo: infos,
            status: {},
            fullDate,
            seriesId,
            signupStart,
            signupEnd,
          };

          events.push(newTermin);
          current.setDate(current.getDate() + (intervall === 'Zweiwöchentlich' ? 14 : 7));
        }

        await createEvents(events);
        onSuccess();
      } catch (error) {
        console.error('Error creating training:', error);
      } finally {
        setLoading(false);
      }
    },
    [
      name,
      wochentag,
      intervall,
      infos,
      startDate,
      endDate,
      signupStart,
      signupEnd,
      treffTime,
      startTime,
      endTime,
      address,
      onSuccess,
    ],
  );

  return (
    <div className="animate-in slide-in-from-right duration-300 flex flex-col h-full bg-white overflow-hidden">
      <ViewHeader id="create-training" title="Training erstellen" onBack={onBack} />

      <form
        onSubmit={handleSubmit}
        className="flex-1 overflow-y-auto p-4 pb-32 flex flex-col gap-8"
      >
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3">
          <Info size={20} className="text-blue-600 shrink-0 mt-0.5" />
          <p className="text-sm text-blue-800 leading-relaxed">
            Trainings werden standardmäßig als Serie erstellt.
          </p>
        </div>

        <FormSection id="training-info">
          <Field id="field-name">
            <FieldLabel>Name des Trainings</FieldLabel>
            <Input
              id="input-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="z.B. Mannschaftstraining"
              required
            />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field id="field-wochentag">
              <FieldLabel>Wochentag</FieldLabel>
              <select
                id="select-wochentag"
                value={wochentag}
                onChange={(e) => setWochentag(e.target.value)}
                className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-[#00479e]"
              >
                {[
                  'Montag',
                  'Dienstag',
                  'Mittwoch',
                  'Donnerstag',
                  'Freitag',
                  'Samstag',
                  'Sonntag',
                ].map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </Field>
            <Field id="field-intervall">
              <FieldLabel>Intervall</FieldLabel>
              <select
                id="select-intervall"
                value={intervall}
                onChange={(e) => setIntervall(e.target.value)}
                className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-[#00479e]"
              >
                <option value="Wöchentlich">Wöchentlich</option>
                <option value="Zweiwöchentlich">Zweiwöchentlich</option>
              </select>
            </Field>
          </div>

          <Field id="field-infos">
            <FieldLabel>Zusätzliche Infos</FieldLabel>
            <textarea
              id="textarea-infos"
              value={infos}
              onChange={(e) => setInfos(e.target.value)}
              placeholder="Hinweise zum Training..."
              className="flex min-h-[80px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-[#00479e]"
            />
          </Field>
        </FormSection>

        <FormSection
          id="series-info"
          title="Zeitraum zum Erstellen"
          icon={<CalendarDays size={20} />}
        >
          <div className="grid grid-cols-2 gap-4">
            <Field id="field-start-date">
              <FieldLabel>Eintragen ab (Datum)</FieldLabel>
              <Input
                id="input-start-date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </Field>
            <Field id="field-end-date">
              <FieldLabel>Eintragen bis (Datum)</FieldLabel>
              <Input
                id="input-end-date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
              />
            </Field>
          </div>
        </FormSection>

        <FormSection id="timing-info" title="Uhrzeiten" icon={<Clock size={20} />}>
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
              <FieldLabel>Startzeit</FieldLabel>
              <Input
                id="input-start"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
              />
            </Field>
            <Field id="field-end">
              <FieldLabel>Endzeit</FieldLabel>
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
              placeholder="z.B. Kunstrasenplatz"
            />
          </Field>
        </FormSection>

        <BottomAction
          id="submit-training"
          label="Training erstellen"
          type="submit"
          loading={loading}
        />
      </form>
    </div>
  );
};
