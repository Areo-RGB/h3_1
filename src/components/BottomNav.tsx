import React, { memo } from 'react';
import { User, Calendar as CalendarIcon, ClipboardList, Table } from 'lucide-react';
import { Tab } from '../types';

interface BottomNavProps {
  currentTab: Tab;
  setCurrentTab: (tab: Tab) => void;
}

const navItems = [
  { id: 'calendar', icon: CalendarIcon, label: 'Kalender' },
  { id: 'anwesenheit', icon: ClipboardList, label: 'Anwesenheit' },
  { id: 'tabelle', icon: Table, label: 'Tabelle' },
  { id: 'profile', icon: User, label: 'Profil' },
] as const;

export const BottomNav = memo(function BottomNav({ currentTab, setCurrentTab }: BottomNavProps) {
  return (
    <div className="sticky bottom-0 bg-white border-t border-slate-200 flex justify-around pb-safe z-50 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] shrink-0 h-[64px]">
      <div className="w-full max-w-md mx-auto flex h-full">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              id={`nav-item-${item.id}`}
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              className={`flex flex-col items-center justify-center flex-1 transition-colors h-full ${
                isActive ? 'bg-[#00479e] text-white' : 'bg-white text-slate-500 hover:bg-slate-50'
              }`}
            >
              <Icon size={22} strokeWidth={isActive ? 2 : 1.5} className="mb-1" />
              <span className={`text-[11px] font-medium`}>{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
});
