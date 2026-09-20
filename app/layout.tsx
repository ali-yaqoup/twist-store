import type { Metadata, Viewport } from "next";
import { Cairo, Tajawal } from "next/font/google";
import "./globals.css";
import { getSiteSettings } from "@/lib/data";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ConditionalSerwist } from "@/components/ConditionalSerwist";

const tajawal = Tajawal({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "700", "800", "900"],
  variable: "--font-tajawal",
});

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["400", "600", "700", "800", "900"],
  variable: "--font-cairo",
});

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSiteSettings();
  return {
    title: {
      default: `${s.shop_name} | تطريز وطباعة على الملابس`,
      template: `%s | ${s.shop_name}`,
    },
    description:
      s.footer_blurb ||
      `${s.shop_name} — براند متخصص بالتطريز والطباعة على الملابس.`,
    applicationName: s.shop_name || "TWIST",
    appleWebApp: {
      capable: true,
      statusBarStyle: "black",
      title: s.shop_name || "TWIST",
    },
    icons: {
      icon: [
        { url: "/icons/favicon-32.png", sizes: "32x32", type: "image/png" },
        { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
        { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      ],
      apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180" }],
      shortcut: ["/icons/icon-192.png"],
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#000000",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ar" dir="rtl" className={`${tajawal.variable} ${cairo.variable} h-full overflow-x-hidden antialiased`}>
      <body className="flex min-h-full max-w-full flex-col overflow-x-hidden bg-night text-stone-100">
        <ConditionalSerwist>
          {children}
        </ConditionalSerwist>
        <SpeedInsights />
      </body>
    </html>
  );
}
