import type { Metadata } from "next";
import TestimonialsManager from "@/components/admin/TestimonialsManager";
import { AdminPageHeader } from "@/components/admin/ui";
import { createClient } from "@/lib/supabase/server";
import type { Testimonial } from "@/lib/types";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "آراء الزبائن" };

export default async function AdminTestimonialsPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("testimonials")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  return (
    <div>
      <AdminPageHeader title="آراء الزبائن" description="التقييمات اللي بتظهر بالرئيسية." />
      {error && (
        <p className="mb-6 rounded-xl border border-brand/40 bg-brand/10 p-4 text-sm leading-7 text-stone-200">
          شغّل <code className="mx-1">supabase/migrations/0004_cms.sql</code> لإتاحة الآراء.
        </p>
      )}
      <TestimonialsManager testimonials={(data ?? []) as Testimonial[]} />
    </div>
  );
}
