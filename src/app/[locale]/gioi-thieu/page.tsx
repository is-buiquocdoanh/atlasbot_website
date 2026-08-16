import { getTranslations } from "next-intl/server";

export default async function AboutPage() {
  const t = await getTranslations("About");
  const common = await getTranslations("Common");

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">{t("title")}</h1>
      <p className="text-muted">{common("comingSoon")}</p>
    </div>
  );
}
