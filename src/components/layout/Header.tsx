import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import LocaleSwitcher from "./LocaleSwitcher";

export default async function Header() {
  const t = await getTranslations("Nav");

  const navLinks = [
    { href: "/", label: t("home") },
    { href: "/blog", label: t("blog") },
    { href: "/du-an", label: t("projects") },
    { href: "/shop", label: t("shop") },
    { href: "/gioi-thieu", label: t("about") },
    { href: "/lien-he", label: t("contact") },
  ];

  return (
    <header className="border-b border-border bg-background/80 backdrop-blur sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-4">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/images/logo.svg" alt="Atlasbot" width={32} height={32} priority />
          <span className="text-xl font-bold tracking-tight text-foreground">
            Atlas<span className="text-primary">bot</span>
          </span>
        </Link>
        <nav className="hidden md:flex gap-6 text-sm text-muted">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hover:text-foreground transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-4">
          <LocaleSwitcher />
          <Link
            href="/shop/gio-hang"
            className="text-sm bg-primary text-white px-3 py-1.5 rounded-md hover:opacity-90"
          >
            {t("cart")}
          </Link>
        </div>
      </div>
    </header>
  );
}
