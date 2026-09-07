/** Tags used by unstable_cache + updateTag from admin mutations */
export const CACHE_TAGS = {
  settings: "settings",
  products: "products",
  categories: "categories",
  gallery: "gallery",
  hero: "hero",
  testimonials: "testimonials",
} as const;

/** Default ISR / data-cache window for public catalog (seconds) */
export const STORE_REVALIDATE_SECONDS = 120;
