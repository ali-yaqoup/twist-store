import { createClient } from "@/lib/supabase/client";

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

export type PublicBucket = "products" | "gallery" | "designs" | "hero";

export function storagePathFromPublicUrl(url: string, bucket: string): string | null {
  const marker = `/storage/v1/object/public/${bucket}/`;
  const idx = url.indexOf(marker);
  if (idx === -1) return null;
  try {
    return decodeURIComponent(url.slice(idx + marker.length));
  } catch {
    return url.slice(idx + marker.length);
  }
}

export async function uploadPublicImage(
  bucket: PublicBucket,
  file: File
): Promise<{ url: string } | { error: string }> {
  if (!ALLOWED.has(file.type)) {
    return { error: "صيغة الصورة غير مدعومة — استخدم JPG أو PNG أو WEBP" };
  }
  if (file.size > MAX_BYTES) {
    return { error: "حجم الصورة يجب ألا يتجاوز 5 ميغابايت" };
  }

  const supabase = createClient();
  const ext =
    (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "") ||
    "jpg";
  const path = `${Date.now()}-${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: "3600",
    contentType: file.type,
    upsert: false,
  });

  if (error) {
    return { error: "تعذر رفع الصورة. تأكد من إعدادات Supabase والتخزين." };
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return { url: data.publicUrl };
}
