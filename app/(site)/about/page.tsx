import type { Metadata } from "next";
import Link from "next/link";
import { getSiteSettings } from "@/lib/data";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "من نحن" };

export default async function AboutPage() {
  const settings = await getSiteSettings();

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <div className="text-center">
        <h1 className="text-4xl font-black text-stone-50 sm:text-5xl">
          {settings.about_title}
        </h1>
        <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-brand" />
      </div>

      <div className="mx-auto mt-10 max-w-3xl space-y-6 text-center leading-9 text-stone-300">
        {settings.about_paragraphs.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </div>

      {settings.about_values.length > 0 && (
        <div className="mt-16 grid gap-6 sm:grid-cols-2">
          {settings.about_values.map((v) => (
            <div
              key={v.title}
              className="rounded-2xl border border-white/10 bg-night-card p-6 transition-colors hover:border-brand/50"
            >
              <span className="text-3xl">{v.icon}</span>
              <h2 className="mt-3 text-lg font-black text-brand">{v.title}</h2>
              <p className="mt-2 text-sm leading-7 text-stone-400">{v.text}</p>
            </div>
          ))}
        </div>
      )}

      <div className="mt-16 rounded-3xl border border-brand/30 bg-[radial-gradient(ellipse_at_center,rgba(245,196,0,0.08),transparent_70%)] p-10 text-center">
        <h2 className="text-2xl font-black text-stone-50">{settings.about_cta_title}</h2>
        <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-stone-400">
          {settings.about_cta_text}
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            href="/products"
            className="rounded-full bg-brand px-8 py-3 font-extrabold text-black transition-colors hover:bg-brand-soft"
          >
            {settings.hero_cta_label || "تسوّق الآن"}
          </Link>
          <Link
            href="/contact"
            className="rounded-full border border-white/20 px-8 py-3 font-bold text-stone-200 transition-colors hover:border-brand hover:text-brand"
          >
            {settings.contact_title || "تواصل معنا"}
          </Link>
        </div>
      </div>
    </div>
  );
}
