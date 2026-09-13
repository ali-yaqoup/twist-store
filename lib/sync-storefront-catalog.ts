import { requireAdmin } from "@/lib/admin-auth";
import { STOREFRONT_SYNC_TARGETS } from "@/lib/storefront-photos";
import { createClient } from "@/lib/supabase/server";

export type SyncResult = { ok: true } | { ok: false; error: string };

/** Persist storefront overlays into Supabase. Safe to call during RSC render. */
export async function runStorefrontCatalogSync(): Promise<SyncResult> {
  const blocked = await requireAdmin();
  if (blocked) return blocked;

  const supabase = await createClient();

  const [{ data: products, error: productsError }, { data: categories, error: categoriesError }] =
    await Promise.all([
      supabase.from("products").select("id, name, category_id"),
      supabase.from("categories").select("id, slug"),
    ]);

  if (productsError || categoriesError) {
    console.error("storefront catalog sync failed", productsError ?? categoriesError);
    return { ok: false, error: "تعذر مزامنة المنتجات مع قاعدة البيانات" };
  }

  const tshirtsId = categories?.find((c) => c.slug === "tshirts")?.id ?? null;
  const rows = products ?? [];

  for (const target of STOREFRONT_SYNC_TARGETS) {
    const existing = rows.find((p) => target.matchNames.includes(p.name));
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
      category_id: existing?.category_id ?? tshirtsId,
    };

    if (existing) {
      // Only push overlay once (legacy seed name → storefront name).
      if (existing.name === target.patch.name) continue;
      const { error } = await supabase.from("products").update(payload).eq("id", existing.id);
      if (error) {
        console.error("storefront catalog update failed", target.patch.name, error);
        return { ok: false, error: `تعذر تحديث «${target.patch.name}»` };
      }
    } else if (target.patch.name === "تيشيرت قلنديا") {
      if (!tshirtsId) return { ok: false, error: "فئة التيشيرتات غير موجودة" };
      const { error } = await supabase.from("products").insert(payload);
      if (error) {
        console.error("storefront catalog insert failed", error);
        return { ok: false, error: "تعذر إضافة تيشيرت قلنديا" };
      }
    }
  }

  return { ok: true };
}
