import type { Metadata } from "next";
import AboutForm from "@/components/admin/AboutForm";
import { mergeSettings } from "@/lib/cms";
import { createClient } from "@/lib/supabase/server";
import type { SiteSettings } from "@/lib/types";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "من نحن" };

export default async function AdminAboutPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("site_settings")
    .select("*")
    .eq("id", "default")
    .maybeSingle();

  return (
    <div>
      <h1 className="mb-2 text-2xl font-black text-stone-50">من نحن</h1>
      <p className="mb-6 text-sm text-stone-400">
        محتوى صفحة «من نحن» بالكامل — العنوان، الفقرات، القيم، ودعوة التواصل.
      </p>
      {error && (
        <p className="mb-6 rounded-xl border border-brand/40 bg-brand/10 p-4 text-sm leading-7 text-stone-200">
          شغّل <code className="mx-1">supabase/migrations/0004_cms.sql</code> لإتاحة الحفظ.
        </p>
      )}
      <AboutForm settings={mergeSettings(data as Partial<SiteSettings> | null)} />
    </div>
  );
}
