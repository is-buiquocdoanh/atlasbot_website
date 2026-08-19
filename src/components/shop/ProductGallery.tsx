"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { ProductImage } from "@/types/product";
import { ProductPlaceholderIcon } from "./icons";

function ChevronIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d={direction === "left" ? "M15 18l-6-6 6-6" : "M9 18l6-6-6-6"} />
    </svg>
  );
}

export default function ProductGallery({
  images,
  productName,
}: {
  images: ProductImage[];
  productName: string;
}) {
  const t = useTranslations("Shop.detail");
  const [index, setIndex] = useState(0);

  // Chưa có ảnh (mảng rỗng hoặc field null) — fallback không để vỡ layout,
  // xem docs/product-detail-page-spec.md mục 3.2.
  if (images.length === 0) {
    return (
      <div className="min-[900px]:sticky min-[900px]:top-6">
        <div className="aspect-square rounded-card border border-dashed border-line bg-surface-subtle flex flex-col items-center justify-center gap-3">
          <ProductPlaceholderIcon className="w-16 h-16 text-ink-faint" />
          <span className="text-xs text-ink-faint px-4 text-center">{t("imagePlaceholder")}</span>
        </div>
      </div>
    );
  }

  const current = images[index];
  const hasMultiple = images.length > 1;

  function goTo(i: number) {
    setIndex((i + images.length) % images.length);
  }

  return (
    <div className="min-[900px]:sticky min-[900px]:top-6">
      <div className="relative aspect-square rounded-card overflow-hidden border border-line bg-surface">
        <Image
          src={current.url}
          alt={current.alt || productName}
          fill
          sizes="(max-width: 900px) 100vw, 55vw"
          className="object-contain"
          priority
        />
        {hasMultiple && (
          <>
            <button
              type="button"
              onClick={() => goTo(index - 1)}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-background/90 border border-line flex items-center justify-center text-ink hover:text-primary hover:border-primary transition-colors"
            >
              <ChevronIcon direction="left" />
            </button>
            <button
              type="button"
              onClick={() => goTo(index + 1)}
              aria-label="Next image"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-background/90 border border-line flex items-center justify-center text-ink hover:text-primary hover:border-primary transition-colors"
            >
              <ChevronIcon direction="right" />
            </button>
          </>
        )}
      </div>

      {hasMultiple && (
        <div className="flex justify-center gap-1.5 mt-3">
          {images.map((img, i) => (
            <button
              key={img.url + i}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Ảnh ${i + 1}/${images.length}`}
              aria-current={i === index}
              className={`h-1.5 rounded-full transition-all ${
                i === index ? "w-6 bg-primary" : "w-1.5 bg-line hover:bg-ink-faint"
              }`}
            />
          ))}
        </div>
      )}

      {hasMultiple && (
        <div className="grid grid-cols-4 min-[900px]:grid-cols-5 gap-2 mt-3">
          {images.map((img, i) => (
            <button
              key={img.url + i}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Xem ảnh ${i + 1}`}
              aria-current={i === index}
              className={`relative aspect-square rounded-md overflow-hidden border-2 transition-colors ${
                i === index ? "border-primary" : "border-line hover:border-ink-faint"
              }`}
            >
              <Image src={img.url} alt={img.alt || productName} fill sizes="80px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
