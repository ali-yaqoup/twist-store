import type { Metadata } from "next";
import CategoryManager from "@/components/admin/CategoryManager";
import { AdminPageHeader } from "@/components/admin/ui";
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
      <AdminPageHeader
        title="الفئات"
        description="فئات المتجر اللي الزبون بصفّي فيها المنتجات."
      />
      <CategoryManager categories={(data ?? []) as Category[]} />
    </div>
  );
}
