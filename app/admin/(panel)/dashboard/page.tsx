import Link from "next/link";
import { OrderStatusBadge } from "@/components/admin/ui";
import { formatPrice } from "@/lib/config";
import { createClient } from "@/lib/supabase/server";
import type { Order } from "@/lib/types";

export const dynamic = "force-dynamic";

interface TopProduct {
  name: string;
  quantity: number;
}

export default async function DashboardPage() {
  const supabase = await createClient();

  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);

  const [pendingRes, unreadRes, monthOrdersRes, itemsRes, recentRes] = await Promise.all([
    supabase.from("orders").select("id", { count: "exact", head: true }).eq("status", "pending"),
    supabase
      .from("contact_messages")
      .select("id", { count: "exact", head: true })
      .eq("is_read", false),
    supabase.from("orders").select("total_price, status").gte("created_at", monthStart.toISOString()),
    supabase.from("order_items").select("quantity, products(name)"),
    supabase.from("orders").select("*").order("created_at", { ascending: false }).limit(6),
  ]);

  const newOrdersCount = pendingRes.count ?? 0;
  const unreadCount = unreadRes.count ?? 0;

  const monthSales = (monthOrdersRes.data ?? [])
    .filter((o) => o.status !== "cancelled")
    .reduce((sum, o) => sum + Number(o.total_price), 0);

  const salesByProduct = new Map<string, number>();
  for (const item of itemsRes.data ?? []) {
    const name = (item.products as unknown as { name: string } | null)?.name ?? "منتج محذوف";
    salesByProduct.set(name, (salesByProduct.get(name) ?? 0) + item.quantity);
  }
  const topProducts: TopProduct[] = [...salesByProduct.entries()]
    .map(([name, quantity]) => ({ name, quantity }))
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 3);

  const recentOrders = (recentRes.data ?? []) as Order[];

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-extrabold text-stone-50">أهلاً — هذا ملخص اليوم</h1>
        <p className="mt-1.5 text-sm text-stone-400">الطلبات الجديدة والرسائل أولاً، بعدين الباقي.</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Link
          href="/admin/orders"
          className="rounded-2xl border border-white/10 bg-night-card p-5 transition-colors hover:border-brand/40"
        >
          <p className="text-sm text-stone-400">طلبات بانتظارك</p>
          <p className="mt-2 font-display text-4xl font-black text-brand">{newOrdersCount}</p>
          <p className="mt-2 text-xs font-bold text-stone-500">افتح الطلبات ←</p>
        </Link>
        <Link
          href="/admin/messages"
          className="rounded-2xl border border-white/10 bg-night-card p-5 transition-colors hover:border-brand/40"
        >
          <p className="text-sm text-stone-400">رسائل غير مقروءة</p>
          <p className="mt-2 font-display text-4xl font-black text-brand">{unreadCount}</p>
          <p className="mt-2 text-xs font-bold text-stone-500">اقرأ الرسائل ←</p>
        </Link>
        <div className="rounded-2xl border border-white/10 bg-night-card p-5">
          <p className="text-sm text-stone-400">مبيعات هذا الشهر</p>
          <p className="mt-2 font-display text-3xl font-black text-brand sm:text-4xl">
            {formatPrice(monthSales)}
          </p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-night-card p-5">
          <p className="text-sm text-stone-400">الأكثر مبيعاً</p>
          {topProducts.length > 0 ? (
            <ol className="mt-3 space-y-1.5 text-sm">
              {topProducts.map((p, i) => (
                <li key={p.name} className="flex justify-between gap-2">
                  <span className="line-clamp-1 text-stone-200">
                    {i + 1}. {p.name}
                  </span>
                  <span className="shrink-0 font-bold text-brand">{p.quantity}</span>
                </li>
              ))}
            </ol>
          ) : (
            <p className="mt-3 text-sm text-stone-500">لا مبيعات بعد</p>
          )}
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        {[
          { href: "/admin/products/new", label: "إضافة منتج", hint: "قطعة جديدة للمتجر" },
          { href: "/admin/homepage", label: "تعديل الرئيسية", hint: "البانر والنصوص" },
          { href: "/admin/settings", label: "إعدادات المتجر", hint: "واتساب والاسم" },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-2xl border border-white/10 bg-night-card p-4 transition-colors hover:border-brand/40"
          >
            <p className="font-extrabold text-stone-100">{item.label}</p>
            <p className="mt-1 text-xs text-stone-500">{item.hint}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8 overflow-hidden rounded-2xl border border-white/10 bg-night-card">
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <h2 className="font-extrabold text-stone-100">أحدث الطلبات</h2>
          <Link href="/admin/orders" className="text-sm font-bold text-brand hover:underline">
            كل الطلبات
          </Link>
        </div>
        {recentOrders.length > 0 ? (
          <ul className="divide-y divide-white/5">
            {recentOrders.map((order) => (
              <li key={order.id}>
                <Link
                  href={`/admin/orders/${order.id}`}
                  className="flex items-center justify-between gap-3 px-5 py-4 transition-colors hover:bg-white/5"
                >
                  <div className="min-w-0">
                    <p className="font-bold text-stone-100">{order.customer_name}</p>
                    <p className="mt-0.5 text-xs text-stone-500" dir="ltr">
                      {order.customer_phone}
                    </p>
                  </div>
                  <div className="shrink-0 text-left">
                    <p className="font-extrabold text-brand">{formatPrice(Number(order.total_price))}</p>
                    <div className="mt-1 flex justify-end">
                      <OrderStatusBadge status={order.status} />
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="p-10 text-center text-sm text-stone-500">لا توجد طلبات بعد</p>
        )}
      </div>
    </div>
  );
}
