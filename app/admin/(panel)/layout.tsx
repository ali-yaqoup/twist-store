import Link from "next/link";
import { redirect } from "next/navigation";
import AdminNav from "@/components/admin/AdminNav";
import SignOutButton from "@/components/admin/SignOutButton";
import { getSiteSettings } from "@/lib/data";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/admin/login");

  // التحقق أن المستخدم مسجّل في جدول الأدمن (سياسة RLS تسمح للأدمن فقط برؤية صفّه)
  const { data: adminRow } = await supabase
    .from("admins")
    .select("id")
    .maybeSingle();

  if (!adminRow) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-night px-4">
        <div className="w-full max-w-md rounded-2xl border border-red-500/30 bg-night-card p-8 text-center">
          <span className="text-4xl">🚫</span>
          <h1 className="mt-4 text-xl font-black text-stone-50">غير مصرح</h1>
          <p className="mt-3 text-sm leading-7 text-stone-400">
            حسابك ({user.email}) غير مسجّل كأدمن. أضف بريدك إلى جدول
            <code className="mx-1 rounded bg-white/10 px-1.5 py-0.5 text-xs">admins</code>
            في Supabase ثم أعد المحاولة.
          </p>
          <div className="mt-6">
            <SignOutButton />
          </div>
        </div>
      </div>
    );
  }

  const settings = await getSiteSettings();

  return (
    <div className="min-h-screen bg-night">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:flex-row">
        {/* الشريط الجانبي */}
        <aside className="shrink-0 lg:w-60">
          <div className="rounded-2xl border border-white/10 bg-night-card p-4 lg:sticky lg:top-6">
            <Link href="/admin/dashboard" className="mb-1 block px-2 py-2">
              <span className="text-2xl font-black text-brand">{settings.shop_name}</span>
              <span className="mr-2 text-xs text-stone-500">الإدارة</span>
            </Link>
            <AdminNav />
            <div className="mt-4 space-y-2 border-t border-white/10 pt-4">
              <Link
                href="/"
                className="block rounded-xl px-4 py-2 text-center text-sm text-stone-400 transition-colors hover:text-brand"
              >
                ← عرض المتجر
              </Link>
              <SignOutButton />
            </div>
          </div>
        </aside>

        {/* المحتوى */}
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
