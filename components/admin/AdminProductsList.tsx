"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import ProductDeleteCell from "@/components/admin/ProductDeleteCell";
import { AdminEmpty, AdminSearchField, FilterPills } from "@/components/admin/ui";
import { formatPrice } from "@/lib/config";
import { SERVICE_TYPE_LABELS, type Product } from "@/lib/types";

type Filter = "all" | "active" | "hidden" | "featured";

export default function AdminProductsList({ products }: { products: Product[] }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => {
      if (filter === "active" && !p.is_active) return false;
      if (filter === "hidden" && p.is_active) return false;
      if (filter === "featured" && !p.is_featured) return false;
      if (!q) return true;
      return (
        p.name.toLowerCase().includes(q) ||
        (p.categories?.name ?? "").toLowerCase().includes(q)
      );
    });
  }, [products, query, filter]);

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <AdminSearchField
          value={query}
          onChange={setQuery}
          placeholder="ابحث باسم المنتج أو الفئة…"
        />
        <FilterPills
          value={filter}
          onChange={setFilter}
          options={[
            { id: "all", label: "الكل", count: products.length },
            { id: "active", label: "فعّال", count: products.filter((p) => p.is_active).length },
            { id: "hidden", label: "مخفي", count: products.filter((p) => !p.is_active).length },
            { id: "featured", label: "مميز", count: products.filter((p) => p.is_featured).length },
          ]}
        />
      </div>

      {filtered.length === 0 ? (
        <div className="mt-6">
          <AdminEmpty
            title={products.length === 0 ? "لا توجد منتجات بعد" : "لا نتائج لهذا البحث"}
            hint={products.length === 0 ? "ابدأ بإضافة أول منتج للمتجر." : "جرّب كلمة ثانية أو فلتر مختلف."}
          />
        </div>
      ) : (
        <>
          <ul className="mt-5 space-y-3 md:hidden">
            {filtered.map((product) => (
              <li key={product.id} className="rounded-2xl border border-white/10 bg-night-card p-3">
                <div className="flex gap-3">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-night-soft">
                    <Image
                      src={product.images[0] ?? "/placeholder-product.svg"}
                      alt=""
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-extrabold text-stone-50">{product.name}</p>
                    <p className="mt-0.5 text-xs text-stone-500">
                      {product.categories?.name ?? "بدون فئة"} ·{" "}
                      {SERVICE_TYPE_LABELS[product.embroidery_or_print_type]}
                    </p>
                    <p className="mt-1 text-sm font-extrabold text-brand">
                      {formatPrice(Number(product.price))}
                    </p>
                  </div>
                  <span
                    className={`h-fit rounded-full px-2 py-1 text-[10px] font-extrabold ${
                      product.is_active
                        ? "bg-emerald-500/15 text-emerald-300"
                        : "bg-stone-500/15 text-stone-400"
                    }`}
                  >
                    {product.is_active ? "فعّال" : "مخفي"}
                  </span>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <Link
                    href={`/admin/products/${product.id}/edit`}
                    className="flex-1 rounded-xl border border-white/15 py-2 text-center text-xs font-bold text-stone-200 hover:border-brand hover:text-brand"
                  >
                    تعديل
                  </Link>
                  <ProductDeleteCell productId={product.id} productName={product.name} />
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-5 hidden overflow-x-auto rounded-2xl border border-white/10 bg-night-card md:block">
            <table className="w-full min-w-[720px] text-sm">
              <thead>
                <tr className="border-b border-white/10 text-right text-xs text-stone-500">
                  <th className="p-4 font-medium">المنتج</th>
                  <th className="p-4 font-medium">الفئة</th>
                  <th className="p-4 font-medium">السعر</th>
                  <th className="p-4 font-medium">الخدمة</th>
                  <th className="p-4 font-medium">الحالة</th>
                  <th className="p-4 font-medium">مميز</th>
                  <th className="p-4 font-medium">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map((product) => (
                  <tr key={product.id} className="transition-colors hover:bg-white/[0.03]">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-night-soft">
                          <Image
                            src={product.images[0] ?? "/placeholder-product.svg"}
                            alt=""
                            fill
                            sizes="48px"
                            className="object-cover"
                          />
                        </div>
                        <span className="font-bold text-stone-100">{product.name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-stone-400">{product.categories?.name ?? "—"}</td>
                    <td className="p-4 font-bold text-brand">{formatPrice(Number(product.price))}</td>
                    <td className="p-4 text-stone-400">
                      {SERVICE_TYPE_LABELS[product.embroidery_or_print_type]}
                    </td>
                    <td className="p-4">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                          product.is_active
                            ? "bg-emerald-500/15 text-emerald-300"
                            : "bg-stone-500/15 text-stone-400"
                        }`}
                      >
                        {product.is_active ? "فعّال" : "مخفي"}
                      </span>
                    </td>
                    <td className="p-4">
                      {product.is_featured ? (
                        <span className="text-xs font-bold text-brand">مميز</span>
                      ) : (
                        <span className="text-xs text-stone-600">—</span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/products/${product.id}/edit`}
                          className="rounded-lg border border-white/15 px-3 py-1.5 text-xs font-bold text-stone-200 transition-colors hover:border-brand hover:text-brand"
                        >
                          تعديل
                        </Link>
                        <ProductDeleteCell productId={product.id} productName={product.name} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
