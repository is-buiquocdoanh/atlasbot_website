// TODO: Kết nối CMS thật (Sanity/Strapi) ở đây.
// Ví dụ với Sanity, bạn sẽ cài @sanity/client rồi tạo client như bên dưới:
//
// import { createClient } from "@sanity/client";
// export const sanityClient = createClient({
//   projectId: process.env.SANITY_PROJECT_ID!,
//   dataset: process.env.SANITY_DATASET!,
//   apiVersion: "2024-01-01",
//   useCdn: true,
// });

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { BlogPost } from "@/types/blog";
import { Project } from "@/types/project";
import { Category } from "@/types/category";

// Cây danh mục Blog — nguồn chuẩn là docs/chu_de_blog.md (9 chủ đề lớn).
// Dữ liệu mẫu tạm thời; khi có Sanity sẽ chuyển thành document type `Category`
// (field `parentCategory` tự tham chiếu chính nó) và quản lý động từ Sanity Studio
// — không hardcode trong code nữa. Các mục lá trong chu_de_blog.md (VD: "Diode",
// "UART", "STM32"...) là Ý TƯỞNG BÀI VIẾT, không phải category — không tạo thành
// node riêng ở đây, chỉ dùng khi viết bài thật (điền vào field `tags` hoặc tiêu đề).
const CATEGORIES: Category[] = [
  // 01. Lập trình nhúng (Embedded)
  { id: "lap-trinh-nhung", name: "Lập trình nhúng (Embedded)", slug: "lap-trinh-nhung" },
  { id: "ltn-kien-thuc-nen-tang", name: "Kiến thức nền tảng", slug: "ltn-kien-thuc-nen-tang", parentId: "lap-trinh-nhung" },
  { id: "ltn-linh-kien-dien-tu", name: "Linh kiện điện tử", slug: "ltn-linh-kien-dien-tu", parentId: "lap-trinh-nhung" },
  { id: "ltn-vi-dieu-khien", name: "Vi điều khiển", slug: "ltn-vi-dieu-khien", parentId: "lap-trinh-nhung" },
  { id: "ltn-lap-trinh-c-cpp", name: "Lập trình C/C++", slug: "ltn-lap-trinh-c-cpp", parentId: "lap-trinh-nhung" },
  { id: "ltn-giao-tiep-phan-cung", name: "Giao tiếp phần cứng", slug: "ltn-giao-tiep-phan-cung", parentId: "lap-trinh-nhung" },
  { id: "ltn-dieu-khien-dong-co", name: "Điều khiển động cơ", slug: "ltn-dieu-khien-dong-co", parentId: "lap-trinh-nhung" },

  // 02. ROS / ROS2
  { id: "ros-ros2", name: "ROS / ROS2", slug: "ros-ros2" },
  { id: "ros2-co-ban", name: "ROS2 cơ bản", slug: "ros2-co-ban", parentId: "ros-ros2" },
  { id: "ros2-communication", name: "ROS2 Communication", slug: "ros2-communication", parentId: "ros-ros2" },
  { id: "ros2-package", name: "ROS2 Package", slug: "ros2-package", parentId: "ros-ros2" },
  { id: "ros2-tools", name: "ROS2 Tools", slug: "ros2-tools", parentId: "ros-ros2" },
  { id: "ros2-nang-cao", name: "ROS2 nâng cao", slug: "ros2-nang-cao", parentId: "ros-ros2" },

  // 03. Robotics Fundamentals
  { id: "robotics-fundamentals", name: "Robotics Fundamentals", slug: "robotics-fundamentals" },
  { id: "rf-toan-cho-robotics", name: "Toán cho Robotics", slug: "rf-toan-cho-robotics", parentId: "robotics-fundamentals" },
  { id: "rf-dong-hoc-robot", name: "Động học Robot", slug: "rf-dong-hoc-robot", parentId: "robotics-fundamentals" },
  { id: "rf-dieu-khien-robot", name: "Điều khiển Robot", slug: "rf-dieu-khien-robot", parentId: "robotics-fundamentals" },
  { id: "rf-localization", name: "Localization", slug: "rf-localization", parentId: "robotics-fundamentals" },

  // 04. AMR / AGV
  { id: "amr-agv", name: "AMR / AGV", slug: "amr-agv" },
  { id: "amr-tong-quan", name: "Tổng quan AMR / AGV", slug: "amr-tong-quan", parentId: "amr-agv" },
  { id: "amr-hardware", name: "Hardware AMR", slug: "amr-hardware", parentId: "amr-agv" },
  { id: "amr-drive-system", name: "AMR Drive System", slug: "amr-drive-system", parentId: "amr-agv" },
  { id: "amr-software-architecture", name: "AMR Software Architecture", slug: "amr-software-architecture", parentId: "amr-agv" },
  { id: "amr-thiet-ke-thuc-te", name: "Thiết kế AMR thực tế", slug: "amr-thiet-ke-thuc-te", parentId: "amr-agv" },

  // 05. ROS2 Navigation / Nav2
  { id: "ros2-navigation", name: "ROS2 Navigation / Nav2", slug: "ros2-navigation" },
  { id: "nav-co-ban", name: "Navigation cơ bản", slug: "nav-co-ban", parentId: "ros2-navigation" },
  { id: "nav-slam", name: "SLAM", slug: "nav-slam", parentId: "ros2-navigation" },
  { id: "nav-localization", name: "Localization", slug: "nav-localization", parentId: "ros2-navigation" },
  { id: "nav-nav2", name: "Nav2", slug: "nav-nav2", parentId: "ros2-navigation" },
  { id: "nav-tuning", name: "Tuning Nav2", slug: "nav-tuning", parentId: "ros2-navigation" },

  // 06. Sensor & Perception
  { id: "sensor-perception", name: "Sensor & Perception", slug: "sensor-perception" },
  { id: "sp-lidar", name: "LiDAR", slug: "sp-lidar", parentId: "sensor-perception" },
  { id: "sp-camera", name: "Camera", slug: "sp-camera", parentId: "sensor-perception" },
  { id: "sp-imu", name: "IMU", slug: "sp-imu", parentId: "sensor-perception" },
  { id: "sp-cv-ai", name: "Computer Vision / AI", slug: "sp-cv-ai", parentId: "sensor-perception" },

  // 07. Linux / Ubuntu / Jetson (không chia chủ đề con trong chu_de_blog.md)
  { id: "linux-jetson", name: "Linux / Ubuntu / Jetson", slug: "linux-jetson" },

  // 08. Project thực tế
  { id: "du-an-thuc-te", name: "Project thực tế", slug: "du-an-thuc-te" },
  { id: "proj-embedded", name: "Embedded Project", slug: "proj-embedded", parentId: "du-an-thuc-te" },
  { id: "proj-ros2", name: "ROS2 Project", slug: "proj-ros2", parentId: "du-an-thuc-te" },
  { id: "proj-amr", name: "AMR Project", slug: "proj-amr", parentId: "du-an-thuc-te" },
  { id: "proj-a-to-z", name: "Project từ A → Z", slug: "proj-a-to-z", parentId: "du-an-thuc-te" },

  // 09. Troubleshooting
  { id: "troubleshooting", name: "Troubleshooting", slug: "troubleshooting" },
  { id: "ts-embedded", name: "Embedded", slug: "ts-embedded", parentId: "troubleshooting" },
  { id: "ts-ros2", name: "ROS2", slug: "ts-ros2", parentId: "troubleshooting" },
  { id: "ts-slam", name: "SLAM", slug: "ts-slam", parentId: "troubleshooting" },
  { id: "ts-nav2", name: "Nav2", slug: "ts-nav2", parentId: "troubleshooting" },
];

