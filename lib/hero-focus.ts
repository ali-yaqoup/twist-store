import type { HeroSlide } from "@/lib/types";

export function clampFocus(value: number): number {
  if (!Number.isFinite(value)) return 50;
  return Math.min(100, Math.max(0, Math.round(value * 10) / 10));
}

export function heroObjectPosition(
  slide: Pick<HeroSlide, "focus_x" | "focus_y" | "wide_focus_x" | "wide_focus_y">,
  wide = false
): string {
  const x = clampFocus(
    wide ? (slide.wide_focus_x ?? slide.focus_x ?? 50) : (slide.focus_x ?? 50)
  );
  const y = clampFocus(
    wide ? (slide.wide_focus_y ?? slide.focus_y ?? 50) : (slide.focus_y ?? 50)
  );
  return `${x}% ${y}%`;
}
