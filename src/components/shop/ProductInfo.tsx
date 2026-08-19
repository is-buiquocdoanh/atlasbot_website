"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Product } from "@/types/product";
import { Icon } from "./icons";

const MESSENGER_USERNAME = process.env.NEXT_PUBLIC_MESSENGER_USERNAME;
const ZALO_PHONE = process.env.NEXT_PUBLIC_ZALO_PHONE;

function isConfigured(value: string | undefined) {
  return Boolean(value) && value !== "TODO";
}

function formatVND(price: number) {
  return price.toLocaleString("vi-VN") + "đ";
}

const TRUST_BADGES = [
  { icon: "warranty", titleKey: "trustWarranty", descKey: "trustWarrantyDesc" },
  { icon: "shipping", titleKey: "trustShipping", descKey: "trustShippingDesc" },
  { icon: "support", titleKey: "trustSupport", descKey: "trustSupportDesc" },
] as const;

export default function ProductInfo({ product }: { product: Product }) {
  const t = useTranslations("Shop.detail");
  const [quantity, setQuantity] = useState(1);

  const hasVariants = Boolean(product.variants && product.variants.length > 0);
  const firstInStockIndex = product.variants?.findIndex((v) => v.stock > 0) ?? -1;
  const [selectedVariant, setSelectedVariant] = useState(
    firstInStockIndex >= 0 ? firstInStockIndex : 0
  );

  const activeStock = hasVariants ? product.variants![selectedVariant].stock : product.stock;
  const activePrice =
    (hasVariants && product.variants![selectedVariant].price) || product.price;
  const inStock = activeStock > 0;
  const messengerReady = isConfigured(MESSENGER_USERNAME);
  const zaloReady = isConfigured(ZALO_PHONE);

  const discountPercent = useMemo(() => {
    if (!product.compareAtPrice || product.compareAtPrice <= activePrice) return null;
    return Math.round((1 - activePrice / product.compareAtPrice) * 100);
  }, [activePrice, product.compareAtPrice]);

  const orderMessage = useMemo(() => {
    const variantLabel = hasVariants ? ` — ${product.variants![selectedVariant].label}` : "";
    return `Đặt hàng: ${product.name}${variantLabel} (SKU ${product.sku}) — SL: ${quantity}`;
  }, [hasVariants, product.name, product.sku, product.variants, quantity, selectedVariant]);

  function handleCtaClick(e: React.MouseEvent<HTMLAnchorElement>, ready: boolean) {
    if (!ready || !inStock) e.preventDefault();
  }

  return (
    <div>
      {/* Badge hàng */}
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-primary-tint text-primary-dark">
          {product.category}
        </span>
        {product.badge && (
          <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-accent-tint text-accent-dark">
            {product.badge}
          </span>
        )}
      </div>

      <h1 className="font-display text-[27px] font-bold leading-snug text-ink">
        {product.name}
      </h1>

      {/* SKU + rating */}
      <div className="flex flex-wrap items-center gap-3 mt-2 mb-5">
        <span className="font-mono text-xs px-2 py-1 rounded bg-surface-subtle text-ink-muted">
          {t("sku")}: {product.sku}
        </span>
        {product.rating ? (
          <span className="text-sm text-ink-muted flex items-center gap-1">
            <span className="text-accent">★</span>
            {product.rating.average.toFixed(1)} ({product.rating.count})
          </span>
        ) : (
          <span className="text-sm text-ink-faint">{t("noReviews")}</span>
        )}
      </div>

      {/* Giá */}
      <div className="flex items-end flex-wrap gap-3 mb-5">
        <span className="font-display text-3xl font-bold text-ink">
          {formatVND(activePrice)}
        </span>
        {discountPercent !== null && (
          <>
            <span className="text-base text-ink-faint line-through mb-0.5">
              {formatVND(product.compareAtPrice!)}
            </span>
            <span className="text-xs font-semibold px-2 py-1 rounded bg-accent-tint text-accent-dark mb-0.5">
              -{discountPercent}%
            </span>
          </>
        )}
      </div>

      {/* Tồn kho */}
      <div className="flex items-center gap-2 mb-6 text-sm">
        <span
          className={`w-2 h-2 rounded-full ${inStock ? "bg-success" : "bg-ink-faint"}`}
        />
        <span className={inStock ? "text-success" : "text-ink-faint"}>
          {inStock ? t("inStock", { count: activeStock }) : t("outOfStock")}
        </span>
      </div>

      {/* Tuỳ chọn (VD: mức RPM) */}
      {hasVariants && (
        <div className="mb-6">
          <p className="text-sm text-ink-muted mb-2">{t("chooseVariant")}</p>
          <div className="flex flex-wrap gap-2">
            {product.variants!.map((variant, index) => {
              const variantInStock = variant.stock > 0;
              const selected = index === selectedVariant;
              return (
                <button
                  key={variant.label}
                  type="button"
                  onClick={() => setSelectedVariant(index)}
                  disabled={!variantInStock}
                  className={`px-3.5 py-2 rounded-lg border text-left transition-colors ${
                    selected
                      ? "border-primary bg-primary-tint"
                      : "border-line hover:border-primary/50"
                  } ${!variantInStock ? "opacity-40 cursor-not-allowed" : ""}`}
                >
                  <span className="block text-sm font-medium text-ink">{variant.label}</span>
                  {variant.price ? (
                    <span className="block text-xs font-mono text-primary mt-0.5">
                      {formatVND(variant.price)}
                    </span>
                  ) : null}
                  <span className={`block text-xs mt-0.5 ${variantInStock ? "text-ink-muted" : "text-ink-faint"}`}>
                    {variantInStock ? t("variantStock", { count: variant.stock }) : t("variantOutOfStock")}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Highlights */}
      {product.highlights.length > 0 && (
        <div className="grid grid-cols-2 gap-3 mb-6">
          {product.highlights.slice(0, 4).map((h) => (
            <div
              key={h.label}
              className="flex items-start gap-2 p-3 rounded-lg bg-surface-subtle border border-line"
            >
              <Icon name={h.icon} className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div className="min-w-0">
                <p className="text-xs text-ink-muted">{h.label}</p>
                <p className="text-sm font-medium font-mono text-ink truncate">{h.value}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Stepper số lượng */}
      <div className="flex items-center gap-3 mb-5">
        <span className="text-sm text-ink-muted">{t("quantity")}</span>
        <div className="flex items-center border border-line rounded-lg overflow-hidden">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="w-9 h-9 flex items-center justify-center text-ink hover:bg-surface-subtle disabled:opacity-40"
            disabled={!inStock || quantity <= 1}
            aria-label="Giảm số lượng"
          >
            −
          </button>
          <span className="w-10 text-center font-mono text-sm">{quantity}</span>
          <button
            type="button"
            onClick={() => setQuantity((q) => q + 1)}
            className="w-9 h-9 flex items-center justify-center text-ink hover:bg-surface-subtle disabled:opacity-40"
            disabled={!inStock}
            aria-label="Tăng số lượng"
          >
            +
          </button>
        </div>
      </div>

      {/* CTA */}
      <div className="flex flex-col sm:flex-row gap-3 mb-3">
        <a
          href={messengerReady && inStock ? `https://m.me/${MESSENGER_USERNAME}?text=${encodeURIComponent(orderMessage)}` : "#"}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => handleCtaClick(e, messengerReady)}
          aria-disabled={!messengerReady || !inStock}
          title={!messengerReady ? t("contactMissing") : undefined}
          className={`flex-1 text-center px-6 py-3 rounded-lg font-medium transition-opacity ${
            messengerReady && inStock
              ? "bg-accent text-white hover:opacity-90"
              : "bg-surface-subtle border border-line text-ink-faint cursor-not-allowed"
          }`}
        >
          {t("orderMessenger")}
        </a>
        <a
          href={zaloReady && inStock ? `https://zalo.me/${ZALO_PHONE}` : "#"}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => handleCtaClick(e, zaloReady)}
          aria-disabled={!zaloReady || !inStock}
          title={!zaloReady ? t("contactMissing") : undefined}
          className={`flex-1 text-center px-6 py-3 rounded-lg font-medium border-2 transition-colors ${
            zaloReady && inStock
              ? "border-primary text-primary hover:bg-primary-tint"
              : "border-line text-ink-faint cursor-not-allowed"
          }`}
        >
          {t("chatZalo")}
        </a>
      </div>
      <p className="text-xs text-ink-faint mb-8">{t("manualConfirmNote")}</p>

      {/* Trust badges */}
      <div className="grid grid-cols-3 gap-3 pt-6 border-t border-line">
        {TRUST_BADGES.map((b) => (
          <div key={b.icon} className="flex flex-col items-center text-center gap-1.5">
            <Icon name={b.icon} className="w-6 h-6 text-primary" />
            <p className="text-xs font-medium text-ink">{t(b.titleKey)}</p>
            <p className="text-[11px] text-ink-faint leading-tight">{t(b.descKey)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
