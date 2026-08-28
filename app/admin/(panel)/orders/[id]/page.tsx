import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import OrderStatusSelect from "@/components/admin/OrderStatusSelect";
import { formatDate, formatPrice } from "@/lib/config";
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

  return (
    <div>
      <Link href="/admin/orders" className="text-sm text-stone-400 hover:text-brand">
        ← كل الطلبات
      </Link>
      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-stone-50">طلب {o.customer_name}</h1>
          <p className="mt-1 text-xs text-stone-500">
            {formatDate(o.created_at)} · #{o.id.slice(0, 8)}
          </p>
        </div>
        <OrderStatusSelect orderId={o.id} current={o.status} />
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-night-card p-5 text-sm">
          <h2 className="mb-3 font-black text-stone-100">بيانات الزبون</h2>
          <p className="text-stone-300">الاسم: {o.customer_name}</p>
          <p className="mt-1 text-stone-300" dir="ltr">
            الهاتف: {o.customer_phone}
          </p>
          <p className="mt-1 text-stone-300">العنوان: {o.customer_address}</p>
          {o.notes && <p className="mt-3 text-stone-400">ملاحظات: {o.notes}</p>}
        </div>
        <div className="rounded-2xl border border-white/10 bg-night-card p-5">
          <h2 className="mb-3 font-black text-stone-100">المجموع</h2>
          <p className="text-3xl font-black text-brand">
            {formatPrice(Number(o.total_price))}
          </p>
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
                    <p className="mt-1 font-normal text-xs text-stone-500">📝 {item.note}</p>
                  )}
                  {item.design_url && (
                    <a
                      href={item.design_url}
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
