"use server";

import { randomUUID } from "crypto";
import { DEMO_PRODUCTS } from "@/lib/demo-catalog";
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

export async function createOrder(input: CheckoutInput): Promise<CheckoutResult> {
  const name = input.customerName.trim();
  const phone = input.customerPhone.trim();
  const address = input.customerAddress.trim();

  if (!name || !phone || !address) {
    return { ok: false, error: "الرجاء تعبئة الاسم ورقم الهاتف والعنوان" };
  }
  if (input.items.length === 0) {
    return { ok: false, error: "السلة فارغة" };
  }

  if (!isSupabaseConfigured()) {
    const priceMap = new Map(DEMO_PRODUCTS.map((p) => [p.id, Number(p.price)]));
    const validItems = input.items.filter((i) => priceMap.has(i.productId));
    if (validItems.length === 0) {
      return { ok: false, error: "منتجات السلة لم تعد متوفرة" };
    }
    const total = validItems.reduce(
      (sum, i) => sum + (priceMap.get(i.productId) ?? 0) * Math.max(1, i.quantity),
      0
    );
    return { ok: true, orderId: randomUUID(), total };
  }

  const supabase = await createClient();

  // جلب الأسعار الحقيقية من قاعدة البيانات (لا نثق بأسعار المتصفح)
  const productIds = [...new Set(input.items.map((i) => i.productId))];
  const { data: products, error: productsError } = await supabase
    .from("products")
    .select("id, name, price")
    .in("id", productIds)
    .eq("is_active", true);

  if (productsError || !products || products.length === 0) {
    return { ok: false, error: "تعذر التحقق من المنتجات، حاول مجدداً" };
  }

  const priceMap = new Map(products.map((p) => [p.id, Number(p.price)]));
  const validItems = input.items.filter((i) => priceMap.has(i.productId));
  if (validItems.length === 0) {
    return { ok: false, error: "منتجات السلة لم تعد متوفرة" };
  }

  const total = validItems.reduce(
    (sum, i) => sum + (priceMap.get(i.productId) ?? 0) * Math.max(1, i.quantity),
    0
  );

  // إدراج بدون .select() حتى لا نحتاج صلاحية قراءة للطلبات
  const orderId = randomUUID();

  const { error: orderError } = await supabase.from("orders").insert({
    id: orderId,
    customer_name: name,
    customer_phone: phone,
    customer_address: address,
    notes: input.notes.trim() || null,
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
      quantity: Math.max(1, i.quantity),
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
