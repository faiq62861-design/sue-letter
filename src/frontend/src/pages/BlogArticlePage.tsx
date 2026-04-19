import { LegalDisclaimer } from "@/components/LegalDisclaimer";
import { AnimatedSection } from "@/components/animations/AnimatedSection";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetArticle, useListArticles } from "@/hooks/use-backend";
import type { BlogArticle, BlogCategory } from "@/types";
import { BLOG_CATEGORY_CONFIG } from "@/types";
import { Link, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  ChevronRight,
  Clock,
  FileText,
  User,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef } from "react";

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

// Map category to letter-type landing page slug
const CATEGORY_LANDING_SLUG: Record<BlogCategory, string> = {
  Debt: "/debt-demand-letter-generator",
  Landlord: "/landlord-demand-letter-generator",
  Employment: "/generate",
  Refund: "/generate",
  PropertyDamage: "/generate",
  CeaseDesist: "/generate",
  Insurance: "/generate",
  Contractor: "/generate",
};

// ─── Related Article Card ─────────────────────────────────────────────────────

function RelatedCard({ article }: { article: BlogArticle }) {
  const cfg = BLOG_CATEGORY_CONFIG[article.category];
  return (
    <Link
      to="/blog/$slug"
      params={{ slug: article.slug }}
      className="group block bg-card border border-border rounded-lg p-4 hover:border-accent/40 transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      data-ocid={`blog.related.${article.slug}`}
    >
      <span
        className={`inline-flex self-start items-center px-2 py-0.5 rounded-full text-xs font-medium border ${cfg.bgClass} ${cfg.textClass} ${cfg.borderClass} mb-2`}
      >
        {cfg.label}
      </span>
      <h4 className="text-sm font-semibold text-foreground line-clamp-2 group-hover:text-accent transition-colors leading-snug mb-2">
        {article.title}
      </h4>
      <span className="flex items-center gap-1 text-xs text-muted-foreground">
        <Clock className="w-3 h-3" />
        {readTime(article.wordCount)} min read
      </span>
    </Link>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function ArticleSkeleton() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <Skeleton className="h-4 w-48 mb-8" />
      <div className="flex gap-10">
        <div className="flex-1 space-y-5">
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-px w-full" />
          {SKELETON_PARA_KEYS.map((k) => (
            <Skeleton key={k} className="h-4 w-full" />
          ))}
        </div>
        <div className="hidden lg:block w-64 space-y-3">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-24 rounded-lg" />
          <Skeleton className="h-24 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

const SKELETON_PARA_KEYS = ["pa", "pb", "pc", "pd", "pe", "pf"];

// ─── 404 State ────────────────────────────────────────────────────────────────

function ArticleNotFound() {
  return (
    <div
      data-ocid="blog.article.error_state"
      className="flex-1 flex flex-col items-center justify-center py-24 px-4 text-center space-y-4"
    >
      <BookOpen className="w-12 h-12 text-muted-foreground" />
      <h1 className="text-2xl font-bold text-foreground">Article not found</h1>
      <p className="text-muted-foreground max-w-sm">
        This article may have been moved or deleted. Browse all articles below.
      </p>
      <Link to="/blog">
        <Button
          data-ocid="blog.article.back_button"
          variant="outline"
          className="gap-2 mt-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Blog
        </Button>
      </Link>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function BlogArticlePage() {
  const { slug } = useParams({ strict: false }) as { slug: string };
  const { data: article, isLoading, isError } = useGetArticle(slug ?? "");
  const contentRef = useRef<HTMLDivElement>(null);

  // Related articles — same category, excluding current
  const { data: relatedRaw = [] } = useListArticles(
    article ? article.category : undefined,
  );
  const related = relatedRaw.filter((a) => a.slug !== slug).slice(0, 3);

  // Set article body HTML via ref to avoid dangerouslySetInnerHTML lint warning
  useEffect(() => {
    if (contentRef.current && article) {
      contentRef.current.innerHTML = article.content;
    }
  }, [article]);

  // Update document title and meta on mount/change
  useEffect(() => {
    if (!article) return;
    document.title = `${article.title} | Sue Letter Blog`;
    const meta = document.querySelector<HTMLMetaElement>(
      'meta[name="description"]',
    );
    if (meta) {
      meta.content = article.excerpt;
    } else {
      const newMeta = document.createElement("meta");
      newMeta.name = "description";
      newMeta.content = article.excerpt;
      document.head.appendChild(newMeta);
    }
    return () => {
      document.title = "Sue Letter";
    };
  }, [article]);

  if (isLoading) {
    return (
      <div data-ocid="blog.article.loading_state" className="flex-1">
        <ArticleSkeleton />
      </div>
    );
  }

  if (isError || (!isLoading && !article)) {
    return <ArticleNotFound />;
  }

  if (!article) return null;

  const cfg = BLOG_CATEGORY_CONFIG[article.category];
  const landingSlug = CATEGORY_LANDING_SLUG[article.category];

  return (
    <div className="flex flex-col min-h-screen">
      {/* ── Breadcrumb ──────────────────────────────────────────────── */}
      <nav
        aria-label="Breadcrumb"
        className="bg-card border-b border-border px-4 py-3"
      >
        <ol className="max-w-5xl mx-auto flex items-center gap-1.5 text-sm text-muted-foreground flex-wrap">
          <li>
            <Link
              to="/"
              className="hover:text-foreground transition-colors"
              data-ocid="blog.article.home_link"
            >
              Home
            </Link>
          </li>
          <li>
            <ChevronRight className="w-3.5 h-3.5" />
          </li>
          <li>
            <Link
              to="/blog"
              className="hover:text-foreground transition-colors"
              data-ocid="blog.article.blog_link"
            >
              Blog
            </Link>
          </li>
          <li>
            <ChevronRight className="w-3.5 h-3.5" />
          </li>
          <li className="text-foreground font-medium truncate max-w-[180px]">
            {article.title}
          </li>
        </ol>
      </nav>

      {/* ── Main ────────────────────────────────────────────────────── */}
      <div className="flex-1 bg-background py-10 px-4">
        <div className="max-w-5xl mx-auto flex flex-col lg:flex-row gap-10">
          {/* Article Content */}
          <motion.article
            data-ocid="blog.article.panel"
            className="flex-1 min-w-0"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {/* Header */}
            <header className="mb-8">
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border mb-4 ${cfg.bgClass} ${cfg.textClass} ${cfg.borderClass}`}
              >
                {cfg.label}
              </span>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground font-display leading-tight mb-4">
                {article.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <User className="w-4 h-4" />
                  {article.author}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  {formatDate(article.publishedAt)}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  {readTime(article.wordCount)} min read
                </span>
              </div>
            </header>

            <hr className="border-border mb-8" />

            {/* Body — HTML content rendered via ref (backend-stored, sanitized at write time) */}
            <div
              ref={contentRef}
              data-ocid="blog.article.content"
              className="prose-article"
            />

            <hr className="border-border my-8" />

            {/* Internal links */}
            <div className="flex flex-wrap gap-3">
              <Link to="/generate">
                <Button
                  data-ocid="blog.article.generate_button"
                  className="bg-accent text-accent-foreground hover:bg-accent/90 gap-2"
                >
                  <FileText className="w-4 h-4" />
                  Generate Your Demand Letter
                </Button>
              </Link>
              {landingSlug !== "/generate" && (
                <Link to={landingSlug as "/debt-demand-letter-generator"}>
                  <Button
                    data-ocid="blog.article.landing_link"
                    variant="outline"
                    className="gap-2"
                  >
                    <BookOpen className="w-4 h-4" />
                    {cfg.label} Guide
                  </Button>
                </Link>
              )}
              <Link to="/generate">
                <Button
                  data-ocid="blog.article.attorney_link"
                  variant="outline"
                  className="gap-2"
                >
                  Get Help with Your Case
                </Button>
              </Link>
            </div>
          </motion.article>

          {/* Sidebar */}
          <aside className="hidden lg:block w-72 shrink-0 space-y-6">
            {/* CTA box */}
            <AnimatedSection direction="right">
              <div className="bg-card border border-border rounded-xl p-5 space-y-3">
                <h3 className="font-semibold text-foreground text-sm">
                  Ready to take action?
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Generate a lawyer-quality demand letter in under 3 minutes.
                  Free to start.
                </p>
                <Link to="/generate" className="block">
                  <Button
                    data-ocid="blog.article.sidebar_cta"
                    size="sm"
                    className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                  >
                    Generate Free Letter
                  </Button>
                </Link>
              </div>
            </AnimatedSection>

            {/* Related articles */}
            {related.length > 0 && (
              <AnimatedSection direction="right" delay={0.1}>
                <div>
                  <h3 className="font-semibold text-foreground text-sm mb-3">
                    Related Articles
                  </h3>
                  <div className="space-y-3">
                    {related.map((rel) => (
                      <RelatedCard key={rel.id} article={rel} />
                    ))}
                  </div>
                </div>
              </AnimatedSection>
            )}

            {/* Back link */}
            <Link to="/blog">
              <Button
                data-ocid="blog.article.back_sidebar"
                variant="ghost"
                size="sm"
                className="gap-2 text-muted-foreground hover:text-foreground w-full"
              >
                <ArrowLeft className="w-4 h-4" />
                All Articles
              </Button>
            </Link>
          </aside>
        </div>
      </div>

      {/* ── Legal Disclaimer ─────────────────────────────────────────── */}
      <div className="bg-card border-t border-border px-4 py-6">
        <div className="max-w-5xl mx-auto">
          <LegalDisclaimer />
        </div>
      </div>
    </div>
  );
}
