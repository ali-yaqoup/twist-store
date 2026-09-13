"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import { updateHeroSlideFocus } from "@/app/admin/actions";
import {
  clampFocus,
  clampZoom,
  EDITOR_START_ZOOM,
  heroMediaStyle,
  MAX_HERO_ZOOM,
  MIN_HERO_ZOOM,
} from "@/lib/hero-focus";
import type { HeroSlide } from "@/lib/types";

type Mode = "mobile" | "desktop";

export default function HeroFocusEditor({
  slide,
  onClose,
}: {
  slide: HeroSlide;
  onClose: () => void;
}) {
  const [mode, setMode] = useState<Mode>("desktop");
  const [focusX, setFocusX] = useState(clampFocus(slide.focus_x ?? 50));
  const [focusY, setFocusY] = useState(clampFocus(slide.focus_y ?? 50));
  const [wideFocusX, setWideFocusX] = useState(clampFocus(slide.wide_focus_x ?? 50));
  const [wideFocusY, setWideFocusY] = useState(clampFocus(slide.wide_focus_y ?? 50));
  const [zoom, setZoom] = useState(
    clampZoom(slide.zoom && slide.zoom > 1 ? slide.zoom : EDITOR_START_ZOOM)
  );
  const [wideZoom, setWideZoom] = useState(
    clampZoom(slide.wide_zoom && slide.wide_zoom > 1 ? slide.wide_zoom : EDITOR_START_ZOOM)
  );
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const drag = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    originX: number;
    originY: number;
  } | null>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const x = mode === "mobile" ? focusX : wideFocusX;
  const y = mode === "mobile" ? focusY : wideFocusY;
  const z = mode === "mobile" ? zoom : wideZoom;
  const src =
    mode === "desktop" ? slide.wide_image_url || slide.image_url : slide.image_url;

  const previewSlide: HeroSlide = {
    ...slide,
    focus_x: focusX,
    focus_y: focusY,
    wide_focus_x: wideFocusX,
    wide_focus_y: wideFocusY,
    zoom,
    wide_zoom: wideZoom,
  };

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  function setXY(nx: number, ny: number) {
    const cx = clampFocus(nx);
    const cy = clampFocus(ny);
    if (mode === "mobile") {
      setFocusX(cx);
      setFocusY(cy);
    } else {
      setWideFocusX(cx);
      setWideFocusY(cy);
    }
  }

  function setZ(nz: number) {
    const cz = clampZoom(nz);
    if (mode === "mobile") setZoom(cz);
    else setWideZoom(cz);
  }

  function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
    drag.current = {
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      originX: x,
      originY: y,
    };
    e.currentTarget.setPointerCapture(e.pointerId);
  }

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    const state = drag.current;
    if (!state || state.pointerId !== e.pointerId) return;
    e.preventDefault();
    const frame = frameRef.current;
    if (!frame) return;
    const rect = frame.getBoundingClientRect();
    if (rect.width < 1 || rect.height < 1) return;

    // Drag the image: finger moves right → show content to the left.
    const dx = ((e.clientX - state.startX) / rect.width) * 100;
    const dy = ((e.clientY - state.startY) / rect.height) * 100;
    const sensitivity = 1 / Math.max(z - 1, 0.15);
    setXY(state.originX - dx * sensitivity, state.originY - dy * sensitivity);
  }

  function endDrag(e: React.PointerEvent<HTMLDivElement>) {
    if (drag.current?.pointerId === e.pointerId) drag.current = null;
  }

  function save() {
    setError(null);
    startTransition(async () => {
      const result = await updateHeroSlideFocus(slide.id, {
        focus_x: focusX,
        focus_y: focusY,
        wide_focus_x: wideFocusX,
        wide_focus_y: wideFocusY,
        zoom,
        wide_zoom: wideZoom,
      });
      if (!result.ok) {
        setError(result.error ?? "تعذر الحفظ");
        return;
      }
      router.refresh();
      onClose();
    });
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center bg-black/80 p-0 sm:items-center sm:p-4">
      <div
        role="dialog"
        aria-modal
        aria-label="قص صورة البانر"
        className="flex max-h-[94vh] w-full max-w-3xl flex-col overflow-hidden rounded-t-2xl border border-brand/30 bg-night-card shadow-2xl sm:rounded-2xl"
      >
        <div className="shrink-0 space-y-3 overflow-y-auto p-4 sm:p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-lg font-black text-brand">قص وتحريك صورة البانر</h3>
              <p className="mt-1 text-sm text-stone-400">
                كبّر الصورة ثم اسحبها بأي اتجاه داخل الإطار. عدّل للجوال وللشاشة الكبيرة بشكل
                منفصل.
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-white/15 px-3 py-1.5 text-xs font-bold text-stone-300 hover:border-brand hover:text-brand"
            >
              إغلاق
            </button>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setMode("desktop")}
              className={`rounded-xl px-4 py-2 text-sm font-bold ${
                mode === "desktop"
                  ? "bg-brand text-black"
                  : "border border-white/15 text-stone-300"
              }`}
            >
              كمبيوتر 16:9
            </button>
            <button
              type="button"
              onClick={() => setMode("mobile")}
              className={`rounded-xl px-4 py-2 text-sm font-bold ${
                mode === "mobile"
                  ? "bg-brand text-black"
                  : "border border-white/15 text-stone-300"
              }`}
            >
              جوال 4:5
            </button>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-hidden px-4 sm:px-5">
          <div
            ref={frameRef}
            className={`relative mx-auto w-full touch-none overflow-hidden rounded-xl border border-white/15 bg-night ${
              mode === "mobile" ? "aspect-[4/5] max-w-sm" : "aspect-[16/9]"
            }`}
            style={{ touchAction: "none", cursor: "grab" }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={slide.alt_text ?? "قص البانر"}
              draggable={false}
              className="pointer-events-none absolute inset-0 h-full w-full select-none"
              style={heroMediaStyle(previewSlide, mode === "desktop")}
            />
            <span className="pointer-events-none absolute bottom-2 right-2 rounded-full bg-black/70 px-3 py-1 text-[11px] font-bold text-brand">
              اسحب للتحريك · كبّر للمزيد من المساحة
            </span>
          </div>
        </div>

        <div className="shrink-0 space-y-3 border-t border-white/10 p-4 sm:p-5">
          <label className="block text-xs text-stone-400">
            تكبير ({z.toFixed(2)}×) — كل ما كبّرت، تقدر تحرّك أكثر
            <input
              type="range"
              min={MIN_HERO_ZOOM}
              max={MAX_HERO_ZOOM}
              step={0.01}
              value={z}
              onChange={(e) => setZ(Number(e.target.value))}
              className="mt-1 w-full accent-[var(--brand,#f5c400)]"
            />
          </label>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="text-xs text-stone-400">
              أفقي ({Math.round(x)}%)
              <input
                type="range"
                min={0}
                max={100}
                value={x}
                onChange={(e) => setXY(Number(e.target.value), y)}
                className="mt-1 w-full accent-[var(--brand,#f5c400)]"
              />
            </label>
            <label className="text-xs text-stone-400">
              عمودي ({Math.round(y)}%)
              <input
                type="range"
                min={0}
                max={100}
                value={y}
                onChange={(e) => setXY(x, Number(e.target.value))}
                className="mt-1 w-full accent-[var(--brand,#f5c400)]"
              />
            </label>
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <div className="flex flex-wrap justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-white/15 px-4 py-2 text-sm font-bold text-stone-300"
            >
              إلغاء
            </button>
            <button
              type="button"
              disabled={pending}
              onClick={save}
              className="btn-gold !min-h-10 !rounded-xl !px-5 !py-2 text-sm disabled:opacity-50"
            >
              {pending ? "جارٍ الحفظ…" : "حفظ القص"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
