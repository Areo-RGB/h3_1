import React, { memo } from 'react';
import { User, Calendar as CalendarIcon, Shield } from 'lucide-react';
import { Tab } from '../types';

interface BottomNavProps {
  currentTab: Tab;
  setCurrentTab: (tab: Tab) => void;
}

const navItems = [
  { id: 'activities', icon: CalendarIcon, label: 'Aktivitäten' },
  { id: 'team', icon: Shield, label: 'Liga' },
  { id: 'profile', icon: User, label: 'Profil' },
] as const;

export const BottomNav = memo(function BottomNav({ currentTab, setCurrentTab }: BottomNavProps) {
  return (
    <nav aria-label="Hauptnavigation" id="bottom-nav-container" className="sticky bottom-0 bg-white border-t border-slate-200 flex justify-around pb-safe z-50 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] shrink-0 h-[64px]">
      <div id="bottom-nav-wrapper" className="w-full max-w-md mx-auto flex h-full">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              id={`nav-item-${item.id}`}
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              aria-current={isActive ? 'page' : undefined}
              className={`flex flex-col items-center justify-center flex-1 transition-colors h-full focus-visible:outline-2 focus-visible:outline-offset-[-2px] ${
                isActive ? 'bg-[#00479e] text-white focus-visible:outline-white' : 'bg-white text-slate-500 hover:bg-slate-50 focus-visible:outline-[#00479e]'
              }`}
            >
              <Icon size={22} strokeWidth={isActive ? 2 : 1.5} className="mb-1" />
              <span className={`text-[11px] font-medium`}>{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
});
