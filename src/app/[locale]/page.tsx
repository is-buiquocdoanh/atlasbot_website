import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getAllPosts, getAllCategories, getAllProjects } from "@/lib/cms";
import { getAllProducts } from "@/lib/products";
import ProductCard from "@/components/shop/ProductCard";

export default async function HomePage() {
  const [t, common, posts, categories, projects, products] = await Promise.all([
    getTranslations("Home"),
    getTranslations("Common"),
    getAllPosts(),
    getAllCategories(),
    getAllProjects(),
    getAllProducts(),
  ]);
  const middle = t("heroTitleMiddle");

  const categoryNameById = new Map(categories.map((c) => [c.id, c.name]));
  const latestPosts = [...posts]
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, 3);
  const featuredProjects = projects.slice(0, 3);
  const featuredProducts = products.slice(0, 4);

  return (
    <div className="space-y-16">
      {/* Hero */}
      <section className="text-center py-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 flex flex-wrap justify-center gap-x-2">
          <span>{t("heroTitlePrefix")}</span>
          <span className="text-primary">{t("heroTitleHighlight1")}</span>
          {middle && <span>{middle}</span>}
          <span className="text-accent">{t("heroTitleHighlight2")}</span>
        </h1>
        <p className="text-muted max-w-xl mx-auto mb-8">{t("heroDescription")}</p>
        <div className="flex justify-center gap-4">
          <Link href="/blog" className="bg-primary text-white px-5 py-2.5 rounded-lg">
            {t("ctaBlog")}
          </Link>
          <Link
            href="/shop"
            className="border border-border px-5 py-2.5 rounded-lg hover:bg-surface"
          >
            {t("ctaShop")}
          </Link>
        </div>
      </section>

      {/* Bài viết mới nhất */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold">{t("latestPosts")}</h2>
          <Link href="/blog" className="text-sm text-primary hover:underline">
            {t("viewAll")}
          </Link>
        </div>
        {latestPosts.length === 0 ? (
          <p className="text-muted">{common("comingSoon")}</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestPosts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="block bg-surface rounded-lg overflow-hidden hover:opacity-90"
              >
                <div className="relative aspect-video bg-background">
                  {post.coverImage && (
                    <Image
                      src={post.coverImage}
                      alt={post.title}
                      fill
                      className="object-contain"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  )}
                </div>
                <div className="p-4">
                  <span className="text-xs text-primary">
                    {categoryNameById.get(post.categoryId) ?? post.categoryId}
                  </span>
                  <h3 className="font-semibold mt-1 text-foreground">{post.title}</h3>
                  <p className="text-sm text-muted mt-1 line-clamp-2">{post.excerpt}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Dự án nổi bật */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold">{t("featuredProjects")}</h2>
          <Link href="/du-an" className="text-sm text-primary hover:underline">
            {t("viewAll")}
          </Link>
        </div>
        {featuredProjects.length === 0 ? (
          <p className="text-muted">{common("comingSoon")}</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProjects.map((project) => (
              <Link
                key={project.id}
                href={`/du-an/${project.slug}`}
                className="block bg-surface rounded-lg overflow-hidden hover:opacity-90"
              >
                <div className="relative aspect-video bg-border">
                  {project.images[0] && (
                    <Image
                      src={project.images[0]}
                      alt={project.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-foreground">{project.title}</h3>
                  <p className="text-sm text-muted mt-1 line-clamp-2">
                    {project.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Sản phẩm nổi bật */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold">{t("featuredProducts")}</h2>
          <Link href="/shop" className="text-sm text-primary hover:underline">
            {t("viewAll")}
          </Link>
        </div>
        {featuredProducts.length === 0 ? (
          <p className="text-muted">{common("comingSoon")}</p>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
