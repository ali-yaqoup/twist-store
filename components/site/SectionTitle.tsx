export default function SectionTitle({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-8 px-1 text-center sm:mb-12 lg:mb-14">
      <h2 className="font-display heading-ar text-2xl font-extrabold tracking-tight text-stone-100 sm:text-3xl lg:text-4xl">
        {title}
      </h2>
      <div className="mx-auto mt-4 h-px w-12 bg-gradient-to-l from-transparent via-brand to-brand sm:w-16" />
      {subtitle && (
        <p className="body-ar mx-auto mt-4 max-w-xl text-sm text-stone-400 sm:text-base">
          {subtitle}
        </p>
      )}
    </div>
  );
}
