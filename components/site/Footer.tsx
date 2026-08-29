import Link from "next/link";
import { whatsappHref } from "@/lib/config";
import type { SiteSettings } from "@/lib/types";
import TwistLogo from "@/components/site/TwistLogo";

export default function Footer({ settings }: { settings: SiteSettings }) {
  const wa = whatsappHref(settings.whatsapp_number);
  const socials = [
    { href: settings.instagram_url, label: "إنستغرام" },
    { href: settings.facebook_url, label: "فيسبوك" },
    { href: settings.tiktok_url, label: "تيك توك" },
  ].filter((s) => s.href);

  return (
    <footer className="mt-auto border-t border-brand/12 bg-night-soft pb-safe">
      <div
        className={`mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-10 sm:grid-cols-2 sm:gap-10 sm:px-6 sm:py-14 md:gap-8 lg:gap-12 ${
          socials.length > 0 ? "lg:grid-cols-4" : "lg:grid-cols-3"
        }`}
      >
        <div>
          <TwistLogo name={settings.shop_name} size="md" />
          {settings.footer_blurb && (
            <p className="mt-5 max-w-xs text-sm leading-7 text-stone-400">
              {settings.footer_blurb}
            </p>
          )}
        </div>

        <div>
          <h3 className="font-display mb-4 text-sm font-bold tracking-wide text-stone-100">
            روابط سريعة
          </h3>
          <ul className="space-y-0.5 text-sm text-stone-400">
            <li><Link href="/" className="inline-flex min-h-11 items-center transition-colors hover:text-brand">الرئيسية</Link></li>
            <li><Link href="/products" className="inline-flex min-h-11 items-center transition-colors hover:text-brand">المنتجات</Link></li>
            <li><Link href="/wishlist" className="inline-flex min-h-11 items-center transition-colors hover:text-brand">قائمة الأمنيات</Link></li>
            <li><Link href="/about" className="inline-flex min-h-11 items-center transition-colors hover:text-brand">من نحن</Link></li>
            <li><Link href="/contact" className="inline-flex min-h-11 items-center transition-colors hover:text-brand">تواصل معنا</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-display mb-5 text-sm font-bold tracking-wide text-stone-100">
            تواصل معنا
          </h3>
          <ul className="space-y-2.5 text-sm text-stone-400">
            {settings.contact_phone && <li dir="ltr" className="text-start sm:text-right">{settings.contact_phone}</li>}
            {settings.email && <li dir="ltr" className="break-all text-start sm:text-right">{settings.email}</li>}
            {settings.address && <li>{settings.address}</li>}
            {wa && (
              <li>
                <a
                  href={wa}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center gap-2 transition-colors hover:text-brand"
                >
                  واتساب المحل
                </a>
              </li>
            )}
            <li>
              <Link href="/contact" className="inline-flex min-h-11 items-center transition-colors hover:text-brand">
                أرسل رسالة من الموقع
              </Link>
            </li>
          </ul>
        </div>

        {socials.length > 0 && (
          <div>
            <h3 className="font-display mb-5 text-sm font-bold tracking-wide text-stone-100">
              تابعنا
            </h3>
            <ul className="space-y-2.5 text-sm text-stone-400">
              {socials.map((s) => (
                <li key={s.href}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 items-center transition-colors hover:text-brand"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="border-t border-brand/10 px-4 py-5 text-center text-[11px] tracking-wide text-stone-500">
        © {new Date().getFullYear()} {settings.shop_name} — جميع الحقوق محفوظة
      </div>
    </footer>
  );
}
