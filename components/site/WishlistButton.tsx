"use client";

import { useWishlist } from "@/components/wishlist/WishlistProvider";
import type { Product } from "@/lib/types";

export default function WishlistButton({
  product,
  variant = "icon",
}: {
  product: Product;
  variant?: "icon" | "label";
}) {
  const { isSaved, toggleItem } = useWishlist();
  const saved = isSaved(product.id);
  const label = saved ? "إزالة من قائمة الأمنيات" : "أضف لقائمة الأمنيات";

  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={saved}
      title={label}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleItem(product);
      }}
      className={
        variant === "label"
          ? `inline-flex items-center gap-2 rounded-full border px-5 py-3.5 text-sm font-bold transition-colors ${
              saved
                ? "border-brand bg-brand/15 text-brand"
                : "border-white/20 text-stone-200 hover:border-brand hover:text-brand"
            }`
          : `flex h-10 w-10 items-center justify-center rounded-full border backdrop-blur-md transition-colors ${
              saved
                ? "border-brand bg-brand text-black"
                : "border-white/15 bg-black/55 text-stone-100 hover:border-brand hover:text-brand"
            }`
      }
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill={saved ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
      {variant === "label" && (
        <span>{saved ? "محفوظ في الأمنيات" : "أضف للأمنيات"}</span>
      )}
    </button>
  );
}
