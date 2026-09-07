import type { Metadata } from "next";
import Link from "next/link";
import { getSiteSettings } from "@/lib/data";

export const revalidate = 120;
export const metadata: Metadata = { title: "سياسة الخصوصية" };

export default async function PrivacyPage() {
  const settings = await getSiteSettings();

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-16">
      <div className="text-center">
        <h1 className="font-display text-3xl font-extrabold text-stone-50 sm:text-4xl">
          سياسة الخصوصية
        </h1>
        <div className="mx-auto mt-5 h-px w-16 bg-gradient-to-l from-transparent via-brand to-brand" />
      </div>

      <div className="mt-10 space-y-8 text-sm leading-8 text-stone-300">
        <section>
          <h2 className="font-display text-lg font-extrabold text-stone-50">من نحن</h2>
          <p className="mt-2 text-stone-400">
            {settings.shop_name} متجر لتطريز وطباعة الملابس. نجمع الحد الأدنى من البيانات
            اللازمة لتجهيز طلبك أو الرد على رسالتك.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-extrabold text-stone-50">ما الذي نجمعه؟</h2>
          <ul className="mt-2 list-disc space-y-1 pr-5 text-stone-400">
            <li>عند الطلب: الاسم، رقم الهاتف، العنوان، ملاحظات اختيارية، وملف التصميم إن رفعته.</li>
            <li>عند التواصل: الاسم، رقم الهاتف، ونص الرسالة.</li>
            <li>السلة وقائمة الأمنيات تُحفظ على جهازك فقط (المتصفح) ولا تُرسل لنا إلا عند إتمام الطلب.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-lg font-extrabold text-stone-50">لماذا نستخدمها؟</h2>
          <p className="mt-2 text-stone-400">
            لتنفيذ الطلب، والتواصل معك للتأكيد والتوصيل، والرد على الاستفسارات.
            لا نبيع بياناتك ولا نشاركها مع معلنين.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-extrabold text-stone-50">أين تُحفظ؟</h2>
          <p className="mt-2 text-stone-400">
            الطلبات والرسائل تُحفظ في قاعدة بيانات المتجر (Supabase) ويصل إليها فريق الإدارة فقط.
            إن ضغطت واتساب، تنتقل المحادثة إلى تطبيق واتساب وفق سياسة ميتا.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-extrabold text-stone-50">الأداء</h2>
          <p className="mt-2 text-stone-400">
            قد نستخدم أداة أداء من الاستضافة (Vercel Speed Insights) لفهم سرعة الموقع —
            بدون إعلانات وبدون بيع بيانات تسويقية.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-extrabold text-stone-50">حقوقك</h2>
          <p className="mt-2 text-stone-400">
            تقدر تطلب تصحيح أو حذف بيانات طلبك أو رسالتك عبر صفحة التواصل.
            احذف السلة وقائمة الأمنيات من المتصفح متى ما حبيت.
          </p>
        </section>
      </div>

      <div className="mt-12 text-center">
        <Link href="/contact" className="btn-outline">
          تواصل معنا
        </Link>
      </div>
    </div>
  );
}
