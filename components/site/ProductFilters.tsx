"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Category } from "@/lib/types";

interface Props {
  categories: Category[];
  current: { category: string; min: string; max: string };
}

export default function ProductFilters({ categories, current }: Props) {
  const router = useRouter();
  const [min, setMin] = useState(current.min);
  const [max, setMax] = useState(current.max);

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
    <div className="space-y-7">
      {/* فلتر الفئة */}
      <div>
        <h3 className="mb-3 font-bold text-stone-100">الفئة</h3>
        <ul className="space-y-1">
          <li>
            <Link
              href={buildUrl("", current.min, current.max)}
              className={`block rounded-lg px-3 py-2 text-sm transition-colors ${
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
                className={`block rounded-lg px-3 py-2 text-sm transition-colors ${
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

      {/* فلتر السعر */}
      <form onSubmit={applyPrice}>
        <h3 className="mb-3 font-bold text-stone-100">السعر</h3>
        <div className="flex items-center gap-2">
          <input
            type="number"
            inputMode="numeric"
            min={0}
            placeholder="من"
            value={min}
            onChange={(e) => setMin(e.target.value)}
            className="w-full rounded-lg border border-white/10 bg-night px-3 py-2 text-sm text-stone-100 placeholder:text-stone-600 focus:border-brand focus:outline-none"
          />
          <span className="text-stone-500">—</span>
          <input
            type="number"
            inputMode="numeric"
            min={0}
            placeholder="إلى"
            value={max}
            onChange={(e) => setMax(e.target.value)}
            className="w-full rounded-lg border border-white/10 bg-night px-3 py-2 text-sm text-stone-100 placeholder:text-stone-600 focus:border-brand focus:outline-none"
          />
        </div>
        <button
          type="submit"
          className="mt-3 w-full rounded-lg bg-brand py-2 text-sm font-bold text-black transition-colors hover:bg-brand-soft"
        >
          تطبيق
        </button>
        {(current.min || current.max || current.category) && (
          <Link
            href="/products"
            className="mt-2 block text-center text-xs text-stone-500 underline-offset-4 hover:text-brand hover:underline"
          >
            مسح كل الفلاتر
          </Link>
        )}
      </form>
    </div>
  );
}
