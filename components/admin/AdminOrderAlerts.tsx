"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { formatPrice } from "@/lib/config";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/client";
import type { Order } from "@/lib/types";

const ALERTS_KEY = "twist-admin-order-alerts";

type ToastOrder = {
  id: string;
  customer_name: string;
  customer_phone: string;
  total_price: number;
};

type AlertsContextValue = {
  enabled: boolean;
  enableAlerts: () => Promise<void>;
  disableAlerts: () => void;
};

const AlertsContext = createContext<AlertsContextValue | null>(null);

function playOrderChime() {
  try {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;

    const beep = (freq: number, start: number, dur: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(0.12, start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + dur);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(start);
      osc.stop(start + dur + 0.02);
    };

    beep(880, now, 0.16);
    beep(1175, now + 0.14, 0.22);

    window.setTimeout(() => {
      void ctx.close();
    }, 600);
  } catch {
    /* ignore */
  }
}

function notifyBrowser(order: ToastOrder) {
  if (typeof window === "undefined" || !("Notification" in window)) return;
  if (Notification.permission !== "granted") return;

  try {
    const n = new Notification("طلب جديد — TWIST", {
      body: `${order.customer_name} · ${order.customer_phone} · ${formatPrice(order.total_price)}`,
      tag: `order-${order.id}`,
      icon: "/icons/icon-192.png",
      badge: "/icons/favicon-32.png",
      lang: "ar",
      dir: "rtl",
    });
    n.onclick = () => {
      window.focus();
      window.location.href = `/admin/orders/${order.id}`;
      n.close();
    };
  } catch {
    /* ignore */
  }
}

export function AdminOrderAlertsProvider({
  onPendingDelta,
  children,
}: {
  onPendingDelta: (delta: number) => void;
  children: ReactNode;
}) {
  const router = useRouter();
  const [enabled, setEnabled] = useState(false);
  const [ready, setReady] = useState(false);
  const [toast, setToast] = useState<ToastOrder | null>(null);
  const toastTimer = useRef<number | null>(null);
  const onPendingDeltaRef = useRef(onPendingDelta);
  onPendingDeltaRef.current = onPendingDelta;

  useEffect(() => {
    try {
      setEnabled(localStorage.getItem(ALERTS_KEY) === "1");
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  const enableAlerts = useCallback(async () => {
    playOrderChime();
    if ("Notification" in window && Notification.permission === "default") {
      try {
        await Notification.requestPermission();
      } catch {
        /* ignore */
      }
    }
    try {
      localStorage.setItem(ALERTS_KEY, "1");
    } catch {
      /* ignore */
    }
    setEnabled(true);
  }, []);

  const disableAlerts = useCallback(() => {
    try {
      localStorage.setItem(ALERTS_KEY, "0");
    } catch {
      /* ignore */
    }
    setEnabled(false);
  }, []);

  useEffect(() => {
    if (!ready || !enabled || !isSupabaseConfigured()) return;

    const supabase = createClient();
    const channel = supabase
      .channel("admin-order-alerts")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "orders" },
        (payload) => {
          const row = payload.new as Order;
          if (!row?.id) return;

          if (row.status === "pending") {
            onPendingDeltaRef.current(1);
          }

          const toastOrder: ToastOrder = {
            id: row.id,
            customer_name: row.customer_name,
            customer_phone: row.customer_phone,
            total_price: Number(row.total_price) || 0,
          };

          playOrderChime();
          try {
            navigator.vibrate?.(180);
          } catch {
            /* ignore */
          }
          notifyBrowser(toastOrder);

          setToast(toastOrder);
          if (toastTimer.current) window.clearTimeout(toastTimer.current);
          toastTimer.current = window.setTimeout(() => setToast(null), 12000);

          router.refresh();
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "orders" },
        () => {
          router.refresh();
        }
      )
      .subscribe();

    return () => {
      if (toastTimer.current) window.clearTimeout(toastTimer.current);
      void supabase.removeChannel(channel);
    };
  }, [ready, enabled, router]);

  const value = useMemo(
    () => ({ enabled, enableAlerts, disableAlerts }),
    [enabled, enableAlerts, disableAlerts]
  );

  return (
    <AlertsContext.Provider value={value}>
      {children}

      {toast && (
        <div
          role="status"
          className="fixed inset-x-3 bottom-24 z-[70] mx-auto max-w-md rounded-2xl border border-brand/35 bg-night-card p-4 shadow-[0_0_40px_rgba(245,196,0,0.18)] lg:bottom-8 lg:start-auto lg:end-8 lg:inset-x-auto"
        >
          <p className="text-[11px] font-extrabold tracking-[0.16em] text-brand">
            طلب جديد
          </p>
          <p className="mt-1 font-display text-lg font-extrabold text-stone-50">
            {toast.customer_name}
          </p>
          <p className="mt-0.5 text-sm text-stone-400" dir="ltr">
            {toast.customer_phone} · {formatPrice(toast.total_price)}
          </p>
          <div className="mt-3 flex gap-2">
            <Link
              href={`/admin/orders/${toast.id}`}
              onClick={() => setToast(null)}
              className="btn-gold flex-1 !rounded-xl !py-2 text-center text-xs"
            >
              فتح الطلب
            </Link>
            <button
              type="button"
              onClick={() => setToast(null)}
              className="rounded-xl border border-white/10 px-3 py-2 text-xs font-bold text-stone-400 hover:text-stone-200"
            >
              إغلاق
            </button>
          </div>
        </div>
      )}
    </AlertsContext.Provider>
  );
}

/** Always-visible toggle — place in the admin sidebar / mobile menu. */
export function AdminAlertsToggle() {
  const ctx = useContext(AlertsContext);
  if (!ctx) return null;

  const { enabled, enableAlerts, disableAlerts } = ctx;

  return (
    <button
      type="button"
      onClick={() => {
        if (enabled) disableAlerts();
        else void enableAlerts();
      }}
      className={`flex min-h-11 w-full items-center justify-center gap-2 rounded-xl px-3 text-sm font-bold transition-colors ${
        enabled
          ? "border border-emerald-500/35 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/15"
          : "border border-brand/40 bg-brand/10 text-brand hover:bg-brand/20"
      }`}
    >
      {enabled ? "التنبيهات شغّالة ✓" : "تفعيل تنبيهات الطلبات"}
    </button>
  );
}

/** Big card at the top of admin pages until alerts are enabled. */
export function AdminAlertsBanner() {
  const ctx = useContext(AlertsContext);
  if (!ctx || ctx.enabled) return null;

  return (
    <div className="mb-5 rounded-2xl border border-brand/35 bg-brand/10 px-4 py-4 sm:px-5">
      <p className="font-display text-base font-extrabold text-stone-50">
        تنبيهات الطلبات الجديدة
      </p>
      <p className="mt-1 text-sm leading-7 text-stone-300">
        فعّل الإشعارات عشان يوصلك صوت وتنبيه أول ما يطلب زبون — وأنت فاتح لوحة
        الإدارة.
      </p>
      <button
        type="button"
        onClick={() => void ctx.enableAlerts()}
        className="btn-gold mt-3 !rounded-xl !px-5 !py-2.5 text-sm"
      >
        تفعيل تنبيهات الطلبات الآن
      </button>
    </div>
  );
}
