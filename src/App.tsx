/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useCallback, lazy, Suspense } from 'react';
import { Tab, Member } from './types';
import { useIsMobile } from './hooks/use-mobile';
import { InstallPrompt } from './components/InstallPrompt';

// Lazy load views for bundle size optimization
const ActivitiesGroup = lazy(() =>
  import('./features/activities/ActivitiesGroup').then((m) => ({ default: m.ActivitiesGroup })),
);
const TeamGroup = lazy(() =>
  import('./features/team/TeamGroup').then((m) => ({ default: m.TeamGroup })),
);
const ProfileView = lazy(() =>
  import('./features/auth/ProfileView').then((m) => ({ default: m.ProfileView })),
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
  const [currentTab, setCurrentTab] = useState<Tab>('activities');
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
    setCurrentTab('activities');
  }, []);

  return (
    <div id="app-root" className="h-[100dvh] overflow-hidden bg-white text-[#333] font-sans selection:bg-[#00479e] selection:text-white flex items-center justify-center">
      <div
        id="app-container"
        className={`w-full ${isMobile ? 'max-w-full h-[100dvh]' : 'max-w-md h-[800px] my-8 rounded-3xl border-8 border-slate-800'} bg-white relative shadow-2xl flex flex-col overflow-hidden`}
      >
        <InstallPrompt />
        <main id="app-main" className="flex-1 flex flex-col min-h-0 overflow-y-auto overflow-x-hidden">
          <Suspense fallback={<ViewLoader />}>
            {!currentUser ? (
              <LoginView onLogin={handleLogin} />
            ) : (
              <>
                {currentTab === 'activities' && (
                  <ActivitiesGroup currentUser={currentUser} currentTab={currentTab} setCurrentTab={setCurrentTab} />
                )}
                {currentTab === 'team' && (
                  <TeamGroup currentTab={currentTab} setCurrentTab={setCurrentTab} />
                )}
                {currentTab === 'profile' && (
                  <ProfileView currentUser={currentUser} onLogout={handleLogout} currentTab={currentTab} setCurrentTab={setCurrentTab} />
                )}
              </>
            )}
          </Suspense>
        </main>
      </div>
    </div>
  );
}
