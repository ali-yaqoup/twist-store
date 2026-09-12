import type { Category, GalleryImage, HeroSlide, Product } from "@/lib/types";

export const PHOTOS = {
  hijraCard: "/photos/hijra-card.jpg",
  hijraFront: "/photos/hijra-front.jpg",
  hijraSet: "/photos/hijra-set.jpg",
  hijraSetBack: "/photos/hijra-set-back.jpg",
  hijraBackDetail: "/photos/hijra-back-detail.jpg",
  hijraBacks: "/photos/hijra-backs.jpg",
  watananCard: "/photos/watanan-card.jpg",
  watananFront: "/photos/watanan-front.jpg",
  watananPortrait: "/photos/watanan-portrait.jpg",
  watananColors: "/photos/watanan-colors.jpg",
  blightnmCard: "/photos/blightnm-card.jpg",
  blightnmLook: "/photos/blightnm-look.jpg",
  qalandiyaCard: "/photos/qalandiya-card.jpg",
  qalandiyaBack: "/photos/qalandiya-back.jpg",
} as const;

export const QALANDIYA_ID = "local-tshirt-qalandiya";
export const DEMO_QALANDIYA_ID = "demo-tshirt-qalandiya";

const NOW = "2026-09-13T00:00:00.000Z";
const SIZES = ["S", "M", "L", "XL", "XXL"];

export type ProductPatch = Pick<
  Product,
  | "name"
  | "description"
  | "price"
  | "images"
  | "sizes"
  | "colors"
  | "embroidery_or_print_type"
  | "is_featured"
>;

export const HIJRA_PATCH: ProductPatch = {
  name: "تيشيرت هجرة",
  description:
    "تيشيرت قطن بتطريز «هجرة» على الصدر وطباعة فنية على الظهر — طائرة، حقيبة وسفر. متوفر بالأسود والبيج والخمري.",
  price: 95,
  images: [
    PHOTOS.hijraCard,
    PHOTOS.hijraFront,
    PHOTOS.hijraSet,
    PHOTOS.hijraSetBack,
    PHOTOS.hijraBackDetail,
    PHOTOS.hijraBacks,
  ],
  sizes: SIZES,
  colors: ["خمري", "أسود", "بيج"],
  embroidery_or_print_type: "both",
  is_featured: true,
};

export const WATANAN_PATCH: ProductPatch = {
  name: "تيشيرت WATANAN",
  description:
    "تيشيرت قطن بتطريز بارز لكلمة WATANAN على الصدر. قصة مريحة وخامة ناعمة — متوفر بالأسود والأخضر والبيج.",
  price: 89,
  images: [PHOTOS.watananCard, PHOTOS.watananFront, PHOTOS.watananPortrait, PHOTOS.watananColors],
  sizes: SIZES,
  colors: ["أسود", "أخضر", "بيج"],
  embroidery_or_print_type: "embroidery",
  is_featured: true,
};

export const BLIGHTNM_PATCH: ProductPatch = {
  name: "تيشيرت براتنهم",
  description:
    "تيشيرت أسود بتطريز «براتنهم» وBLTNTM على الصدر. قطعة واضحة الهوية، مناسبة للبس اليومي وللهدايا.",
  price: 89,
  images: [PHOTOS.blightnmCard, PHOTOS.blightnmLook],
  sizes: SIZES,
  colors: ["أسود"],
  embroidery_or_print_type: "embroidery",
  is_featured: true,
};

export const QALANDIYA_PATCH: ProductPatch = {
  name: "تيشيرت قلنديا",
  description:
    "تيشيرت بيج بطبعة ظهر فنية لقلنديا — قطار، ساعة وبرج، مع توقيع TWISTED. طباعة عالية الدقة تثبت مع الغسيل.",
  price: 95,
  images: [PHOTOS.qalandiyaCard, PHOTOS.qalandiyaBack, PHOTOS.blightnmLook],
  sizes: SIZES,
  colors: ["بيج"],
  embroidery_or_print_type: "print",
  is_featured: true,
};

const PATCH_BY_NAME: Record<string, ProductPatch> = {
  "تيشيرت قطن كلاسيك": HIJRA_PATCH,
  "تيشيرت هجرة": HIJRA_PATCH,
  "تيشيرت أسود أوفرسايز": WATANAN_PATCH,
  "تيشيرت WATANAN": WATANAN_PATCH,
  "تيشيرت طباعة فنية": BLIGHTNM_PATCH,
  "تيشيرت براتنهم": BLIGHTNM_PATCH,
  "تيشيرت قلنديا": QALANDIYA_PATCH,
};

const FEATURED_ORDER = [
  HIJRA_PATCH.name,
  WATANAN_PATCH.name,
  BLIGHTNM_PATCH.name,
  QALANDIYA_PATCH.name,
];

