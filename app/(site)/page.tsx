import Image from "next/image";
import Link from "next/link";
import HeroBanner from "@/components/site/HeroBanner";
import ProductCard from "@/components/site/ProductCard";
import CategoryCard from "@/components/site/CategoryCard";
import SectionTitle from "@/components/site/SectionTitle";
import TwistLogo from "@/components/site/TwistLogo";
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
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:py-20">
          <SectionTitle title={settings.categories_title} />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-5">
            {categories.map((cat) => (
              <CategoryCard key={cat.id} category={cat} />
            ))}
          </div>
        </section>
      )}

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-16">
        <SectionTitle
          title={settings.featured_title}
          subtitle={settings.featured_subtitle}
        />
        {featured.length > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
              {featured.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            <div className="mt-12 text-center">
              <Link href="/products" className="btn-outline">
                {settings.featured_cta}
              </Link>
            </div>
          </>
        ) : (
          <p className="card-luxe py-16 text-center text-stone-500">
            {settings.products_empty}
          </p>
        )}
      </section>

      {gallery.length > 0 && (
        <section className="mt-8 bg-night-soft py-12 sm:py-16 lg:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <SectionTitle
              title={settings.gallery_title}
              subtitle={settings.gallery_subtitle}
            />
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
              {gallery.map((img) => (
                <figure
                  key={img.id}
                  className="group relative aspect-square overflow-hidden rounded-xl border border-brand/14"
                >
                  <Image
                    src={img.image_url}
                    alt={img.caption ?? settings.gallery_title}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
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

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:py-20">
        <div className="grid items-center gap-8 overflow-hidden rounded-2xl border border-brand/18 bg-night-card p-5 sm:gap-10 sm:p-8 md:grid-cols-2 md:p-12">
          <div className="min-w-0">
            <h2 className="font-display text-2xl font-extrabold text-balance text-stone-50 sm:text-3xl">
              {settings.home_about_title}
            </h2>
            <div className="mt-4 h-px w-16 bg-gradient-to-l from-transparent via-brand to-brand" />
            <p className="mt-5 leading-8 text-stone-400">{settings.home_about_text}</p>
            {settings.home_about_bullets.length > 0 && (
              <ul className="mt-6 space-y-3 text-sm text-stone-300">
                {settings.home_about_bullets.map((f) => (
                  <li key={f} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-brand/30 bg-brand/10 text-[10px] text-brand">
                      ✓
                    </span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            )}
            <Link href="/about" className="btn-outline mt-8">
              {settings.home_about_cta}
            </Link>
          </div>
          <div className="flex items-center justify-center">
            {settings.logo_url ? (
              <div className="relative aspect-square w-full max-w-xs overflow-hidden rounded-full border border-brand/35">
                <Image
                  src={settings.logo_url}
                  alt={settings.shop_name}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="flex aspect-square w-full max-w-xs items-center justify-center rounded-full border border-brand/30 bg-[radial-gradient(circle,rgba(245,196,0,0.1),transparent_70%)]">
                <TwistLogo name={settings.shop_name} size="lg" />
              </div>
            )}
          </div>
        </div>
      </section>

      {testimonials.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 sm:pb-24">
          <SectionTitle title={settings.testimonials_title} />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((t) => (
              <blockquote
                key={t.id}
                className="card-luxe p-6"
              >
                <div className="mb-3 text-xs tracking-[0.2em] text-brand" aria-hidden>
                  {"★".repeat(t.rating)}
                </div>
                <p className="text-sm leading-7 text-stone-300">“{t.quote}”</p>
                <footer className="mt-5 text-sm font-bold text-brand">— {t.name}</footer>
              </blockquote>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
