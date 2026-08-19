// Danh mục sản phẩm cố định — xem docs/giai-doan-1-ke-hoach-nghien-cuu.md mục 6.
// "value" khớp với field `category` (tiếng Việt) trong dữ liệu sản phẩm/CMS.
export const PRODUCT_CATEGORIES = [
  { slug: "sensor", value: "Cảm biến" },
  { slug: "mcu", value: "Vi điều khiển & mạch điều khiển" },
  { slug: "motor", value: "Motor & driver" },
  { slug: "chassis", value: "Khung robot/cơ khí" },
  { slug: "drivetrain", value: "Bánh xe & hệ truyền động" },
  { slug: "battery", value: "Pin & nguồn" },
] as const;

export type ProductCategorySlug = (typeof PRODUCT_CATEGORIES)[number]["slug"];

// Tra cứu qua lại giữa slug (URL, VD: /shop/motor/...) và value (tên tiếng
// Việt lưu trong field `category` của sản phẩm) — dùng khi build link sản
// phẩm và khi validate param [category] trên route chi tiết.
export function getCategoryByValue(value: string) {
  return PRODUCT_CATEGORIES.find((c) => c.value === value);
}

export function getCategoryBySlug(slug: string) {
  return PRODUCT_CATEGORIES.find((c) => c.slug === slug);
}
