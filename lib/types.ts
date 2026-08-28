export type ServiceType = "embroidery" | "print" | "both";

export type OrderStatus =
  | "pending"
  | "in_progress"
  | "ready"
  | "delivered"
  | "cancelled";

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category_id: string | null;
  images: string[];
  sizes: string[];
  colors: string[];
  embroidery_or_print_type: ServiceType;
  is_active: boolean;
  is_featured: boolean;
  created_at: string;
  categories?: Pick<Category, "id" | "name" | "slug"> | null;
}

export interface AboutValue {
  icon: string;
  title: string;
  text: string;
}

export interface HeroSlide {
  id: string;
  image_url: string;
  alt_text: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

export interface SiteSettings {
  id: string;
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
  about_title: string;
  about_paragraphs: string[];
  about_values: AboutValue[];
  about_cta_title: string;
  about_cta_text: string;
  contact_title: string;
  contact_intro: string;
  contact_whatsapp_label: string;
  contact_success_title: string;
  contact_success_text: string;
  products_title: string;
  products_empty: string;
  updated_at: string;
}

export interface Testimonial {
  id: string;
  name: string;
  quote: string;
  rating: number;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

export interface Order {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  notes: string | null;
  status: OrderStatus;
  total_price: number;
  created_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string | null;
  quantity: number;
  selected_size: string | null;
  selected_color: string | null;
  service_type: "embroidery" | "print" | null;
  note: string | null;
  design_url: string | null;
  price_at_order: number;
  created_at: string;
  products?: Pick<Product, "id" | "name" | "images"> | null;
}

export interface GalleryImage {
  id: string;
  image_url: string;
  caption: string | null;
  created_at: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  phone: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  image: string | null;
  quantity: number;
  size: string | null;
  color: string | null;
  serviceType: "embroidery" | "print" | null;
  note: string | null;
  designUrl: string | null;
}

export interface WishlistItem {
  productId: string;
  name: string;
  price: number;
  image: string | null;
  sizes: string[];
  colors: string[];
  embroidery_or_print_type: ServiceType;
}

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "قيد الانتظار",
  in_progress: "قيد التنفيذ",
  ready: "جاهز",
  delivered: "تم التسليم",
  cancelled: "ملغي",
};

export const SERVICE_TYPE_LABELS: Record<ServiceType, string> = {
  embroidery: "تطريز",
  print: "طباعة",
  both: "تطريز أو طباعة",
};

export const DEFAULT_SIZES = ["S", "M", "L", "XL", "XXL"];
export const DEFAULT_COLORS = ["أسود", "أبيض", "كحلي", "رمادي", "أحمر", "ذهبي"];
