import React, { useState } from 'react';
import { Member } from '../../types';
import { Layout } from '../../components/Layout';
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
    <Layout title="Anmeldung" icon={LogIn} showFooter={false}>
      <div id="login-main-section" className="flex-1 p-4 max-w-md mx-auto w-full">
        <div id="login-inner-box" className="flex flex-col gap-6">
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
    </Layout>
  );
});

LoginView.displayName = 'LoginView';
