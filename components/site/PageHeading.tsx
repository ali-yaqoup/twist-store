export default function PageHeading({
  title,
  subtitle,
  align = "start",
}: {
  title: string;
  subtitle?: string;
  align?: "start" | "center";
}) {
  return (
    <div className={align === "center" ? "text-center" : ""}>
      <h1 className="font-display text-2xl font-extrabold tracking-tight text-balance text-stone-50 sm:text-3xl lg:text-4xl">
        {title}
      </h1>
      <div
        className={`mt-3 h-px w-16 bg-gradient-to-l from-transparent via-brand to-brand ${
          align === "center" ? "mx-auto" : ""
        }`}
      />
      {subtitle && (
        <p className="mt-4 max-w-xl text-sm leading-7 text-stone-400">{subtitle}</p>
      )}
    </div>
  );
}
