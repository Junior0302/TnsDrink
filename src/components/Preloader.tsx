"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

/**
 * TNS DIGITAL - Preloader
 * -----------------------
 * A full-screen loading overlay that ensures all assets are ready before revealing the scene.
 */

export default function Preloader({ onComplete, onStartExit }: { onComplete: () => void; onStartExit?: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        // Signal that exit is starting
        if (onStartExit) onStartExit();

        // Fade out container then trigger completion
        gsap.to(containerRef.current, {
          yPercent: -100,
          duration: 1.2,
          ease: "power4.inOut",
          onComplete: onComplete
        });
      }
    });

    // Animate Gradient Background Position
    gsap.to(containerRef.current, {
      backgroundPosition: "200% center",
      duration: 3,
      ease: "none",
      repeat: -1
    });

    // Simulate loading or wait for actual window load
    // For a smoother experience, we animate the progress bar
    tl.to(barRef.current, {
      width: "100%",
      duration: 2.0, // Slightly faster
      ease: "power2.inOut",
    });

    // Animate Text
    gsap.from(textRef.current, {
      y: 40,
      opacity: 0,
      duration: 1.5,
      ease: "power3.out",
    });

    // Check if window is actually loaded
    if (document.readyState === "complete") {
       // already loaded, timeline continues
    } else {
       window.addEventListener("load", () => {
          // ensure timeline finishes
       });
    }

  }, { scope: containerRef });

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-[10000] flex flex-col items-center justify-center text-white"
      style={{
        background: "radial-gradient(circle at center, #6d28d9 0%, #4c1d95 100%)", // Violet 700 to Violet 900 (Clean & Premium)
      }}
    >
      <div className="absolute top-4 left-4 z-10 pointer-events-none">
        <div className="px-2 py-1 rounded-full bg-black/20 backdrop-blur-md border border-white/20 text-[9px] uppercase tracking-[0.22em] text-white/85">
          CHARGEMENT
        </div>
      </div>

      <div className="overflow-hidden mb-12 relative">
        <h1 ref={textRef} className="text-5xl md:text-7xl font-black tracking-tighter text-transparent bg-clip-text bg-white drop-shadow-2xl">
          TNS DIGITAL
        </h1>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
      </div>

      {/* Progress Bar Container */}
      <div className="w-64 md:w-80 h-[2px] bg-white/10 rounded-full overflow-hidden relative">
        <div 
          ref={barRef}
          className="h-full bg-white w-0 shadow-[0_0_20px_rgba(255,255,255,0.8)]"
        />
      </div>
      
      <p className="mt-6 text-[10px] uppercase tracking-[0.4em] font-medium opacity-60 animate-pulse">
        Loading Experience
      </p>
    </div>
  );
}
