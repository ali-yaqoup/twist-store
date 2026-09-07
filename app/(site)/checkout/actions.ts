"use server";

import { randomUUID } from "crypto";
import { DEMO_PRODUCTS } from "@/lib/demo-catalog";
import { clientKey, rateLimitOk } from "@/lib/rate-limit";
import {
  LIMITS,
  isAllowedDesignUrl,
  normalizePhone,
  sanitizeText,
} from "@/lib/security";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export interface CheckoutItemInput {
  productId: string;
  quantity: number;
  size: string | null;
  color: string | null;
  serviceType: "embroidery" | "print" | null;
  note: string | null;
  designUrl: string | null;
}

export interface CheckoutInput {
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  notes: string;
  items: CheckoutItemInput[];
}

export interface CheckoutResult {
  ok: boolean;
  orderId?: string;
  total?: number;
  error?: string;
}

function clampQty(n: number): number {
  return Math.min(LIMITS.quantity, Math.max(1, Math.floor(Number(n) || 0)));
}

export async function createOrder(input: CheckoutInput): Promise<CheckoutResult> {
  const key = await clientKey("checkout");
  if (!rateLimitOk(key, 8, 15 * 60 * 1000)) {
    return { ok: false, error: "طلبات كثيرة. حاول بعد قليل." };
  }

  const name = sanitizeText(input.customerName, LIMITS.name);
  const phone = normalizePhone(input.customerPhone);
  const address = sanitizeText(input.customerAddress, LIMITS.address);
  const notes = sanitizeText(input.notes ?? "", LIMITS.notes);

  if (!name || name.length < 2 || !phone || !address || address.length < 5) {
    return { ok: false, error: "الرجاء تعبئة الاسم ورقم الهاتف والعنوان بشكل صحيح" };
  }
  if (!Array.isArray(input.items) || input.items.length === 0) {
    return { ok: false, error: "السلة فارغة" };
  }
  if (input.items.length > LIMITS.cartLines) {
    return { ok: false, error: "عدد المنتجات في الطلب أكبر من المسموح" };
  }

  const rawItems = input.items.slice(0, LIMITS.cartLines).map((i) => ({
    productId: String(i.productId ?? "").slice(0, 80),
    quantity: clampQty(i.quantity),
    size: i.size ? sanitizeText(String(i.size), 40) : null,
    color: i.color ? sanitizeText(String(i.color), 40) : null,
    serviceType: i.serviceType === "embroidery" || i.serviceType === "print" ? i.serviceType : null,
    note: i.note ? sanitizeText(String(i.note), LIMITS.itemNote) : null,
    designUrl: i.designUrl && isAllowedDesignUrl(i.designUrl) ? i.designUrl : null,
  }));

  if (!isSupabaseConfigured()) {
    const priceMap = new Map(DEMO_PRODUCTS.map((p) => [p.id, Number(p.price)]));
    const validItems = rawItems.filter((i) => priceMap.has(i.productId));
    if (validItems.length === 0) {
      return { ok: false, error: "منتجات السلة لم تعد متوفرة" };
    }
    const total = validItems.reduce(
      (sum, i) => sum + (priceMap.get(i.productId) ?? 0) * i.quantity,
      0
    );
    return { ok: true, orderId: randomUUID(), total };
  }

  const supabase = await createClient();

  const productIds = [...new Set(rawItems.map((i) => i.productId))];
  const { data: products, error: productsError } = await supabase
    .from("products")
    .select("id, name, price")
    .in("id", productIds)
    .eq("is_active", true);

  if (productsError || !products || products.length === 0) {
    return { ok: false, error: "تعذر التحقق من المنتجات، حاول مجدداً" };
  }

  const priceMap = new Map(products.map((p) => [p.id, Number(p.price)]));
  const validItems = rawItems.filter((i) => priceMap.has(i.productId));
  if (validItems.length === 0) {
    return { ok: false, error: "منتجات السلة لم تعد متوفرة" };
  }

  const total = validItems.reduce(
    (sum, i) => sum + (priceMap.get(i.productId) ?? 0) * i.quantity,
    0
  );

  const orderId = randomUUID();

  const { error: orderError } = await supabase.from("orders").insert({
    id: orderId,
    customer_name: name,
    customer_phone: phone,
    customer_address: address,
    notes: notes || null,
    status: "pending",
    total_price: total,
  });

  if (orderError) {
    return { ok: false, error: "تعذر حفظ الطلب، حاول مجدداً" };
  }

  const { error: itemsError } = await supabase.from("order_items").insert(
    validItems.map((i) => ({
      order_id: orderId,
      product_id: i.productId,
      quantity: i.quantity,
      selected_size: i.size,
      selected_color: i.color,
      service_type: i.serviceType,
      note: i.note,
      design_url: i.designUrl,
      price_at_order: priceMap.get(i.productId) ?? 0,
    }))
  );

  if (itemsError) {
    return { ok: false, error: "تعذر حفظ تفاصيل الطلب، حاول مجدداً" };
  }

  return { ok: true, orderId, total };
}
