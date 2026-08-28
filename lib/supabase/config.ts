export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
  return (
    url.startsWith("http") &&
    !url.includes("YOUR_PROJECT") &&
    key.length > 20 &&
    !key.includes("YOUR_ANON")
  );
}
