export type Tab = 'activities' | 'team' | 'profile';
export type TerminStatus = 'accepted' | 'declined' | null;
export type UserType = 'admin' | 'user';

export interface Member {
  id: string;
  name: string;
  email?: string;
  forwardingEmail?: string;
  forwardingVerified?: boolean;
  imageUrl?: string;
  avatarUrl?: string;
  type: UserType;
  lastName?: string;
  firstName?: string;
  birthDate?: string;
  contact?: string;
}

export interface Umfrage {
  id: string;
  title: string;
  subtitle: string;
  votes: Record<string, string>; // userId -> voteValue
  options: string[];
  status: 'laufend' | 'beendet';
  creatorId?: string;
  createdAt?: string;
}

export interface TerminBase {
  id: string;
  day: string;
  date: string;
  title: string;
  status: Record<string, TerminStatus>; // userId -> status
  startTime?: string;
  endTime?: string;
  address?: string;
  fullDate?: string;
  seriesId?: string;
  treffTime?: string;
  additionalInfo?: string;
}

export interface TrainingTermin extends TerminBase {
  type: 'training';
  signupStart?: string;
  signupEnd?: string;
}

export interface SpielTermin extends TerminBase {
  type: 'spiel';
  opponent: string;
  isHome?: boolean;
  spieltyp?: string;
}

export interface OtherTermin extends TerminBase {
  type: 'turnier' | 'event';
}

export type Termin = TrainingTermin | SpielTermin | OtherTermin;
