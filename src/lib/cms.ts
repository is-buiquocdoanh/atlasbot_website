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

// Nội dung kỹ thuật dài (markdown) của từng dự án được tách ra file riêng,
// co-located cùng ảnh/video trong public/projects/<slug>/content.md — giống
// cách blog tách content khỏi cms.ts, tránh nhồi văn bản dài vào file TS.
const PROJECTS_DIR = path.join(process.cwd(), "public", "projects");

function loadProjectContent(slug: string): string | undefined {
  const contentPath = path.join(PROJECTS_DIR, slug, "content.md");
  if (!fs.existsSync(contentPath)) return undefined;
  return fs.readFileSync(contentPath, "utf-8");
}

export async function getAllProjects(): Promise<Project[]> {
  return [
    {
      id: "1",
      title: "Robot Mecanum tự hành (Autonomous Mecanum-Wheel Robot)",
      slug: "mecanum-robot",
      content: loadProjectContent("mecanum-robot"),
      images: [
        "/projects/mecanum-robot/overview.png",
        "/projects/mecanum-robot/front.png",
        "/projects/mecanum-robot/right.png",
        "/projects/mecanum-robot/floor1.png",
        "/projects/mecanum-robot/floor2.png",
      ],
      videos: [
        {
          url: "https://youtu.be/SoL5KJzKNMY",
          title: "Mapping — quét và dựng bản đồ bằng SLAM Cartographer",
        },
        {
          url: "https://youtu.be/H2pn3pVcRK0",
          title: "Navigation — điều hướng tự động và tránh vật cản với Nav2",
        },
      ],
      description:
        "Robot di động 4 bánh Mecanum, di chuyển được theo mọi hướng (kể cả đi ngang, xoay tại chỗ) — phù hợp cho nhà xưởng và không gian hẹp. ESP32 đảm nhiệm điều khiển động cơ và đọc encoder ở tầng thấp, Raspberry Pi 4 chạy ROS2 để xử lý SLAM, định vị và điều hướng ở tầng cao. Robot có khả năng tự quét-dựng bản đồ, định vị, tránh vật cản và tự lập kế hoạch đường đi.",
      specs: [
        { label: "Kiểu di chuyển", value: "4 bánh Mecanum (omnidirectional)" },
        { label: "Vi điều khiển", value: "ESP32 — điều khiển động cơ, đọc encoder" },
        { label: "Máy tính nhúng", value: "Raspberry Pi 4 (4GB/8GB RAM)" },
        { label: "Cảm biến LiDAR", value: "YDLIDAR X3 Pro" },
        { label: "Động cơ", value: "4x GA25 DC Motor kèm encoder" },
        { label: "Driver động cơ", value: "L298N (4 kênh)" },
        { label: "Nguồn", value: "Pin Lithium 3S2P 12V" },
        { label: "Hệ điều hành", value: "Ubuntu 20.04 / 22.04" },
        { label: "Framework", value: "ROS2 Foxy / Humble" },
        { label: "SLAM", value: "Cartographer" },
        { label: "Điều hướng", value: "Nav2 (Navigation2)" },
      ],
      githubUrl: "https://github.com/is-buiquocdoanh/mecanum_robot",
      publishedAt: "2026-08-16",
    },
    {
      id: "2",
      title: "Diff Robot — Robot vi sai lập bản đồ & điều hướng ROS2",
      slug: "diff-robot",
      content: loadProjectContent("diff-robot"),
      images: [
        "/projects/diff-robot/overview.png",
        "/projects/diff-robot/front.jpg",
        "/projects/diff-robot/back.jpg",
        "/projects/diff-robot/left.jpg",
        "/projects/diff-robot/right.jpg",
        "/projects/diff-robot/top.jpg",
        "/projects/diff-robot/bot.jpg",
      ],
      videos: [
        {
          url: "https://youtu.be/Vxy7BAhR34U",
          title: "Mapping — dựng bản đồ môi trường bằng SLAM",
        },
        {
          url: "https://youtu.be/dPI5TLDtxFU",
          title: "Navigation2 — điều hướng tự động và tránh vật cản",
        },
      ],
      description:
        "Robot di động 2 bánh vi sai (differential drive) phục vụ nghiên cứu lập bản đồ và điều hướng tự động trên ROS2. Kiến trúc 3 tầng: Arduino/ESP32 đọc encoder và điều khiển động cơ ở tầng thấp; Raspberry Pi 4 chạy ROS2 tính odometry, SLAM (Cartographer hoặc SLAM Toolbox) và Nav2 ở tầng tính toán; RViz2 giám sát robot, quỹ đạo, bản đồ và trạng thái Nav2 ở tầng ứng dụng.",
      specs: [
        { label: "Kiểu di chuyển", value: "2 bánh vi sai (differential drive)" },
        { label: "Vi điều khiển", value: "Arduino Nano / ESP32 — đọc encoder, điều khiển động cơ" },
        { label: "Máy tính nhúng", value: "Raspberry Pi 4 (4GB/8GB RAM)" },
        { label: "Cảm biến LiDAR", value: "YDLIDAR X3 Pro hoặc RPLIDAR A1/A2" },
        { label: "Động cơ", value: "GA25 — 120RPM, mô-men khoá trục 7,3kg·cm, ~1,8A khi có tải" },
        { label: "Driver động cơ", value: "L298N / BTS7960 / Cytron" },
        { label: "Nguồn", value: "Pin 12V 10C" },
        { label: "Giao tiếp tầng thấp", value: "Serial UART 57600 baud (Arduino ↔ ROS2)" },
        { label: "Framework", value: "ROS2" },
        { label: "SLAM", value: "Cartographer hoặc SLAM Toolbox" },
        { label: "Điều hướng", value: "Nav2 — AMCL, Costmap, BT Navigator" },
        { label: "Giấy phép", value: "MIT License" },
      ],
      githubUrl: "https://github.com/is-buiquocdoanh/diff_robot",
      publishedAt: "2026-08-16",
    },
    {
      id: "3",
      title: "Atlas A2 — Robot tự hành trong nhà trên Jetson Orin Nano",
      slug: "atlas-a2",
      content: loadProjectContent("atlas-a2"),
      images: [
        "/projects/atlas-a2/overview.jpg",
        "/projects/atlas-a2/front.jpg",
        "/projects/atlas-a2/inside.jpg",
        "/projects/atlas-a2/app-ui.png",
      ],
      description:
        "Robot tự hành trong nhà chạy ROS2 Humble trên Jetson Orin Nano, bánh Mecanum di chuyển đa hướng. Tích hợp SLAM (slam_toolbox) và Nav2 để tự định vị, dẫn đường và tránh vật cản; tự động về trạm sạc bằng bám vạch từ trường 16-kênh khi pin yếu; nhận diện vật thể realtime bằng YOLOv8. Điều khiển qua tầng dịch vụ REST API/WebSocket riêng (atlas_api), phục vụ đồng thời app PyQt5 trên PC (atlas_app) và app cảm ứng gắn trên robot (atlas_app_robot).",
      specs: [
        { label: "Kiểu di chuyển", value: "4 bánh Mecanum (Supo, omnidirectional)" },
        { label: "Máy tính nhúng", value: "Jetson Orin Nano Developer Kit (Super)" },
        { label: "Cảm biến LiDAR", value: "RPlidar A2M12" },
        { label: "Động cơ", value: "4x TODE brushless — CAN bus" },
        { label: "Driver động cơ", value: "TSDA-C12D (USB-CAN)" },
        { label: "Cảm biến va chạm", value: "ESP32 + nút dừng khẩn cấp phần cứng" },
        { label: "Cảm biến docking", value: "16-kênh từ trường (Modbus RTU)" },
        { label: "Camera", value: "USB UVC (v4l2) + YOLOv8 object detection" },
        { label: "Nguồn", value: "2x Pin Lithium-ion CSC 12VDC 40Ah" },
        { label: "Hệ điều hành", value: "Ubuntu 22.04 LTS" },
        { label: "Framework", value: "ROS2 Humble" },
        { label: "SLAM", value: "slam_toolbox" },
        { label: "Định vị", value: "AMCL" },
        { label: "Điều hướng", value: "Nav2 — DWB / MPPI controller" },
        { label: "Điều khiển", value: "REST API + WebSocket (Flask) — app PyQt5 (PC) và app cảm ứng (robot)" },
      ],
      githubUrl: "https://github.com/is-buiquocdoanh/atlas_a2",
      publishedAt: "2026-08-17",
    },
  ];
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const projects = await getAllProjects();
  return projects.find((p) => p.slug === slug) ?? null;
}
