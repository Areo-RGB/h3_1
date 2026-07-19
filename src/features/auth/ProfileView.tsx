import { LogOut } from 'lucide-react';
import React from 'react';
import { Member } from '../../types';
import { Avatar, AvatarImage, AvatarFallback } from '../../components/ui/avatar';

interface ProfileViewProps {
  currentUser: Member;
  onLogout: () => void;
}

export const ProfileView = React.memo(({ currentUser, onLogout }: ProfileViewProps) => {
  return (
    <div id="profile-view" className="view-layout pb-10 overflow-y-auto h-full bg-[#f8fafc]">
      <div id="profile-view-header" className="flex flex-col items-center py-6 shrink-0">
        <Avatar className="size-28 border-4 border-white shadow-xl">
          <AvatarImage src={currentUser.avatarUrl || '/logo.webp'} className="object-cover" />
          <AvatarFallback>{currentUser.name[0]}</AvatarFallback>
        </Avatar>
        <h2 id="profile-view-name" className="text-2xl font-black uppercase tracking-tighter mt-4 text-slate-900">
          {currentUser.name}
        </h2>
        <p className="text-sm font-bold text-[#00479e] uppercase tracking-widest mt-1 opacity-70">
          {currentUser.type}
        </p>
      </div>

      <div id="profile-sections-list" className="px-4 flex flex-col gap-4">
        <button
          id="profile-logout-btn"
          onClick={onLogout}
          className="flex items-center justify-center p-5 bg-white rounded-2xl border border-red-200 shadow-sm hover:bg-red-50 hover:border-red-300 transition-all active:scale-[0.98] group mt-8 w-full"
        >
          <div id="profile-logout-content" className="flex items-center gap-3 text-red-600">
            <LogOut size={20} strokeWidth={2.5} />
            <span id="profile-logout-text" className="font-bold text-[17px] tracking-tight uppercase">Abmelden</span>
          </div>
        </button>
      </div>
    </div>
  );
});

ProfileView.displayName = 'ProfileView';
