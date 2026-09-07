import type { Metadata } from "next";
import SettingsForm from "@/components/admin/SettingsForm";
import { AdminPageHeader } from "@/components/admin/ui";
import { mergeSettings } from "@/lib/cms";
import { createClient } from "@/lib/supabase/server";
import type { SiteSettings } from "@/lib/types";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "إعدادات الموقع" };

export default async function AdminSettingsPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("site_settings")
    .select("*")
    .eq("id", "default")
    .maybeSingle();

  return (
    <div>
      <AdminPageHeader
        title="إعدادات الموقع"
        description="الاسم، اللوغو، واتساب، الهاتف، العنوان، السوشيال، ونصوص صفحة التواصل."
      />
      {error && (
        <p className="mb-6 rounded-xl border border-brand/40 bg-brand/10 p-4 text-sm leading-7 text-stone-200">
          شغّل <code className="mx-1">supabase/migrations/0004_cms.sql</code> لإتاحة الحفظ.
        </p>
      )}
      <SettingsForm settings={mergeSettings(data as Partial<SiteSettings> | null)} />
    </div>
  );
}
