import React from 'react';
import FussballdeWidget from './FussballdeWidget';

export default function FussballSquad({ squadId = "e47da4e5-b91e-47a4-a8b9-0f87caf7118f" }: { squadId?: string }) {
  return (
    <FussballdeWidget id={squadId} type="squad" />
  );
}
