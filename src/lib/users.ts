import { Member } from '../types';

// Hardcoded team roster. Used for login + Google Forms prefill.
// To add/remove a player, edit this list and redeploy.
export const USERS: Member[] = [
  { id: 'admin_001', name: 'admin', email: 'admin@h03.uk', type: 'admin' },
  { id: 'player_001', name: 'Silas', email: 'silas@h03.uk', type: 'user' },
  { id: 'player_002', name: 'Finley', email: 'finley@h03.uk', type: 'user' },
  { id: 'player_003', name: 'Arvid', email: 'arvid@h03.uk', type: 'user' },
  { id: 'player_004', name: 'Lion', email: 'lion@h03.uk', type: 'user', avatarUrl: 'https://pub-888339f2723e4cb3aade5b136fff94e6.r2.dev/liom.%20profile.png' },
  { id: 'player_005', name: 'Jakob', email: 'jakob@h03.uk', type: 'user', avatarUrl: 'https://pub-888339f2723e4cb3aade5b136fff94e6.r2.dev/Jakob-topaz-face-denoise-crop.webp' },
  { id: 'player_006', name: 'Paul', email: 'paul@h03.uk', type: 'user' },
  { id: 'player_007', name: 'Lennox', email: 'lennox@h03.uk', type: 'user' },
  { id: 'player_008', name: 'Levi', email: 'levi@h03.uk', type: 'user' },
  { id: 'player_009', name: 'Lasse', email: 'lasse@h03.uk', type: 'user' },
  { id: 'player_010', name: 'Milan', email: 'milan@h03.uk', type: 'user' },
  { id: 'player_011', name: 'Lionel', email: 'lionel@h03.uk', type: 'user' },
  { id: 'player_012', name: 'Arturo', email: 'arturo@h03.uk', type: 'user' },
  { id: 'player_013', name: 'Peter', email: 'peter@h03.uk', type: 'user' },
  { id: 'player_014', name: 'Tommy', email: 'tommy@h03.uk', type: 'user' },
  { id: 'player_015', name: 'Alex', email: 'alex@h03.uk', type: 'user' },
  { id: 'player_016', name: 'Tayo', email: 'tayo@h03.uk', type: 'user' },
];
