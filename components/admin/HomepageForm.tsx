"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { saveHomepage } from "@/app/admin/actions";
import type { Product, SiteSettings } from "@/lib/types";

const inputClass =
  "w-full rounded-xl border border-white/10 bg-night px-4 py-3 text-sm text-stone-100 placeholder:text-stone-600 focus:border-brand focus:outline-none";

export default function HomepageForm({
  settings,
  products,
}: {
  settings: SiteSettings;
  products: Product[];
}) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState(false);
  const [featuredIds, setFeaturedIds] = useState<string[]>(
    products.filter((p) => p.is_featured).map((p) => p.id)
  );

  function toggleFeatured(id: string) {
    setFeaturedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (saving) return;
    setError(null);
    setOk(false);
    setSaving(true);
    const fd = new FormData(e.currentTarget);
    const result = await saveHomepage({
      hero_badge: String(fd.get("hero_badge") ?? ""),
      hero_title: String(fd.get("hero_title") ?? ""),
      hero_highlight: String(fd.get("hero_highlight") ?? ""),
      hero_subtitle: String(fd.get("hero_subtitle") ?? ""),
      hero_cta_label: String(fd.get("hero_cta_label") ?? ""),
      hero_cta_href: String(fd.get("hero_cta_href") ?? ""),
      hero_secondary_cta_label: String(fd.get("hero_secondary_cta_label") ?? ""),
      hero_secondary_cta_href: String(fd.get("hero_secondary_cta_href") ?? ""),
      categories_title: String(fd.get("categories_title") ?? ""),
      featured_title: String(fd.get("featured_title") ?? ""),
      featured_subtitle: String(fd.get("featured_subtitle") ?? ""),
      featured_cta: String(fd.get("featured_cta") ?? ""),
      gallery_title: String(fd.get("gallery_title") ?? ""),
      gallery_subtitle: String(fd.get("gallery_subtitle") ?? ""),
      home_about_title: String(fd.get("home_about_title") ?? ""),
      home_about_text: String(fd.get("home_about_text") ?? ""),
      home_about_bullets: String(fd.get("home_about_bullets") ?? "")
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean),
      home_about_cta: String(fd.get("home_about_cta") ?? ""),
      testimonials_title: String(fd.get("testimonials_title") ?? ""),
      featuredProductIds: featuredIds,
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
        <h2 className="font-black text-stone-50">نصوص البانر</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="شارة صغيرة" name="hero_badge" defaultValue={settings.hero_badge} />
          <Field label="العنوان" name="hero_title" defaultValue={settings.hero_title} />
          <Field
            label="الكلمة المميزة (ذهبي)"
            name="hero_highlight"
            defaultValue={settings.hero_highlight}
          />
          <Field label="زر أساسي" name="hero_cta_label" defaultValue={settings.hero_cta_label} />
          <Field
            label="رابط الزر الأساسي"
            name="hero_cta_href"
            defaultValue={settings.hero_cta_href}
            dir="ltr"
          />
          <Field
            label="زر ثانوي"
            name="hero_secondary_cta_label"
            defaultValue={settings.hero_secondary_cta_label}
          />
          <Field
            label="رابط الزر الثانوي"
            name="hero_secondary_cta_href"
            defaultValue={settings.hero_secondary_cta_href}
            dir="ltr"
          />
          <div className="sm:col-span-2">
            <label className="mb-2 block text-sm font-bold text-stone-200">النص أسفل العنوان</label>
            <textarea
              name="hero_subtitle"
              rows={3}
              defaultValue={settings.hero_subtitle}
              className={inputClass}
            />
          </div>
        </div>
      </section>

      <section className="space-y-4 rounded-2xl border border-white/10 bg-night-card p-5">
        <h2 className="font-black text-stone-50">عناوين الأقسام</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="عنوان الفئات"
            name="categories_title"
            defaultValue={settings.categories_title}
          />
          <Field
            label="عنوان الآراء"
            name="testimonials_title"
            defaultValue={settings.testimonials_title}
          />
          <Field
            label="عنوان المنتجات المميزة"
            name="featured_title"
            defaultValue={settings.featured_title}
          />
          <Field
            label="نص زر كل المنتجات"
            name="featured_cta"
            defaultValue={settings.featured_cta}
          />
          <div className="sm:col-span-2">
            <Field
              label="وصف المنتجات المميزة"
              name="featured_subtitle"
              defaultValue={settings.featured_subtitle}
            />
          </div>
          <Field label="عنوان المعرض" name="gallery_title" defaultValue={settings.gallery_title} />
          <Field
            label="وصف المعرض"
            name="gallery_subtitle"
            defaultValue={settings.gallery_subtitle}
          />
        </div>
      </section>

      <section className="space-y-4 rounded-2xl border border-white/10 bg-night-card p-5">
        <h2 className="font-black text-stone-50">نبذة قصيرة (الرئيسية)</h2>
        <Field
          label="العنوان"
          name="home_about_title"
          defaultValue={settings.home_about_title}
        />
        <div>
          <label className="mb-2 block text-sm font-bold text-stone-200">النص</label>
          <textarea
            name="home_about_text"
            rows={4}
            defaultValue={settings.home_about_text}
            className={inputClass}
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-bold text-stone-200">
            النقاط (سطر لكل نقطة)
          </label>
          <textarea
            name="home_about_bullets"
            rows={4}
            defaultValue={settings.home_about_bullets.join("\n")}
            className={inputClass}
          />
        </div>
        <Field label="نص زر اعرف أكثر" name="home_about_cta" defaultValue={settings.home_about_cta} />
      </section>

      <section className="space-y-4 rounded-2xl border border-white/10 bg-night-card p-5">
        <h2 className="font-black text-stone-50">المنتجات المميزة على الرئيسية</h2>
        <p className="text-sm text-stone-400">
          اختر المنتجات التي تظهر في قسم المميز. إن لم تختر شيئاً تُعرض أحدث المنتجات.
        </p>
        <ul className="grid max-h-80 gap-2 overflow-y-auto sm:grid-cols-2">
          {products.map((p) => (
            <li key={p.id}>
              <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 px-3 py-2 text-sm hover:border-brand/40">
                <input
                  type="checkbox"
                  checked={featuredIds.includes(p.id)}
                  onChange={() => toggleFeatured(p.id)}
                  className="accent-brand"
                />
                <span className="font-bold text-stone-100">{p.name}</span>
              </label>
            </li>
          ))}
          {products.length === 0 && (
            <li className="text-sm text-stone-500">لا توجد منتجات بعد</li>
          )}
        </ul>
      </section>

      {error && (
        <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </p>
      )}
      {ok && (
        <p className="rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-300">
          تم حفظ محتوى الصفحة الرئيسية
        </p>
      )}

      <button
        type="submit"
        disabled={saving}
        className="rounded-xl bg-brand px-8 py-3 font-extrabold text-black hover:bg-brand-soft disabled:opacity-60"
      >
        {saving ? "جارٍ الحفظ…" : "حفظ محتوى الرئيسية"}
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  defaultValue,
  dir,
}: {
  label: string;
  name: string;
  defaultValue: string;
  dir?: "ltr" | "rtl";
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-stone-200">{label}</label>
      <input name={name} defaultValue={defaultValue} dir={dir} className={inputClass} />
    </div>
  );
}
