# Spec: Trang Chi Tiết Sản Phẩm (Product Detail Page)

> File này mô tả đầy đủ thiết kế trang chi tiết sản phẩm cho Atlasbot Shop, để Claude Code hiện thực hóa thành component Next.js thật trong dự án. Bản mockup HTML tham khảo đã được duyệt ở phiên làm việc trước — đây là bản đặc tả (spec) tương đương, viết lại dưới dạng có thể code trực tiếp theo tech stack hiện có.

## 0. Bối cảnh dự án (để Claude Code nắm)

- Next.js App Router + Tailwind CSS
- CMS: Sanity.io — sản phẩm được quản lý qua Sanity, cần schema tương ứng
- Route đề xuất: `app/[locale]/shop/[category]/[slug]/page.tsx` (khớp với routing `next-intl` 4 ngôn ngữ đã dùng cho blog)
- Đơn hàng MVP: **không có giỏ hàng thanh toán online** — nút CTA dẫn tới Messenger/Zalo để xử lý thủ công (chưa có tư cách pháp nhân để tích hợp VNPay/MoMo)
- Theme sáng, brand color: `#2563EB` (xanh, primary) và `#F97316` (cam, accent)
- Ảnh sản phẩm: **chưa có ảnh thật** — dùng placeholder có thể thay thế dễ dàng qua Sanity image field, không hardcode

## 1. Design Tokens

Thêm vào `tailwind.config.ts` (hoặc file token hiện có của dự án) nếu chưa có:

```ts
colors: {
  primary: {
    DEFAULT: '#2563EB',
    dark: '#1D4ED8',
    tint: '#EFF4FF',
  },
  accent: {
    DEFAULT: '#F97316',
    dark: '#EA580C',
    tint: '#FFF3E9',
  },
  success: {
    DEFAULT: '#16A34A',
    bg: '#F0FDF4',
  },
  ink: {
    DEFAULT: '#0F172A',   // text chính
    muted: '#5B6472',     // text phụ
    faint: '#94A0AF',     // text mờ / placeholder
  },
  line: '#E4E9F0',        // border/divider
  surface: {
    DEFAULT: '#FFFFFF',
    subtle: '#F7F9FC',
  },
},
fontFamily: {
  display: ['Space Grotesk', 'sans-serif'],  // tiêu đề sản phẩm, heading
  body: ['Inter', 'sans-serif'],              // nội dung
  mono: ['JetBrains Mono', 'monospace'],      // SKU, thông số kỹ thuật, giá trị số
},
borderRadius: {
  card: '14px',
},
```

Import font trong `layout.tsx` (dùng `next/font/google`):

```ts
import { Inter, Space_Grotesk, JetBrains_Mono } from 'next/font/google';
```

## 2. Cấu trúc trang (Section Layout)

```
<ProductDetailPage>
 ├── <Breadcrumb />                  Trang chủ / Cửa hàng / [Category] / [Product name]
 ├── <ProductTop>                    grid 2 cột (55% / 45%), stack trên mobile (<900px)
 │    ├── <ProductGallery />         ảnh lớn + thumbnail + dot indicator
 │    └── <ProductInfo />            badge, tên, SKU, giá, tồn kho, highlight, CTA
 ├── <ProductTabs>                   5 tab
 │    ├── Mô tả chi tiết
 │    ├── Thông số kỹ thuật
 │    ├── Video hướng dẫn
 │    ├── Hướng dẫn sử dụng
 │    └── Giới thiệu
 └── <RelatedProducts />             grid 4 cột, 2 cột trên mobile
```

## 3. Component breakdown

### 3.1 `<Breadcrumb />`
- Props: `items: { label: string; href?: string }[]`
- Item cuối không có link, màu `ink` đậm; các item trước màu `ink-muted`, hover `primary`.

