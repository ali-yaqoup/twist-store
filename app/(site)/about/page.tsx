import type { Metadata } from "next";
import Link from "next/link";
import { getSiteSettings } from "@/lib/data";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "من نحن" };

export default async function AboutPage() {
  const settings = await getSiteSettings();

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-16">
      <div className="text-center">
        <h1 className="font-display text-3xl font-extrabold text-balance text-stone-50 sm:text-4xl lg:text-5xl">
          {settings.about_title}
        </h1>
        <div className="mx-auto mt-5 h-px w-16 bg-gradient-to-l from-transparent via-brand to-brand" />
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
              className="card-luxe p-6"
            >
              <span className="text-3xl">{v.icon}</span>
              <h2 className="font-display mt-3 text-lg font-extrabold text-brand">{v.title}</h2>
              <p className="mt-2 text-sm leading-7 text-stone-400">{v.text}</p>
            </div>
          ))}
        </div>
      )}

      <div className="mt-12 rounded-2xl border border-brand/25 bg-[radial-gradient(ellipse_at_center,rgba(245,196,0,0.08),transparent_70%)] p-6 text-center sm:mt-16 sm:p-10">
        <h2 className="font-display text-xl font-extrabold text-stone-50 sm:text-2xl">{settings.about_cta_title}</h2>
        <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-stone-400">
          {settings.about_cta_text}
        </p>
        <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
          <Link
            href="/products"
            className="btn-gold w-full sm:w-auto"
          >
            {settings.hero_cta_label || "تسوّق الآن"}
          </Link>
          <Link
            href="/contact"
            className="btn-outline w-full text-stone-200 sm:w-auto"
          >
            {settings.contact_title || "تواصل معنا"}
          </Link>
        </div>
      </div>
    </div>
  );
}
