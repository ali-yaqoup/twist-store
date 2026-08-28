"use client";

import { useState, useTransition } from "react";
import { deleteTestimonial, saveTestimonial } from "@/app/admin/actions";
import DeleteButton from "@/components/admin/DeleteButton";
import type { Testimonial } from "@/lib/types";

const inputClass =
  "w-full rounded-xl border border-white/10 bg-night px-4 py-3 text-sm text-stone-100 placeholder:text-stone-600 focus:border-brand focus:outline-none";

export default function TestimonialsManager({
  testimonials,
}: {
  testimonials: Testimonial[];
}) {
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [name, setName] = useState("");
  const [quote, setQuote] = useState("");
  const [rating, setRating] = useState(5);
  const [isActive, setIsActive] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function startEdit(t: Testimonial) {
    setEditing(t);
    setName(t.name);
    setQuote(t.quote);
    setRating(t.rating);
    setIsActive(t.is_active);
    setError(null);
  }

  function reset() {
    setEditing(null);
    setName("");
    setQuote("");
    setRating(5);
    setIsActive(true);
    setError(null);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const fd = new FormData();
    if (editing) fd.set("id", editing.id);
    fd.set("name", name);
    fd.set("quote", quote);
    fd.set("rating", String(rating));
    fd.set("is_active", isActive ? "true" : "false");
    startTransition(async () => {
      const result = await saveTestimonial(fd);
      if (!result.ok) setError(result.error ?? "تعذر الحفظ");
      else reset();
    });
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
      <form onSubmit={handleSubmit} className="h-fit space-y-4 rounded-2xl border border-white/10 bg-night-card p-5">
        <h2 className="font-black text-stone-100">{editing ? "تعديل رأي" : "رأي جديد"}</h2>
        <div>
          <label className="mb-2 block text-sm font-bold text-stone-200">الاسم</label>
          <input required value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className="mb-2 block text-sm font-bold text-stone-200">النص</label>
          <textarea
            required
            rows={4}
            value={quote}
            onChange={(e) => setQuote(e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-bold text-stone-200">التقييم</label>
          <select
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            className={inputClass}
          >
            {[5, 4, 3, 2, 1].map((n) => (
              <option key={n} value={n}>
                {"★".repeat(n)}
              </option>
            ))}
          </select>
        </div>
        <label className="flex items-center gap-2 text-sm font-bold text-stone-200">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            className="accent-brand"
          />
          ظاهر على الرئيسية
        </label>
        {error && <p className="text-sm text-red-400">{error}</p>}
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={pending}
            className="rounded-xl bg-brand px-5 py-2.5 text-sm font-extrabold text-black disabled:opacity-60"
          >
            {pending ? "جارٍ الحفظ…" : editing ? "حفظ" : "إضافة"}
          </button>
          {editing && (
            <button
              type="button"
              onClick={reset}
              className="rounded-xl border border-white/15 px-4 py-2.5 text-sm text-stone-300"
            >
              إلغاء
            </button>
          )}
        </div>
      </form>

      <div className="space-y-3">
        {testimonials.map((t) => (
          <article
            key={t.id}
            className="rounded-2xl border border-white/10 bg-night-card p-5"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-black text-stone-100">{t.name}</p>
                <p className="text-xs text-brand">{"★".repeat(t.rating)}</p>
              </div>
              <span
                className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${
                  t.is_active ? "bg-green-500/15 text-green-400" : "bg-stone-500/15 text-stone-400"
                }`}
              >
                {t.is_active ? "ظاهر" : "مخفي"}
              </span>
            </div>
            <p className="mt-3 text-sm leading-7 text-stone-300">“{t.quote}”</p>
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={() => startEdit(t)}
                className="rounded-lg border border-white/15 px-3 py-1.5 text-xs font-bold text-stone-200 hover:border-brand hover:text-brand"
              >
                تعديل
              </button>
              <DeleteButton
                confirmText={`حذف رأي «${t.name}»؟`}
                onDelete={() => deleteTestimonial(t.id)}
              />
            </div>
          </article>
        ))}
        {testimonials.length === 0 && (
          <p className="rounded-2xl border border-dashed border-white/15 py-12 text-center text-stone-500">
            لا توجد آراء بعد
          </p>
        )}
      </div>
    </div>
  );
}
