import React, { useState, memo } from 'react';
import { CalendarDays, ClipboardList } from 'lucide-react';
import { Member, Tab } from '../../types';
import { Layout } from '../../components/Layout';
import { CalendarView } from '../calendar/CalendarView';
import { AnwesenheitView } from '../polls/AnwesenheitView';

interface ActivitiesGroupProps {
  currentUser: Member;
  currentTab: Tab;
  setCurrentTab: (tab: Tab) => void;
}

export const ActivitiesGroup = memo(function ActivitiesGroup({
  currentUser,
  currentTab,
  setCurrentTab,
}: ActivitiesGroupProps) {
  const [subTab, setSubTab] = useState<'calendar' | 'polls'>('calendar');

  const headerExtra = (
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
  );

  return (
    <Layout
      title="Aktivitäten"
      icon={CalendarDays}
      headerExtra={headerExtra}
      currentTab={currentTab}
      setCurrentTab={setCurrentTab}
    >
      {/* Render sub-view content */}
      <div id="activities-group-content" className="flex-1 min-h-0 overflow-hidden relative">
        {subTab === 'calendar' ? (
          <CalendarView
            showHeader={false}
          />
        ) : (
          <AnwesenheitView
            currentUser={currentUser}
            hideTitle={true}
          />
        )}
      </div>
    </Layout>
  );
});

ActivitiesGroup.displayName = 'ActivitiesGroup';
