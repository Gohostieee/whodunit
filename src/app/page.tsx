'use client';
import Image from "next/image";
import { StaticMeshGradient } from '@paper-design/shaders-react';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { useEffect, useState } from 'react';

export default function Home() {
  const [dimensions, setDimensions] = useState({ width: 1920, height: 1080 });
  const [isMobile, setIsMobile] = useState(false);
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

  useEffect(() => {
    function handleResize() {
      const width = window.innerWidth;
      const height = window.innerHeight;
      setDimensions({ width, height });
      setIsMobile(width < 768); // Standard mobile breakpoint
    }

    handleResize(); // Set initial dimensions
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
  }, [lastAssistantMessage?.id, status]); // Trigger when message ID changes and status is ready

  return (
    <div className="relative min-h-screen">
      {/* Office background with glass effect */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/assets/office.png"
          alt="Office Background"
          fill
          className="object-cover blur-[3px]"
          priority
        />
        <div className="absolute inset-0 bg-white/30 backdrop-blur-md" />
      </div>
      
      {/* Gradient overlay - only shown on desktop */}
      {!isMobile && (
        <div className="absolute inset-0 z-10 overflow-hidden opacity-80 transition-opacity duration-300">
          <StaticMeshGradient
            width={dimensions.width}
            height={dimensions.height}
            colors={["#ffffff", "#6200ff", "#e2a3ff", "#ff99fd"]}
            positions={2}
            waveX={1}
            waveXShift={0.6}
            waveY={1}
            waveYShift={0.21}
            mixing={0.93}
            grainMixer={0}
            grainOverlay={0}
            rotation={270}
          />
        </div>
      )}
      <div className="relative z-20 font-sans flex flex-col items-center justify-end min-h-screen pb-8 px-4 gap-4">
        <div className="flex flex-col items-center gap-6 w-full max-w-md">
          {/* Loading indicator while preparing audio */}
          {isPreparingAudio && (
            <div className="relative bg-white/95 backdrop-blur-md rounded-2xl p-4 max-w-md shadow-xl border border-white/20 animate-fade-in">
              <div className="flex items-center gap-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                </div>
                <p className="text-gray-600 text-sm">Roxie is thinking...</p>
              </div>
              {/* Speech bubble tail */}
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full">
                <div className="w-0 h-0 border-l-[10px] border-r-[10px] border-t-[10px] border-l-transparent border-r-transparent border-t-white/95"></div>
              </div>
            </div>
          )}

          {/* Speech bubble - only shows when displayedMessage is ready */}
          {displayedMessage && !isPreparingAudio && (
             <div className="relative bg-white/95 backdrop-blur-md rounded-2xl p-4 max-w-md shadow-xl border border-white/20 animate-fade-in">
               <div className="flex items-start gap-2">
                 <p className="text-gray-900 text-sm font-medium flex-1">
                   {displayedMessage.parts.map((part: any, index: number) =>
                     part.type === 'text' ? <span key={index}>{part.text}</span> : null
                   )}
                 </p>
                 {isPlayingAudio && (
                   <div className="flex-shrink-0 w-4 h-4 animate-pulse">
                     <div className="w-full h-full bg-blue-500 rounded-full animate-ping"></div>
                   </div>
                 )}
               </div>
               {/* Speech bubble tail */}
               <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full">
                 <div className="w-0 h-0 border-l-[10px] border-r-[10px] border-t-[10px] border-l-transparent border-r-transparent border-t-white/95"></div>
               </div>
             </div>
          )}

          {/* Cat image */}
          <div className="flex justify-center">
            <Image
              src="/assets/cat.png"
              alt="Cat"
              width={300}
              height={250}
              className="object-contain"
            />
          </div>

          {/* Chat input */}
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
              placeholder={status !== 'ready' ? "Thinking..." : "Type your message here..."}
              disabled={status !== 'ready'}
               className="w-full p-3 border border-white/30 rounded-lg focus:border-blue-500 focus:outline-none bg-white/95 backdrop-blur-md shadow-lg text-gray-900 placeholder-gray-500 disabled:opacity-50 disabled:bg-white/80"
            />
          </form>
        </div>
      </div>
    </div>
  );
}
