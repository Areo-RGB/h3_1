import * as React from 'react';
import { cn } from '@/lib/utils';

// Reusable styled component for the main card container
export interface ListCardProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  children?: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export function ListCard({ className, ...props }: ListCardProps) {
  return (
    <div
      className={cn(
        'flex flex-col border-b border-slate-200/60 shrink-0 bg-white transition-all duration-200',
        className,
      )}
      {...props}
    />
  );
}

// Reusable styled component for the clickable card header/row
export interface ListCardHeaderProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onClick'> {
  onClick?: (e: React.MouseEvent<HTMLDivElement | HTMLButtonElement>) => void;
  className?: string;
  children?: React.ReactNode;
}

export function ListCardHeader({ className, onClick, ...props }: ListCardHeaderProps) {
  return onClick ? (
    <button
      onClick={onClick}
      className={cn(
        'w-full flex items-stretch justify-between shrink-0 transition-colors text-left cursor-pointer hover:bg-black/5 focus:outline-none focus-visible:bg-black/5',
        className,
      )}
      {...props as React.ButtonHTMLAttributes<HTMLButtonElement>}
    />
  ) : (
    <div
      className={cn(
        'flex items-stretch justify-between shrink-0 transition-colors',
        className,
      )}
      {...props}
    />
  );
}

// Reusable styled component for the left-side badge/icon container (typically 72px wide)
export interface ListCardBadgeSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  children?: React.ReactNode;
}

export function ListCardBadgeSection({ className, ...props }: ListCardBadgeSectionProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center shrink-0 w-[64px] select-none',
        className,
      )}
      {...props}
    />
  );
}

// Reusable styled component for the vertical dividing line
export function ListCardDivider({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { className?: string }) {
  return (
    <div className={cn('w-px h-10 bg-slate-200 shrink-0 self-center', className)} {...props} />
  );
}

// Reusable styled component for the content section (titles and metadata)
export interface ListCardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  children?: React.ReactNode;
}

export function ListCardContent({ className, ...props }: ListCardContentProps) {
  return (
    <div
      className={cn('flex flex-col justify-center px-4 py-2.5 flex-1 min-w-0', className)}
      {...props}
    />
  );
}

// Reusable styled component for the card's main title
export interface ListCardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  className?: string;
  children?: React.ReactNode;
}

export function ListCardTitle({ className, children, ...props }: ListCardTitleProps) {
  return (
    <h4
      className={cn('text-[16px] font-semibold text-black leading-tight truncate', className)}
      {...props}
    >
      {children || 'Title'}
    </h4>
  );
}

// Reusable styled component for subtitles, labels, or locations
export interface ListCardSubtitleProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  children?: React.ReactNode;
}

export function ListCardSubtitle({ className, ...props }: ListCardSubtitleProps) {
  return (
    <div
      className={cn(
        'text-xs text-slate-500 mt-0.5 min-w-0 max-w-full overflow-hidden text-ellipsis whitespace-nowrap',
        className,
      )}
      {...props}
    />
  );
}

// Reusable styled component for the actions row on the right
export interface ListCardActionsProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  children?: React.ReactNode;
}

export function ListCardActions({ className, ...props }: ListCardActionsProps) {
  return <div className={cn('flex items-stretch shrink-0', className)} {...props} />;
}

// Reusable styled component for action buttons (e.g. Thumbs Up, Thumbs Down, Menu, Check, etc.)
export interface ListCardActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  activeBgClass?: string;
  widthClass?: string;
  className?: string;
  children?: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export function ListCardActionButton({
  className,
  active = false,
  activeBgClass = 'bg-[#00479e]',
  widthClass = 'w-[64px]',
  children,
  onClick,
  ...props
}: ListCardActionButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex items-center justify-center transition-colors h-full outline-none',
        widthClass,
        active
          ? `${activeBgClass} text-white`
          : 'text-slate-400 hover:bg-slate-100 hover:text-slate-600',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

// Reusable styled component for expanded card body/drawers
export interface ListCardBodyProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  children?: React.ReactNode;
}

export function ListCardBody({ className, ...props }: ListCardBodyProps) {
  return (
    <div
      className={cn(
        'flex flex-col border-t border-slate-100 bg-slate-50/20 animate-in fade-in duration-200',
        className,
      )}
      {...props}
    />
  );
}
