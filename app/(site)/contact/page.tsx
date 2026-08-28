"use client";

import { useState } from "react";
import { useSiteSettings } from "@/components/site/SiteContentProvider";
import { sendContactMessage } from "./actions";

export default function ContactPage() {
  const settings = useSiteSettings();
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending") return;
    setError(null);
    setStatus("sending");

    const result = await sendContactMessage(new FormData(e.currentTarget));

    if (!result.ok) {
      setError(result.error ?? "حدث خطأ غير متوقع");
      setStatus("idle");
      return;
    }
    setStatus("sent");
  }

  const inputClass =
    "w-full rounded-xl border border-white/10 bg-night px-4 py-3 text-sm text-stone-100 placeholder:text-stone-600 focus:border-brand focus:outline-none";

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <div className="text-center">
        <h1 className="text-4xl font-black text-stone-50">{settings.contact_title}</h1>
        <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-brand" />
        <p className="mx-auto mt-5 max-w-md leading-8 text-stone-400">
          {settings.contact_intro}
        </p>
        {(settings.contact_phone || settings.email || settings.address) && (
          <ul className="mx-auto mt-5 max-w-md space-y-1 text-sm text-stone-400">
            {settings.contact_phone && <li dir="ltr">{settings.contact_phone}</li>}
            {settings.email && <li>{settings.email}</li>}
            {settings.address && <li>{settings.address}</li>}
          </ul>
        )}
        {settings.whatsapp_number && (
          <a
            href={`https://wa.me/${settings.whatsapp_number}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 rounded-full border border-green-500/40 bg-green-500/10 px-6 py-2.5 text-sm font-bold text-green-400 transition-colors hover:bg-green-500/20"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
            </svg>
            {settings.contact_whatsapp_label || "واتساب مباشر"}
          </a>
        )}
      </div>

      {status === "sent" ? (
        <div className="mt-12 rounded-2xl border border-green-500/30 bg-green-500/10 p-10 text-center">
          <span className="text-5xl">✅</span>
          <h2 className="mt-4 text-2xl font-black text-stone-50">{settings.contact_success_title}</h2>
          <p className="mt-3 text-stone-400">{settings.contact_success_text}</p>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="mt-12 space-y-5 rounded-2xl border border-white/10 bg-night-card p-6 sm:p-8"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="name" className="mb-2 block text-sm font-bold text-stone-200">
                الاسم <span className="text-brand">*</span>
              </label>
              <input id="name" name="name" required placeholder="اسمك" className={inputClass} />
            </div>
            <div>
              <label htmlFor="phone" className="mb-2 block text-sm font-bold text-stone-200">
                رقم الهاتف <span className="text-brand">*</span>
              </label>
              <input
                id="phone"
                name="phone"
                required
                type="tel"
                dir="ltr"
                placeholder="07XXXXXXXX"
                className={`${inputClass} text-right`}
              />
            </div>
          </div>
          <div>
            <label htmlFor="message" className="mb-2 block text-sm font-bold text-stone-200">
              رسالتك <span className="text-brand">*</span>
            </label>
            <textarea
              id="message"
              name="message"
              required
              rows={5}
              placeholder="اكتب استفسارك أو تفاصيل مشروعك…"
              className={inputClass}
            />
          </div>

          {error && (
            <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={status === "sending"}
            className="glow-gold w-full rounded-full bg-brand py-3.5 font-extrabold text-black transition-colors hover:bg-brand-soft disabled:cursor-not-allowed disabled:opacity-60"
          >
            {status === "sending" ? "جارٍ الإرسال…" : "إرسال الرسالة"}
          </button>
        </form>
      )}
    </div>
  );
}
