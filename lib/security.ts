/** حدود وتحقق مشترك — آمن للاستيراد من العميل والخادم */

export const LIMITS = {
  name: 80,
  phone: 30,
  address: 200,
  notes: 500,
  message: 2000,
  itemNote: 300,
  quantity: 20,
  cartLines: 30,
  caption: 200,
  shopName: 80,
  productName: 120,
  productDescription: 4000,
  productPriceMax: 999999,
  productImages: 12,
  productOptions: 20,
  featuredProducts: 24,
  cmsTitle: 120,
  cmsText: 2000,
  testimonial: 500,
} as const;

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isUuid(value: string): boolean {
  return UUID_RE.test(value);
}

const CONTROL_CHARS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;

export function sanitizeText(value: string, max: number): string {
  return value.replace(CONTROL_CHARS, "").trim().slice(0, max);
}

export function normalizePhone(raw: string): string | null {
  const trimmed = sanitizeText(raw, LIMITS.phone);
  if (!trimmed) return null;
  if (!/^[0-9+\s()-]+$/.test(trimmed)) return null;
  const digits = trimmed.replace(/\D/g, "");
  if (digits.length < 8 || digits.length > 15) return null;
  return trimmed;
}

export function sanitizeHttpUrl(raw: string): string {
  const v = raw.trim();
  if (!v) return "";
  try {
    const u = new URL(v);
    if (u.protocol !== "https:" && u.protocol !== "http:") return "";
    return u.toString();
  } catch {
    return "";
  }
}

export function sanitizeImageUrl(raw: string): string {
  const v = raw.trim();
  if (!v) return "";
  if (v.startsWith("/") && !v.startsWith("//") && !v.includes("\\")) return v;
  return sanitizeHttpUrl(v);
}

export function sanitizeAppHref(raw: string, fallback: string): string {
  const v = sanitizeText(raw, 300) || fallback;
  if (v.startsWith("/") && !v.startsWith("//") && !v.includes("\\") && !v.includes("://")) {
    return v;
  }
  return sanitizeHttpUrl(v) || fallback;
}

export function isAllowedDesignUrl(url: string | null): boolean {
  if (!url) return true;
  try {
    const u = new URL(url);
    if (u.protocol !== "https:" && u.protocol !== "http:") return false;
    const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!base) return false;
    const allowed = new URL(base);
    if (u.host !== allowed.host) return false;
    return u.pathname.includes("/storage/v1/object/public/designs/");
  } catch {
    return false;
  }
}

export function isSafeHttpUrl(url: string | null | undefined): boolean {
  return Boolean(url && sanitizeHttpUrl(url));
}
