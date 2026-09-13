import Link from "next/link";
import AdminProductsList from "@/components/admin/AdminProductsList";
import { AdminPageHeader } from "@/components/admin/ui";
import { runStorefrontCatalogSync } from "@/lib/sync-storefront-catalog";
import { createClient } from "@/lib/supabase/server";
import type { Product } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  // Persist storefront overlays once (safe during RSC — no revalidatePath).
  try {
    await runStorefrontCatalogSync();
  } catch (err) {
    console.error("storefront catalog sync threw", err);
  }

  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select("*, categories(id, name, slug)")
    .order("created_at", { ascending: false });

  const products = (data ?? []) as Product[];

  return (
    <div>
      <AdminPageHeader
        title="المنتجات"
        description={`${products.length} منتج في المتجر — ابحث أو فلتر بسرعة.`}
        actions={
          <Link href="/admin/products/new" className="btn-gold !min-h-10 !rounded-xl !px-5 !py-2 text-sm">
            إضافة منتج
          </Link>
        }
      />
      <AdminProductsList products={products} />
    </div>
  );
}
