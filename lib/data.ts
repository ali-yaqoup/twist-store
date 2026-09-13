import { unstable_cache } from "next/cache";
import { cache } from "react";
import { CATEGORY_FALLBACK_IMAGES, categoryImageSrc, isImageSrc } from "@/lib/category-images";
import { CACHE_TAGS, STORE_REVALIDATE_SECONDS } from "@/lib/cache-tags";
import { mergeSettings } from "@/lib/cms";
import {
  DEMO_CATEGORIES,
  DEMO_PRODUCTS,
  DEMO_TESTIMONIALS,
} from "@/lib/demo-catalog";
import {
  applyStorefrontCategories,
  applyStorefrontProduct,
  applyStorefrontProducts,
  DEMO_QALANDIYA_ID,
  QALANDIYA_ID,
  storefrontGallery,
  storefrontHeroSlides,
} from "@/lib/storefront-photos";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createPublicClient } from "@/lib/supabase/public";
import type {
  Category,
  GalleryImage,
  HeroSlide,
  Product,
  SiteSettings,
  Testimonial,
} from "@/lib/types";

export { isSupabaseConfigured };

async function fromSupabase<T>(fn: () => Promise<T[]>): Promise<T[] | null> {
  if (!isSupabaseConfigured()) return null;
  try {
    return await fn();
  } catch (err) {
    console.error("Supabase query failed", err);
    return [];
  }
}

function asProduct(row: Product): Product {
  return { ...row, is_featured: Boolean(row.is_featured) };
}

type ProductQueryOptions = {
  categorySlug?: string;
  minPrice?: number;
  maxPrice?: number;
  limit?: number;
  featured?: boolean;
};

function productsCacheKey(options?: ProductQueryOptions): string {
  return JSON.stringify({
    categorySlug: options?.categorySlug ?? null,
    minPrice: options?.minPrice ?? null,
    maxPrice: options?.maxPrice ?? null,
    limit: options?.limit ?? null,
    featured: options?.featured ?? null,
  });
}

async function firstProductImageByCategoryId(
  categories: Category[]
): Promise<Map<string, string>> {
  const map = new Map<string, string>();
  const needsLookup = categories.filter(
    (c) =>
      !isImageSrc(c.image_url) &&
      !isImageSrc(c.icon) &&
      !(c.slug in CATEGORY_FALLBACK_IMAGES)
  );
  if (needsLookup.length === 0) return map;

  const live = await fromSupabase(async () => {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("products")
      .select("category_id, images")
      .eq("is_active", true)
      .not("category_id", "is", null);
    if (error) throw error;
    return data ?? [];
  });

  const rows =
    live !== null
      ? live
      : DEMO_PRODUCTS.map((p) => ({
          category_id: p.category_id,
          images: p.images,
        }));

  for (const row of rows) {
    const id = row.category_id as string | null;
    const img = Array.isArray(row.images) ? row.images[0] : null;
    if (id && typeof img === "string" && img && !map.has(id)) {
      map.set(id, img);
    }
  }
  return map;
}

const loadCategories = unstable_cache(
  async (): Promise<Category[]> => {
    const live = await fromSupabase(async () => {
      const supabase = createPublicClient();
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("created_at", { ascending: true });
      if (error) throw error;
      return (data ?? []) as Category[];
    });
    const categories = applyStorefrontCategories(live !== null ? live : DEMO_CATEGORIES);
    const productImages = await firstProductImageByCategoryId(categories);
    return categories.map((category) => ({
      ...category,
      image_url: categoryImageSrc(category, productImages.get(category.id) ?? null),
    }));
  },
  ["categories-v4"],
  { revalidate: STORE_REVALIDATE_SECONDS, tags: [CACHE_TAGS.categories, CACHE_TAGS.products] }
);

const loadProducts = unstable_cache(
  async (key: string): Promise<Product[]> => {
    const options = JSON.parse(key) as ProductQueryOptions;
    const live = await fromSupabase(async () => {
      const supabase = createPublicClient();
      const query = supabase
        .from("products")
        .select("*, categories(id, name, slug)")
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      const { data, error } = await query;
      if (error) throw error;
      return ((data ?? []) as Product[]).map(asProduct);
    });

    let products = applyStorefrontProducts(live !== null ? live : [...DEMO_PRODUCTS]);
    if (options.featured) products = products.filter((p) => p.is_featured);
    if (options.categorySlug) {
      products = products.filter((p) => p.categories?.slug === options.categorySlug);
    }
    if (options.minPrice != null) {
      products = products.filter((p) => p.price >= options.minPrice!);
    }
    if (options.maxPrice != null) {
      products = products.filter((p) => p.price <= options.maxPrice!);
    }
    if (options.limit) products = products.slice(0, options.limit);
    return products;
  },
  ["products-list-v5"],
  { revalidate: STORE_REVALIDATE_SECONDS, tags: [CACHE_TAGS.products] }
);

