export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  coverImage: string;
  content: string;
  excerpt: string;
  categoryId: string;
  /** 1 = cơ bản, 2 = trung bình, 3 = nâng cao — xem docs/TEMPLATE.md */
  level: 1 | 2 | 3;
  tags: string[];
  publishedAt: string;
  author: string;
  readingTime: number;
  /** Thứ tự trong folder category, lấy từ tiền tố số của tên file (01-, 02-...) — dùng để tính bài trước/sau. */
  order: number;
}
