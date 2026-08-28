import type { Metadata } from "next";
import { Tajawal } from "next/font/google";
import "./globals.css";
import { getSiteSettings } from "@/lib/data";

const tajawal = Tajawal({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "700", "800", "900"],
  variable: "--font-tajawal",
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
    <html lang="ar" dir="rtl" className={`${tajawal.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-night text-stone-100">
        {children}
      </body>
    </html>
  );
}
