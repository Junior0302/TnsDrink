"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Image from "next/image";
import Link from "next/link";

interface IntroProps {
  onComplete: () => void;
  startAnimation: boolean;
}

export default function Intro({ onComplete, startAnimation }: IntroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const glassCardRef = useRef<HTMLDivElement>(null);
  
  // Product Refs
  const mainProductRef = useRef<HTMLDivElement>(null);
  const productLeftRef = useRef<HTMLDivElement>(null);
  const productRightRef = useRef<HTMLDivElement>(null);
  const productBackRef = useRef<HTMLDivElement>(null);
  const showcaseRef = useRef<HTMLDivElement>(null);
  const tiltToRef = useRef<{
    rx?: (value: number) => void;
    ry?: (value: number) => void;
    x?: (value: number) => void;
    y?: (value: number) => void;
  }>({});

  useGSAP(() => {
    const prefersReducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    const animations: gsap.core.Animation[] = [];

    if (!prefersReducedMotion) {
      animations.push(gsap.to(".floating-orb", {
        y: "random(-55, 55)",
        x: "random(-55, 55)",
        scale: "random(0.9, 1.18)",
        opacity: "random(0.35, 0.85)",
        duration: "random(3.8, 6.2)",
        repeat: -1,
        yoyo: true,
        repeatRefresh: true,
        ease: "sine.inOut",
        stagger: 1
      }));
    }

    if (showcaseRef.current) {
      gsap.set(showcaseRef.current, { x: 0, y: 0, rotationX: 0, rotationY: 0, rotationZ: 0 });

      tiltToRef.current = {
        rx: gsap.quickTo(showcaseRef.current, "rotationX", { duration: 0.55, ease: "power3.out" }),
        ry: gsap.quickTo(showcaseRef.current, "rotationY", { duration: 0.55, ease: "power3.out" }),
        x: gsap.quickTo(showcaseRef.current, "x", { duration: 0.55, ease: "power3.out" }),
        y: gsap.quickTo(showcaseRef.current, "y", { duration: 0.55, ease: "power3.out" }),
      };

      if (!prefersReducedMotion) {
        animations.push(gsap.to(showcaseRef.current, {
          y: -16,
          rotationZ: 0.6,
          duration: 7,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        }));
      }
    }

    if (!startAnimation) return;

    const tl = gsap.timeline();

    // Reset initial states
    gsap.set([titleRef.current, subtitleRef.current, buttonRef.current], { y: 30, opacity: 0 });
    gsap.set(glassCardRef.current, { y: 40, opacity: 0, scale: 0.9 });
    
    // Reset Products
    gsap.set(mainProductRef.current, { scale: 1.5, opacity: 0, y: 100 });
    gsap.set([productLeftRef.current, productRightRef.current, productBackRef.current], { 
      scale: 0.8, 
      opacity: 0, 
      x: (i) => i === 0 ? -100 : i === 1 ? 100 : 0, // Split left/right
      y: 50
    });

    // Entrance Animation Sequence
    tl
    // 1. Products explode in
    .to(mainProductRef.current, {
      opacity: 1,
      scale: 1,
      y: 0,
      duration: 1.15,
      ease: "power4.out",
    })
    .to([productLeftRef.current, productRightRef.current, productBackRef.current], {
      opacity: 1,
      scale: 0.8, // Keep them slightly smaller
      x: 0, // Return to natural position (handled by CSS positioning)
      y: 0,
      duration: 1.2,
      stagger: 0.1,
      ease: "power3.out",
    }, "-=1.2")
    
    // 2. Glass Card & Content
    .to(glassCardRef.current, {
      y: 0,
      opacity: 1,
      scale: 1,
      duration: 1.0,
      ease: "power3.out",
    }, "-=0.8")
    .to(titleRef.current, {
      y: 0,
      opacity: 1,
      duration: 0.8,
      ease: "power3.out",
    }, "-=0.6")
    .to(subtitleRef.current, {
      y: 0,
      opacity: 1,
      duration: 0.8,
      ease: "power3.out",
    }, "-=0.6")
    .to(buttonRef.current, {
      y: 0,
      opacity: 1,
      duration: 0.6,
      ease: "power3.out",
    }, "-=0.4")
    .call(() => {
      if (prefersReducedMotion) return;
      if (mainProductRef.current) {
        animations.push(gsap.to(mainProductRef.current, { y: "+=22", rotation: "+=1.2", duration: 3.6, repeat: -1, yoyo: true, ease: "sine.inOut", overwrite: "auto" }));
      }
      if (productLeftRef.current) {
        animations.push(gsap.to(productLeftRef.current, { y: "+=18", x: "+=10", rotation: "-=1.6", duration: 4.2, repeat: -1, yoyo: true, ease: "sine.inOut", overwrite: "auto" }));
      }
      if (productRightRef.current) {
        animations.push(gsap.to(productRightRef.current, { y: "+=18", x: "-=10", rotation: "+=1.6", duration: 4.4, repeat: -1, yoyo: true, ease: "sine.inOut", overwrite: "auto" }));
      }
      if (productBackRef.current) {
        animations.push(gsap.to(productBackRef.current, { y: "+=12", rotation: "-=0.8", duration: 5.8, repeat: -1, yoyo: true, ease: "sine.inOut", overwrite: "auto" }));
      }
    }, []);

    const onVisibilityChange = () => {
      if (document.hidden) animations.forEach((a) => a.pause());
      else animations.forEach((a) => a.resume());
    };

    document.addEventListener("visibilitychange", onVisibilityChange);
    onVisibilityChange();

    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChange);
      animations.forEach((a) => a.kill());
    };
  }, { scope: containerRef, dependencies: [startAnimation] });

  // Mouse Move Parallax Effect
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    if (typeof window !== "undefined" && window.matchMedia && !window.matchMedia("(pointer: fine)").matches) return;
    if (!showcaseRef.current) return;
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    
    const dx = clientX / innerWidth - 0.5;
    const dy = clientY / innerHeight - 0.5;

    tiltToRef.current.ry?.(dx * 6);
    tiltToRef.current.rx?.(-dy * 6);
    tiltToRef.current.x?.(dx * 10);
    tiltToRef.current.y?.(dy * 8);
  };

  const handleMouseLeave = () => {
    tiltToRef.current.ry?.(0);
    tiltToRef.current.rx?.(0);
    tiltToRef.current.x?.(0);
    tiltToRef.current.y?.(0);
  };

  const handleEnter = () => {
    // Check if audio context already exists, if not, create and play
    if (typeof window !== 'undefined') {
      const existingAudio = window.__tnsAudio;
      if (!existingAudio) {
        const audio = new Audio('/Son/zoneTnsMusic.mp3');
        audio.loop = true;
        audio.volume = 0.5; // Set volume to 50%
        
        // Add listener for seamless looping (crossfading effect)
        audio.addEventListener('timeupdate', function() {
          const buffer = 0.4; // seconds before end to trigger loop
          if (this.currentTime > this.duration - buffer) {
            this.currentTime = 0;
            this.play();
          }
        });

        audio.play().catch(error => {
          console.warn("Audio playback failed. The browser may require user interaction first.", error);
        });
        window.__tnsAudio = audio;
        
        // Dispatch custom event for audio state
        window.dispatchEvent(new CustomEvent('tns-audio-state', { detail: { isPlaying: true } }));
      } else if (existingAudio.paused) {
        existingAudio.play().catch(console.warn);
        window.dispatchEvent(new CustomEvent('tns-audio-state', { detail: { isPlaying: true } }));
      }
    }

    const tl = gsap.timeline({
      onComplete: onComplete
    });

    // Exit Animation - All fly away
    tl.to([mainProductRef.current, productLeftRef.current, productRightRef.current, productBackRef.current], {
      y: -100,
      opacity: 0,
      scale: 1.2,
      stagger: 0.05,
      duration: 0.8,
      ease: "power2.in"
    })
    .to(glassCardRef.current, {
      y: 50,
      opacity: 0,
      scale: 0.9,
      duration: 0.6,
      ease: "power2.in"
    }, "-=0.6")
    .to(containerRef.current, {
      opacity: 0,
      duration: 0.8,
      ease: "power2.inOut",
      pointerEvents: "none"
    }, "-=0.4");
  };

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="fixed inset-0 z-[9000] flex flex-col items-center justify-center text-white bg-gradient-to-br from-[#4c1d95] via-[#2e1065] to-[#0f0c29] overflow-hidden perspective-[1000px]"
    >
      <div className="absolute top-4 left-4 z-40 pointer-events-none">
        <div className="px-2 py-1 rounded-full bg-black/20 backdrop-blur-md border border-white/20 text-[9px] uppercase tracking-[0.22em] text-white/85">
          WELCOME
        </div>
      </div>

      {/* Dynamic Background Orbs - Lighter & More Vibrant */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[20%] w-[40vw] h-[40vw] bg-violet-500/30 rounded-full blur-[100px] floating-orb mix-blend-screen" />
        <div className="absolute bottom-[10%] right-[-5%] w-[50vw] h-[50vw] bg-fuchsia-600/20 rounded-full blur-[120px] floating-orb mix-blend-screen" />
        <div className="absolute top-[40%] left-[-10%] w-[35vw] h-[35vw] bg-indigo-500/20 rounded-full blur-[90px] floating-orb mix-blend-screen" />
      </div>

      {/* Product Showcase - Behind the Card */}
      <div ref={showcaseRef} className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none transform-gpu will-change-transform [transform-style:preserve-3d]">
         {/* Back - Magenta */}
         <div ref={productBackRef} className="absolute top-[25%] left-[50%] -translate-x-1/2 w-[150px] md:w-[300px] opacity-0 blur-sm">
            <Image src="/img/mov.png" alt="Magenta" width={400} height={600} className="object-contain drop-shadow-2xl" />
         </div>

         {/* Left - Green */}
         <div ref={productLeftRef} className="absolute top-[40%] left-[5%] md:left-[15%] w-[160px] md:w-[350px] opacity-0 -rotate-12">
            <Image src="/img/vert.png" alt="Green" width={400} height={600} className="object-contain drop-shadow-2xl" />
         </div>

         {/* Right - Blue */}
         <div ref={productRightRef} className="absolute top-[40%] right-[5%] md:right-[15%] w-[160px] md:w-[350px] opacity-0 rotate-12">
            <Image src="/img/bleu.png" alt="Blue" width={400} height={600} className="object-contain drop-shadow-2xl" />
         </div>

         {/* Center Main - Violet */}
         <div ref={mainProductRef} className="absolute top-[35%] md:top-[15%] left-[50%] -translate-x-1/2 w-[220px] md:w-[450px] z-20 opacity-0">
            <Image src="/img/violet.png" alt="Violet Storm" width={500} height={700} className="object-contain drop-shadow-[0_0_50px_rgba(139,92,246,0.6)]" priority />
         </div>
      </div>

      {/* Glassmorphism Content Card - Positioned Lower */}
      <div 
        ref={glassCardRef}
        className="relative z-30 w-[92%] md:w-full max-w-lg md:max-w-2xl mt-[-6vh] md:mt-[2vh] p-4 sm:p-5 md:p-8 rounded-[1.25rem] md:rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-[4px] shadow-[0_0_60px_rgba(139,92,246,0.1)] flex flex-col items-center text-center opacity-0"
      >
        {/* Shine Effect - Reduced */}
        <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />

        <div className="mb-3 md:mb-4 relative">
          <span className="inline-block py-0.5 px-2 md:py-0.5 md:px-2 rounded-full border border-violet-300/20 bg-violet-900/20 text-[8px] md:text-[9px] font-bold tracking-[0.2em] uppercase text-violet-200 mb-2 md:mb-2 backdrop-blur-sm shadow-sm">
            New Collection 2026
          </span>
          <h1 
            ref={titleRef}
            className="text-2xl sm:text-3xl md:text-6xl font-black uppercase tracking-[0.14em] leading-[1.04] drop-shadow-2xl"
          >
            <span className="block text-white/80 drop-shadow-[0_10px_30px_rgba(0,0,0,0.55)]">Violet</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-violet-200 via-violet-100/80 to-violet-200 filter drop-shadow-[0_0_18px_rgba(167,139,250,0.35)]">Storm</span>
          </h1>
        </div>
        
        <p 
          ref={subtitleRef}
          className="text-[11px] sm:text-xs md:text-sm font-medium text-violet-100/90 max-w-sm mb-3 md:mb-6 leading-relaxed tracking-wide mix-blend-plus-lighter"
        >
          Discover the full spectrum of energy. From the electric pulse of Violet to the deep freeze of Blue.
        </p>
        
        <button
          ref={buttonRef}
          onClick={handleEnter}
          className="group relative px-5 py-1.5 md:px-8 md:py-2.5 bg-white text-violet-950 rounded-full font-bold uppercase tracking-[0.18em] text-[9px] md:text-[11px] hover:scale-105 transition-all duration-300 shadow-[0_0_30px_rgba(255,255,255,0.4)] hover:shadow-[0_0_50px_rgba(139,92,246,0.8)] active:scale-95"
        >
          <span className="relative z-10 flex items-center gap-2">
            Explore Range
            <svg className="w-3.5 h-3.5 transform group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </span>
        </button>
      </div>
      
      <footer className="absolute bottom-0 left-0 w-full z-30 pointer-events-auto">
        <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-6 md:px-10 pb-[calc(12px+env(safe-area-inset-bottom))]">
          <div className="relative border border-white/10 bg-black/25 backdrop-blur-xl rounded-2xl md:bg-black/35 shadow-lg">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            <div className="px-5 md:px-8 py-3">
              <div className="grid grid-cols-2 md:grid-cols-3 items-center gap-y-2 gap-x-4 text-[10px] md:text-[11px] font-semibold uppercase tracking-[0.2em] text-white/75">
                <Link
                  href="/"
                  className="justify-self-start text-white/90 hover:text-white transition-colors whitespace-nowrap font-bold tracking-[0.22em]"
                >
                  TNS DIGITAL
                </Link>

                <div className="justify-self-end md:justify-self-center flex items-center justify-center gap-4">
                  <Link
                    href="/mentions-legales"
                    className="hover:text-white transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent pointer-events-auto"
                  >
                    Legal Notice
                  </Link>
                </div>

                <div className="hidden md:flex justify-self-end items-center justify-end gap-4 pointer-events-auto">
                  <div className="flex items-center gap-3">
                    <a
                      href="https://instagram.com"
                      target="_blank"
                      rel="noreferrer"
                      aria-label="Instagram"
                      className="text-white/70 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent rounded"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
                        <path
                          d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Z"
                          stroke="currentColor"
                          strokeWidth="2"
                        />
                        <path
                          d="M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"
                          stroke="currentColor"
                          strokeWidth="2"
                        />
                        <path d="M17.5 6.5h.01" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                      </svg>
                    </a>
                    <a
                      href="https://x.com"
                      target="_blank"
                      rel="noreferrer"
                      aria-label="X"
                      className="text-white/70 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent rounded"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
                        <path
                          d="M4 4l16 16M20 4L4 20"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      </svg>
                    </a>
                  </div>
                  <div className="text-white/55 whitespace-nowrap font-medium tracking-[0.12em]">
                    © {new Date().getFullYear()} TNS
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
