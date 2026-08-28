import type { Metadata } from "next";

export const metadata: Metadata = { title: "قائمة الأمنيات" };

export default function WishlistLayout({
  children,
}: LayoutProps<"/wishlist">) {
  return children;
}
