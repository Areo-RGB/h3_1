import React, { memo } from 'react';
import { Table } from 'lucide-react';

export const TabelleView = memo(function TabelleView() {
  return (
    <div className="flex flex-col h-full bg-slate-50 overflow-hidden view-layout">
      <div id="events-dashboard-header" className="hidden sticky top-0 z-30 justify-between items-center shrink-0 px-3 py-3 bg-white border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Table size={28} className="text-black" strokeWidth={2.5} />
          <h2 id="events-dashboard-title" className="text-3xl font-black uppercase tracking-tighter">Tabelle</h2>
        </div>
      </div>
      <div className="flex-1 w-full p-2 bg-white overflow-y-auto scrollbar-hide">
        <iframe 
          className="scrollbar-hide"
          src="https://fussball-proxy.paziske.workers.dev/widget/competition/9f997bf6-4621-497b-868c-8036198457ab" 
          width="100%" 
          height="100%" 
          style={{ border: 'none', minHeight: '600px' }}
          title="Fussball.de Widget">
        </iframe>
      </div>
    </div>
  );
});
