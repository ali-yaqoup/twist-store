import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProductForm from "@/components/admin/ProductForm";
import { AdminPageHeader } from "@/components/admin/ui";
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
      <Link href="/admin/products" className="text-sm font-bold text-stone-400 hover:text-brand">
        ← كل المنتجات
      </Link>
      <div className="mt-4">
        <AdminPageHeader title="تعديل المنتج" description={(product as Product).name} />
      </div>
      <ProductForm product={product as Product} categories={(categories ?? []) as Category[]} />
    </div>
  );
}
