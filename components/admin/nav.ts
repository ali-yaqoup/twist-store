export type AdminBadge = "orders" | "messages";

export type AdminNavItem = {
  href: string;
  label: string;
  badge?: AdminBadge;
};

export type AdminNavGroup = {
  title: string;
  items: readonly AdminNavItem[];
};

export const ADMIN_NAV_GROUPS = [
  {
    title: "اليوم",
    items: [
      { href: "/admin/dashboard", label: "لوحة القيادة" },
      { href: "/admin/orders", label: "الطلبات", badge: "orders" },
      { href: "/admin/messages", label: "الرسائل", badge: "messages" },
    ],
  },
  {
    title: "المتجر",
    items: [
      { href: "/admin/products", label: "المنتجات" },
      { href: "/admin/categories", label: "الفئات" },
      { href: "/admin/gallery", label: "معرض الأعمال" },
    ],
  },
  {
    title: "المحتوى",
    items: [
      { href: "/admin/homepage", label: "الصفحة الرئيسية" },
      { href: "/admin/about", label: "من نحن" },
      { href: "/admin/testimonials", label: "آراء الزبائن" },
      { href: "/admin/settings", label: "إعدادات الموقع" },
    ],
  },
] as const satisfies readonly AdminNavGroup[];

export const ADMIN_MOBILE_TABS = [
  { href: "/admin/dashboard", label: "الرئيسية" },
  { href: "/admin/orders", label: "الطلبات", badge: "orders" },
  { href: "/admin/products", label: "المنتجات" },
  { href: "/admin/messages", label: "الرسائل", badge: "messages" },
] as const;

export function isAdminNavActive(pathname: string, href: string): boolean {
  if (href === "/admin/dashboard") return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function adminPageTitle(pathname: string): string {
  if (pathname.startsWith("/admin/products/new")) return "إضافة منتج";
  if (pathname.includes("/admin/products/") && pathname.endsWith("/edit")) {
    return "تعديل منتج";
  }
  if (pathname.startsWith("/admin/orders/") && pathname !== "/admin/orders") {
    return "تفاصيل الطلب";
  }
  for (const group of ADMIN_NAV_GROUPS) {
    for (const item of group.items) {
      if (isAdminNavActive(pathname, item.href)) return item.label;
    }
  }
  return "الإدارة";
}
