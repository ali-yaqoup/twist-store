import { createClient } from "@/lib/supabase/server";
import { mergeSettings } from "@/lib/cms";
import {
  DEMO_CATEGORIES,
  DEMO_GALLERY,
  DEMO_HERO_SLIDES,
  DEMO_PRODUCTS,
  DEMO_TESTIMONIALS,
  filterDemoProducts,
} from "@/lib/demo-catalog";
import { isSupabaseConfigured } from "@/lib/supabase/config";
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
    // Env is set: never fall back to the demo catalog (empty is honest).
    return [];
  }
}

function asProduct(row: Product): Product {
  return { ...row, is_featured: Boolean(row.is_featured) };
}

export async function getCategories(): Promise<Category[]> {
  const live = await fromSupabase(async () => {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("created_at", { ascending: true });
    if (error) throw error;
    return (data ?? []) as Category[];
  });
  return live !== null ? live : DEMO_CATEGORIES;
}

export async function getProducts(options?: {
  categorySlug?: string;
  minPrice?: number;
  maxPrice?: number;
  limit?: number;
  featured?: boolean;
}): Promise<Product[]> {
  const live = await fromSupabase(async () => {
    const supabase = await createClient();
    let query = supabase
      .from("products")
      .select("*, categories(id, name, slug)")
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (options?.featured) query = query.eq("is_featured", true);
    if (options?.minPrice !== undefined) {
      query = query.gte("price", options.minPrice);
    }
    if (options?.maxPrice !== undefined) {
      query = query.lte("price", options.maxPrice);
    }

    const { data, error } = await query;
    if (error) throw error;
    let products = ((data ?? []) as Product[]).map(asProduct);
    if (options?.categorySlug) {
      products = products.filter((p) => p.categories?.slug === options.categorySlug);
    }
    if (options?.limit) products = products.slice(0, options.limit);
    return products;
  });

  return live !== null ? live : filterDemoProducts(options);
}

export async function getFeaturedProducts(limit = 8): Promise<Product[]> {
  const featured = await fromSupabase(async () => {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("products")
      .select("*, categories(id, name, slug)")
      .eq("is_active", true)
      .eq("is_featured", true)
      .order("created_at", { ascending: false })
      .limit(limit);
    if (error) throw error;
    return ((data ?? []) as Product[]).map(asProduct);
  });

  if (featured && featured.length > 0) return featured;
  if (featured !== null) return getProducts({ limit });
  const demoFeatured = filterDemoProducts({ featured: true, limit });
  return demoFeatured.length > 0 ? demoFeatured : filterDemoProducts({ limit });
}

export async function getProductById(id: string): Promise<Product | null> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
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
      return data ? asProduct(data as Product) : null;
    } catch (err) {
      console.error("Supabase product lookup failed", err);
      return null;
    }
  }
  const demo = DEMO_PRODUCTS.find((p) => p.id === id);
  return demo ? asProduct(demo) : null;
}

export async function getGalleryImages(limit?: number): Promise<GalleryImage[]> {
  const live = await fromSupabase(async () => {
    const supabase = await createClient();
    let query = supabase
      .from("gallery_images")
      .select("*")
      .order("created_at", { ascending: false });
    if (limit) query = query.limit(limit);
    const { data, error } = await query;
    if (error) throw error;
    return (data ?? []) as GalleryImage[];
  });

  if (live !== null) return live;
  return limit ? DEMO_GALLERY.slice(0, limit) : DEMO_GALLERY;
}

export async function getHeroSlides(): Promise<HeroSlide[]> {
  const live = await fromSupabase(async () => {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("hero_slides")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });
    if (error) throw error;
    return (data ?? []) as HeroSlide[];
  });
  return live !== null ? live : DEMO_HERO_SLIDES;
}

export async function getTestimonials(): Promise<Testimonial[]> {
  const live = await fromSupabase(async () => {
    const supabase = await createClient();
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
}

export async function getSiteSettings(): Promise<SiteSettings> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from("site_settings")
        .select("*")
        .eq("id", "default")
        .maybeSingle();
      if (error) {
        console.error("Supabase site settings failed", error);
        return mergeSettings();
      }
      if (data) return mergeSettings(data as Partial<SiteSettings>);
    } catch (err) {
      console.error("Supabase site settings failed", err);
    }
  }
  return mergeSettings();
}
