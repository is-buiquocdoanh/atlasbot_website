"use client";

import { useLocale } from "next-intl";
import { useParams } from "next/navigation";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

const localeLabels: Record<string, string> = {
  vi: "VI",
  en: "EN",
  zh: "中文",
  ko: "KO",
};

export default function LocaleSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const params = useParams();
  const router = useRouter();

  return (
    <select
      aria-label="Language"
      value={locale}
      onChange={(event) => {
        router.replace(
          // @ts-expect-error -- pathname is a dynamic route string at runtime
          { pathname, params },
          { locale: event.target.value }
        );
      }}
      className="text-sm bg-surface border border-border rounded-md px-2 py-1.5 text-foreground cursor-pointer"
    >
      {routing.locales.map((loc) => (
        <option key={loc} value={loc}>
          {localeLabels[loc]}
        </option>
      ))}
    </select>
  );
}
