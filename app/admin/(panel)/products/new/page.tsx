import type { Metadata } from "next";
import ProductForm from "@/components/admin/ProductForm";
import { createClient } from "@/lib/supabase/server";
import type { Category } from "@/lib/types";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "منتج جديد" };

export default async function NewProductPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("categories").select("*").order("name");

  return (
    <div>
      <h1 className="mb-6 text-2xl font-black text-stone-50">إضافة منتج</h1>
      <ProductForm categories={(data ?? []) as Category[]} />
    </div>
  );
}
