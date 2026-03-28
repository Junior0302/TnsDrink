"use client";

import { useEffect, useState } from 'react';

// Extend Window interface to include our custom property
declare global {
  interface Window {
    __tnsAudio?: HTMLAudioElement;
  }
}

export default function AudioController({ isMobile = false }: { isMobile?: boolean }) {
  const [isPlaying, setIsPlaying] = useState(() => {
    if (typeof window !== 'undefined') {
      const audio = window.__tnsAudio;
      return audio ? !audio.paused : false;
    }
    return false;
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Listen for custom events
      const handleAudioState = (e: Event) => {
        const customEvent = e as CustomEvent<{ isPlaying: boolean }>;
        setIsPlaying(customEvent.detail.isPlaying);
      };

      window.addEventListener('tns-audio-state', handleAudioState);
      return () => window.removeEventListener('tns-audio-state', handleAudioState);
    }
  }, []);

  const toggleAudio = () => {
    if (typeof window !== 'undefined') {
      let audio = window.__tnsAudio;
      
      // Create audio instance if it doesn't exist yet
      if (!audio) {
        audio = new Audio('/Son/zoneTnsMusic.mp3');
        audio.loop = true;
        audio.volume = 0.5;
        
        // Add listener for seamless looping (crossfading effect)
        audio.addEventListener('timeupdate', function() {
          const buffer = 0.4; // seconds before end to trigger loop
          if (this.currentTime > this.duration - buffer) {
            this.currentTime = 0;
            this.play();
          }
        });
        
        window.__tnsAudio = audio;
      }

      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
        window.dispatchEvent(new CustomEvent('tns-audio-state', { detail: { isPlaying: false } }));
      } else {
        audio.play().catch((e: Error) => console.warn("Audio playback failed:", e));
        setIsPlaying(true);
        window.dispatchEvent(new CustomEvent('tns-audio-state', { detail: { isPlaying: true } }));
      }
    }
  };

  return (
    <button
      onClick={toggleAudio}
      aria-label={isPlaying ? "Mute audio" : "Unmute audio"}
      className={`flex items-center justify-center transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 rounded-full
        ${isMobile 
          ? "w-8 h-8 bg-white/5 hover:bg-white/10 text-white" 
          : "w-8 h-8 bg-transparent hover:bg-white/10 text-white/70 hover:text-white"
        }`}
    >
      {isPlaying ? (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="h-[18px] w-[18px]" aria-hidden="true">
          <path d="M11 5L6 9H2v6h4l5 4V5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M15.54 8.46a5 5 0 010 7.07M19.07 4.93a10 10 0 010 14.14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="h-[18px] w-[18px]" aria-hidden="true">
          <path d="M11 5L6 9H2v6h4l5 4V5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M23 9l-6 6M17 9l6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </button>
  );
}
