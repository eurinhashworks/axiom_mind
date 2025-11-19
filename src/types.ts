
export enum Stage {
  CAPTURE,
  TRIAGE,
  EVALUATION,
  ACTION_PLAN,
  GALAXY,
}

export type NoteStatus = 'À Tisser' | 'Tissé';

export interface BrainDumpNote {
  id: string;
  content: string;
  status: NoteStatus;
  createdAt: string; // ISO timestamp
  updatedAt?: string; // ISO timestamp
}

export interface IdeaNode {
  id: string;
  originalNote: string;
  projectName?: string;
  problem?: string;
  targetAudience?: string;
  urgency?: number;
  scale?: 'Niche' | 'Moyen' | 'Massif';
  excitement?: number;
  opportunityScore?: number;
  feasibilityScore?: number;
  createdAt: string; // ISO timestamp
  completedAt?: string; // ISO timestamp
}

export interface ChatMessage {
  sender: 'user' | 'axiom';
  text: string;
}

export interface UserStory {
  id: string;
  text: string;
  completed: boolean;
}
