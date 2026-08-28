import type { Metadata } from "next";
import Link from "next/link";
import OrderStatusSelect from "@/components/admin/OrderStatusSelect";
import { formatDate, formatPrice } from "@/lib/config";
import { createClient } from "@/lib/supabase/server";
import { ORDER_STATUS_LABELS, type Order } from "@/lib/types";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "الطلبات" };

export default async function AdminOrdersPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  const orders = (data ?? []) as Order[];

  return (
    <div>
      <h1 className="text-2xl font-black text-stone-50">الطلبات</h1>
      <div className="mt-6 overflow-x-auto rounded-2xl border border-white/10 bg-night-card">
        <table className="w-full min-w-[720px] text-sm">
          <thead>
            <tr className="border-b border-white/10 text-right text-xs text-stone-500">
              <th className="p-4 font-medium">الزبون</th>
              <th className="p-4 font-medium">الهاتف</th>
              <th className="p-4 font-medium">التاريخ</th>
              <th className="p-4 font-medium">المجموع</th>
              <th className="p-4 font-medium">الحالة</th>
              <th className="p-4 font-medium">تفاصيل</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-white/[0.03]">
                <td className="p-4 font-bold text-stone-100">{order.customer_name}</td>
                <td className="p-4 text-stone-400" dir="ltr">
                  {order.customer_phone}
                </td>
                <td className="p-4 text-stone-400">{formatDate(order.created_at)}</td>
                <td className="p-4 font-extrabold text-brand">
                  {formatPrice(Number(order.total_price))}
                </td>
                <td className="p-4">
                  <OrderStatusSelect orderId={order.id} current={order.status} />
                </td>
                <td className="p-4">
                  <Link
                    href={`/admin/orders/${order.id}`}
                    className="rounded-lg border border-white/15 px-3 py-1.5 text-xs font-bold text-stone-200 hover:border-brand hover:text-brand"
                  >
                    عرض
                  </Link>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={6} className="p-12 text-center text-stone-500">
                  لا توجد طلبات بعد
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {orders.length > 0 && (
        <p className="mt-3 text-xs text-stone-500">
          الحالات: {Object.values(ORDER_STATUS_LABELS).join(" · ")}
        </p>
      )}
    </div>
  );
}
