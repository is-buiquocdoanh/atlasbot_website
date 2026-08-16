# GIAI ĐOẠN 3: Chuẩn bị kỹ thuật — Atlasbot

**Trạng thái:** ✅ Hoàn thành
**Ngày:** 15/08/2026

---

## 1. Tech stack chốt chính thức

| Layer | Công nghệ | Ghi chú |
|---|---|---|
| Frontend | Next.js (App Router) + Tailwind CSS | Theme sáng theo Giai đoạn 2 |
| Đa ngôn ngữ | `next-intl` | 4 ngôn ngữ: vi, en, zh, ko |
| CMS (Blog/Dự án) | Sanity.io | Free tier, hỗ trợ nội dung đa ngôn ngữ |
| Auto-dịch | Google Translate API | Kích hoạt khi lưu bài tiếng Việt, tạo bản nháp 3 ngôn ngữ còn lại |
| Database (đơn hàng, sản phẩm) | PostgreSQL qua Supabase | Free tier đủ dùng giai đoạn đầu |
| Đặt hàng | Không tích hợp cổng thanh toán — điều hướng Messenger/Zalo | Theo quyết định Giai đoạn 2 |
| Hosting | **Chưa deploy — chạy local trước** | Sẽ chọn Vercel/Railway ở Giai đoạn 8 khi sẵn sàng lên host thật |
| Domain | `doanhwork.com` (tạm thời, dùng lúc dev) | Domain thương hiệu chính thức chốt sau |

---

## 2. Kiến trúc đa ngôn ngữ (4 ngôn ngữ: VI / EN / ZH / KO)

### 2.1 Routing
```
doanhwork.com/vi/...   ← ngôn ngữ mặc định
doanhwork.com/en/...
doanhwork.com/zh/...
doanhwork.com/ko/...
```
- Dùng `next-intl` để quản lý routing theo locale, tự động redirect `/` → `/vi` cho khách Việt Nam (dựa vào `Accept-Language` header), có bộ chọn ngôn ngữ ở Header.

### 2.2 Quy trình nội dung đa ngôn ngữ (auto-dịch)

```
Bạn viết/sửa bài tiếng Việt trong Sanity Studio
        ↓
Bấm "Publish" bản tiếng Việt
        ↓
Webhook Sanity gọi 1 serverless function (Next.js API route)
        ↓
Function gọi Google Translate API → dịch sang EN, ZH, KO
        ↓
Lưu 3 bản dịch vào Sanity dưới dạng DRAFT (chưa public)
        ↓
Bạn vào Sanity Studio xem lại 3 bản nháp → sửa nếu cần → Publish
        ↓
Bài viết hiển thị đủ 4 ngôn ngữ trên site
```

- **Vì sao để nháp thay vì đăng thẳng:** máy dịch đôi khi dịch sai thuật ngữ kỹ thuật (STM32, encoder, costmap...) — cần bạn duyệt qua để đảm bảo chất lượng trước khi khách quốc tế đọc.
- **Có thể tự động hoá thêm sau:** nếu về sau bạn tin tưởng chất lượng dịch, chỉ cần đổi 1 dòng cấu hình để auto-publish luôn, không cần sửa kiến trúc.

### 2.3 Cấu trúc dữ liệu đa ngôn ngữ trong Sanity

Mỗi bài viết/dự án là 1 "document" gốc, với các trường được dịch (title, content, description...) lưu theo từng locale trong cùng document (dùng plugin `@sanity/document-internationalization` hoặc field dạng object `{ vi: "...", en: "...", zh: "...", ko: "..." }`) — không tạo 4 document riêng biệt, để dễ quản lý và không bị lệch dữ liệu giữa các bản.

### 2.4 Phần không cần dịch
- Thông số kỹ thuật dạng số (VD: "50kg", "12m") — giữ nguyên
- Tên sản phẩm mang tính thương hiệu/mã hàng (VD: "RPLidar A1") — giữ nguyên
- Giá tiền — hiển thị theo định dạng địa phương nhưng **chưa đổi đơn vị tiền tệ** ở giai đoạn này (dùng VNĐ cho cả 4 ngôn ngữ tạm thời, việc hỗ trợ đa tiền tệ để dành cho giai đoạn scale quốc tế thật sự, tránh làm phức tạp MVP)

