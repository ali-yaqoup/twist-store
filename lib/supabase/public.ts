import { createClient } from "@supabase/supabase-js";

/**
 * Client للقراءة العامة فقط — بدون cookies.
 * يسمح لصفحات المتجر بالكاش (ISR) لأن الطلب لا يعتمد على الجلسة.
 * لا تستخدمه لمسارات الأدمن أو أي عملية تحتاج auth.uid().
 */
export function createPublicClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    throw new Error("Supabase public client: missing URL or anon key");
  }

  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}
