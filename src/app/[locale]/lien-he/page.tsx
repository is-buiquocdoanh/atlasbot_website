"use client";

import { useTranslations } from "next-intl";

const MESSENGER_USERNAME = process.env.NEXT_PUBLIC_MESSENGER_USERNAME;
const ZALO_PHONE = process.env.NEXT_PUBLIC_ZALO_PHONE;

function isConfigured(value: string | undefined) {
  return Boolean(value) && value !== "TODO";
}

const USE_CASE_KEYS = ["useCase1", "useCase2", "useCase3", "useCase4"] as const;

export default function ContactPage() {
  const t = useTranslations("Contact");

  const messengerReady = isConfigured(MESSENGER_USERNAME);
  const zaloReady = isConfigured(ZALO_PHONE);

  function handleClick(e: React.MouseEvent<HTMLAnchorElement>, ready: boolean) {
    if (!ready) e.preventDefault();
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-3">{t("title")}</h1>
      <p className="text-muted mb-10">{t("subtitle")}</p>

      <div className="grid sm:grid-cols-2 gap-6 mb-10">
        <div className="p-6 rounded-lg bg-surface border border-border flex flex-col">
          <h2 className="font-semibold text-foreground mb-2">{t("messengerTitle")}</h2>
          <p className="text-sm text-muted mb-5 flex-1">{t("messengerDesc")}</p>
          <a
            href={messengerReady ? `https://m.me/${MESSENGER_USERNAME}` : "#"}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => handleClick(e, messengerReady)}
            aria-disabled={!messengerReady}
            title={!messengerReady ? t("contactMissing") : undefined}
            className={`text-center px-5 py-2.5 rounded-lg font-medium transition-opacity ${
              messengerReady
                ? "bg-primary text-white hover:opacity-90"
                : "bg-background border border-border text-muted cursor-not-allowed"
            }`}
          >
            {t("ctaMessenger")}
          </a>
        </div>

        <div className="p-6 rounded-lg bg-surface border border-border flex flex-col">
          <h2 className="font-semibold text-foreground mb-2">{t("zaloTitle")}</h2>
          <p className="text-sm text-muted mb-5 flex-1">{t("zaloDesc")}</p>
          <a
            href={zaloReady ? `https://zalo.me/${ZALO_PHONE}` : "#"}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => handleClick(e, zaloReady)}
            aria-disabled={!zaloReady}
            title={!zaloReady ? t("contactMissing") : undefined}
            className={`text-center px-5 py-2.5 rounded-lg font-medium transition-opacity ${
              zaloReady
                ? "bg-accent text-white hover:opacity-90"
                : "bg-background border border-border text-muted cursor-not-allowed"
            }`}
          >
            {t("ctaZalo")}
          </a>
        </div>
      </div>

      <div className="p-6 rounded-lg bg-surface border border-border">
        <h2 className="font-semibold text-foreground mb-3">{t("useCasesTitle")}</h2>
        <ul className="space-y-2">
          {USE_CASE_KEYS.map((key) => (
            <li key={key} className="text-sm text-muted flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              <span>{t(key)}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
