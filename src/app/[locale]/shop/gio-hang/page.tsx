// TODO: lấy dữ liệu giỏ hàng từ Context/Zustand (client component) — Giai đoạn 5
"use client";

import { useTranslations } from "next-intl";

export default function CartPage() {
  const t = useTranslations("Cart");

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">{t("title")}</h1>
      <p className="text-muted">{t("empty")}</p>
    </div>
  );
}
