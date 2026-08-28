"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function SignOutButton() {
  const router = useRouter();

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={signOut}
      className="w-full rounded-xl border border-red-500/30 py-2.5 text-sm font-bold text-red-400 transition-colors hover:bg-red-500/10"
    >
      تسجيل الخروج
    </button>
  );
}
