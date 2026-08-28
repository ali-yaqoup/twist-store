import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "إدارة TWIST",
    template: "%s | إدارة TWIST",
  },
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
