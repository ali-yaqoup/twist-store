import Image from "next/image";
import Link from "next/link";
import HeroBanner from "@/components/site/HeroBanner";
import ProductCard from "@/components/site/ProductCard";
import SectionTitle from "@/components/site/SectionTitle";
import {
  getCategories,
  getFeaturedProducts,
  getGalleryImages,
  getHeroSlides,
  getSiteSettings,
  getTestimonials,
} from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [settings, slides, categories, featured, gallery, testimonials] =
    await Promise.all([
      getSiteSettings(),
      getHeroSlides(),
      getCategories(),
      getFeaturedProducts(8),
      getGalleryImages(6),
      getTestimonials(),
    ]);

  return (
    <>
      <HeroBanner slides={slides} settings={settings} />

      {categories.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <SectionTitle title={settings.categories_title} />
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/products?category=${cat.slug}`}
                className="group flex flex-col items-center gap-3 rounded-2xl border border-white/10 bg-night-card p-6 transition-all hover:border-brand/60 hover:shadow-[0_0_24px_rgba(245,196,0,0.1)]"
              >
                <span className="text-4xl transition-transform group-hover:scale-110">
                  {cat.icon || "✨"}
                </span>
                <span className="font-bold text-stone-200 transition-colors group-hover:text-brand">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <SectionTitle
          title={settings.featured_title}
          subtitle={settings.featured_subtitle}
        />
        {featured.length > 0 ? (
          <>
            <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
              {featured.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            <div className="mt-10 text-center">
              <Link
                href="/products"
                className="inline-block rounded-full border border-brand px-8 py-3 font-bold text-brand transition-all hover:bg-brand hover:text-black"
              >
                {settings.featured_cta}
              </Link>
            </div>
          </>
        ) : (
          <p className="rounded-2xl border border-dashed border-white/15 py-16 text-center text-stone-500">
            {settings.products_empty}
          </p>
        )}
      </section>

      {gallery.length > 0 && (
        <section className="bg-night-soft py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <SectionTitle
              title={settings.gallery_title}
              subtitle={settings.gallery_subtitle}
            />
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {gallery.map((img) => (
                <figure
                  key={img.id}
                  className="group relative aspect-square overflow-hidden rounded-2xl border border-white/10"
                >
                  <Image
                    src={img.image_url}
                    alt={img.caption ?? settings.gallery_title}
                    fill
                    sizes="(max-width: 640px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {img.caption && (
                    <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent p-4 pt-10 text-sm font-medium text-stone-100">
                      {img.caption}
                    </figcaption>
                  )}
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="grid items-center gap-10 rounded-3xl border border-white/10 bg-gradient-to-l from-night-card to-night-soft p-8 sm:p-12 md:grid-cols-2">
          <div>
            <h2 className="text-3xl font-black text-stone-50">
              {settings.home_about_title}
            </h2>
            <p className="mt-5 leading-8 text-stone-400">{settings.home_about_text}</p>
            {settings.home_about_bullets.length > 0 && (
              <ul className="mt-6 space-y-3 text-sm text-stone-300">
                {settings.home_about_bullets.map((f) => (
                  <li key={f} className="flex items-center gap-3">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand/15 text-xs text-brand">
                      ✓
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
            )}
            <Link
              href="/about"
              className="mt-8 inline-block rounded-full border border-brand px-6 py-2.5 text-sm font-bold text-brand transition-all hover:bg-brand hover:text-black"
            >
              {settings.home_about_cta}
            </Link>
          </div>
          <div className="flex items-center justify-center">
            {settings.logo_url ? (
              <div className="relative aspect-square w-full max-w-xs overflow-hidden rounded-full border-2 border-brand/40">
                <Image
                  src={settings.logo_url}
                  alt={settings.shop_name}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="flex aspect-square w-full max-w-xs items-center justify-center rounded-full border-2 border-dashed border-brand/40 bg-[radial-gradient(circle,rgba(245,196,0,0.08),transparent_70%)]">
                <span className="px-4 text-center text-5xl font-black tracking-widest text-brand text-glow sm:text-6xl">
                  {settings.shop_name}
                </span>
              </div>
            )}
          </div>
        </div>
      </section>

      {testimonials.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6">
          <SectionTitle title={settings.testimonials_title} />
          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((t) => (
              <blockquote
                key={t.id}
                className="rounded-2xl border border-white/10 bg-night-card p-6"
              >
                <div className="mb-3 text-brand" aria-hidden>
                  {"★".repeat(t.rating)}
                </div>
                <p className="text-sm leading-7 text-stone-300">“{t.quote}”</p>
                <footer className="mt-4 text-sm font-bold text-brand">— {t.name}</footer>
              </blockquote>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
