import type { Metadata } from "next";
import GalleryManager from "@/components/admin/GalleryManager";
import { createClient } from "@/lib/supabase/server";
import type { GalleryImage } from "@/lib/types";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "معرض الأعمال" };

export default async function AdminGalleryPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("gallery_images")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="mb-6 text-2xl font-black text-stone-50">معرض الأعمال</h1>
      <GalleryManager images={(data ?? []) as GalleryImage[]} />
    </div>
  );
}
