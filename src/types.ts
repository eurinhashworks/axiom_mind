
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
