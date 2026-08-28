"use server";

import { createClient } from "@/lib/supabase/server";

export interface ContactResult {
  ok: boolean;
  error?: string;
}

export async function sendContactMessage(formData: FormData): Promise<ContactResult> {
  const name = String(formData.get("name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (!name || !phone || !message) {
    return { ok: false, error: "الرجاء تعبئة جميع الحقول" };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("contact_messages").insert({
    name,
    phone,
    message,
  });

  if (error) {
    return { ok: false, error: "تعذر إرسال الرسالة، حاول مجدداً" };
  }

  return { ok: true };
}
