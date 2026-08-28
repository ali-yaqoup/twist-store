export default function SectionTitle({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-10 text-center">
      <h2 className="text-3xl font-black text-stone-100 sm:text-4xl">
        {title}
      </h2>
      <div className="mx-auto mt-3 h-1 w-16 rounded-full bg-brand" />
      {subtitle && (
        <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-stone-400">
          {subtitle}
        </p>
      )}
    </div>
  );
}
