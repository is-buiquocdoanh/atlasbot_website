export interface ProductImage {
  url: string;
  alt: string;
}

export interface ProductHighlight {
  icon: string;
  label: string;
  value: string;
}

export interface ProductFeature {
  icon: string;
  title: string;
  description: string;
}

export interface ProductSpecRow {
  label: string;
  value: string;
}

export interface ProductSpecGroup {
  groupName: string;
  rows: ProductSpecRow[];
}

export interface ProductVideo {
  title: string;
  url: string;
  duration: string;
}

export interface ProductUsageStep {
  title: string;
  description: string;
  codeSnippet?: string;
}

export interface ProductRating {
  average: number;
  count: number;
}

// Tuỳ chọn của cùng 1 sản phẩm (VD: các mức RPM của cùng dòng động cơ, hoặc
// các mức RAM của cùng dòng máy tính nhúng) — mỗi tuỳ chọn có tồn kho riêng,
// dùng chung ảnh/mô tả của sản phẩm cha. `price` chỉ cần khai báo khi tuỳ
// chọn đó có giá khác `product.price` (VD: bản RAM cao hơn giá cao hơn) —
// bỏ trống thì dùng chung giá sản phẩm cha.
export interface ProductVariant {
  label: string;
  stock: number;
  price?: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  category: string; // khớp với `value` trong PRODUCT_CATEGORIES
  price: number;
  compareAtPrice?: number;
  stock: number;
  badge?: string;
  rating?: ProductRating; // chỉ set khi đã có ít nhất 1 đánh giá thật
  images: ProductImage[];
  description: string; // markdown, render bằng react-markdown (giống blog/dự án)
  features?: ProductFeature[];
  highlights: ProductHighlight[];
  specifications: ProductSpecGroup[];
  videos?: ProductVideo[];
  usageSteps?: ProductUsageStep[];
  variants?: ProductVariant[];
}

export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  items: OrderItem[];
  customer: {
    name: string;
    phone: string;
    address: string;
    email: string;
  };
  shippingFee: number;
  total: number;
  paymentMethod: "vnpay" | "momo" | "cod";
  status: "pending" | "paid" | "shipped" | "completed" | "cancelled";
  createdAt: string;
}
