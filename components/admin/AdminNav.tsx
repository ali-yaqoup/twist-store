"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/admin/dashboard", label: "لوحة القيادة", icon: "📊" },
  { href: "/admin/homepage", label: "الصفحة الرئيسية", icon: "🖼" },
  { href: "/admin/products", label: "المنتجات", icon: "👕" },
  { href: "/admin/categories", label: "الفئات", icon: "🗂" },
  { href: "/admin/orders", label: "الطلبات", icon: "📦" },
  { href: "/admin/gallery", label: "معرض الأعمال", icon: "✨" },
  { href: "/admin/testimonials", label: "آراء الزبائن", icon: "★" },
  { href: "/admin/about", label: "من نحن", icon: "📖" },
  { href: "/admin/messages", label: "الرسائل", icon: "✉️" },
  { href: "/admin/settings", label: "إعدادات الموقع", icon: "⚙️" },
] as const;

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-wrap gap-1 lg:flex-col lg:flex-nowrap lg:gap-1.5">
      {LINKS.map((link) => {
        const active = pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`flex min-h-11 shrink-0 items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-bold transition-colors ${
              active
                ? "bg-brand text-black"
                : "text-stone-300 hover:bg-white/5 hover:text-brand"
            }`}
          >
            <span aria-hidden>{link.icon}</span>
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
