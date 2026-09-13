import { requireAdmin } from "@/lib/admin-auth";
import { STOREFRONT_SYNC_TARGETS } from "@/lib/storefront-photos";
import { createClient } from "@/lib/supabase/server";

export type SyncResult = { ok: true } | { ok: false; error: string };

/** Persist storefront overlays into Supabase. Safe to call during RSC render. */
export async function runStorefrontCatalogSync(): Promise<SyncResult> {
  const blocked = await requireAdmin();
  if (blocked) return blocked;

  const supabase = await createClient();

  const [{ data: products, error: productsError }] = await Promise.all([
      supabase.from("products").select("id, name, category_id"),
    ]);

  if (productsError) {
    console.error("storefront catalog sync failed", productsError);
    return { ok: false, error: "تعذر مزامنة المنتجات مع قاعدة البيانات" };
  }

  const rows = products ?? [];

  for (const target of STOREFRONT_SYNC_TARGETS) {
    const existing = rows.find((p) => target.matchNames.includes(p.name));
    if (!existing || existing.name === target.patch.name) continue;

    const payload = {
      name: target.patch.name,
      description: target.patch.description,
      price: target.patch.price,
      images: target.patch.images,
      sizes: target.patch.sizes,
      colors: target.patch.colors,
      embroidery_or_print_type: target.patch.embroidery_or_print_type,
      is_featured: target.patch.is_featured,
      is_active: true,
      category_id: existing.category_id,
    };

    const { error } = await supabase.from("products").update(payload).eq("id", existing.id);
    if (error) {
      console.error("storefront catalog update failed", target.patch.name, error);
      return { ok: false, error: `تعذر تحديث «${target.patch.name}»` };
    }
    // Never auto-insert deleted products (e.g. قلنديا) back into the admin catalog.
  }

  return { ok: true };
}
