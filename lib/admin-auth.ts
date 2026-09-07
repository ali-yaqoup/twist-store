import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export async function requireAdmin(): Promise<{ ok: false; error: string } | null> {
  if (!isSupabaseConfigured()) {
    return {
      ok: false,
      error:
        "الحفظ يحتاج مشروع Supabase حقيقي. اضبط NEXT_PUBLIC_SUPABASE_URL و ANON_KEY ثم شغّل ملفات SQL من مجلد supabase/migrations.",
    };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { ok: false, error: "يجب تسجيل الدخول" };

  await supabase.rpc("claim_admin_identity");

  const { data: adminRow } = await supabase.from("admins").select("id").maybeSingle();
  if (!adminRow) return { ok: false, error: "غير مصرح" };

  return null;
}
