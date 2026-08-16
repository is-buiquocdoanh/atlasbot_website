import { getTranslations } from "next-intl/server";
import { getAllPosts, getAllCategories, buildCategoryTree } from "@/lib/cms";
import BlogExplorer from "@/components/blog/BlogExplorer";

export default async function BlogListPage() {
  const [t, posts, categories] = await Promise.all([
    getTranslations("Blog"),
    getAllPosts(),
    getAllCategories(),
  ]);
  const categoryTree = buildCategoryTree(categories);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">{t("title")}</h1>
      <BlogExplorer posts={posts} categories={categories} categoryTree={categoryTree} />
    </div>
  );
}
