import React from 'react';
import { Button } from './button';

interface BottomActionProps {
  id?: string;
  label: string;
  onClick?: () => void;
  type?: 'button' | 'submit';
  loading?: boolean;
  disabled?: boolean;
}

export const BottomAction: React.FC<BottomActionProps> = ({
  id,
  label,
  onClick,
  type = 'button',
  loading,
  disabled,
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-100 z-40">
      <div className="max-w-md mx-auto">
        <Button
          id={id}
          type={type}
          onClick={onClick}
          disabled={loading || disabled}
          className="w-full bg-[#00479e] text-white hover:bg-[#003a82] py-6 text-lg font-bold rounded-xl shadow-lg active:scale-[0.98] transition-all"
        >
          {loading ? 'Wird verarbeitet...' : label}
        </Button>
      </div>
    </div>
  );
};
