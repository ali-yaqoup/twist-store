import Image from "next/image";
import Link from "next/link";
import ProductDeleteCell from "@/components/admin/ProductDeleteCell";
import { formatPrice } from "@/lib/config";
import { createClient } from "@/lib/supabase/server";
import { SERVICE_TYPE_LABELS, type Product } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select("*, categories(id, name, slug)")
    .order("created_at", { ascending: false });

  const products = (data ?? []) as Product[];

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black text-stone-50">المنتجات</h1>
        <Link
          href="/admin/products/new"
          className="rounded-xl bg-brand px-5 py-2.5 text-sm font-extrabold text-black transition-colors hover:bg-brand-soft"
        >
          + إضافة منتج
        </Link>
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-white/10 bg-night-card">
        <table className="w-full min-w-[640px] text-sm">
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
            {products.map((product) => (
              <tr key={product.id} className="transition-colors hover:bg-white/[0.03]">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-night-soft">
                      <Image
                        src={product.images[0] ?? "/placeholder-product.svg"}
                        alt={product.name}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    </div>
                    <span className="font-bold text-stone-100">{product.name}</span>
                  </div>
                </td>
                <td className="p-4 text-stone-400">
                  {product.categories?.name ?? "—"}
                </td>
                <td className="p-4 font-bold text-brand">
                  {formatPrice(Number(product.price))}
                </td>
                <td className="p-4 text-stone-400">
                  {SERVICE_TYPE_LABELS[product.embroidery_or_print_type]}
                </td>
                <td className="p-4">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                      product.is_active
                        ? "bg-green-500/15 text-green-400"
                        : "bg-stone-500/15 text-stone-400"
                    }`}
                  >
                    {product.is_active ? "فعّال" : "مخفي"}
                  </span>
                </td>
                <td className="p-4">
                  {product.is_featured ? (
                    <span className="text-xs font-bold text-brand">★ مميز</span>
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
            {products.length === 0 && (
              <tr>
                <td colSpan={7} className="p-12 text-center text-stone-500">
                  لا توجد منتجات بعد — ابدأ بإضافة أول منتج
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