const loadFeaturedProducts = unstable_cache(
  async (limit: number): Promise<Product[]> =>
    loadProducts(productsCacheKey({ featured: true, limit })),
  ["featured-products-v5"],
  { revalidate: STORE_REVALIDATE_SECONDS, tags: [CACHE_TAGS.products] }
);

const loadProductById = unstable_cache(
  async (id: string): Promise<Product | null> => {
    if (id === QALANDIYA_ID || id === DEMO_QALANDIYA_ID) {
      return applyStorefrontProduct(null, id);
    }
    if (isSupabaseConfigured()) {
      try {
        const supabase = createPublicClient();
        const { data, error } = await supabase
          .from("products")
          .select("*, categories(id, name, slug)")
          .eq("id", id)
          .eq("is_active", true)
          .maybeSingle();
        if (error) {
          console.error("Supabase product lookup failed", error);
          return null;
        }
        return applyStorefrontProduct(data ? asProduct(data as Product) : null, id);
      } catch (err) {
        console.error("Supabase product lookup failed", err);
        return applyStorefrontProduct(null, id);
      }
    }
    const demo = DEMO_PRODUCTS.find((p) => p.id === id) ?? null;
    return applyStorefrontProduct(demo ? asProduct(demo) : null, id);
  },
  ["product-by-id-v5"],
  { revalidate: STORE_REVALIDATE_SECONDS, tags: [CACHE_TAGS.products] }
);

const loadGalleryImages = unstable_cache(
  async (limit: number | null): Promise<GalleryImage[]> => storefrontGallery(limit),
  ["gallery-v5"],
  { revalidate: STORE_REVALIDATE_SECONDS, tags: [CACHE_TAGS.gallery] }
);

const loadHeroSlides = unstable_cache(
  async (): Promise<HeroSlide[]> => {
    const live = await fromSupabase(async () => {
      const supabase = createPublicClient();
      const { data, error } = await supabase
        .from("hero_slides")
        .select("*")
        .eq("is_active", true)
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: true });
      if (error) throw error;
      return (data ?? []) as HeroSlide[];
    });

    if (live !== null) {
      // Prefer DB (admin-managed). Fall back to local storefront set only if DB empty.
      return live.length > 0 ? live : storefrontHeroSlides();
    }
    return storefrontHeroSlides();
  },
  ["hero-slides-v6"],
  { revalidate: STORE_REVALIDATE_SECONDS, tags: [CACHE_TAGS.hero] }
);

const loadTestimonials = unstable_cache(
  async (): Promise<Testimonial[]> => {
    const live = await fromSupabase(async () => {
      const supabase = createPublicClient();
      const { data, error } = await supabase
        .from("testimonials")
        .select("*")
        .eq("is_active", true)
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: true });
      if (error) throw error;
      return (data ?? []) as Testimonial[];
    });
    return live !== null ? live : DEMO_TESTIMONIALS;
  },
  ["testimonials-v1"],
  { revalidate: STORE_REVALIDATE_SECONDS, tags: [CACHE_TAGS.testimonials] }
);

const loadSiteSettingsRow = unstable_cache(
  async (): Promise<Partial<SiteSettings> | null> => {
    if (!isSupabaseConfigured()) return null;
    try {
      const supabase = createPublicClient();
      const { data, error } = await supabase
        .from("site_settings")
        .select("*")
        .eq("id", "default")
        .maybeSingle();
      if (error) {
        console.error("Supabase site settings failed", error);
        return null;
      }
      return (data as Partial<SiteSettings> | null) ?? null;
    } catch (err) {
      console.error("Supabase site settings failed", err);
      return null;
    }
  },
  ["site-settings-v1"],
  { revalidate: STORE_REVALIDATE_SECONDS, tags: [CACHE_TAGS.settings] }
);

/** Request-level dedupe + cross-request data cache */
export const getCategories = cache(async (): Promise<Category[]> => loadCategories());

export const getProducts = cache(async (options?: ProductQueryOptions): Promise<Product[]> =>
  loadProducts(productsCacheKey(options))
);

export const getFeaturedProducts = cache(async (limit = 8): Promise<Product[]> =>
  loadFeaturedProducts(limit)
);

export const getProductById = cache(async (id: string): Promise<Product | null> =>
  loadProductById(id)
);

export const getGalleryImages = cache(async (limit?: number): Promise<GalleryImage[]> =>
  loadGalleryImages(limit ?? null)
);

export const getHeroSlides = cache(async (): Promise<HeroSlide[]> => loadHeroSlides());

export const getTestimonials = cache(async (): Promise<Testimonial[]> => loadTestimonials());

export const getSiteSettings = cache(async (): Promise<SiteSettings> => {
  const row = await loadSiteSettingsRow();
  return mergeSettings(row);
});
