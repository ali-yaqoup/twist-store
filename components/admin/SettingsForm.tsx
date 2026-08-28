"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { saveSiteSettings } from "@/app/admin/actions";
import { uploadPublicImage } from "@/lib/upload";
import type { SiteSettings } from "@/lib/types";

const inputClass =
  "w-full rounded-xl border border-white/10 bg-night px-4 py-3 text-sm text-stone-100 placeholder:text-stone-600 focus:border-brand focus:outline-none";

export default function SettingsForm({ settings }: { settings: SiteSettings }) {
  const router = useRouter();
  const [logoUrl, setLogoUrl] = useState(settings.logo_url);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState(false);

  async function handleLogo(file: File | undefined) {
    if (!file) return;
    setError(null);
    setUploading(true);
    const result = await uploadPublicImage("hero", file);
    setUploading(false);
    if ("error" in result) {
      setError(result.error);
      return;
    }
    setLogoUrl(result.url);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (saving) return;
    setError(null);
    setOk(false);
    setSaving(true);
    const fd = new FormData(e.currentTarget);
    const result = await saveSiteSettings({
      shop_name: String(fd.get("shop_name") ?? ""),
      tagline: String(fd.get("tagline") ?? ""),
      logo_url: logoUrl,
      whatsapp_number: String(fd.get("whatsapp_number") ?? ""),
      contact_phone: String(fd.get("contact_phone") ?? ""),
      address: String(fd.get("address") ?? ""),
      email: String(fd.get("email") ?? ""),
      instagram_url: String(fd.get("instagram_url") ?? ""),
      facebook_url: String(fd.get("facebook_url") ?? ""),
      tiktok_url: String(fd.get("tiktok_url") ?? ""),
      footer_blurb: String(fd.get("footer_blurb") ?? ""),
      contact_title: String(fd.get("contact_title") ?? ""),
      contact_intro: String(fd.get("contact_intro") ?? ""),
      contact_whatsapp_label: String(fd.get("contact_whatsapp_label") ?? ""),
      contact_success_title: String(fd.get("contact_success_title") ?? ""),
      contact_success_text: String(fd.get("contact_success_text") ?? ""),
      products_title: String(fd.get("products_title") ?? ""),
      products_empty: String(fd.get("products_empty") ?? ""),
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
        <h2 className="font-black text-stone-50">هوية المتجر</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="اسم المتجر" name="shop_name" defaultValue={settings.shop_name} required />
          <Field label="الشعار النصي (تحت الاسم)" name="tagline" defaultValue={settings.tagline} />
        </div>
        <div>
          <p className="mb-2 text-sm font-bold text-stone-200">اللوغو</p>
          <div className="flex items-center gap-4">
            {logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={logoUrl} alt="" className="h-16 w-16 rounded-xl object-cover" />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-xl border border-dashed border-white/20 text-xs text-stone-500">
                لا لوغو
              </div>
            )}
            <label className="cursor-pointer rounded-xl border border-white/15 px-4 py-2 text-sm font-bold text-stone-200 hover:border-brand hover:text-brand">
              {uploading ? "جارٍ الرفع…" : "رفع لوغو"}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                hidden
                disabled={uploading}
                onChange={(e) => {
                  handleLogo(e.target.files?.[0]);
                  e.target.value = "";
                }}
              />
            </label>
            {logoUrl && (
              <button
                type="button"
                onClick={() => setLogoUrl("")}
                className="text-sm font-bold text-red-400"
              >
                إزالة
              </button>
            )}
          </div>
        </div>
        <div>
          <label className="mb-2 block text-sm font-bold text-stone-200">نبذة الفوتر</label>
          <textarea
            name="footer_blurb"
            rows={3}
            defaultValue={settings.footer_blurb}
            className={inputClass}
          />
        </div>
      </section>

      <section className="space-y-4 rounded-2xl border border-white/10 bg-night-card p-5">
        <h2 className="font-black text-stone-50">بيانات التواصل</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="واتساب (دولي بدون +)"
            name="whatsapp_number"
            defaultValue={settings.whatsapp_number}
            dir="ltr"
            placeholder="9627XXXXXXXX"
          />
          <Field label="الهاتف" name="contact_phone" defaultValue={settings.contact_phone} dir="ltr" />
          <Field label="البريد" name="email" defaultValue={settings.email} dir="ltr" />
          <Field label="العنوان" name="address" defaultValue={settings.address} />
          <Field label="إنستغرام" name="instagram_url" defaultValue={settings.instagram_url} dir="ltr" />
          <Field label="فيسبوك" name="facebook_url" defaultValue={settings.facebook_url} dir="ltr" />
          <Field label="تيك توك" name="tiktok_url" defaultValue={settings.tiktok_url} dir="ltr" />
        </div>
      </section>

      <section className="space-y-4 rounded-2xl border border-white/10 bg-night-card p-5">
        <h2 className="font-black text-stone-50">صفحة التواصل</h2>
        <Field label="العنوان" name="contact_title" defaultValue={settings.contact_title} />
        <div>
          <label className="mb-2 block text-sm font-bold text-stone-200">المقدمة</label>
          <textarea
            name="contact_intro"
            rows={3}
            defaultValue={settings.contact_intro}
            className={inputClass}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="نص زر واتساب"
            name="contact_whatsapp_label"
            defaultValue={settings.contact_whatsapp_label}
          />
          <Field
            label="عنوان رسالة النجاح"
            name="contact_success_title"
            defaultValue={settings.contact_success_title}
          />
          <div className="sm:col-span-2">
            <Field
              label="نص رسالة النجاح"
              name="contact_success_text"
              defaultValue={settings.contact_success_text}
            />
          </div>
        </div>
      </section>

      <section className="space-y-4 rounded-2xl border border-white/10 bg-night-card p-5">
        <h2 className="font-black text-stone-50">صفحة المنتجات</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="العنوان" name="products_title" defaultValue={settings.products_title} />
          <Field
            label="رسالة لا توجد منتجات"
            name="products_empty"
            defaultValue={settings.products_empty}
          />
        </div>
      </section>

      {error && (
        <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </p>
      )}
      {ok && (
        <p className="rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-300">
          تم حفظ إعدادات الموقع
        </p>
      )}
      <button
        type="submit"
        disabled={saving || uploading}
        className="rounded-xl bg-brand px-8 py-3 font-extrabold text-black hover:bg-brand-soft disabled:opacity-60"
      >
        {saving ? "جارٍ الحفظ…" : "حفظ الإعدادات"}
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  defaultValue,
  dir,
  required,
  placeholder,
}: {
  label: string;
  name: string;
  defaultValue: string;
  dir?: "ltr" | "rtl";
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-stone-200">{label}</label>
      <input
        name={name}
        defaultValue={defaultValue}
        dir={dir}
        required={required}
        placeholder={placeholder}
        className={inputClass}
      />
    </div>
  );
}
