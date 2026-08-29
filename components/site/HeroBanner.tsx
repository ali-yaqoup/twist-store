"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { HeroSlide, SiteSettings } from "@/lib/types";

export default function HeroBanner({
  slides,
  settings,
}: {
  slides: HeroSlide[];
  settings: SiteSettings;
}) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const count = slides.length;

  useEffect(() => {
    if (count <= 1 || paused) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % count), 5500);
    return () => clearInterval(timer);
  }, [count, paused]);

  function go(delta: number) {
    if (count <= 1) return;
    setIndex((i) => (i + delta + count) % count);
  }

  function onTouchStart(event: React.TouchEvent) {
    const t = event.changedTouches[0];
    touchStart.current = { x: t.clientX, y: t.clientY };
    setPaused(true);
  }

  function onTouchEnd(event: React.TouchEvent) {
    const start = touchStart.current;
    touchStart.current = null;
    setPaused(false);
    if (!start || count <= 1) return;
    const t = event.changedTouches[0];
    const dx = t.clientX - start.x;
    const dy = t.clientY - start.y;
    if (Math.abs(dx) < 40 || Math.abs(dx) < Math.abs(dy)) return;
    go(dx > 0 ? -1 : 1);
  }

  const overlay = (
    <div className="relative z-10 mx-auto flex min-h-[70svh] w-full max-w-3xl flex-col items-center justify-center px-4 py-16 text-center sm:min-h-[78svh] sm:px-6 sm:py-24 lg:min-h-[86svh] lg:py-36">
      {settings.hero_badge && (
        <span className="rounded-full border border-brand/35 bg-black/45 px-3 py-1.5 text-[10px] font-bold tracking-[0.14em] text-brand backdrop-blur-sm sm:px-4 sm:text-[11px] sm:tracking-[0.18em]">
          {settings.hero_badge}
        </span>
      )}
      <h1 className="font-display mt-5 max-w-3xl text-[1.7rem] font-extrabold leading-[1.3] text-stone-50 sm:mt-7 sm:text-5xl sm:leading-[1.15] lg:text-6xl lg:leading-[1.12]">
        {settings.hero_title}{" "}
        {settings.hero_highlight && (
          <span className="text-brand text-glow">{settings.hero_highlight}</span>
        )}
      </h1>
      <div className="mx-auto mt-5 h-px w-16 bg-gradient-to-l from-transparent via-brand to-brand sm:mt-6 sm:w-24" />
      {settings.hero_subtitle && (
        <p className="mt-5 max-w-xl text-sm leading-7 text-stone-300 sm:mt-6 sm:text-lg sm:leading-8">
          {settings.hero_subtitle}
        </p>
      )}
      <div className="mt-8 flex w-full max-w-sm flex-col items-stretch gap-3 sm:mt-10 sm:max-w-none sm:flex-row sm:flex-wrap sm:items-center sm:justify-center sm:gap-4">
        {settings.hero_cta_label && (
          <Link
            href={settings.hero_cta_href || "/products"}
            className="btn-gold glow-gold relative z-10 w-full touch-manipulation text-sm sm:w-auto sm:text-base"
          >
            {settings.hero_cta_label}
          </Link>
        )}
        {settings.hero_secondary_cta_label && (
          <Link
            href={settings.hero_secondary_cta_href || "/contact"}
            className="btn-outline relative z-10 w-full touch-manipulation bg-black/25 text-sm text-stone-100 sm:w-auto sm:text-base"
          >
            {settings.hero_secondary_cta_label}
          </Link>
        )}
      </div>
    </div>
  );

  if (count === 0) {
    return (
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(245,196,0,0.16),transparent_58%)]" />
        <div className="pattern-tatreez pointer-events-none absolute inset-0 opacity-30" />
        {overlay}
      </section>
    );
  }

  return (
    <section
      className="relative overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {count > 1 && (
        <div
          className="absolute inset-0 z-[1] touch-pan-y"
          aria-hidden
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        />
      )}
      {slides.map((slide, i) => (
        <div
          key={slide.id}
          className={`pointer-events-none absolute inset-0 transition-opacity duration-1000 ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={slide.image_url}
            alt={slide.alt_text || settings.hero_title || settings.shop_name}
            fill
            priority={i === 0}
            sizes="100vw"
            className={`object-cover object-center ${i === index ? "hero-kenburns" : ""}`}
          />
        </div>
      ))}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-night via-night/70 to-black/40" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.45)_100%)]" />
      {overlay}
      {count > 1 && (
        <>
          <div className="absolute inset-x-0 bottom-3 z-20 flex justify-center gap-0.5 sm:bottom-7 sm:gap-1">
            {slides.map((slide, i) => (
              <button
                key={slide.id}
                type="button"
                aria-label={`صورة البانر ${i + 1}`}
                onClick={() => setIndex(i)}
                className="flex h-11 w-11 touch-manipulation items-center justify-center"
              >
                <span
                  className={`h-1.5 rounded-full transition-all ${
                    i === index ? "w-8 bg-brand sm:w-10" : "w-3 bg-white/35 hover:bg-white/70"
                  }`}
                />
              </button>
            ))}
          </div>
          <div className="absolute inset-x-0 bottom-[4.25rem] z-20 flex justify-between px-3 sm:hidden">
            <button
              type="button"
              aria-label="الصورة التالية"
              onClick={() => go(1)}
              className="icon-action touch-manipulation"
            >
              ›
            </button>
            <button
              type="button"
              aria-label="الصورة السابقة"
              onClick={() => go(-1)}
              className="icon-action touch-manipulation"
            >
              ‹
            </button>
          </div>
          <div className="absolute top-1/2 right-3 z-20 hidden -translate-y-1/2 sm:block md:right-4">
            <button
              type="button"
              aria-label="الصورة السابقة"
              onClick={() => go(-1)}
              className="icon-action touch-manipulation"
            >
              ‹
            </button>
          </div>
          <div className="absolute top-1/2 left-3 z-20 hidden -translate-y-1/2 sm:block md:left-4">
            <button
              type="button"
              aria-label="الصورة التالية"
              onClick={() => go(1)}
              className="icon-action touch-manipulation"
            >
              ›
            </button>
          </div>
        </>
      )}
    </section>
  );
}
