import type { AboutValue, SiteSettings } from "@/lib/types";

export const SETTINGS_ID = "default";

const ABOUT_VALUES: AboutValue[] = [
  {
    icon: "🧵",
    title: "حرفية بكل غرزة",
    text: "التطريز عنا فن. ماكينات حديثة وأيادي خبيرة تتعامل مع كل قطعة كأنها الوحيدة.",
  },
  {
    icon: "🎨",
    title: "طباعة تدوم",
    text: "أحبار عالية الجودة وتقنيات طباعة تقاوم الغسيل والاستخدام اليومي دون بهتان.",
  },
  {
    icon: "⚡",
    title: "سرعة والتزام",
    text: "مواعيد واضحة من أول يوم، وتسليم بالوقت المتفق عليه — لأن وقتك يهمنا.",
  },
  {
    icon: "💎",
    title: "خامات بريميوم",
    text: "نختار الأقمشة والخامات بعناية لتحصل على قطعة تفتخر بلبسها وإهدائها.",
  },
];

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  id: SETTINGS_ID,
  shop_name: "TWIST",
  tagline: "تطريز & طباعة",
  logo_url: "",
  whatsapp_number: "",
  contact_phone: "",
  address: "",
  email: "",
  instagram_url: "",
  facebook_url: "",
  tiktok_url: "",
  footer_blurb:
    "براند متخصص بالتطريز والطباعة على الملابس. جودة بريميوم، تصاميم مخصصة، وتنفيذ يليق باسمك وشغلك.",
  hero_badge: "تطريز & طباعة بجودة بريميوم",
  hero_title: "اللبس تصميمك…",
  hero_highlight: "بلمسة TWIST",
  hero_subtitle:
    "تيشيرتات، هوديز، يونيفورم وقبعات — نطرّز ونطبع فكرتك بأدق التفاصيل وبخامات تدوم. لأن مظهرك يستاهل الأفضل.",
  hero_cta_label: "تسوّق الآن",
  hero_cta_href: "/products",
  hero_secondary_cta_label: "اطلب تصميم خاص",
  hero_secondary_cta_href: "/contact",
  categories_title: "تسوّق حسب الفئة",
  featured_title: "منتجات مميزة",
  featured_subtitle:
    "أحدث إضافاتنا — قطع مختارة بعناية جاهزة للتخصيص باسمك أو شعارك",
  featured_cta: "عرض كل المنتجات",
  gallery_title: "من أعمالنا",
  gallery_subtitle: "لقطات حقيقية من تنفيذنا — تطريز وطباعة بأعلى دقة",
  home_about_title: "ليش TWIST؟",
  home_about_text:
    "نحنا مش بس مطبعة — نحنا ورشة إبداع. من اختيار الخامة، لتنفيذ التطريز غرزة بغرزة، لطباعة تثبت بوجه الغسيل والزمن. كل قطعة بتطلع من عنا لازم تليق باسمنا واسمك.",
  home_about_bullets: [
    "خامات مختارة بعناية",
    "تطريز وطباعة بأحدث المعدات",
    "تصاميم مخصصة حسب طلبك",
    "تسليم سريع والتزام بالمواعيد",
  ],
  home_about_cta: "اعرف أكثر عنا",
  testimonials_title: "شو حكوا عنا",
  about_title: "قصة TWIST",
  about_paragraphs: [
    "بدأنا TWIST من شغف بسيط: نحوّل الأفكار لقطع ملابس تحكي عن أصحابها. اليوم صرنا وجهة لكل من يريد تيشيرت بلمسة شخصية، هودي بشعار فريقه، أو يونيفورم يعكس هوية شركته.",
    "نجمع بين حرفية التطريز التقليدي ودقة الطباعة الحديثة، ونشتغل مع الأفراد والشركات والفرق — من قطعة واحدة لمئات القطع، بنفس المستوى من الاهتمام والجودة.",
  ],
  about_values: ABOUT_VALUES,
  about_cta_title: "عندك فكرة؟ خلينا ننفذها سوا",
  about_cta_text: "سواء كانت قطعة واحدة أو طلبية كاملة لشركتك — احكيلنا شو ببالك",
  contact_title: "تواصل معنا",
  contact_intro:
    "عندك استفسار، طلب خاص، أو مشروع لشركتك؟ اترك رسالتك وسنرد عليك بأقرب وقت — أو راسلنا مباشرة على واتساب.",
  contact_whatsapp_label: "واتساب مباشر",
  contact_success_title: "وصلتنا رسالتك!",
  contact_success_text: "سنتواصل معك بأقرب وقت ممكن.",
  products_title: "كل المنتجات",
  products_empty: "لا توجد منتجات مطابقة للفلاتر الحالية",
  updated_at: "2026-08-01T10:00:00.000Z",
};

export function mergeSettings(row?: Partial<SiteSettings> | null): SiteSettings {
  const merged: SiteSettings = {
    ...DEFAULT_SITE_SETTINGS,
    ...(row ?? {}),
    id: SETTINGS_ID,
  };

  if (!Array.isArray(merged.home_about_bullets)) {
    merged.home_about_bullets = DEFAULT_SITE_SETTINGS.home_about_bullets;
  }
  if (!Array.isArray(merged.about_paragraphs)) {
    merged.about_paragraphs = DEFAULT_SITE_SETTINGS.about_paragraphs;
  }
  if (!Array.isArray(merged.about_values)) {
    merged.about_values = DEFAULT_SITE_SETTINGS.about_values;
  }

  merged.logo_url = merged.logo_url ?? "";
  merged.whatsapp_number =
    merged.whatsapp_number || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "";

  return merged;
}
