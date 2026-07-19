import React from 'react';
import { ActionDrawer } from './ui/ActionDrawer';
import { ActionDrawerItem } from './ui/ActionDrawerItem';
import { Trophy, CalendarDays, Swords, Sparkles } from 'lucide-react';

interface EventChoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (choice: 'training' | 'spiel' | 'turnier' | 'event') => void;
}

export const EventChoiceModal: React.FC<EventChoiceModalProps> = ({
  isOpen,
  onClose,
  onSelect,
}) => {
  return (
    <ActionDrawer isOpen={isOpen} onClose={onClose} title="Termin erstellen">
      <ActionDrawerItem
        icon={<CalendarDays size={20} />}
        label="Training"
        onClick={() => {
          onSelect('training');
          onClose();
        }}
        showBorder={true}
      />
      <ActionDrawerItem
        icon={<Trophy size={20} />}
        label="Spiel"
        onClick={() => {
          onSelect('spiel');
          onClose();
        }}
        showBorder={true}
      />
      <ActionDrawerItem
        icon={<Swords size={20} />}
        label="Turnier"
        onClick={() => {
          onSelect('turnier');
          onClose();
        }}
        showBorder={true}
      />
      <ActionDrawerItem
        icon={<Sparkles size={20} />}
        label="Event"
        onClick={() => {
          onSelect('event');
          onClose();
        }}
        showBorder={false}
      />
    </ActionDrawer>
  );
};
