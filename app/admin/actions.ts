"use server";

import { revalidatePath } from "next/cache";
import { SETTINGS_ID } from "@/lib/cms";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { storagePathFromPublicUrl } from "@/lib/upload";
import type { AboutValue, OrderStatus, ServiceType } from "@/lib/types";

export interface ActionResult {
  ok: boolean;
  error?: string;
}

function requireDb(): ActionResult | null {
  if (!isSupabaseConfigured()) {
    return {
      ok: false,
      error:
        "الحفظ يحتاج مشروع Supabase حقيقي. اضبط NEXT_PUBLIC_SUPABASE_URL و ANON_KEY ثم شغّل ملفات SQL من مجلد supabase/migrations.",
    };
  }
  return null;
}

function revalidateStore() {
  revalidatePath("/");
  revalidatePath("/products");
  revalidatePath("/about");
  revalidatePath("/contact");
}

function slugify(text: string): string {
  const slug = text
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\p{L}\p{N}-]/gu, "");
  return slug || `cat-${Date.now()}`;
}

async function patchSettings(patch: Record<string, unknown>): Promise<ActionResult> {
  const blocked = requireDb();
  if (blocked) return blocked;

  const supabase = await createClient();
  const { data: existing } = await supabase
    .from("site_settings")
    .select("id")
    .eq("id", SETTINGS_ID)
    .maybeSingle();

  const { error } = existing
    ? await supabase
        .from("site_settings")
        .update({ ...patch, updated_at: new Date().toISOString() })
        .eq("id", SETTINGS_ID)
    : await supabase.from("site_settings").insert({ id: SETTINGS_ID, ...patch });

  if (error) return { ok: false, error: "تعذر حفظ الإعدادات — تأكد من تشغيل 0004_cms.sql" };
  revalidateStore();
  revalidatePath("/admin/homepage");
  revalidatePath("/admin/settings");
  revalidatePath("/admin/about");
  return { ok: true };
}

async function removeStorageFile(url: string, bucket: "gallery" | "hero" | "products") {
  const path = storagePathFromPublicUrl(url, bucket);
  if (!path) return;
  const supabase = await createClient();
  await supabase.storage.from(bucket).remove([path]);
}

// ================= الفئات =================

export async function saveCategory(formData: FormData): Promise<ActionResult> {
  const blocked = requireDb();
  if (blocked) return blocked;

  const supabase = await createClient();
  const id = String(formData.get("id") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const slugInput = String(formData.get("slug") ?? "").trim();
  const icon = String(formData.get("icon") ?? "").trim() || null;

  if (!name) return { ok: false, error: "اسم الفئة مطلوب" };
  const slug = slugInput ? slugify(slugInput) : slugify(name);

  const { error } = id
    ? await supabase.from("categories").update({ name, slug, icon }).eq("id", id)
    : await supabase.from("categories").insert({ name, slug, icon });

  if (error) {
    return {
      ok: false,
      error: error.code === "23505" ? "يوجد فئة بنفس المعرّف (slug)" : "تعذر حفظ الفئة",
    };
  }

  revalidatePath("/admin/categories");
  revalidateStore();
  return { ok: true };
}

export async function deleteCategory(id: string): Promise<ActionResult> {
  const blocked = requireDb();
  if (blocked) return blocked;
  const supabase = await createClient();
  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) return { ok: false, error: "تعذر حذف الفئة" };
  revalidatePath("/admin/categories");
  revalidateStore();
  return { ok: true };
}

// ================= المنتجات =================

export interface ProductPayload {
  id?: string;
  name: string;
  description: string;
  price: number;
  categoryId: string | null;
  images: string[];
  sizes: string[];
  colors: string[];
  serviceType: ServiceType;
  isActive: boolean;
  isFeatured: boolean;
}

