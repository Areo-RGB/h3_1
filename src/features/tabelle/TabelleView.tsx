import React, { memo } from 'react';
import { Table } from 'lucide-react';

export const TabelleView = memo(function TabelleView() {
  return (
    <div className="flex flex-col h-full bg-slate-50 overflow-hidden view-layout">
      <div id="events-dashboard-header" className="sticky top-0 z-30 flex justify-between items-center shrink-0 px-3 py-3 bg-white border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Table size={28} className="text-black" strokeWidth={2.5} />
          <h2 id="events-dashboard-title" className="text-3xl font-black uppercase tracking-tighter">Tabelle</h2>
        </div>
      </div>
      <div className="flex-1 w-full p-2 bg-white overflow-y-auto">
        <iframe 
          src="https://www.fussball.de/widget/-/show/next-match/id/fc62edcb-85c3-4383-b34a-fca3feafb876" 
          width="100%" 
          height="600" 
          style={{ border: 'none', overflow: 'hidden' }}
          scrolling="no"
          title="Fussball.de Widget">
        </iframe>
      </div>
    </div>
  );
});
