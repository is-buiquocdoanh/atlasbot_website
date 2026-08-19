import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { Product } from "@/types/product";
import { getCategoryByValue } from "@/lib/product-categories";
import { ProductPlaceholderIcon } from "./icons";

function formatVND(price: number) {
  return price.toLocaleString("vi-VN") + "đ";
}

export default function ProductCard({ product }: { product: Product }) {
  const categorySlug = getCategoryByValue(product.category)?.slug ?? "";
  const cover = product.images[0];

  return (
    <Link
      href={`/shop/${categorySlug}/${product.slug}`}
      className="block bg-surface rounded-lg overflow-hidden border border-line transition-all hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="relative aspect-square bg-surface-subtle">
        {cover ? (
          <Image
            src={cover.url}
            alt={cover.alt || product.name}
            fill
            sizes="(max-width: 700px) 50vw, 25vw"
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-ink-faint">
            <ProductPlaceholderIcon className="w-10 h-10" />
          </div>
        )}
      </div>
      <div className="p-4">
        <span className="text-xs text-ink-muted">{product.category}</span>
        <h2 className="font-medium mt-1 text-ink line-clamp-2 leading-snug">
          {product.name}
        </h2>
        <p className="font-mono font-semibold text-accent mt-2">
          {formatVND(product.price)}
        </p>
      </div>
    </Link>
  );
}
