"use client";

import Image from "next/image";
import Link from "next/link";
import { cartLineKey, useCart } from "@/components/cart/CartProvider";
import { formatPrice } from "@/lib/config";

export default function CartPage() {
  const { items, total, updateQuantity, removeItem } = useCart();

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-black text-stone-50 sm:text-4xl">سلة التسوق</h1>
      <div className="mt-3 h-1 w-16 rounded-full bg-brand" />

      {items.length === 0 ? (
        <div className="mt-16 flex flex-col items-center gap-6 rounded-2xl border border-dashed border-white/15 py-20 text-center">
          <span className="text-5xl">🛒</span>
          <p className="text-stone-400">سلتك فاضية… خلينا نعبيها بأحلى القطع!</p>
          <Link
            href="/products"
            className="rounded-full bg-brand px-8 py-3 font-extrabold text-black transition-colors hover:bg-brand-soft"
          >
            تصفح المنتجات
          </Link>
        </div>
      ) : (
        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_320px]">
          {/* عناصر السلة */}
          <ul className="space-y-4">
            {items.map((item) => {
              const key = cartLineKey(item);
              return (
                <li
                  key={key}
                  className="flex gap-4 rounded-2xl border border-white/10 bg-night-card p-4"
                >
                  <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-night-soft">
                    <Image
                      src={item.image ?? "/placeholder-product.svg"}
                      alt={item.name}
                      fill
                      sizes="96px"
                      className="object-cover"
                    />
                  </div>

                  <div className="flex flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <Link
                          href={`/products/${item.productId}`}
                          className="font-bold text-stone-100 hover:text-brand"
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
                          <p className="mt-1 text-xs text-stone-500">📝 {item.note}</p>
                        )}
                        {item.designUrl && (
                          <p className="mt-1 text-xs text-brand">🎨 تصميم مرفق</p>
                        )}
                      </div>
                      <button
                        type="button"
                        aria-label="حذف"
                        onClick={() => removeItem(key)}
                        className="text-stone-500 transition-colors hover:text-red-400"
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                          <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                        </svg>
                      </button>
                    </div>

                    <div className="mt-auto flex items-center justify-between pt-3">
                      <div className="flex items-center rounded-full border border-white/15 text-sm">
                        <button
                          type="button"
                          aria-label="زيادة"
                          onClick={() => updateQuantity(key, item.quantity + 1)}
                          className="px-3 py-1.5 font-bold text-stone-200 hover:text-brand"
                        >
                          +
                        </button>
                        <span className="min-w-7 text-center font-bold text-stone-100">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          aria-label="إنقاص"
                          onClick={() => updateQuantity(key, item.quantity - 1)}
                          className="px-3 py-1.5 font-bold text-stone-200 hover:text-brand"
                        >
                          −
                        </button>
                      </div>
                      <span className="font-extrabold text-brand">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>

          {/* الملخص */}
          <aside className="h-fit rounded-2xl border border-white/10 bg-night-card p-6 lg:sticky lg:top-24">
            <h2 className="text-lg font-black text-stone-100">ملخص الطلب</h2>
            <div className="mt-5 space-y-3 border-b border-white/10 pb-5 text-sm text-stone-400">
              <div className="flex justify-between">
                <span>عدد القطع</span>
                <span className="font-bold text-stone-200">
                  {items.reduce((s, i) => s + i.quantity, 0)}
                </span>
              </div>
            </div>
            <div className="mt-5 flex items-center justify-between">
              <span className="font-bold text-stone-100">المجموع الكلي</span>
              <span className="text-2xl font-black text-brand">{formatPrice(total)}</span>
            </div>
            <Link
              href="/checkout"
              className="glow-gold mt-6 block rounded-full bg-brand py-3.5 text-center font-extrabold text-black transition-colors hover:bg-brand-soft"
            >
              إتمام الطلب
            </Link>
            <Link
              href="/products"
              className="mt-3 block text-center text-sm text-stone-500 hover:text-brand"
            >
              أو تابع التسوق
            </Link>
          </aside>
        </div>
      )}
    </div>
  );
}
