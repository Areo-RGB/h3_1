import React, { memo, useState } from 'react';
import { ClipboardList } from 'lucide-react';
import { Member } from '../../types';

interface AnwesenheitViewProps {
  currentUser: Member | null;
  hideTitle?: boolean;
}

export const AnwesenheitView = memo(function AnwesenheitView({ currentUser, hideTitle = false }: AnwesenheitViewProps) {
  const [activeTab, setActiveTab] = useState<'training' | 'spiele'>('training');

  const trainingBaseUrl = "https://docs.google.com/forms/d/e/1FAIpQLSdr_dv4ue-WXtkRpmEFlKNIC1WRgE1bgBzTxsoRjhlkG3-hdg/viewform?embedded=true";
  const trainingNameParam = currentUser?.name ? `&entry.1364644614=${encodeURIComponent(currentUser.name)}` : '';
  const trainingFormUrl = `${trainingBaseUrl}${trainingNameParam}`;

  const spieleBaseUrl = "https://docs.google.com/forms/d/e/1FAIpQLSdgtDs9vgB7mQSEMZ7kNiqZQ6aqDgXiHjeQ-23edP9ahIh7DA/viewform?embedded=true";
  const spieleNameParam = currentUser?.name ? `&entry.999718010=${encodeURIComponent(currentUser.name)}` : '';
  const spieleFormUrl = `${spieleBaseUrl}${spieleNameParam}`;

  return (
    <div className="flex flex-col h-full bg-slate-50 overflow-hidden view-layout">
      {!hideTitle ? (
        <div id="events-dashboard-header" className="sticky top-0 z-30 flex flex-col gap-4 shrink-0 px-4 pt-4 pb-3 bg-white border-b border-slate-200 shadow-sm">
          <div className="flex items-center gap-2">
            <ClipboardList size={28} className="text-[#00479e]" strokeWidth={2.5} />
            <h2 id="events-dashboard-title" className="text-2xl font-black uppercase tracking-tighter text-slate-900">Anwesenheit</h2>
          </div>
          
          <div className="flex bg-slate-100/80 rounded-xl p-1 border border-slate-200/60">
            <button
              onClick={() => setActiveTab('training')}
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all duration-200 ${
                activeTab === 'training'
                  ? 'bg-white text-[#00479e] shadow-[0_1px_3px_rgba(0,0,0,0.1)]'
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
              }`}
            >
              Training
            </button>
            <button
              onClick={() => setActiveTab('spiele')}
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all duration-200 ${
                activeTab === 'spiele'
                  ? 'bg-white text-[#00479e] shadow-[0_1px_3px_rgba(0,0,0,0.1)]'
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
              }`}
            >
              Spiele
            </button>
          </div>
        </div>
      ) : (
        <div id="anwesenheit-embedded-tabs" className="bg-white px-4 py-2 border-b border-slate-100 flex flex-col gap-2 shrink-0">
          <div className="flex bg-slate-100/80 rounded-xl p-1 border border-slate-200/60">
            <button
              id="anwesenheit-training-tab"
              onClick={() => setActiveTab('training')}
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all duration-200 ${
                activeTab === 'training'
                  ? 'bg-white text-[#00479e] shadow-[0_1px_3px_rgba(0,0,0,0.1)]'
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
              }`}
            >
              Training
            </button>
            <button
              id="anwesenheit-spiele-tab"
              onClick={() => setActiveTab('spiele')}
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all duration-200 ${
                activeTab === 'spiele'
                  ? 'bg-white text-[#00479e] shadow-[0_1px_3px_rgba(0,0,0,0.1)]'
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
              }`}
            >
              Spiele
            </button>
          </div>
        </div>
      )}
      <div className="flex-1 w-full p-2 bg-white relative">
        {activeTab === 'training' && (
          <iframe 
            src={trainingFormUrl} 
            width="100%" 
            height="100%" 
            frameBorder="0" 
            marginHeight={0} 
            marginWidth={0}
            title="Umfrage Form"
            className="absolute inset-0 w-full h-full rounded-b-md"
          >
            Loading…
          </iframe>
        )}
        {activeTab === 'spiele' && (
          <iframe 
            src={spieleFormUrl} 
            width="100%" 
            height="100%" 
            frameBorder="0" 
            marginHeight={0} 
            marginWidth={0}
            title="Spiele Form"
            className="absolute inset-0 w-full h-full rounded-b-md"
          >
            Loading…
          </iframe>
        )}
      </div>
    </div>
  );
});
