import React from 'react';

interface FormSectionProps {
  id?: string;
  title?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export const FormSection: React.FC<FormSectionProps> = ({ id, title, icon, children }) => {
  return (
    <div id={id} className="flex flex-col gap-4">
      {title && (
        <h3 className="font-bold text-lg flex items-center gap-2 text-slate-900">
          {icon && <span className="text-[#00479e]">{icon}</span>}
          {title}
        </h3>
      )}
      <div className="flex flex-col gap-4">{children}</div>
    </div>
  );
};
