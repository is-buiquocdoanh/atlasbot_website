# GIAI ĐOẠN 2: Thiết kế UI/UX — Atlasbot

**Trạng thái:** ✅ Hoàn thành
**Ngày:** 15/08/2026
**Domain phát triển tạm thời:** doanhwork.com (local trước, host sau)

---

## 1. Design System

### 1.1 Bảng màu — Theme sáng

| Vai trò | Tên biến | Mã màu | Dùng cho |
|---|---|---|---|
| Nền chính | `background` | `#FFFFFF` | Nền toàn trang |
| Nền phụ | `surface` | `#F3F5F8` | Card, section xen kẽ |
| Viền/chia tách | `border` | `#E5E9EF` | Đường viền, divider |
| Màu chính (primary) | `primary` | `#2563EB` | Nút chính, link, nhấn mạnh |
| Màu nhấn (accent) | `accent` | `#F97316` | Giá tiền, badge, highlight |
| Chữ chính | `foreground` | `#111827` | Tiêu đề, nội dung chính |
| Chữ phụ | `muted` | `#6B7280` | Mô tả, chú thích |
| Thành công | `success` | `#16A34A` | Thông báo đặt hàng thành công |
| Cảnh báo/lỗi | `danger` | `#DC2626` | Lỗi form, hết hàng |

> Đổi từ theme tối (bản nháp trước) sang **theme sáng** theo yêu cầu — giữ nguyên 2 màu thương hiệu xanh dương `#2563EB` và cam `#F97316` để đồng bộ với logo.

### 1.2 Typography

| Vai trò | Font | Ghi chú |
|---|---|---|
| Heading | Inter (700/800) hoặc Space Grotesk | Tải qua `next/font/google`, miễn phí |
| Body | Inter (400/500) | Dễ đọc, hỗ trợ tiếng Việt tốt |
| Code/thông số kỹ thuật | JetBrains Mono | Dùng trong bài blog có code, bảng thông số |

### 1.3 Logo

- File: `public/images/logo.svg` (đã tạo, dạng placeholder)
- Icon lục giác kiểu mạch điện tử + màu cam làm điểm nhấn trung tâm, wordmark "Atlas**bot**" (chữ "bot" tô màu xanh dương thương hiệu)
- **Cần thay thế** khi bạn có logo thiết kế chính thức — chỉ cần ghi đè file cùng tên, không cần sửa code

### 1.4 Bo góc & khoảng cách (spacing)

- Bo góc chuẩn: `rounded-lg` (8px) cho card/button, `rounded-full` cho avatar/badge tròn
- Khoảng cách section: `py-16` giữa các block lớn, `gap-6` giữa các card trong grid
- Container tối đa: `max-w-6xl`, căn giữa

---

## 2. Wireframe — Mô tả bố cục từng trang

### 2.1 Trang chủ (`/`)
```
[Header: Logo | Blog Dự án Shop Giới thiệu Liên hệ | Giỏ hàng]
[Hero: Tiêu đề lớn + mô tả ngắn + 2 nút CTA (Đọc Blog / Xem Shop)]
[Section: Bài viết mới nhất — grid 3 cột]
[Section: Dự án nổi bật — grid 2 cột, ảnh lớn]
[Section: Sản phẩm nổi bật — grid 4 cột]
[Footer: Thông tin liên hệ + mạng xã hội]
```

### 2.2 Trang Blog (`/blog`, `/blog/[slug]`)
```
Danh sách:
[Header]
[Tiêu đề "Blog" + ô tìm kiếm + dropdown sắp xếp (Mới nhất/Cũ nhất/Xem nhiều)]
[Sidebar trái: Panel chọn chủ đề lớn (checkbox, chọn nhiều được) + đếm số bài mỗi chủ đề]
[Grid 3 cột (bên phải sidebar): ảnh cover, tên chủ đề, tiêu đề bài]
[Footer]
```

### 2.2.1 Cây danh mục 2 cấp — mở rộng được, quản lý trong CMS

