"use server";

import { clientKey, rateLimitOk } from "@/lib/rate-limit";

export async function gateAdminLogin(): Promise<{ ok: true } | { ok: false; error: string }> {
  const key = await clientKey("admin-login");
  if (!rateLimitOk(key, 8, 15 * 60 * 1000)) {
    return { ok: false, error: "محاولات كثيرة. حاول بعد قليل." };
  }
  return { ok: true };
}
