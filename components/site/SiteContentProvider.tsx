"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { SiteSettings } from "@/lib/types";

const SiteContentContext = createContext<SiteSettings | null>(null);

export function SiteContentProvider({
  settings,
  children,
}: {
  settings: SiteSettings;
  children: ReactNode;
}) {
  return (
    <SiteContentContext.Provider value={settings}>
      {children}
    </SiteContentContext.Provider>
  );
}

export function useSiteSettings(): SiteSettings {
  const ctx = useContext(SiteContentContext);
  if (!ctx) throw new Error("useSiteSettings يجب أن يُستخدم داخل SiteContentProvider");
  return ctx;
}
