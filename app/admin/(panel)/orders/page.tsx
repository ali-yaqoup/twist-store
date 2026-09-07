import type { Metadata } from "next";
import AdminOrdersList from "@/components/admin/AdminOrdersList";
import { AdminPageHeader } from "@/components/admin/ui";
import { createClient } from "@/lib/supabase/server";
import type { Order } from "@/lib/types";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "الطلبات" };

export default async function AdminOrdersPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
  const orders = (data ?? []) as Order[];

  return (
    <div>
      <AdminPageHeader
        title="الطلبات"
        description="فلتر حسب الحالة أو ابحث باسم الزبون. غيّر الحالة من نفس الصفحة."
      />
      <AdminOrdersList orders={orders} />
    </div>
  );
}
