export type CharacterRole = 'suspect' | 'witness' | 'family' | 'roommate';

export type CharacterStatus = 'unknown' | 'cleared' | 'prime_suspect' | 'under_investigation';

export type EvidenceType = 'physical' | 'testimony' | 'alibi' | 'motive' | 'means' | 'opportunity';

export interface Evidence {
  id: string;
  type: EvidenceType;
  title: string;
  description: string;
  color: 'red' | 'blue' | 'green' | 'purple' | 'orange' | 'yellow';
  relevance: 'high' | 'medium' | 'low';
}

export interface CharacterRelationship {
  characterId: string;
  relationship: string;
  notes?: string;
}

export interface Character {
  id: string;
  name: string;
  role: CharacterRole;
  status: CharacterStatus;
  description: string;
  age?: string;
  species: string;
  image: string;
  prisonerNumber?: string;
  personality: {
    traits: string[];
    nervousness: 'low' | 'medium' | 'high';
    cooperation: 'hostile' | 'reluctant' | 'neutral' | 'cooperative';
  };
  evidence: Evidence[];
  relationships: CharacterRelationship[];
  alibi?: string;
  motive?: string;
  lastSeen?: string;
  notes: string[];
  interrogationProgress: {
    questionsAsked: number;
    keyFactsRevealed: string[];
    contradictions: string[];
  };
  aiPromptModifiers: {
    basePersonality: string;
    currentMood: string;
    responseStyle: string;
  };
}

export interface CaseFile {
  id: string;
  title: string;
  description: string;
  incident: {
    what: string;
    when: string;
    where: string;
    quantity?: string;
  };
  status: 'active' | 'solved' | 'cold';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  leadDetective: string;
  badgeNumber: string;
}

export interface InterrogationState {
  currentCharacter: Character;
  availableCharacters: Character[];
  caseFile: CaseFile;
  sessionStartTime: Date;
  totalQuestionsAsked: number;
  keyDiscoveries: string[];
}