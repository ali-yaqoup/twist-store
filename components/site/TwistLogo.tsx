type LogoSize = "sm" | "md" | "lg";

const SIZE: Record<LogoSize, { mark: string; text: string; gap: string }> = {
  sm: { mark: "h-6 w-6", text: "text-base sm:text-lg", gap: "gap-1.5" },
  md: { mark: "h-7 w-7 sm:h-8 sm:w-8", text: "text-base sm:text-[1.55rem]", gap: "gap-1.5 sm:gap-2" },
  lg: { mark: "h-12 w-12 sm:h-14 sm:w-14", text: "text-4xl sm:text-6xl", gap: "gap-2 sm:gap-3" },
};

export function StitchMark({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 44 44"
      className={className}
      aria-hidden
      fill="none"
    >
      <path
        fill="currentColor"
        d="M22 1.4 25.2 17.6 41.6 21 25.2 24.4 22 40.6 18.8 24.4 2.4 21 18.8 17.6Z"
      />
      <path
        fill="var(--color-bg, #000)"
        d="M22 14.2 23.4 19.2 28.4 20.8 23.4 22.4 22 27.4 20.6 22.4 15.6 20.8 20.6 19.2Z"
      />
      <g
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        fill="none"
      >
        <path d="M8.2 35.6 36.8 9.6" />
        <path d="M36.8 9.6c1.75-1.55 4.05.5 2.25 2.2" />
        <path d="M8.4 35.8c-2.7 2.25-.85 4.95 2.25 3.2" opacity=".75" />
      </g>
    </svg>
  );
}

export default function TwistLogo({
  name,
  size = "md",
}: {
  name: string;
  size?: LogoSize;
}) {
  const s = SIZE[size];

  return (
    <span
      dir="ltr"
      className={`inline-flex min-w-0 items-center ${s.gap} text-brand`}
    >
      <StitchMark className={`shrink-0 ${s.mark}`} />
      <span
        className={`font-display min-w-0 truncate font-extrabold leading-none tracking-[0.18em] text-brand sm:tracking-[0.28em] ${s.text}`}
      >
        {name}
      </span>
    </span>
  );
}
