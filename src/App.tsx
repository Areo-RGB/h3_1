/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useCallback, lazy, Suspense } from 'react';
import { HeaderNav } from './components/HeaderNav';
import { BottomNav } from './components/BottomNav';
import { Tab, Member } from './types';
import { useIsMobile } from './hooks/use-mobile';
import { InstallPrompt } from './components/InstallPrompt';

// Lazy load views for bundle size optimization
const TeamView = lazy(() =>
  import('./features/team/TeamView').then((m) => ({ default: m.TeamView })),
);
const ProfileView = lazy(() =>
  import('./features/auth/ProfileView').then((m) => ({ default: m.ProfileView })),
);
const CalendarView = lazy(() =>
  import('./features/calendar/CalendarView').then((m) => ({ default: m.CalendarView })),
);
const AnwesenheitView = lazy(() =>
  import('./features/polls/AnwesenheitView').then((m) => ({ default: m.AnwesenheitView })),
);

const CreateTraining = lazy(() =>
  import('./features/events/CreateTraining').then((m) => ({ default: m.CreateTraining })),
);
const CreateSpiel = lazy(() =>
  import('./features/events/CreateSpiel').then((m) => ({ default: m.CreateSpiel })),
);
const CreateTurnier = lazy(() =>
  import('./features/events/CreateTurnier').then((m) => ({ default: m.CreateTurnier })),
);
const CreateEvent = lazy(() =>
  import('./features/events/CreateEvent').then((m) => ({ default: m.CreateEvent })),
);


const LoginView = lazy(() =>
  import('./features/auth/LoginView').then((m) => ({ default: m.LoginView })),
);

// Loading component
const ViewLoader = () => (
  <div className="flex-1 flex items-center justify-center p-8 text-slate-400">
    <div className="flex flex-col items-center gap-2">
      <img src="/logo.webp" alt="Loading" className="size-16" />
      <span className="text-xs font-medium uppercase tracking-wider animate-pulse">
        Wird geladen...
      </span>
    </div>
  </div>
);

export default function App() {
  const [currentTab, setCurrentTab] = useState<Tab>('calendar');
  const [activeSubView, setActiveSubView] = useState<
    'none' | 'create-training' | 'create-spiel' | 'create-turnier' | 'create-event'
  >('none');
  const isMobile = useIsMobile(640);
  const [currentUser, setCurrentUser] = useState<Member | null>(() => {
    try {
      const stored = localStorage.getItem('h03_current_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const handleLogin = useCallback((user: Member) => {
    setCurrentUser(user);
    localStorage.setItem('h03_current_user', JSON.stringify(user));
  }, []);

  const handleLogout = useCallback(() => {
    setCurrentUser(null);
    localStorage.removeItem('h03_current_user');
    setCurrentTab('calendar');
    setActiveSubView('none');
  }, []);

  if (!currentUser) {
    return (
      <div id="app-root-login" className="h-[100dvh] overflow-hidden bg-white text-[#333] font-sans selection:bg-[#00479e] selection:text-white flex items-center justify-center">
        <div
          id="app-container-login"
          className={`w-full ${isMobile ? 'max-w-full h-[100dvh]' : 'max-w-md h-[800px] my-8 rounded-3xl'} bg-white relative shadow-2xl flex flex-col overflow-hidden`}
        >
          <HeaderNav />
          <InstallPrompt />
          <main id="app-main-login" className="pb-0 flex-1 flex flex-col min-h-0 overflow-y-auto overflow-x-hidden bg-slate-50">
            <Suspense fallback={<ViewLoader />}>
              <LoginView onLogin={handleLogin} />
            </Suspense>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div id="app-root-main" className="h-[100dvh] overflow-hidden bg-white text-[#333] font-sans selection:bg-[#00479e] selection:text-white flex items-center justify-center">
      <div
        id="app-container-main"
        className={`w-full ${isMobile ? 'max-w-full h-[100dvh]' : 'max-w-md h-[800px] my-8 rounded-3xl border-8 border-slate-800'} bg-white relative shadow-2xl flex flex-col overflow-hidden`}
      >
        {activeSubView === 'none' && currentTab !== 'profile' && <HeaderNav />}
        <InstallPrompt />
        <main id="app-main-content" className="pb-0 flex-1 flex flex-col min-h-0 overflow-y-auto overflow-x-hidden">
          <Suspense fallback={<ViewLoader />}>
            {activeSubView === 'none' ? (
              <>
                {currentTab === 'team' && <TeamView />}
                {currentTab === 'calendar' && (
                  <CalendarView
                    currentUser={currentUser}
                    onNavigateToCreate={(view) => setActiveSubView(view)}
                  />
                )}
                {currentTab === 'anwesenheit' && <AnwesenheitView currentUser={currentUser} />}
                {currentTab === 'profile' && (
                  <ProfileView currentUser={currentUser} onLogout={handleLogout} />
                )}
              </>
            ) : (
              <>
                {activeSubView === 'create-training' && (
                  <CreateTraining
                    onBack={() => setActiveSubView('none')}
                    onSuccess={() => {
                      setActiveSubView('none');
                      setCurrentTab('calendar');
                    }}
                  />
                )}
                {activeSubView === 'create-spiel' && (
                  <CreateSpiel
                    onBack={() => setActiveSubView('none')}
                    onSuccess={() => {
                      setActiveSubView('none');
                      setCurrentTab('calendar');
                    }}
                  />
                )}
                {activeSubView === 'create-turnier' && (
                  <CreateTurnier
                    onBack={() => setActiveSubView('none')}
                    onSuccess={() => {
                      setActiveSubView('none');
                      setCurrentTab('calendar');
                    }}
                  />
                )}
                {activeSubView === 'create-event' && (
                  <CreateEvent
                    onBack={() => setActiveSubView('none')}
                    onSuccess={() => {
                      setActiveSubView('none');
                      setCurrentTab('calendar');
                    }}
                  />
                )}

              </>
            )}
          </Suspense>
        </main>
        {activeSubView === 'none' && (
          <BottomNav currentTab={currentTab} setCurrentTab={setCurrentTab} />
        )}
      </div>
    </div>
  );
}
