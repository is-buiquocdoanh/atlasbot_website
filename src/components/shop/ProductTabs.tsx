"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Product } from "@/types/product";
import { SHOP_ABOUT_CONTENT, SHOP_ABOUT_STATS } from "@/lib/shop-about";
import { getYouTubeEmbedUrl } from "@/lib/youtube";
import { Icon } from "./icons";

const TAB_KEYS = ["description", "specifications", "videos", "usage", "about"] as const;
type TabKey = (typeof TAB_KEYS)[number];

export default function ProductTabs({ product }: { product: Product }) {
  const t = useTranslations("Shop.tabs");
  const [active, setActive] = useState<TabKey>("description");

  return (
    <div className="mt-12">
      <div className="flex overflow-x-auto border-b border-line -mx-4 px-4 sm:mx-0 sm:px-0">
        {TAB_KEYS.map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setActive(key)}
            className={`shrink-0 px-4 py-3 text-sm font-medium border-b-[2.5px] -mb-px transition-colors whitespace-nowrap ${
              active === key
                ? "border-primary text-primary"
                : "border-transparent text-ink-muted hover:text-ink"
            }`}
          >
            {t(key)}
          </button>
        ))}
      </div>

      <div className="py-8">
        {active === "description" && <DescriptionTab product={product} />}
        {active === "specifications" && <SpecificationsTab product={product} />}
        {active === "videos" && <VideosTab product={product} t={t} />}
        {active === "usage" && <UsageTab product={product} t={t} />}
        {active === "about" && <AboutTab t={t} />}
      </div>
    </div>
  );
}

function DescriptionTab({ product }: { product: Product }) {
  return (
    <div>
      <div className="prose prose-sm sm:prose-base max-w-none">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{product.description}</ReactMarkdown>
      </div>
      {product.features && product.features.length > 0 && (
        <div className="grid grid-cols-2 min-[700px]:grid-cols-3 gap-4 mt-8">
          {product.features.map((f) => (
            <div key={f.title} className="p-4 rounded-lg border border-line bg-surface-subtle">
              <Icon name={f.icon} className="w-6 h-6 text-primary mb-2" />
              <h3 className="font-medium text-ink text-sm mb-1">{f.title}</h3>
              <p className="text-xs text-ink-muted leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function SpecificationsTab({ product }: { product: Product }) {
  if (product.specifications.length === 0) {
    return <p className="text-sm text-ink-faint">—</p>;
  }
  return (
    <div className="space-y-8">
      {product.specifications.map((group) => (
        <div key={group.groupName}>
          <h3 className="font-display font-semibold text-ink mb-3">{group.groupName}</h3>
          <div className="border border-line rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <tbody>
                {group.rows.map((row, i) => (
                  <tr key={row.label} className={i % 2 === 1 ? "bg-surface-subtle" : undefined}>
                    <td className="px-4 py-2.5 text-ink-muted w-1/2">{row.label}</td>
                    <td className="px-4 py-2.5 font-mono text-ink">{row.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}

function VideosTab({ product, t }: { product: Product; t: ReturnType<typeof useTranslations> }) {
  const videos = product.videos ?? [];
  if (videos.length === 0) {
    return <p className="text-sm text-ink-faint">{t("noVideos")}</p>;
  }
  const [main, ...rest] = videos;
  const mainEmbed = getYouTubeEmbedUrl(main.url);

  return (
    <div className="grid min-[900px]:grid-cols-[1fr_260px] gap-6">
      <div>
        <div className="relative aspect-video rounded-card overflow-hidden border border-line bg-surface">
          {mainEmbed ? (
            <iframe
              src={mainEmbed}
              title={main.title}
              className="absolute inset-0 w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          ) : (
            <a
              href={main.url}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute inset-0 flex items-center justify-center text-sm text-primary underline"
            >
              {main.title}
            </a>
          )}
        </div>
        <p className="text-sm font-medium text-ink mt-2">{main.title}</p>
      </div>
      {rest.length > 0 && (
        <ul className="space-y-3">
          {rest.map((v) => (
            <li key={v.url}>
              <a
                href={v.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between gap-2 text-sm text-ink hover:text-primary"
              >
                <span className="truncate">{v.title}</span>
                <span className="font-mono text-xs text-ink-faint shrink-0">{v.duration}</span>
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function UsageTab({ product, t }: { product: Product; t: ReturnType<typeof useTranslations> }) {
  const steps = product.usageSteps ?? [];
  if (steps.length === 0) {
    return <p className="text-sm text-ink-faint">{t("noUsageSteps")}</p>;
  }
  return (
    <ol className="space-y-6">
      {steps.map((step, i) => (
        <li key={step.title} className="flex gap-4">
          <span className="shrink-0 w-7 h-7 rounded-full bg-primary-tint text-primary-dark font-mono text-sm font-semibold flex items-center justify-center">
            {i + 1}
          </span>
          <div className="min-w-0">
            <h3 className="font-medium text-ink mb-1">{step.title}</h3>
            <p className="text-sm text-ink-muted leading-relaxed">{step.description}</p>
            {step.codeSnippet && (
              <pre className="mt-3 text-xs font-mono bg-surface border border-line rounded-lg p-4 overflow-x-auto whitespace-pre">
                {step.codeSnippet}
              </pre>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}

function AboutTab({ t }: { t: ReturnType<typeof useTranslations> }) {
  return (
    <div>
      <div className="prose prose-sm sm:prose-base max-w-none">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{SHOP_ABOUT_CONTENT}</ReactMarkdown>
      </div>
      <div className="grid grid-cols-2 min-[700px]:grid-cols-4 gap-4 mt-8">
        {SHOP_ABOUT_STATS.map((stat) => (
          <div key={stat.key} className="p-4 rounded-lg bg-surface-subtle border border-line text-center">
            <p className="font-display text-2xl font-bold text-primary">{stat.value}</p>
            <p className="text-xs text-ink-muted mt-1">{t(`aboutStat${capitalize(stat.key)}`)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