export interface CategoryNode extends Category {
  children: CategoryNode[];
}

export function buildCategoryTree(categories: Category[] = CATEGORIES): CategoryNode[] {
  const nodes = new Map<string, CategoryNode>(
    categories.map((c) => [c.id, { ...c, children: [] }])
  );
  const roots: CategoryNode[] = [];

  for (const category of categories) {
    const node = nodes.get(category.id)!;
    const parent = category.parentId ? nodes.get(category.parentId) : undefined;
    if (parent) {
      parent.children.push(node);
    } else {
      roots.push(node);
    }
  }

  return roots;
}

export async function getAllCategories(): Promise<Category[]> {
  return CATEGORIES;
}

export async function getCategoryById(id: string): Promise<Category | null> {
  return CATEGORIES.find((c) => c.id === id) ?? null;
}

function findCategoryByName(name: string): Category | undefined {
  return CATEGORIES.find((c) => c.name === name);
}

// Mỗi bài viết là 1 folder riêng, lồng theo đúng cây thư mục chủ đề:
//   public/blog-content/<category>/<subcategory>/NN-slug/index.md
// (+ ảnh của chính bài đó nằm ngay cạnh index.md, cùng folder) — xem
// docs/TEMPLATE.md / TEMPLATE_V2.md. Sửa bài nào chỉ cần vào đúng 1 folder bài
// đó, không phải lục nhiều nơi; category nào chưa có bài không cần tạo folder.
// Tầng <subcategory> là TUỲ CHỌN — nếu category không có chủ đề con, bài viết
// có thể nằm thẳng dưới <category>/NN-slug/index.md (code tự nhận diện dựa
// vào có index.md ngay trong folder hay không, không dựa vào tên folder).
// Nằm trong public/ (không phải src/content) để ảnh co-located được Next.js
// serve thẳng qua static file serving, không cần route/code riêng.
// Frontmatter `coverImage` và ảnh chèn trong nội dung (`![...](ten-file.svg)`)
// chỉ cần ghi TÊN FILE — code tự suy ra URL đầy đủ dựa vào vị trí folder.
const BLOG_CONTENT_DIR = path.join(process.cwd(), "public", "blog-content");

