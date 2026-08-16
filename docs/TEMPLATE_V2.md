<!--
  Mỗi bài viết là 1 folder riêng, chứa cả bài (index.md) lẫn ảnh của chính
  bài đó — sửa bài nào chỉ cần vào đúng 1 folder. Cấu trúc đủ 3 cấp category →
  chuyên mục con → bài viết (giống cây trong docs/chu_de_blog.md), KHÔNG dồn
  hết bài của 1 category vào 1 folder phẳng:
    public/blog-content/<ten-category>/<Tên chuyên mục con>/0X-slug-bai-viet/
      ├── index.md
      ├── ten-file-anh.jpg     (ảnh cover)
      └── ten-file-anh-2.jpg   (ảnh nguyên lý, nếu có)

  <Tên chuyên mục con> ghi đúng như tên hiển thị (có dấu/khoảng trắng cũng
  được, VD: `Kiến thức nền tảng`) — chỉ để tổ chức folder, không bắt buộc
  khớp chữ với field `subcategory` bên dưới (nhưng nên đặt giống cho dễ tìm).
  Category không có chuyên mục con thì bỏ qua cấp này — code tự nhận diện.

  coverImage và ảnh chèn trong bài (![...](...)) chỉ cần ghi TÊN FILE, không
  phải đường dẫn — code tự suy ra URL đầy đủ vì ảnh nằm cùng folder bài viết.
  0X ở tên folder bài viết = số thứ tự trong chuyên mục con, dùng để tự tính
  "Bài trước/Bài tiếp theo" — không cần tự viết link.
-->
---
title: "Tiêu đề bài viết"
slug: "slug-bai-viet"
category: "Tên chủ đề lớn"
subcategory: "Tên chủ đề con"
level: 1
tags: ["tag-1", "tag-2", "tag-3"]
publishedAt: "YYYY-MM-DD"
author: "Atlasbot"
coverImage: "ten-file-anh.jpg"
excerpt: "Mô tả ngắn 1-2 câu dùng cho Blog và SEO."
readingTime: 5
---

Đoạn mở bài 2-3 câu giới thiệu vấn đề.

![Ảnh cover](ten-file-anh.jpg)

## Khái niệm chính

Giải thích khái niệm.

### Ý nhỏ nếu cần

Giải thích chi tiết hơn.

> **Tóm lại:** Một câu ghi nhớ.

## Nguyên lý hoạt động

![Sơ đồ nguyên lý](ten-file-anh-2.jpg)

Giải thích nguyên lý.

```text
INPUT
  ↓
PROCESS
  ↓
OUTPUT
```
