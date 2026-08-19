// Nội dung tab "Giới thiệu" — dùng chung cho toàn shop thay vì lặp lại mỗi
// sản phẩm (xem docs/product-detail-page-spec.md mục 3.4). Tách riêng khỏi
// products.ts vì file đó dùng node:fs (chỉ chạy được ở server), trong khi
// hằng số này còn được ProductTabs.tsx (client component) import trực tiếp.
export const SHOP_ABOUT_CONTENT = `Atlasbot cung cấp linh kiện robot AMR/AGV — cảm biến, vi điều khiển, động cơ, khung xe, bánh xe và pin — cùng kiến thức kỹ thuật đi kèm để bạn tự lắp ráp và hiểu rõ từng thành phần, không chỉ mua về lắp cho xong.

Mỗi sản phẩm đều được chọn lọc dựa trên kinh nghiệm thực tế từ các dự án robot đã triển khai (xem mục Dự án), không bán những linh kiện chưa từng thử nghiệm thật.`;

export const SHOP_ABOUT_STATS = [
  { key: "categories", value: "6" },
  { key: "support", value: "24/7" },
  { key: "warranty", value: "12" },
  { key: "response", value: "< 1h" },
] as const;
