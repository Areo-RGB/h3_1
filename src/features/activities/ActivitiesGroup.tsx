import React, { useState, memo } from 'react';
import { CalendarDays, ClipboardList, Plus } from 'lucide-react';
import { Member } from '../../types';
import { Button } from '../../components/ui/button';
import { CalendarView } from '../calendar/CalendarView';
import { AnwesenheitView } from '../polls/AnwesenheitView';
import { EventChoiceModal } from '../../components/EventChoiceModal';

interface ActivitiesGroupProps {
  currentUser: Member;
  onNavigateToCreate: (
    view: 'create-training' | 'create-spiel' | 'create-turnier' | 'create-event',
  ) => void;
}

export const ActivitiesGroup = memo(function ActivitiesGroup({
  currentUser,
  onNavigateToCreate,
}: ActivitiesGroupProps) {
  const [subTab, setSubTab] = useState<'calendar' | 'polls'>('calendar');
  const [showChoiceModal, setShowChoiceModal] = useState(false);

  return (
    <div id="activities-group-container" className="flex flex-col h-full bg-slate-50 overflow-hidden">
      {/* Unified Group Header */}
      <div id="activities-group-header" className="sticky top-0 z-30 flex flex-col gap-3 shrink-0 px-4 pt-4 pb-3 bg-white border-b border-slate-100 shadow-sm">
        <div id="activities-header-row" className="flex justify-between items-center">
          <div id="activities-title-box" className="flex items-center gap-2">
            <CalendarDays id="activities-title-icon" size={28} className="text-black" strokeWidth={2.5} />
            <h2 id="activities-group-title" className="text-3xl font-black uppercase tracking-tighter text-slate-900">Aktivitäten</h2>
          </div>
          {subTab === 'calendar' && currentUser.type === 'admin' && (
            <Button
              id="activities-create-btn"
              onClick={() => setShowChoiceModal(true)}
              className="bg-[#00479e] hover:bg-[#003a82] text-white flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-bold shadow-sm transition-all"
            >
              <Plus id="activities-plus-icon" size={16} strokeWidth={3} /> Erstellen
            </Button>
          )}
        </div>

        {/* Segmented Control / Collation Tabs */}
        <div id="activities-subtab-switcher" className="flex bg-slate-100/80 rounded-xl p-1 border border-slate-200/60">
          <button
            id="activities-subtab-calendar"
            onClick={() => setSubTab('calendar')}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 ${
              subTab === 'calendar'
                ? 'bg-white text-[#00479e] shadow-[0_1px_3px_rgba(0,0,0,0.1)]'
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
            }`}
          >
            <CalendarDays size={16} />
            <span>Kalender</span>
          </button>
          <button
            id="activities-subtab-polls"
            onClick={() => setSubTab('polls')}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 ${
              subTab === 'polls'
                ? 'bg-white text-[#00479e] shadow-[0_1px_3px_rgba(0,0,0,0.1)]'
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
            }`}
          >
            <ClipboardList size={16} />
            <span>Abfragen</span>
          </button>
        </div>
      </div>

      {/* Render sub-view content */}
      <div id="activities-group-content" className="flex-1 min-h-0 overflow-hidden relative">
        {subTab === 'calendar' ? (
          <CalendarView
            currentUser={currentUser}
            onNavigateToCreate={onNavigateToCreate}
            showHeader={false}
          />
        ) : (
          <AnwesenheitView
            currentUser={currentUser}
            hideTitle={true}
          />
        )}
      </div>

      <EventChoiceModal
        isOpen={showChoiceModal}
        onClose={() => setShowChoiceModal(false)}
        onSelect={(choice) => onNavigateToCreate(`create-${choice}` as 'create-training' | 'create-spiel')}
      />
    </div>
  );
});

ActivitiesGroup.displayName = 'ActivitiesGroup';
