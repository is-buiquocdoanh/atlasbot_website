import { Link } from "@/i18n/navigation";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export default function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6 text-sm">
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={`${item.label}-${i}`} className="flex items-center gap-1.5">
              {i > 0 && <span className="text-ink-faint">/</span>}
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="text-ink-muted hover:text-primary transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <span className={isLast ? "text-ink font-medium" : "text-ink-muted"}>
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