### 3.2 `<ProductGallery images={ProductImage[]} />`
- `ProductImage = { url: string; alt: string }` — lấy từ Sanity `image` array field.
- Ảnh chính: khung vuông (`aspect-square`), bo góc `rounded-card`, border `line`, có mũi tên trái/phải để chuyển ảnh (dùng React state `currentIndex`, không cần thư viện ngoài).
- Dưới ảnh chính: dot indicator (chấm tròn, chấm active kéo dài thành pill màu `primary`).
- Dưới dot: dải thumbnail (5 cột trên desktop, 4 trên mobile), thumbnail active có border `primary` 2px.
- **Nếu Sanity chưa có ảnh** (mảng rỗng hoặc field null): hiển thị fallback placeholder (icon linh kiện đơn giản trên nền lưới nhạt) kèm nhãn nhỏ "Ảnh minh họa — cập nhật ảnh thật sau" — không để vỡ layout khi thiếu ảnh.
- Gallery `sticky top-6` trên desktop (≥900px) để cuộn theo khi người dùng đọc tab bên dưới.

### 3.3 `<ProductInfo />`
Props lấy trực tiếp từ document sản phẩm (xem mục 5 — Data model):

- Badge hàng: category badge (nền `primary-tint`, chữ `primary-dark`) + badge trạng thái tuỳ chọn (VD "Bán chạy", nền `accent-tint`, chữ `accent-dark`) — badge trạng thái ẩn nếu không có.
- `<h1>` tên sản phẩm — font `display`, `text-[27px] font-bold leading-snug`.
- Dòng SKU: SKU hiển thị dạng `font-mono` trong pill nhỏ nền `surface-subtle`; rating chỉ hiển thị nếu đã có ít nhất 1 đánh giá thật — **không dựng số liệu giả**, nếu chưa có review thì hiện "Chưa có đánh giá" màu `ink-faint`.
- Khối giá: giá hiện tại `font-display text-3xl font-bold`; giá gốc (nếu có khuyến mãi) gạch ngang màu `ink-faint`; badge phần trăm giảm nền `accent-tint` — **chỉ hiện phần giá gốc/giảm giá khi trường `compareAtPrice` có giá trị trong CMS**, không luôn luôn hiện.
- Trạng thái tồn kho: chấm tròn + text — xanh `success` nếu `stock > 0` ("Còn hàng — N sản phẩm"), đỏ/xám nếu hết hàng ("Tạm hết hàng" — vô hiệu hóa nút đặt hàng khi hết).
- Danh sách highlight (2 cột, tối đa 4 mục): lấy từ field `highlights` (mảng `{ icon, label, value }`) trong Sanity, không hardcode — cho phép mỗi loại sản phẩm (cảm biến, vi điều khiển, động cơ, khung xe, bánh xe, pin) có bộ highlight khác nhau.
- Bộ đếm số lượng: input dạng stepper (nút −/giá trị/nút +), min = 1.
- 2 nút CTA:
  - Nút chính (nền `accent`): **"Đặt hàng qua Messenger"** — mở link Messenger đã cấu hình (env var hoặc field CMS), kèm sẵn tên sản phẩm + số lượng trong nội dung tin nhắn nếu Messenger URL scheme hỗ trợ (`m.me/<page>?ref=...`).
  - Nút phụ (viền `primary`): **"Chat Zalo tư vấn"** — tương tự, link Zalo OA.
  - Text nhỏ bên dưới giải thích việc xác nhận đơn thủ công (đã có trong mockup, giữ nguyên nội dung, có thể chỉnh field CMS để đổi câu chữ theo thời gian).
- Dải trust badge 3 cột (bảo hành, giao hàng, hỗ trợ kỹ thuật) — icon inline SVG, có thể để cứng (không cần CMS vì ít đổi).

### 3.4 `<ProductTabs />`
- Dùng React state đơn giản (`activeTab`), không cần thư viện tab ngoài.
- Thanh tab: `overflow-x-auto` để scroll ngang trên mobile, tab active có border-bottom 2.5px màu `primary`.
- 5 tab, nội dung lấy từ field CMS tương ứng (xem mục 5):

