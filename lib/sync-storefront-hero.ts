import { requireAdmin } from "@/lib/admin-auth";
import { SETTINGS_ID } from "@/lib/cms";
import { STOREFRONT_HERO } from "@/lib/storefront-photos";
import { createClient } from "@/lib/supabase/server";

export type SyncResult = { ok: true } | { ok: false; error: string };

/**
 * One-time: write storefront banner photos into hero_slides so admin can manage them.
 * Never re-inserts after the first successful sync (even if admin deletes all).
 */
export async function runStorefrontHeroSync(): Promise<SyncResult> {
  const blocked = await requireAdmin();
  if (blocked) return blocked;

  const supabase = await createClient();

  const { data: settings, error: settingsError } = await supabase
    .from("site_settings")
    .select("id, storefront_hero_synced")
    .eq("id", SETTINGS_ID)
    .maybeSingle();

  // Column may be missing until migration 0010 — treat as unsynced.
  const alreadySynced = Boolean(
    settings && (settings as { storefront_hero_synced?: boolean }).storefront_hero_synced
  );
  if (alreadySynced) return { ok: true };

  const { data: rows, error: slidesError } = await supabase
    .from("hero_slides")
    .select("id, image_url");

  if (slidesError) {
    console.error("hero sync failed to list slides", slidesError);
    return { ok: false, error: "تعذر قراءة صور البانر" };
  }

  const urls = new Set((rows ?? []).map((r) => r.image_url));
  const photoSlides = (rows ?? []).filter((r) => r.image_url.startsWith("/photos/hero-"));

  if (photoSlides.length === 0) {
    // Drop legacy Unsplash seed slides so admin sees the real TWIST banners.
    await supabase
      .from("hero_slides")
      .delete()
      .like("image_url", "%images.unsplash.com%");

    for (const slide of STOREFRONT_HERO) {
      if (urls.has(slide.image_url)) continue;
      const { error } = await supabase.from("hero_slides").insert({
        image_url: slide.image_url,
        wide_image_url: slide.wide_image_url ?? null,
        alt_text: slide.alt_text,
        sort_order: slide.sort_order,
        is_active: true,
      });
      if (error) {
        // Retry without wide_image_url if column missing.
        const { error: retryError } = await supabase.from("hero_slides").insert({
          image_url: slide.image_url,
          alt_text: slide.alt_text,
          sort_order: slide.sort_order,
          is_active: true,
        });
        if (retryError) {
          console.error("hero sync insert failed", slide.image_url, retryError);
          return { ok: false, error: "تعذر إضافة صور البانر إلى قاعدة البيانات" };
        }
      }
    }
  }

  // Mark synced so deleted banners are not re-created on the next visit.
  if (!settingsError && settings) {
    const { error: flagError } = await supabase
      .from("site_settings")
      .update({ storefront_hero_synced: true })
      .eq("id", SETTINGS_ID);
    if (flagError) {
      // Migration 0010 not applied yet — still OK; photos are in the table.
      console.warn("storefront_hero_synced flag not saved", flagError.message);
    }
  }

  return { ok: true };
}
