'use client';
import Image from "next/image";
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { useEffect, useState } from 'react';


export default function Home() {
  const [input, setInput] = useState('');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isPreparingAudio, setIsPreparingAudio] = useState(false);
  const [displayedMessage, setDisplayedMessage] = useState<any>(null);
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: '/api/chat',
    }),
  });

  // Function to prepare and play TTS audio
  const prepareAndPlayTTS = async (text: string, message: any) => {
    try {
      setIsPreparingAudio(true);

      // Fetch TTS audio
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error('TTS request failed');
      }

      const data = await response.json();

      // Create audio element
      const audio = new Audio(`data:${data.mimeType};base64,${data.audio}`);

      // Show text when audio is ready to play
      audio.oncanplaythrough = () => {
        setIsPreparingAudio(false);
        setDisplayedMessage(message);
        setIsPlayingAudio(true);
        audio.play();
      };

      audio.onended = () => setIsPlayingAudio(false);
      audio.onerror = () => {
        setIsPreparingAudio(false);
        setIsPlayingAudio(false);
        // Show message even if audio fails
        setDisplayedMessage(message);
      };

      // Load the audio
      audio.load();
    } catch (error) {
      console.error('Error playing TTS:', error);
      setIsPreparingAudio(false);
      setIsPlayingAudio(false);
      // Show message even if TTS fails
      setDisplayedMessage(message);
    }
  };

  const lastAssistantMessage = messages.filter(m => m.role === 'assistant').pop();

  // Auto-prepare TTS when a new assistant message arrives
  useEffect(() => {
    if (lastAssistantMessage && status === 'ready') {
      const text = lastAssistantMessage.parts
        .filter(part => part.type === 'text')
        .map(part => part.text)
        .join(' ');

      if (text.trim()) {
        // Clear displayed message first, then prepare new TTS
        setDisplayedMessage(null);
        prepareAndPlayTTS(text, lastAssistantMessage);
      }
    }
  }, [lastAssistantMessage?.id, status, lastAssistantMessage]); // Trigger when message ID changes and status is ready

  return (
    <div className="relative min-h-screen bg-gray-900 overflow-hidden">
      {/* Detective Header Bar */}
      <div className="absolute top-0 left-0 right-0 z-50 bg-gray-800 border-b-2 border-yellow-500">
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-4">
            {/* Detective Badge */}
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center">
                <span className="text-black font-bold text-sm">🔍</span>
              </div>
              <div className="text-white">
                <div className="text-sm font-bold">DETECTIVE UNIT</div>
                <div className="text-xs text-gray-400">Badge #2024</div>
              </div>
            </div>

            {/* Case Status */}
            <div className="hidden md:flex items-center gap-4 ml-8">
              <div className="text-white">
                <div className="text-xs text-red-400 font-mono">CASE #2024-FISHTREATS</div>
                <div className="text-sm font-bold text-yellow-400">INTERROGATION IN PROGRESS</div>
              </div>
            </div>
          </div>

          {/* Recording Indicator */}
          <div className="flex items-center gap-3">
            <div className="recording-indicator w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-red-400 text-sm font-mono">REC</span>
            {/* Clock */}
            <div className="text-white text-sm font-mono ml-4">
              {new Date().toLocaleTimeString()}
            </div>
          </div>
        </div>
      </div>

      {/* Dark Interrogation Room Background */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
        {/* Subtle Office Background */}
        <div className="absolute inset-0 opacity-20">
          <Image
            src="/assets/office.png"
            alt="Office Background"
            fill
            className="object-cover blur-[5px] grayscale"
            priority
          />
        </div>

        {/* Dramatic Lighting Effect */}
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-yellow-300 opacity-20 blur-3xl rounded-full interrogation-flicker"></div>
      </div>

      {/* Main Interrogation Interface */}
      <div className="relative z-20 pt-16 min-h-screen">
        {/* Evidence Board - Left Side */}
        <div className="absolute left-2 top-20 w-56 h-72 bg-cork bg-opacity-90 border-6 border-amber-900 p-3 hidden lg:block">
          <div className="text-amber-100 text-sm font-bold mb-3 text-center">EVIDENCE BOARD</div>

          {/* Evidence Items */}
          <div className="space-y-2">
            <div className="evidence-hover bg-red-600 text-white p-1.5 rounded text-xs transform -rotate-1">
              <div className="font-bold">MISSING:</div>
              <div>12 Fish Treats</div>
            </div>

            <div className="evidence-hover bg-blue-600 text-white p-1.5 rounded text-xs transform rotate-2">
              <div className="font-bold">WITNESS:</div>
              <div>Jat (Sister Cat)</div>
            </div>

            <div className="evidence-hover bg-green-600 text-white p-1.5 rounded text-xs transform -rotate-2">
              <div className="font-bold">SUSPECTS:</div>
              <div>Roxie, Johnny, Jasmina</div>
            </div>

            <div className="evidence-hover bg-purple-600 text-white p-1.5 rounded text-xs transform rotate-1">
              <div className="font-bold">MOTIVE:</div>
              <div>Extreme Hunger</div>
            </div>
          </div>

          {/* Red String Connections */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <line x1="20" y1="60" x2="200" y2="120" stroke="red" strokeWidth="1" opacity="0.7"/>
            <line x1="50" y1="100" x2="180" y2="80" stroke="red" strokeWidth="1" opacity="0.7"/>
          </svg>
        </div>

        {/* Two-Way Mirror Frame */}
        <div className="flex justify-center items-center min-h-[400px] px-4">
          <div className="one-way-mirror mirror-effect w-full max-w-xl h-80 rounded-lg flex items-center justify-center relative">
            {/* Mirror Reflection Effect */}
            <div className="absolute inset-3 bg-gradient-to-br from-gray-600/30 to-gray-800/50 rounded"></div>

            {/* Interrogation Table */}
            <div className="interrogation-table absolute bottom-0 left-6 right-6 h-8 rounded-t-lg"></div>

            {/* Suspect Area */}
            <div className="flex flex-col items-center gap-2 relative z-10">
              {/* Suspect Name Plate */}
              <div className="bg-black text-white px-3 py-1 text-xs font-mono border border-gray-600">
                SUSPECT: ROXIE - CASE #2024-FT
              </div>

              {/* Mugshot Style Cat Presentation */}
              <div className="relative">
                {/* Height Measurement Backdrop */}
                <div className="absolute -left-6 top-0 bottom-0 w-4 bg-white/10 flex flex-col justify-between text-xs text-white font-mono">
                  <div>4&apos;</div>
                  <div>3&apos;</div>
                  <div>2&apos;</div>
                  <div>1&apos;</div>
                </div>

                {/* Cat Image with Mugshot Effect */}
                <div className={`suspect-entrance ${isPlayingAudio ? 'nervous-twitch' : ''} dramatic-shadow`}>
                  <Image
                    src="/assets/cat.png"
                    alt="Suspect Roxie"
                    width={180}
                    height={140}
                    className="object-contain"
                  />
                </div>

                {/* Prisoner Number */}
                <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 bg-black text-white px-2 py-0.5 text-xs font-mono border">
                  #247681
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Speech/Interrogation Transcript Area */}
        <div className="flex justify-center px-4 mt-4">
          <div className="w-full max-w-3xl mx-auto">
            {/* Loading indicator while preparing audio */}
            {isPreparingAudio && (
              <div className="bg-gray-800 border border-red-500 rounded-lg p-3 mb-3 animate-fade-in">
                <div className="flex items-center gap-2">
                  <div className="police-lights w-3 h-3 rounded-full"></div>
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 bg-red-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                    <div className="w-1.5 h-1.5 bg-red-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                    <div className="w-1.5 h-1.5 bg-red-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                  </div>
                  <p className="text-red-300 text-xs font-mono">SUSPECT PREPARING RESPONSE...</p>
                </div>
              </div>
            )}

            {/* Interrogation Transcript Speech Bubble */}
            {displayedMessage && !isPreparingAudio && (
              <div className="bg-gray-800 border-l-4 border-yellow-500 rounded-lg p-3 mb-3 animate-fade-in dramatic-shadow overflow-hidden">
                <div className="flex flex-col md:flex-row md:items-start gap-2">
                  {/* Transcript Header */}
                  <div className="flex-shrink-0">
                    <div className="text-yellow-400 text-xs font-mono mb-0.5">SUSPECT STATEMENT</div>
                    <div className="text-gray-400 text-xs font-mono">{new Date().toLocaleTimeString()}</div>
                  </div>

                  {/* Statement Content */}
                  <div className="flex-1 min-w-0">
                    <div className="text-white text-sm leading-snug break-words">
                      {displayedMessage.parts.map((part: any, index: number) =>
                        part.type === 'text' ? <span key={index}>{String(part.text || '')}</span> : null
                      )}
                    </div>

                    {/* Audio Playing Indicator */}
                    {isPlayingAudio && (
                      <div className="flex items-center gap-1.5 mt-2 text-green-400">
                        <div className="flex gap-0.5">
                          <div className="w-0.5 h-3 bg-green-400 animate-bounce" style={{animationDelay: '0ms'}}></div>
                          <div className="w-0.5 h-3 bg-green-400 animate-bounce" style={{animationDelay: '100ms'}}></div>
                          <div className="w-0.5 h-3 bg-green-400 animate-bounce" style={{animationDelay: '200ms'}}></div>
                          <div className="w-0.5 h-3 bg-green-400 animate-bounce" style={{animationDelay: '300ms'}}></div>
                          <div className="w-0.5 h-3 bg-green-400 animate-bounce" style={{animationDelay: '400ms'}}></div>
                        </div>
                        <span className="text-xs font-mono">PLAYBACK</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Transcript Official Seal */}
                <div className="absolute top-1 right-1 text-xs text-gray-500 font-mono transform rotate-12 opacity-40 hidden md:block">
                  OFFICIAL
                </div>
              </div>
            )}

            {/* Detective Input Interface */}
            <div className="bg-gray-800 border border-gray-600 rounded-lg p-3">
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-2">
                <div className="text-yellow-400 text-xs font-mono">DETECTIVE QUESTIONING:</div>
                <div className="flex-1 border-t border-gray-600 hidden sm:block"></div>
                <div className="text-gray-400 text-xs font-mono">SECURE LINE</div>
              </div>

              <form
                onSubmit={e => {
                  e.preventDefault();
                  if (input.trim()) {
                    sendMessage({ text: input });
                    setInput('');
                  }
                }}
                className="w-full"
              >
                <input
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder={status !== 'ready' ? "Processing..." : "Enter your question for the suspect..."}
                  disabled={status !== 'ready'}
                  className="w-full p-2.5 bg-gray-700 border border-gray-600 rounded-lg focus:border-yellow-500 focus:outline-none text-white placeholder-gray-400 disabled:opacity-50 font-mono text-sm"
                />
              </form>
            </div>
          </div>
        </div>

        {/* Case File - Right Side */}
        <div className="absolute right-2 top-20 w-56 h-72 bg-amber-50 border-4 border-amber-600 p-3 hidden lg:block transform rotate-1 dramatic-shadow">
          <div className="text-amber-800 text-sm font-bold mb-2 text-center border-b border-amber-600 pb-1">
            CASE FILE #2024-FT
          </div>

          <div className="space-y-2 text-xs text-amber-900">
            <div className="border-l-2 border-red-500 pl-2">
              <div className="font-bold">INCIDENT:</div>
              <div>Missing Fish Treats</div>
              <div className="text-gray-600">Qty: 12 pieces</div>
            </div>

            <div className="border-l-2 border-blue-500 pl-2">
              <div className="font-bold">FAMILY:</div>
              <div>• Jade (Mother)</div>
              <div>• Joshua (Father)</div>
              <div>• Jat (Sister, Witness)</div>
            </div>

            <div className="border-l-2 border-green-500 pl-2">
              <div className="font-bold">ROOMMATES:</div>
              <div>• Johnny (Bunny)</div>
              <div>• Jasmina (Bunny)</div>
            </div>

            <div className="border-l-2 border-purple-500 pl-2">
              <div className="font-bold">STATUS:</div>
              <div className="text-red-600 font-bold">INTERROGATION</div>
            </div>
          </div>

          {/* Official Stamps */}
          <div className="absolute bottom-3 right-3 transform rotate-12 opacity-60">
            <div className="border-2 border-red-600 rounded-full w-12 h-12 flex items-center justify-center text-red-600 text-xs font-bold">
              URGENT
            </div>
          </div>
        </div>

        {/* Coffee Cup - Detective Atmosphere */}
        <div className="absolute bottom-4 left-4 hidden lg:block">
          <div className="relative">
            <div className="w-12 h-14 bg-gradient-to-b from-amber-800 to-amber-900 rounded-b-full border-2 border-amber-700"></div>
            <div className="absolute top-1 left-1 right-1 h-3 bg-black rounded-full opacity-80"></div>
            {/* Steam Effect */}
            <div className="absolute -top-1 left-1/2 transform -translate-x-1/2">
              <div className="coffee-steam-effect w-0.5 h-6 bg-white opacity-30 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
