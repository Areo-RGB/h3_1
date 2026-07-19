import { Shield, Plus, ChevronRight, Crown } from 'lucide-react';
import React, { useState, useEffect, memo } from 'react';
import { watchMembers } from '../../lib/dataRepository';
import { Member } from '../../types';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import FussballSquad from '../../components/FussballSquad';

export const TeamView = memo(() => {
  const [members, setMembers] = useState<Member[]>([]);
  
  useEffect(() => {
    return watchMembers((data) => {
      setMembers(Object.keys(data).map((key) => ({ ...data[key], id: key })));
    });
  }, []);

  return (
    <div id="team-view" className="view-base pb-12 overflow-y-auto h-full">
      <div id="team-view-header" className="flex items-center gap-3 mb-6 mt-4 px-4">
        <Shield size={32} strokeWidth={2.5} className="text-black" />
        <h1 id="team-view-title" className="text-3xl font-black tracking-tight text-black uppercase">Team</h1>
      </div>

      <div className="px-4 mb-8">
        <Button className="w-full text-[17px] py-6 font-bold flex items-center justify-center gap-2 bg-slate-900 text-white rounded-2xl shadow-lg active:scale-[0.98]">
          <Plus size={20} strokeWidth={3} /> Mitglieder einladen
        </Button>
      </div>

      <div className="mb-8 px-4">
        <h3 className="text-xl font-bold text-slate-900 mb-4">Offizieller Kader (FUSSBALL.de)</h3>
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden min-h-[600px] w-full max-w-full">
          <FussballSquad />
        </div>
      </div>

      <div className="mb-8">
        <div className="px-4 mb-4">
          <h3 className="text-xl font-bold text-slate-900">App-Mitglieder ({members.length})</h3>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-6 scrollbar-hide px-4">
          {members.length === 0 ? (
            <div className="text-sm text-slate-500 italic">Keine Mitglieder gefunden.</div>
          ) : (
            members.map((member) => (
              <Card
                key={member.id}
                className="min-w-[150px] flex flex-col items-center border border-slate-100 cursor-pointer hover:shadow-xl transition-all shrink-0 pt-6 pb-6 rounded-3xl bg-white shadow-sm"
              >
                <CardContent className="p-0 flex flex-col items-center">
                  <Avatar className="size-20 mb-4 border-2 border-slate-50 shadow-sm">
                    <AvatarImage src="/logo.webp" alt="Avatar" className="object-cover" />
                    <AvatarFallback>{member.name[0]}</AvatarFallback>
                  </Avatar>
                  <span className="font-bold text-slate-900 mb-1">{member.name}</span>
                  <div
                    className={`px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest ${member.type === 'admin' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}
                  >
                    {member.type}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      <div className="flex flex-col gap-3 px-4">
        {[
          { icon: Crown, label: 'Kontaktliste' },
          { icon: Shield, label: 'Teamprofil' },
          { icon: Crown, label: 'Rollen & Berechtigungen' },
        ].map((item, idx) => (
          <button
            key={idx}
            className="flex items-center justify-between p-5 bg-white rounded-2xl border border-slate-100 shadow-sm hover:bg-slate-50 transition-all"
          >
            <div className="flex items-center gap-4 text-slate-900">
              <div className="p-2 bg-slate-50 rounded-xl">
                <item.icon size={22} />
              </div>
              <span className="font-bold text-[17px]">{item.label}</span>
            </div>
            <ChevronRight size={20} className="text-slate-400" />
          </button>
        ))}
      </div>
    </div>
  );
});

TeamView.displayName = 'TeamView';
