import Image from "next/image";
import Link from "next/link";
import { categoryImageSrc } from "@/lib/category-images";
import type { Category } from "@/lib/types";

export default function CategoryCard({ category }: { category: Category }) {
  const src = categoryImageSrc(category);

  return (
    <Link
      href={`/products?category=${category.slug}`}
      className="group relative isolate aspect-[3/4] overflow-hidden rounded-xl border border-brand/18 bg-night-card"
    >
      <Image
        src={src}
        alt={category.name}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
        className="object-cover object-center brightness-[0.82] contrast-[1.08] saturate-[0.92] transition-[transform,filter] duration-700 ease-out group-hover:scale-110 group-hover:brightness-90"
      />
      <span
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/20"
        aria-hidden
      />

      <span className="absolute inset-x-0 bottom-0 z-10 flex flex-col items-center px-3 pb-5 pt-12">
        <span className="font-display text-center text-sm font-bold tracking-wide text-balance text-stone-50 transition-colors group-hover:text-brand sm:text-base">
          {category.name}
        </span>
        <span className="mt-2 h-px w-8 bg-brand/70 transition-all duration-300 group-hover:w-14" />
      </span>
    </Link>
  );
}
