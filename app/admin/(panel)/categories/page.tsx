import type { Metadata } from "next";
import CategoryManager from "@/components/admin/CategoryManager";
import { createClient } from "@/lib/supabase/server";
import type { Category } from "@/lib/types";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "الفئات" };

export default async function AdminCategoriesPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("categories")
    .select("*")
    .order("created_at", { ascending: true });

  return (
    <div>
      <h1 className="mb-6 text-2xl font-black text-stone-50">الفئات</h1>
      <CategoryManager categories={(data ?? []) as Category[]} />
    </div>
  );
}