export async function saveProduct(payload: ProductPayload): Promise<ActionResult> {
  const blocked = requireDb();
  if (blocked) return blocked;
  if (!payload.name.trim()) return { ok: false, error: "اسم المنتج مطلوب" };
  if (!Number.isFinite(payload.price) || payload.price < 0) {
    return { ok: false, error: "السعر غير صالح" };
  }

  const supabase = await createClient();
  const row = {
    name: payload.name.trim(),
    description: payload.description.trim() || null,
    price: payload.price,
    category_id: payload.categoryId,
    images: payload.images,
    sizes: payload.sizes,
    colors: payload.colors,
    embroidery_or_print_type: payload.serviceType,
    is_active: payload.isActive,
    is_featured: payload.isFeatured,
  };

  const { error } = payload.id
    ? await supabase.from("products").update(row).eq("id", payload.id)
    : await supabase.from("products").insert(row);

  if (error) return { ok: false, error: "تعذر حفظ المنتج" };

  revalidatePath("/admin/products");
  revalidatePath("/admin/homepage");
  revalidateStore();
  if (payload.id) revalidatePath(`/products/${payload.id}`);
  return { ok: true };
}

export async function deleteProduct(id: string): Promise<ActionResult> {
  const blocked = requireDb();
  if (blocked) return blocked;
  const supabase = await createClient();
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) return { ok: false, error: "تعذر حذف المنتج" };
  revalidatePath("/admin/products");
  revalidateStore();
  return { ok: true };
}

// ================= الطلبات =================

