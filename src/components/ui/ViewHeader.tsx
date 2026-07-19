import React from 'react';
import { ChevronLeft } from 'lucide-react';

interface ViewHeaderProps {
  id?: string;
  title: string;
  onBack?: () => void;
  rightAction?: React.ReactNode;
}

export const ViewHeader: React.FC<ViewHeaderProps> = ({ id, title, onBack, rightAction }) => {
  return (
    <div
      id={id}
      className="flex items-center justify-between p-4 sticky top-0 bg-white z-30 border-b border-slate-100 h-16 shrink-0"
    >
      <div className="flex items-center gap-3">
        {onBack && (
          <button
            id={`${id}-back`}
            onClick={onBack}
            className="p-1 -ml-1 hover:bg-slate-100 rounded-full transition-colors active:scale-90"
          >
            <ChevronLeft size={24} className="text-black" />
          </button>
        )}
        <h2 id={`${id}-title`} className="text-xl font-bold truncate">
          {title}
        </h2>
      </div>
      {rightAction && <div id={`${id}-right-action`}>{rightAction}</div>}
    </div>
  );
};
