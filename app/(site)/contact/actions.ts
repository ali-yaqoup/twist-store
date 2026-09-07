"use server";

import { clientKey, rateLimitOk } from "@/lib/rate-limit";
import { LIMITS, normalizePhone, sanitizeText } from "@/lib/security";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export interface ContactResult {
  ok: boolean;
  error?: string;
}

export async function sendContactMessage(formData: FormData): Promise<ContactResult> {
  const honeypot = String(formData.get("website") ?? "").trim();
  if (honeypot) {
    return { ok: true };
  }

  const key = await clientKey("contact");
  if (!rateLimitOk(key, 5, 15 * 60 * 1000)) {
    return { ok: false, error: "رسائل كثيرة. حاول بعد قليل." };
  }

  const name = sanitizeText(String(formData.get("name") ?? ""), LIMITS.name);
  const phone = normalizePhone(String(formData.get("phone") ?? ""));
  const message = sanitizeText(String(formData.get("message") ?? ""), LIMITS.message);

  if (!name || name.length < 2 || !phone || !message || message.length < 5) {
    return { ok: false, error: "الرجاء تعبئة جميع الحقول بشكل صحيح" };
  }

  if (!isSupabaseConfigured()) {
    return { ok: true };
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