export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus
): Promise<ActionResult> {
  const blocked = requireDb();
  if (blocked) return blocked;
  const supabase = await createClient();
  const { error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", orderId);
  if (error) return { ok: false, error: "تعذر تحديث حالة الطلب" };
  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${orderId}`);
  revalidatePath("/admin/dashboard");
  return { ok: true };
}

// ================= معرض الأعمال =================

export async function addGalleryImage(
  imageUrl: string,
  caption: string
): Promise<ActionResult> {
  const blocked = requireDb();
  if (blocked) return blocked;
  const supabase = await createClient();
  const { error } = await supabase.from("gallery_images").insert({
    image_url: imageUrl,
    caption: caption.trim() || null,
  });
  if (error) return { ok: false, error: "تعذر إضافة الصورة" };
  revalidatePath("/admin/gallery");
  revalidatePath("/");
  return { ok: true };
}

export async function deleteGalleryImage(id: string): Promise<ActionResult> {
  const blocked = requireDb();
  if (blocked) return blocked;
  const supabase = await createClient();

  const { data: row } = await supabase
    .from("gallery_images")
    .select("image_url")
    .eq("id", id)
    .maybeSingle();

  const { error } = await supabase.from("gallery_images").delete().eq("id", id);
  if (error) return { ok: false, error: "تعذر حذف الصورة" };

  if (row?.image_url) await removeStorageFile(row.image_url, "gallery");

  revalidatePath("/admin/gallery");
  revalidatePath("/");
  return { ok: true };
}

// ================= الرسائل =================

export async function toggleMessageRead(
  id: string,
  isRead: boolean
): Promise<ActionResult> {
  const blocked = requireDb();
  if (blocked) return blocked;
  const supabase = await createClient();
  const { error } = await supabase
    .from("contact_messages")
    .update({ is_read: isRead })
    .eq("id", id);
  if (error) return { ok: false, error: "تعذر تحديث الرسالة" };
  revalidatePath("/admin/messages");
  return { ok: true };
}

export async function deleteMessage(id: string): Promise<ActionResult> {
  const blocked = requireDb();
  if (blocked) return blocked;
  const supabase = await createClient();
  const { error } = await supabase.from("contact_messages").delete().eq("id", id);
  if (error) return { ok: false, error: "تعذر حذف الرسالة" };
  revalidatePath("/admin/messages");
  return { ok: true };
}

// ================= صور البانر =================

export async function addHeroSlide(
  imageUrl: string,
  altText: string
): Promise<ActionResult> {
  const blocked = requireDb();
  if (blocked) return blocked;
  const supabase = await createClient();
  const { data: last } = await supabase
    .from("hero_slides")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  const { error } = await supabase.from("hero_slides").insert({
    image_url: imageUrl,
    alt_text: altText.trim() || null,
    sort_order: (last?.sort_order ?? -1) + 1,
    is_active: true,
  });
  if (error) return { ok: false, error: "تعذر إضافة صورة البانر — شغّل 0004_cms.sql" };
  revalidatePath("/admin/homepage");
  revalidatePath("/");
  return { ok: true };
}

export async function deleteHeroSlide(id: string): Promise<ActionResult> {
  const blocked = requireDb();
  if (blocked) return blocked;
  const supabase = await createClient();
  const { data: row } = await supabase
    .from("hero_slides")
    .select("image_url")
    .eq("id", id)
    .maybeSingle();

  const { error } = await supabase.from("hero_slides").delete().eq("id", id);
  if (error) return { ok: false, error: "تعذر حذف صورة البانر" };
  if (row?.image_url) await removeStorageFile(row.image_url, "hero");

  revalidatePath("/admin/homepage");
  revalidatePath("/");
  return { ok: true };
}

export async function moveHeroSlide(
  id: string,
  direction: "up" | "down"
): Promise<ActionResult> {
  const blocked = requireDb();
  if (blocked) return blocked;
  const supabase = await createClient();
  const { data: slides, error } = await supabase
    .from("hero_slides")
    .select("id, sort_order")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error || !slides) return { ok: false, error: "تعذر إعادة الترتيب" };
  const idx = slides.findIndex((s) => s.id === id);
  const swap = direction === "up" ? idx - 1 : idx + 1;
  if (idx < 0 || swap < 0 || swap >= slides.length) return { ok: true };

  const a = slides[idx];
  const b = slides[swap];
  await supabase.from("hero_slides").update({ sort_order: b.sort_order }).eq("id", a.id);
  await supabase.from("hero_slides").update({ sort_order: a.sort_order }).eq("id", b.id);

  revalidatePath("/admin/homepage");
  revalidatePath("/");
  return { ok: true };
}

// ================= إعدادات + الصفحة الرئيسية + من نحن =================

export type SettingsPayload = {
  shop_name: string;
  tagline: string;
  logo_url: string;
  whatsapp_number: string;
  contact_phone: string;
  address: string;
  email: string;
  instagram_url: string;
  facebook_url: string;
  tiktok_url: string;
  footer_blurb: string;
  contact_title: string;
  contact_intro: string;
  contact_whatsapp_label: string;
  contact_success_title: string;
  contact_success_text: string;
  products_title: string;
  products_empty: string;
};

export async function saveSiteSettings(payload: SettingsPayload): Promise<ActionResult> {
  if (!payload.shop_name.trim()) return { ok: false, error: "اسم المتجر مطلوب" };
  return patchSettings({
    shop_name: payload.shop_name.trim(),
    tagline: payload.tagline.trim(),
    logo_url: payload.logo_url.trim(),
    whatsapp_number: payload.whatsapp_number.replace(/[^\d]/g, ""),
    contact_phone: payload.contact_phone.trim(),
    address: payload.address.trim(),
    email: payload.email.trim(),
    instagram_url: payload.instagram_url.trim(),
    facebook_url: payload.facebook_url.trim(),
    tiktok_url: payload.tiktok_url.trim(),
    footer_blurb: payload.footer_blurb.trim(),
    contact_title: payload.contact_title.trim(),
    contact_intro: payload.contact_intro.trim(),
    contact_whatsapp_label: payload.contact_whatsapp_label.trim(),
    contact_success_title: payload.contact_success_title.trim(),
    contact_success_text: payload.contact_success_text.trim(),
    products_title: payload.products_title.trim(),
    products_empty: payload.products_empty.trim(),
  });
}

export type HomepagePayload = {
  hero_badge: string;
  hero_title: string;
  hero_highlight: string;
  hero_subtitle: string;
  hero_cta_label: string;
  hero_cta_href: string;
  hero_secondary_cta_label: string;
  hero_secondary_cta_href: string;
  categories_title: string;
  featured_title: string;
  featured_subtitle: string;
  featured_cta: string;
  gallery_title: string;
  gallery_subtitle: string;
  home_about_title: string;
  home_about_text: string;
  home_about_bullets: string[];
  home_about_cta: string;
  testimonials_title: string;
  featuredProductIds: string[];
};

export async function saveHomepage(payload: HomepagePayload): Promise<ActionResult> {
  const settingsResult = await patchSettings({
    hero_badge: payload.hero_badge.trim(),
    hero_title: payload.hero_title.trim(),
    hero_highlight: payload.hero_highlight.trim(),
    hero_subtitle: payload.hero_subtitle.trim(),
    hero_cta_label: payload.hero_cta_label.trim(),
    hero_cta_href: payload.hero_cta_href.trim() || "/products",
    hero_secondary_cta_label: payload.hero_secondary_cta_label.trim(),
    hero_secondary_cta_href: payload.hero_secondary_cta_href.trim() || "/contact",
    categories_title: payload.categories_title.trim(),
    featured_title: payload.featured_title.trim(),
    featured_subtitle: payload.featured_subtitle.trim(),
    featured_cta: payload.featured_cta.trim(),
    gallery_title: payload.gallery_title.trim(),
    gallery_subtitle: payload.gallery_subtitle.trim(),
    home_about_title: payload.home_about_title.trim(),
    home_about_text: payload.home_about_text.trim(),
    home_about_bullets: payload.home_about_bullets.filter(Boolean),
    home_about_cta: payload.home_about_cta.trim(),
    testimonials_title: payload.testimonials_title.trim(),
  });
  if (!settingsResult.ok) return settingsResult;

  const supabase = await createClient();
  const { error: clearError } = await supabase
    .from("products")
    .update({ is_featured: false })
    .neq("id", "00000000-0000-0000-0000-000000000000");
  if (clearError) return { ok: false, error: "تعذر تحديث المنتجات المميزة" };

  if (payload.featuredProductIds.length > 0) {
    const { error } = await supabase
      .from("products")
      .update({ is_featured: true })
      .in("id", payload.featuredProductIds);
    if (error) return { ok: false, error: "تعذر تحديد المنتجات المميزة" };
  }

  revalidatePath("/admin/products");
  revalidateStore();
  return { ok: true };
}

export type AboutPayload = {
  about_title: string;
  about_paragraphs: string[];
  about_values: AboutValue[];
  about_cta_title: string;
  about_cta_text: string;
};

export async function saveAbout(payload: AboutPayload): Promise<ActionResult> {
  return patchSettings({
    about_title: payload.about_title.trim(),
    about_paragraphs: payload.about_paragraphs.map((p) => p.trim()).filter(Boolean),
    about_values: payload.about_values.filter((v) => v.title.trim() || v.text.trim()),
    about_cta_title: payload.about_cta_title.trim(),
    about_cta_text: payload.about_cta_text.trim(),
  });
}

// ================= الآراء =================

export async function saveTestimonial(formData: FormData): Promise<ActionResult> {
  const blocked = requireDb();
  if (blocked) return blocked;

  const id = String(formData.get("id") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const quote = String(formData.get("quote") ?? "").trim();
  const rating = Math.min(5, Math.max(1, Number(formData.get("rating") ?? 5) || 5));
  const isActive = String(formData.get("is_active") ?? "true") === "true";

  if (!name || !quote) return { ok: false, error: "الاسم والنص مطلوبان" };

  const supabase = await createClient();
  const { error } = id
    ? await supabase
        .from("testimonials")
        .update({ name, quote, rating, is_active: isActive })
        .eq("id", id)
    : await supabase.from("testimonials").insert({
        name,
        quote,
        rating,
        is_active: isActive,
        sort_order: Date.now() % 100000,
      });

  if (error) return { ok: false, error: "تعذر حفظ الرأي — شغّل 0004_cms.sql" };
  revalidatePath("/admin/testimonials");
  revalidatePath("/");
  return { ok: true };
}

export async function deleteTestimonial(id: string): Promise<ActionResult> {
  const blocked = requireDb();
  if (blocked) return blocked;
  const supabase = await createClient();
  const { error } = await supabase.from("testimonials").delete().eq("id", id);
  if (error) return { ok: false, error: "تعذر حذف الرأي" };
  revalidatePath("/admin/testimonials");
  revalidatePath("/");
  return { ok: true };
}
