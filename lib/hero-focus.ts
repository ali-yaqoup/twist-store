import type { CSSProperties } from "react";
import type { HeroSlide } from "@/lib/types";

/** 1 = no zoom (full cover). Admin raises zoom only when cropping/panning. */
export const DEFAULT_HERO_ZOOM = 1;
export const MIN_HERO_ZOOM = 1;
export const MAX_HERO_ZOOM = 2.5;
/** Comfortable starting zoom inside the crop editor so panning has room. */
export const EDITOR_START_ZOOM = 1.25;

export function clampFocus(value: number): number {
  if (!Number.isFinite(value)) return 50;
  return Math.min(100, Math.max(0, Math.round(value * 10) / 10));
}

export function clampZoom(value: number): number {
  if (!Number.isFinite(value)) return DEFAULT_HERO_ZOOM;
  return Math.min(MAX_HERO_ZOOM, Math.max(MIN_HERO_ZOOM, Math.round(value * 100) / 100));
}

export function heroFocus(slide: HeroSlide, wide = false): { x: number; y: number; zoom: number } {
  if (wide) {
    return {
      x: clampFocus(slide.wide_focus_x ?? slide.focus_x ?? 50),
      y: clampFocus(slide.wide_focus_y ?? slide.focus_y ?? 50),
      zoom: clampZoom(slide.wide_zoom ?? slide.zoom ?? DEFAULT_HERO_ZOOM),
    };
  }
  return {
    x: clampFocus(slide.focus_x ?? 50),
    y: clampFocus(slide.focus_y ?? 50),
    zoom: clampZoom(slide.zoom ?? DEFAULT_HERO_ZOOM),
  };
}

/** Cover + optional zoom/pan. At zoom=1 this is a normal object-cover. */
export function heroMediaStyle(slide: HeroSlide, wide = false): CSSProperties {
  const { x, y, zoom } = heroFocus(slide, wide);
  if (zoom <= 1.001) {
    return {
      objectFit: "cover",
      objectPosition: `${x}% ${y}%`,
    };
  }
  const tx = ((50 - x) / 50) * ((zoom - 1) / zoom) * 50;
  const ty = ((50 - y) / 50) * ((zoom - 1) / zoom) * 50;
  return {
    objectFit: "cover",
    objectPosition: "center",
    transform: `translate(${tx}%, ${ty}%) scale(${zoom})`,
    transformOrigin: "center center",
    willChange: "transform",
  };
}
