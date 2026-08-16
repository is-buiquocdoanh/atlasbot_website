"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { BlogPost } from "@/types/blog";
import type { Category } from "@/types/category";
import type { CategoryNode } from "@/lib/cms";

type SortOption = "newest" | "oldest" | "level";

const LEVEL_KEYS = {
  1: "levelBasic",
  2: "levelIntermediate",
  3: "levelAdvanced",
} as const;

export default function BlogExplorer({
  posts,
  categories,
  categoryTree,
}: {
  posts: BlogPost[];
  categories: Category[];
  categoryTree: CategoryNode[];
}) {
  const t = useTranslations("Blog");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const categoryNameById = useMemo(
    () => new Map(categories.map((c) => [c.id, c.name])),
    [categories]
  );

  const countByCategory = useMemo(() => {
    const counts = new Map<string, number>();
    for (const post of posts) {
      counts.set(post.categoryId, (counts.get(post.categoryId) ?? 0) + 1);
    }
    for (const parent of categoryTree) {
      if (parent.children.length === 0) continue;
      const childTotal = parent.children.reduce(
        (sum, child) => sum + (counts.get(child.id) ?? 0),
        0
      );
      counts.set(parent.id, (counts.get(parent.id) ?? 0) + childTotal);
    }
    return counts;
  }, [posts, categoryTree]);

  const categoryIdsToMatch = useMemo(() => {
    if (!selectedCategoryId) return null;
    const parent = categoryTree.find((c) => c.id === selectedCategoryId);
    if (parent) {
      return new Set([parent.id, ...parent.children.map((c) => c.id)]);
    }
    return new Set([selectedCategoryId]);
  }, [selectedCategoryId, categoryTree]);

  const filteredPosts = useMemo(() => {
    let result = posts;
    if (categoryIdsToMatch) {
      result = result.filter((post) => categoryIdsToMatch.has(post.categoryId));
    }
    if (search.trim()) {
      const query = search.trim().toLowerCase();
      result = result.filter((post) => post.title.toLowerCase().includes(query));
    }
    result = [...result].sort((a, b) => {
      if (sortBy === "level") return a.level - b.level;
      const diff =
        new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime();
      return sortBy === "oldest" ? diff : -diff;
    });
    return result;
  }, [posts, categoryIdsToMatch, search, sortBy]);

  function toggleParent(id: string) {
    setSelectedCategoryId(id);
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t("searchPlaceholder")}
          className="flex-1 bg-surface border border-border rounded-md px-4 py-2.5 text-sm"
        />
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortOption)}
          className="bg-surface border border-border rounded-md px-3 py-2.5 text-sm"
        >
          <option value="newest">{t("sortNewest")}</option>
          <option value="oldest">{t("sortOldest")}</option>
          <option value="level">{t("sortByLevel")}</option>
        </select>
      </div>

      <div className="grid md:grid-cols-[240px_1fr] gap-8">
        <aside>
          <button
            type="button"
            onClick={() => setSelectedCategoryId(null)}
            className={`w-full text-left text-xs font-semibold uppercase tracking-wide px-3 py-2 mb-3 rounded-md border-b border-border ${
              selectedCategoryId === null
                ? "bg-primary text-white border-transparent"
                : "hover:bg-surface text-muted"
            }`}
          >
            {t("allCategories")}
          </button>
          <div className="space-y-3">
            {categoryTree.map((parent) => {
              const isExpanded = expanded.has(parent.id);
              const isSelected = selectedCategoryId === parent.id;
              const count = countByCategory.get(parent.id) ?? 0;
              return (
                <div key={parent.id}>
                  <button
                    type="button"
                    onClick={() => toggleParent(parent.id)}
                    className={`w-full flex items-center justify-between text-left text-sm font-semibold px-3 py-2 rounded-md ${
                      isSelected
                        ? "bg-primary text-white"
                        : "hover:bg-surface text-foreground"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      {parent.children.length > 0 && (
                        <span className="text-[10px] w-3 inline-block">
                          {isExpanded ? "▾" : "▸"}
                        </span>
                      )}
                      {parent.name}
                    </span>
                    <span
                      className={`text-xs rounded-full px-1.5 py-0.5 ${
                        isSelected ? "bg-white/20 text-white" : "bg-surface text-muted"
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                  {isExpanded && parent.children.length > 0 && (
                    <div className="mt-1 ml-[9px] pl-3 border-l-2 border-border space-y-0.5">
                      {parent.children.map((child) => {
                        const childSelected = selectedCategoryId === child.id;
                        const childCount = countByCategory.get(child.id) ?? 0;
                        return (
                          <button
                            type="button"
                            key={child.id}
                            onClick={() => setSelectedCategoryId(child.id)}
                            className={`w-full flex items-center justify-between text-left text-xs font-normal px-2.5 py-1.5 rounded-md ${
                              childSelected
                                ? "bg-primary text-white"
                                : "hover:bg-surface text-muted"
                            }`}
                          >
                            <span>{child.name}</span>
                            <span className={childSelected ? "text-white/80" : "text-muted"}>
                              {childCount}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </aside>

        <div>
          {filteredPosts.length === 0 ? (
            <p className="text-muted">{t("noResults")}</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="block bg-surface rounded-lg overflow-hidden hover:opacity-90"
                >
                  <div className="relative aspect-video bg-background">
                    {post.coverImage && (
                      <Image
                        src={post.coverImage}
                        alt={post.title}
                        fill
                        className="object-contain"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs text-primary">
                        {categoryNameById.get(post.categoryId) ?? post.categoryId}
                      </span>
                      <span className="text-xs text-muted shrink-0">
                        {t(LEVEL_KEYS[post.level])}
                      </span>
                    </div>
                    <h2 className="font-semibold mt-1 text-foreground">{post.title}</h2>
                    <p className="text-sm text-muted mt-1 line-clamp-2">{post.excerpt}</p>
                    <p className="text-xs text-muted mt-2">
                      {t("readingTime", { minutes: post.readingTime })}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
