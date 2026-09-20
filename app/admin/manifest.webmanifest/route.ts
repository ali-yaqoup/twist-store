import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function isAdminHost(host: string) {
  const hostname = host.split(":")[0]?.toLowerCase() || "";
  return hostname === "admin.localhost" || hostname.startsWith("admin.");
}

const icons = [
  {
    src: "/icons/icon-192.png",
    sizes: "192x192",
    type: "image/png",
  },
  {
    src: "/icons/icon-512.png",
    sizes: "512x512",
    type: "image/png",
  },
  {
    src: "/icons/icon-512-maskable.png",
    sizes: "512x512",
    type: "image/png",
    purpose: "maskable",
  },
];

export function GET(request: Request) {
  const host = request.headers.get("host") || "";
  const onAdminHost = isAdminHost(host);

  // On admin.* subdomain the app owns the whole origin → start at "/".
  // On the main domain, use a distinct id + /admin start so it can install
  // separately from the customer PWA (id: /twist-shop).
  const manifest = onAdminHost
    ? {
        id: "/twist-admin",
        name: "أدمن TWIST",
        short_name: "أدمن TWIST",
        description: "لوحة تحكم طلبات وإعدادات متجر TWIST.",
        start_url: "/?source=pwa",
        scope: "/",
        display: "standalone" as const,
        orientation: "portrait" as const,
        background_color: "#000000",
        theme_color: "#000000",
        lang: "ar",
        dir: "rtl" as const,
        categories: ["business", "productivity"],
        icons,
      }
    : {
        id: "/twist-admin",
        name: "أدمن TWIST",
        short_name: "أدمن TWIST",
        description: "لوحة تحكم طلبات وإعدادات متجر TWIST.",
        start_url: "/admin?source=pwa",
        scope: "/admin",
        display: "standalone" as const,
        orientation: "portrait" as const,
        background_color: "#000000",
        theme_color: "#000000",
        lang: "ar",
        dir: "rtl" as const,
        categories: ["business", "productivity"],
        icons,
      };

  return NextResponse.json(manifest, {
    headers: {
      "Content-Type": "application/manifest+json; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
