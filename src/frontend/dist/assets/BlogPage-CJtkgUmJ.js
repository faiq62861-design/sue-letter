import { r as reactExports, j as jsxRuntimeExports, A as AnimatedSection, B as Badge, f as Button, ah as BLOG_CATEGORY_CONFIG, L as Link, a9 as LegalDisclaimer, _ as motion } from "./index-DkssxSHZ.js";
import { I as Input } from "./input-D3UHnDUg.js";
import { S as Skeleton } from "./skeleton-BcPTUyai.js";
import { g as useListArticles } from "./use-backend-DszHSVCa.js";
import { S as Search } from "./search-Db49C16h.js";
import { R as RefreshCw } from "./refresh-cw-D0hKjTLZ.js";
import { U as User, C as Calendar } from "./user-D2QMFpmG.js";
import { C as Clock } from "./clock-CnLaFo4X.js";
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
const ALL_CATEGORIES = [
  { key: "All", label: "All" },
  { key: "Debt", label: "Debt Recovery" },
  { key: "Landlord", label: "Landlord / Tenant" },
  { key: "Employment", label: "Employment" },
  { key: "Refund", label: "Refund & Consumer" },
  { key: "PropertyDamage", label: "Property Damage" },
  { key: "CeaseDesist", label: "Cease & Desist" },
  { key: "Insurance", label: "Insurance Claim" },
  { key: "Contractor", label: "Contractor Dispute" }
];
function FilterBar({ active, onChange }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("fieldset", { className: "flex flex-wrap gap-2 border-0 m-0 p-0", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("legend", { className: "sr-only", children: "Filter articles by category" }),
    ALL_CATEGORIES.map(({ key, label }) => {
      const isActive = active === key;
      const cfg = key !== "All" ? BLOG_CATEGORY_CONFIG[key] : null;
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          "data-ocid": `blog.filter.${key.toLowerCase()}`,
          onClick: () => onChange(key),
          className: [
            "px-3 py-1.5 rounded-full text-sm font-medium border transition-smooth",
            isActive ? cfg ? `${cfg.bgClass} ${cfg.textClass} ${cfg.borderClass}` : "bg-accent/20 text-accent border-accent/40" : "bg-transparent text-muted-foreground border-border hover:border-accent/40 hover:text-foreground"
          ].join(" "),
          children: label
        },
        key
      );
    })
  ] });
}
function ArticleCard({
  article,
  index
}) {
  const cfg = BLOG_CATEGORY_CONFIG[article.category];
  const minutes = readTime(article.wordCount);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    motion.div,
    {
      "data-ocid": `blog.item.${index + 1}`,
      initial: { opacity: 0, y: 24 },
      whileInView: { opacity: 1, y: 0 },
      viewport: { once: true },
      transition: {
        duration: 0.45,
        delay: index % 6 * 0.08,
        ease: [0.25, 0.46, 0.45, 0.94]
      },
      whileHover: { y: -4, transition: { duration: 0.2 } },
      className: "group",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Link,
        {
          to: "/blog/$slug",
          params: { slug: article.slug },
          className: "block h-full bg-card border border-border rounded-xl overflow-hidden hover:border-accent/40 transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
          children: [
            article.coverImageUrl && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-44 overflow-hidden bg-muted", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "img",
              {
                src: article.coverImageUrl,
                alt: article.title,
                className: "w-full h-full object-cover group-hover:scale-105 transition-smooth"
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 flex flex-col gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: `inline-flex self-start items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${cfg.bgClass} ${cfg.textClass} ${cfg.borderClass}`,
                  children: cfg.label
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-base font-semibold text-foreground leading-snug line-clamp-2 group-hover:text-accent transition-colors", children: article.title }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground line-clamp-2 leading-relaxed flex-1", children: article.excerpt }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 text-xs text-muted-foreground pt-1 border-t border-border", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 min-w-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "w-3 h-3 shrink-0" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: article.author })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 shrink-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "w-3 h-3" }),
                  formatDate(article.publishedAt)
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 shrink-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-3 h-3" }),
                  minutes,
                  " min read"
                ] })
              ] })
            ] })
          ]
        }
      )
    }
  );
}
function SkeletonCard() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-xl overflow-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-44 w-full rounded-none" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-5 w-24 rounded-full" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-full" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-3/4" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-full" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-2/3" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 pt-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-20" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-24" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-16" })
      ] })
    ] })
  ] });
}
const SKELETON_KEYS = ["sk-a", "sk-b", "sk-c", "sk-d", "sk-e", "sk-f"];
function BlogPage() {
  const [activeCategory, setActiveCategory] = reactExports.useState(
    "All"
  );
  const [searchQuery, setSearchQuery] = reactExports.useState("");
  const {
    data: articles = [],
    isLoading,
    isError,
    refetch
  } = useListArticles(activeCategory === "All" ? void 0 : activeCategory);
  const filtered = reactExports.useMemo(() => {
    if (!searchQuery.trim()) return articles;
    const q = searchQuery.toLowerCase();
    return articles.filter(
      (a) => a.title.toLowerCase().includes(q) || a.excerpt.toLowerCase().includes(q) || a.author.toLowerCase().includes(q)
    );
  }, [articles, searchQuery]);
  const handleReset = () => {
    setActiveCategory("All");
    setSearchQuery("");
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col min-h-screen", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "bg-card border-b border-border py-16 px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-5xl mx-auto text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AnimatedSection, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Badge,
        {
          variant: "outline",
          className: "mb-4 text-accent border-accent/40 bg-accent/10",
          children: "Legal Resources"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-4xl md:text-5xl font-bold text-foreground font-display mb-4", children: "Legal Guides & Resources" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed", children: "Expert guides on demand letters, tenant rights, employment disputes, and more — written for people who need real answers, not legalese." })
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "bg-background border-b border-border py-6 px-4 sticky top-0 z-20 backdrop-blur-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-5xl mx-auto flex flex-col gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            "data-ocid": "blog.search_input",
            type: "search",
            placeholder: "Search articles…",
            value: searchQuery,
            onChange: (e) => setSearchQuery(e.target.value),
            className: "pl-10 bg-card border-border",
            "aria-label": "Search articles"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(FilterBar, { active: activeCategory, onChange: setActiveCategory })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "bg-background flex-1 py-12 px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-5xl mx-auto", children: [
      isLoading && /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          "data-ocid": "blog.loading_state",
          className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6",
          children: SKELETON_KEYS.map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(SkeletonCard, {}, k))
        }
      ),
      isError && !isLoading && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          "data-ocid": "blog.error_state",
          className: "text-center py-20 space-y-4",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Could not load articles. Please try again." }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                variant: "outline",
                onClick: () => refetch(),
                className: "gap-2",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "w-4 h-4" }),
                  "Retry"
                ]
              }
            )
          ]
        }
      ),
      !isLoading && !isError && filtered.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          "data-ocid": "blog.empty_state",
          className: "text-center py-24 space-y-4",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-5xl", children: "📰" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-semibold text-foreground", children: "No articles found" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm max-w-xs mx-auto", children: searchQuery || activeCategory !== "All" ? "Try adjusting your search or removing a filter." : "Articles will appear here once published." }),
            (searchQuery || activeCategory !== "All") && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                "data-ocid": "blog.reset_filters_button",
                variant: "outline",
                onClick: handleReset,
                className: "gap-2",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "w-4 h-4" }),
                  "Reset filters"
                ]
              }
            )
          ]
        }
      ),
      !isLoading && !isError && filtered.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground mb-6", children: [
          filtered.length,
          " article",
          filtered.length !== 1 ? "s" : "",
          activeCategory !== "All" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            " ",
            "in",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground font-medium", children: BLOG_CATEGORY_CONFIG[activeCategory].label })
          ] }),
          searchQuery && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            " ",
            "matching",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-foreground font-medium", children: [
              "“",
              searchQuery,
              "”"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            "data-ocid": "blog.list",
            className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6",
            children: filtered.map((article, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(ArticleCard, { article, index: i }, article.id))
          }
        )
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "bg-muted/40 border-t border-border py-14 px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-2xl mx-auto text-center space-y-5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AnimatedSection, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-bold text-foreground font-display", children: "Ready to send your demand letter?" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm", children: "Use our AI generator to create a lawyer-quality demand letter in under 3 minutes." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/generate", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          "data-ocid": "blog.generate_cta_button",
          size: "lg",
          className: "bg-accent text-accent-foreground hover:bg-accent/90 transition-smooth mt-2",
          children: "Generate Your Letter — Free"
        }
      ) })
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card border-t border-border px-4 py-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-5xl mx-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LegalDisclaimer, {}) }) })
  ] });
}
export {
  BlogPage as default
};
