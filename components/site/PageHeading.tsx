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
      <h1 className="font-display heading-ar text-2xl font-extrabold tracking-tight text-stone-50 sm:text-3xl lg:text-4xl">
        {title}
      </h1>
      <div
        className={`mt-3 h-px w-12 bg-gradient-to-l from-transparent via-brand to-brand sm:w-16 ${
          align === "center" ? "mx-auto" : ""
        }`}
      />
      {subtitle && (
        <p className="body-ar mt-4 max-w-xl text-sm text-stone-400 sm:text-base">{subtitle}</p>
      )}
    </div>
  );
}