Bỏ mô hình lộ trình tuyến tính. Thay bằng **cây danh mục 2 cấp (chủ đề lớn → chủ đề con)**, hiển thị dạng accordion (bấm chủ đề lớn để sổ ra danh sách chủ đề con) thay vì checkbox phẳng. Quan trọng: **danh mục không hardcode trong code** — quản lý như 1 document type riêng trong Sanity (`Category`, có field `parentCategory` tự tham chiếu chính nó), nên bạn **thêm/sửa/xoá chủ đề bất cứ lúc nào từ Sanity Studio**, không cần sửa code hay deploy lại.

**Ví dụ cây danh mục ban đầu** (bạn có thể thêm bớt tự do sau này):

```
📁 Kiến thức nền tảng
📁 Lập trình nhúng
   ├─ STM32
   ├─ ESP32
   ├─ RTOS
   └─ GPIO / Ngắt
📁 Giao tiếp phần cứng
   ├─ UART/SPI/I2C
   └─ CAN bus
📁 Cảm biến
   ├─ IMU
   ├─ LiDAR
   └─ Encoder
📁 Điều khiển động cơ
   ├─ PID
   └─ Driver / Servo
📁 Cơ khí & khung robot
📁 ROS2
   ├─ Node & Topic
   ├─ Launch & Package
   └─ Nav2
📁 SLAM & Định vị
   ├─ SLAM 2D
   ├─ SLAM 3D
   └─ Localization
📁 Humanoid & robot khác
📁 Dự án thực chiến
📁 Khác   ← fallback cho bài chưa khớp danh mục nào, luôn có sẵn
```

**Xử lý bài viết không thuộc chủ đề nào có sẵn:** gán tạm vào **"Khác"**, hoặc — cách hay hơn — tạo ngay 1 chủ đề mới ngay trong lúc viết bài (vì danh mục quản lý động trong CMS, tạo chủ đề mới chỉ mất vài giây, không chặn việc đăng bài).

**Cách hiển thị trên UI (sidebar):**
- Danh sách chủ đề lớn dạng accordion, mỗi mục có mũi tên sổ xuống (▸/▾)
- Bấm vào chủ đề lớn: (a) sổ ra chủ đề con nếu có, (b) đồng thời lọc luôn các bài thuộc chủ đề lớn đó (kể cả chưa chọn chủ đề con nào)
- Bấm vào chủ đề con: lọc chính xác bài thuộc chủ đề con đó
- Vẫn giữ ô tìm kiếm + dropdown sắp xếp ở đầu trang (đã có từ bản thiết kế trước)

**Cập nhật data model** (so với `PROJECT-SPEC.md`):
- `BlogPost.category` → đổi từ enum cố định thành **reference tới document `Category`** trong Sanity (thay vì string tĩnh)
- Thêm document type mới `Category`: `{ id, name, slug, parentCategory?: reference to Category }`
- Không giới hạn số cấp trong code, nhưng UI chỉ hiển thị tối đa 2 cấp (lớn → con) để giữ giao diện đơn giản, dù dữ liệu cho phép sâu hơn nếu sau này cần

Chi tiết:
[Header]
[Breadcrumb: Blog > Chuyên mục]
[Tiêu đề bài + ngày đăng + tác giả]
[Nội dung bài viết — hỗ trợ code block, ảnh, video nhúng]
[Bài viết liên quan — 3 bài cùng chuyên mục]
[Footer]
```

### 2.3 Trang Dự án (`/du-an`, `/du-an/[slug]`)
```
Danh sách:
[Header]
[Tiêu đề "Dự án" — grid 2 cột dạng portfolio, ảnh lớn nổi bật]
[Footer]

Chi tiết:
[Header]
[Ảnh/video lớn đầu trang]
[Mô tả dự án]
[Bảng thông số kỹ thuật]
[Nút link GitHub]
[Footer]
```

### 2.4 Trang Shop (`/shop`, `/shop/[slug]`)
```
Danh sách:
[Header]
[Sidebar trái: filter theo danh mục (Cảm biến, Vi điều khiển, Motor...) + khoảng giá]
[Grid 4 cột sản phẩm: ảnh, tên, giá]
[Footer]

