"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { saveAbout } from "@/app/admin/actions";
import type { AboutValue, SiteSettings } from "@/lib/types";

const inputClass =
  "w-full rounded-xl border border-white/10 bg-night px-4 py-3 text-sm text-stone-100 placeholder:text-stone-600 focus:border-brand focus:outline-none";

export default function AboutForm({ settings }: { settings: SiteSettings }) {
  const router = useRouter();
  const [values, setValues] = useState<AboutValue[]>(
    settings.about_values.length ? settings.about_values : [{ icon: "", title: "", text: "" }]
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState(false);

  function updateValue(i: number, patch: Partial<AboutValue>) {
    setValues((prev) => prev.map((v, idx) => (idx === i ? { ...v, ...patch } : v)));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (saving) return;
    setError(null);
    setOk(false);
    setSaving(true);
    const fd = new FormData(e.currentTarget);
    const result = await saveAbout({
      about_title: String(fd.get("about_title") ?? ""),
      about_paragraphs: String(fd.get("about_paragraphs") ?? "")
        .split(/\n\s*\n/)
        .map((p) => p.trim())
        .filter(Boolean),
      about_values: values,
      about_cta_title: String(fd.get("about_cta_title") ?? ""),
      about_cta_text: String(fd.get("about_cta_text") ?? ""),
    });
    setSaving(false);
    if (!result.ok) {
      setError(result.error ?? "تعذر الحفظ");
      return;
    }
    setOk(true);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <section className="space-y-4 rounded-2xl border border-white/10 bg-night-card p-5">
        <h2 className="font-black text-stone-50">محتوى صفحة من نحن</h2>
        <div>
          <label className="mb-2 block text-sm font-bold text-stone-200">العنوان</label>
          <input
            name="about_title"
            defaultValue={settings.about_title}
            required
            className={inputClass}
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-bold text-stone-200">
            الفقرات (افصل بين الفقرة والأخرى بسطر فارغ)
          </label>
          <textarea
            name="about_paragraphs"
            rows={8}
            defaultValue={settings.about_paragraphs.join("\n\n")}
            className={inputClass}
          />
        </div>
      </section>

      <section className="space-y-4 rounded-2xl border border-white/10 bg-night-card p-5">
        <div className="flex items-center justify-between">
          <h2 className="font-black text-stone-50">قيمنا</h2>
          <button
            type="button"
            onClick={() => setValues((v) => [...v, { icon: "✨", title: "", text: "" }])}
            className="text-sm font-bold text-brand"
          >
            + إضافة بطاقة
          </button>
        </div>
        <div className="space-y-4">
          {values.map((v, i) => (
            <div key={i} className="grid gap-3 rounded-xl border border-white/10 p-4 sm:grid-cols-[80px_1fr_auto]">
              <input
                value={v.icon}
                onChange={(e) => updateValue(i, { icon: e.target.value })}
                placeholder="أيقونة"
                className={inputClass}
              />
              <div className="space-y-2">
                <input
                  value={v.title}
                  onChange={(e) => updateValue(i, { title: e.target.value })}
                  placeholder="العنوان"
                  className={inputClass}
                />
                <textarea
                  value={v.text}
                  onChange={(e) => updateValue(i, { text: e.target.value })}
                  placeholder="النص"
                  rows={2}
                  className={inputClass}
                />
              </div>
              <button
                type="button"
                onClick={() => setValues((prev) => prev.filter((_, idx) => idx !== i))}
                className="h-fit rounded-lg border border-red-500/30 px-3 py-1.5 text-xs font-bold text-red-400"
              >
                حذف
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4 rounded-2xl border border-white/10 bg-night-card p-5">
        <h2 className="font-black text-stone-50">دعوة للتواصل</h2>
        <input
          name="about_cta_title"
          defaultValue={settings.about_cta_title}
          className={inputClass}
        />
        <textarea
          name="about_cta_text"
          rows={2}
          defaultValue={settings.about_cta_text}
          className={inputClass}
        />
      </section>

      {error && (
        <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </p>
      )}
      {ok && (
        <p className="rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-300">
          تم حفظ صفحة من نحن
        </p>
      )}
      <button
        type="submit"
        disabled={saving}
        className="rounded-xl bg-brand px-8 py-3 font-extrabold text-black hover:bg-brand-soft disabled:opacity-60"
      >
        {saving ? "جارٍ الحفظ…" : "حفظ صفحة من نحن"}
      </button>
    </form>
  );
}
