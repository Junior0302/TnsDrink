"use client";

import Cursor from "@/components/Cursor";
import AudioController from "@/components/AudioController";
import { STORY_CONTENT } from "@/data/content";
import gsap from "gsap";
import { Observer } from "gsap/Observer";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React from "react";

gsap.registerPlugin(Observer);

export default function ProductPage() {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const slidesRef = React.useRef<Array<HTMLDivElement | null>>([]);
  const bgRef = React.useRef<HTMLDivElement>(null);
  const indexRef = React.useRef(0);
  const isAnimatingRef = React.useRef(false);
  const router = useRouter();
  const headerRef = React.useRef<HTMLElement>(null);
  const introTlRef = React.useRef<gsap.core.Timeline | null>(null);

  const routeParams = useParams();
  const rawId = (routeParams as Record<string, string | string[] | undefined>)?.id;
  const id = Array.isArray(rawId) ? rawId[0] : rawId;

  const initialIndex = React.useMemo(() => {
    if (!id) return -1;
    return STORY_CONTENT.findIndex((p) => p.id === id);
  }, [id]);

  const [currentIndex, setCurrentIndex] = React.useState(() => (initialIndex >= 0 ? initialIndex : 0));
  const [quantity, setQuantity] = React.useState(1);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);

  const activeProduct = STORY_CONTENT[currentIndex];
  const activeColor = activeProduct?.color ?? "#000000";

  React.useEffect(() => {
    if (initialIndex < 0) return;
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  React.useEffect(() => {
    indexRef.current = currentIndex;
  }, [currentIndex]);

  React.useEffect(() => {
    if (initialIndex < 0) return;
    const slides = slidesRef.current.filter(Boolean) as HTMLDivElement[];
    if (slides.length === 0) return;

    const startIndex = Math.min(Math.max(initialIndex, 0), STORY_CONTENT.length - 1);
    indexRef.current = startIndex;
    isAnimatingRef.current = false;
    setCurrentIndex(startIndex);

    gsap.set(slides, { autoAlpha: 0, zIndex: 1, pointerEvents: "none" });
    const activeSlide = slidesRef.current[startIndex];
    if (activeSlide) {
      gsap.set(activeSlide, { autoAlpha: 1, zIndex: 10, pointerEvents: "auto" });
    }

    const startColor = STORY_CONTENT[startIndex]?.color ?? "#000000";
    if (bgRef.current) gsap.set(bgRef.current, { backgroundColor: startColor });
  }, [initialIndex]);

  React.useEffect(() => {
    if (initialIndex < 0) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches) return;

    const slides = slidesRef.current.filter(Boolean) as HTMLDivElement[];
    if (slides.length === 0) return;
    const activeSlide = slidesRef.current[indexRef.current];
    if (!activeSlide) return;

    isAnimatingRef.current = true;

    const ctx = gsap.context(() => {
      const image = activeSlide.querySelector("[data-product-image]") as HTMLElement | null;
      const elements = Array.from(activeSlide.querySelectorAll("[data-product-element]") || []) as HTMLElement[];
      const footer = containerRef.current?.querySelector("[data-product-footer]") as HTMLElement | null;

      const tl = gsap.timeline({
        delay: 0.08,
        defaults: { ease: "power4.out" },
        onComplete: () => {
          introTlRef.current = null;
          isAnimatingRef.current = false;
        },
      });

      introTlRef.current = tl;

      if (headerRef.current) {
        gsap.set(headerRef.current, { y: 36, opacity: 0, filter: "blur(10px)" });
        tl.to(headerRef.current, { y: 0, opacity: 1, filter: "blur(0px)", duration: 0.9 }, 0);
      }

      if (image) {
        gsap.set(image, { x: 110, opacity: 0, scale: 0.95, filter: "blur(12px)", rotate: 0.01 });
        tl.to(image, { x: 0, opacity: 1, scale: 1, filter: "blur(0px)", duration: 1.05 }, 0.06);
      }

      if (elements.length > 0) {
        gsap.set(elements, { y: 42, opacity: 0, filter: "blur(10px)" });
        tl.to(elements, { y: 0, opacity: 1, filter: "blur(0px)", duration: 0.8, stagger: 0.05 }, 0.14);
      }

      if (footer) {
        gsap.set(footer, { y: 14, opacity: 0, filter: "blur(8px)" });
        tl.to(footer, { y: 0, opacity: 1, filter: "blur(0px)", duration: 0.75 }, 0.22);
      }
    }, containerRef);

    return () => {
      introTlRef.current?.kill();
      introTlRef.current = null;
      isAnimatingRef.current = false;
      ctx.revert();
    };
  }, [initialIndex]);

  const gotoSlide = React.useCallback(
    (nextIndex: number) => {
      const slides = slidesRef.current.filter(Boolean) as HTMLDivElement[];
      if (slides.length === 0) return;
      if (isAnimatingRef.current) return;
      if (nextIndex === indexRef.current) return;
      if (nextIndex < 0 || nextIndex >= STORY_CONTENT.length) return;
      if (isModalOpen) return;

      introTlRef.current?.kill();
      introTlRef.current = null;

      isAnimatingRef.current = true;

      const current = indexRef.current;
      const direction = nextIndex > current ? 1 : -1;

      const currentSlide = slidesRef.current[current];
      const nextSlide = slidesRef.current[nextIndex];
      if (!currentSlide || !nextSlide) {
        isAnimatingRef.current = false;
        return;
      }

      const nextColor = STORY_CONTENT[nextIndex]?.color ?? "#000000";

      setQuantity(1);
      setIsSuccess(false);
      setIsSubmitting(false);
      setIsModalOpen(false);

      indexRef.current = nextIndex;
      setCurrentIndex(nextIndex);

      gsap.killTweensOf([bgRef.current, currentSlide, nextSlide]);
      gsap.set(slides, { zIndex: 1, pointerEvents: "none" });
      gsap.set(currentSlide, { zIndex: 10, pointerEvents: "none", autoAlpha: 1 });
      gsap.set(nextSlide, { zIndex: 20, pointerEvents: "auto", autoAlpha: 1 });

      const currentImage = currentSlide.querySelector("[data-product-image]") as HTMLElement | null;
      const currentElements = Array.from(currentSlide.querySelectorAll("[data-product-element]") || []) as HTMLElement[];
      const nextImage = nextSlide.querySelector("[data-product-image]") as HTMLElement | null;
      const nextElements = Array.from(nextSlide.querySelectorAll("[data-product-element]") || []) as HTMLElement[];

      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        onComplete: () => {
          gsap.set(slides, { zIndex: 1, pointerEvents: "none" });
          gsap.set(nextSlide, { zIndex: 10, pointerEvents: "auto" });
          gsap.set(currentSlide, { autoAlpha: 0 });
          isAnimatingRef.current = false;
        },
      });

      if (bgRef.current) {
        tl.to(bgRef.current, { backgroundColor: nextColor, duration: 0.9 }, 0);
      }

      if (nextImage) {
        gsap.set(nextImage, { x: 70 * direction, opacity: 0, scale: 0.985, rotate: 0.01 });
        tl.to(nextImage, { x: 0, opacity: 1, scale: 1, duration: 0.95 }, 0);
      }
      if (nextElements.length > 0) {
        gsap.set(nextElements, { y: 16, opacity: 0 });
        tl.to(nextElements, { y: 0, opacity: 1, duration: 0.7, stagger: 0.06 }, 0.12);
      }

      if (currentImage) {
        tl.to(currentImage, { x: -50 * direction, opacity: 0, scale: 0.99, duration: 0.75 }, 0);
      }
      if (currentElements.length > 0) {
        tl.to(currentElements, { y: -10, opacity: 0, duration: 0.55, stagger: 0.04 }, 0);
      }
    },
    [isModalOpen]
  );

  React.useEffect(() => {
    if (initialIndex < 0) return;
    if (!containerRef.current) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches) return;

    const observer = Observer.create({
      target: containerRef.current,
      type: "wheel", // Removed touch to allow native vertical scrolling on mobile
      wheelSpeed: 1,
      onUp: () => {
        if (isAnimatingRef.current || isModalOpen) return;
        gotoSlide(indexRef.current - 1);
      },
      onDown: () => {
        if (isAnimatingRef.current || isModalOpen) return;
        gotoSlide(indexRef.current + 1);
      },
      tolerance: 10,
      ignore: "a,button,input,select,textarea,[data-observer-ignore]",
      allowClicks: true,
      preventDefault: true,
    });

    return () => {
      observer.kill();
    };
  }, [gotoSlide, initialIndex, isModalOpen]);

  const handleDotClick = (idx: number) => {
    gotoSlide(idx);
  };

  if (initialIndex < 0) {
    return (
      <div className="min-h-[100svh] bg-black text-white flex items-center justify-center gap-4 px-6 text-center">
        <p className="text-white/85 text-sm font-medium">Product not found</p>
        <Link href="/" className="underline text-white/60 hover:text-white transition-colors text-sm font-semibold">
          Back to home
        </Link>
      </div>
    );
  }

  return (
    <main
      ref={containerRef}
      className="min-h-[100svh] h-[100svh] w-full relative flex flex-col overflow-hidden"
      style={{ ["--scroll-accent" as never]: activeColor } as React.CSSProperties}
    >
      <Cursor color={activeColor} />

      <div ref={bgRef} className="fixed inset-0 z-0" style={{ backgroundColor: activeColor }} />

      <header ref={headerRef} className="fixed top-0 left-0 w-full z-50 pointer-events-none">
        <div className="mx-auto w-full max-w-[1200px] px-5 md:px-10 pt-[calc(env(safe-area-inset-top)+20px)] md:pt-[calc(env(safe-area-inset-top)+28px)] flex items-center justify-between">
          <Link
            href="/?skipIntro=true"
            className="pointer-events-auto text-white/95 hover:text-white transition-colors text-[11px] md:text-[12px] font-bold uppercase tracking-[0.22em]"
          >
            TNS DIGITAL
          </Link>

          <button
            type="button"
            aria-label="Back"
            data-observer-ignore
            onClick={() => {
              router.push("/?skipIntro=true");
            }}
            className="pointer-events-auto inline-flex items-center justify-center h-9 w-9 md:h-10 md:w-10 rounded-full border border-white/25 bg-black/35 hover:bg-black/50 text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-black/30"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 18l-6-6 6-6" />
            </svg>
          </button>
        </div>
      </header>

      <section className="relative z-10 flex-1 overflow-hidden">
        {/* Mobile Navigation Edge Zones */}
        <div className="lg:hidden absolute inset-y-[20%] left-0 right-0 flex justify-between z-[60] pointer-events-none">
          <button
            type="button"
            onClick={() => gotoSlide(indexRef.current - 1)}
            disabled={currentIndex === 0}
            className="pointer-events-auto h-full w-[12vw] max-w-[50px] flex items-center justify-start transition-opacity disabled:opacity-0 focus-visible:outline-none group"
            aria-label="Previous product"
          >
            <div className="animate-pulse opacity-30 group-active:opacity-60 flex items-center justify-center h-40 w-full bg-gradient-to-r from-white/30 to-transparent">
              <svg className="w-8 h-8 text-white drop-shadow-lg -ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
            </div>
          </button>
          <button
            type="button"
            onClick={() => gotoSlide(indexRef.current + 1)}
            disabled={currentIndex === STORY_CONTENT.length - 1}
            className="pointer-events-auto h-full w-[12vw] max-w-[50px] flex items-center justify-end transition-opacity disabled:opacity-0 focus-visible:outline-none group"
            aria-label="Next product"
          >
            <div className="animate-pulse opacity-30 group-active:opacity-60 flex items-center justify-center h-40 w-full bg-gradient-to-l from-white/30 to-transparent">
              <svg className="w-8 h-8 text-white drop-shadow-lg -mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
            </div>
          </button>
        </div>

        {STORY_CONTENT.map((product, idx) => (
          <div
            key={product.id}
            ref={(el) => {
              slidesRef.current[idx] = el;
            }}
            className="absolute inset-0 w-full h-full opacity-0 pointer-events-none overflow-y-auto overflow-x-hidden lg:overflow-hidden"
          >
            <div className="mx-auto w-full max-w-[1200px] min-h-full px-4 sm:px-5 md:px-10 pt-[calc(env(safe-area-inset-top)+80px)] pb-[calc(env(safe-area-inset-bottom)+120px)] lg:pb-0 lg:pt-[calc(env(safe-area-inset-top)+66px)] flex flex-col">
              <div className="flex-1 flex items-center justify-center w-full min-h-full">
                <div className="flex flex-col lg:grid lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 items-center justify-evenly w-full h-auto py-6 lg:py-0">
                  <div className="flex justify-center w-full lg:justify-start items-center">
                    <div data-product-image className="relative w-[clamp(160px,42vw,280px)] h-[clamp(190px,40vh,320px)] lg:w-[clamp(260px,24vw,400px)] lg:h-[clamp(300px,42vh,500px)] max-h-[36svh] lg:max-h-none flex-shrink-0">

                        {product.centerImage && (
                          <Image
                            src={product.centerImage}
                            alt={product.title}
                            fill
                            className="object-contain drop-shadow-[0_18px_45px_rgba(0,0,0,0.45)]"
                            priority={idx === initialIndex}
                          />
                        )}
                      </div>
                  </div>

                  <div className="flex flex-col items-center lg:items-start text-center lg:text-left text-white/90 gap-4 sm:gap-5 lg:gap-5 justify-center w-full">
                    <div className="flex flex-col items-center lg:items-start gap-1.5 sm:gap-2 w-full">
                        <div data-product-element className="text-[10px] sm:text-[11px] md:text-[12px] uppercase tracking-[0.28em] text-white/80">
                          {product.subtitle}
                        </div>

                        <h1
                          data-product-element
                          className="text-[clamp(28px,7.5vw,34px)] sm:text-[clamp(32px,6vw,38px)] lg:text-[clamp(34px,3.8vw,50px)] leading-[1.01] font-black uppercase tracking-[0.08em] tns-title tns-title-outline"
                          style={{ fontFamily: "var(--font-notcher)" }}
                        >
                          {product.productName}
                        </h1>

                        <div data-product-element className="flex items-center justify-center lg:justify-start flex-wrap gap-2 sm:gap-3">
                          <div className="text-[10px] sm:text-[11px] md:text-[12px] font-semibold uppercase tracking-[0.18em] text-white/75">
                            {product.flavorDescription}
                          </div>
                        </div>

                        <p
                          data-product-element
                          className="text-[10.5px] sm:text-[11px] md:text-[12px] font-medium leading-[1.35] max-w-[48ch] tns-body text-center lg:text-left mt-1"
                          style={{
                            display: "-webkit-box",
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          {product.description}
                        </p>
                      </div>

                    <div data-product-element className="flex flex-row items-center justify-center lg:justify-start gap-6 sm:gap-8 border-t border-white/15 pt-3 max-w-[48ch] w-full">
                        <div className="flex flex-col items-center lg:items-start gap-1">
                          <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.2em] text-white/70">Flavor</span>
                          <span className="text-[10.5px] sm:text-[11px] md:text-[12px] font-semibold text-white/85">{product.flavorDescription}</span>
                        </div>
                        {product.stats.slice(0, 1).map((stat) => (
                          <div key={stat.label} className="flex flex-col items-center lg:items-start gap-1">
                            <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.2em] text-white/70">{stat.label}</span>
                            <span className="text-[10.5px] sm:text-[11px] md:text-[12px] font-semibold text-white/85">{stat.value}</span>
                          </div>
                        ))}
                      </div>

                    <div data-product-element className="flex flex-col items-center lg:items-start gap-3 sm:gap-4 max-w-[48ch] w-full mt-1">
                        <div className="flex items-center justify-center lg:justify-start gap-5 w-full">
                          <div className="flex items-center gap-2 sm:gap-3">
                            <div className="flex items-center border border-white/20 rounded-full p-0.5 sm:p-1 bg-black/10 backdrop-blur-sm">
                              <button
                                type="button"
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors text-[15px] sm:text-[16px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-black/30"
                                aria-label="Decrease quantity"
                              >
                                -
                              </button>
                              <span className="w-8 sm:w-10 text-center text-[12px] sm:text-[13px] font-semibold">{quantity}</span>
                              <button
                                type="button"
                                onClick={() => setQuantity(quantity + 1)}
                                className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors text-[15px] sm:text-[16px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-black/30"
                                aria-label="Increase quantity"
                              >
                                +
                              </button>
                            </div>
                            <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.2em] text-white/70">Cans</span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => setIsModalOpen(true)}
                          className="inline-flex items-center justify-center gap-2 flex-wrap rounded-full bg-white text-black px-6 sm:px-8 py-2.5 sm:py-3 font-bold uppercase tracking-[0.18em] text-[9px] sm:text-[10px] hover:bg-white/90 transition-colors w-auto shadow-[0_0_20px_rgba(255,255,255,0.2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-black/30"
                        >
                          <span>Request a quote</span>
                          <span className="inline-flex items-center rounded-full bg-black/10 px-2 sm:px-2.5 py-0.5 text-[8px] sm:text-[9px] font-black tracking-[0.18em]">
                            {quantity} {quantity > 1 ? "CANS" : "CAN"}
                          </span>
                          <svg className="h-3.5 w-3.5 sm:h-4 sm:w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </button>
                      </div>
                    </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </section>

      <div className="w-full shrink-0 pt-1 pb-[calc(8px+env(safe-area-inset-bottom))] pointer-events-none relative z-20" data-observer-ignore data-product-footer>
        <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-5 md:px-10">
          <div className="relative rounded-2xl border border-white/10 bg-black/25 backdrop-blur-xl shadow-[0_22px_60px_rgba(0,0,0,0.35)] overflow-hidden pointer-events-auto">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />
            <div
              data-footer-accent
              className="absolute inset-0 opacity-[0.14] pointer-events-none"
              style={{
                backgroundColor: activeProduct.color,
                WebkitMaskImage: "radial-gradient(800px circle at 18% 55%, black 0%, transparent 60%)",
                maskImage: "radial-gradient(800px circle at 18% 55%, black 0%, transparent 60%)",
              }}
            />

            <div className="px-3 sm:px-4 md:px-6 py-1 sm:py-1.5">
              <div className="grid grid-cols-[minmax(0,1fr)_auto] md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-3">
                <div className="flex items-center justify-start gap-3 min-w-0">
                  <div className="relative h-7 w-7 sm:h-8 sm:w-8 md:h-9 md:w-9 rounded-2xl overflow-hidden border border-white/12 bg-white/5 shrink-0">
                    {activeProduct.centerImage && (
                      <Image src={activeProduct.centerImage} alt={activeProduct.title} fill sizes="44px" className="object-contain" priority />
                    )}
                  </div>
                  <div className="min-w-0 text-white">
                    <div className="flex items-center gap-2 min-w-0">
                      <div
                        className="text-[11px] sm:text-[12px] md:text-[13px] leading-[1.1] font-black uppercase tracking-[0.06em] truncate text-white/85 drop-shadow-[0_10px_26px_rgba(0,0,0,0.55)]"
                        style={{ fontFamily: "var(--font-notcher)" }}
                      >
                        {activeProduct.productName}
                      </div>
                      <div className="hidden md:block text-[10px] font-medium tracking-[0.14em] text-white/55 uppercase whitespace-nowrap">
                        © {new Date().getFullYear()} TNS DIGITAL
                      </div>
                    </div>
                  </div>
                </div>

                <div className="hidden md:flex min-w-0 justify-self-center items-center gap-2 pointer-events-auto px-3 py-1.5 rounded-full border border-white/14 bg-white/8 backdrop-blur-md shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] select-none">
                  {STORY_CONTENT.map((p, dotIdx) => {
                    const isActive = dotIdx === currentIndex;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => handleDotClick(dotIdx)}
                        aria-label={`Aller à ${p.productName}`}
                        className="relative flex items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-black/30"
                      >
                        <div
                          className={[
                            "rounded-full border",
                            isActive ? "bg-white/90 border-white/55 opacity-100 h-2 w-2" : "bg-white/14 border-white/30 opacity-85 h-2 w-2",
                          ].join(" ")}
                        />
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center justify-end justify-self-end gap-3 pointer-events-auto">
                  <div className="md:hidden">
                    <AudioController isMobile={true} />
                  </div>
                  <div className="hidden md:block">
                    <AudioController />
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(true)}
                    className="inline-flex items-center justify-center rounded-full bg-white text-black h-8 sm:h-9 md:h-10 px-3 sm:px-3.5 md:px-5 font-bold uppercase tracking-[0.18em] text-[8px] sm:text-[9px] md:text-[10px] whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-black/30"
                  >
                    Quote
                    <svg className="ml-1.5 sm:ml-2 h-3 w-3 sm:h-3.5 sm:w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" data-observer-ignore>
          <button
            type="button"
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
            aria-label="Close dialog"
            data-observer-ignore
            onClick={() => {
              setIsModalOpen(false);
              setIsSubmitting(false);
            }}
          />
          <div
            className="relative w-full max-w-3xl overflow-hidden rounded-2xl border border-white/15 bg-black/40 backdrop-blur-2xl text-white shadow-[0_22px_60px_rgba(0,0,0,0.5)]"
            data-observer-ignore
          >
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="p-5 sm:p-6 md:p-10 text-white relative overflow-hidden">
                <div className="absolute inset-0 opacity-[0.85]" style={{ backgroundColor: activeProduct.color }} />
                <div className="absolute inset-0 opacity-[0.15] bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.25),transparent_60%)]" />
                <div className="relative">
                  <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/80">Quote request</div>
                  <div className="mt-3 sm:mt-4 text-xl sm:text-2xl md:text-3xl font-black uppercase tracking-[0.08em] tns-title tns-title-outline" style={{ fontFamily: "var(--font-notcher)" }}>
                    {activeProduct.productName}
                  </div>
                  <div className="mt-2 text-white/85 text-[13px] sm:text-sm font-medium leading-relaxed">
                    Quantity: <span className="font-bold text-white">{quantity}</span> {quantity > 1 ? "cans" : "can"}
                  </div>
                </div>
              </div>

              <div className="p-5 sm:p-6 md:p-10">
                {!isSuccess ? (
                  <form
                    className="flex flex-col gap-4"
                    onSubmit={(e) => {
                      e.preventDefault();
                      setIsSubmitting(true);
                      window.setTimeout(() => {
                        setIsSubmitting(false);
                        setIsSuccess(true);
                      }, 700);
                    }}
                  >
                    <div className="grid grid-cols-1 gap-3">
                      <input required type="text" placeholder="Name" className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 sm:py-3 text-[13px] sm:text-sm font-medium text-white placeholder-white/40 outline-none transition-all duration-300 hover:bg-white/10 hover:border-white/30 focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:bg-white/10 focus-visible:border-white/40" />
                      <input required type="email" placeholder="Email" className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 sm:py-3 text-[13px] sm:text-sm font-medium text-white placeholder-white/40 outline-none transition-all duration-300 hover:bg-white/10 hover:border-white/30 focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:bg-white/10 focus-visible:border-white/40" />
                      <textarea placeholder="Message (optional)" className="w-full min-h-[96px] sm:min-h-[110px] rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 sm:py-3 text-[13px] sm:text-sm font-medium text-white placeholder-white/40 outline-none transition-all duration-300 hover:bg-white/10 hover:border-white/30 focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:bg-white/10 focus-visible:border-white/40 resize-y" />
                    </div>

                    <div className="flex items-center justify-between gap-3 pt-2">
                      <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl border border-white/20 text-white/70 hover:text-white hover:bg-white/10 hover:border-white/40 transition-all duration-300 text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40">
                        Cancel
                      </button>
                      <button type="submit" disabled={isSubmitting} className="px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl text-white text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] transition-all duration-300 hover:brightness-110 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100 disabled:hover:brightness-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 shadow-[0_4px_20px_rgba(0,0,0,0.2)] hover:shadow-[0_4px_25px_rgba(255,255,255,0.2)]" style={{ backgroundColor: activeProduct.color }}>
                        {isSubmitting ? "Sending..." : "Send"}
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="flex flex-col items-center justify-center text-center gap-4 py-6">
                    <div className="text-xl font-black uppercase tracking-[0.18em] text-white drop-shadow-md">Sent</div>
                    <div className="text-sm text-white/80 font-medium max-w-[42ch]">Your request has been received. We’ll get back to you shortly.</div>
                    <button
                      type="button"
                      onClick={() => {
                        setIsSuccess(false);
                        setIsModalOpen(false);
                        setQuantity(1);
                      }}
                      className="mt-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl border border-white/20 bg-white/5 hover:bg-white/15 hover:border-white/40 hover:text-white transition-all duration-300 text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] text-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                    >
                      Close
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
