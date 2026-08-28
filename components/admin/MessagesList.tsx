"use client";

import { deleteMessage, toggleMessageRead } from "@/app/admin/actions";
import DeleteButton from "@/components/admin/DeleteButton";
import { formatDate } from "@/lib/config";
import type { ContactMessage } from "@/lib/types";
import { useTransition } from "react";

export default function MessagesList({ messages }: { messages: ContactMessage[] }) {
  if (messages.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-white/15 py-16 text-center text-stone-500">
        لا توجد رسائل بعد
      </p>
    );
  }

  return (
    <ul className="space-y-4">
      {messages.map((msg) => (
        <MessageCard key={msg.id} message={msg} />
      ))}
    </ul>
  );
}

function MessageCard({ message }: { message: ContactMessage }) {
  const [pending, startTransition] = useTransition();

  return (
    <li
      className={`rounded-2xl border p-5 ${
        message.is_read
          ? "border-white/10 bg-night-card"
          : "border-brand/40 bg-brand/5"
      }`}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-black text-stone-100">{message.name}</p>
          <p className="mt-0.5 text-sm text-stone-400" dir="ltr">
            {message.phone}
          </p>
        </div>
        <span className="text-xs text-stone-500">{formatDate(message.created_at)}</span>
      </div>
      <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-stone-300">
        {message.message}
      </p>
      <div className="mt-4 flex flex-wrap items-center gap-2">
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
          {message.is_read ? "تعليم كغير مقروءة" : "تعليم كمقروءة"}
        </button>
        <DeleteButton
          confirmText="حذف هذه الرسالة؟"
          onDelete={() => deleteMessage(message.id)}
        />
      </div>
    </li>
  );
}
