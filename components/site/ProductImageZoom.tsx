"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const ZOOM = 3;

export default function ProductImageZoom({
  src,
  alt,
  children,
}: {
  src: string;
  alt: string;
  children?: React.ReactNode;
}) {
  const frameRef = useRef<HTMLDivElement>(null);
  const lensRef = useRef<HTMLDivElement>(null);
  const paneRef = useRef<HTMLDivElement>(null);
  const enabledRef = useRef(false);
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const sync = () => {
      enabledRef.current = mq.matches;
      setEnabled(mq.matches);
      if (!mq.matches) setHovering(false);
    };
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  function moveLens(event: React.MouseEvent<HTMLDivElement>) {
    if (!enabledRef.current) return;
    const frame = frameRef.current;
    const lens = lensRef.current;
    const pane = paneRef.current;
    if (!frame || !lens || !pane) return;

    const rect = frame.getBoundingClientRect();
    if (rect.width < 8 || rect.height < 8) return;

    const x = Math.min(Math.max(event.clientX - rect.left, 0), rect.width);
    const y = Math.min(Math.max(event.clientY - rect.top, 0), rect.height);
    const lensW = rect.width / ZOOM;
    const lensH = rect.height / ZOOM;
    const left = Math.min(Math.max(0, x - lensW / 2), rect.width - lensW);
    const top = Math.min(Math.max(0, y - lensH / 2), rect.height - lensH);

    lens.style.width = `${lensW}px`;
    lens.style.height = `${lensH}px`;
    lens.style.transform = `translate(${left}px, ${top}px)`;
    pane.style.backgroundPosition = `${(x / rect.width) * 100}% ${(y / rect.height) * 100}%`;
    setHovering(true);
  }

  return (
    <div className="relative">
      <div
        ref={frameRef}
        className={`image-frame relative aspect-[4/5] sm:aspect-square ${enabled ? "cursor-zoom-in" : ""}`}
        onMouseEnter={() => enabledRef.current && setHovering(true)}
        onMouseLeave={() => setHovering(false)}
        onMouseMove={moveLens}
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover"
          priority
        />
        {enabled && (
          <div
            ref={lensRef}
            aria-hidden
            className={`pointer-events-none absolute top-0 left-0 z-[2] rounded-sm border border-white/70 bg-white/25 shadow-[0_0_0_1px_rgba(0,0,0,0.2)] ${
              hovering ? "opacity-100" : "opacity-0"
            }`}
          />
        )}
        {children}
      </div>

      {enabled && (
        <div
          ref={paneRef}
          aria-hidden
          className={`pointer-events-none absolute top-4 right-full z-40 mr-3 h-52 w-52 overflow-hidden rounded-xl border border-brand/30 bg-night-soft shadow-[0_16px_48px_rgba(0,0,0,0.7)] xl:h-60 xl:w-60 ${
            hovering ? "opacity-100" : "opacity-0"
          }`}
          style={{
            backgroundImage: `url("${src.replace(/"/g, "")}")`,
            backgroundRepeat: "no-repeat",
            backgroundSize: `${ZOOM * 100}%`,
            backgroundPosition: "50% 50%",
          }}
        />
      )}
    </div>
  );
}
