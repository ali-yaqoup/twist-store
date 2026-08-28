"use client";

import { useState, useTransition } from "react";
import { addGalleryImage, deleteGalleryImage } from "@/app/admin/actions";
import DeleteButton from "@/components/admin/DeleteButton";
import { uploadPublicImage } from "@/lib/upload";
import type { GalleryImage } from "@/lib/types";

export default function GalleryManager({ images }: { images: GalleryImage[] }) {
  const [caption, setCaption] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setError(null);
    setUploading(true);
    const result = await uploadPublicImage("gallery", file);
    setUploading(false);
    if ("error" in result) {
      setError(result.error);
      return;
    }
    startTransition(async () => {
      const saved = await addGalleryImage(result.url, caption);
      if (!saved.ok) setError(saved.error ?? "تعذر الحفظ");
      else setCaption("");
    });
  }

  return (
    <div>
      <div className="rounded-2xl border border-white/10 bg-night-card p-5">
        <h2 className="font-black text-stone-100">رفع صورة جديدة</h2>
        <input
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="تعليق اختياري"
          className="mt-4 w-full rounded-xl border border-white/10 bg-night px-4 py-3 text-sm text-stone-100 placeholder:text-stone-600 focus:border-brand focus:outline-none"
        />
        <label className="mt-4 flex cursor-pointer items-center justify-center rounded-xl border border-dashed border-white/20 py-8 text-sm font-bold text-stone-400 hover:border-brand hover:text-brand">
          {uploading || pending ? "جارٍ الرفع…" : "اختر صورة للرفع"}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            hidden
            disabled={uploading || pending}
            onChange={(e) => {
              handleFile(e.target.files?.[0]);
              e.target.value = "";
            }}
          />
        </label>
        {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {images.map((img) => (
          <figure key={img.id} className="overflow-hidden rounded-2xl border border-white/10 bg-night-card">
            <div className="relative aspect-square">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.image_url} alt={img.caption ?? ""} className="h-full w-full object-cover" />
            </div>
            <figcaption className="flex items-center justify-between gap-2 p-3">
              <span className="line-clamp-1 text-xs text-stone-400">
                {img.caption || "بدون تعليق"}
              </span>
              <DeleteButton
                confirmText="حذف هذه الصورة من المعرض؟"
                onDelete={() => deleteGalleryImage(img.id)}
              />
            </figcaption>
          </figure>
        ))}
        {images.length === 0 && (
          <p className="col-span-full py-12 text-center text-stone-500">المعرض فارغ</p>
        )}
      </div>
    </div>
  );
}
