"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import TwistLogo from "@/components/site/TwistLogo";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const configured = isSupabaseConfigured();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;
    if (!isSupabaseConfigured()) {
      setError("قاعدة البيانات غير مربوطة بعد. أكمل إعداد Supabase في .env.local.");
      return;
    }
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError("بيانات الدخول غير صحيحة");
      setLoading(false);
      return;
    }

    router.push("/admin/dashboard");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-night px-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center text-center">
          <TwistLogo name="TWIST" size="lg" />
          <p className="mt-3 text-sm text-stone-500">لوحة تحكم الإدارة</p>
        </div>

        {!configured && (
          <div className="mt-8 space-y-3 rounded-2xl border border-brand/30 bg-night-card p-6 text-sm leading-7 text-stone-300">
            <p className="font-bold text-brand">Supabase غير مربوط بعد</p>
            <ol className="list-decimal space-y-2 pr-5 text-stone-400">
              <li>
                أنشئ مشروعاً على{" "}
                <a
                  className="text-brand underline"
                  href="https://supabase.com/dashboard"
                  target="_blank"
                  rel="noreferrer"
                >
                  supabase.com
                </a>
              </li>
              <li>
                انسخ URL ومفتاح anon إلى <code className="text-stone-200">.env.local</code>
              </li>
              <li>
                شغّل ملفات SQL بالترتيب من <code className="text-stone-200">supabase/migrations</code>
              </li>
              <li>Authentication → Users → أضف مستخدم أدمن</li>
              <li>
                <code className="text-xs text-stone-200">
                  insert into public.admins (email) values (&apos;your-admin@email.com&apos;);
                </code>
              </li>
              <li>أعد تشغيل npm run dev ثم سجّل الدخول من هنا</li>
            </ol>
          </div>
        )}

        {configured && (
        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-5 rounded-2xl border border-white/10 bg-night-card p-8"
        >
          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-bold text-stone-200">
              البريد الإلكتروني
            </label>
            <input
              id="email"
              type="email"
              required
              dir="ltr"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-night px-4 py-3 text-sm text-stone-100 focus:border-brand focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-bold text-stone-200">
              كلمة المرور
            </label>
            <input
              id="password"
              type="password"
              required
              dir="ltr"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-night px-4 py-3 text-sm text-stone-100 focus:border-brand focus:outline-none"
            />
          </div>

          {error && (
            <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-brand py-3 font-extrabold text-black transition-colors hover:bg-brand-soft disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "جارٍ الدخول…" : "تسجيل الدخول"}
          </button>
        </form>
        )}
      </div>
    </div>
  );
}
