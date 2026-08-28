"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/components/cart/CartProvider";
import WishlistButton from "@/components/site/WishlistButton";
import { formatPrice } from "@/lib/config";
import type { Product } from "@/lib/types";
import { uploadPublicImage } from "@/lib/upload";

export default function ProductDetails({ product }: { product: Product }) {
  const { addItem } = useCart();

  const images = product.images.length > 0 ? product.images : [null];
  const [activeImage, setActiveImage] = useState(0);
  const [size, setSize] = useState<string | null>(product.sizes[0] ?? null);
  const [color, setColor] = useState<string | null>(product.colors[0] ?? null);
  const [serviceType, setServiceType] = useState<"embroidery" | "print" | null>(
    product.embroidery_or_print_type === "both"
      ? "embroidery"
      : product.embroidery_or_print_type
  );
  const [note, setNote] = useState("");
  const [designUrl, setDesignUrl] = useState<string | null>(null);
  const [designName, setDesignName] = useState<string | null>(null);
  const [designError, setDesignError] = useState<string | null>(null);
  const [uploadingDesign, setUploadingDesign] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  function handleAdd() {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0] ?? null,
      quantity,
      size,
      color,
      serviceType,
      note: note.trim() || null,
      designUrl,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="grid gap-10 lg:grid-cols-2">
      {/* معرض الصور */}
      <div>
        <div className="relative aspect-square overflow-hidden rounded-3xl border border-white/10 bg-night-card">
          <Image
            src={images[activeImage] ?? "/placeholder-product.svg"}
            alt={product.name}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
            priority
          />
          <div className="absolute top-4 start-4 z-10">
            <WishlistButton product={product} />
          </div>
        </div>
        {images.length > 1 && (
          <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
            {images.map((img, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActiveImage(i)}
                className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 transition-colors ${
                  activeImage === i ? "border-brand" : "border-white/10 hover:border-white/30"
                }`}
              >
                <Image
                  src={img ?? "/placeholder-product.svg"}
                  alt={`${product.name} ${i + 1}`}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* التفاصيل */}
      <div>
        {product.categories && (
          <Link
            href={`/products?category=${product.categories.slug}`}
            className="text-sm text-brand hover:underline"
          >
            {product.categories.name}
          </Link>
        )}
        <h1 className="mt-2 text-3xl font-black text-stone-50 sm:text-4xl">
          {product.name}
        </h1>
        <p className="mt-4 text-3xl font-extrabold text-brand">
          {formatPrice(product.price)}
        </p>

        {product.description && (
          <p className="mt-5 leading-8 text-stone-400">{product.description}</p>
        )}

        <div className="mt-8 space-y-6">
          {/* المقاس */}
          {product.sizes.length > 0 && (
            <div>
              <h3 className="mb-2.5 text-sm font-bold text-stone-200">المقاس</h3>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSize(s)}
                    className={`min-w-12 rounded-lg border px-4 py-2 text-sm font-bold transition-colors ${
                      size === s
                        ? "border-brand bg-brand text-black"
                        : "border-white/15 text-stone-300 hover:border-brand hover:text-brand"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* اللون */}
          {product.colors.length > 0 && (
            <div>
              <h3 className="mb-2.5 text-sm font-bold text-stone-200">اللون</h3>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    className={`rounded-lg border px-4 py-2 text-sm font-bold transition-colors ${
                      color === c
                        ? "border-brand bg-brand text-black"
                        : "border-white/15 text-stone-300 hover:border-brand hover:text-brand"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* نوع الخدمة */}
          {product.embroidery_or_print_type === "both" ? (
            <div>
              <h3 className="mb-2.5 text-sm font-bold text-stone-200">نوع الخدمة</h3>
              <div className="flex gap-2">
                {(
                  [
                    ["embroidery", "تطريز"],
                    ["print", "طباعة"],
                  ] as const
                ).map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setServiceType(value)}
                    className={`rounded-lg border px-5 py-2 text-sm font-bold transition-colors ${
                      serviceType === value
                        ? "border-brand bg-brand text-black"
                        : "border-white/15 text-stone-300 hover:border-brand hover:text-brand"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-sm text-stone-400">
              نوع الخدمة:{" "}
              <span className="font-bold text-brand">
                {product.embroidery_or_print_type === "embroidery" ? "تطريز" : "طباعة"}
              </span>
            </p>
          )}

          {/* ملاحظة / تصميم خاص */}
          <div>
            <h3 className="mb-2.5 text-sm font-bold text-stone-200">
              ملاحظة أو وصف تصميمك الخاص <span className="font-normal text-stone-500">(اختياري)</span>
            </h3>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              placeholder="مثال: أريد تطريز اسم «TWIST» على الصدر بخيط ذهبي…"
              className="w-full rounded-xl border border-white/10 bg-night px-4 py-3 text-sm text-stone-100 placeholder:text-stone-600 focus:border-brand focus:outline-none"
            />
            <label className="mt-3 flex cursor-pointer flex-col items-start gap-2 rounded-xl border border-dashed border-white/15 px-4 py-3 text-sm text-stone-400 transition-colors hover:border-brand hover:text-brand">
              <span className="font-bold">
                {uploadingDesign
                  ? "جارٍ رفع التصميم…"
                  : designName
                    ? `🎨 ${designName}`
                    : "رفع ملف تصميم (اختياري)"}
              </span>
              <span className="text-xs text-stone-500">JPG أو PNG أو WEBP — حتى 5 ميغابايت</span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                hidden
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  e.target.value = "";
                  if (!file) return;
                  setDesignError(null);
                  setUploadingDesign(true);
                  const result = await uploadPublicImage("designs", file);
                  setUploadingDesign(false);
                  if ("error" in result) {
                    setDesignError(result.error);
                    return;
                  }
                  setDesignUrl(result.url);
                  setDesignName(file.name);
                }}
              />
            </label>
            {designUrl && (
              <button
                type="button"
                onClick={() => {
                  setDesignUrl(null);
                  setDesignName(null);
                }}
                className="mt-2 text-xs text-red-400 hover:underline"
              >
                إزالة ملف التصميم
              </button>
            )}
            {designError && <p className="mt-2 text-xs text-red-400">{designError}</p>}
          </div>

          {/* الكمية + إضافة */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center rounded-full border border-white/15">
              <button
                type="button"
                aria-label="زيادة"
                onClick={() => setQuantity((q) => q + 1)}
                className="px-4 py-2.5 text-lg font-bold text-stone-200 hover:text-brand"
              >
                +
              </button>
              <span className="min-w-8 text-center font-bold text-stone-100">
                {quantity}
              </span>
              <button
                type="button"
                aria-label="إنقاص"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="px-4 py-2.5 text-lg font-bold text-stone-200 hover:text-brand"
              >
                −
              </button>
            </div>
            <button
              type="button"
              onClick={handleAdd}
              disabled={uploadingDesign}
              className={`glow-gold flex-1 rounded-full px-8 py-3.5 text-base font-extrabold transition-all sm:flex-none disabled:opacity-60 ${
                added
                  ? "bg-green-500 text-black"
                  : "bg-brand text-black hover:bg-brand-soft"
              }`}
            >
              {added ? "أُضيف للسلة ✓" : "أضف للسلة"}
            </button>
            <WishlistButton product={product} variant="label" />
            {added && (
              <Link href="/cart" className="text-sm font-bold text-brand underline-offset-4 hover:underline">
                الذهاب للسلة ←
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
