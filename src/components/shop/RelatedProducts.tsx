import { getTranslations } from "next-intl/server";
import { Product } from "@/types/product";
import ProductCard from "./ProductCard";

export default async function RelatedProducts({ products }: { products: Product[] }) {
  if (products.length === 0) return null;
  const t = await getTranslations("Shop.detail");

  return (
    <section className="mt-16">
      <h2 className="font-display text-xl font-bold text-ink mb-6">{t("relatedTitle")}</h2>
      <div className="grid grid-cols-2 min-[700px]:grid-cols-4 gap-4 min-[700px]:gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
