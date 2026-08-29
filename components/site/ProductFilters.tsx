"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import type { Category } from "@/lib/types";
import { useIosTap } from "@/lib/ios-tap";

interface Props {
  categories: Category[];
  current: { category: string; min: string; max: string };
}

export default function ProductFilters({ categories, current }: Props) {
  const router = useRouter();
  const [min, setMin] = useState(current.min);
  const [max, setMax] = useState(current.max);
  const [open, setOpen] = useState(
    Boolean(current.category || current.min || current.max)
  );

  const activeCount = [current.category, current.min, current.max].filter(Boolean).length;

  const toggleOpen = useCallback(() => setOpen((v) => !v), []);
  const toggleTap = useIosTap(toggleOpen);

  function buildUrl(category: string, minV: string, maxV: string): string {
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (minV) params.set("min", minV);
    if (maxV) params.set("max", maxV);
    const qs = params.toString();
    return qs ? `/products?${qs}` : "/products";
  }

  function applyPrice(e: React.FormEvent) {
    e.preventDefault();
    router.push(buildUrl(current.category, min, max));
  }

  return (
    <div>
      <button
        type="button"
        aria-expanded={open}
        className="flex min-h-11 w-full touch-manipulation cursor-pointer items-center justify-between gap-3 text-start font-bold text-stone-100 active:text-brand lg:hidden"
        {...toggleTap}
      >
        <span>الفلاتر{activeCount > 0 ? ` (${activeCount})` : ""}</span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          className={`shrink-0 text-brand transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden
        >
          <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <div className={`${open ? "mt-5 block" : "hidden"} space-y-8 lg:mt-0 lg:block`}>
        <div className="border-b border-brand/10 pb-6">
          <h3 className="mb-3 text-sm font-bold tracking-wide text-stone-100">الفئة</h3>
          <ul className="flex flex-wrap gap-2 lg:block lg:space-y-1 lg:gap-0">
            <li>
              <Link
                href={buildUrl("", current.min, current.max)}
                className={`flex min-h-11 items-center rounded-lg px-3 py-2 text-sm transition-colors active:bg-white/10 ${
                  !current.category
                    ? "bg-brand/15 font-bold text-brand"
                    : "text-stone-300 hover:bg-white/5 hover:text-brand"
                }`}
              >
                الكل
              </Link>
            </li>
            {categories.map((cat) => (
              <li key={cat.id}>
                <Link
                  href={buildUrl(cat.slug, current.min, current.max)}
                  className={`flex min-h-11 items-center rounded-lg px-3 py-2 text-sm transition-colors active:bg-white/10 ${
                    current.category === cat.slug
                      ? "bg-brand/15 font-bold text-brand"
                      : "text-stone-300 hover:bg-white/5 hover:text-brand"
                  }`}
                >
                  {cat.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <form onSubmit={applyPrice} className="pt-2">
          <h3 className="mb-3 text-sm font-bold tracking-wide text-stone-100">السعر (₪)</h3>
          <div className="flex items-center gap-2">
            <input
              type="number"
              inputMode="numeric"
              min={0}
              placeholder="من"
              value={min}
              onChange={(e) => setMin(e.target.value)}
              className="input-luxe min-w-0"
            />
            <span className="shrink-0 text-stone-500">—</span>
            <input
              type="number"
              inputMode="numeric"
              min={0}
              placeholder="إلى"
              value={max}
              onChange={(e) => setMax(e.target.value)}
              className="input-luxe min-w-0"
            />
          </div>
          <button
            type="submit"
            className="btn-gold mt-3 w-full py-2 text-sm"
          >
            تطبيق
          </button>
          {(current.min || current.max || current.category) && (
            <Link
              href="/products"
              className="mt-2 flex min-h-11 items-center justify-center text-center text-xs text-stone-500 underline-offset-4 hover:text-brand hover:underline"
            >
              مسح كل الفلاتر
            </Link>
          )}
        </form>
      </div>
    </div>
  );
}
