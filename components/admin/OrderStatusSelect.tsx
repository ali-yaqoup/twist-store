"use client";

import { useTransition } from "react";
import { updateOrderStatus } from "@/app/admin/actions";
import { ORDER_STATUS_LABELS, type OrderStatus } from "@/lib/types";

const STATUSES = Object.keys(ORDER_STATUS_LABELS) as OrderStatus[];

export default function OrderStatusSelect({
  orderId,
  current,
}: {
  orderId: string;
  current: OrderStatus;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <select
      defaultValue={current}
      disabled={pending}
      onChange={(e) => {
        const status = e.target.value as OrderStatus;
        startTransition(async () => {
          await updateOrderStatus(orderId, status);
        });
      }}
      className="rounded-lg border border-white/15 bg-night px-3 py-2 text-sm font-bold text-stone-100 focus:border-brand focus:outline-none disabled:opacity-60"
    >
      {STATUSES.map((s) => (
        <option key={s} value={s}>
          {ORDER_STATUS_LABELS[s]}
        </option>
      ))}
    </select>
  );
}