---

## 3. Cập nhật cấu trúc thư mục (so với `PROJECT-SPEC.md`)

```
src/
├── app/
│   ├── [locale]/                 ← BỌC toàn bộ route hiện có trong [locale]
│   │   ├── page.tsx
│   │   ├── blog/
│   │   ├── du-an/
│   │   ├── shop/
│   │   ├── gioi-thieu/
│   │   └── lien-he/
│   └── api/
│       ├── translate-webhook/    ← nhận webhook từ Sanity, gọi Google Translate
│       ├── orders/
│       └── products/
├── i18n/
│   ├── routing.ts                ← khai báo 4 locale, locale mặc định
│   └── request.ts
├── messages/                     ← chuỗi giao diện tĩnh (nút, menu, label)
│   ├── vi.json
│   ├── en.json
│   ├── zh.json
│   └── ko.json
```

---

## 4. Biến môi trường bổ sung (cập nhật `.env.example`)

```
# Đa ngôn ngữ / dịch thuật
GOOGLE_TRANSLATE_API_KEY=
SANITY_WEBHOOK_SECRET=

# Nhận đơn hàng (điền khi có)
NEXT_PUBLIC_MESSENGER_USERNAME=TODO
NEXT_PUBLIC_ZALO_PHONE=TODO
```

> Hai dòng cuối để `TODO` theo đúng yêu cầu — khi bạn có username Messenger/số Zalo, chỉ cần điền vào `.env.local`, không cần sửa code.

---

## 5. Setup môi trường dev (việc cần làm trên máy bạn)

- [x] Cài Node.js (bản LTS mới nhất) nếu chưa có
- [ ] Tạo tài khoản Sanity.io (free) → tạo project mới
- [ ] Tạo tài khoản Supabase (free) → tạo project PostgreSQL mới
- [ ] Lấy API key Google Translate (qua Google Cloud Console, có free quota hàng tháng)
- [ ] Khởi tạo Git repo cho project (nếu chưa)

---

## 6. Việc cần làm ở Giai đoạn 4 (Development) liên quan tới quyết định Giai đoạn 3

- [x] Bọc toàn bộ route hiện có trong `src/app/[locale]/`
- [x] Cài `next-intl`, setup `i18n/routing.ts` với 4 locale
- [x] Tạo file `messages/{vi,en,zh,ko}.json` cho các chuỗi giao diện tĩnh (nút "Thêm vào giỏ hàng", menu...)
- [x] Thêm bộ chọn ngôn ngữ vào Header
- [ ] Setup Sanity Studio + schema đa ngôn ngữ cho BlogPost, Project — cần bạn tạo tài khoản Sanity.io trước
- [ ] Viết API route `translate-webhook` gọi Google Translate API — cần bạn lấy API key Google Translate trước
- [x] Nút "Gửi đơn qua Messenger/Zalo" đọc từ `NEXT_PUBLIC_MESSENGER_USERNAME` / `NEXT_PUBLIC_ZALO_PHONE` (vẫn là TODO trong `.env`, nút tự vô hiệu hoá tới khi bạn điền giá trị thật)

---

## 7. Quyết định đã chốt trong Giai đoạn 3 (tóm tắt)

| Quyết định | Lựa chọn |
|---|---|
| Dịch vụ auto-dịch | Google Translate API |
| Bản dịch có đăng ngay không | Không — lưu nháp, bạn duyệt trước khi publish |
| Môi trường phát triển | Local trước, chưa deploy |
| Domain lúc dev | doanhwork.com (tạm) |
| Messenger/Zalo | Chưa có — để `TODO`, điền sau |

---

**➡️ Giai đoạn 3 hoàn tất. Sẵn sàng chuyển sang Giai đoạn 4: Phát triển Frontend & Backend cốt lõi — đây là giai đoạn bắt đầu code thật theo toàn bộ quyết định đã chốt ở Giai đoạn 1-3.**
