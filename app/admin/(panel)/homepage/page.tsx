import type { Metadata } from "next";
import HeroSlidesManager from "@/components/admin/HeroSlidesManager";
import HomepageForm from "@/components/admin/HomepageForm";
import { AdminPageHeader } from "@/components/admin/ui";
import { getSiteSettings } from "@/lib/data";
import { createClient } from "@/lib/supabase/server";
import type { HeroSlide, Product } from "@/lib/types";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "الصفحة الرئيسية" };

export default async function AdminHomepagePage() {
  const supabase = await createClient();
  const [productsRes, slidesRes, settings] = await Promise.all([
    supabase.from("products").select("*").order("created_at", { ascending: false }),
    supabase
      .from("hero_slides")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true }),
    getSiteSettings(),
  ]);

  return (
    <div>
      <AdminPageHeader
        title="الصفحة الرئيسية"
        description="صور البانر، نصوص البطل، المنتجات المميزة، وعناوين الأقسام — كلها من هنا."
      />
      <div className="space-y-8">
        <HeroSlidesManager slides={(slidesRes.data ?? []) as HeroSlide[]} />
        <HomepageForm settings={settings} products={(productsRes.data ?? []) as Product[]} />
      </div>
    </div>
  );
}
