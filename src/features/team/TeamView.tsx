import React, { memo } from 'react';
import FussballdeWidget from '../../components/FussballdeWidget';

export const TeamView = memo(() => {
  return (
    <div id="team-view-squad-container" className="flex flex-col h-full bg-slate-50 overflow-hidden">
      <div id="team-view-squad-widget-wrapper" className="flex-1 w-full p-2 bg-white relative overflow-y-auto scrollbar-hide">
        <FussballdeWidget id="4406d4cd-6750-42ff-9e6a-616c8b66dc9e" type="next-match" />
      </div>
    </div>
  );
});

TeamView.displayName = 'TeamView';
