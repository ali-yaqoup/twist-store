"use client";

import { useState, useTransition } from "react";

interface Props {
  label?: string;
  confirmText: string;
  onDelete: () => Promise<{ ok: boolean; error?: string }>;
}

export default function DeleteButton({ label = "حذف", confirmText, onDelete }: Props) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleClick() {
    if (!window.confirm(confirmText)) return;
    startTransition(async () => {
      const result = await onDelete();
      if (!result.ok) setError(result.error ?? "حدث خطأ");
    });
  }

  return (
    <span className="inline-flex items-center gap-2">
      <button
        type="button"
        onClick={handleClick}
        disabled={pending}
        className="rounded-lg border border-red-500/30 px-3 py-1.5 text-xs font-bold text-red-400 transition-colors hover:bg-red-500/10 disabled:opacity-50"
      >
        {pending ? "جارٍ الحذف…" : label}
      </button>
      {error && <span className="text-xs text-red-400">{error}</span>}
    </span>
  );
}
