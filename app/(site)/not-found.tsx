import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <span className="text-6xl font-black text-brand text-glow">404</span>
      <h1 className="mt-6 text-2xl font-black text-stone-50">الصفحة غير موجودة</h1>
      <p className="mt-3 max-w-md text-stone-400">
        الرابط اللي دخلت عليه مش موجود أو المنتج اتشال من المتجر.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-full bg-brand px-8 py-3 font-extrabold text-black transition-colors hover:bg-brand-soft"
      >
        العودة للرئيسية
      </Link>
    </div>
  );
}
