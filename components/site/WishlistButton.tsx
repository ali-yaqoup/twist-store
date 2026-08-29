"use client";

import { useWishlist } from "@/components/wishlist/WishlistProvider";
import { useIosTapWithEvent } from "@/lib/ios-tap";
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

  const handleToggle = () => toggleItem(product);
  const tap = useIosTapWithEvent(() => handleToggle());

  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={saved}
      title={label}
      className={
        variant === "label"
          ? `inline-flex min-h-11 w-full touch-manipulation items-center justify-center gap-2 rounded-full border px-5 py-3.5 text-sm font-bold transition-all sm:w-auto ${
              saved
                ? "border-brand bg-brand/15 text-brand"
                : "border-brand/25 text-stone-200 hover:border-brand hover:text-brand active:border-brand active:text-brand"
            }`
          : `icon-action touch-manipulation ${
              saved ? "border-brand bg-brand text-black hover:text-black" : ""
            }`
      }
      {...tap}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill={saved ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.7"
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
