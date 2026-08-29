import Image from "next/image";
import Link from "next/link";
import { categoryImageSrc } from "@/lib/category-images";
import type { Category } from "@/lib/types";

export default function CategoryCard({ category }: { category: Category }) {
  const src = categoryImageSrc(category);

  return (
    <Link
      href={`/products?category=${category.slug}`}
      className="group card-hover-lift relative isolate aspect-[3/4] overflow-hidden rounded-xl border border-brand/18 bg-night-card hover:border-brand/40 hover:shadow-[0_16px_40px_rgba(0,0,0,0.45),0_0_20px_rgba(245,196,0,0.08)]"
    >
      <Image
        src={src}
        alt={category.name}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
        className="object-cover object-center brightness-[0.78] contrast-[1.1] saturate-[0.88] transition-[transform,filter] duration-700 ease-out group-hover:scale-105 group-hover:brightness-[0.88] group-hover:saturate-100"
      />
      <span
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/95 via-black/45 to-black/15"
        aria-hidden
      />
      <span
        className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/5"
        aria-hidden
      />

      <span className="absolute inset-x-0 bottom-0 z-10 flex flex-col items-center px-3 pb-5 pt-14 sm:pb-6">
        <span className="font-display heading-ar text-center text-sm font-bold tracking-wide text-stone-50 transition-colors duration-300 group-hover:text-brand sm:text-base">
          {category.name}
        </span>
        <span className="mt-2.5 h-px w-8 bg-brand/70 transition-all duration-300 group-hover:w-16" />
      </span>
    </Link>
  );
}
