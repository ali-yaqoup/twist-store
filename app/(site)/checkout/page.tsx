"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/components/cart/CartProvider";
import { useSiteSettings } from "@/components/site/SiteContentProvider";
import { formatPrice } from "@/lib/config";
import { createOrder } from "./actions";

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart();
  const settings = useSiteSettings();
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    notes: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  function buildWhatsAppMessage(orderId: string): string {
    const lines: string[] = [
      `🧵 *طلب جديد من متجر ${settings.shop_name}*`,
      "",
      `👤 الاسم: ${form.name}`,
      `📞 الهاتف: ${form.phone}`,
      `📍 العنوان: ${form.address}`,
    ];
    if (form.notes.trim()) lines.push(`📝 ملاحظات: ${form.notes.trim()}`);
    lines.push("", "🛍 *تفاصيل الطلب:*");
    items.forEach((item, idx) => {
      const details = [
        item.size && `مقاس ${item.size}`,
        item.color && `لون ${item.color}`,
        item.serviceType && (item.serviceType === "embroidery" ? "تطريز" : "طباعة"),
      ]
        .filter(Boolean)
        .join(" / ");
      lines.push(
        `${idx + 1}. ${item.name} × ${item.quantity}${details ? ` (${details})` : ""} — ${formatPrice(item.price * item.quantity)}`
      );
      if (item.note) lines.push(`   ملاحظة: ${item.note}`);
      if (item.designUrl) lines.push(`   تصميم: ${item.designUrl}`);
    });
    lines.push("", `💰 *المجموع الكلي: ${formatPrice(total)}*`);
    lines.push(`🔖 رقم الطلب: ${orderId.slice(0, 8)}`);
    return lines.join("\n");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submitting) return;
    setError(null);
    setSubmitting(true);

    const result = await createOrder({
      customerName: form.name,
      customerPhone: form.phone,
      customerAddress: form.address,
      notes: form.notes,
      items: items.map((i) => ({
        productId: i.productId,
        quantity: i.quantity,
        size: i.size,
        color: i.color,
        serviceType: i.serviceType,
        note: i.note,
        designUrl: i.designUrl,
      })),
    });

    setSubmitting(false);

    if (!result.ok || !result.orderId) {
      setError(result.error ?? "حدث خطأ غير متوقع");
      return;
    }

    if (settings.whatsapp_number) {
      const message = buildWhatsAppMessage(result.orderId);
      const waUrl = `https://wa.me/${settings.whatsapp_number}?text=${encodeURIComponent(message)}`;
      window.open(waUrl, "_blank", "noopener,noreferrer");
    }

    clearCart();
    setDone(true);
  }

  if (done) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center sm:px-6">
        <span className="text-6xl">🎉</span>
        <h1 className="mt-6 text-3xl font-black text-stone-50">تم استلام طلبك!</h1>
        <p className="mt-4 leading-8 text-stone-400">
          حفظنا طلبك وفتحنا لك محادثة واتساب لتأكيده مع فريقنا.
          إذا ما انفتحت المحادثة تلقائياً، تواصل معنا مباشرة.
        </p>
        <button
          type="button"
          onClick={() => router.push("/products")}
          className="mt-8 rounded-full bg-brand px-8 py-3 font-extrabold text-black transition-colors hover:bg-brand-soft"
        >
          متابعة التسوق
        </button>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center sm:px-6">
        <h1 className="text-3xl font-black text-stone-50">السلة فارغة</h1>
        <p className="mt-4 text-stone-400">أضف منتجات للسلة قبل إتمام الطلب.</p>
        <Link
          href="/products"
          className="mt-8 inline-block rounded-full bg-brand px-8 py-3 font-extrabold text-black transition-colors hover:bg-brand-soft"
        >
          تصفح المنتجات
        </Link>
      </div>
    );
  }

  const inputClass =
    "w-full rounded-xl border border-white/10 bg-night px-4 py-3 text-sm text-stone-100 placeholder:text-stone-600 focus:border-brand focus:outline-none";

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-black text-stone-50 sm:text-4xl">إتمام الطلب</h1>
      <div className="mt-3 h-1 w-16 rounded-full bg-brand" />

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_320px]">
        <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl border border-white/10 bg-night-card p-6 sm:p-8">
          <div>
            <label htmlFor="name" className="mb-2 block text-sm font-bold text-stone-200">
              الاسم الكامل <span className="text-brand">*</span>
            </label>
            <input
              id="name"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="اسمك الثلاثي"
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="phone" className="mb-2 block text-sm font-bold text-stone-200">
              رقم الهاتف <span className="text-brand">*</span>
            </label>
            <input
              id="phone"
              required
              type="tel"
              dir="ltr"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="07XXXXXXXX"
              className={`${inputClass} text-right`}
            />
          </div>

          <div>
            <label htmlFor="address" className="mb-2 block text-sm font-bold text-stone-200">
              العنوان <span className="text-brand">*</span>
            </label>
            <input
              id="address"
              required
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              placeholder="المدينة، الحي، أقرب معلم"
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="notes" className="mb-2 block text-sm font-bold text-stone-200">
              ملاحظات <span className="font-normal text-stone-500">(اختياري)</span>
            </label>
            <textarea
              id="notes"
              rows={3}
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="أي تفاصيل إضافية عن طلبك…"
              className={inputClass}
            />
          </div>

          {error && (
            <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="glow-gold w-full rounded-full bg-brand py-4 text-base font-extrabold text-black transition-colors hover:bg-brand-soft disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "جارٍ إرسال الطلب…" : "تأكيد الطلب وإرساله عبر واتساب"}
          </button>
          <p className="text-center text-xs text-stone-500">
            بعد التأكيد سيُحفظ طلبك وتُفتح محادثة واتساب مع المحل لإتمام التفاصيل
          </p>
        </form>

        {/* ملخص */}
        <aside className="h-fit rounded-2xl border border-white/10 bg-night-card p-6 lg:sticky lg:top-24">
          <h2 className="text-lg font-black text-stone-100">طلبك</h2>
          <ul className="mt-4 space-y-3 border-b border-white/10 pb-4 text-sm">
            {items.map((item, i) => (
              <li key={i} className="flex justify-between gap-3 text-stone-300">
                <span className="line-clamp-1">
                  {item.name} × {item.quantity}
                </span>
                <span className="shrink-0 font-bold text-stone-100">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex items-center justify-between">
            <span className="font-bold text-stone-100">المجموع</span>
            <span className="text-2xl font-black text-brand">{formatPrice(total)}</span>
          </div>
        </aside>
      </div>
    </div>
  );
}
