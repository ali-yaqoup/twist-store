"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/components/cart/CartProvider";
import { useWishlist } from "@/components/wishlist/WishlistProvider";
import EmptyState from "@/components/site/EmptyState";
import PageHeading from "@/components/site/PageHeading";
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
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
      <PageHeading title="قائمة الأمنيات" />

      {items.length === 0 ? (
        <EmptyState
          icon="heart"
          title="قائمة الأمنيات فاضية"
          description="احفظ القطع اللي بتعجبك لترجع لها بعدين."
        />
      ) : (
        <ul className="mt-8 grid grid-cols-1 gap-3 sm:mt-10 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((item) => (
            <li
              key={item.productId}
              className="group overflow-hidden rounded-xl border border-brand/16 bg-night-card transition-all duration-300 hover:border-brand/45 hover:shadow-[0_16px_40px_rgba(0,0,0,0.45),0_0_24px_rgba(245,196,0,0.08)]"
            >
              <Link href={`/products/${item.productId}`} className="block">
                <div className="relative aspect-[4/5] overflow-hidden bg-night-soft">
                  <Image
                    src={item.image ?? "/placeholder-product.svg"}
                    alt={item.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
              </Link>

              <div className="space-y-1.5 px-3.5 py-4">
                <Link href={`/products/${item.productId}`}>
                  <h2 className="font-display line-clamp-1 text-[15px] font-bold text-stone-100 transition-colors group-hover:text-brand">
                    {item.name}
                  </h2>
                </Link>
                <p className="font-display text-base font-extrabold text-brand">
                  {formatPrice(item.price)}
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleAddToCart(item)}
                    className={`icon-action ${
                      addedId === item.productId ? "border-brand bg-brand text-black" : ""
                    }`}
                    aria-label={addedId === item.productId ? "أُضيف للسلة" : "أضف للسلة"}
                  >
                    {addedId === item.productId ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden>
                        <path d="M5 12.5 10 17.5 19 7.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden>
                        <circle cx="9" cy="21" r="1" />
                        <circle cx="20" cy="21" r="1" />
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                      </svg>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => removeItem(item.productId)}
                    className="flex min-h-11 items-center text-xs font-bold text-stone-500 transition-colors hover:text-red-400"
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
