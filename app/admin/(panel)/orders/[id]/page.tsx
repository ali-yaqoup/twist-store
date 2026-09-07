import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import OrderStatusSelect from "@/components/admin/OrderStatusSelect";
import { OrderStatusBadge } from "@/components/admin/ui";
import { formatDate, formatPrice, whatsappHref } from "@/lib/config";
import { sanitizeHttpUrl } from "@/lib/security";
import { createClient } from "@/lib/supabase/server";
import { SERVICE_TYPE_LABELS, type Order, type OrderItem } from "@/lib/types";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "تفاصيل الطلب" };

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: order }, { data: items }] = await Promise.all([
    supabase.from("orders").select("*").eq("id", id).maybeSingle(),
    supabase
      .from("order_items")
      .select("*, products(id, name, images)")
      .eq("order_id", id)
      .order("created_at"),
  ]);

  if (!order) notFound();
  const o = order as Order;
  const orderItems = (items ?? []) as OrderItem[];
  const wa = whatsappHref(o.customer_phone);
  const tel = o.customer_phone.replace(/[^\d+]/g, "");

  return (
    <div>
      <Link href="/admin/orders" className="text-sm font-bold text-stone-400 hover:text-brand">
        ← كل الطلبات
      </Link>
      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="font-display text-2xl font-extrabold text-stone-50">{o.customer_name}</h1>
            <OrderStatusBadge status={o.status} />
          </div>
          <p className="mt-1 text-xs text-stone-500">
            {formatDate(o.created_at)} · #{o.id.slice(0, 8)}
          </p>
        </div>
        <OrderStatusSelect orderId={o.id} current={o.status} />
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-night-card p-5 text-sm">
          <h2 className="mb-3 font-extrabold text-stone-100">بيانات الزبون</h2>
          <p className="text-stone-300">{o.customer_name}</p>
          <p className="mt-1 text-stone-300" dir="ltr">
            {o.customer_phone}
          </p>
          <p className="mt-1 leading-7 text-stone-300">{o.customer_address}</p>
          {o.notes && <p className="mt-3 text-stone-400">ملاحظات: {o.notes}</p>}
          <div className="mt-4 flex flex-wrap gap-2">
            {tel && (
              <a
                href={`tel:${tel}`}
                className="rounded-xl border border-white/15 px-3 py-2 text-xs font-bold text-stone-200 hover:border-brand hover:text-brand"
              >
                اتصال
              </a>
            )}
            {wa && (
              <a
                href={wa}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl bg-brand px-3 py-2 text-xs font-extrabold text-black"
              >
                واتساب
              </a>
            )}
          </div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-night-card p-5">
          <h2 className="mb-3 font-extrabold text-stone-100">المجموع</h2>
          <p className="font-display text-3xl font-black text-brand">
            {formatPrice(Number(o.total_price))}
          </p>
          <p className="mt-2 text-xs text-stone-500">{orderItems.length} بند في الطلب</p>
        </div>
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-white/10 bg-night-card">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="border-b border-white/10 text-right text-xs text-stone-500">
              <th className="p-4 font-medium">المنتج</th>
              <th className="p-4 font-medium">الخيارات</th>
              <th className="p-4 font-medium">الكمية</th>
              <th className="p-4 font-medium">السعر</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {orderItems.map((item) => (
              <tr key={item.id}>
                <td className="p-4 font-bold text-stone-100">
                  {item.products?.name ?? "منتج محذوف"}
                  {item.note && (
                    <p className="mt-1 font-normal text-xs text-stone-500">{item.note}</p>
                  )}
                  {sanitizeHttpUrl(item.design_url ?? "") && (
                    <a
                      href={sanitizeHttpUrl(item.design_url ?? "")}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 block text-xs font-bold text-brand hover:underline"
                    >
                      عرض التصميم المرفق
                    </a>
                  )}
                </td>
                <td className="p-4 text-stone-400">
                  {[
                    item.selected_size && `مقاس ${item.selected_size}`,
                    item.selected_color && `لون ${item.selected_color}`,
                    item.service_type &&
                      SERVICE_TYPE_LABELS[item.service_type === "embroidery" ? "embroidery" : "print"],
                  ]
                    .filter(Boolean)
                    .join(" · ") || "—"}
                </td>
                <td className="p-4 text-stone-200">{item.quantity}</td>
                <td className="p-4 font-bold text-brand">
                  {formatPrice(Number(item.price_at_order) * item.quantity)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
