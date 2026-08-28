export const STORE_NAME = "TWIST";

export const WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "";

export const CURRENCY = process.env.NEXT_PUBLIC_CURRENCY ?? "₪";

export function whatsappHref(number: string, text?: string): string | null {
  const n = number.replace(/[^\d]/g, "");
  if (!n) return null;
  const base = `https://wa.me/${n}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

export function formatPrice(value: number): string {
  const n = Number.isInteger(value)
    ? value.toString()
    : value.toFixed(2);
  return `${n} ${CURRENCY}`;
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("ar", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
