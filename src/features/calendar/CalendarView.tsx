import React, { memo } from 'react';
import { CalendarDays } from 'lucide-react';

interface CalendarViewProps {
  showHeader?: boolean;
}

export const CalendarView = memo(function CalendarView({ showHeader = true }: CalendarViewProps) {
  return (
    <div className="flex flex-col h-full bg-slate-50 overflow-hidden view-layout">
      {showHeader && (
        <div id="events-dashboard-header" className="sticky top-0 z-30 flex justify-between items-center mb-3 shrink-0 px-3 py-3 bg-white border-b border-slate-100">
          <div className="flex items-center gap-2">
            <CalendarDays size={28} className="text-black" strokeWidth={2.5} />
            <h2 id="events-dashboard-title" className="text-3xl font-black uppercase tracking-tighter">Kalender</h2>
          </div>
        </div>
      )}
      <div className="flex-1 w-full p-2 bg-white">
        <iframe 
          src="https://calendar.google.com/calendar/embed?height=600&wkst=2&ctz=Europe%2FBerlin&showPrint=0&showTz=0&showCalendars=0&showTabs=0&showDate=0&showNav=0&showTitle=0&src=MDlkM2E0OTEyYzFmMDE4OTM1NmUyZWZmZmFmZDhlZWRhZmJhYmVkYjc5YjNhNmE0MDgwZWQ0N2RhZGNiNjYyNkBncm91cC5jYWxlbmRhci5nb29nbGUuY29t&color=%237986cb" 
          style={{ border: 0 }}
          className="w-full h-full rounded-md"
          frameBorder="0" 
          scrolling="no"
          title="Team Calendar"
        />
      </div>
    </div>
  );
});
