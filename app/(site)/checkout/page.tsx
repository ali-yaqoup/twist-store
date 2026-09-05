"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/components/cart/CartProvider";
import CheckoutSteps from "@/components/site/CheckoutSteps";
import { formatPrice } from "@/lib/config";
import { createOrder } from "./actions";

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart();
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
  const [orderRef, setOrderRef] = useState<string | null>(null);

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

    setOrderRef(result.orderId.slice(0, 8));
    clearCart();
    setDone(true);
  }

  if (done) {
    return (
      <div className="section-container px-4 py-16 text-center sm:py-24">
        <CheckoutSteps current={3} />
        <span className="font-display text-5xl font-extrabold text-brand">✓</span>
        <h1 className="font-display mt-6 text-3xl font-extrabold text-stone-50">تم استلام طلبك!</h1>
        <p className="mt-4 leading-8 text-stone-400">
          وصل طلبك للمحل مباشرة. بنتواصل معك قريب لتأكيد التفاصيل والتوصيل.
        </p>
        {orderRef && (
          <p className="mt-3 text-sm text-stone-500">
            رقم الطلب: <span className="font-bold tracking-wide text-brand" dir="ltr">{orderRef}</span>
          </p>
        )}
        <div className="mt-8 flex flex-col items-center gap-3">
          <button
            type="button"
            onClick={() => router.push("/products")}
            className="btn-gold glow-gold w-full max-w-sm"
          >
            متابعة التسوق
          </button>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center sm:px-6">
        <h1 className="font-display text-3xl font-extrabold text-stone-50">السلة فارغة</h1>
        <p className="mt-4 text-stone-400">أضف منتجات للسلة قبل إتمام الطلب.</p>
        <Link
          href="/products"
          className="btn-gold mt-8"
        >
          تصفح المنتجات
        </Link>
      </div>
    );
  }

  const inputClass = "input-luxe";

  return (
    <div className="section-container py-8 sm:py-12">
      <h1 className="font-display heading-ar text-2xl font-extrabold text-stone-50 sm:text-3xl lg:text-4xl">إتمام الطلب</h1>
      <div className="mt-3 h-px w-12 bg-gradient-to-l from-transparent via-brand to-brand sm:w-16" />
      <CheckoutSteps current={2} />

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_320px]">
        <form onSubmit={handleSubmit} className="card-luxe space-y-5 p-4 sm:p-6 md:p-8">
          <div>
            <label htmlFor="name" className="mb-2 block text-sm font-bold text-stone-200">
              الاسم الكامل <span className="text-brand">*</span>
            </label>
            <input
              id="name"
              required
              value={form.name}
              autoComplete="name"
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
              autoComplete="tel"
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
              autoComplete="street-address"
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
            className="btn-gold glow-gold w-full touch-manipulation py-3.5 text-sm disabled:cursor-not-allowed disabled:opacity-60 sm:py-4 sm:text-base"
          >
            {submitting ? "جارٍ إرسال الطلب…" : "تأكيد الطلب"}
          </button>
          <p className="text-center text-xs text-stone-500">
            بعد التأكيد يوصل طلبك مباشرة للمحل، ونتواصل معك على رقمك
          </p>
        </form>

        {/* ملخص */}
        <aside className="card-luxe h-fit p-5 sm:p-6 lg:sticky lg:top-24">
          <h2 className="font-display text-lg font-extrabold text-stone-100">طلبك</h2>
          <ul className="mt-4 space-y-3 border-b border-brand/15 pb-4 text-sm">
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
            <span className="font-display text-2xl font-extrabold text-brand">{formatPrice(total)}</span>
          </div>
        </aside>
      </div>
    </div>
  );
}
