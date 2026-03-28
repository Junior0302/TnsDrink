"use client";

import { SlideData } from "@/data/content";
import Image from "next/image";
import Link from "next/link";
import React from "react";

/**
 * TNS DIGITAL - Slide Component
 * ---------------------------
 * Displays individual slide content including the hero image, text, and interactive elements.
 * Features advanced GSAP hover effects for the product image.
 */

interface SlideProps {
  data: SlideData;
  index: number;
}

function hexToRgba(hex: string, alpha: number) {
  const normalized = hex.replace("#", "").trim();
  const expanded =
    normalized.length === 3
      ? normalized.split("").map((c) => c + c).join("")
      : normalized;
  if (expanded.length !== 6) return `rgba(123,47,255,${alpha})`;
  const r = parseInt(expanded.slice(0, 2), 16);
  const g = parseInt(expanded.slice(2, 4), 16);
  const b = parseInt(expanded.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

export default function Slide({ data, index }: SlideProps) {
  return (
    <div className="w-full h-full relative perspective-[1000px] overflow-hidden">

      {/* Main Content */}
      <div className="slide-content w-full min-h-[100svh] relative z-10 flex items-center justify-center px-[clamp(16px,5vw,60px)] pt-[clamp(60px,8vh,100px)] pb-[clamp(96px,14vh,160px)] min-[700px]:pb-[clamp(110px,14vh,170px)] min-[1100px]:pb-[clamp(80px,10vh,120px)]">
        <div className="w-full max-w-[1200px] mx-auto flex flex-col items-center justify-center text-center relative">
          <div className="slide-element mb-[clamp(16px,2.5vh,32px)] hidden md:flex items-center gap-3">
            <span className="h-px w-[clamp(20px,3vw,40px)] bg-white/30 max-[480px]:hidden" />
            <span className="inline-flex items-center gap-2 text-[clamp(10px,0.9vw,11px)] uppercase tracking-[0.25em] text-white/70 drop-shadow-[0_2px_10px_rgba(0,0,0,0.25)]">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                className="h-[clamp(12px,1.6vw,14px)] w-[clamp(12px,1.6vw,14px)] text-white/75"
                aria-hidden="true"
              >
                <path
                  d="M13 2L4 14h7l-1 8 9-12h-7l1-8z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />
              </svg>
              {data.subtitle}
            </span>
            <span className="h-px w-[clamp(20px,3vw,40px)] bg-white/30 max-[480px]:hidden" />
          </div>

          {data.centerImage ? (
            <div className="slide-element mb-[clamp(16px,3vh,32px)] relative z-10 flex justify-center items-center cursor-none">
              <div className="tns-float motion-reduce:animate-none">
                <div className="group">
                  <div className="slide-image-wrapper relative h-[clamp(140px,28vh,300px)] w-[clamp(220px,35vw,420px)] max-w-[90vw] will-change-transform transition-transform duration-[350ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-[6px]">
                    <div
                      className="absolute left-1/2 top-[45%] -translate-x-1/2 -translate-y-1/2 -z-10 rounded-full blur-[22px] h-[clamp(180px,30vh,340px)] w-[clamp(200px,32vw,420px)]"
                      style={{
                        background: `radial-gradient(ellipse at center, ${hexToRgba(data.color, 0.26)} 0%, transparent 70%)`,
                      }}
                    />
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[70%] h-[20px] bg-black/45 blur-2xl rounded-[50%] opacity-90 transition-[transform,opacity,filter] duration-[350ms] ease-[cubic-bezier(0.22,1,0.36,1)] scale-x-100 group-hover:scale-x-90 group-hover:opacity-70 group-hover:blur-[18px]" />

                    <Image
                      src={data.centerImage}
                      alt={data.title}
                      fill
                      className="object-contain will-change-transform transition-[transform,filter] duration-[350ms] ease-[cubic-bezier(0.22,1,0.36,1)] drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] group-hover:scale-[1.03] group-hover:drop-shadow-[0_24px_36px_rgba(0,0,0,0.35)]"
                      priority={index === 0}
                      sizes="(max-width: 768px) 100vw, 520px"
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          <h2
            className="slide-element mb-[clamp(8px,1.5vh,12px)] text-[clamp(30px,7.6vw,84px)] font-black leading-[1.06] tracking-[0.08em] uppercase max-w-[90vw] whitespace-nowrap max-[400px]:whitespace-normal tns-title tns-title-outline"
            style={{ fontFamily: "var(--font-notcher)" }}
          >
            {data.productName}
          </h2>

          <div className="slide-element mb-[clamp(24px,4vh,40px)] hidden md:inline-flex items-center rounded-full border border-white/25 bg-white/5 backdrop-blur-sm px-[clamp(14px,2.5vw,22px)] py-[clamp(6px,1vh,10px)] max-w-[90vw]">
            <span className="text-[clamp(10px,1.1vw,12px)] font-semibold tracking-[0.15em] text-white/90 uppercase text-center drop-shadow-[0_2px_12px_rgba(0,0,0,0.25)]">
              {data.flavorDescription}
            </span>
          </div>

          <Link
            href={`/product/${data.id}`}
            className="slide-element group relative inline-flex items-center justify-center rounded-full bg-white w-[clamp(140px,34vw,220px)] px-[clamp(16px,2.2vw,30px)] py-[clamp(8px,1.15vh,10px)] text-[#5500CC] font-bold tracking-[0.13em] text-[clamp(9px,0.9vw,11px)] uppercase border border-transparent overflow-hidden select-none transition-[background-color,border-color,color,box-shadow] duration-[250ms] ease-[cubic-bezier(0.4,0,0.2,1)] hover:bg-transparent hover:text-white hover:border-white/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent before:content-[''] before:absolute before:inset-0 before:bg-[linear-gradient(110deg,transparent,rgba(255,255,255,0.65),transparent)] before:opacity-0 before:translate-x-[-120%] before:transition-[transform,opacity] before:duration-[600ms] before:ease-[cubic-bezier(0.22,1,0.36,1)] hover:before:opacity-100 hover:before:translate-x-[120%]"
          >
            <span className="relative z-10 inline-flex items-center justify-center gap-1.5 w-full will-change-transform transition-transform duration-[200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.02] group-active:scale-[0.98] group-active:translate-y-px">
              DISCOVER
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                className="h-[clamp(11px,1.45vw,14px)] w-[clamp(11px,1.45vw,14px)]"
                aria-hidden="true"
              >
                <path
                  d="M5 12h12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M13 6l6 6-6 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
