import React, { useState, memo } from 'react';
import { Shield, Table } from 'lucide-react';
import { Tab } from '../../types';
import { Layout } from '../../components/Layout';
import { TeamView } from './TeamView';
import { TabelleView } from '../tabelle/TabelleView';

interface TeamGroupProps {
  currentTab: Tab;
  setCurrentTab: (tab: Tab) => void;
}

export const TeamGroup = memo(function TeamGroup({
  currentTab,
  setCurrentTab,
}: TeamGroupProps) {
  const [subTab, setSubTab] = useState<'squad' | 'tabelle'>('squad');

  const headerExtra = (
    <div id="team-subtab-switcher" className="flex bg-slate-100/80 rounded-xl p-1 border border-slate-200/60">
      <button
        id="team-subtab-squad"
        onClick={() => setSubTab('squad')}
        className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 ${
          subTab === 'squad'
            ? 'bg-white text-[#00479e] shadow-[0_1px_3px_rgba(0,0,0,0.1)]'
            : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
        }`}
      >
        <Shield size={16} />
        <span>Kader</span>
      </button>
      <button
        id="team-subtab-tabelle"
        onClick={() => setSubTab('tabelle')}
        className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 ${
          subTab === 'tabelle'
            ? 'bg-white text-[#00479e] shadow-[0_1px_3px_rgba(0,0,0,0.1)]'
            : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
        }`}
      >
        <Table size={16} />
        <span>Tabelle</span>
      </button>
    </div>
  );

  return (
    <Layout
      title="Liga"
      icon={Shield}
      headerExtra={headerExtra}
      currentTab={currentTab}
      setCurrentTab={setCurrentTab}
    >
      {/* Render sub-view content */}
      <div id="team-group-content" className="flex-1 min-h-0 overflow-hidden relative">
        {subTab === 'squad' ? (
          <TeamView />
        ) : (
          <TabelleView />
        )}
      </div>
    </Layout>
  );
});

TeamGroup.displayName = 'TeamGroup';
