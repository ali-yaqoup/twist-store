"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/components/cart/CartProvider";
import { useWishlist } from "@/components/wishlist/WishlistProvider";
import { formatPrice } from "@/lib/config";
import type { WishlistItem } from "@/lib/types";

export default function WishlistPage() {
  const { items, removeItem } = useWishlist();
  const { addItem } = useCart();
  const [addedId, setAddedId] = useState<string | null>(null);

  function handleAddToCart(item: WishlistItem) {
    addItem({
      productId: item.productId,
      name: item.name,
      price: item.price,
      image: item.image,
      quantity: 1,
      size: item.sizes[0] ?? null,
      color: item.colors[0] ?? null,
      serviceType:
        item.embroidery_or_print_type === "both"
          ? null
          : item.embroidery_or_print_type,
      note: null,
      designUrl: null,
    });
    setAddedId(item.productId);
    setTimeout(() => setAddedId(null), 1500);
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-black text-stone-50 sm:text-4xl">
        قائمة الأمنيات
      </h1>
      <div className="mt-3 h-1 w-16 rounded-full bg-brand" />

      {items.length === 0 ? (
        <div className="mt-16 flex flex-col items-center gap-6 rounded-2xl border border-dashed border-white/15 py-20 text-center">
          <span className="text-5xl" aria-hidden>
            ♡
          </span>
          <p className="text-stone-400">
            قائمة الأمنيات فاضية… احفظ القطع اللي بتعجبك لترجع لها بعدين.
          </p>
          <Link
            href="/products"
            className="rounded-full bg-brand px-8 py-3 font-extrabold text-black transition-colors hover:bg-brand-soft"
          >
            تصفح المنتجات
          </Link>
        </div>
      ) : (
        <ul className="mt-10 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {items.map((item) => (
            <li
              key={item.productId}
              className="group overflow-hidden rounded-2xl border border-white/10 bg-night-card transition-all duration-300 hover:border-brand/60 hover:shadow-[0_0_30px_rgba(245,196,0,0.12)]"
            >
              <Link href={`/products/${item.productId}`} className="block">
                <div className="relative aspect-square overflow-hidden bg-night-soft">
                  <Image
                    src={item.image ?? "/placeholder-product.svg"}
                    alt={item.name}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              </Link>

              <div className="p-4">
                <Link href={`/products/${item.productId}`}>
                  <h2 className="line-clamp-1 font-bold text-stone-100 transition-colors group-hover:text-brand">
                    {item.name}
                  </h2>
                </Link>
                <p className="mt-2 text-lg font-extrabold text-brand">
                  {formatPrice(item.price)}
                </p>
                <div className="mt-3 flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => handleAddToCart(item)}
                    className={`rounded-full px-4 py-1.5 text-sm font-bold transition-all ${
                      addedId === item.productId
                        ? "bg-green-500 text-black"
                        : "bg-brand text-black hover:bg-brand-soft"
                    }`}
                  >
                    {addedId === item.productId ? "أُضيف ✓" : "أضف للسلة"}
                  </button>
                  <button
                    type="button"
                    onClick={() => removeItem(item.productId)}
                    className="rounded-full border border-white/15 px-4 py-1.5 text-sm font-bold text-stone-300 transition-colors hover:border-red-400 hover:text-red-400"
                  >
                    إزالة
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
