import { experimental_generateSpeech as generateSpeech } from 'ai';
import { elevenlabs } from '@ai-sdk/elevenlabs';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { text, character } = await req.json();

    // Character-specific voice mapping (you can customize these with actual ElevenLabs voice IDs)
    const getVoiceForCharacter = (characterName?: string) => {
      switch (characterName?.toLowerCase()) {
        case 'roxie': return 'Z7RrOqZFTyLpIlzCgfsp'; // Dramatic female voice
        case 'jat': return '7NsaqHdLuKNFvEfjpUno'; // Wise female voice
        case 'johnny': return 'nzeAacJi50IvxcyDnMXa'; // Nervous male voice
        case 'jasmina': return 'EXAVITQu4vr4xnSDxMaL'; // Confident female voice
        case 'jade': return 'TC0Zp7WVFzhA8zpTlRqV'; // Motherly voice
        case 'joshua': return '3l9iCMrNSRR0w51JvFB0'; // Fatherly voice
        default: return 'Z7RrOqZFTyLpIlzCgfsp'; // Default voice
      }
    };

    if (!text) {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      );
    }

    const selectedVoice = getVoiceForCharacter(character?.name);
    console.log(`Using voice ${selectedVoice} for character ${character?.name || 'unknown'}`);

    const { audio } = await generateSpeech({
      model: elevenlabs.speech('eleven_multilingual_v2'),
      text: text,
      voice: selectedVoice,
      outputFormat: 'mp3',
    });

    // Return audio as base64
    return NextResponse.json({
      audio: audio.base64,
      mimeType: 'audio/mpeg'
    });

  } catch (error) {
    console.error('Error generating speech:', error);
    return NextResponse.json(
      { error: 'Failed to generate speech' },
      { status: 500 }
    );
  }
}