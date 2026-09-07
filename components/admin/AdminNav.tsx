"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AdminNavIcon } from "@/components/admin/AdminIcons";
import { ADMIN_NAV_GROUPS, isAdminNavActive, type AdminBadge } from "@/components/admin/nav";

export default function AdminNav({
  pendingOrders,
  unreadMessages,
  onNavigate,
}: {
  pendingOrders: number;
  unreadMessages: number;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const counts: Record<AdminBadge, number> = {
    orders: pendingOrders,
    messages: unreadMessages,
  };

  return (
    <nav className="space-y-5" aria-label="قائمة الإدارة">
      {ADMIN_NAV_GROUPS.map((group) => (
        <div key={group.title}>
          <p className="mb-2 px-3 text-[10px] font-extrabold tracking-[0.18em] text-stone-500">
            {group.title}
          </p>
          <div className="space-y-1">
            {group.items.map((link) => {
              const active = isAdminNavActive(pathname, link.href);
              const count = "badge" in link && link.badge ? counts[link.badge] : 0;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={onNavigate}
                  className={`flex min-h-11 items-center gap-3 rounded-xl px-3 py-2 text-sm font-bold transition-colors ${
                    active
                      ? "bg-brand text-black"
                      : "text-stone-300 hover:bg-white/5 hover:text-brand"
                  }`}
                >
                  <AdminNavIcon href={link.href} className="shrink-0" />
                  <span className="flex-1">{link.label}</span>
                  {count > 0 && (
                    <span
                      className={`min-w-5 rounded-full px-1.5 text-center text-[10px] font-extrabold ${
                        active ? "bg-black/15 text-black" : "bg-brand text-black"
                      }`}
                    >
                      {count > 99 ? "99+" : count}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );
}
