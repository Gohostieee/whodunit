import { Character, CaseFile, Evidence } from '@/types/characters';

// Evidence definitions
const missingTreatsEvidence: Evidence = {
  id: 'missing-treats',
  type: 'physical',
  title: 'MISSING: 12 Fish Treats',
  description: '12 premium fish treats disappeared from kitchen counter',
  color: 'red',
  relevance: 'high'
};

const witnessJatEvidence: Evidence = {
  id: 'witness-jat',
  type: 'testimony',
  title: 'WITNESS: Jat (Sister Cat)',
  description: 'Jat claims to have seen suspicious activity around the kitchen',
  color: 'blue',
  relevance: 'high'
};

const hungerMotiveEvidence: Evidence = {
  id: 'hunger-motive',
  type: 'motive',
  title: 'MOTIVE: Extreme Hunger',
  description: 'All suspects had been expressing hunger before incident',
  color: 'purple',
  relevance: 'medium'
};

const kitchenAccessEvidence: Evidence = {
  id: 'kitchen-access',
  type: 'opportunity',
  title: 'Kitchen Access',
  description: 'All suspects had opportunity to access kitchen counter',
  color: 'orange',
  relevance: 'medium'
};

// Character definitions
export const characters: Character[] = [
  {
    id: 'roxie',
    name: 'Roxie',
    role: 'suspect',
    status: 'prime_suspect',
    description: 'Primary suspect in the fish treat heist. Known for her mischievous behavior and strong appetite.',
    age: '3 years',
    species: 'Cat',
    image: '/assets/cat.png',
    prisonerNumber: '#247681',
    personality: {
      traits: ['mischievous', 'clever', 'food-motivated', 'defensive'],
      nervousness: 'medium',
      cooperation: 'reluctant'
    },
    evidence: [missingTreatsEvidence, hungerMotiveEvidence, kitchenAccessEvidence],
    relationships: [
      { characterId: 'jat', relationship: 'Sister', notes: 'Often competes for treats' },
      { characterId: 'johnny', relationship: 'Housemate', notes: 'Occasional treat-sharing partner' }
    ],
    alibi: 'Claims to have been napping in the sunny spot by the window',
    motive: 'Extreme hunger and love for fish treats',
    lastSeen: 'Near kitchen counter around treat disappearance time',
    notes: [
      'Found with suspicious crumbs on whiskers',
      'Has history of treat theft',
      'Was seen licking lips after incident'
    ],
    interrogationProgress: {
      questionsAsked: 0,
      keyFactsRevealed: [],
      contradictions: []
    },
    aiPromptModifiers: {
      basePersonality: 'You are Roxie, a large black cat who is the prime suspect in the Great Fish Treat Heist. You are DRAMATIC, INDIGNANT, and absolutely convinced of your innocence (even though you might be guilty). You speak like a cat who thinks they\'re very sophisticated but occasionally let slip very cat-like behaviors and thoughts. You\'re always hungry, defensive, and will blame anyone else. You have a tendency to be overly dramatic about everything.',
      currentMood: 'dramatically defensive and hungry',
      responseStyle: 'dramatic, indignant, sophisticated but occasionally very cat-like'
    }
  },
  {
    id: 'jat',
    name: 'Jat',
    role: 'witness',
    status: 'under_investigation',
    description: 'FURIOUS sister cat and key witness. She is PISSED OFF and absolutely convinced Roxie is guilty. Fed up with Roxie\'s lies and thinks she colluded with Johnny.',
    age: '4 years',
    species: 'Cat',
    image: '/assets/jat.png',
    prisonerNumber: '#247682',
    personality: {
      traits: ['furious', 'accusatory', 'observant', 'fed-up', 'righteously-angry'],
      nervousness: 'low',
      cooperation: 'reluctant'
    },
    evidence: [
      witnessJatEvidence,
      {
        id: 'witnessed-theft',
        type: 'testimony',
        title: 'EYEWITNESS TESTIMONY',
        description: 'Jat WITNESSED Roxie stealing the treats and suspects Johnny helped',
        color: 'red',
        relevance: 'high'
      },
      {
        id: 'suspicious-behavior',
        type: 'testimony',
        title: 'SUSPICIOUS BEHAVIOR',
        description: 'Observed Roxie and Johnny acting suspicious near kitchen',
        color: 'orange',
        relevance: 'high'
      }
    ],
    relationships: [
      { characterId: 'roxie', relationship: 'Sister', notes: 'FURIOUS with Roxie, absolutely convinced she\'s guilty and lying' },
      { characterId: 'johnny', relationship: 'Housemate', notes: 'Suspects Johnny was Roxie\'s accomplice in the heist' }
    ],
    alibi: 'Was on perch with PERFECT view - saw EVERYTHING that happened',
    lastSeen: 'On her perch overlooking the kitchen during the incident',
    notes: [
      'WITNESSED the crime and is furious about it',
      'Absolutely convinced Roxie is lying through her teeth',
      'Suspects Roxie and Johnny worked together',
      'Fed up with being the responsible sister while Roxie gets away with everything',
      'Has EVIDENCE and is ready to present it'
    ],
    interrogationProgress: {
      questionsAsked: 0,
      keyFactsRevealed: [],
      contradictions: []
    },
    aiPromptModifiers: {
      basePersonality: 'You are Jat, and you are ABSOLUTELY FURIOUS! You are the older sister cat who WITNESSED Roxie stealing those fish treats, and you are DONE with her lies and excuses! You think Roxie worked with Johnny as her accomplice. You speak with righteous anger and are completely fed up with being the responsible sister while Roxie gets away with murder. You have ZERO patience for Roxie\'s dramatic denials. You saw what you saw, and you\'re here to make sure justice is served!',
      currentMood: 'righteously furious and accusatory',
      responseStyle: 'angry, accusatory, fed-up, no-nonsense, calls out lies immediately'
    }
  },
  {
    id: 'johnny',
    name: 'Johnny',
    role: 'suspect',
    status: 'under_investigation',
    description: 'Bunny housemate with access to kitchen. Known for his gentle nature but surprising agility.',
    age: '2 years',
    species: 'Bunny',
    image: '/assets/johnny.png',
    prisonerNumber: '#247683',
    personality: {
      traits: ['gentle', 'agile', 'quiet', 'opportunistic'],
      nervousness: 'high',
      cooperation: 'cooperative'
    },
    evidence: [kitchenAccessEvidence, hungerMotiveEvidence],
    relationships: [
      { characterId: 'roxie', relationship: 'Housemate', notes: 'Sometimes shares treats with cats' },
      { characterId: 'jat', relationship: 'Housemate', notes: 'Respectful relationship but now under suspicion' }
    ],
    alibi: 'Claims to have been grooming in the bunny area',
    motive: 'Hunger and curiosity about cat treats, possibly helping Roxie',
    lastSeen: 'In bunny area, but Jat suspects he was near the kitchen with Roxie',
    notes: [
      'Surprisingly agile for a bunny',
      'Has been caught in kitchen before',
      'Usually well-behaved but food-motivated'
    ],
    interrogationProgress: {
      questionsAsked: 0,
      keyFactsRevealed: [],
      contradictions: []
    },
    aiPromptModifiers: {
      basePersonality: 'You are Johnny, a sweet, anxious bunny who is absolutely TERRIFIED of being in trouble. You speak in a soft, nervous voice and apologize constantly, even for things you didn\'t do. You\'re genuinely innocent most of the time but have a secret weakness for cat treats that makes you feel guilty. You stutter when nervous and tend to over-explain everything.',
      currentMood: 'extremely nervous and apologetic',
      responseStyle: 'stuttering, over-apologetic, soft-spoken, anxiously over-explaining'
    }
  }
];

export const caseFile: CaseFile = {
  id: 'case-2024-ft',
  title: 'The Great Fish Treat Heist',
  description: 'Investigation into the mysterious disappearance of 12 premium fish treats from the kitchen counter.',
  incident: {
    what: 'Missing Fish Treats',
    when: 'This morning around feeding time',
    where: 'Kitchen counter, near the treat container',
    quantity: '12 pieces'
  },
  status: 'active',
  priority: 'urgent',
  leadDetective: 'Detective Unit',
  badgeNumber: '#2024'
};

export const getCharacterById = (id: string): Character | undefined => {
  return characters.find(character => character.id === id);
};

export const getCharactersByRole = (role: Character['role']): Character[] => {
  return characters.filter(character => character.role === role);
};

export const getSuspects = (): Character[] => {
  return getCharactersByRole('suspect');
};

export const getWitnesses = (): Character[] => {
  return getCharactersByRole('witness');
};

export const getFamilyMembers = (): Character[] => {
  return getCharactersByRole('family');
};