Chi tiết:
[Header]
[2 cột: Ảnh sản phẩm (trái) | Tên, giá, mô tả, thông số, nút "Thêm vào giỏ" (phải)]
[Sản phẩm liên quan cùng danh mục]
[Footer]
```

### 2.5 Giỏ hàng & Checkout (`/shop/gio-hang`, `/shop/checkout`)
```
Giỏ hàng:
[Header]
[Danh sách sản phẩm trong giỏ: ảnh, tên, số lượng (+/-), giá, nút xóa]
[Tổng tiền tạm tính]
[Nút "Tiến hành đặt hàng"]
[Footer]

Checkout (đã đổi theo quyết định mới — KHÔNG có bước thanh toán online):
[Header]
[Form: Họ tên, SĐT, Địa chỉ]
[Tóm tắt đơn hàng]
[Nút "Gửi đơn qua Messenger" / "Gửi đơn qua Zalo"]
  → click sẽ mở link deep-link Messenger/Zalo kèm sẵn nội dung đơn hàng
[Footer]
```

> **Thay đổi quan trọng so với spec ban đầu:** bỏ hẳn bước nhập thông tin thanh toán online. Sau khi khách điền form, hệ thống tạo đơn ở trạng thái "chờ xác nhận" và đưa khách sang Messenger/Zalo để chốt đơn + thanh toán thủ công với bạn. Đơn giản hơn nhiều để code và không vướng thủ tục giấy phép merchant.

### 2.6 Trang Giới thiệu & Liên hệ
```
Giới thiệu:
[Header]
[Ảnh/video giới thiệu + câu chuyện thương hiệu Atlasbot]
[Footer]

Liên hệ:
[Header]
[Thông tin liên hệ trực tiếp (Messenger, Zalo, Email)]
[Form liên hệ đơn giản (tuỳ chọn)]
[Footer]
```

---

## 3. Component dùng chung — Style spec

| Component | Style |
|---|---|
| Button chính | Nền `primary`, chữ trắng, `rounded-lg`, hover giảm opacity |
| Button phụ | Viền `border`, nền trong suốt, chữ `foreground`, hover nền `surface` |
| Card sản phẩm/bài viết | Nền `surface`, `rounded-lg`, ảnh full-width phía trên, padding 16px |
| Badge giá | Chữ `accent`, đậm |
| Input form | Nền trắng, viền `border`, `rounded-md`, focus viền `primary` |
| Header | Nền trắng, sticky top, viền dưới `border`, có shadow nhẹ khi scroll |

---

## 4. Việc cần cập nhật trong code (thực hiện ở Giai đoạn 4 — Development)

- [x] Đổi `tailwind.config.ts` từ theme tối → theme sáng theo bảng màu mục 1.1
- [x] Thay logo text tạm bằng file `logo.svg` trong Header
- [x] Sửa trang Checkout: bỏ phần thanh toán, thêm nút gửi đơn qua Messenger/Zalo (dùng link dạng `https://m.me/<username>` hoặc `https://zalo.me/<số điện thoại>` kèm text đơn hàng)
- [x] Thêm sidebar filter danh mục ở trang Shop
- [x] Trang Blog: cây danh mục 2 cấp dạng accordion + ô tìm kiếm + dropdown sắp xếp (mục 2.2.1) — dữ liệu danh mục/bài viết mẫu tạm nằm trong `src/lib/cms.ts`, sẽ chuyển sang document `Category` thật trong Sanity khi setup CMS
- [x] Trang chi tiết Blog: breadcrumb Blog > (chủ đề lớn) > chủ đề, ngày đăng/tác giả, bài viết liên quan cùng chuyên mục

---

## 5. Việc cần bạn cung cấp trước khi bắt đầu Giai đoạn 3 (Chuẩn bị kỹ thuật)

- [ ] Username Messenger (m.me/...) hoặc số Zalo để gắn link nhận đơn hàng
- [ ] Xác nhận lại: có muốn giữ đa ngôn ngữ (Việt/Anh) ngay từ bản đầu, hay để sau khi có traffic thật rồi mới làm? (ảnh hưởng độ phức tạp lúc code)

---

**➡️ Giai đoạn 2 hoàn tất. Sẵn sàng chuyển sang Giai đoạn 3: Chuẩn bị kỹ thuật khi bạn xác nhận mục 5.**
