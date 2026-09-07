"use client";

import { useMemo, useState, useTransition } from "react";
import { deleteMessage, toggleMessageRead } from "@/app/admin/actions";
import DeleteButton from "@/components/admin/DeleteButton";
import { AdminEmpty, FilterPills } from "@/components/admin/ui";
import { formatDate, whatsappHref } from "@/lib/config";
import type { ContactMessage } from "@/lib/types";

type Filter = "all" | "unread" | "read";

export default function MessagesList({ messages }: { messages: ContactMessage[] }) {
  const [filter, setFilter] = useState<Filter>("all");

  const filtered = useMemo(() => {
    if (filter === "unread") return messages.filter((m) => !m.is_read);
    if (filter === "read") return messages.filter((m) => m.is_read);
    return messages;
  }, [messages, filter]);

  if (messages.length === 0) {
    return <AdminEmpty title="لا توجد رسائل بعد" hint="رسائل صفحة التواصل بتظهر هنا." />;
  }

  return (
    <div>
      <FilterPills
        value={filter}
        onChange={setFilter}
        options={[
          { id: "all", label: "الكل", count: messages.length },
          { id: "unread", label: "غير مقروءة", count: messages.filter((m) => !m.is_read).length },
          { id: "read", label: "مقروءة", count: messages.filter((m) => m.is_read).length },
        ]}
      />

      {filtered.length === 0 ? (
        <div className="mt-6">
          <AdminEmpty title="لا رسائل بهالتصنيف" />
        </div>
      ) : (
        <ul className="mt-5 space-y-3">
          {filtered.map((msg) => (
            <MessageCard key={msg.id} message={msg} />
          ))}
        </ul>
      )}
    </div>
  );
}

function MessageCard({ message }: { message: ContactMessage }) {
  const [pending, startTransition] = useTransition();
  const wa = whatsappHref(message.phone);
  const tel = message.phone.replace(/[^\d+]/g, "");

  return (
    <li
      className={`rounded-2xl border p-5 ${
        message.is_read ? "border-white/10 bg-night-card" : "border-brand/35 bg-brand/5"
      }`}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-extrabold text-stone-100">{message.name}</p>
            {!message.is_read && (
              <span className="rounded-full bg-brand px-2 py-0.5 text-[10px] font-extrabold text-black">
                جديدة
              </span>
            )}
          </div>
          <p className="mt-0.5 text-sm text-stone-400" dir="ltr">
            {message.phone}
          </p>
        </div>
        <span className="text-xs text-stone-500">{formatDate(message.created_at)}</span>
      </div>
      <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-stone-300">{message.message}</p>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        {tel && (
          <a
            href={`tel:${tel}`}
            className="rounded-lg border border-white/15 px-3 py-1.5 text-xs font-bold text-stone-200 hover:border-brand hover:text-brand"
          >
            اتصال
          </a>
        )}
        {wa && (
          <a
            href={wa}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-white/15 px-3 py-1.5 text-xs font-bold text-stone-200 hover:border-brand hover:text-brand"
          >
            واتساب
          </a>
        )}
        <button
          type="button"
          disabled={pending}
          onClick={() =>
            startTransition(async () => {
              await toggleMessageRead(message.id, !message.is_read);
            })
          }
          className="rounded-lg border border-white/15 px-3 py-1.5 text-xs font-bold text-stone-200 hover:border-brand hover:text-brand disabled:opacity-50"
        >
          {message.is_read ? "إرجاع لغير مقروءة" : "تعليم كمقروءة"}
        </button>
        <DeleteButton confirmText="حذف هذه الرسالة؟" onDelete={() => deleteMessage(message.id)} />
      </div>
    </li>
  );
}
