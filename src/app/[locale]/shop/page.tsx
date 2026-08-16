import { getTranslations } from "next-intl/server";
import { getAllProducts } from "@/lib/products";
import ProductCard from "@/components/shop/ProductCard";
import { PRODUCT_CATEGORIES } from "@/lib/product-categories";

export default async function ShopListPage({
  searchParams,
}: {
  searchParams: Promise<{
    category?: string | string[];
    minPrice?: string;
    maxPrice?: string;
  }>;
}) {
  const [t, products, params] = await Promise.all([
    getTranslations("Shop"),
    getAllProducts(),
    searchParams,
  ]);

  const selectedSlugs = Array.isArray(params.category)
    ? params.category
    : params.category
      ? [params.category]
      : [];
  const selectedValues: string[] = PRODUCT_CATEGORIES.filter((c) =>
    selectedSlugs.includes(c.slug)
  ).map((c) => c.value);

  const minPrice = params.minPrice ? Number(params.minPrice) : undefined;
  const maxPrice = params.maxPrice ? Number(params.maxPrice) : undefined;

  const filteredProducts = products.filter((product) => {
    if (selectedValues.length > 0 && !selectedValues.includes(product.category)) {
      return false;
    }
    if (minPrice !== undefined && product.price < minPrice) return false;
    if (maxPrice !== undefined && product.price > maxPrice) return false;
    return true;
  });

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">{t("title")}</h1>
      <div className="grid md:grid-cols-[220px_1fr] gap-8">
        <form method="get" className="space-y-6 h-fit bg-surface rounded-lg p-4">
          <div>
            <h2 className="font-semibold mb-3 text-sm">{t("filterTitle")}</h2>
            <div className="space-y-2">
              {PRODUCT_CATEGORIES.map((cat) => (
                <label
                  key={cat.slug}
                  className="flex items-center gap-2 text-sm text-muted"
                >
                  <input
                    type="checkbox"
                    name="category"
                    value={cat.slug}
                    defaultChecked={selectedSlugs.includes(cat.slug)}
                    className="rounded border-border"
                  />
                  {t(`categories.${cat.slug}`)}
                </label>
              ))}
            </div>
          </div>
          <div>
            <h2 className="font-semibold mb-3 text-sm">{t("priceRange")}</h2>
            <div className="flex items-center gap-2">
              <input
                type="number"
                name="minPrice"
                placeholder="Min"
                min={0}
                defaultValue={params.minPrice}
                className="w-full bg-background border border-border rounded-md px-2 py-1.5 text-sm"
              />
              <span className="text-muted">–</span>
              <input
                type="number"
                name="maxPrice"
                placeholder="Max"
                min={0}
                defaultValue={params.maxPrice}
                className="w-full bg-background border border-border rounded-md px-2 py-1.5 text-sm"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-primary text-white rounded-md py-2 text-sm hover:opacity-90"
          >
            {t("applyFilter")}
          </button>
        </form>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
