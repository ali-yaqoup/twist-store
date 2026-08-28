import Link from "next/link";
import { whatsappHref } from "@/lib/config";
import type { SiteSettings } from "@/lib/types";

export default function Footer({ settings }: { settings: SiteSettings }) {
  const wa = whatsappHref(settings.whatsapp_number);
  const socials = [
    { href: settings.instagram_url, label: "إنستغرام" },
    { href: settings.facebook_url, label: "فيسبوك" },
    { href: settings.tiktok_url, label: "تيك توك" },
  ].filter((s) => s.href);

  return (
    <footer className="mt-auto border-t border-white/10 bg-night-soft">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-3">
        <div>
          <span className="text-3xl font-black text-brand">{settings.shop_name}</span>
          {settings.footer_blurb && (
            <p className="mt-4 max-w-xs text-sm leading-7 text-stone-400">
              {settings.footer_blurb}
            </p>
          )}
        </div>

        <div>
          <h3 className="mb-4 font-bold text-stone-100">روابط سريعة</h3>
          <ul className="space-y-2.5 text-sm text-stone-400">
            <li><Link href="/" className="transition-colors hover:text-brand">الرئيسية</Link></li>
            <li><Link href="/products" className="transition-colors hover:text-brand">المنتجات</Link></li>
            <li><Link href="/wishlist" className="transition-colors hover:text-brand">قائمة الأمنيات</Link></li>
            <li><Link href="/about" className="transition-colors hover:text-brand">من نحن</Link></li>
            <li><Link href="/contact" className="transition-colors hover:text-brand">تواصل معنا</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 font-bold text-stone-100">تواصل معنا</h3>
          <ul className="space-y-2.5 text-sm text-stone-400">
            {settings.contact_phone && <li dir="ltr" className="text-right">{settings.contact_phone}</li>}
            {settings.email && <li dir="ltr" className="text-right">{settings.email}</li>}
            {settings.address && <li>{settings.address}</li>}
            {wa && (
              <li>
                <a
                  href={wa}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 transition-colors hover:text-brand"
                >
                  واتساب المحل
                </a>
              </li>
            )}
            <li>
              <Link href="/contact" className="transition-colors hover:text-brand">
                أرسل رسالة من الموقع
              </Link>
            </li>
            {socials.map((s) => (
              <li key={s.href}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-brand"
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 py-5 text-center text-xs text-stone-500">
        © {new Date().getFullYear()} {settings.shop_name} — جميع الحقوق محفوظة
      </div>
    </footer>
  );
}
