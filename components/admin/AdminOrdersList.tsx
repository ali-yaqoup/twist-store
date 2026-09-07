"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import OrderStatusSelect from "@/components/admin/OrderStatusSelect";
import { AdminEmpty, AdminSearchField, FilterPills, OrderStatusBadge } from "@/components/admin/ui";
import { formatDate, formatPrice } from "@/lib/config";
import { ORDER_STATUS_LABELS, type Order, type OrderStatus } from "@/lib/types";

type Filter = "all" | OrderStatus;

export default function AdminOrdersList({ orders }: { orders: Order[] }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return orders.filter((o) => {
      if (filter !== "all" && o.status !== filter) return false;
      if (!q) return true;
      return (
        o.customer_name.toLowerCase().includes(q) ||
        o.customer_phone.replace(/\s/g, "").includes(q.replace(/\s/g, "")) ||
        o.id.toLowerCase().includes(q)
      );
    });
  }, [orders, query, filter]);

  const countBy = (status?: OrderStatus) =>
    status ? orders.filter((o) => o.status === status).length : orders.length;

  return (
    <div>
      <div className="flex flex-col gap-3">
        <AdminSearchField
          value={query}
          onChange={setQuery}
          placeholder="ابحث بالاسم أو رقم الهاتف…"
        />
        <FilterPills
          value={filter}
          onChange={setFilter}
          options={[
            { id: "all", label: "الكل", count: countBy() },
            { id: "pending", label: ORDER_STATUS_LABELS.pending, count: countBy("pending") },
            { id: "in_progress", label: ORDER_STATUS_LABELS.in_progress, count: countBy("in_progress") },
            { id: "ready", label: ORDER_STATUS_LABELS.ready, count: countBy("ready") },
            { id: "delivered", label: ORDER_STATUS_LABELS.delivered, count: countBy("delivered") },
            { id: "cancelled", label: ORDER_STATUS_LABELS.cancelled, count: countBy("cancelled") },
          ]}
        />
      </div>

      {filtered.length === 0 ? (
        <div className="mt-6">
          <AdminEmpty
            title={orders.length === 0 ? "لا توجد طلبات بعد" : "لا نتائج لهذا البحث"}
            hint={orders.length === 0 ? "الطلبات الجديدة بتظهر هنا أول ما الزبون يأكد." : undefined}
          />
        </div>
      ) : (
        <>
          <ul className="mt-5 space-y-3 md:hidden">
            {filtered.map((order) => (
              <li key={order.id} className="rounded-2xl border border-white/10 bg-night-card p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-extrabold text-stone-50">{order.customer_name}</p>
                    <p className="mt-0.5 text-xs text-stone-500" dir="ltr">
                      {order.customer_phone}
                    </p>
                    <p className="mt-1 text-xs text-stone-500">{formatDate(order.created_at)}</p>
                  </div>
                  <OrderStatusBadge status={order.status} />
                </div>
                <div className="mt-3 flex items-center justify-between gap-2">
                  <p className="font-extrabold text-brand">{formatPrice(Number(order.total_price))}</p>
                  <Link
                    href={`/admin/orders/${order.id}`}
                    className="rounded-xl bg-brand px-4 py-2 text-xs font-extrabold text-black"
                  >
                    فتح الطلب
                  </Link>
                </div>
                <div className="mt-3">
                  <OrderStatusSelect orderId={order.id} current={order.status} />
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-5 hidden overflow-x-auto rounded-2xl border border-white/10 bg-night-card md:block">
            <table className="w-full min-w-[760px] text-sm">
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
                {filtered.map((order) => (
                  <tr key={order.id} className="hover:bg-white/[0.03]">
                    <td className="p-4">
                      <p className="font-bold text-stone-100">{order.customer_name}</p>
                      <p className="mt-0.5 text-[11px] text-stone-600">#{order.id.slice(0, 8)}</p>
                    </td>
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
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
