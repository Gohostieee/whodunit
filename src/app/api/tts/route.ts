import { experimental_generateSpeech as generateSpeech } from 'ai';
import { elevenlabs } from '@ai-sdk/elevenlabs';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();

    if (!text) {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      );
    }

    const { audio } = await generateSpeech({
      model: elevenlabs.speech('eleven_multilingual_v2'),
      text: text,
      voice: 'Z7RrOqZFTyLpIlzCgfsp', // Adam voice - you can change this to any ElevenLabs voice ID
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