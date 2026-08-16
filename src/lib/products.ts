// TODO: Thay bằng truy vấn database thật (PostgreSQL qua Prisma/Supabase...)

import { Product } from "@/types/product";

export async function getAllProducts(): Promise<Product[]> {
  return [
    {
      id: "1",
      name: "Cảm biến LiDAR RPLidar A1",
      slug: "lidar-rplidar-a1",
      price: 2990000,
      images: ["/images/placeholder.jpg"],
      description: "Cảm biến quét laser 2D dùng cho SLAM.",
      category: "Cảm biến",
      specs: [{ label: "Bán kính quét", value: "12m" }],
      stock: 10,
    },
  ];
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const products = await getAllProducts();
  return products.find((p) => p.slug === slug) ?? null;
}
