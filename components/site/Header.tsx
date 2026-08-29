"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";
import { useCart } from "@/components/cart/CartProvider";
import { useWishlist } from "@/components/wishlist/WishlistProvider";
import { useSiteSettings } from "@/components/site/SiteContentProvider";
import TwistLogo from "@/components/site/TwistLogo";
import { useIosTap } from "@/lib/ios-tap";

const NAV_LINKS = [
  { href: "/", label: "الرئيسية" },
  { href: "/products", label: "المنتجات" },
  { href: "/wishlist", label: "قائمة الأمنيات" },
  { href: "/about", label: "من نحن" },
  { href: "/contact", label: "تواصل معنا" },
] as const;

const LG_QUERY = "(min-width: 1024px)";

export default function Header() {
  const { count } = useCart();
  const { count: wishCount } = useWishlist();
  const settings = useSiteSettings();
  const pathname = usePathname();
  const menuId = useId();
  const [menuOpen, setMenuOpen] = useState(false);
  const [portalReady, setPortalReady] = useState(false);

  useEffect(() => {
    setPortalReady(true);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    const mq = window.matchMedia(LG_QUERY);
    const onBreakpoint = () => {
      if (mq.matches) setMenuOpen(false);
    };

    const html = document.documentElement;
    const body = document.body;
    const prevHtmlOverflow = html.style.overflow;
    const prevBodyOverflow = body.style.overflow;
    html.style.overflow = "hidden";
    body.style.overflow = "hidden";

    document.addEventListener("keydown", onKey);
    mq.addEventListener("change", onBreakpoint);

    return () => {
      document.removeEventListener("keydown", onKey);
      mq.removeEventListener("change", onBreakpoint);
      html.style.overflow = prevHtmlOverflow;
      body.style.overflow = prevBodyOverflow;
    };
  }, [menuOpen]);

  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const toggleMenu = useCallback(() => setMenuOpen((open) => !open), []);
  const menuTap = useIosTap(toggleMenu);
  const closeTap = useIosTap(closeMenu);

  const drawer =
    portalReady && menuOpen
      ? createPortal(
          <>
            <button
              type="button"
              tabIndex={-1}
              aria-label="إغلاق القائمة"
              className="fixed inset-0 z-[9998] cursor-pointer touch-manipulation bg-black/65"
              {...closeTap}
            />
            <nav
              id={menuId}
              aria-label="القائمة"
              className="fixed inset-x-0 top-16 z-[9999] max-h-[calc(100dvh-4rem)] overflow-y-auto overscroll-contain border-b border-brand/20 bg-night px-4 py-3 shadow-[0_16px_40px_rgba(0,0,0,0.55)] sm:top-[4.75rem] sm:max-h-[calc(100dvh-4.75rem)]"
              style={{ WebkitOverflowScrolling: "touch" }}
            >
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeMenu}
                  className={`flex min-h-11 items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-colors active:bg-white/10 hover:bg-white/5 hover:text-brand ${
                    pathname === link.href ? "text-brand" : "text-stone-300"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </>,
          document.body
        )
      : null;

  return (
    <>
      <header
        className="sticky top-0 z-[100] isolate border-b border-brand/15 bg-night/95 lg:bg-night/75 lg:backdrop-blur-xl"
        style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-2 px-4 sm:h-[4.75rem] sm:px-6">
          <Link href="/" className="relative z-[1] flex min-w-0 items-center gap-2 sm:gap-3" onClick={closeMenu}>
            {settings.logo_url ? (
              <span dir="ltr" className="inline-flex min-w-0 items-center gap-2 text-brand">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={settings.logo_url}
                  alt=""
                  className="h-8 w-8 shrink-0 object-contain sm:h-10 sm:w-10"
                />
                <span className="font-display min-w-0 truncate text-base font-extrabold leading-none tracking-[0.18em] sm:text-[1.55rem] sm:tracking-[0.28em]">
                  {settings.shop_name}
                </span>
              </span>
            ) : (
              <TwistLogo name={settings.shop_name} size="md" />
            )}
            {settings.tagline && (
              <span className="hidden max-w-[10rem] truncate border-s border-brand/20 ps-3 text-[10px] font-medium tracking-[0.18em] text-stone-500 xl:block">
                {settings.tagline}
              </span>
            )}
          </Link>

          <nav className="hidden items-center gap-1 lg:flex xl:gap-2">
            {NAV_LINKS.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-3 py-2 text-[13px] font-medium tracking-wide transition-colors hover:text-brand ${
                    active ? "text-brand" : "text-stone-300"
                  }`}
                >
                  {link.label}
                  {active && (
                    <span className="absolute inset-x-3 -bottom-0.5 h-px bg-brand" />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="relative z-[2] flex shrink-0 items-center gap-1.5 sm:gap-2">
            <Link
              href="/wishlist"
              aria-label="قائمة الأمنيات"
              className="icon-action relative touch-manipulation"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill={wishCount > 0 ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              {wishCount > 0 && (
                <span className="pointer-events-none absolute -top-1.5 -left-1.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-brand px-1 text-[10px] font-bold text-black">
                  {wishCount}
                </span>
              )}
            </Link>

            <Link
              href="/cart"
              aria-label="سلة التسوق"
              className="icon-action relative touch-manipulation"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              {count > 0 && (
                <span className="pointer-events-none absolute -top-1.5 -left-1.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-brand px-1 text-[10px] font-bold text-black">
                  {count}
                </span>
              )}
            </Link>

            <div className="flex lg:hidden">
              <button
                type="button"
                aria-label="القائمة"
                aria-expanded={menuOpen}
                aria-controls={menuId}
                className="icon-action touch-manipulation"
                {...menuTap}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden>
                  {menuOpen ? (
                    <path d="M18 6 6 18M6 6l12 12" />
                  ) : (
                    <path d="M3 6h18M3 12h18M3 18h18" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>
      {drawer}
    </>
  );
}
