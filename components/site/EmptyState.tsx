import Link from "next/link";
import { StitchMark } from "@/components/site/TwistLogo";

export default function EmptyState({
  title,
  description,
  actionHref = "/products",
  actionLabel = "تصفح المنتجات",
  icon = "bag",
}: {
  title: string;
  description: string;
  actionHref?: string;
  actionLabel?: string;
  icon?: "bag" | "heart";
}) {
  return (
    <div className="card-luxe relative mt-10 overflow-hidden px-5 py-14 text-center sm:mt-14 sm:px-8 sm:py-20">
      <div className="pattern-tatreez pointer-events-none absolute inset-0 opacity-20" aria-hidden />
      <div className="relative flex flex-col items-center gap-5">
        <span className="flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-full border border-brand/30 bg-brand/10 text-brand shadow-[0_0_32px_rgba(245,196,0,0.12)]">
          {icon === "heart" ? (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          ) : (
            <StitchMark className="h-9 w-9" />
          )}
        </span>
        <p className="font-display heading-ar text-xl font-bold text-stone-100">{title}</p>
        <p className="body-ar max-w-sm text-sm text-stone-400">{description}</p>
        <div className="mt-2 flex flex-col items-center gap-3 sm:flex-row">
          <Link href={actionHref} className="btn-gold glow-gold min-w-[200px]">
            {actionLabel}
          </Link>
        </div>
      </div>
    </div>
  );
}
