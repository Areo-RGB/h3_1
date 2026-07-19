import { ReactNode } from 'react';

interface ActionDrawerItemProps {
  icon?: ReactNode;
  label: string;
  onClick: () => void;
  colorClass?: string;
  showBorder?: boolean;
}

export function ActionDrawerItem({
  icon,
  label,
  onClick,
  colorClass = 'text-black',
  showBorder = false,
}: ActionDrawerItemProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-4 py-4 hover:bg-slate-50 transition-colors font-medium flex items-center gap-2 ${colorClass} ${showBorder ? 'border-b border-slate-100' : ''}`}
    >
      {icon && icon}
      <span>{label}</span>
    </button>
  );
}
