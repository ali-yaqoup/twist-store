"use client";

import { useEffect, useState } from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

function isStandalone() {
  if (typeof window === "undefined") return false;
  const mq = window.matchMedia("(display-mode: standalone)").matches;
  const ios =
    "standalone" in navigator &&
    Boolean((navigator as { standalone?: boolean }).standalone);
  return mq || ios;
}

export function AdminInstallGuide() {
  const [standalone, setStandalone] = useState(false);
  const [canPrompt, setCanPrompt] = useState(false);
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(
    null
  );
  const [host, setHost] = useState("");

  useEffect(() => {
    setStandalone(isStandalone());
    setHost(window.location.host);

    const onBip = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
      setCanPrompt(true);
    };
    window.addEventListener("beforeinstallprompt", onBip);
    return () => window.removeEventListener("beforeinstallprompt", onBip);
  }, []);

  const adminHostSuggested = host
    ? `admin.${host.replace(/^www\./, "").split(":")[0]}`
    : "admin.example.com";

  async function install() {
    if (!deferred) return;
    await deferred.prompt();
    await deferred.userChoice;
    setDeferred(null);
    setCanPrompt(false);
  }

  if (standalone) {
    return (
      <p className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2.5 text-xs text-emerald-300">
        التطبيق مفتوح كـ PWA للأدمن — تمام.
      </p>
    );
  }

  return (
    <div className="space-y-2 rounded-xl border border-brand/20 bg-night-card/80 px-3 py-2.5 text-xs text-stone-400">
      <p className="font-semibold text-stone-100">
        تثبيت اختصار الأدمن (منفصل عن المتجر)
      </p>
      <ol className="list-decimal space-y-1 pe-4 text-[11px] leading-relaxed">
        <li>
          مهم: افتح هذه الصفحة من{" "}
          <span className="text-stone-100">المتصفح</span>، مش من داخل تطبيق
          «TWIST».
        </li>
        <li>
          أندرويد Chrome: القائمة ⋮ ←{" "}
          <span className="text-stone-100">تثبيت التطبيق</span> أو «إضافة إلى
          الشاشة الرئيسية» — لازم يظهر الاسم{" "}
          <span className="text-stone-100">أدمن TWIST</span>.
        </li>
        <li>
          آيفون: من <span className="text-stone-100">Safari</span> فقط ← مشاركة
          ← إضافة إلى الشاشة الرئيسية.
        </li>
      </ol>
      {canPrompt && (
        <button
          type="button"
          onClick={install}
          className="btn-gold w-full !rounded-xl !py-2 text-xs"
        >
          تثبيت أدمن TWIST الآن
        </button>
      )}
      <p className="text-[11px] leading-relaxed text-stone-500">
        الأفضل لاحقاً: ربط نطاق فرعي{" "}
        <span className="font-mono text-stone-300" dir="ltr">
          {adminHostSuggested}
        </span>{" "}
        عشان التثبيت يفصل ١٠٠٪ عن تطبيق الزبائن.
      </p>
    </div>
  );
}
