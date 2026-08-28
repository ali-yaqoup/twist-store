"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
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
  const count = slides.length;

  useEffect(() => {
    if (count <= 1 || paused) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % count), 5500);
    return () => clearInterval(timer);
  }, [count, paused]);

  const overlay = (
    <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center px-4 py-24 text-center sm:px-6 sm:py-32">
      {settings.hero_badge && (
        <span className="rounded-full border border-brand/40 bg-black/40 px-4 py-1.5 text-xs font-bold text-brand backdrop-blur-sm">
          {settings.hero_badge}
        </span>
      )}
      <h1 className="mt-6 max-w-3xl text-4xl font-black leading-tight text-stone-50 sm:text-6xl">
        {settings.hero_title}{" "}
        {settings.hero_highlight && (
          <span className="text-brand text-glow">{settings.hero_highlight}</span>
        )}
      </h1>
      {settings.hero_subtitle && (
        <p className="mt-6 max-w-xl text-base leading-8 text-stone-200 sm:text-lg">
          {settings.hero_subtitle}
        </p>
      )}
      <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
        {settings.hero_cta_label && (
          <Link
            href={settings.hero_cta_href || "/products"}
            className="glow-gold rounded-full bg-brand px-8 py-3.5 text-base font-extrabold text-black transition-all hover:bg-brand-soft hover:scale-105"
          >
            {settings.hero_cta_label}
          </Link>
        )}
        {settings.hero_secondary_cta_label && (
          <Link
            href={settings.hero_secondary_cta_href || "/contact"}
            className="rounded-full border border-white/30 bg-black/30 px-8 py-3.5 text-base font-bold text-stone-100 backdrop-blur-sm transition-colors hover:border-brand hover:text-brand"
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
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(245,196,0,0.14),transparent_60%)]" />
        {overlay}
      </section>
    );
  }

  return (
    <section
      className="relative min-h-[70vh] overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {slides.map((slide, i) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-700 ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={slide.image_url}
            alt={slide.alt_text || settings.hero_title || settings.shop_name}
            fill
            priority={i === 0}
            sizes="100vw"
            className="object-cover"
          />
        </div>
      ))}
      <div className="absolute inset-0 bg-gradient-to-t from-night via-night/65 to-black/35" />
      {overlay}
      {count > 1 && (
        <>
          <div className="absolute inset-x-0 bottom-6 z-10 flex justify-center gap-2">
            {slides.map((slide, i) => (
              <button
                key={slide.id}
                type="button"
                aria-label={`صورة البانر ${i + 1}`}
                onClick={() => setIndex(i)}
                className={`h-2.5 rounded-full transition-all ${
                  i === index ? "w-8 bg-brand" : "w-2.5 bg-white/40 hover:bg-white/70"
                }`}
              />
            ))}
          </div>
          <button
            type="button"
            aria-label="الصورة السابقة"
            onClick={() => setIndex((i) => (i - 1 + count) % count)}
            className="absolute top-1/2 right-4 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/40 text-xl text-white backdrop-blur-sm hover:border-brand hover:text-brand sm:flex"
          >
            ‹
          </button>
          <button
            type="button"
            aria-label="الصورة التالية"
            onClick={() => setIndex((i) => (i + 1) % count)}
            className="absolute top-1/2 left-4 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/40 text-xl text-white backdrop-blur-sm hover:border-brand hover:text-brand sm:flex"
          >
            ›
          </button>
        </>
      )}
    </section>
  );
}
