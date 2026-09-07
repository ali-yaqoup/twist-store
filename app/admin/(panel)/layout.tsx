import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import { getSiteSettings } from "@/lib/data";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function AdminPanelLayout({
  children,
}: {
  children: ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/admin/login");

  await supabase.rpc("claim_admin_identity");

  const { data: adminRow } = await supabase
    .from("admins")
    .select("id")
    .maybeSingle();

  if (!adminRow) redirect("/admin/login");

  const [settings, pendingRes, unreadRes] = await Promise.all([
    getSiteSettings(),
    supabase.from("orders").select("id", { count: "exact", head: true }).eq("status", "pending"),
    supabase
      .from("contact_messages")
      .select("id", { count: "exact", head: true })
      .eq("is_read", false),
  ]);

  return (
    <AdminShell
      shopName={settings.shop_name}
      userEmail={user.email ?? ""}
      pendingOrders={pendingRes.count ?? 0}
      unreadMessages={unreadRes.count ?? 0}
    >
      {children}
    </AdminShell>
  );
}
