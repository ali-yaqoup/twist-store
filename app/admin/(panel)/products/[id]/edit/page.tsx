import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductForm from "@/components/admin/ProductForm";
import { createClient } from "@/lib/supabase/server";
import type { Category, Product } from "@/lib/types";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "تعديل منتج" };

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: product }, { data: categories }] = await Promise.all([
    supabase.from("products").select("*").eq("id", id).maybeSingle(),
    supabase.from("categories").select("*").order("name"),
  ]);

  if (!product) notFound();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-black text-stone-50">تعديل المنتج</h1>
      <ProductForm
        product={product as Product}
        categories={(categories ?? []) as Category[]}
      />
    </div>
  );
}