export const STOREFRONT_HERO: HeroSlide[] = [
  {
    id: "hero-hijra",
    image_url: "/photos/hero-1-tall.jpg",
    wide_image_url: "/photos/hero-1-wide.jpg",
    alt_text: "تشكيلة تيشيرت هجرة",
    sort_order: 0,
    is_active: true,
    created_at: NOW,
  },
  {
    id: "hero-hijra-set",
    image_url: "/photos/hero-2-tall.jpg",
    wide_image_url: "/photos/hero-2-wide.jpg",
    alt_text: "تيشيرت هجرة — تطريز وطباعة ظهر",
    sort_order: 1,
    is_active: true,
    created_at: NOW,
  },
  {
    id: "hero-watanan",
    image_url: "/photos/hero-3-tall.jpg",
    wide_image_url: "/photos/hero-3-wide.jpg",
    alt_text: "تطريز WATANAN",
    sort_order: 2,
    is_active: true,
    created_at: NOW,
  },
  {
    id: "hero-prints",
    image_url: "/photos/hero-4-tall.jpg",
    wide_image_url: "/photos/hero-4-wide.jpg",
    alt_text: "طباعة فنية على ظهر التيشيرت",
    sort_order: 3,
    is_active: true,
    created_at: NOW,
  },
];

export const STOREFRONT_GALLERY: GalleryImage[] = [
  {
    id: "gal-hijra",
    image_url: "/photos/gal-hijra.jpg",
    caption: "تطريز هجرة — تشكيلة أسود، بيج وخمري",
    created_at: NOW,
  },
  {
    id: "gal-hijra-back",
    image_url: "/photos/gal-hijra-back.jpg",
    caption: "طباعة ظهر هجرة — سفر وطائرة",
    created_at: NOW,
  },
  {
    id: "gal-watanan",
    image_url: "/photos/gal-watanan.jpg",
    caption: "تطريز WATANAN على الصدر",
    created_at: NOW,
  },
  {
    id: "gal-qalandiya",
    image_url: "/photos/gal-qalandiya.jpg",
    caption: "طباعة قلنديا على الظهر",
    created_at: NOW,
  },
  {
    id: "gal-blightnm",
    image_url: "/photos/gal-blightnm.jpg",
    caption: "تطريز براتنهم إلى جانب طباعة ظهر",
    created_at: NOW,
  },
  {
    id: "gal-set",
    image_url: "/photos/gal-set.jpg",
    caption: "من تنفيذنا — تطريز، طباعة وتغليف",
    created_at: NOW,
  },
];

function tshirtRef(products: Product[]): Pick<Category, "id" | "name" | "slug"> {
  const fromProduct = products.find((p) => p.categories?.slug === "tshirts")?.categories;
  if (fromProduct) return fromProduct;
  return { id: "cat-tshirts", name: "تيشيرتات", slug: "tshirts" };
}

function isQalandiya(product: Product): boolean {
  return (
    product.id === QALANDIYA_ID ||
    product.id === DEMO_QALANDIYA_ID ||
    product.name.includes("قلنديا")
  );
}

export function makeQalandiyaProduct(products: Product[]): Product {
  const tshirts = tshirtRef(products);
  return {
    id: QALANDIYA_ID,
    category_id: tshirts.id,
    categories: tshirts,
    is_active: true,
    created_at: NOW,
    ...QALANDIYA_PATCH,
  };
}

export function applyStorefrontCategories(categories: Category[]): Category[] {
  return categories.map((category) =>
    category.slug === "tshirts"
      ? { ...category, image_url: PHOTOS.hijraCard }
      : category
  );
}

export function applyStorefrontProducts(products: Product[]): Product[] {
  let hasQalandiya = false;
  const next = products.map((product) => {
    if (isQalandiya(product)) {
      hasQalandiya = true;
      return { ...product, ...QALANDIYA_PATCH };
    }
    const patch = PATCH_BY_NAME[product.name];
    if (patch) return { ...product, ...patch };
    return { ...product, is_featured: false };
  });

  if (!hasQalandiya) next.push(makeQalandiyaProduct(products));

  return next.sort((a, b) => {
    const ai = FEATURED_ORDER.indexOf(a.name);
    const bi = FEATURED_ORDER.indexOf(b.name);
    if (ai === -1 && bi === -1) return 0;
    if (ai === -1) return 1;
    if (bi === -1) return -1;
    return ai - bi;
  });
}

export function applyStorefrontProduct(product: Product | null, id: string): Product | null {
  if (id === QALANDIYA_ID || id === DEMO_QALANDIYA_ID) {
    return product ? { ...product, ...QALANDIYA_PATCH } : makeQalandiyaProduct([]);
  }
  if (!product) return null;
  if (isQalandiya(product)) return { ...product, ...QALANDIYA_PATCH };
  const patch = PATCH_BY_NAME[product.name];
  return patch ? { ...product, ...patch } : product;
}

export function storefrontHeroSlides(): HeroSlide[] {
  return STOREFRONT_HERO;
}

export function storefrontGallery(limit?: number | null): GalleryImage[] {
  return limit ? STOREFRONT_GALLERY.slice(0, limit) : STOREFRONT_GALLERY;
}
