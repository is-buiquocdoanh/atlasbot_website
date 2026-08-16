"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";

const MESSENGER_USERNAME = process.env.NEXT_PUBLIC_MESSENGER_USERNAME;
const ZALO_PHONE = process.env.NEXT_PUBLIC_ZALO_PHONE;

function isConfigured(value: string | undefined) {
  return Boolean(value) && value !== "TODO";
}

export default function CheckoutPage() {
  const t = useTranslations("Checkout");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const messengerReady = isConfigured(MESSENGER_USERNAME);
  const zaloReady = isConfigured(ZALO_PHONE);

  const orderText = useMemo(() => {
    const lines = [
      "Đơn hàng mới từ Atlasbot:",
      `Họ tên: ${name || "—"}`,
      `SĐT: ${phone || "—"}`,
      `Địa chỉ: ${address || "—"}`,
    ];
    return lines.join("\n");
  }, [name, phone, address]);

  function handleSend(event: React.MouseEvent<HTMLAnchorElement>, ready: boolean) {
    if (!ready) {
      event.preventDefault();
    }
  }

  return (
    <div className="max-w-lg">
      <h1 className="text-3xl font-bold mb-8">{t("title")}</h1>
      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <input
          className="w-full bg-surface border border-border rounded-md px-4 py-2.5"
          placeholder={t("name")}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="w-full bg-surface border border-border rounded-md px-4 py-2.5"
          placeholder={t("phone")}
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <input
          className="w-full bg-surface border border-border rounded-md px-4 py-2.5"
          placeholder={t("address")}
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />

        <div>
          <h2 className="text-sm font-semibold text-muted mb-2">
            {t("orderSummary")}
          </h2>
          <pre className="whitespace-pre-wrap text-sm bg-surface border border-border rounded-md px-4 py-3">
            {orderText}
          </pre>
        </div>

        <p className="text-sm text-muted">{t("note")}</p>

        <div className="flex flex-col sm:flex-row gap-3">
          <a
            href={messengerReady ? `https://m.me/${MESSENGER_USERNAME}` : "#"}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => handleSend(e, messengerReady)}
            aria-disabled={!messengerReady}
            title={!messengerReady ? t("contactMissing") : undefined}
            className={`flex-1 text-center px-6 py-3 rounded-lg font-medium ${
              messengerReady
                ? "bg-primary text-white hover:opacity-90"
                : "bg-surface border border-border text-muted cursor-not-allowed"
            }`}
          >
            {t("sendMessenger")}
          </a>
          <a
            href={zaloReady ? `https://zalo.me/${ZALO_PHONE}` : "#"}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => handleSend(e, zaloReady)}
            aria-disabled={!zaloReady}
            title={!zaloReady ? t("contactMissing") : undefined}
            className={`flex-1 text-center px-6 py-3 rounded-lg font-medium ${
              zaloReady
                ? "bg-accent text-white hover:opacity-90"
                : "bg-surface border border-border text-muted cursor-not-allowed"
            }`}
          >
            {t("sendZalo")}
          </a>
        </div>
      </form>
    </div>
  );
}
