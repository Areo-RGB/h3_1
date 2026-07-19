import React, { useState } from 'react';
import { Member } from '../../types';
import { Avatar, AvatarImage, AvatarFallback } from '../../components/ui/avatar';
import { LogIn } from 'lucide-react';
import { USERS } from '../../lib/users';

interface LoginViewProps {
  onLogin: (user: Member) => void;
}

export const LoginView = React.memo(({ onLogin }: LoginViewProps) => {
  const [members] = useState<Member[]>(() =>
    [...USERS].sort((a, b) => a.name.localeCompare(b.name)),
  );

  return (
    <div id="login-view-container" className="flex flex-col h-full bg-[#f8fafc] overflow-y-auto px-4 py-8">
      <div id="login-header" className="flex flex-col items-center mb-8">
        <div id="login-icon-box" className="size-16 bg-[#00479e] rounded-2xl flex items-center justify-center shadow-lg mb-4">
          <LogIn size={32} className="text-white" />
        </div>
        <h2 id="login-title" className="text-3xl font-black uppercase tracking-tighter text-slate-900">Anmeldung</h2>
      </div>

      <div id="login-main-section" className="max-w-md mx-auto w-full">
        <div id="login-inner-box" className="flex flex-col gap-6">
          <h3 id="login-instruction" className="text-xl font-bold text-slate-900 text-center">Wähle deinen Namen</h3>
          <div id="login-members-grid" className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {members.map((user) => (
              <button
                id={`login-user-btn-${user.id}`}
                key={user.id}
                onClick={() => onLogin(user)}
                className="flex flex-col items-center gap-3 p-4 bg-white border border-slate-200 rounded-2xl hover:border-[#00479e] hover:shadow-md transition-all active:scale-95"
              >
                <Avatar className="size-12 border-2 border-slate-50">
                  <AvatarImage src={user.avatarUrl || '/logo.webp'} className="object-cover" />
                  <AvatarFallback>{user.name[0]}</AvatarFallback>
                </Avatar>
                <span className="font-bold text-sm text-slate-900 truncate w-full px-1">
                  {user.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});

LoginView.displayName = 'LoginView';
