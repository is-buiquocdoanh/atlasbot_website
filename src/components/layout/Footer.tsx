import { getTranslations } from "next-intl/server";

export default async function Footer() {
  const t = await getTranslations("Footer");

  return (
    <footer className="border-t border-border mt-20">
      <div className="max-w-6xl mx-auto px-4 py-10 text-sm text-muted flex flex-col md:flex-row justify-between gap-4">
        <p>
          © {new Date().getFullYear()} Atlasbot. {t("tagline")}
        </p>
        <div className="flex gap-4">
          <a href="#" className="hover:text-foreground">
            GitHub
          </a>
          <a href="#" className="hover:text-foreground">
            YouTube
          </a>
          <a href="#" className="hover:text-foreground">
            Facebook
          </a>
        </div>
      </div>
    </footer>
  );
}
