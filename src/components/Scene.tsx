"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Observer } from "gsap/Observer";
import { STORY_CONTENT } from "@/data/content";
import Slide from "./Slide";
import Cursor from "./Cursor";
import Preloader from "./Preloader";
import Intro from "./Intro";
import AudioController from "./AudioController";

/**
 * TNS DIGITAL - Scene Controller
 * ----------------------------
 * Manages the main scroll interaction, scene transitions, and background color shifts.
 * Uses GSAP Observer for precise scroll hijacking and timeline control.
 */

gsap.registerPlugin(Observer);

export default function Scene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const slidesRef = useRef<(HTMLDivElement | null)[]>([]);
  const headerRef = useRef<HTMLElement>(null);
  const gotoSlideRef = useRef<((index: number) => void) | null>(null);
  
  const searchParams = useSearchParams();
  const shouldSkip = searchParams.get("skipIntro") === "true";

  // State for active index and animation lock
  const [currentIndex, setCurrentIndex] = useState(0);
  const [bgColor, setBgColor] = useState(STORY_CONTENT[0].color);
  const [isLoading, setIsLoading] = useState(!shouldSkip); // Loading State
  const [showIntro, setShowIntro] = useState(!shouldSkip); // Intro State (Starts true)
  const [introReady, setIntroReady] = useState(false); // Triggers Intro Animation
  const isAnimating = useRef(false);
  const indexRef = useRef(0);

  // Current color for cursor
  const currentColor = STORY_CONTENT[currentIndex].color;

  useGSAP(() => {
    if (isLoading || showIntro) return; // Wait for load AND intro to finish

    const slides = slidesRef.current;
    
    // Initial setup: Ensure only first slide is visible and properly positioned
    slides.forEach((slide, i) => {
      gsap.set(slide, { xPercent: 0, autoAlpha: i === 0 ? 1 : 0, pointerEvents: i === 0 ? "auto" : "none" });
    });

    // Intro Animation Timeline
    const introTl = gsap.timeline({ delay: 0.1 });
    const firstSlide = slides[0];
    const revealEls = Array.from(containerRef.current?.querySelectorAll("[data-home-reveal]") ?? []) as HTMLElement[];
    
    // Header Intro
    if (headerRef.current) {
      gsap.set(headerRef.current, { y: 42, opacity: 0, filter: "blur(10px)" });
      introTl.to(headerRef.current, {
        y: 0,
        opacity: 1,
        filter: "blur(0px)",
        duration: 1.05,
        ease: "power4.out"
      }, 0);
    }

    // First Slide Elements Intro
    if (firstSlide) {
       const elements = Array.from(firstSlide.querySelectorAll(".slide-element") || []) as HTMLElement[];
       if (elements.length > 0) {
         gsap.set(elements, { y: 64, opacity: 0, filter: "blur(10px)" });
         introTl.to(elements, {
           y: 0,
           opacity: 1,
           filter: "blur(0px)",
           duration: 0.9,
           stagger: 0.055,
           ease: "power4.out"
         }, 0.12);
       }
    }

    if (revealEls.length > 0) {
      gsap.set(revealEls, { y: 36, opacity: 0, filter: "blur(10px)" });
      introTl.to(
        revealEls,
        {
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          duration: 0.85,
          stagger: 0.04,
          ease: "power4.out",
        },
        0.18
      );
    }

    // Function to handle slide transition
    const gotoSlide = (index: number) => {
      if (isAnimating.current || index === indexRef.current) return;
      isAnimating.current = true;

      const currentIndex = indexRef.current;
      const direction = index > currentIndex ? 1 : -1;
      const currentSlide = slides[currentIndex];
      const nextSlide = slides[index];
      const nextColor = STORY_CONTENT[index]?.color ?? "#7B2FFF";
      const currentImage = currentSlide?.querySelector(".slide-image-wrapper") as HTMLElement | null;
      const nextImage = nextSlide?.querySelector(".slide-image-wrapper") as HTMLElement | null;

      // Update refs immediately
      indexRef.current = index;
      setCurrentIndex(index);

      // Ensure z-index management for proper layering during transition
      gsap.set(currentSlide, { zIndex: 10, pointerEvents: "none" });
      gsap.set(nextSlide, { zIndex: 20, pointerEvents: "auto" });

      const timeline = gsap.timeline({
        onComplete: () => {
          isAnimating.current = false;
          // Reset z-indexes after transition
          gsap.set(slides, { zIndex: 1 });
          gsap.set(nextSlide, { zIndex: 10 }); // Keep active on top
          
          // Ensure previous slide is fully hidden
          gsap.set(currentSlide, { autoAlpha: 0, pointerEvents: "none" });
        }
      });

      const currentElements = Array.from(currentSlide?.querySelectorAll(".slide-element") || []) as HTMLElement[];
      const nextElements = Array.from(nextSlide?.querySelectorAll(".slide-element") || []) as HTMLElement[];

      gsap.set(nextSlide, { xPercent: 0, autoAlpha: 1, pointerEvents: "auto" });
      if (nextElements.length > 0) {
        gsap.set(nextElements, { opacity: 0 });
      }

      timeline.to(currentSlide, { autoAlpha: 0, duration: 0.6, ease: "power2.out" }, 0);
      timeline.fromTo(nextSlide, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.75, ease: "power2.out" }, 0.05);
      timeline.call(() => setBgColor(nextColor), [], 0.22);

      if (nextImage) {
        gsap.set(nextImage, { x: 180 * direction, opacity: 0, scale: 0.92, filter: "blur(12px)", rotate: 0.01 });
        timeline.to(
          nextImage,
          { x: 0, opacity: 1, scale: 1, filter: "blur(0px)", duration: 1.4, ease: "power4.out" },
          0.02
        );
        timeline.to(nextImage, { x: -14 * direction, duration: 0.32, ease: "power2.out" }, 1.12);
        timeline.to(nextImage, { x: 0, duration: 0.62, ease: "power3.out" }, 1.38);
      }

      if (currentImage) {
        timeline.to(
          currentImage,
          { x: -180 * direction, opacity: 0, scale: 0.98, filter: "blur(10px)", duration: 0.8, ease: "power2.inOut" },
          0
        );
      }

      if (currentElements.length > 0) {
        timeline.to(currentElements, {
          opacity: 0,
          duration: 0.35,
          stagger: 0.025,
          ease: "power2.out"
        }, 0.05);
      } else {
        timeline.to(currentSlide, { autoAlpha: 0, duration: 0.2, ease: "power2.out" }, 0);
      }

      if (nextElements.length > 0) {
        timeline.to(nextElements, {
          opacity: 1,
          duration: 0.55,
          stagger: 0.035,
          ease: "power2.out"
        }, 0.22);
      } else {
        timeline.fromTo(nextSlide, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.35, ease: "power2.out" }, 0.1);
      }

      try {
        sessionStorage.setItem("lastSceneDirection", String(direction));
        sessionStorage.setItem("lastSceneIndex", String(index));
      } catch {}
    };

    gotoSlideRef.current = (index: number) => gotoSlide(index);

    // Observer for Scroll/Touch/Wheel
    Observer.create({
      target: containerRef.current,
      type: "wheel,touch",
      wheelSpeed: 1,
      onUp: () => {
        if (!isAnimating.current && indexRef.current > 0) {
          gotoSlide(indexRef.current - 1);
        }
      },
      onDown: () => {
        if (!isAnimating.current && indexRef.current < STORY_CONTENT.length - 1) {
          gotoSlide(indexRef.current + 1);
        }
      },
      tolerance: 10,
      ignore: "a,button,input,select,textarea,[data-observer-ignore]",
      allowClicks: true,
      preventDefault: true
    });
    
  }, { scope: containerRef, dependencies: [isLoading, showIntro] }); // Re-run when loading/intro finishes

  const handleDotClick = (index: number) => {
    if (isLoading || showIntro) return;
    gotoSlideRef.current?.(index);
  };

  return (
    <div 
      ref={containerRef} 
      className="relative w-full min-h-[100svh] h-[100svh] overflow-hidden text-slate-100 cursor-none"
    >
      {/* Preloader - Handles its own exit animation then signals completion */}
      {isLoading && (
        <Preloader 
          onStartExit={() => setIntroReady(true)}
          onComplete={() => setIsLoading(false)} 
        />
      )}

      {/* Intro Section - Visible underneath Preloader, animates when ready */}
      {showIntro && (
        <Intro 
          startAnimation={introReady}
          onComplete={() => setShowIntro(false)} 
        />
      )}

      <Cursor color={currentColor} />

      {/* Background */}
      <div 
        ref={bgRef} 
        className="absolute inset-0 z-0 transition-colors duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{ backgroundColor: bgColor }}
      />

      <div className="absolute inset-0 z-[1] pointer-events-none">
        <div
          className="absolute top-[clamp(-220px,-16vw,-140px)] left-[clamp(-220px,-16vw,-140px)] h-[clamp(320px,48vw,520px)] w-[clamp(320px,48vw,520px)] rounded-full opacity-[0.22] blur-[clamp(70px,10vw,110px)] animate-[drift_10s_ease-in-out_infinite_alternate] transition-[background-color,opacity] duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{ backgroundColor: bgColor }}
        />
        <div
          className="absolute bottom-[clamp(-200px,-14vw,-120px)] right-[clamp(-200px,-14vw,-120px)] h-[clamp(280px,44vw,460px)] w-[clamp(280px,44vw,460px)] rounded-full opacity-[0.18] blur-[clamp(70px,10vw,110px)] animate-[drift_13s_ease-in-out_infinite_alternate-reverse] transition-[background-color,opacity] duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{ backgroundColor: bgColor }}
        />
      </div>
      
      {/* Header */}
      <header 
        ref={headerRef}
        className="fixed top-0 left-0 z-[100] w-full pointer-events-auto"
      >
        <div className="flex items-center justify-between px-[clamp(16px,4vw,40px)] py-[clamp(12px,2.5vw,28px)]">
          <Link href="/" className="inline-flex items-center gap-3">
            <span className="rounded-full bg-white h-[clamp(6px,0.8vw,10px)] w-[clamp(6px,0.8vw,10px)]" />
            <span className="text-[clamp(10px,1.2vw,14px)] uppercase tracking-[0.12em] text-white">
              TNS DIGITAL
            </span>
          </Link>

          <button
            type="button"
            aria-label="Open menu"
            className="flex flex-col items-end gap-[clamp(4px,0.5vw,6px)]"
          >
            <span className="block h-px w-[clamp(16px,2vw,22px)] bg-white" />
            <span className="block h-px w-[clamp(16px,2vw,22px)] bg-white" />
          </button>
        </div>
      </header>

      {/* Noise Texture Overlay - Removed for cleaner look */}
      {/* <div className="absolute inset-0 z-[1] opacity-5 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] brightness-100 contrast-150" /> */}

      <div className="absolute inset-0 z-[2] pointer-events-none">
        <div className="absolute top-[clamp(12px,2vw,24px)] left-[clamp(12px,2vw,24px)] max-[380px]:hidden h-[clamp(18px,3vw,40px)] w-[clamp(18px,3vw,40px)]">
          <span className="absolute left-0 top-0 h-px w-full bg-white/15" />
          <span className="absolute left-0 top-0 h-full w-px bg-white/15" />
        </div>
        <div className="absolute bottom-[clamp(12px,2vw,24px)] right-[clamp(12px,2vw,24px)] max-[380px]:hidden h-[clamp(18px,3vw,40px)] w-[clamp(18px,3vw,40px)]">
          <span className="absolute right-0 bottom-0 h-px w-full bg-white/15" />
          <span className="absolute right-0 bottom-0 h-full w-px bg-white/15" />
        </div>
      </div>

      {/* Slides Container */}
      <div className="relative z-10 w-full h-full">
        {STORY_CONTENT.map((slide, index) => (
        <div
          key={slide.id}
          ref={(el) => { slidesRef.current[index] = el; }}
          className="absolute inset-0 w-full h-full flex items-center justify-center opacity-0" // Start hidden, GSAP reveals
        >
          <Slide data={slide} index={index} />
        </div>
      ))}
      </div>

      {!isLoading && !showIntro && (
        <>
          <div data-home-reveal className="hidden min-[1100px]:flex absolute left-[clamp(16px,3vw,48px)] top-1/2 -translate-y-1/2 z-40 flex-col gap-[clamp(14px,2vh,22px)] pointer-events-none">
            {STORY_CONTENT[currentIndex].stats.slice(0, 3).map((stat) => (
              <div key={stat.label} className="flex flex-col gap-1">
                <span className="text-[clamp(10px,0.8vw,10px)] uppercase tracking-[0.2em] text-white/40">{stat.label}</span>
                <span className="text-[clamp(12px,1.2vw,15px)] font-semibold uppercase tracking-[0.12em] text-white">{stat.value}</span>
              </div>
            ))}
          </div>

          <div data-home-reveal className="hidden min-[1100px]:flex absolute right-[clamp(16px,3vw,48px)] top-1/2 -translate-y-1/2 z-40 pointer-events-none">
            <div className="relative text-right text-[clamp(11px,1vw,13px)] leading-[1.65] text-white/80 max-w-[clamp(160px,16vw,240px)] rounded-xl bg-black/10 backdrop-blur-[10px] border border-white/10 px-4 py-3">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                className="absolute -top-2 -left-2 h-[clamp(12px,1.6vw,16px)] w-[clamp(12px,1.6vw,16px)] text-white/25"
                aria-hidden="true"
              >
                <path
                  d="M10 10c0-1.7-1.3-3-3-3S4 8.3 4 10c0 1.3.7 2.4 1.8 2.8-.5 1.5-1.5 2.6-1.8 2.9h3c1.7-1.2 3-3.5 3-5.7z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
                <path
                  d="M20 10c0-1.7-1.3-3-3-3s-3 1.3-3 3c0 1.3.7 2.4 1.8 2.8-.5 1.5-1.5 2.6-1.8 2.9h3c1.7-1.2 3-3.5 3-5.7z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
              </svg>
              {STORY_CONTENT[currentIndex].description}
            </div>
          </div>

          <footer data-home-reveal className="absolute bottom-0 left-0 w-full z-50 pointer-events-auto">
            <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-6 md:px-10 pb-[calc(12px+env(safe-area-inset-bottom))]">
              <div className="relative border border-white/10 bg-black/25 backdrop-blur-xl rounded-2xl md:bg-black/35 shadow-lg">
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                <div className="px-5 md:px-8 py-3">
                  <div className="flex flex-col sm:flex-row justify-between md:grid md:grid-cols-3 items-center gap-y-3 gap-x-4 text-[10px] md:text-[11px] font-semibold uppercase tracking-[0.2em] text-white/75">
                    <Link
                      href="/?skipIntro=true"
                      className="justify-self-start text-white/90 hover:text-white transition-colors whitespace-nowrap font-bold tracking-[0.22em]"
                    >
                      TNS DIGITAL
                    </Link>

                    <div className="justify-self-end md:justify-self-center flex items-center justify-center gap-4">
                      <Link
                        href="/mentions-legales"
                        className="md:hidden hover:text-white transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-black/30 pointer-events-auto"
                      >
                        Legal Notice
                      </Link>
                      <div className="md:hidden pointer-events-auto">
                        <AudioController isMobile={true} />
                      </div>
                      
                      <div className="flex items-center gap-3 pointer-events-auto">
                        {STORY_CONTENT.map((slide, idx) => {
                          const isActive = idx === currentIndex;
                          return (
                            <button
                              key={slide.id}
                              type="button"
                              aria-label={`Go to ${slide.title}`}
                              onClick={() => handleDotClick(idx)}
                              className={["rounded-full outline-none transition-[transform,background-color,opacity,width] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] active:scale-90 focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-black/30", isActive ? "bg-white opacity-100 h-[6px] w-[18px]" : "bg-white/30 opacity-80 h-[6px] w-[6px] hover:opacity-100"].join(" ")}
                            />
                          );
                        })}
                      </div>
                    </div>

                    <div className="hidden md:flex justify-self-end items-center justify-end gap-4 pointer-events-auto">
                      <AudioController />
                      <Link
                        href="/mentions-legales"
                        className="hover:text-white transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-black/30"
                      >
                        Legal Notice
                      </Link>
                      <div className="flex items-center gap-3">
                        <a
                          href="https://instagram.com"
                          target="_blank"
                          rel="noreferrer"
                          aria-label="Instagram"
                          className="text-white/70 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-black/30 rounded"
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
                          className="text-white/70 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-black/30 rounded"
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
        </>
      )}

    </div>
  );
}
