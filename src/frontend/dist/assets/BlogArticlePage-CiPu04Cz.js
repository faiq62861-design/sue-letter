import { c as createLucideIcon, ai as useParams, r as reactExports, j as jsxRuntimeExports, ah as BLOG_CATEGORY_CONFIG, L as Link, _ as motion, f as Button, A as AnimatedSection, a9 as LegalDisclaimer } from "./index-DkssxSHZ.js";
import { S as Skeleton } from "./skeleton-BcPTUyai.js";
import { h as useGetArticle, g as useListArticles } from "./use-backend-DszHSVCa.js";
import { C as ChevronRight } from "./chevron-right-C0wYU3vG.js";
import { U as User, C as Calendar } from "./user-D2QMFpmG.js";
import { C as Clock } from "./clock-CnLaFo4X.js";
import { F as FileText } from "./file-text--MTT5rq2.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "m12 19-7-7 7-7", key: "1l729n" }],
  ["path", { d: "M19 12H5", key: "x3x0zl" }]
];
const ArrowLeft = createLucideIcon("arrow-left", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M12 7v14", key: "1akyts" }],
  [
    "path",
    {
      d: "M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z",
      key: "ruj8y"
    }
  ]
];
const BookOpen = createLucideIcon("book-open", __iconNode);
function formatDate(publishedAt) {
  const ms = Number(publishedAt) / 1e6;
  return new Date(ms).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
}
function readTime(wordCount) {
  return Math.max(1, Math.ceil(wordCount / 200));
}
const CATEGORY_LANDING_SLUG = {
  Debt: "/debt-demand-letter-generator",
  Landlord: "/landlord-demand-letter-generator",
  Employment: "/generate",
  Refund: "/generate",
  PropertyDamage: "/generate",
  CeaseDesist: "/generate",
  Insurance: "/generate",
  Contractor: "/generate"
};
function RelatedCard({ article }) {
  const cfg = BLOG_CATEGORY_CONFIG[article.category];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Link,
    {
      to: "/blog/$slug",
      params: { slug: article.slug },
      className: "group block bg-card border border-border rounded-lg p-4 hover:border-accent/40 transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
      "data-ocid": `blog.related.${article.slug}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: `inline-flex self-start items-center px-2 py-0.5 rounded-full text-xs font-medium border ${cfg.bgClass} ${cfg.textClass} ${cfg.borderClass} mb-2`,
            children: cfg.label
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-sm font-semibold text-foreground line-clamp-2 group-hover:text-accent transition-colors leading-snug mb-2", children: article.title }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 text-xs text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-3 h-3" }),
          readTime(article.wordCount),
          " min read"
        ] })
      ]
    }
  );
}
function ArticleSkeleton() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-5xl mx-auto px-4 py-10", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-48 mb-8" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 space-y-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-6 w-20 rounded-full" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 w-3/4" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-1/2" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-px w-full" }),
        SKELETON_PARA_KEYS.map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-full" }, k))
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden lg:block w-64 space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-5 w-32" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-24 rounded-lg" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-24 rounded-lg" })
      ] })
    ] })
  ] });
}
const SKELETON_PARA_KEYS = ["pa", "pb", "pc", "pd", "pe", "pf"];
function ArticleNotFound() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      "data-ocid": "blog.article.error_state",
      className: "flex-1 flex flex-col items-center justify-center py-24 px-4 text-center space-y-4",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "w-12 h-12 text-muted-foreground" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold text-foreground", children: "Article not found" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground max-w-sm", children: "This article may have been moved or deleted. Browse all articles below." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/blog", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            "data-ocid": "blog.article.back_button",
            variant: "outline",
            className: "gap-2 mt-2",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "w-4 h-4" }),
              "Back to Blog"
            ]
          }
        ) })
      ]
    }
  );
}
function BlogArticlePage() {
  const { slug } = useParams({ strict: false });
  const { data: article, isLoading, isError } = useGetArticle(slug ?? "");
  const contentRef = reactExports.useRef(null);
  const { data: relatedRaw = [] } = useListArticles(
    article ? article.category : void 0
  );
  const related = relatedRaw.filter((a) => a.slug !== slug).slice(0, 3);
  reactExports.useEffect(() => {
    if (contentRef.current && article) {
      contentRef.current.innerHTML = article.content;
    }
  }, [article]);
  reactExports.useEffect(() => {
    if (!article) return;
    document.title = `${article.title} | Sue Letter Blog`;
    const meta = document.querySelector(
      'meta[name="description"]'
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
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { "data-ocid": "blog.article.loading_state", className: "flex-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArticleSkeleton, {}) });
  }
  if (isError || !isLoading && !article) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(ArticleNotFound, {});
  }
  if (!article) return null;
  const cfg = BLOG_CATEGORY_CONFIG[article.category];
  const landingSlug = CATEGORY_LANDING_SLUG[article.category];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col min-h-screen", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "nav",
      {
        "aria-label": "Breadcrumb",
        className: "bg-card border-b border-border px-4 py-3",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("ol", { className: "max-w-5xl mx-auto flex items-center gap-1.5 text-sm text-muted-foreground flex-wrap", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Link,
            {
              to: "/",
              className: "hover:text-foreground transition-colors",
              "data-ocid": "blog.article.home_link",
              children: "Home"
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "w-3.5 h-3.5" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Link,
            {
              to: "/blog",
              className: "hover:text-foreground transition-colors",
              "data-ocid": "blog.article.blog_link",
              children: "Blog"
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "w-3.5 h-3.5" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { className: "text-foreground font-medium truncate max-w-[180px]", children: article.title })
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 bg-background py-10 px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-5xl mx-auto flex flex-col lg:flex-row gap-10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.article,
        {
          "data-ocid": "blog.article.panel",
          className: "flex-1 min-w-0",
          initial: { opacity: 0, y: 16 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "mb-8", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border mb-4 ${cfg.bgClass} ${cfg.textClass} ${cfg.borderClass}`,
                  children: cfg.label
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl md:text-4xl font-bold text-foreground font-display leading-tight mb-4", children: article.title }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-4 text-sm text-muted-foreground", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "w-4 h-4" }),
                  article.author
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "w-4 h-4" }),
                  formatDate(article.publishedAt)
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-4 h-4" }),
                  readTime(article.wordCount),
                  " min read"
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("hr", { className: "border-border mb-8" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                ref: contentRef,
                "data-ocid": "blog.article.content",
                className: "prose-article"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("hr", { className: "border-border my-8" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/generate", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  "data-ocid": "blog.article.generate_button",
                  className: "bg-accent text-accent-foreground hover:bg-accent/90 gap-2",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "w-4 h-4" }),
                    "Generate Your Demand Letter"
                  ]
                }
              ) }),
              landingSlug !== "/generate" && /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: landingSlug, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  "data-ocid": "blog.article.landing_link",
                  variant: "outline",
                  className: "gap-2",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "w-4 h-4" }),
                    cfg.label,
                    " Guide"
                  ]
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/generate", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  "data-ocid": "blog.article.attorney_link",
                  variant: "outline",
                  className: "gap-2",
                  children: "Get Help with Your Case"
                }
              ) })
            ] })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: "hidden lg:block w-72 shrink-0 space-y-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatedSection, { direction: "right", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-xl p-5 space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-foreground text-sm", children: "Ready to take action?" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground leading-relaxed", children: "Generate a lawyer-quality demand letter in under 3 minutes. Free to start." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/generate", className: "block", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              "data-ocid": "blog.article.sidebar_cta",
              size: "sm",
              className: "w-full bg-accent text-accent-foreground hover:bg-accent/90",
              children: "Generate Free Letter"
            }
          ) })
        ] }) }),
        related.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatedSection, { direction: "right", delay: 0.1, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-foreground text-sm mb-3", children: "Related Articles" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: related.map((rel) => /* @__PURE__ */ jsxRuntimeExports.jsx(RelatedCard, { article: rel }, rel.id)) })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/blog", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            "data-ocid": "blog.article.back_sidebar",
            variant: "ghost",
            size: "sm",
            className: "gap-2 text-muted-foreground hover:text-foreground w-full",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "w-4 h-4" }),
              "All Articles"
            ]
          }
        ) })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card border-t border-border px-4 py-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-5xl mx-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LegalDisclaimer, {}) }) })
  ] });
}
export {
  BlogArticlePage as default
};