| Tab | Nguồn nội dung | Ghi chú |
|---|---|---|
| Mô tả chi tiết | `description` (rich text / Portable Text từ Sanity) | Có thể có heading phụ, list, feature cards 3 cột (`features: {icon,title,desc}[]`) |
| Thông số kỹ thuật | `specifications` (mảng nhóm: `{ groupName, rows: {label, value}[] }`) | Render bảng, cột giá trị dùng `font-mono` — **nhóm thông số tùy loại sản phẩm** (motor có nhóm "Encoder", cảm biến có nhóm "Giao tiếp", pin có nhóm "Dung lượng"...) nên schema phải để dạng mảng động, không hardcode field cứng cho từng loại |
| Video hướng dẫn | `videos: { title, url, duration, thumbnail }[]` | Video chính lớn (embed hoặc link YouTube/Facebook), danh sách video phụ bên dưới dạng list nhỏ |
| Hướng dẫn sử dụng | `usageSteps: { title, description, codeSnippet? }[]` | Numbered step, code block hiển thị nếu `codeSnippet` có giá trị (dùng syntax highlight nếu dự án đã có thư viện, nếu chưa thì `<pre>` đơn giản trước) |
| Giới thiệu | `aboutContent` (rich text, có thể dùng chung 1 block giới thiệu Atlasbot cho toàn shop thay vì lặp lại mỗi sản phẩm) | Kèm 4 stat box nhỏ (có thể để cứng: số nhóm sản phẩm, % hỗ trợ kỹ thuật, số ngày bảo hành, thời gian phản hồi) |

### 3.5 `<RelatedProducts products={Product[]} />`
- Lấy theo cùng `category` hoặc `subcategory`, giới hạn 4 sản phẩm, loại trừ sản phẩm đang xem.
- Card: ảnh vuông, category nhỏ phía trên tên, tên tối đa 2 dòng, giá `font-mono font-semibold`.
- Hover: `translate-y-[-2px]` + shadow nhẹ.

## 4. Responsive breakpoints

- `< 900px`: `ProductTop` chuyển thành 1 cột (gallery trước, info sau), gallery bỏ `sticky`.
- `< 700px`: feature-grid trong tab Mô tả chi tiết chuyển từ 3 cột → 2 cột; `RelatedProducts` chuyển từ 4 cột → 2 cột.
- Tab nav luôn `overflow-x-auto` để không vỡ trên màn hình nhỏ.

## 5. Data model (Sanity schema — gợi ý)

Tạo document type `product` (nếu dự án chưa có, hoặc bổ sung field còn thiếu vào schema hiện tại):

