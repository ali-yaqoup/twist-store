import type { Metadata } from "next";
import MessagesList from "@/components/admin/MessagesList";
import { AdminPageHeader } from "@/components/admin/ui";
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
      <AdminPageHeader
        title="رسائل التواصل"
        description="رد بسرعة من واتساب أو اتصال، وعلّم المقروء عشان ما تضيع رسالة."
        actions={
          unread > 0 ? (
            <span className="rounded-full bg-brand px-3 py-1 text-xs font-extrabold text-black">
              {unread} غير مقروءة
            </span>
          ) : undefined
        }
      />
      <MessagesList messages={messages} />
    </div>
  );
}
