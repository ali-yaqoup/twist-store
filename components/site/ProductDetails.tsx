"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useState } from "react";
import { useCart } from "@/components/cart/CartProvider";
import WishlistButton from "@/components/site/WishlistButton";
import { formatPrice } from "@/lib/config";
import { useIosTap } from "@/lib/ios-tap";
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

  const handleAdd = useCallback(() => {
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
  }, [addItem, color, designUrl, note, product, quantity, serviceType, size]);

  const addTap = useIosTap(handleAdd);
  const decQtyTap = useIosTap(() => setQuantity((q) => Math.max(1, q - 1)));
  const incQtyTap = useIosTap(() => setQuantity((q) => q + 1));

  return (
    <div className="grid gap-8 lg:grid-cols-2 lg:gap-10">
      {/* معرض الصور */}
      <div>
        <div className="relative aspect-[4/5] overflow-hidden rounded-xl border border-brand/16 bg-night-card sm:aspect-square">
          <Image
            src={images[activeImage] ?? "/placeholder-product.svg"}
            alt={product.name}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover transition-transform duration-700 hover:scale-105"
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
                className={`relative h-[4.5rem] w-[4.5rem] shrink-0 overflow-hidden rounded-xl border-2 transition-colors sm:h-20 sm:w-20 ${
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
      <div className="min-w-0">
        {product.categories && (
          <Link
            href={`/products?category=${product.categories.slug}`}
            className="text-sm text-brand hover:underline"
          >
            {product.categories.name}
          </Link>
        )}
        <h1 className="font-display mt-2 text-2xl font-extrabold text-stone-50 sm:text-3xl lg:text-4xl">
          {product.name}
        </h1>
        <p className="font-display mt-4 text-2xl font-extrabold text-brand sm:text-3xl">
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
                    className={`min-h-11 min-w-11 touch-manipulation rounded-lg border px-4 py-2 text-sm font-bold transition-colors active:border-brand active:text-brand ${
                      size === s
                        ? "border-brand bg-brand text-black"
                        : "border-brand/20 text-stone-300 hover:border-brand hover:text-brand"
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
                    className={`min-h-11 touch-manipulation rounded-lg border px-4 py-2 text-sm font-bold transition-colors active:border-brand active:text-brand ${
                      color === c
                        ? "border-brand bg-brand text-black"
                        : "border-brand/20 text-stone-300 hover:border-brand hover:text-brand"
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
              <div className="flex flex-wrap gap-2">
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
                    className={`min-h-11 rounded-lg border px-5 py-2 text-sm font-bold transition-colors ${
                      serviceType === value
                        ? "border-brand bg-brand text-black"
                        : "border-brand/20 text-stone-300 hover:border-brand hover:text-brand"
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
              className="input-luxe"
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
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <div className="flex items-center self-start rounded-full border border-brand/20">
              <button
                type="button"
                aria-label="إنقاص"
                className="flex h-11 w-11 touch-manipulation items-center justify-center text-lg font-bold text-stone-200 active:text-brand"
                {...decQtyTap}
              >
                −
              </button>
              <span className="min-w-8 text-center font-bold text-stone-100">
                {quantity}
              </span>
              <button
                type="button"
                aria-label="زيادة"
                className="flex h-11 w-11 touch-manipulation items-center justify-center text-lg font-bold text-stone-200 active:text-brand"
                {...incQtyTap}
              >
                +
              </button>
            </div>
            <button
              type="button"
              disabled={uploadingDesign}
              className={`glow-gold min-h-11 w-full flex-1 touch-manipulation rounded-full px-8 py-3.5 text-base font-extrabold transition-all disabled:opacity-60 sm:w-auto ${
                added
                  ? "bg-green-500 text-black"
                  : "bg-brand text-black hover:bg-brand-soft hover:shadow-[0_0_28px_rgba(245,196,0,0.38)] active:scale-[0.98]"
              }`}
              {...addTap}
            >
              {added ? "أُضيف للسلة ✓" : "أضف للسلة"}
            </button>
            <WishlistButton product={product} variant="label" />
            {added && (
              <Link href="/cart" className="flex min-h-11 items-center text-sm font-bold text-brand underline-offset-4 hover:underline">
                الذهاب للسلة ←
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
