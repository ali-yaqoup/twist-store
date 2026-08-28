import type { Metadata } from "next";
import MessagesList from "@/components/admin/MessagesList";
import { createClient } from "@/lib/supabase/server";
import type { ContactMessage } from "@/lib/types";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "الرسائل" };

export default async function AdminMessagesPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false });

  const messages = (data ?? []) as ContactMessage[];
  const unread = messages.filter((m) => !m.is_read).length;

  return (
    <div>
      <div className="mb-6 flex items-end justify-between gap-4">
        <h1 className="text-2xl font-black text-stone-50">رسائل التواصل</h1>
        {unread > 0 && (
          <span className="rounded-full bg-brand px-3 py-1 text-xs font-extrabold text-black">
            {unread} غير مقروءة
          </span>
        )}
      </div>
      <MessagesList messages={messages} />
    </div>
  );
}
