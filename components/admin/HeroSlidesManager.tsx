"use client";

import { useState, useTransition } from "react";
import { addHeroSlide, deleteHeroSlide, moveHeroSlide } from "@/app/admin/actions";
import DeleteButton from "@/components/admin/DeleteButton";
import { uploadPublicImage } from "@/lib/upload";
import type { HeroSlide } from "@/lib/types";

export default function HeroSlidesManager({ slides }: { slides: HeroSlide[] }) {
  const [alt, setAlt] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setError(null);
    setUploading(true);
    const result = await uploadPublicImage("hero", file);
    setUploading(false);
    if ("error" in result) {
      setError(result.error);
      return;
    }
    startTransition(async () => {
      const saved = await addHeroSlide(result.url, alt);
      if (!saved.ok) setError(saved.error ?? "تعذر الحفظ");
      else setAlt("");
    });
  }

  const busy = uploading || pending;

  return (
    <section className="rounded-2xl border border-brand/30 bg-night-card p-5">
      <div className="mb-1 flex items-baseline justify-between gap-3">
        <h2 className="text-lg font-black text-brand">صور البانر</h2>
        <span className="text-xs text-stone-500">{slides.length} صورة</span>
      </div>
      <p className="text-sm leading-7 text-stone-400">
        هذه الصور تظهر في أعلى الصفحة الرئيسية. ارفع، رتّب، أو احذف — النص فوق الصورة
        يُعدَّل من النموذج أسفل.
      </p>

      {slides[0] && (
        <div className="relative mt-4 aspect-[21/9] overflow-hidden rounded-xl border border-white/10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={slides[0].image_url}
            alt={slides[0].alt_text ?? "معاينة البانر"}
            className="h-full w-full object-cover"
          />
          <span className="absolute bottom-2 right-2 rounded-full bg-black/70 px-3 py-1 text-[11px] font-bold text-brand">
            المعاينة — الصورة الأولى
          </span>
        </div>
      )}

      <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto]">
        <input
          value={alt}
          onChange={(e) => setAlt(e.target.value)}
          placeholder="وصف الصورة (اختياري — للوصولية)"
          className="w-full rounded-xl border border-white/10 bg-night px-4 py-3 text-sm text-stone-100 placeholder:text-stone-600 focus:border-brand focus:outline-none"
        />
        <label className="flex cursor-pointer items-center justify-center rounded-xl border border-dashed border-brand/50 bg-brand/5 px-5 py-3 text-sm font-bold text-brand hover:bg-brand/10">
          {busy ? "جارٍ الرفع…" : "+ رفع صورة"}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            hidden
            disabled={busy}
            onChange={(e) => {
              handleFile(e.target.files?.[0]);
              e.target.value = "";
            }}
          />
        </label>
      </div>
      {error && <p className="mt-3 text-sm text-red-400">{error}</p>}

      <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {slides.map((slide, i) => (
          <li
            key={slide.id}
            className="overflow-hidden rounded-xl border border-white/10 bg-night"
          >
            <div className="relative aspect-video">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={slide.image_url}
                alt={slide.alt_text ?? ""}
                className="h-full w-full object-cover"
              />
              <span className="absolute top-2 right-2 rounded-full bg-black/70 px-2 py-0.5 text-[11px] font-bold text-brand">
                {i + 1}
              </span>
            </div>
            <div className="flex items-center justify-between gap-2 p-2">
              <div className="flex gap-1">
                <button
                  type="button"
                  disabled={i === 0 || pending}
                  onClick={() =>
                    startTransition(async () => {
                      await moveHeroSlide(slide.id, "up");
                    })
                  }
                  className="rounded-lg border border-white/15 px-2 py-1 text-xs font-bold text-stone-200 disabled:opacity-30"
                >
                  يمين
                </button>
                <button
                  type="button"
                  disabled={i === slides.length - 1 || pending}
                  onClick={() =>
                    startTransition(async () => {
                      await moveHeroSlide(slide.id, "down");
                    })
                  }
                  className="rounded-lg border border-white/15 px-2 py-1 text-xs font-bold text-stone-200 disabled:opacity-30"
                >
                  يسار
                </button>
              </div>
              <DeleteButton
                confirmText="حذف هذه الصورة من البانر؟"
                onDelete={() => deleteHeroSlide(slide.id)}
              />
            </div>
          </li>
        ))}
        {slides.length === 0 && (
          <li className="col-span-full py-8 text-center text-sm text-stone-500">
            لا توجد صور بعد — ارفع أول صورة للبانر
          </li>
        )}
      </ul>
    </section>
  );
}
