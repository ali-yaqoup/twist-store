import type { Metadata } from "next";
import ProductCard from "@/components/site/ProductCard";
import ProductFilters from "@/components/site/ProductFilters";
import PageHeading from "@/components/site/PageHeading";
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
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
      <PageHeading title={settings.products_title} />

      <div className="mt-8 grid gap-6 lg:mt-10 lg:grid-cols-[260px_1fr] lg:gap-8">
        <aside className="card-luxe h-fit p-4 sm:p-5 lg:sticky lg:top-24 lg:p-6">
          <ProductFilters
            categories={categories}
            current={{
              category: params.category ?? "",
              min: params.min ?? "",
              max: params.max ?? "",
            }}
          />
        </aside>

        <div className="min-w-0">
          {products.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <p className="card-luxe py-24 text-center text-stone-500">
              {settings.products_empty}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
