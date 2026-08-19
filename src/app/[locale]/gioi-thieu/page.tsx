import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

const PILLARS = [
  { titleKey: "pillarBlogTitle", descKey: "pillarBlogDesc", href: "/blog" },
  { titleKey: "pillarProjectsTitle", descKey: "pillarProjectsDesc", href: "/du-an" },
  { titleKey: "pillarShopTitle", descKey: "pillarShopDesc", href: "/shop" },
] as const;

export default async function AboutPage() {
  const t = await getTranslations("About");

  return (
    <div className="max-w-3xl mx-auto space-y-16">
      {/* Hero */}
      <section className="text-center py-8">
        <h1 className="text-4xl font-bold mb-4">{t("heroTitle")}</h1>
        <p className="text-muted text-lg">{t("heroSubtitle")}</p>
      </section>

      {/* Câu chuyện */}
      <section className="space-y-4">
        <p className="text-foreground leading-relaxed">{t("storyParagraph1")}</p>
        <p className="text-foreground leading-relaxed">{t("storyParagraph2")}</p>
        <p className="text-foreground leading-relaxed">{t("storyParagraph3")}</p>
      </section>

      {/* 3 trụ cột */}
      <section>
        <h2 className="text-2xl font-semibold mb-6 text-center">{t("pillarsTitle")}</h2>
        <div className="grid sm:grid-cols-3 gap-6">
          {PILLARS.map((pillar) => (
            <Link
              key={pillar.titleKey}
              href={pillar.href}
              className="block p-5 rounded-lg bg-surface border border-border hover:opacity-90"
            >
              <h3 className="font-semibold text-foreground mb-2">{t(pillar.titleKey)}</h3>
              <p className="text-sm text-muted leading-relaxed">{t(pillar.descKey)}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Định hướng */}
      <section className="p-6 rounded-lg bg-surface border border-border">
        <h2 className="text-xl font-semibold mb-2">{t("visionTitle")}</h2>
        <p className="text-muted leading-relaxed">{t("visionText")}</p>
      </section>

      {/* CTA */}
      <section className="flex flex-wrap justify-center gap-4 pb-8">
        <Link href="/blog" className="bg-primary text-white px-5 py-2.5 rounded-lg">
          {t("ctaBlog")}
        </Link>
        <Link
          href="/du-an"
          className="border border-border px-5 py-2.5 rounded-lg hover:bg-surface"
        >
          {t("ctaProjects")}
        </Link>
        <Link
          href="/shop"
          className="border border-border px-5 py-2.5 rounded-lg hover:bg-surface"
        >
          {t("ctaShop")}
        </Link>
      </section>
    </div>
  );
}
