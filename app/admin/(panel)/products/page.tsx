import Link from "next/link";
import AdminProductsList from "@/components/admin/AdminProductsList";
import { AdminPageHeader } from "@/components/admin/ui";
import { diagnoseAdminCapabilities } from "@/lib/admin-diagnostics";
import { runStorefrontCatalogSync } from "@/lib/sync-storefront-catalog";
import { createClient } from "@/lib/supabase/server";
import type { Product } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  try {
    await runStorefrontCatalogSync();
  } catch (err) {
    console.error("storefront catalog sync threw", err);
  }

  const [diag, productsResult] = await Promise.all([
    diagnoseAdminCapabilities(),
    (async () => {
      const supabase = await createClient();
      return supabase
        .from("products")
        .select("*, categories(id, name, slug)")
        .order("created_at", { ascending: false });
    })(),
  ]);

  const products = (productsResult.data ?? []) as Product[];
  const deleteReady =
    diag.isAdmin && diag.deleteRpcAvailable && diag.deleteTriggerFixed !== false;

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

      {!deleteReady && (
        <div className="mb-4 rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
          <p className="font-bold">حذف المنتجات غير جاهز بالكامل على قاعدة البيانات</p>
          <ul className="mt-2 list-disc space-y-1 pe-5 text-amber-100/90">
            {!diag.isAdmin && <li>حساب الأدمن غير مربوط بشكل صحيح.</li>}
            {!diag.deleteRpcAvailable && (
              <li>شغّل <code className="text-xs">0008_product_delete.sql</code> على Supabase.</li>
            )}
            {diag.deleteTriggerFixed === false && (
              <li>
                شغّل <code className="text-xs">0009_fix_product_delete_trigger.sql</code> على
                Supabase (هذا سبب فشل الحذف للمنتجات المرتبطة بطلبات).
              </li>
            )}
          </ul>
        </div>
      )}

      <AdminProductsList products={products} />
    </div>
  );
}
