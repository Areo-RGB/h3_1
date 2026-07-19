import React, { useState, memo } from 'react';
import { MoreVertical, Check } from 'lucide-react';
import { Button } from '../ui/button';
import {
  ListCard,
  ListCardHeader,
  ListCardTitle,
  ListCardSubtitle,
  ListCardActions,
  ListCardActionButton,
  ListCardBody,
} from '../ui/ListCard';

interface UmfrageCardProps {
  key?: React.Key;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  iconColorClass: string;
  options?: string[];
  votes: Record<string, string>; // userId -> voteValue
  isExpanded: boolean;
  onToggleExpand: () => void;
  onMenuClick: (e: React.MouseEvent) => void;
  currentUserVote?: string;
  onVote: (vote: string | null) => void;
  isAdmin?: boolean;
  status?: 'laufend' | 'beendet';
}

export const UmfrageCard = memo(function UmfrageCard({
  title,
  subtitle,
  icon,
  iconColorClass,
  options = ['Ja', 'Nein'],
  votes,
  isExpanded,
  onToggleExpand,
  onMenuClick,
  currentUserVote,
  onVote,
  isAdmin,
  status = 'laufend',
}: UmfrageCardProps) {
  const [selection, setSelection] = useState<string | null>(currentUserVote || null);

  React.useEffect(() => {
    setSelection(currentUserVote || null);
  }, [currentUserVote]);

  const handleVote = (newSelection: string) => {
    if (status === 'beendet') return;
    if (selection === newSelection) {
      setSelection(null);
    } else {
      setSelection(newSelection);
    }
  };

  const submitVote = () => {
    onVote(selection);
  };

  const getVoteCount = (option: string) => {
    return Object.values(votes).filter((v) => v === option).length;
  };

  return (
    <ListCard>
      <ListCardHeader onClick={onToggleExpand}>
        <div className="flex items-center gap-3 py-3 px-4 flex-1">
          <div
            className={`flex items-center justify-center border rounded-full p-2 shrink-0 ${iconColorClass}`}
          >
            {icon}
          </div>
          <div className="min-w-0">
            <ListCardTitle className="flex items-center gap-2">
              {title}
              {status === 'beendet' && (
                <span className="text-[10px] font-black uppercase tracking-widest bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded leading-none">
                  Beendet
                </span>
              )}
            </ListCardTitle>
            <ListCardSubtitle className="mt-0">{subtitle}</ListCardSubtitle>
          </div>
        </div>

        <ListCardActions>
          {isAdmin && (
            <ListCardActionButton
              widthClass="px-4"
              onClick={(e) => {
                e.stopPropagation();
                onMenuClick(e);
              }}
            >
              <MoreVertical className="text-slate-400" size={20} />
            </ListCardActionButton>
          )}
        </ListCardActions>
      </ListCardHeader>

      {isExpanded && (
        <ListCardBody>
          <div className="flex flex-col p-4 gap-3">
            {options.map((option) => {
              const count = getVoteCount(option);
              return (
                <button
                  key={option}
                  type="button"
                  className={`flex items-center w-full rounded-xl p-3.5 transition-colors text-left ${status === 'beendet' ? 'bg-slate-50 cursor-default opacity-80' : 'bg-slate-100 cursor-pointer'}`}
                  onClick={() => handleVote(option)}
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div
                      className={`size-5 rounded-full border-2 flex items-center justify-center ${selection === option ? 'border-[#00479e]' : 'border-slate-400'}`}
                    >
                      {selection === option && (
                        <div className="w-2.5 h-2.5 bg-[#00479e] rounded-full" />
                      )}
                    </div>
                    <span className="text-[16px] text-slate-800 font-medium">{option}</span>
                  </div>
                  <span className="text-[15px] text-slate-500">
                    {count} {count === 1 ? 'Stimme' : 'Stimmen'}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="p-4 border-t border-slate-100 bg-white">
            <Button
              variant={status === 'beendet' ? 'ghost' : 'outline'}
              onClick={submitVote}
              disabled={status === 'beendet' || selection === (currentUserVote || null)}
              className="w-full py-6 font-semibold"
            >
              {status === 'beendet' ? (
                'Abstimmung beendet'
              ) : selection === (currentUserVote || null) && currentUserVote ? (
                <div className="flex items-center gap-2">
                  <Check size={20} className="text-[#00479e]" />
                  Abgestimmt
                </div>
              ) : (
                'Abstimmen'
              )}
            </Button>
          </div>
        </ListCardBody>
      )}
    </ListCard>
  );
});
