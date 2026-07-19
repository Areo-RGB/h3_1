import { X } from 'lucide-react';
import { ReactNode } from 'react';

interface ActionDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

export function ActionDrawer({ isOpen, onClose, title = 'Optionen', children }: ActionDrawerProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-end">
      <button
        aria-label="Schließen"
        className="absolute inset-0 w-full h-full cursor-default bg-black/40 animate-in fade-in duration-200"
        onClick={onClose}
      />
      <div className="bg-white w-full max-w-md relative animate-in slide-in-from-bottom duration-300 rounded-t-xl overflow-hidden shadow-2xl">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-lg">{title}</h3>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-black/5 rounded-full transition-colors"
          >
            <X size={20} className="text-slate-500" />
          </button>
        </div>
        <div className="pb-safe">{children}</div>
      </div>
    </div>
  );
}
