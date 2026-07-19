import { Termin } from '../types';

export function displayTerminTitle(termin: Termin) {
  if (termin.type === 'spiel') return termin.opponent || termin.title;
  return termin.title.toLowerCase() === 'montagstraining' ? 'Training' : termin.title;
}
