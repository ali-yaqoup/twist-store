import { CartProvider } from "@/components/cart/CartProvider";
import { WishlistProvider } from "@/components/wishlist/WishlistProvider";
import { SiteContentProvider } from "@/components/site/SiteContentProvider";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import { getSiteSettings } from "@/lib/data";

export default async function SiteLayout({ children }: LayoutProps<"/">) {
  const settings = await getSiteSettings();

  return (
    <SiteContentProvider settings={settings}>
      <CartProvider>
        <WishlistProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer settings={settings} />
        </WishlistProvider>
      </CartProvider>
    </SiteContentProvider>
  );
}
