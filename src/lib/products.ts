// TODO: Thay bằng truy vấn database/CMS thật (Sanity cho nội dung, Supabase
// cho tồn kho/giá — xem docs/giai-doan-3-chuan-bi-ky-thuat.md).

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { Product } from "@/types/product";
import { getCategoryBySlug } from "@/lib/product-categories";

// Mỗi sản phẩm là 1 folder riêng, co-located cùng ảnh của chính nó, nằm
// trong đúng folder danh mục (slug khớp PRODUCT_CATEGORIES):
//   public/products/<category-slug>/<slug>/index.md
//   public/products/<category-slug>/<slug>/01.png, 02.png, ...
// Giống hệt cách blog tách bài viết theo category (xem src/lib/cms.ts) — sửa
// sản phẩm nào chỉ cần vào đúng 1 folder, không phải lục nhiều nơi trong code.
const PRODUCTS_DIR = path.join(process.cwd(), "public", "products");

interface ProductFrontmatter {
  name: string;
  slug: string;
  sku: string;
  category: string;
  price: number;
  compareAtPrice?: number;
  stock: number;
  badge?: string;
  rating?: { average: number; count: number };
  images?: { file: string; alt: string }[];
  highlights: Product["highlights"];
  features?: Product["features"];
  specifications: Product["specifications"];
  videos?: Product["videos"];
  usageSteps?: Product["usageSteps"];
  variants?: Product["variants"];
}

// Ảnh chèn trong nội dung markdown (description) chỉ ghi tên file (co-located)
// — đổi thành URL đầy đủ trỏ vào đúng folder của sản phẩm đó. Đường dẫn tuyệt
// đối (bắt đầu bằng "/") hoặc URL ngoài (http...) giữ nguyên. Cùng cách làm
// với resolveAssetPath/resolveContentImages trong src/lib/cms.ts.
function resolveContentImages(markdown: string, assetBaseUrl: string): string {
  return markdown.replace(
    /!\[([^\]]*)\]\(([^)\s]+)\)/g,
    (match, alt, src) =>
      `![${alt}](${/^(https?:)?\//.test(src) ? src : `${assetBaseUrl}/${src}`})`
  );
}

function loadProductFromFolder(categorySlug: string, slug: string): Product | null {
  const indexPath = path.join(PRODUCTS_DIR, categorySlug, slug, "index.md");
  if (!fs.existsSync(indexPath)) return null;

  const raw = fs.readFileSync(indexPath, "utf-8");
  const { data, content } = matter(raw);
  const fm = data as ProductFrontmatter;

  const category = getCategoryBySlug(categorySlug);
  if (!category || category.value !== fm.category) {
    throw new Error(
      `Sản phẩm "${fm.name}" (${indexPath}) nằm trong folder danh mục "${categorySlug}" nhưng frontmatter.category là "${fm.category}" — hai giá trị này phải khớp. Kiểm tra lại folder chứa hoặc field category trong index.md.`
    );
  }

  const assetBaseUrl = `/products/${encodeURIComponent(categorySlug)}/${encodeURIComponent(slug)}`;

  return {
    id: fm.slug,
    name: fm.name,
    slug: fm.slug,
    sku: fm.sku,
    category: fm.category,
    price: fm.price,
    compareAtPrice: fm.compareAtPrice,
    stock: fm.stock,
    badge: fm.badge,
    rating: fm.rating,
    images: (fm.images ?? []).map((img) => ({
      url: `${assetBaseUrl}/${img.file}`,
      alt: img.alt,
    })),
    description: resolveContentImages(content.trim(), assetBaseUrl),
    features: fm.features,
    highlights: fm.highlights,
    specifications: fm.specifications,
    videos: fm.videos,
    usageSteps: fm.usageSteps,
    variants: fm.variants,
  };
}

function loadAllProducts(): Product[] {
  const products: Product[] = [];

  const categoryDirs = fs
    .readdirSync(PRODUCTS_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory());

  for (const categoryDir of categoryDirs) {
    const categoryPath = path.join(PRODUCTS_DIR, categoryDir.name);
    const productDirs = fs
      .readdirSync(categoryPath, { withFileTypes: true })
      .filter((entry) => entry.isDirectory());

    for (const productDir of productDirs) {
      const product = loadProductFromFolder(categoryDir.name, productDir.name);
      if (product) products.push(product);
    }
  }

  return products;
}

export async function getAllProducts(): Promise<Product[]> {
  return loadAllProducts();
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const products = await getAllProducts();
  return products.find((p) => p.slug === slug) ?? null;
}

// Lấy tối đa `limit` sản phẩm cùng category, loại trừ chính sản phẩm đang xem.
export async function getRelatedProducts(
  product: Product,
  limit = 4
): Promise<Product[]> {
  const products = await getAllProducts();
  return products
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, limit);
}

export { SHOP_ABOUT_CONTENT, SHOP_ABOUT_STATS } from "./shop-about";
