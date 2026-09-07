"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin-auth";
import { SETTINGS_ID } from "@/lib/cms";
import {
  LIMITS,
  isUuid,
  sanitizeAppHref,
  sanitizeHttpUrl,
  sanitizeImageUrl,
  sanitizeText,
} from "@/lib/security";
import { createClient } from "@/lib/supabase/server";
import { storagePathFromPublicUrl } from "@/lib/upload";
import type { AboutValue, OrderStatus, ServiceType } from "@/lib/types";

export interface ActionResult {
  ok: boolean;
  error?: string;
}

const ORDER_STATUSES: OrderStatus[] = [
  "pending",
  "in_progress",
  "ready",
  "delivered",
  "cancelled",
];

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
  const blocked = await requireAdmin();
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
  const blocked = await requireAdmin();
  if (blocked) return blocked;

  const supabase = await createClient();
  const id = String(formData.get("id") ?? "");
  if (id && !isUuid(id)) return { ok: false, error: "معرّف غير صالح" };
  const name = sanitizeText(String(formData.get("name") ?? ""), LIMITS.name);
  const slugInput = sanitizeText(String(formData.get("slug") ?? ""), 80);
  const icon = sanitizeText(String(formData.get("icon") ?? ""), 16) || null;
  const imageUrl = sanitizeImageUrl(String(formData.get("image_url") ?? "")) || null;

  if (!name) return { ok: false, error: "اسم الفئة مطلوب" };
  const slug = slugInput ? slugify(slugInput) : slugify(name);

  const { error } = id
    ? await supabase.from("categories").update({ name, slug, icon, image_url: imageUrl }).eq("id", id)
    : await supabase.from("categories").insert({ name, slug, icon, image_url: imageUrl });

  if (error) {
    return {
      ok: false,
      error:
        error.code === "23505"
          ? "يوجد فئة بنفس المعرّف (slug)"
          : error.message?.includes("image_url")
            ? "تعذر حفظ صورة الفئة — شغّل supabase/migrations/0005_category_images.sql"
            : "تعذر حفظ الفئة",
    };
  }

  revalidatePath("/admin/categories");
  revalidateStore();
  return { ok: true };
}

