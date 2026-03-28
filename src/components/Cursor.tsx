"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

/**
 * TNS DIGITAL - Custom Cursor
 * -------------------------
 * A fluid, custom cursor component that replaces the system cursor.
 * Features:
 * - Lag-free movement using GSAP quickTo
 * - Dynamic sizing and styling on hover
 * - Blend mode difference for visibility on all backgrounds
 */

interface CursorProps {
  color: string;
}

export default function Cursor({ color }: CursorProps) {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);

  useGSAP(() => {
    gsap.set(cursorRef.current, { xPercent: -50, yPercent: -50 });

    const xTo = gsap.quickTo(cursorRef.current, "x", { duration: 0.15, ease: "power3" });
    const yTo = gsap.quickTo(cursorRef.current, "y", { duration: 0.15, ease: "power3" });

    if (window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches) return;

    let rafId = 0;
    let lastX = 0;
    let lastY = 0;
    let isActive = !document.hidden;

    const flush = () => {
      rafId = 0;
      if (!isActive) return;
      xTo(lastX);
      yTo(lastY);
    };

    const onMove = (e: PointerEvent) => {
      if (!isActive) return;
      lastX = e.clientX;
      lastY = e.clientY;
      if (rafId) return;
      rafId = window.requestAnimationFrame(flush);
    };

    const onVisibilityChange = () => {
      isActive = !document.hidden;
      if (!isActive && rafId) {
        window.cancelAnimationFrame(rafId);
        rafId = 0;
      }
    };

    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("pointermove", onMove, { passive: true });

    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("pointermove", onMove);
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, []);

  useEffect(() => {
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "BUTTON" ||
        target.tagName === "A" ||
        target.closest("button") ||
        target.closest("a") ||
        target.classList.contains("hover-trigger")
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    if (process.env.NODE_ENV === "development") {
      const w = window as unknown as { __tnsLongTaskObserverInstalled?: boolean };
      if (!w.__tnsLongTaskObserverInstalled && "PerformanceObserver" in window) {
        try {
          const observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
              if (entry.duration < 50) continue;
              console.warn("[perf] longtask", { name: entry.name, duration: entry.duration, startTime: entry.startTime });
            }
          });
          observer.observe({ entryTypes: ["longtask"] });
          w.__tnsLongTaskObserverInstalled = true;
        } catch {}
      }
    }

    window.addEventListener("mouseover", handleMouseOver, { passive: true });
    return () => window.removeEventListener("mouseover", handleMouseOver);
  }, []);

  return (
    <>
      {/* Main Cursor Dot (TNS DIGITAL Style) - Hidden on Touch Devices */}
      <div
        ref={cursorRef}
        className={`hidden md:block fixed top-0 left-0 rounded-full pointer-events-none z-[9999] mix-blend-difference bg-white transition-all duration-300 ease-out ${
          isHovering ? "w-12 h-12" : "w-6 h-6"
        }`}
        style={{
           // Optional: Tint the cursor with the current theme color slightly if desired, 
           // but mix-blend-difference works best with white.
           // We can add a border or glow based on color if needed.
           boxShadow: isHovering ? `0 0 20px ${color}` : "none",
           borderColor: color,
           borderWidth: isHovering ? "2px" : "0px"
        }}
      />
    </>
  );
}
