import type { Metadata } from "next";
import HeroSlidesManager from "@/components/admin/HeroSlidesManager";
import HomepageForm from "@/components/admin/HomepageForm";
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
      <h1 className="text-2xl font-black text-stone-50">الصفحة الرئيسية</h1>
      <p className="mt-2 max-w-2xl text-sm leading-7 text-stone-400">
        صور البانر، نصوص البطل، المنتجات المميزة، وعناوين الأقسام — كلها من هنا.
      </p>
      <div className="mt-6 space-y-8">
        <HeroSlidesManager slides={(slidesRes.data ?? []) as HeroSlide[]} />
        <HomepageForm settings={settings} products={(productsRes.data ?? []) as Product[]} />
      </div>
    </div>
  );
}
