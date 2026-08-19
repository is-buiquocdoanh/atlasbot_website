import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { getProductBySlug, getRelatedProducts } from "@/lib/products";
import { getCategoryByValue, getCategoryBySlug } from "@/lib/product-categories";
import Breadcrumb from "@/components/shop/Breadcrumb";
import ProductGallery from "@/components/shop/ProductGallery";
import ProductInfo from "@/components/shop/ProductInfo";
import ProductTabs from "@/components/shop/ProductTabs";
import RelatedProducts from "@/components/shop/RelatedProducts";

interface Params {
  locale: string;
  category: string;
  slug: string;
}

async function loadProduct(category: string, slug: string) {
  const product = await getProductBySlug(slug);
  if (!product) return null;
  // Category trên URL phải khớp đúng category thật của sản phẩm — tránh
  // cùng một sản phẩm truy cập được qua nhiều URL khác nhau (trùng nội dung).
  const productCategorySlug = getCategoryByValue(product.category)?.slug;
  if (!productCategorySlug || productCategorySlug !== category) return null;
  return product;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { category, slug } = await params;
  const product = await loadProduct(category, slug);
  if (!product) return {};
  return {
    title: `${product.name} — Atlasbot Shop`,
    description: product.description.slice(0, 160),
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { category, slug } = await params;
  const [t, tCategories, product] = await Promise.all([
    getTranslations("Shop"),
    getTranslations("Shop.categories"),
    loadProduct(category, slug),
  ]);
  if (!product) return notFound();

  const categoryMeta = getCategoryBySlug(category);
  const categoryLabel = categoryMeta ? tCategories(categoryMeta.slug) : product.category;
  const related = await getRelatedProducts(product);

  return (
    <div>
      <Breadcrumb
        items={[
          { label: t("detail.breadcrumbHome"), href: "/" },
          { label: t("detail.breadcrumbShop"), href: "/shop" },
          { label: categoryLabel, href: `/shop?category=${category}` },
          { label: product.name },
        ]}
      />

      <div className="grid min-[900px]:grid-cols-[55%_45%] gap-10">
        <ProductGallery images={product.images} productName={product.name} />
        <ProductInfo product={product} />
      </div>

      <ProductTabs product={product} />

      <RelatedProducts products={related} />
    </div>
  );
}
