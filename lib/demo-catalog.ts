import { CATEGORY_FALLBACK_IMAGES } from "@/lib/category-images";
import type { Category, GalleryImage, HeroSlide, Product, Testimonial } from "@/lib/types";

const NOW = "2026-08-01T10:00:00.000Z";

function img(id: string, w = 900): string {
  return `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;
}

export const DEMO_CATEGORIES: Category[] = [
  { id: "cat-tshirts", name: "تيشيرتات", slug: "tshirts", icon: "👕", image_url: CATEGORY_FALLBACK_IMAGES.tshirts, created_at: NOW },
  { id: "cat-hoodies", name: "هوديز", slug: "hoodies", icon: "🧥", image_url: CATEGORY_FALLBACK_IMAGES.hoodies, created_at: NOW },
  { id: "cat-uniforms", name: "يونيفورم", slug: "uniforms", icon: "🥼", image_url: CATEGORY_FALLBACK_IMAGES.uniforms, created_at: NOW },
  { id: "cat-caps", name: "قبعات", slug: "caps", icon: "🧢", image_url: CATEGORY_FALLBACK_IMAGES.caps, created_at: NOW },
  { id: "cat-polo", name: "بولو", slug: "polo", icon: "👔", image_url: CATEGORY_FALLBACK_IMAGES.polo, created_at: NOW },
];

const cat = (slug: string) => {
  const found = DEMO_CATEGORIES.find((c) => c.slug === slug)!;
  return {
    category_id: found.id,
    categories: { id: found.id, name: found.name, slug: found.slug },
  };
};

export const DEMO_PRODUCTS: Product[] = [
  {
    id: "demo-tshirt-classic",
    name: "تيشيرت قطن كلاسيك",
    description:
      "تيشيرت قطن 100٪ بوزن متوسط ولمسة ناعمة. مثالي لتطريز الشعار على الصدر أو طباعة التصميم على الظهر. خامة تتحمّل الغسيل المتكرر دون بهتان.",
    price: 79,
    images: [
      img("photo-1521572163474-6864f9cf17ab"),
      img("photo-1562157873-818bc0726f68"),
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["أسود", "أبيض", "كحلي"],
    embroidery_or_print_type: "both",
    is_active: true,
    is_featured: true,
    created_at: NOW,
    ...cat("tshirts"),
  },
  {
    id: "demo-tshirt-black",
    name: "تيشيرت أسود أوفرسايز",
    description:
      "قصة واسعة عصرية بكتف ساقط. مثالي للطباعة DTF أو السلك سكرين على مساحة كبيرة. يظهر التصميم الذهبي والفاتح بشكل فاخر.",
    price: 89,
    images: [
      img("photo-1583743814966-8936f5b7be1a"),
      img("photo-1576566588028-4147f3842f27"),
    ],
    sizes: ["M", "L", "XL", "XXL"],
    colors: ["أسود", "رمادي"],
    embroidery_or_print_type: "print",
    is_active: true,
    is_featured: true,
    created_at: NOW,
    ...cat("tshirts"),
  },
  {
    id: "demo-tshirt-graphic",
    name: "تيشيرت طباعة فنية",
    description:
      "قطعة جاهزة لتطبيق تصميمك الفني على الصدر أو كامل الواجهة. طباعة عالية الدقة تثبت مع الغسيل.",
    price: 95,
    images: [
      img("photo-1576566588028-4147f3842f27"),
      img("photo-1523381210434-271e8be1f52b"),
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: ["أبيض", "أسود", "رمادي"],
    embroidery_or_print_type: "print",
    is_active: true,
    is_featured: true,
    created_at: NOW,
    ...cat("tshirts"),
  },
  {
    id: "demo-hoodie-winter",
    name: "هودي شتوي فاخر",
    description:
      "هودي ببطانة داخلية دافئة وجيب كنغر وقبعة مبطّنة. التطريز ثلاثي الأبعاد على الصدر يعطي نتيجة براند راقية للشركات والفرق.",
    price: 149,
    images: [
      img("photo-1556821840-3a63f95609a7"),
      img("photo-1620799140408-edc6dcb6d633"),
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["أسود", "كحلي", "رمادي"],
    embroidery_or_print_type: "embroidery",
    is_active: true,
    is_featured: true,
    created_at: NOW,
    ...cat("hoodies"),
  },
  {
    id: "demo-hoodie-light",
    name: "هودي خفيف",
    description:
      "هودي خفيف مناسب للربيع والخريف. يمكن تطريز الاسم أو طباعة شعار الفريق على الصدر والكم.",
    price: 129,
    images: [
      img("photo-1620799140408-edc6dcb6d633"),
      img("photo-1556821840-3a63f95609a7"),
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: ["أسود", "أبيض", "رمادي"],
    embroidery_or_print_type: "both",
    is_active: true,
    is_featured: true,
    created_at: NOW,
    ...cat("hoodies"),
  },
  {
    id: "demo-sweatshirt",
    name: "سويت شيرت رقبة دائرية",
    description:
      "سويت شيرت بدون قبعة، قصة مريحة. مساحة واسعة للطباعة على الصدر والظهر — خيار الفرق والفعاليات.",
    price: 119,
    images: [
      img("photo-1489980557514-251d61e3eeb6"),
      img("photo-1523381210434-271e8be1f52b"),
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["أسود", "رمادي", "كحلي"],
    embroidery_or_print_type: "print",
    is_active: true,
    is_featured: true,
    created_at: NOW,
    ...cat("hoodies"),
  },
  {
    id: "demo-uniform-shirt",
    name: "قميص يونيفورم شركات",
    description:
      "قميص عملي بأكمام طويلة وجيب صدر. جاهز لتطريز شعار الشركة بالخيط الذهبي أو اللون الذي تختاره. مثالي للموظفين والاستقبال.",
    price: 99,
    images: [
      img("photo-1596755094514-f87e34085b2c"),
      img("photo-1603252109303-2751441dd157"),
    ],
    sizes: ["M", "L", "XL", "XXL"],
    colors: ["كحلي", "أسود", "أبيض"],
    embroidery_or_print_type: "embroidery",
    is_active: true,
    is_featured: true,
    created_at: NOW,
    ...cat("uniforms"),
  },
  {
    id: "demo-uniform-jacket",
    name: "جاكيت يونيفورم خفيف",
    description:
      "جاكيت خفيف للفرق الميدانية والشركات. مساحة واسعة على الظهر والصدر للتطريز أو الطباعة. متين ويليق بالمظهر الرسمي.",
    price: 179,
    images: [
      img("photo-1594938298603-c8148c4dae35"),
      img("photo-1603252109303-2751441dd157"),
    ],
    sizes: ["M", "L", "XL", "XXL"],
    colors: ["أسود", "كحلي"],
    embroidery_or_print_type: "both",
    is_active: true,
    is_featured: true,
    created_at: NOW,
    ...cat("uniforms"),
  },
  {
    id: "demo-uniform-set",
    name: "طقم يونيفورم فريق",
    description:
      "طقم متكامل (قميص + بنطلون تنسيق) لفرق العمل. نطرّز الشعار بشكل موحّد على كل القطع لنفس الهوية البصرية.",
    price: 199,
    images: [
      img("photo-1507679799987-c73779587ccf"),
      img("photo-1594938298603-c8148c4dae35"),
    ],
    sizes: ["M", "L", "XL", "XXL"],
    colors: ["كحلي", "أسود"],
    embroidery_or_print_type: "embroidery",
    is_active: true,
    is_featured: true,
    created_at: NOW,
    ...cat("uniforms"),
  },
  {
    id: "demo-polo-premium",
    name: "بولو قطن فاخر",
    description:
      "بولو بياقة كلاسيكية وأزرار ناعمة. القطعة الأكثر طلباً للفرق واليونيفورم اليومي. تطريز الشعار على الصدر يظهر بوضوح وأناقة.",
    price: 89,
    images: [
      img("photo-1618354691373-d851c5c3a990"),
      img("photo-1586363104862-3a5e2ab60d99"),
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["أسود", "أبيض", "كحلي", "أحمر"],
    embroidery_or_print_type: "both",
    is_active: true,
    is_featured: true,
    created_at: NOW,
    ...cat("polo"),
  },
  {
    id: "demo-cap-snapback",
    name: "قبعة سناب باك",
    description:
      "قبعة قابلة للتعديل مع مساحة أمامية مثالية للتطريز ثلاثي الأبعاد. خيار الفرق، المتاجر، والهدايا الترويجية.",
    price: 59,
    images: [
      img("photo-1588850561407-ed78c282e89b"),
      img("photo-1521369909029-2afed882baee"),
    ],
    sizes: ["حر"],
    colors: ["أسود", "كحلي", "أبيض"],
    embroidery_or_print_type: "embroidery",
    is_active: true,
    is_featured: true,
    created_at: NOW,
    ...cat("caps"),
  },
  {
    id: "demo-cap-3d",
    name: "كاب بيسبول تطريز 3D",
    description:
      "كاب كلاسيكي بتطريز بارز على الواجهة. ننفّذ شعارك أو اسمك بغرز كثيفة تبرز من بعيد.",
    price: 69,
    images: [
      img("photo-1521369909029-2afed882baee"),
      img("photo-1588850561407-ed78c282e89b"),
    ],
    sizes: ["حر"],
    colors: ["أسود", "ذهبي", "كحلي"],
    embroidery_or_print_type: "embroidery",
    is_active: true,
    is_featured: true,
    created_at: NOW,
    ...cat("caps"),
  },
];

export const DEMO_GALLERY: GalleryImage[] = [
  {
    id: "gal-1",
    image_url: img("photo-1503342217505-b0a15ec3261c"),
    caption: "طباعة تيشيرتات لفعالية شبابية",
    created_at: NOW,
  },
  {
    id: "gal-2",
    image_url: img("photo-1452860606245-08befc0ff44b"),
    caption: "تطريز يدوي وتفاصيل دقيقة على القماش",
    created_at: NOW,
  },
  {
    id: "gal-3",
    image_url: img("photo-1556821840-3a63f95609a7"),
    caption: "هودي أسود بتطريز شعار على الصدر",
    created_at: NOW,
  },
  {
    id: "gal-4",
    image_url: img("photo-1618354691373-d851c5c3a990"),
    caption: "بولو شركات بهوية موحّدة",
    created_at: NOW,
  },
  {
    id: "gal-5",
    image_url: img("photo-1521369909029-2afed882baee"),
    caption: "قبعات مطرّزة لفريق كامل",
    created_at: NOW,
  },
  {
    id: "gal-6",
    image_url: img("photo-1489980557514-251d61e3eeb6"),
    caption: "تشكيلة ألوان جاهزة للطباعة والتطريز",
    created_at: NOW,
  },
];

function heroImg(id: string): string {
  return `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1920&q=80`;
}

export const DEMO_HERO_SLIDES: HeroSlide[] = [
  {
    id: "hero-1",
    image_url: heroImg("photo-1503342217505-b0a15ec3261c"),
    alt_text: "طباعة تيشيرتات",
    sort_order: 0,
    is_active: true,
    created_at: NOW,
  },
  {
    id: "hero-2",
    image_url: heroImg("photo-1556821840-3a63f95609a7"),
    alt_text: "هودي بتطريز فاخر",
    sort_order: 1,
    is_active: true,
    created_at: NOW,
  },
  {
    id: "hero-3",
    image_url: heroImg("photo-1523381210434-271e8be1f52b"),
    alt_text: "تشكيلة ملابس جاهزة للتخصيص",
    sort_order: 2,
    is_active: true,
    created_at: NOW,
  },
  {
    id: "hero-4",
    image_url: heroImg("photo-1618354691373-d851c5c3a990"),
    alt_text: "بولو شركات",
    sort_order: 3,
    is_active: true,
    created_at: NOW,
  },
];

export const DEMO_TESTIMONIALS: Testimonial[] = [
  {
    id: "t-1",
    name: "أحمد س.",
    quote:
      "طلبت يونيفورم كامل لفريق العمل — التطريز نظيف والخامة ممتازة. تعامل راقي وسرعة بالتسليم.",
    rating: 5,
    sort_order: 0,
    is_active: true,
    created_at: NOW,
  },
  {
    id: "t-2",
    name: "ليان م.",
    quote: "صممت هودي خاص فيني وطلع أحلى من المتوقع بكثير. الألوان ثابتة حتى بعد الغسيل.",
    rating: 5,
    sort_order: 1,
    is_active: true,
    created_at: NOW,
  },
  {
    id: "t-3",
    name: "شركة نواة",
    quote: "شريكنا الدائم لطباعة تيشيرتات الفعاليات. جودة ثابتة والتزام بالمواعيد بكل مرة.",
    rating: 5,
    sort_order: 2,
    is_active: true,
    created_at: NOW,
  },
];

export function filterDemoProducts(options?: {
  categorySlug?: string;
  minPrice?: number;
  maxPrice?: number;
  limit?: number;
  featured?: boolean;
}): Product[] {
  let list = [...DEMO_PRODUCTS];
  if (options?.featured) {
    list = list.filter((p) => p.is_featured);
  }
  if (options?.categorySlug) {
    list = list.filter((p) => p.categories?.slug === options.categorySlug);
  }
  if (options?.minPrice !== undefined) {
    list = list.filter((p) => p.price >= options.minPrice!);
  }
  if (options?.maxPrice !== undefined) {
    list = list.filter((p) => p.price <= options.maxPrice!);
  }
  if (options?.limit) list = list.slice(0, options.limit);
  return list;
}
