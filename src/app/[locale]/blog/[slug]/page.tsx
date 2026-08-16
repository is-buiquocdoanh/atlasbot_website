import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import {
  getPostBySlug,
  getAllPosts,
  getCategoryById,
  getAdjacentPosts,
} from "@/lib/cms";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

const LEVEL_KEYS = {
  1: "levelBasic",
  2: "levelIntermediate",
  3: "levelAdvanced",
} as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};
  return {
    title: `${post.title} — Atlasbot`,
    description: post.excerpt,
  };
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [t, post] = await Promise.all([
    getTranslations("Blog"),
    getPostBySlug(slug),
  ]);
  if (!post) return notFound();

  const category = await getCategoryById(post.categoryId);
  const parentCategory = category?.parentId
    ? await getCategoryById(category.parentId)
    : null;

  const [allPosts, { prev, next }] = await Promise.all([
    getAllPosts(),
    getAdjacentPosts(slug),
  ]);
  const relatedPosts = allPosts
    .filter((p) => p.id !== post.id && p.categoryId === post.categoryId)
    .slice(0, 3);

  return (
    <article className="max-w-3xl mx-auto">
      <nav className="text-sm text-muted mb-4 flex flex-wrap items-center gap-1">
        <Link href="/blog" className="hover:text-foreground">
          {t("title")}
        </Link>
        {parentCategory && (
          <>
            <span>/</span>
            <Link href="/blog" className="hover:text-foreground">
              {parentCategory.name}
            </Link>
          </>
        )}
        {category && (
          <>
            <span>/</span>
            <span className="text-foreground">{category.name}</span>
          </>
        )}
      </nav>

      <div className="flex items-center gap-2">
        <span className="text-xs text-primary">{category?.name}</span>
        <span className="text-xs text-muted">· {t(LEVEL_KEYS[post.level])}</span>
      </div>
      <h1 className="text-3xl font-bold mt-2 mb-2">{post.title}</h1>
      <p className="text-sm text-muted mb-6">
        {new Date(post.publishedAt).toLocaleDateString("vi-VN")} · {post.author} ·{" "}
        {t("readingTime", { minutes: post.readingTime })}
      </p>

      {post.coverImage && (
        <div className="relative aspect-video bg-surface rounded-lg overflow-hidden mb-8">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-contain"
            sizes="(max-width: 768px) 100vw, 768px"
            priority
          />
        </div>
      )}

      <div className="prose prose-sm sm:prose-base">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
      </div>

      {(prev || next) && (
        <div className="mt-10 pt-6 border-t border-border grid grid-cols-2 gap-4 text-sm">
          <div>
            {prev && (
              <Link href={`/blog/${prev.slug}`} className="block group">
                <span className="text-muted">← {t("prevPost")}</span>
                <span className="block font-medium text-foreground group-hover:text-primary">
                  {prev.title}
                </span>
              </Link>
            )}
          </div>
          <div className="text-right">
            {next && (
              <Link href={`/blog/${next.slug}`} className="block group">
                <span className="text-muted">{t("nextPost")} →</span>
                <span className="block font-medium text-foreground group-hover:text-primary">
                  {next.title}
                </span>
              </Link>
            )}
          </div>
        </div>
      )}

      {relatedPosts.length > 0 && (
        <div className="mt-8 pt-8 border-t border-border">
          <h2 className="font-semibold mb-4">{t("relatedPosts")}</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {relatedPosts.map((related) => (
              <Link
                key={related.id}
                href={`/blog/${related.slug}`}
                className="block bg-surface rounded-lg overflow-hidden hover:opacity-90"
              >
                <div className="relative aspect-video bg-background">
                  {related.coverImage && (
                    <Image
                      src={related.coverImage}
                      alt={related.title}
                      fill
                      className="object-contain"
                      sizes="240px"
                    />
                  )}
                </div>
                <div className="p-3">
                  <h3 className="text-sm font-medium">{related.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
