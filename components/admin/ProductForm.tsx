"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { saveProduct } from "@/app/admin/actions";
import { uploadPublicImage } from "@/lib/upload";
import {
  DEFAULT_COLORS,
  DEFAULT_SIZES,
  type Category,
  type Product,
  type ServiceType,
} from "@/lib/types";

const inputClass =
  "w-full rounded-xl border border-white/10 bg-night px-4 py-3 text-sm text-stone-100 placeholder:text-stone-600 focus:border-brand focus:outline-none";

export default function ProductForm({
  product,
  categories,
}: {
  product?: Product;
  categories: Category[];
}) {
  const router = useRouter();
  const [name, setName] = useState(product?.name ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [price, setPrice] = useState(product ? String(product.price) : "");
  const [categoryId, setCategoryId] = useState(product?.category_id ?? "");
  const [images, setImages] = useState<string[]>(product?.images ?? []);
  const [sizes, setSizes] = useState<string[]>(
    product?.sizes?.length ? product.sizes : [...DEFAULT_SIZES]
  );
  const [colors, setColors] = useState<string[]>(
    product?.colors?.length ? product.colors : ["أسود", "أبيض"]
  );
  const [customSize, setCustomSize] = useState("");
  const [customColor, setCustomColor] = useState("");
  const [serviceType, setServiceType] = useState<ServiceType>(
    product?.embroidery_or_print_type ?? "both"
  );
  const [isActive, setIsActive] = useState(product?.is_active ?? true);
  const [isFeatured, setIsFeatured] = useState(product?.is_featured ?? false);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function toggleChip(list: string[], value: string, setter: (v: string[]) => void) {
    setter(list.includes(value) ? list.filter((x) => x !== value) : [...list, value]);
  }

  async function handleFiles(files: FileList | null) {
    if (!files?.length) return;
    setError(null);
    setUploading(true);
    const uploaded: string[] = [];
    for (const file of Array.from(files)) {
      const result = await uploadPublicImage("products", file);
      if ("error" in result) {
        setError(result.error);
        break;
      }
      uploaded.push(result.url);
    }
    if (uploaded.length) setImages((prev) => [...prev, ...uploaded]);
    setUploading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (saving) return;
    setError(null);
    setSaving(true);

    const result = await saveProduct({
      id: product?.id,
      name,
      description,
      price: Number(price),
      categoryId: categoryId || null,
      images,
      sizes,
      colors,
      serviceType,
      isActive,
      isFeatured,
    });

    setSaving(false);
    if (!result.ok) {
      setError(result.error ?? "تعذر حفظ المنتج");
      return;
    }
    router.push("/admin/products");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl border border-white/10 bg-night-card p-6">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="mb-2 block text-sm font-bold text-stone-200">اسم المنتج</label>
          <input required value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className="mb-2 block text-sm font-bold text-stone-200">السعر (₪)</label>
          <input
            required
            type="number"
            min={0}
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-bold text-stone-200">الفئة</label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className={inputClass}
          >
            <option value="">بدون فئة</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-2 block text-sm font-bold text-stone-200">نوع الخدمة</label>
          <select
            value={serviceType}
            onChange={(e) => setServiceType(e.target.value as ServiceType)}
            className={inputClass}
          >
            <option value="both">تطريز أو طباعة</option>
            <option value="embroidery">تطريز فقط</option>
            <option value="print">طباعة فقط</option>
          </select>
        </div>
        <div className="flex flex-col justify-end gap-3">
          <label className="flex items-center gap-3 text-sm font-bold text-stone-200">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="h-4 w-4 accent-brand"
            />
            ظاهر في المتجر
          </label>
          <label className="flex items-center gap-3 text-sm font-bold text-stone-200">
            <input
              type="checkbox"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="h-4 w-4 accent-brand"
            />
            منتج مميز في الرئيسية
          </label>
        </div>
        <div className="sm:col-span-2">
          <label className="mb-2 block text-sm font-bold text-stone-200">الوصف</label>
          <textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-bold text-stone-200">صور المنتج</h3>
        <div className="flex flex-wrap gap-3">
          {images.map((url) => (
            <div key={url} className="relative h-24 w-24 overflow-hidden rounded-xl border border-white/10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="" className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => setImages((prev) => prev.filter((u) => u !== url))}
                className="absolute top-1 left-1 rounded-full bg-black/70 px-1.5 text-xs text-red-300"
              >
                ×
              </button>
            </div>
          ))}
          <label className="flex h-24 w-24 cursor-pointer items-center justify-center rounded-xl border border-dashed border-white/20 text-2xl text-stone-500 hover:border-brand hover:text-brand">
            {uploading ? "…" : "+"}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              multiple
              hidden
              onChange={(e) => {
                handleFiles(e.target.files);
                e.target.value = "";
              }}
            />
          </label>
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-bold text-stone-200">المقاسات</h3>
        <div className="flex flex-wrap gap-2">
          {DEFAULT_SIZES.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => toggleChip(sizes, s, setSizes)}
              className={`rounded-lg border px-3 py-1.5 text-sm font-bold ${
                sizes.includes(s)
                  ? "border-brand bg-brand text-black"
                  : "border-white/15 text-stone-300"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
        <div className="mt-3 flex gap-2">
          <input
            value={customSize}
            onChange={(e) => setCustomSize(e.target.value)}
            placeholder="مقاس إضافي"
            className={inputClass}
          />
          <button
            type="button"
            onClick={() => {
              const v = customSize.trim();
              if (v && !sizes.includes(v)) setSizes([...sizes, v]);
              setCustomSize("");
            }}
            className="shrink-0 rounded-xl border border-white/15 px-4 text-sm font-bold text-stone-200"
          >
            إضافة
          </button>
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-bold text-stone-200">الألوان</h3>
        <div className="flex flex-wrap gap-2">
          {DEFAULT_COLORS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => toggleChip(colors, c, setColors)}
              className={`rounded-lg border px-3 py-1.5 text-sm font-bold ${
                colors.includes(c)
                  ? "border-brand bg-brand text-black"
                  : "border-white/15 text-stone-300"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="mt-3 flex gap-2">
          <input
            value={customColor}
            onChange={(e) => setCustomColor(e.target.value)}
            placeholder="لون إضافي"
            className={inputClass}
          />
          <button
            type="button"
            onClick={() => {
              const v = customColor.trim();
              if (v && !colors.includes(v)) setColors([...colors, v]);
              setCustomColor("");
            }}
            className="shrink-0 rounded-xl border border-white/15 px-4 text-sm font-bold text-stone-200"
          >
            إضافة
          </button>
        </div>
      </div>

      {error && (
        <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </p>
      )}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving || uploading}
          className="rounded-xl bg-brand px-8 py-3 font-extrabold text-black hover:bg-brand-soft disabled:opacity-60"
        >
          {saving ? "جارٍ الحفظ…" : product ? "حفظ التعديلات" : "إضافة المنتج"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/products")}
          className="rounded-xl border border-white/15 px-6 py-3 text-sm font-bold text-stone-300"
        >
          إلغاء
        </button>
      </div>
    </form>
  );
}
