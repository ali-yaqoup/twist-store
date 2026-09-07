import type { Metadata } from "next";
import GalleryManager from "@/components/admin/GalleryManager";
import { AdminPageHeader } from "@/components/admin/ui";
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
      <AdminPageHeader
        title="معرض الأعمال"
        description="صور التنفيذ اللي بتظهر بالرئيسية."
      />
      <GalleryManager images={(data ?? []) as GalleryImage[]} />
    </div>
  );
}
