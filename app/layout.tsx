import type { Metadata } from "next";
import { Cairo, Tajawal } from "next/font/google";
import "./globals.css";
import { getSiteSettings } from "@/lib/data";
import { SpeedInsights } from "@vercel/speed-insights/next";

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
  };
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ar" dir="rtl" className={`${tajawal.variable} ${cairo.variable} h-full overflow-x-hidden antialiased`}>
      <body className="flex min-h-full max-w-full flex-col overflow-x-hidden bg-night text-stone-100">
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
