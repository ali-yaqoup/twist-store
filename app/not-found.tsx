import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <span className="font-display text-6xl font-extrabold tracking-[0.2em] text-brand text-glow">404</span>
      <div className="mx-auto mt-5 h-px w-16 bg-gradient-to-l from-transparent via-brand to-brand" />
      <h1 className="font-display mt-6 text-2xl font-extrabold text-stone-50">الصفحة غير موجودة</h1>
      <p className="mt-3 max-w-md text-stone-400">
        الرابط اللي دخلت عليه مش موجود أو المنتج اتشال من المتجر.
      </p>
      <Link href="/" className="btn-gold mt-8">
        العودة للرئيسية
      </Link>
    </div>
  );
}
