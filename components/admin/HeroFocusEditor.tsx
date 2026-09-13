"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import { updateHeroSlideFocus } from "@/app/admin/actions";
import { clampFocus } from "@/lib/hero-focus";
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
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const dragging = useRef(false);
  const frameRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const x = mode === "mobile" ? focusX : wideFocusX;
  const y = mode === "mobile" ? focusY : wideFocusY;
  const src =
    mode === "desktop"
      ? slide.wide_image_url || slide.image_url
      : slide.image_url;

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

  function pointFromEvent(clientX: number, clientY: number) {
    const frame = frameRef.current;
    if (!frame) return;
    const rect = frame.getBoundingClientRect();
    if (rect.width < 1 || rect.height < 1) return;
    const nx = ((clientX - rect.left) / rect.width) * 100;
    const ny = ((clientY - rect.top) / rect.height) * 100;
    setXY(nx, ny);
  }

  function save() {
    setError(null);
    startTransition(async () => {
      const result = await updateHeroSlideFocus(slide.id, {
        focus_x: focusX,
        focus_y: focusY,
        wide_focus_x: wideFocusX,
        wide_focus_y: wideFocusY,
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
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
      <div
        role="dialog"
        aria-modal
        aria-label="قص صورة البانر"
        className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-brand/30 bg-night-card p-5 shadow-2xl"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-black text-brand">قص وتحريك صورة البانر</h3>
            <p className="mt-1 text-sm text-stone-400">
              اسحب داخل الإطار لتحديد الجزء الظاهر. عدّل للجوال وللشاشة الكبيرة بشكل منفصل.
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

        <div className="mt-4 flex gap-2">
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

        <div
          ref={frameRef}
          className={`relative mt-4 mx-auto w-full cursor-crosshair overflow-hidden rounded-xl border border-white/15 bg-night select-none touch-none ${
            mode === "mobile" ? "aspect-[4/5] max-w-sm" : "aspect-[16/9]"
          }`}
          onPointerDown={(e) => {
            dragging.current = true;
            e.currentTarget.setPointerCapture(e.pointerId);
            pointFromEvent(e.clientX, e.clientY);
          }}
          onPointerMove={(e) => {
            if (!dragging.current) return;
            pointFromEvent(e.clientX, e.clientY);
          }}
          onPointerUp={() => {
            dragging.current = false;
          }}
          onPointerCancel={() => {
            dragging.current = false;
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={slide.alt_text ?? "قص البانر"}
            draggable={false}
            className="pointer-events-none absolute inset-0 h-full w-full object-cover"
            style={{ objectPosition: `${x}% ${y}%` }}
          />
          <div
            className="pointer-events-none absolute h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-brand bg-brand/20 shadow-[0_0_0_9999px_rgba(0,0,0,0.25)]"
            style={{ left: `${x}%`, top: `${y}%` }}
          />
          <span className="pointer-events-none absolute bottom-2 right-2 rounded-full bg-black/70 px-3 py-1 text-[11px] font-bold text-brand">
            اسحب لتحديد الجزء الظاهر
          </span>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
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

        {error && <p className="mt-3 text-sm text-red-400">{error}</p>}

        <div className="mt-5 flex flex-wrap justify-end gap-2">
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
  );
}
