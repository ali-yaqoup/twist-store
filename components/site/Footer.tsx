import Link from "next/link";
import { whatsappHref } from "@/lib/config";
import type { SiteSettings } from "@/lib/types";
import TwistLogo from "@/components/site/TwistLogo";

const NAV = [
  { href: "/", label: "الرئيسية" },
  { href: "/products", label: "المنتجات" },
  { href: "/wishlist", label: "قائمة الأمنيات" },
  { href: "/about", label: "من نحن" },
  { href: "/contact", label: "تواصل معنا" },
] as const;

export default function Footer({ settings }: { settings: SiteSettings }) {
  const wa = whatsappHref(settings.whatsapp_number);
  const socials = [
    { href: settings.instagram_url, label: "إنستغرام" },
    { href: settings.facebook_url, label: "فيسبوك" },
    { href: settings.tiktok_url, label: "تيك توك" },
  ].filter((s) => s.href);

  return (
    <footer className="mt-auto border-t border-brand/12 bg-night-soft pb-safe">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-8">
          <div className="min-w-0">
            <TwistLogo name={settings.shop_name} size="sm" />
            {settings.footer_blurb && (
              <p className="mt-2 line-clamp-2 max-w-sm text-[11px] leading-5 text-stone-500 sm:line-clamp-3">
                {settings.footer_blurb}
              </p>
            )}
          </div>

          <nav className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-stone-400 sm:justify-end sm:text-xs">
            {NAV.map((link) => (
              <Link key={link.href} href={link.href} className="py-0.5 transition-colors hover:text-brand">
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-stone-500">
          {settings.contact_phone && <span dir="ltr">{settings.contact_phone}</span>}
          {settings.email && <span dir="ltr" className="break-all">{settings.email}</span>}
          {settings.address && <span>{settings.address}</span>}
          {wa && (
            <a href={wa} target="_blank" rel="noopener noreferrer" className="hover:text-brand">
              واتساب
            </a>
          )}
          {socials.map((s) => (
            <a key={s.href} href={s.href} target="_blank" rel="noopener noreferrer" className="hover:text-brand">
              {s.label}
            </a>
          ))}
        </div>
      </div>

      <div className="border-t border-brand/10 px-4 py-2 text-center text-[10px] text-stone-600">
        © {new Date().getFullYear()} {settings.shop_name}
      </div>
    </footer>
  );
}
