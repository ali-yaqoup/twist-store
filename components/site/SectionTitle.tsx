export default function SectionTitle({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-8 px-1 text-center sm:mb-12">
      <h2 className="font-display text-2xl font-extrabold tracking-tight text-balance text-stone-100 sm:text-3xl lg:text-4xl">
        {title}
      </h2>
      <div className="mx-auto mt-4 h-px w-16 bg-gradient-to-l from-transparent via-brand to-brand" />
      {subtitle && (
        <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-stone-400">
          {subtitle}
        </p>
      )}
    </div>
  );
}