export async function deleteCategory(id: string): Promise<ActionResult> {
  const blocked = await requireAdmin();
  if (blocked) return blocked;
  if (!isUuid(id)) return { ok: false, error: "معرّف غير صالح" };
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
  const blocked = await requireAdmin();
  if (blocked) return blocked;
  const name = sanitizeText(payload.name, LIMITS.productName);
  if (!name) return { ok: false, error: "اسم المنتج مطلوب" };
  if (
    !Number.isFinite(payload.price) ||
    payload.price < 0 ||
    payload.price > LIMITS.productPriceMax
  ) {
    return { ok: false, error: "السعر غير صالح" };
  }
  if (payload.id && !isUuid(payload.id)) return { ok: false, error: "معرّف غير صالح" };
  if (!["embroidery", "print", "both"].includes(payload.serviceType)) {
    return { ok: false, error: "نوع الخدمة غير صالح" };
  }
  const categoryId =
    payload.categoryId && isUuid(payload.categoryId) ? payload.categoryId : null;

  const supabase = await createClient();
  const row = {
    name,
    description: sanitizeText(payload.description, LIMITS.productDescription) || null,
    price: payload.price,
    category_id: categoryId,
    images: payload.images.map(sanitizeImageUrl).filter(Boolean).slice(0, LIMITS.productImages),
    sizes: payload.sizes
      .map((s) => sanitizeText(String(s), 40))
      .filter(Boolean)
      .slice(0, LIMITS.productOptions),
    colors: payload.colors
      .map((c) => sanitizeText(String(c), 40))
      .filter(Boolean)
      .slice(0, LIMITS.productOptions),
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
  const blocked = await requireAdmin();
  if (blocked) return blocked;
  if (!isUuid(id)) return { ok: false, error: "معرّف غير صالح" };
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
  const blocked = await requireAdmin();
  if (blocked) return blocked;
  if (!isUuid(orderId)) return { ok: false, error: "معرّف غير صالح" };
  if (!ORDER_STATUSES.includes(status)) {
    return { ok: false, error: "حالة الطلب غير صالحة" };
  }
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
  const blocked = await requireAdmin();
  if (blocked) return blocked;
  const supabase = await createClient();
  const safeUrl = sanitizeImageUrl(imageUrl);
  if (!safeUrl) return { ok: false, error: "رابط الصورة غير صالح" };
  const { error } = await supabase.from("gallery_images").insert({
    image_url: safeUrl,
    caption: sanitizeText(caption, LIMITS.caption) || null,
  });
  if (error) return { ok: false, error: "تعذر إضافة الصورة" };
  revalidatePath("/admin/gallery");
  revalidatePath("/");
  return { ok: true };
}

export async function deleteGalleryImage(id: string): Promise<ActionResult> {
  const blocked = await requireAdmin();
  if (blocked) return blocked;
  if (!isUuid(id)) return { ok: false, error: "معرّف غير صالح" };
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
  const blocked = await requireAdmin();
  if (blocked) return blocked;
  if (!isUuid(id)) return { ok: false, error: "معرّف غير صالح" };
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
  const blocked = await requireAdmin();
  if (blocked) return blocked;
  if (!isUuid(id)) return { ok: false, error: "معرّف غير صالح" };
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
  const blocked = await requireAdmin();
  if (blocked) return blocked;
  const supabase = await createClient();
  const { data: last } = await supabase
    .from("hero_slides")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  const safeUrl = sanitizeImageUrl(imageUrl);
  if (!safeUrl) return { ok: false, error: "رابط الصورة غير صالح" };

  const { error } = await supabase.from("hero_slides").insert({
    image_url: safeUrl,
    alt_text: sanitizeText(altText, LIMITS.caption) || null,
    sort_order: (last?.sort_order ?? -1) + 1,
    is_active: true,
  });
  if (error) return { ok: false, error: "تعذر إضافة صورة البانر — شغّل 0004_cms.sql" };
  revalidatePath("/admin/homepage");
  revalidatePath("/");
  return { ok: true };
}

export async function deleteHeroSlide(id: string): Promise<ActionResult> {
  const blocked = await requireAdmin();
  if (blocked) return blocked;
  if (!isUuid(id)) return { ok: false, error: "معرّف غير صالح" };
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
  const blocked = await requireAdmin();
  if (blocked) return blocked;
  if (!isUuid(id) || (direction !== "up" && direction !== "down")) {
    return { ok: false, error: "طلب غير صالح" };
  }
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
  const shopName = sanitizeText(payload.shop_name, LIMITS.shopName);
  if (!shopName) return { ok: false, error: "اسم المتجر مطلوب" };
  return patchSettings({
    shop_name: shopName,
    tagline: sanitizeText(payload.tagline, 120),
    logo_url: sanitizeImageUrl(payload.logo_url),
    whatsapp_number: payload.whatsapp_number.replace(/[^\d]/g, "").slice(0, 15),
    contact_phone: sanitizeText(payload.contact_phone, LIMITS.phone),
    address: sanitizeText(payload.address, LIMITS.address),
    email: sanitizeText(payload.email, 120),
    instagram_url: sanitizeHttpUrl(payload.instagram_url),
    facebook_url: sanitizeHttpUrl(payload.facebook_url),
    tiktok_url: sanitizeHttpUrl(payload.tiktok_url),
    footer_blurb: sanitizeText(payload.footer_blurb, 400),
    contact_title: sanitizeText(payload.contact_title, 80),
    contact_intro: sanitizeText(payload.contact_intro, 500),
    contact_whatsapp_label: sanitizeText(payload.contact_whatsapp_label, 80),
    contact_success_title: sanitizeText(payload.contact_success_title, 80),
    contact_success_text: sanitizeText(payload.contact_success_text, 300),
    products_title: sanitizeText(payload.products_title, 80),
    products_empty: sanitizeText(payload.products_empty, 200),
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
  const featuredIds = [
    ...new Set(payload.featuredProductIds.filter(isUuid)),
  ].slice(0, LIMITS.featuredProducts);

  const settingsResult = await patchSettings({
    hero_badge: sanitizeText(payload.hero_badge, LIMITS.cmsTitle),
    hero_title: sanitizeText(payload.hero_title, LIMITS.cmsTitle),
    hero_highlight: sanitizeText(payload.hero_highlight, LIMITS.cmsTitle),
    hero_subtitle: sanitizeText(payload.hero_subtitle, LIMITS.cmsText),
    hero_cta_label: sanitizeText(payload.hero_cta_label, LIMITS.cmsTitle),
    hero_cta_href: sanitizeAppHref(payload.hero_cta_href, "/products"),
    hero_secondary_cta_label: sanitizeText(payload.hero_secondary_cta_label, LIMITS.cmsTitle),
    hero_secondary_cta_href: sanitizeAppHref(payload.hero_secondary_cta_href, "/contact"),
    categories_title: sanitizeText(payload.categories_title, LIMITS.cmsTitle),
    featured_title: sanitizeText(payload.featured_title, LIMITS.cmsTitle),
    featured_subtitle: sanitizeText(payload.featured_subtitle, LIMITS.cmsText),
    featured_cta: sanitizeText(payload.featured_cta, LIMITS.cmsTitle),
    gallery_title: sanitizeText(payload.gallery_title, LIMITS.cmsTitle),
    gallery_subtitle: sanitizeText(payload.gallery_subtitle, LIMITS.cmsText),
    home_about_title: sanitizeText(payload.home_about_title, LIMITS.cmsTitle),
    home_about_text: sanitizeText(payload.home_about_text, LIMITS.cmsText),
    home_about_bullets: payload.home_about_bullets
      .map((b) => sanitizeText(b, 200))
      .filter(Boolean)
      .slice(0, 8),
    home_about_cta: sanitizeText(payload.home_about_cta, LIMITS.cmsTitle),
    testimonials_title: sanitizeText(payload.testimonials_title, LIMITS.cmsTitle),
  });
  if (!settingsResult.ok) return settingsResult;

  const supabase = await createClient();
  const { error: clearError } = await supabase
    .from("products")
    .update({ is_featured: false })
    .neq("id", "00000000-0000-0000-0000-000000000000");
  if (clearError) return { ok: false, error: "تعذر تحديث المنتجات المميزة" };

  if (featuredIds.length > 0) {
    const { error } = await supabase
      .from("products")
      .update({ is_featured: true })
      .in("id", featuredIds);
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
    about_title: sanitizeText(payload.about_title, LIMITS.cmsTitle),
    about_paragraphs: payload.about_paragraphs
      .map((p) => sanitizeText(p, LIMITS.cmsText))
      .filter(Boolean)
      .slice(0, 12),
    about_values: payload.about_values
      .map((v) => ({
        icon: sanitizeText(v.icon ?? "", 16),
        title: sanitizeText(v.title, LIMITS.cmsTitle),
        text: sanitizeText(v.text, LIMITS.cmsText),
      }))
      .filter((v) => v.title || v.text)
      .slice(0, 8),
    about_cta_title: sanitizeText(payload.about_cta_title, LIMITS.cmsTitle),
    about_cta_text: sanitizeText(payload.about_cta_text, LIMITS.cmsText),
  });
}

// ================= الآراء =================

export async function saveTestimonial(formData: FormData): Promise<ActionResult> {
  const blocked = await requireAdmin();
  if (blocked) return blocked;

  const id = String(formData.get("id") ?? "");
  if (id && !isUuid(id)) return { ok: false, error: "معرّف غير صالح" };
  const name = sanitizeText(String(formData.get("name") ?? ""), LIMITS.name);
  const quote = sanitizeText(String(formData.get("quote") ?? ""), LIMITS.testimonial);
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
  const blocked = await requireAdmin();
  if (blocked) return blocked;
  if (!isUuid(id)) return { ok: false, error: "معرّف غير صالح" };
  const supabase = await createClient();
  const { error } = await supabase.from("testimonials").delete().eq("id", id);
  if (error) return { ok: false, error: "تعذر حذف الرأي" };
  revalidatePath("/admin/testimonials");
  revalidatePath("/");
  return { ok: true };
}
