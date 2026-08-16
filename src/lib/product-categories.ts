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