interface PostFrontmatter {
  title: string;
  slug: string;
  category: string;
  subcategory?: string;
  level: 1 | 2 | 3;
  tags: string[];
  publishedAt: string;
  author: string;
  coverImage: string;
  excerpt: string;
  readingTime: number;
}

// Ảnh chèn trong nội dung markdown chỉ ghi tên file (co-located) — đổi thành
// URL đầy đủ trỏ vào đúng folder của bài đó. Đường dẫn tuyệt đối (bắt đầu bằng
// "/") hoặc URL ngoài (http...) giữ nguyên, không đổi (VD: ảnh dùng chung).
function resolveAssetPath(value: string, assetBaseUrl: string): string {
  if (/^(https?:)?\//.test(value)) return value;
  return `${assetBaseUrl}/${value}`;
}

function resolveContentImages(markdown: string, assetBaseUrl: string): string {
  return markdown.replace(
    /!\[([^\]]*)\]\(([^)\s]+)\)/g,
    (match, alt, src) => `![${alt}](${resolveAssetPath(src, assetBaseUrl)})`
  );
}

// Đọc 1 bài viết từ folder của nó (nếu có index.md), trả về null nếu đây
// không phải folder bài viết (VD: là 1 folder chuyên mục con chứa nhiều bài).
// `pathSegments` là đường dẫn folder tính từ BLOG_CONTENT_DIR (VD:
// ["lap-trinh-nhung", "Kiến thức nền tảng", "04-gpio-la-gi"]) — dùng để dựng
// URL ảnh, mã hoá từng đoạn qua encodeURIComponent để tên có dấu/khoảng
// trắng vẫn ra URL hợp lệ.
function loadPostFromFolder(postPath: string, pathSegments: string[]): BlogPost | null {
  const indexPath = path.join(postPath, "index.md");
  if (!fs.existsSync(indexPath)) return null;

  const raw = fs.readFileSync(indexPath, "utf-8");
  const { data, content } = matter(raw);
  const fm = data as PostFrontmatter;

  const postFolderName = pathSegments[pathSegments.length - 1];
  const orderMatch = postFolderName.match(/^(\d+)-/);
  const order = orderMatch ? parseInt(orderMatch[1], 10) : 0;

  const parentCategory = findCategoryByName(fm.category);
  const childCategory = fm.subcategory
    ? CATEGORIES.find(
        (c) => c.name === fm.subcategory && c.parentId === parentCategory?.id
      )
    : undefined;
  const resolvedCategory = childCategory ?? parentCategory;

  if (!resolvedCategory) {
    throw new Error(
      `Không tìm thấy category "${fm.category}"${
        fm.subcategory ? ` / subcategory "${fm.subcategory}"` : ""
      } cho bài "${fm.title}" (${indexPath}). Kiểm tra tên category trong frontmatter có khớp đúng field "name" trong CATEGORIES ở src/lib/cms.ts không.`
    );
  }

  const assetBaseUrl = "/blog-content/" + pathSegments.map(encodeURIComponent).join("/");

  return {
    id: fm.slug,
    title: fm.title,
    slug: fm.slug,
    coverImage: resolveAssetPath(fm.coverImage, assetBaseUrl),
    content: resolveContentImages(content, assetBaseUrl),
    excerpt: fm.excerpt,
    categoryId: resolvedCategory.id,
    level: fm.level,
    tags: fm.tags ?? [],
    publishedAt: fm.publishedAt,
    author: fm.author,
    readingTime: fm.readingTime,
    order,
  };
}

