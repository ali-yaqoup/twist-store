export default function Loading() {
  return (
    <div className="section-container section-py">
      <div className="mx-auto max-w-xs">
        <div className="skeleton h-8 w-3/4 rounded-lg" />
        <div className="skeleton mt-3 h-px w-16 rounded-full" />
      </div>
      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="card-luxe overflow-hidden">
            <div className="skeleton aspect-[4/5] w-full rounded-none" />
            <div className="space-y-2 p-4">
              <div className="skeleton h-3 w-1/3 rounded" />
              <div className="skeleton h-4 w-4/5 rounded" />
              <div className="skeleton h-5 w-1/4 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
