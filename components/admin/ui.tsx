import type { ReactNode } from "react";
import { ORDER_STATUS_LABELS, type OrderStatus } from "@/lib/types";

export function AdminPageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0">
        <h1 className="font-display text-2xl font-extrabold tracking-tight text-stone-50">
          {title}
        </h1>
        {description && (
          <p className="mt-1.5 max-w-2xl text-sm leading-7 text-stone-400">{description}</p>
        )}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  );
}

export function AdminEmpty({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-white/12 bg-night-card/60 px-6 py-16 text-center">
      <p className="font-bold text-stone-200">{title}</p>
      {hint && <p className="mt-2 text-sm leading-7 text-stone-500">{hint}</p>}
    </div>
  );
}

const STATUS_CLASS: Record<OrderStatus, string> = {
  pending: "bg-amber-500/15 text-amber-300 ring-amber-500/25",
  in_progress: "bg-sky-500/15 text-sky-300 ring-sky-500/25",
  ready: "bg-brand/15 text-brand ring-brand/30",
  delivered: "bg-emerald-500/15 text-emerald-300 ring-emerald-500/25",
  cancelled: "bg-stone-500/15 text-stone-400 ring-white/10",
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-extrabold ring-1 ${STATUS_CLASS[status]}`}
    >
      {ORDER_STATUS_LABELS[status]}
    </span>
  );
}

export function AdminSearchField({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <label className="relative block min-w-0 flex-1">
      <span className="sr-only">{placeholder}</span>
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="input-luxe w-full pe-3 ps-10"
      />
      <svg
        className="pointer-events-none absolute top-1/2 start-3.5 -translate-y-1/2 text-stone-500"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        aria-hidden
      >
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3-3" />
      </svg>
    </label>
  );
}

export function FilterPills<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: (value: T) => void;
  options: { id: T; label: string; count?: number }[];
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((opt) => {
        const active = value === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => onChange(opt.id)}
            className={`rounded-full px-3 py-1.5 text-xs font-bold transition-colors ${
              active
                ? "bg-brand text-black"
                : "border border-white/10 bg-night text-stone-300 hover:border-brand/40 hover:text-brand"
            }`}
          >
            {opt.label}
            {typeof opt.count === "number" ? (
              <span className={active ? "ms-1.5 text-black/60" : "ms-1.5 text-stone-500"}>
                {opt.count}
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
