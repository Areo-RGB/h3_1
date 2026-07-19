import React, { useState, memo } from 'react';
import { Shield, Table } from 'lucide-react';
import { TeamView } from './TeamView';
import { TabelleView } from '../tabelle/TabelleView';

export const TeamGroup = memo(function TeamGroup() {
  const [subTab, setSubTab] = useState<'squad' | 'tabelle'>('squad');

  return (
    <div id="team-group-container" className="flex flex-col h-full bg-slate-50 overflow-hidden">
      {/* Unified Group Header */}
      <div id="team-group-header" className="sticky top-0 z-30 flex flex-col gap-3 shrink-0 px-4 pt-4 pb-3 bg-white border-b border-slate-100 shadow-sm">
        <div id="team-header-row" className="flex justify-between items-center">
          <div id="team-title-box" className="flex items-center gap-2">
            <Shield id="team-title-icon" size={28} className="text-black" strokeWidth={2.5} />
            <h2 id="team-group-title" className="text-3xl font-black uppercase tracking-tighter text-slate-900">Team & Liga</h2>
          </div>
        </div>

        {/* Segmented Control / Collation Tabs */}
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
      </div>

      {/* Render sub-view content */}
      <div id="team-group-content" className="flex-1 min-h-0 overflow-hidden relative">
        {subTab === 'squad' ? (
          <TeamView />
        ) : (
          <TabelleView />
        )}
      </div>
    </div>
  );
});

TeamGroup.displayName = 'TeamGroup';
