"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState, type ReactNode } from "react";
import AdminNav from "@/components/admin/AdminNav";
import {
  AdminAlertsToggle,
  AdminOrderAlertsProvider,
} from "@/components/admin/AdminOrderAlerts";
import {
  AdminNavIcon,
  IconClose,
  IconMenu,
  IconStore,
} from "@/components/admin/AdminIcons";
import { ADMIN_MOBILE_TABS, adminPageTitle, isAdminNavActive } from "@/components/admin/nav";
import SignOutButton from "@/components/admin/SignOutButton";
import TwistLogo from "@/components/site/TwistLogo";

export default function AdminShell({
  shopName,
  userEmail,
  pendingOrders,
  unreadMessages,
  children,
}: {
  shopName: string;
  userEmail: string;
  pendingOrders: number;
  unreadMessages: number;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [orderBadge, setOrderBadge] = useState(pendingOrders);
  const [messageBadge, setMessageBadge] = useState(unreadMessages);
  const counts = { orders: orderBadge, messages: messageBadge };

  useEffect(() => {
    setOrderBadge(pendingOrders);
  }, [pendingOrders]);

  useEffect(() => {
    setMessageBadge(unreadMessages);
  }, [unreadMessages]);

  const onPendingDelta = useCallback((delta: number) => {
    setOrderBadge((n) => Math.max(0, n + delta));
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [menuOpen]);

  return (
    <AdminOrderAlertsProvider onPendingDelta={onPendingDelta}>
    <div className="min-h-screen bg-night">
      <aside className="fixed inset-y-0 start-0 z-30 hidden w-72 flex-col border-e border-white/8 bg-night-card/95 px-4 py-5 lg:flex">
        <Link href="/admin/dashboard" className="mb-6 px-2">
          <TwistLogo name={shopName} size="sm" />
          <span className="mt-1 block text-[10px] tracking-[0.2em] text-stone-500">لوحة الإدارة</span>
        </Link>
        <div className="min-h-0 flex-1 overflow-y-auto pe-1">
          <AdminNav pendingOrders={orderBadge} unreadMessages={messageBadge} />
        </div>
        <div className="mt-4 space-y-2 border-t border-white/10 pt-4">
          <AdminAlertsToggle />
          {userEmail && (
            <p className="truncate px-2 text-[11px] text-stone-500" dir="ltr" title={userEmail}>
              {userEmail}
            </p>
          )}
          <Link
            href="/"
            className="flex min-h-11 items-center justify-center gap-2 rounded-xl px-3 text-sm text-stone-400 transition-colors hover:bg-white/5 hover:text-brand"
          >
            <IconStore />
            عرض المتجر
          </Link>
          <SignOutButton />
        </div>
      </aside>

      <header className="sticky top-0 z-40 border-b border-white/8 bg-night/90 px-4 py-3 backdrop-blur-xl lg:hidden">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[10px] tracking-[0.18em] text-stone-500">{shopName}</p>
            <p className="truncate text-sm font-extrabold text-stone-50">{adminPageTitle(pathname)}</p>
          </div>
          <button
            type="button"
            className="icon-action"
            aria-label={menuOpen ? "إغلاق القائمة" : "فتح القائمة"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <IconClose /> : <IconMenu />}
          </button>
        </div>
      </header>

      {menuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="إغلاق القائمة"
            className="absolute inset-0 bg-black/65"
            onClick={() => setMenuOpen(false)}
          />
          <div className="absolute inset-y-0 start-0 flex w-[min(20rem,88vw)] flex-col bg-night-card px-4 py-5 shadow-2xl">
            <div className="mb-5 flex items-center justify-between px-1">
              <TwistLogo name={shopName} size="sm" />
              <button
                type="button"
                className="icon-action"
                aria-label="إغلاق القائمة"
                onClick={() => setMenuOpen(false)}
              >
                <IconClose />
              </button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto">
              <AdminNav
                pendingOrders={orderBadge}
                unreadMessages={messageBadge}
                onNavigate={() => setMenuOpen(false)}
              />
            </div>
            <div className="mt-4 space-y-2 border-t border-white/10 pt-4">
              <AdminAlertsToggle />
              <Link
                href="/"
                className="flex min-h-11 items-center justify-center gap-2 rounded-xl text-sm text-stone-400 hover:text-brand"
              >
                <IconStore />
                عرض المتجر
              </Link>
              <SignOutButton />
            </div>
          </div>
        </div>
      )}

      <main className="px-4 pb-28 pt-5 sm:px-6 lg:ms-72 lg:px-8 lg:pb-10 lg:pt-8">
        <div className="mx-auto max-w-6xl">{children}</div>
      </main>

      <nav
        aria-label="تنقل سريع"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-night/95 px-2 pt-1 backdrop-blur-xl lg:hidden"
        style={{ paddingBottom: "max(0.4rem, env(safe-area-inset-bottom))" }}
      >
        <div className="grid grid-cols-4">
          {ADMIN_MOBILE_TABS.map((tab) => {
            const active = isAdminNavActive(pathname, tab.href);
            const count = "badge" in tab && tab.badge ? counts[tab.badge] : 0;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`relative flex min-h-12 flex-col items-center justify-center gap-0.5 text-[10px] font-bold ${
                  active ? "text-brand" : "text-stone-400"
                }`}
              >
                <span className="relative">
                  <AdminNavIcon href={tab.href} />
                  {count > 0 && (
                    <span className="absolute -top-1.5 -start-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand px-1 text-[9px] text-black">
                      {count > 9 ? "9+" : count}
                    </span>
                  )}
                </span>
                {tab.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
    </AdminOrderAlertsProvider>
  );
}
