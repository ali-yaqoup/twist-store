"use client";

import Image from "next/image";
import Link from "next/link";
import { cartLineKey, useCart } from "@/components/cart/CartProvider";
import EmptyState from "@/components/site/EmptyState";
import CheckoutSteps from "@/components/site/CheckoutSteps";
import PageHeading from "@/components/site/PageHeading";
import { formatPrice } from "@/lib/config";
import { useIosTap } from "@/lib/ios-tap";
import type { CartItem } from "@/lib/types";

function CartLineItem({
  item,
  onUpdate,
  onRemove,
}: {
  item: CartItem;
  onUpdate: (quantity: number) => void;
  onRemove: () => void;
}) {
  const key = cartLineKey(item);
  const decTap = useIosTap(() => onUpdate(item.quantity - 1));
  const incTap = useIosTap(() => onUpdate(item.quantity + 1));
  const removeTap = useIosTap(onRemove);

  return (
    <li className="card-luxe flex gap-3 p-3 sm:gap-4 sm:p-4">
      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-night-soft sm:h-24 sm:w-24">
        <Image
          src={item.image ?? "/placeholder-product.svg"}
          alt={item.name}
          fill
          sizes="96px"
          className="object-cover"
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <Link
              href={`/products/${item.productId}`}
              className="font-display font-bold text-stone-100 hover:text-brand"
            >
              {item.name}
            </Link>
            <p className="mt-1 text-xs text-stone-500">
              {[
                item.size && `المقاس: ${item.size}`,
                item.color && `اللون: ${item.color}`,
                item.serviceType &&
                  (item.serviceType === "embroidery" ? "تطريز" : "طباعة"),
              ]
                .filter(Boolean)
                .join(" · ")}
            </p>
            {item.note && (
              <p className="mt-1 text-xs text-stone-500">{item.note}</p>
            )}
            {item.designUrl && (
              <p className="mt-1 text-xs text-brand">تصميم مرفق</p>
            )}
          </div>
          <button
            type="button"
            aria-label="حذف"
            className="flex h-11 w-11 shrink-0 touch-manipulation items-center justify-center text-stone-500 transition-colors active:text-red-400 hover:text-red-400"
            {...removeTap}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden>
              <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
            </svg>
          </button>
        </div>

        <div className="mt-auto flex items-center justify-between pt-3">
          <div className="flex items-center rounded-full border border-brand/20 text-sm">
            <button
              type="button"
              aria-label="إنقاص"
              className="flex h-11 w-11 touch-manipulation items-center justify-center font-bold text-stone-200 active:text-brand hover:text-brand"
              {...decTap}
            >
              −
            </button>
            <span className="min-w-7 text-center font-bold text-stone-100">
              {item.quantity}
            </span>
            <button
              type="button"
              aria-label="زيادة"
              className="flex h-11 w-11 touch-manipulation items-center justify-center font-bold text-stone-200 active:text-brand hover:text-brand"
              {...incTap}
            >
              +
            </button>
          </div>
          <span className="font-display font-extrabold text-brand">
            {formatPrice(item.price * item.quantity)}
          </span>
        </div>
      </div>
    </li>
  );
}

export default function CartPage() {
  const { items, total, updateQuantity, removeItem } = useCart();

  return (
    <div className="section-container py-8 sm:py-12">
      <PageHeading title="سلة التسوق" />
      <CheckoutSteps current={1} />

      {items.length === 0 ? (
        <EmptyState
          icon="bag"
          title="سلتك فاضية"
          description="خلينا نعبيها بأحلى القطع — تطريز وطباعة بلمسة فاخرة."
        />
      ) : (
        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_320px]">
          <ul className="space-y-4">
            {items.map((item) => {
              const key = cartLineKey(item);
              return (
                <CartLineItem
                  key={key}
                  item={item}
                  onUpdate={(quantity) => updateQuantity(key, quantity)}
                  onRemove={() => removeItem(key)}
                />
              );
            })}
          </ul>

          <aside className="card-luxe h-fit p-5 sm:p-6 lg:sticky lg:top-24">
            <h2 className="font-display text-lg font-extrabold text-stone-100">ملخص الطلب</h2>
            <div className="mt-5 space-y-3 border-b border-brand/15 pb-5 text-sm text-stone-400">
              <div className="flex justify-between">
                <span>عدد القطع</span>
                <span className="font-bold text-stone-200">
                  {items.reduce((s, i) => s + i.quantity, 0)}
                </span>
              </div>
            </div>
            <div className="mt-5 flex flex-wrap items-center justify-between gap-2">
              <span className="font-bold text-stone-100">المجموع الكلي</span>
              <span className="font-display text-xl font-extrabold text-brand sm:text-2xl">{formatPrice(total)}</span>
            </div>
            <Link href="/checkout" className="btn-gold glow-gold mt-6 w-full touch-manipulation">
              إتمام الطلب
            </Link>
            <Link
              href="/products"
              className="mt-3 flex min-h-11 touch-manipulation items-center justify-center text-center text-sm text-stone-500 hover:text-brand"
            >
              أو تابع التسوق
            </Link>
          </aside>
        </div>
      )}
    </div>
  );
}
