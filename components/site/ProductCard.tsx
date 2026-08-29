"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useState } from "react";
import { useCart } from "@/components/cart/CartProvider";
import WishlistButton from "@/components/site/WishlistButton";
import { formatPrice } from "@/lib/config";
import { useIosTap } from "@/lib/ios-tap";
import type { Product } from "@/lib/types";

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const image = product.images[0] ?? null;

  const quickAdd = useCallback(() => {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image,
      quantity: 1,
      size: product.sizes[0] ?? null,
      color: product.colors[0] ?? null,
      serviceType:
        product.embroidery_or_print_type === "both"
          ? null
          : product.embroidery_or_print_type,
      note: null,
      designUrl: null,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }, [addItem, image, product]);

  const quickAddTap = useIosTap(quickAdd);

  return (
    <div className="group min-w-0 overflow-hidden rounded-xl border border-brand/16 bg-night-card transition-all duration-300 hover:border-brand/45 hover:shadow-[0_16px_40px_rgba(0,0,0,0.45),0_0_24px_rgba(245,196,0,0.08)]">
      <div className="relative aspect-[4/5] overflow-hidden bg-night-soft">
        <Link
          href={`/products/${product.id}`}
          className="absolute inset-0 z-0"
          aria-label={product.name}
        >
          <Image
            src={image ?? "/placeholder-product.svg"}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
            className="pointer-events-none object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          />
          <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent opacity-70" />
        </Link>
        <div className="absolute top-3 start-3 z-[2]">
          <WishlistButton product={product} />
        </div>
        <button
          type="button"
          aria-label={added ? "أُضيف للسلة" : "أضف للسلة"}
          className={`icon-action pointer-events-auto absolute bottom-3 end-3 z-[2] touch-manipulation opacity-100 shadow-lg transition-all duration-300 sm:translate-y-1 sm:opacity-0 sm:group-hover:translate-y-0 sm:group-hover:opacity-100 ${
            added ? "border-brand bg-brand text-black" : ""
          }`}
          {...quickAddTap}
        >
          {added ? (
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
      </div>

      <div className="space-y-1.5 px-3.5 py-4">
        {product.categories && (
          <span className="text-[11px] tracking-wide text-stone-500">
            {product.categories.name}
          </span>
        )}
        <Link href={`/products/${product.id}`}>
          <h3 className="font-display line-clamp-1 text-[15px] font-bold text-stone-100 transition-colors group-hover:text-brand">
            {product.name}
          </h3>
        </Link>
        <p className="pt-1 font-display text-base font-extrabold tracking-wide text-brand">
          {formatPrice(product.price)}
        </p>
      </div>
    </div>
  );
}
