import type { Metadata } from "next";
import Link from "next/link";
import ProductForm from "@/components/admin/ProductForm";
import { AdminPageHeader } from "@/components/admin/ui";
import { createClient } from "@/lib/supabase/server";
import type { Category } from "@/lib/types";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "منتج جديد" };

export default async function NewProductPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("categories").select("*").order("name");

  return (
    <div>
      <Link href="/admin/products" className="text-sm font-bold text-stone-400 hover:text-brand">
        ← كل المنتجات
      </Link>
      <div className="mt-4">
        <AdminPageHeader title="إضافة منتج" description="الاسم، السعر، الصور، المقاسات، والخدمة." />
      </div>
      <ProductForm categories={(data ?? []) as Category[]} />
    </div>
  );
}
