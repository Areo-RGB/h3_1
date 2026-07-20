import React, { memo } from 'react';
import { LucideIcon } from 'lucide-react';
import { Tab } from '../types';
import { BottomNav } from './BottomNav';

interface LayoutProps {
  title: string;
  icon: LucideIcon;
  headerExtra?: React.ReactNode;
  showHeader?: boolean;
  showFooter?: boolean;
  currentTab?: Tab;
  setCurrentTab?: (tab: Tab) => void;
  children: React.ReactNode;
}

export const Layout = memo(function Layout({
  title,
  icon: Icon,
  headerExtra,
  showHeader = true,
  showFooter = true,
  currentTab,
  setCurrentTab,
  children,
}: LayoutProps) {
  return (
    <div className="flex flex-col h-full bg-slate-50 overflow-hidden">
      {showHeader && (
        <header className="sticky top-0 z-30 flex flex-col gap-3 shrink-0 px-4 pt-4 pb-3 bg-white border-b border-slate-100 shadow-sm">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Icon size={28} className="text-black" strokeWidth={2.5} />
              <h2 className="text-3xl font-black uppercase tracking-tighter text-slate-900">{title}</h2>
            </div>
          </div>
          {headerExtra}
        </header>
      )}

      <main className="flex-1 flex flex-col min-h-0 overflow-y-auto overflow-x-hidden">
        {children}
      </main>

      {showFooter && currentTab && setCurrentTab && (
        <BottomNav currentTab={currentTab} setCurrentTab={setCurrentTab} />
      )}
    </div>
  );
});

Layout.displayName = 'Layout';