```ts
// schemas/product.ts
export default {
  name: 'product',
  title: 'Sản phẩm',
  type: 'document',
  fields: [
    { name: 'name', title: 'Tên sản phẩm', type: 'string' },
    { name: 'slug', title: 'Slug', type: 'slug', options: { source: 'name' } },
    { name: 'sku', title: 'SKU / Mã sản phẩm', type: 'string' },
    {
      name: 'category', title: 'Danh mục', type: 'reference',
      to: [{ type: 'productCategory' }],
    }, // 6 nhóm: cảm biến, vi điều khiển, động cơ, khung xe, bánh xe & hệ truyền động, pin
    { name: 'price', title: 'Giá bán', type: 'number' },
    { name: 'compareAtPrice', title: 'Giá gốc (nếu giảm giá)', type: 'number' },
    { name: 'stock', title: 'Tồn kho', type: 'number' },
    { name: 'badge', title: 'Badge trạng thái (VD: Bán chạy)', type: 'string' },
    { name: 'images', title: 'Ảnh sản phẩm', type: 'array', of: [{ type: 'image' }] },
    {
      name: 'highlights', title: 'Thông số nổi bật', type: 'array',
      of: [{ type: 'object', fields: [
        { name: 'icon', type: 'string' },
        { name: 'label', type: 'string' },
        { name: 'value', type: 'string' },
      ]}],
    },
    { name: 'description', title: 'Mô tả chi tiết', type: 'array', of: [{ type: 'block' }] },
    {
      name: 'features', title: 'Điểm nổi bật (feature cards)', type: 'array',
      of: [{ type: 'object', fields: [
        { name: 'icon', type: 'string' },
        { name: 'title', type: 'string' },
        { name: 'description', type: 'string' },
      ]}],
    },
    {
      name: 'specifications', title: 'Thông số kỹ thuật', type: 'array',
      of: [{ type: 'object', fields: [
        { name: 'groupName', title: 'Tên nhóm', type: 'string' },
        { name: 'rows', type: 'array', of: [{ type: 'object', fields: [
          { name: 'label', type: 'string' },
          { name: 'value', type: 'string' },
        ]}]},
      ]}],
    },
    {
      name: 'videos', title: 'Video hướng dẫn', type: 'array',
      of: [{ type: 'object', fields: [
        { name: 'title', type: 'string' },
        { name: 'url', type: 'url' },
        { name: 'duration', title: 'Thời lượng (VD: 05:32)', type: 'string' },
        { name: 'thumbnail', type: 'image' },
      ]}],
    },
    {
      name: 'usageSteps', title: 'Hướng dẫn sử dụng', type: 'array',
      of: [{ type: 'object', fields: [
        { name: 'title', type: 'string' },
        { name: 'description', type: 'text' },
        { name: 'codeSnippet', type: 'text' },
      ]}],
    },
  ],
};
```

> Field `aboutContent` (tab Giới thiệu) có thể để ở một singleton document riêng (`shopSettings`) dùng chung cho mọi sản phẩm, thay vì lặp lại — tránh phải nhập lại nội dung cho từng sản phẩm.

## 6. Nội dung mẫu (copy tiếng Việt tham khảo, dùng để test UI trước khi có data thật)

```
Tên: Động Cơ DC Giảm Tốc JGB37-520 12V có Encoder
SKU: JGB37-520-12V-AB
Danh mục: Động cơ & Truyền động
Giá: 185.000₫ (giá gốc 220.000₫, -16%)
Tồn kho: 24
Highlight: Điện áp 12V DC · Tốc độ 330 RPM · Encoder 11 xung/vòng · Momen 0.8 kg·cm
```

Nhóm thông số kỹ thuật mẫu: **Điện & công suất**, **Cơ khí**, **Encoder**, **Kích thước tổng** — mỗi nhóm 3–6 dòng label/value (xem bản mockup HTML đã duyệt để lấy đầy đủ số liệu mẫu nếu cần).

## 7. Việc Claude Code cần làm

1. Tạo/bổ sung schema `product` trong Sanity (mục 5), deploy schema.
2. Tạo component theo cấu trúc mục 2–3, dùng Tailwind + design tokens ở mục 1.
3. Tạo route `app/[locale]/shop/[category]/[slug]/page.tsx`, fetch dữ liệu sản phẩm qua Sanity client hiện có của dự án (theo pattern đang dùng cho blog, để nhất quán cách gọi data).
4. Xử lý fallback khi thiếu ảnh/thiếu field (không để trang vỡ layout khi CMS chưa nhập đủ dữ liệu).
5. Đảm bảo `next-intl` bọc được các label tiếng Việt cứng trong file này (đưa vào file dịch nếu dự án đã có cấu trúc `messages/vi.json` v.v., để sau này mở rộng English/Chinese/Korean).
6. Không tích hợp bất kỳ cổng thanh toán nào — 2 nút CTA chỉ point tới link Messenger/Zalo cấu hình qua biến môi trường hoặc `shopSettings`.

## 8. Ngoài phạm vi (chưa làm ở bước này)

- Giỏ hàng nhiều sản phẩm / checkout nhiều bước
- Đánh giá khách hàng (review) — hiện chỉ chừa chỗ hiển thị, chưa có tính năng viết review
- Ảnh sản phẩm thật — cần Jayson tự chụp/tải lên Sanity sau
