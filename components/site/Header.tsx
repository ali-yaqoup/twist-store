"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/components/cart/CartProvider";
import { useWishlist } from "@/components/wishlist/WishlistProvider";
import { useSiteSettings } from "@/components/site/SiteContentProvider";

const NAV_LINKS = [
  { href: "/", label: "الرئيسية" },
  { href: "/products", label: "المنتجات" },
  { href: "/wishlist", label: "قائمة الأمنيات" },
  { href: "/about", label: "من نحن" },
  { href: "/contact", label: "تواصل معنا" },
] as const;

export default function Header() {
  const { count } = useCart();
  const { count: wishCount } = useWishlist();
  const settings = useSiteSettings();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-night/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* اللوغو */}
        <Link href="/" className="flex items-center gap-2" onClick={() => setMenuOpen(false)}>
          {settings.logo_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={settings.logo_url}
              alt={settings.shop_name}
              className="h-9 w-9 rounded-lg object-cover"
            />
          ) : null}
          <span className="text-2xl font-black tracking-wide text-brand text-glow">
            {settings.shop_name}
          </span>
          {settings.tagline && (
            <span className="hidden text-xs font-medium text-stone-400 sm:block">
              {settings.tagline}
            </span>
          )}
        </Link>

        {/* القائمة — شاشات كبيرة */}
        <nav className="hidden items-center gap-5 lg:gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors hover:text-brand ${
                pathname === link.href ? "text-brand" : "text-stone-300"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {/* أيقونة قائمة الأمنيات */}
          <Link
            href="/wishlist"
            aria-label="قائمة الأمنيات"
            className="relative rounded-full border border-white/10 p-2.5 text-stone-200 transition-colors hover:border-brand hover:text-brand"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill={wishCount > 0 ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            {wishCount > 0 && (
              <span className="absolute -top-1.5 -left-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand px-1 text-[11px] font-bold text-black">
                {wishCount}
              </span>
            )}
          </Link>

          {/* أيقونة السلة */}
          <Link
            href="/cart"
            aria-label="سلة التسوق"
            className="relative rounded-full border border-white/10 p-2.5 text-stone-200 transition-colors hover:border-brand hover:text-brand"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            {count > 0 && (
              <span className="absolute -top-1.5 -left-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand px-1 text-[11px] font-bold text-black">
                {count}
              </span>
            )}
          </Link>

          {/* زر القائمة — موبايل */}
          <button
            type="button"
            aria-label="القائمة"
            onClick={() => setMenuOpen((v) => !v)}
            className="rounded-full border border-white/10 p-2.5 text-stone-200 transition-colors hover:border-brand hover:text-brand md:hidden"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              {menuOpen ? (
                <path d="M18 6 6 18M6 6l12 12" />
              ) : (
                <path d="M3 6h18M3 12h18M3 18h18" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* قائمة الموبايل */}
      {menuOpen && (
        <nav className="border-t border-white/10 bg-night px-4 py-3 md:hidden">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={`block rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-white/5 hover:text-brand ${
                pathname === link.href ? "text-brand" : "text-stone-300"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
