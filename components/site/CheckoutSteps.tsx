const STEPS = [
  { id: 1, label: "السلة" },
  { id: 2, label: "البيانات" },
  { id: 3, label: "التأكيد" },
] as const;

export default function CheckoutSteps({ current }: { current: 1 | 2 | 3 }) {
  return (
    <nav aria-label="خطوات الطلب" className="mb-8 sm:mb-10">
      <ol className="flex items-center justify-center gap-2 sm:gap-4">
        {STEPS.map((step, i) => {
          const done = step.id < current;
          const active = step.id === current;
          return (
            <li key={step.id} className="flex items-center gap-2 sm:gap-4">
              <div className="flex flex-col items-center gap-1.5">
                <span
                  className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold transition-colors sm:h-10 sm:w-10 ${
                    active
                      ? "bg-brand text-black shadow-[0_0_20px_rgba(245,196,0,0.3)]"
                      : done
                        ? "border border-brand/40 bg-brand/15 text-brand"
                        : "border border-white/10 bg-night-card text-stone-500"
                  }`}
                >
                  {done ? "✓" : step.id}
                </span>
                <span
                  className={`text-[11px] font-medium sm:text-xs ${
                    active ? "text-brand" : done ? "text-stone-300" : "text-stone-500"
                  }`}
                >
                  {step.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <span
                  className={`mb-5 hidden h-px w-8 sm:block sm:w-12 ${
                    done ? "bg-brand/50" : "bg-white/10"
                  }`}
                  aria-hidden
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
