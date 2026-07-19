import React, { memo } from 'react';
import { MoreVertical, ThumbsDown, ThumbsUp } from 'lucide-react';
import { TerminStatus } from '../../types';
import {
  ListCard,
  ListCardHeader,
  ListCardBadgeSection,
  ListCardDivider,
  ListCardContent,
  ListCardTitle,
  ListCardSubtitle,
  ListCardActions,
  ListCardActionButton,
  ListCardBody,
} from '../ui/ListCard';

interface TerminCardProps {
  key?: React.Key;
  day: string;
  date: string;
  title: string;
  location?: string;
  status: TerminStatus;
  onStatusUpdate: (status: TerminStatus) => void;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onMenuClick: (e: React.MouseEvent) => void;
  isAdmin?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export const TerminCard = memo(function TerminCard({
  day,
  date,
  title,
  location,
  status,
  onStatusUpdate,
  isExpanded,
  onToggleExpand,
  onMenuClick,
  isAdmin,
  className,
  children,
}: TerminCardProps) {
  return (
    <ListCard className={className}>
      <ListCardHeader onClick={onToggleExpand}>
        <div className="flex items-center flex-1">
          <ListCardBadgeSection>
            <div className="font-bold text-black leading-tight text-[17px]">{day}</div>
            <div className="text-sm text-slate-500 font-medium">{date}</div>
          </ListCardBadgeSection>

          <ListCardDivider />

          <ListCardContent>
            <ListCardTitle>{title}</ListCardTitle>
            {location && <ListCardSubtitle>{location}</ListCardSubtitle>}
          </ListCardContent>
        </div>

        <ListCardActions>
          <div className="flex items-stretch">
            <ListCardActionButton
              active={status === 'accepted'}
              activeBgClass="bg-[#00479e]"
              onClick={(e) => {
                e.stopPropagation();
                onStatusUpdate('accepted');
              }}
            >
              <ThumbsUp
                size={20}
                strokeWidth={2.5}
                className={status === 'accepted' ? 'text-white' : 'text-slate-400'}
              />
            </ListCardActionButton>

            <ListCardActionButton
              active={status === 'declined'}
              activeBgClass="bg-destructive"
              onClick={(e) => {
                e.stopPropagation();
                onStatusUpdate('declined');
              }}
            >
              <ThumbsDown
                size={20}
                strokeWidth={2.5}
                className={status === 'declined' ? 'text-white' : 'text-slate-400'}
              />
            </ListCardActionButton>
          </div>

          {isAdmin && (
            <ListCardActionButton
              widthClass="px-3"
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

      {isExpanded && children && <ListCardBody>{children}</ListCardBody>}
    </ListCard>
  );
});
