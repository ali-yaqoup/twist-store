import Link from "next/link";
import TwistLogo from "@/components/site/TwistLogo";

export default function OfflinePage() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-lg flex-col items-center justify-center gap-5 px-4 text-center">
      <TwistLogo name="TWIST" size="lg" />
      <h1 className="font-display text-2xl font-extrabold text-stone-100">
        أنت غير متصل
      </h1>
      <p className="leading-relaxed text-stone-400">
        تحقق من الإنترنت ثم حاول مرة أخرى. بعض الصفحات المحفوظة قد تبقى متاحة
        بدون اتصال.
      </p>
      <Link href="/" className="btn-gold !rounded-xl px-5 py-3">
        العودة للرئيسية
      </Link>
    </div>
  );
}
