import { LegalDisclaimer } from "@/components/LegalDisclaimer";
import { AnimatedSection } from "@/components/animations/AnimatedSection";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useListArticles } from "@/hooks/use-backend";
import type { BlogArticle, BlogCategory } from "@/types";
import { BLOG_CATEGORY_CONFIG } from "@/types";
import { Link } from "@tanstack/react-router";
import { Calendar, Clock, RefreshCw, Search, User } from "lucide-react";
import { motion } from "motion/react";
import { useMemo, useState } from "react";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatDate(publishedAt: bigint): string {
  const ms = Number(publishedAt) / 1_000_000;
  return new Date(ms).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function readTime(wordCount: number): number {
  return Math.max(1, Math.ceil(wordCount / 200));
}

// ─── Filter Bar ──────────────────────────────────────────────────────────────

const ALL_CATEGORIES: Array<{ key: BlogCategory | "All"; label: string }> = [
  { key: "All", label: "All" },
  { key: "Debt", label: "Debt Recovery" },
  { key: "Landlord", label: "Landlord / Tenant" },
  { key: "Employment", label: "Employment" },
  { key: "Refund", label: "Refund & Consumer" },
  { key: "PropertyDamage", label: "Property Damage" },
  { key: "CeaseDesist", label: "Cease & Desist" },
  { key: "Insurance", label: "Insurance Claim" },
  { key: "Contractor", label: "Contractor Dispute" },
];

interface FilterBarProps {
  active: BlogCategory | "All";
  onChange: (cat: BlogCategory | "All") => void;
}

function FilterBar({ active, onChange }: FilterBarProps) {
  return (
    <fieldset className="flex flex-wrap gap-2 border-0 m-0 p-0">
      <legend className="sr-only">Filter articles by category</legend>
      {ALL_CATEGORIES.map(({ key, label }) => {
        const isActive = active === key;
        const cfg = key !== "All" ? BLOG_CATEGORY_CONFIG[key] : null;
        return (
          <button
            type="button"
            key={key}
            data-ocid={`blog.filter.${key.toLowerCase()}`}
            onClick={() => onChange(key)}
            className={[
              "px-3 py-1.5 rounded-full text-sm font-medium border transition-smooth",
              isActive
                ? cfg
                  ? `${cfg.bgClass} ${cfg.textClass} ${cfg.borderClass}`
                  : "bg-accent/20 text-accent border-accent/40"
                : "bg-transparent text-muted-foreground border-border hover:border-accent/40 hover:text-foreground",
            ].join(" ")}
          >
            {label}
          </button>
        );
      })}
    </fieldset>
  );
}

// ─── Article Card ─────────────────────────────────────────────────────────────

function ArticleCard({
  article,
  index,
}: {
  article: BlogArticle;
  index: number;
}) {
  const cfg = BLOG_CATEGORY_CONFIG[article.category];
  const minutes = readTime(article.wordCount);

  return (
    <motion.div
      data-ocid={`blog.item.${index + 1}`}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.45,
        delay: (index % 6) * 0.08,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="group"
    >
      <Link
        to="/blog/$slug"
        params={{ slug: article.slug }}
        className="block h-full bg-card border border-border rounded-xl overflow-hidden hover:border-accent/40 transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      >
        {article.coverImageUrl && (
          <div className="h-44 overflow-hidden bg-muted">
            <img
              src={article.coverImageUrl}
              alt={article.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-smooth"
            />
          </div>
        )}
        <div className="p-5 flex flex-col gap-3">
          <span
            className={`inline-flex self-start items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${cfg.bgClass} ${cfg.textClass} ${cfg.borderClass}`}
          >
            {cfg.label}
          </span>
          <h3 className="text-base font-semibold text-foreground leading-snug line-clamp-2 group-hover:text-accent transition-colors">
            {article.title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed flex-1">
            {article.excerpt}
          </p>
          <div className="flex items-center gap-3 text-xs text-muted-foreground pt-1 border-t border-border">
            <span className="flex items-center gap-1 min-w-0">
              <User className="w-3 h-3 shrink-0" />
              <span className="truncate">{article.author}</span>
            </span>
            <span className="flex items-center gap-1 shrink-0">
              <Calendar className="w-3 h-3" />
              {formatDate(article.publishedAt)}
            </span>
            <span className="flex items-center gap-1 shrink-0">
              <Clock className="w-3 h-3" />
              {minutes} min read
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

// ─── Skeleton Card ───────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <Skeleton className="h-44 w-full rounded-none" />
      <div className="p-5 space-y-3">
        <Skeleton className="h-5 w-24 rounded-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-2/3" />
        <div className="flex gap-3 pt-1">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
    </div>
  );
}

const SKELETON_KEYS = ["sk-a", "sk-b", "sk-c", "sk-d", "sk-e", "sk-f"];

// ─── Page ────────────────────────────────────────────────────────────────────

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState<BlogCategory | "All">(
    "All",
  );
  const [searchQuery, setSearchQuery] = useState("");

  const {
    data: articles = [],
    isLoading,
    isError,
    refetch,
  } = useListArticles(activeCategory === "All" ? undefined : activeCategory);

  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return articles;
    const q = searchQuery.toLowerCase();
    return articles.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.excerpt.toLowerCase().includes(q) ||
        a.author.toLowerCase().includes(q),
    );
  }, [articles, searchQuery]);

  const handleReset = () => {
    setActiveCategory("All");
    setSearchQuery("");
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="bg-card border-b border-border py-16 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <AnimatedSection>
            <Badge
              variant="outline"
              className="mb-4 text-accent border-accent/40 bg-accent/10"
            >
              Legal Resources
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground font-display mb-4">
              Legal Guides & Resources
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Expert guides on demand letters, tenant rights, employment
              disputes, and more — written for people who need real answers, not
              legalese.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* ── Filters + Search ─────────────────────────────────────────── */}
      <section className="bg-background border-b border-border py-6 px-4 sticky top-0 z-20 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto flex flex-col gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              data-ocid="blog.search_input"
              type="search"
              placeholder="Search articles…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-card border-border"
              aria-label="Search articles"
            />
          </div>
          <FilterBar active={activeCategory} onChange={setActiveCategory} />
        </div>
      </section>

      {/* ── Article Grid ─────────────────────────────────────────────── */}
      <section className="bg-background flex-1 py-12 px-4">
        <div className="max-w-5xl mx-auto">
          {isLoading && (
            <div
              data-ocid="blog.loading_state"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {SKELETON_KEYS.map((k) => (
                <SkeletonCard key={k} />
              ))}
            </div>
          )}

          {isError && !isLoading && (
            <div
              data-ocid="blog.error_state"
              className="text-center py-20 space-y-4"
            >
              <p className="text-muted-foreground">
                Could not load articles. Please try again.
              </p>
              <Button
                variant="outline"
                onClick={() => refetch()}
                className="gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Retry
              </Button>
            </div>
          )}

          {!isLoading && !isError && filtered.length === 0 && (
            <div
              data-ocid="blog.empty_state"
              className="text-center py-24 space-y-4"
            >
              <div className="text-5xl">📰</div>
              <h2 className="text-xl font-semibold text-foreground">
                No articles found
              </h2>
              <p className="text-muted-foreground text-sm max-w-xs mx-auto">
                {searchQuery || activeCategory !== "All"
                  ? "Try adjusting your search or removing a filter."
                  : "Articles will appear here once published."}
              </p>
              {(searchQuery || activeCategory !== "All") && (
                <Button
                  data-ocid="blog.reset_filters_button"
                  variant="outline"
                  onClick={handleReset}
                  className="gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Reset filters
                </Button>
              )}
            </div>
          )}

          {!isLoading && !isError && filtered.length > 0 && (
            <>
              <p className="text-sm text-muted-foreground mb-6">
                {filtered.length} article{filtered.length !== 1 ? "s" : ""}
                {activeCategory !== "All" && (
                  <>
                    {" "}
                    in{" "}
                    <span className="text-foreground font-medium">
                      {BLOG_CATEGORY_CONFIG[activeCategory].label}
                    </span>
                  </>
                )}
                {searchQuery && (
                  <>
                    {" "}
                    matching{" "}
                    <span className="text-foreground font-medium">
                      &ldquo;{searchQuery}&rdquo;
                    </span>
                  </>
                )}
              </p>
              <div
                data-ocid="blog.list"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {filtered.map((article, i) => (
                  <ArticleCard key={article.id} article={article} index={i} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────── */}
      <section className="bg-muted/40 border-t border-border py-14 px-4">
        <div className="max-w-2xl mx-auto text-center space-y-5">
          <AnimatedSection>
            <h2 className="text-2xl font-bold text-foreground font-display">
              Ready to send your demand letter?
            </h2>
            <p className="text-muted-foreground text-sm">
              Use our AI generator to create a lawyer-quality demand letter in
              under 3 minutes.
            </p>
            <Link to="/generate">
              <Button
                data-ocid="blog.generate_cta_button"
                size="lg"
                className="bg-accent text-accent-foreground hover:bg-accent/90 transition-smooth mt-2"
              >
                Generate Your Letter — Free
              </Button>
            </Link>
          </AnimatedSection>
        </div>
      </section>

      {/* ── Legal Disclaimer ─────────────────────────────────────────── */}
      <div className="bg-card border-t border-border px-4 py-6">
        <div className="max-w-5xl mx-auto">
          <LegalDisclaimer />
        </div>
      </div>
    </div>
  );
}
