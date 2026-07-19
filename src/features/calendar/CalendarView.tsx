import React, { memo, useState } from 'react';
import { CalendarDays, Plus } from 'lucide-react';
import { Member } from '../../types';
import { Button } from '../../components/ui/button';
import { EventChoiceModal } from '../../components/EventChoiceModal';

interface CalendarViewProps {
  currentUser: Member;
  onNavigateToCreate: (
    view: 'create-training' | 'create-spiel' | 'create-turnier' | 'create-event',
  ) => void;
}

export const CalendarView = memo(function CalendarView({ currentUser, onNavigateToCreate }: CalendarViewProps) {
  const [showChoiceModal, setShowChoiceModal] = useState(false);

  return (
    <div className="flex flex-col h-full bg-slate-50 overflow-hidden view-layout">
      <div id="events-dashboard-header" className="sticky top-0 z-30 flex justify-between items-center mb-3 shrink-0 px-3 py-3 bg-white border-b border-slate-100">
        <div className="flex items-center gap-2">
          <CalendarDays size={28} className="text-black" strokeWidth={2.5} />
          <h2 id="events-dashboard-title" className="text-3xl font-black uppercase tracking-tighter">Kalender</h2>
        </div>
        {currentUser.type === 'admin' && (
          <Button
            onClick={() => setShowChoiceModal(true)}
            className="bg-[#00479e] hover:bg-[#003a82] text-white flex items-center gap-2 px-4 py-2.5 rounded-xl text-base font-bold shadow-lg"
          >
            <Plus size={20} strokeWidth={3} /> Termin erstellen
          </Button>
        )}
      </div>
      <div className="flex-1 w-full p-2 bg-white">
        <iframe 
          src="https://calendar.google.com/calendar/embed?wkst=2&ctz=Europe%2FBerlin&showTabs=0&showCalendars=0&showTz=0&mode=MONTH&showPrint=0&src=MDlkM2E0OTEyYzFmMDE4OTM1NmUyZWZmZmFmZDhlZWRhZmJhYmVkYjc5YjNhNmE0MDgwZWQ0N2RhZGNiNjYyNkBncm91cC5jYWxlbmRhci5nb29nbGUuY29t&color=%237986cb" 
          style={{ border: 'solid 1px #777' }}
          className="w-full h-full rounded-md"
          frameBorder="0" 
          scrolling="no"
          title="Team Calendar"
        />
      </div>
      <EventChoiceModal
        isOpen={showChoiceModal}
        onClose={() => setShowChoiceModal(false)}
        onSelect={(choice) => onNavigateToCreate(`create-${choice}` as 'create-training' | 'create-spiel')}
      />
    </div>
  );
});
