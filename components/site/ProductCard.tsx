"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/components/cart/CartProvider";
import WishlistButton from "@/components/site/WishlistButton";
import { formatPrice } from "@/lib/config";
import type { Product } from "@/lib/types";

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const image = product.images[0] ?? null;

  function quickAdd() {
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
  }

  return (
    <div className="group overflow-hidden rounded-2xl border border-white/10 bg-night-card transition-all duration-300 hover:border-brand/60 hover:shadow-[0_0_30px_rgba(245,196,0,0.12)]">
      <div className="relative aspect-square overflow-hidden bg-night-soft">
        <Link href={`/products/${product.id}`} className="absolute inset-0">
          <Image
            src={image ?? "/placeholder-product.svg"}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </Link>
        <div className="absolute top-3 start-3 z-10">
          <WishlistButton product={product} />
        </div>
      </div>

      <div className="p-4">
        {product.categories && (
          <span className="text-xs text-stone-500">{product.categories.name}</span>
        )}
        <Link href={`/products/${product.id}`}>
          <h3 className="mt-1 line-clamp-1 font-bold text-stone-100 transition-colors group-hover:text-brand">
            {product.name}
          </h3>
        </Link>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-lg font-extrabold text-brand">
            {formatPrice(product.price)}
          </span>
          <button
            type="button"
            onClick={quickAdd}
            className={`rounded-full px-4 py-1.5 text-sm font-bold transition-all ${
              added
                ? "bg-green-500 text-black"
                : "bg-brand text-black hover:bg-brand-soft"
            }`}
          >
            {added ? "أُضيف ✓" : "أضف للسلة"}
          </button>
        </div>
      </div>
    </div>
  );
}
