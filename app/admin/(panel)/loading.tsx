export default function AdminLoading() {
  return (
    <div className="animate-pulse space-y-5">
      <div className="h-8 w-40 rounded-lg bg-white/8" />
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <div className="h-28 rounded-2xl bg-white/6" />
        <div className="h-28 rounded-2xl bg-white/6" />
        <div className="h-28 rounded-2xl bg-white/6" />
        <div className="h-28 rounded-2xl bg-white/6" />
      </div>
      <div className="h-64 rounded-2xl bg-white/6" />
    </div>
  );
}
