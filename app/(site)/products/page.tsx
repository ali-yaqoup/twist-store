import type { Metadata } from "next";
import ProductCard from "@/components/site/ProductCard";
import ProductFilters from "@/components/site/ProductFilters";
import { getCategories, getProducts, getSiteSettings } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return { title: settings.products_title || "المنتجات" };
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; min?: string; max?: string }>;
}) {
  const params = await searchParams;
  const minPrice = params.min ? Number(params.min) : undefined;
  const maxPrice = params.max ? Number(params.max) : undefined;

  const [categories, products, settings] = await Promise.all([
    getCategories(),
    getProducts({
      categorySlug: params.category || undefined,
      minPrice: Number.isFinite(minPrice) ? minPrice : undefined,
      maxPrice: Number.isFinite(maxPrice) ? maxPrice : undefined,
    }),
    getSiteSettings(),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-black text-stone-50 sm:text-4xl">
        {settings.products_title}
      </h1>
      <div className="mt-3 h-1 w-16 rounded-full bg-brand" />

      <div className="mt-10 grid gap-8 lg:grid-cols-[260px_1fr]">
        {/* الفلاتر */}
        <aside className="h-fit rounded-2xl border border-white/10 bg-night-card p-5 lg:sticky lg:top-24">
          <ProductFilters
            categories={categories}
            current={{
              category: params.category ?? "",
              min: params.min ?? "",
              max: params.max ?? "",
            }}
          />
        </aside>

        {/* الشبكة */}
        <div>
          {products.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 sm:gap-6 xl:grid-cols-3">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <p className="rounded-2xl border border-dashed border-white/15 py-24 text-center text-stone-500">
              {settings.products_empty}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
