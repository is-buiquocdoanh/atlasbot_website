import { getTranslations } from "next-intl/server";
import { getProductBySlug } from "@/lib/products";
import { notFound } from "next/navigation";

function formatVND(price: number) {
  return price.toLocaleString("vi-VN") + "đ";
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [t, product] = await Promise.all([
    getTranslations("Shop"),
    getProductBySlug(slug),
  ]);
  if (!product) return notFound();

  return (
    <div className="grid md:grid-cols-2 gap-10">
      <div className="aspect-square bg-surface rounded-lg" />
      <div>
        <span className="text-xs text-muted">{product.category}</span>
        <h1 className="text-2xl font-bold mt-1 mb-4">{product.name}</h1>
        <p className="text-accent text-xl font-semibold mb-6">
          {formatVND(product.price)}
        </p>
        <p className="text-muted mb-6">{product.description}</p>

        <ul className="space-y-1 mb-8">
          {product.specs.map((spec) => (
            <li key={spec.label} className="text-sm">
              <span className="text-muted">{spec.label}:</span> {spec.value}
            </li>
          ))}
        </ul>

        {/* TODO: nối logic thêm vào giỏ hàng (Context/Zustand) — Giai đoạn 5 */}
        <button className="bg-primary text-white px-6 py-3 rounded-lg w-full md:w-auto hover:opacity-90">
          {t("addToCart")}
        </button>
      </div>
    </div>
  );
}