function loadAllPosts(): BlogPost[] {
  const posts: BlogPost[] = [];

  const categoryDirs = fs
    .readdirSync(BLOG_CONTENT_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory());

  for (const categoryDir of categoryDirs) {
    const categoryPath = path.join(BLOG_CONTENT_DIR, categoryDir.name);
    const entries = fs
      .readdirSync(categoryPath, { withFileTypes: true })
      .filter((entry) => entry.isDirectory());

    for (const entry of entries) {
      const entryPath = path.join(categoryPath, entry.name);

      // Trường hợp không có tầng chuyên mục con: bài viết nằm thẳng đây.
      const directPost = loadPostFromFolder(entryPath, [categoryDir.name, entry.name]);
      if (directPost) {
        posts.push(directPost);
        continue;
      }

      // Không có index.md ở đây → đây là 1 folder chuyên mục con, đi sâu thêm 1 cấp.
      const postDirs = fs
        .readdirSync(entryPath, { withFileTypes: true })
        .filter((sub) => sub.isDirectory());

      for (const postDir of postDirs) {
        const postPath = path.join(entryPath, postDir.name);
        const post = loadPostFromFolder(postPath, [
          categoryDir.name,
          entry.name,
          postDir.name,
        ]);
        if (post) posts.push(post);
      }
    }
  }

  return posts;
}

let cachedPosts: BlogPost[] | null = null;
function getCachedPosts(): BlogPost[] {
  if (!cachedPosts) {
    cachedPosts = loadAllPosts();
  }
  return cachedPosts;
}

export async function getAllPosts(): Promise<BlogPost[]> {
  return getCachedPosts();
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  return getCachedPosts().find((p) => p.slug === slug) ?? null;
}

// Bài trước/sau trong cùng chuyên mục, xếp theo tiền tố số của tên file (order).
export async function getAdjacentPosts(
  slug: string
): Promise<{ prev: BlogPost | null; next: BlogPost | null }> {
  const post = await getPostBySlug(slug);
  if (!post) return { prev: null, next: null };

  const siblings = getCachedPosts()
    .filter((p) => p.categoryId === post.categoryId)
    .sort((a, b) => a.order - b.order);
  const index = siblings.findIndex((p) => p.slug === slug);

  return {
    prev: index > 0 ? siblings[index - 1] : null,
    next: index >= 0 && index < siblings.length - 1 ? siblings[index + 1] : null,
  };
}

export async function getAllProjects(): Promise<Project[]> {
  return [
    {
      id: "1",
      title: "AGV vận chuyển hàng trong nhà xưởng",
      slug: "agv-van-chuyen-hang",
      images: ["/images/placeholder.jpg"],
      description: "Mô tả dự án...",
      specs: [{ label: "Tải trọng", value: "50kg" }],
      publishedAt: "2026-07-20",
    },
  ];
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const projects = await getAllProjects();
  return projects.find((p) => p.slug === slug) ?? null;
}
