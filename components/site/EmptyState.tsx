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
    <div className="card-luxe mt-10 flex flex-col items-center gap-5 px-5 py-14 text-center sm:mt-14 sm:px-6 sm:py-20">
      <span className="flex h-16 w-16 items-center justify-center rounded-full border border-brand/25 bg-brand/10 text-brand">
        {icon === "heart" ? (
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        ) : (
          <StitchMark className="h-8 w-8" />
        )}
      </span>
      <p className="font-display text-lg font-bold text-stone-200">{title}</p>
      <p className="max-w-sm text-sm leading-7 text-stone-500">{description}</p>
      <Link href={actionHref} className="btn-gold mt-2">
        {actionLabel}
      </Link>
    </div>
  );
}
