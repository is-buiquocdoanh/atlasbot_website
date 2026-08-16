import { Link } from "@/i18n/navigation";
import { Product } from "@/types/product";

function formatVND(price: number) {
  return price.toLocaleString("vi-VN") + "đ";
}

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/shop/${product.slug}`}
      className="block bg-surface rounded-lg overflow-hidden hover:opacity-90"
    >
      <div className="aspect-square bg-border" />
      <div className="p-4">
        <span className="text-xs text-muted">{product.category}</span>
        <h2 className="font-semibold mt-1 text-foreground">{product.name}</h2>
        <p className="text-accent font-semibold mt-2">
          {formatVND(product.price)}
        </p>
      </div>
    </Link>
  );
}
