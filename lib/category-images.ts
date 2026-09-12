import type { Category } from "@/lib/types";

/** 3:4 crop so all five homepage cards share the same framing. */
function unsplash(id: string): string {
  return `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&h=1200&q=80`;
}

/** Studio-style product shots: garment-centered, similar crop, dark/catalog mood. */
export const CATEGORY_FALLBACK_IMAGES = {
  tshirts: "/photos/hijra-card.jpg",
  hoodies: unsplash("photo-1499971442178-8c10fdf5f6ac"),
  uniforms: unsplash("photo-1579664531470-ac357f8f8e2b"),
  caps: unsplash("photo-1521369909029-2afed882baee"),
  polo: unsplash("photo-1625910513413-c23b8bb81cba"),
} as const;

type CategorySlug = keyof typeof CATEGORY_FALLBACK_IMAGES;

export function isImageSrc(value?: string | null): boolean {
  const v = value?.trim() ?? "";
  return v.startsWith("http://") || v.startsWith("https://") || v.startsWith("/");
}

export function categoryImageSrc(
  category: Pick<Category, "slug" | "icon" | "image_url">,
  productImage?: string | null
): string {
  if (isImageSrc(category.image_url)) return category.image_url!.trim();
  if (isImageSrc(category.icon)) return category.icon!.trim();
  if (category.slug in CATEGORY_FALLBACK_IMAGES) {
    return CATEGORY_FALLBACK_IMAGES[category.slug as CategorySlug];
  }
  if (isImageSrc(productImage)) return productImage!.trim();
  return "/placeholder-product.svg";
}
