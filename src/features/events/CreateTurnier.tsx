import React, { useState, useCallback } from 'react';
import { Clock, MapPin } from 'lucide-react';
import { ViewHeader } from '../../components/ui/ViewHeader';
import { FormSection } from '../../components/ui/FormSection';
import { BottomAction } from '../../components/ui/BottomAction';
import { Input } from '../../components/ui/input';
import { Field, FieldLabel } from '../../components/ui/field';
import { createEvent } from '../../lib/dataRepository';
import { OtherTermin } from '../../types';

interface CreateTurnierProps {
  onBack: () => void;
  onSuccess: () => void;
}

export const CreateTurnier: React.FC<CreateTurnierProps> = ({ onBack, onSuccess }) => {
  const [title, setTitle] = useState('');
  const [infos, setInfos] = useState('');
  const [date, setDate] = useState('');
  const [treffTime, setTreffTime] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('18:00');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!title.trim() || !date) return;
      setLoading(true);

      try {
        const [year, month, day] = date.split('-').map(Number);
        const d = new Date(year, month - 1, day);
        const daysShort = ['So.', 'Mo.', 'Di.', 'Mi.', 'Do.', 'Fr.', 'Sa.'];
        const dayShort = daysShort[d.getDay()];
        const dStr = `${day.toString().padStart(2, '0')}.${month.toString().padStart(2, '0')}`;

        const newTermin: Omit<OtherTermin, 'id'> = {
          type: 'turnier',
          title: title.trim(),
          date: dStr,
          day: dayShort,
          fullDate: date,
          startTime,
          endTime,
          treffTime,
          address,
          additionalInfo: infos,
          status: {},
        };

        await createEvent(newTermin);
        onSuccess();
      } catch (error) {
        console.error('Error creating turnier:', error);
      } finally {
        setLoading(false);
      }
    },
    [title, infos, date, treffTime, startTime, endTime, address, onSuccess],
  );

  return (
    <div className="animate-in slide-in-from-right duration-300 flex flex-col h-full bg-white overflow-hidden">
      <ViewHeader id="create-turnier" title="Turnier erstellen" onBack={onBack} />
      <form
        onSubmit={handleSubmit}
        className="flex-1 overflow-y-auto p-4 pb-32 flex flex-col gap-8"
      >
        <FormSection id="turnier-basic">
          <Field id="field-title">
            <FieldLabel>Turnier Name</FieldLabel>
            <Input
              id="input-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="z.B. Hallenturnier Cup"
              required
            />
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
            <FieldLabel>Adresse / Location</FieldLabel>
            <Input
              id="input-address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="z.B. Sporthalle Süd"
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
              placeholder="Details zum Turnier..."
              className="flex min-h-[100px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-[#00479e]"
            />
          </Field>
        </FormSection>

        <BottomAction
          id="submit-turnier"
          label="Turnier erstellen"
          type="submit"
          loading={loading}
        />
      </form>
    </div>
  );
};
