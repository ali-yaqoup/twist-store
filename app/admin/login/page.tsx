"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import TwistLogo from "@/components/site/TwistLogo";
import { gateAdminLogin } from "./actions";

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

    const gate = await gateAdminLogin();
    if (!gate.ok) {
      setError(gate.error);
      setLoading(false);
      return;
    }

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (signInError) {
      setError("بيانات الدخول غير صحيحة");
      setLoading(false);
      return;
    }

    const { data: adminRow } = await supabase.from("admins").select("id").maybeSingle();
    if (!adminRow) {
      await supabase.auth.signOut();
      setError("بيانات الدخول غير صحيحة");
      setLoading(false);
      return;
    }

    router.push("/admin/dashboard");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-night px-4 py-10">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center text-center">
          <TwistLogo name="TWIST" size="lg" />
          <p className="mt-3 text-sm text-stone-400">لوحة تحكم الإدارة</p>
          <p className="mt-1 text-xs text-stone-600">دخول خاص بصاحب المتجر</p>
        </div>

        {!configured && (
          <div className="mt-8 space-y-3 rounded-2xl border border-brand/30 bg-night-card p-6 text-sm leading-7 text-stone-300">
            <p className="font-bold text-brand">Supabase غير مربوط بعد</p>
            <p className="text-stone-400">
              اربط المشروع من ملف البيئة ثم أضف مستخدم الأدمن من لوحة Supabase.
            </p>
          </div>
        )}

        {configured && (
        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-5 rounded-2xl border border-brand/15 bg-night-card p-8 shadow-[0_0_48px_rgba(245,196,0,0.06)]"
        >
          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-bold text-stone-200">
              البريد الإلكتروني
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              maxLength={120}
              autoComplete="username"
              dir="ltr"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-luxe"
            />
          </div>
          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-bold text-stone-200">
              كلمة المرور
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              maxLength={128}
              autoComplete="current-password"
              dir="ltr"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-luxe"
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
            className="btn-gold w-full !rounded-xl"
          >
            {loading ? "جارٍ الدخول…" : "تسجيل الدخول"}
          </button>
          <p className="text-center text-xs leading-6 text-stone-500">
            إعادة كلمة السر تتم من لوحة Supabase: Authentication → Users
          </p>
          <a href="/" className="block text-center text-xs font-bold text-stone-500 hover:text-brand">
            العودة للمتجر
          </a>
        </form>
        )}
      </div>
    </div>
  );
}
