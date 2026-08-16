import { getTranslations } from "next-intl/server";

export default async function ContactPage() {
  const t = await getTranslations("Contact");
  const common = await getTranslations("Common");

  return (
    <div className="max-w-lg">
      <h1 className="text-3xl font-bold mb-6">{t("title")}</h1>
      <p className="text-muted mb-6">{common("comingSoon")}</p>
    </div>
  );
}
