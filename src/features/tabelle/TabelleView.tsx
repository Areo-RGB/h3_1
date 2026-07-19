import React, { memo, useEffect } from 'react';
import { Table } from 'lucide-react';

export const TabelleView = memo(function TabelleView() {
  useEffect(() => {
    // If the script is already loaded, we might need to tell it to parse again,
    // but the easiest way is to re-append or let it handle dynamically if it does.
    // Let's just ensure the script is present and potentially re-load it.
    const scriptId = 'fussball-widget-script';
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;
    
    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.type = 'text/javascript';
      script.src = 'https://www.fussball.de/widgets.js';
      script.async = true;
      document.body.appendChild(script);
    } else {
       // If it exists, we might need to re-trigger it. There might be a global function,
       // but typically fussball.de widgets self-initialize if we recreate the script.
       script.remove();
       const newScript = document.createElement('script');
       newScript.id = scriptId;
       newScript.type = 'text/javascript';
       newScript.src = 'https://www.fussball.de/widgets.js';
       newScript.async = true;
       document.body.appendChild(newScript);
    }
  }, []);

  return (
    <div className="flex flex-col h-full bg-slate-50 overflow-hidden view-layout">
      <div id="events-dashboard-header" className="hidden sticky top-0 z-30 justify-between items-center shrink-0 px-3 py-3 bg-white border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Table size={28} className="text-black" strokeWidth={2.5} />
          <h2 id="events-dashboard-title" className="text-3xl font-black uppercase tracking-tighter">Tabelle</h2>
        </div>
      </div>
      <div className="flex-1 w-full p-2 bg-white overflow-y-auto scrollbar-hide">
        <div 
          className="fussballde_widget"
          data-id="9f997bf6-4621-497b-868c-8036198457ab"
          data-type="competition"
          style={{ width: '100%' }}
        ></div>
      </div>
    </div>
  );
});
