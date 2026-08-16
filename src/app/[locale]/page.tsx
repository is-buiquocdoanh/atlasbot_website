import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function HomePage() {
  const t = useTranslations("Home");
  const common = useTranslations("Common");
  const middle = t("heroTitleMiddle");

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

      {/* Placeholder sections - thay bằng dữ liệu thật từ CMS/DB sau (xem src/lib/cms.ts, src/lib/products.ts) */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">{t("latestPosts")}</h2>
        <p className="text-muted">{common("comingSoon")}</p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">{t("featuredProjects")}</h2>
        <p className="text-muted">{common("comingSoon")}</p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">{t("featuredProducts")}</h2>
        <p className="text-muted">{common("comingSoon")}</p>
      </section>
    </div>
  );
}
