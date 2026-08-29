"use client";

import { useState, useTransition } from "react";
import { deleteCategory, saveCategory } from "@/app/admin/actions";
import DeleteButton from "@/components/admin/DeleteButton";
import { isImageSrc } from "@/lib/category-images";
import { uploadPublicImage } from "@/lib/upload";
import type { Category } from "@/lib/types";

const inputClass =
  "w-full rounded-xl border border-white/10 bg-night px-4 py-3 text-sm text-stone-100 placeholder:text-stone-600 focus:border-brand focus:outline-none";

export default function CategoryManager({ categories }: { categories: Category[] }) {
  const [editing, setEditing] = useState<Category | null>(null);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [icon, setIcon] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function startEdit(cat: Category) {
    setEditing(cat);
    setName(cat.name);
    setSlug(cat.slug);
    setIcon(cat.icon ?? "");
    setImageUrl(cat.image_url ?? "");
    setError(null);
  }

  function reset() {
    setEditing(null);
    setName("");
    setSlug("");
    setIcon("");
    setImageUrl("");
    setError(null);
  }

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setError(null);
    setUploading(true);
    const result = await uploadPublicImage("products", file);
    setUploading(false);
    if ("error" in result) {
      setError(result.error);
      return;
    }
    setImageUrl(result.url);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const fd = new FormData();
    if (editing) fd.set("id", editing.id);
    fd.set("name", name);
    fd.set("slug", slug);
    fd.set("icon", icon);
    fd.set("image_url", imageUrl);
    startTransition(async () => {
      const result = await saveCategory(fd);
      if (!result.ok) setError(result.error ?? "تعذر الحفظ");
      else reset();
    });
  }

  const busy = pending || uploading;

  return (
    <div className="grid gap-8 lg:grid-cols-[340px_1fr]">
      <form onSubmit={handleSubmit} className="h-fit space-y-4 rounded-2xl border border-white/10 bg-night-card p-5">
        <h2 className="font-black text-stone-100">
          {editing ? "تعديل الفئة" : "فئة جديدة"}
        </h2>
        <div>
          <label className="mb-2 block text-sm font-bold text-stone-200">الاسم</label>
          <input required value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className="mb-2 block text-sm font-bold text-stone-200">
            المعرّف (slug) <span className="font-normal text-stone-500">اختياري</span>
          </label>
          <input
            dir="ltr"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="tshirts"
            className={`${inputClass} text-right`}
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-bold text-stone-200">صورة الفئة</label>
          <p className="mb-2 text-xs leading-5 text-stone-500">
            تظهر في الصفحة الرئيسية. ارفع صورة أو الصق رابطاً — يفضّل قصّة عمودية بنفس الإضاءة لكل الفئات.
          </p>
          {isImageSrc(imageUrl) && (
            <div className="relative mb-3 aspect-[3/4] w-28 overflow-hidden rounded-xl border border-white/10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={imageUrl} alt="" className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => setImageUrl("")}
                className="absolute top-1 left-1 rounded-full bg-black/70 px-1.5 text-xs text-red-300"
              >
                ×
              </button>
            </div>
          )}
          <input
            dir="ltr"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://…"
            className={`${inputClass} mb-2 text-right`}
          />
          <label className="flex cursor-pointer items-center justify-center rounded-xl border border-dashed border-white/20 py-3 text-sm font-bold text-stone-400 hover:border-brand hover:text-brand">
            {uploading ? "جارٍ الرفع…" : "رفع صورة"}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              hidden
              disabled={busy}
              onChange={(e) => {
                handleFile(e.target.files?.[0]);
                e.target.value = "";
              }}
            />
          </label>
        </div>
        <div>
          <label className="mb-2 block text-sm font-bold text-stone-200">
            أيقونة (إيموجي) <span className="font-normal text-stone-500">اختياري</span>
          </label>
          <input value={icon} onChange={(e) => setIcon(e.target.value)} placeholder="👕" className={inputClass} />
        </div>
        {error && <p className="text-sm text-red-400">{error}</p>}
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={busy}
            className="rounded-xl bg-brand px-5 py-2.5 text-sm font-extrabold text-black disabled:opacity-60"
          >
            {pending ? "جارٍ الحفظ…" : editing ? "حفظ" : "إضافة"}
          </button>
          {editing && (
            <button type="button" onClick={reset} className="rounded-xl border border-white/15 px-4 py-2.5 text-sm text-stone-300">
              إلغاء
            </button>
          )}
        </div>
      </form>

      <div className="overflow-x-auto rounded-2xl border border-white/10 bg-night-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 text-right text-xs text-stone-500">
              <th className="p-4 font-medium">الصورة</th>
              <th className="p-4 font-medium">الاسم</th>
              <th className="p-4 font-medium">slug</th>
              <th className="p-4 font-medium">إجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {categories.map((cat) => (
              <tr key={cat.id}>
                <td className="p-4">
                  {isImageSrc(cat.image_url) ? (
                    <div className="relative h-14 w-11 overflow-hidden rounded-lg border border-white/10">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={cat.image_url!} alt="" className="h-full w-full object-cover" />
                    </div>
                  ) : (
                    <span className="text-lg">{cat.icon ?? "—"}</span>
                  )}
                </td>
                <td className="p-4 font-bold text-stone-100">{cat.name}</td>
                <td className="p-4 font-mono text-stone-400" dir="ltr">
                  {cat.slug}
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => startEdit(cat)}
                      className="rounded-lg border border-white/15 px-3 py-1.5 text-xs font-bold text-stone-200 hover:border-brand hover:text-brand"
                    >
                      تعديل
                    </button>
                    <DeleteButton
                      confirmText={`حذف فئة «${cat.name}»؟`}
                      onDelete={() => deleteCategory(cat.id)}
                    />
                  </div>
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr>
                <td colSpan={4} className="p-10 text-center text-stone-500">
                  لا توجد فئات بعد
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
