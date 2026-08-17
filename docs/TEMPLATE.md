---
title: "Tiêu đề bài viết — ngắn gọn, rõ ràng, có từ khóa chính"
slug: "duong-dan-khong-dau-khong-cach"
category: "Tên chủ đề lớn (VD: Kiến thức nền tảng)"
subcategory: "Tên chủ đề con nếu có (VD: STM32) — để trống nếu không cần"
level: 1
tags: ["tag-1", "tag-2", "tag-3"]
publishedAt: "YYYY-MM-DD"
author: "Atlasbot"
coverImage: "ten-file-anh.jpg"
excerpt: "Mô tả ngắn 1-2 câu, hiện ở card danh sách Blog và dùng làm meta description cho SEO."
readingTime: 5
---

<!--
  HƯỚNG DẪN DÙNG TEMPLATE NÀY (xoá phần này khi viết bài thật):

  0. MỖI BÀI VIẾT LÀ 1 FOLDER RIÊNG, chứa cả bài viết lẫn ảnh của chính bài đó
     — sửa bài nào chỉ cần vào đúng 1 folder, không phải lục nhiều nơi. Cấu
     trúc đủ 3 cấp category → chuyên mục con → bài viết, giống hệt cây trong
     docs/chu_de_blog.md, KHÔNG dồn hết bài của 1 category vào 1 folder phẳng:
       public/blog-content/<ten-category>/<Tên chuyên mục con>/0X-slug-bai-viet/
         ├── index.md          ← file này
         └── ten-file-anh.jpg  ← ảnh cover + ảnh chèn trong bài, để cùng đây
     <ten-category> là tên thư mục ứng với chủ đề lớn (VD: `lap-trinh-nhung`,
     `amr-agv`...) — xem các category đã có sẵn trong `src/lib/cms.ts`.
     <Tên chuyên mục con> ghi ĐÚNG NHƯ TÊN HIỂN THỊ (có dấu, có khoảng trắng
     cũng được, VD: `Kiến thức nền tảng`, `Linh kiện điện tử`) — folder này chỉ
     để tổ chức, không cần khớp chữ với field `subcategory` trong frontmatter
     (nhưng nên đặt giống cho dễ tìm). Nếu category không có chuyên mục con
     nào (VD: `Linux / Ubuntu / Jetson`), bỏ qua cấp này, để bài viết thẳng
     dưới `<ten-category>/0X-slug-bai-viet/` — code tự nhận diện được cả 2
     kiểu, không cần khai báo gì thêm.
  1. Copy file này vào folder mới theo đúng cấu trúc trên, đổi tên folder
     theo dạng: 0X-slug-bai-viet (0X = số thứ tự trong CHUYÊN MỤC CON đó,
     dùng để tính "Bài trước/Bài tiếp theo" tự động — không cần tự viết link).
  2. Điền đầy đủ frontmatter phía trên — đừng bỏ trống title/slug/category.
     `coverImage` và ảnh chèn trong bài chỉ cần ghi TÊN FILE (không phải
     đường dẫn) vì ảnh nằm cùng folder — code tự suy ra URL đầy đủ.
  3. level: 1 = cơ bản, 2 = trung bình, 3 = nâng cao
  4. Viết nội dung theo cấu trúc mẫu bên dưới — không bắt buộc y hệt,
     nhưng nên có: mở bài ngắn, các phần rõ ràng bằng heading ##,
     và kết bài dẫn sang bài liên quan.
  5. Dùng đúng cú pháp Markdown chuẩn: ## cho heading, **chữ** cho in đậm,
     | | | cho bảng, ```code``` cho khối code — code sẽ tự render đẹp,
     không cần chỉnh gì thêm.
-->

Đoạn mở bài — 2-3 câu giới thiệu vấn đề bài viết sẽ giải quyết, hoặc lý do người đọc nên quan tâm. Không lặp lại y hệt phần `excerpt` ở trên.

## Heading cấp 1 cho từng phần nội dung chính

Nội dung phần này. Có thể dùng **in đậm** để nhấn từ khóa quan trọng, hoặc *in nghiêng* cho ghi chú.

- Gạch đầu dòng cho danh sách không thứ tự
- Mỗi ý nên ngắn gọn, dễ quét mắt

### Heading cấp 2 nếu cần chia nhỏ hơn

Dùng khi 1 phần lớn có nhiều ý con cần tách riêng.

## Bảng so sánh (nếu có)

| Tiêu chí | Lựa chọn A | Lựa chọn B |
|---|---|---|
| Ví dụ | Giá trị | Giá trị |

## Ví dụ code (nếu có)

```c
// Comment giải thích đoạn code làm gì
void setup() {
  // code mẫu
}
```

## Kết luận / Tổng kết

Tóm tắt ngắn gọn điểm chính của bài, hoặc dẫn dắt sang hành động tiếp theo cho người đọc.

<!--
  KHÔNG cần tự viết link "Bài trước / Bài tiếp theo" ở cuối bài — trang Blog
  tự tính điều hướng này dựa vào số thứ tự 0X ở tên folder, trong cùng
  chuyên mục con. Viết cứng link ở đây sẽ bị lệch khi có bài chèn thêm sau.
-->
