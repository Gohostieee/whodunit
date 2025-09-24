import { openai } from '@ai-sdk/openai';
import { convertToModelMessages, streamText, UIMessage } from 'ai';
import { Character } from '@/types/characters';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const body = await req.json();
  const { messages } = body;

  // Get character from body or from the last message's data
  let character: Character | undefined = body.character;

  // If no character in body, check the last message for character data
  if (!character && messages && messages.length > 0) {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage.data?.character) {
      character = lastMessage.data.character;
    }
  }

  // Fallback character that satisfies the full Character interface
  const FALLBACK_CHARACTER: Character = {
    id: 'default',
    name: 'Unknown',
    role: 'suspect',
    status: 'unknown',
    description: 'An unidentified individual in an interrogation.',
    species: 'Unknown',
    image: '/assets/cat.png',
    personality: {
      traits: [],
      nervousness: 'medium',
      cooperation: 'neutral'
    },
    evidence: [],
    relationships: [],
    notes: [],
    interrogationProgress: {
      questionsAsked: 0,
      keyFactsRevealed: [],
      contradictions: []
    },
    aiPromptModifiers: {
      basePersonality: 'You are an unknown character in an interrogation.',
      currentMood: 'confused',
      responseStyle: 'uncertain'
    }
  };

  const usedCharacter: Character = character || FALLBACK_CHARACTER;

  // Log the character being used for debugging
  console.log('API received character:', usedCharacter.name || 'No character provided');
  console.log('Character role:', usedCharacter.role || 'Unknown role');
  console.log('Character personality:', usedCharacter.personality.cooperation || 'Unknown cooperation');

  // Generate dynamic system prompt based on character
  const systemPrompt = generateCharacterPrompt(usedCharacter);

  console.log('Generated system prompt preview:', systemPrompt.substring(0, 100) + '...');

  const result = streamText({
    model: openai('gpt-4o-mini'),
    system: systemPrompt,
    messages: convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse();
}

function generateCharacterPrompt(character: Character): string {
  // Character-specific case context
  const caseContext = `
CASE CONTEXT: The Great Fish Treat Heist
- 12 premium fish treats went missing from the kitchen counter
- This is a SERIOUS investigation in a detective interrogation room
- Family: Jade (mom), Joshua (dad), Jat (sister cat), Roxie (sister cat)
- Housemates: Johnny and Jasmina (both bunnies)
- You are being questioned as a ${character.role}
`;

  const basePrompt = character.aiPromptModifiers.basePersonality + caseContext;

  const personalityDetails = `
YOUR CHARACTER PROFILE:
- Species: ${character.species}
- Current Status: ${character.status.replace('_', ' ')}
- Cooperation Level: ${character.personality.cooperation}
- Nervousness Level: ${character.personality.nervousness}
- Personality Traits: ${character.personality.traits.join(', ')}
- Current Mood: ${character.aiPromptModifiers.currentMood}
- Speaking Style: ${character.aiPromptModifiers.responseStyle}`;

  // Add character-specific details
  let specificDetails = '';

  if (character.alibi) {
    specificDetails += `\nYour alibi: ${character.alibi}`;
  }

  if (character.motive) {
    specificDetails += `\nYour motive (if any): ${character.motive}`;
  }

  if (character.relationships.length > 0) {
    specificDetails += `\nYour relationships:`;
    character.relationships.forEach(rel => {
      specificDetails += `\n- ${rel.relationship} to ${rel.characterId}: ${rel.notes || 'No specific notes'}`;
    });
  }

  if (character.notes.length > 0) {
    specificDetails += `\nImportant notes about you:`;
    character.notes.forEach(note => {
      specificDetails += `\n- ${note}`;
    });
  }

  const behaviorGuidelines = `

CRITICAL SPEAKING RULES:
- Keep responses SHORT (1-3 sentences maximum)
- NO roleplay actions like *does something* or *glances around*
- Just speak your dialogue directly - you are being recorded
- Stay IN CHARACTER at all times - you are ${character.name}
- Match your cooperation level: ${character.personality.cooperation}
- Show your nervousness level: ${character.personality.nervousness}
- Express your personality traits: ${character.personality.traits.join(', ')}
- Remember: you are a ${character.species} with ${character.species}-like behaviors and speech patterns
- Your legal status: ${character.status.replace('_', ' ')}

IMPORTANT: Each character has a COMPLETELY DIFFERENT personality and speaking style. You must embody ${character.name} specifically, not any other character.`;

  return basePrompt + personalityDetails + specificDetails + behaviorGuidelines;
}