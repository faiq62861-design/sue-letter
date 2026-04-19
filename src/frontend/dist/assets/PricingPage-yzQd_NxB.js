import { r as reactExports, j as jsxRuntimeExports, _ as motion, S as Shield, a7 as PLAN_CONFIG, a8 as Building2, Z as Zap, B as Badge, x as Check, $ as AnimatedButton, f as Button, L as Link, a9 as LegalDisclaimer, a0 as AnimatePresence, A as AnimatedSection, aa as CreditCard, h as Lock, k as StaggeredList, d as useAuthStore, X } from "./index-DkssxSHZ.js";
import { u as ue } from "./index-CZGXO6l7.js";
import { c as useBackend } from "./use-backend-DszHSVCa.js";
import { F as FileText } from "./file-text--MTT5rq2.js";
import { C as ChevronUp } from "./chevron-up-DTq8CSEB.js";
import { C as ChevronDown } from "./chevron-down-DNUpHeTU.js";
import { U as Users } from "./users-C8l7cqF2.js";
function TiltCard3D({
  children,
  className,
  maxTilt = 12,
  glare = true
}) {
  const [transform, setTransform] = reactExports.useState({ rotateX: 0, rotateY: 0 });
  const [glarePos, setGlarePos] = reactExports.useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = reactExports.useState(false);
  const cardRef = reactExports.useRef(null);
  const prefersReducedMotion = typeof window !== "undefined" ? window.matchMedia("(prefers-reduced-motion: reduce)").matches : false;
  const handleMouseMove = reactExports.useCallback(
    (e) => {
      if (prefersReducedMotion || !cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      setTransform({
        rotateX: (0.5 - y) * maxTilt * 2,
        rotateY: (x - 0.5) * maxTilt * 2
      });
      setGlarePos({ x: x * 100, y: y * 100 });
    },
    [maxTilt, prefersReducedMotion]
  );
  const handleMouseEnter = reactExports.useCallback(() => {
    setIsHovered(true);
  }, []);
  const handleMouseLeave = reactExports.useCallback(() => {
    setIsHovered(false);
    setTransform({ rotateX: 0, rotateY: 0 });
  }, []);
  const cardTransform = prefersReducedMotion ? "none" : `perspective(1000px) rotateX(${transform.rotateX}deg) rotateY(${transform.rotateY}deg)`;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      ref: cardRef,
      className: `relative overflow-hidden ${className ?? ""}`,
      style: {
        perspective: "1000px",
        transform: cardTransform,
        transformStyle: "preserve-3d",
        transition: isHovered ? "transform 0.1s ease-out" : "transform 0.4s ease-out",
        willChange: "transform"
      },
      onMouseMove: handleMouseMove,
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave,
      children: [
        children,
        glare && !prefersReducedMotion && isHovered && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            "aria-hidden": "true",
            className: "pointer-events-none absolute inset-0 rounded-[inherit]",
            style: {
              background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(255,255,255,0.18) 0%, transparent 60%)`,
              zIndex: 10
            }
          }
        )
      ]
    }
  );
}
const ALL_FEATURES = [
  {
    label: "Letters per month",
    free: "2 letters",
    pro: "Unlimited",
    business: "Unlimited"
  },
  { label: "All 8 letter types", free: true, pro: true, business: true },
  { label: "Plain text copy", free: true, pro: true, business: true },
  {
    label: "PDF download",
    free: "Watermarked",
    pro: "Clean (no watermark)",
    business: "White-label"
  },
  { label: "DOCX Word download", free: false, pro: true, business: true },
  {
    label: "Tone options",
    free: "Basic",
    pro: "Full (3 tones)",
    business: "Full (3 tones)"
  },
  { label: "Strength analyser", free: false, pro: true, business: true },
  { label: "Next-steps advisor", free: false, pro: true, business: true },
  {
    label: "Follow-up letter generator",
    free: false,
    pro: true,
    business: true
  },
  {
    label: "Letter history & dashboard",
    free: false,
    pro: true,
    business: true
  },
  {
    label: "Deadline tracker reminders",
    free: false,
    pro: true,
    business: true
  },
  {
    label: "Certified mail cover sheet",
    free: false,
    pro: true,
    business: true
  },
  { label: "Team seats", free: false, pro: false, business: "5 seats" },
  {
    label: "White-label PDF branding",
    free: false,
    pro: false,
    business: true
  },
  { label: "API access", free: false, pro: false, business: true },
  { label: "Bulk letter generation", free: false, pro: false, business: true },
  { label: "Priority support", free: false, pro: false, business: true }
];
const FAQS = [
  {
    q: "Can I cancel Pro anytime?",
    a: "Yes — cancel anytime, no questions asked. You keep Pro access until the end of your billing period. No cancellation fees, no contracts."
  },
  {
    q: "Do my 2 free letters roll over each month?",
    a: "No. The 2 free letters reset on the 1st of each month. Unused letters don't carry forward, so make the most of each month."
  },
  {
    q: "Is the $2.99 pay-per-letter a subscription?",
    a: "No — it's a one-time payment per letter. You pay $2.99, get a single clean PDF and DOCX download, and that's it. No recurring charges."
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept all major credit and debit cards (Visa, Mastercard, American Express) via Stripe. Apple Pay and Google Pay are also supported where available."
  },
  {
    q: "Is there a student or nonprofit discount?",
    a: "We don't have a discount programme yet — but we're building one. Reach out through our support channels and we'll see what we can do."
  }
];
function FeatureCell({ value }) {
  if (value === true)
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "w-4 h-4 text-accent mx-auto", "aria-label": "Included" });
  if (value === false)
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      X,
      {
        className: "w-4 h-4 text-muted-foreground/40 mx-auto",
        "aria-label": "Not included"
      }
    );
  return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-foreground font-medium", children: value });
}
function usePlanAction() {
  const { actor } = useBackend();
  const { isAuthenticated } = useAuthStore();
  const [loadingPlan, setLoadingPlan] = reactExports.useState(null);
  async function handleUpgrade(planId) {
    if (planId === "Free") return;
    if (!isAuthenticated) {
      ue.error("Please sign in first to upgrade your plan.");
      return;
    }
    setLoadingPlan(planId);
    try {
      if (!actor) throw new Error("Backend not available");
      const result = await actor.createCheckoutSession(planId);
      if (result && typeof result === "object" && "ok" in result) {
        window.location.href = result.ok;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch {
      ue.error("Failed to start checkout. Please try again.");
    } finally {
      setLoadingPlan(null);
    }
  }
  return { handleUpgrade, loadingPlan };
}
function BillingToggle({
  annual,
  onToggle
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex items-center justify-center gap-3 mt-6",
      "data-ocid": "pricing.billing_toggle",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: `text-sm font-medium ${!annual ? "text-foreground" : "text-muted-foreground"}`,
            children: "Monthly"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            role: "switch",
            "aria-checked": annual,
            onClick: onToggle,
            className: `relative w-12 h-6 rounded-full transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${annual ? "bg-accent" : "bg-muted"}`,
            "data-ocid": "pricing.annual_switch",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: `absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-smooth ${annual ? "translate-x-6" : "translate-x-0"}`
              }
            )
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "span",
          {
            className: `text-sm font-medium ${annual ? "text-foreground" : "text-muted-foreground"}`,
            children: [
              "Annual",
              /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "ml-2 bg-accent/15 text-accent border-accent/30 text-xs px-1.5 py-0", children: "Save 20%" })
            ]
          }
        )
      ]
    }
  );
}
function PricingPage() {
  const [annual, setAnnual] = reactExports.useState(false);
  const [tableOpen, setTableOpen] = reactExports.useState(false);
  const [openFaq, setOpenFaq] = reactExports.useState(null);
  const { handleUpgrade, loadingPlan } = usePlanAction();
  const planIcons = {
    Free: FileText,
    Pro: Zap,
    Business: Building2
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col min-h-screen", "data-ocid": "pricing.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "bg-card border-b border-border py-16 px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-3xl mx-auto text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: 16 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.45 },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium mb-5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "w-3.5 h-3.5", "aria-hidden": "true" }),
              "No hidden fees · Cancel anytime · Secure payments"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-4xl md:text-5xl font-bold font-display text-foreground mb-4 tracking-tight", children: "Simple, Transparent Pricing" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg text-muted-foreground max-w-md mx-auto", children: "Start free. Upgrade when you need more." })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        BillingToggle,
        {
          annual,
          onToggle: () => setAnnual((v) => !v)
        }
      ),
      annual && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-xs text-muted-foreground", children: "Annual pricing shown. Billed as one payment yearly." })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "section",
      {
        className: "bg-background py-14 px-4",
        "data-ocid": "pricing.cards_section",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-5xl mx-auto", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6", children: PLAN_CONFIG.map((plan, i) => {
            var _a;
            const Icon = planIcons[plan.id];
            const isLoading = loadingPlan === plan.id;
            const annualPrice = plan.price !== null && plan.price > 0 ? (plan.price * 0.8).toFixed(2) : null;
            const displayPrice = annual && annualPrice ? annualPrice : ((_a = plan.price) == null ? void 0 : _a.toFixed(2)) ?? "0";
            return /* @__PURE__ */ jsxRuntimeExports.jsx(
              TiltCard3D,
              {
                maxTilt: 8,
                glare: true,
                className: "rounded-2xl",
                children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  motion.div,
                  {
                    initial: { opacity: 0, y: 20 },
                    animate: { opacity: 1, y: 0 },
                    transition: { duration: 0.4, delay: i * 0.1 },
                    className: `relative rounded-2xl flex flex-col gap-5 p-7 h-full ${plan.highlight ? "border-2 border-accent bg-card shadow-lg ring-1 ring-accent/20" : "border border-border bg-card shadow-sm"}`,
                    "data-ocid": `pricing.${plan.id.toLowerCase()}_card`,
                    children: [
                      plan.highlight && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -top-3.5 left-0 right-0 flex justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-accent text-accent-foreground text-xs px-3 py-0.5 shadow-sm", children: "Most Popular" }) }),
                      plan.id === "Business" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -top-3.5 left-0 right-0 flex justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-primary text-primary-foreground text-xs px-3 py-0.5 shadow-sm", children: "For Teams" }) }),
                      plan.id === "Free" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -top-3.5 left-0 right-0 flex justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Badge,
                        {
                          variant: "outline",
                          className: "bg-card text-muted-foreground text-xs px-3 py-0.5",
                          children: "Current Plan"
                        }
                      ) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mt-2", children: [
                        Icon && /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "div",
                          {
                            className: `w-10 h-10 rounded-xl flex items-center justify-center ${plan.highlight ? "bg-accent/15" : "bg-muted"}`,
                            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                              Icon,
                              {
                                className: `w-5 h-5 ${plan.highlight ? "text-accent" : "text-muted-foreground"}`,
                                "aria-hidden": "true"
                              }
                            )
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground", children: plan.name }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: plan.id === "Free" ? "Get started, no card needed" : plan.id === "Pro" ? "For individuals" : "For teams & firms" })
                        ] })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-border pt-4", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-end gap-1", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-3xl font-bold font-display text-foreground", children: [
                            "$",
                            displayPrice
                          ] }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-muted-foreground mb-1", children: "/month" })
                        ] }),
                        annual && annualPrice && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-accent font-medium mt-0.5", children: [
                          "Save $",
                          ((plan.price - Number(annualPrice)) * 12).toFixed(
                            0
                          ),
                          "/yr"
                        ] })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-2.5 flex-1", children: plan.features.map((f) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "li",
                        {
                          className: "flex items-start gap-2.5 text-sm",
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              Check,
                              {
                                className: "w-4 h-4 mt-0.5 shrink-0 text-accent",
                                "aria-hidden": "true"
                              }
                            ),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: f })
                          ]
                        },
                        f
                      )) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                        plan.id === "Free" ? /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatedButton, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                          Button,
                          {
                            asChild: true,
                            variant: "outline",
                            className: "w-full font-medium",
                            "data-ocid": "pricing.free_cta_button",
                            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/generate", children: "Get Started Free" })
                          }
                        ) }) : /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatedButton, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                          Button,
                          {
                            className: `w-full font-medium ${plan.highlight ? "bg-accent hover:bg-accent/90 text-accent-foreground" : "bg-primary hover:bg-primary/90 text-primary-foreground"}`,
                            onClick: () => handleUpgrade(plan.id),
                            disabled: isLoading,
                            "data-ocid": `pricing.${plan.id.toLowerCase()}_cta_button`,
                            children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" }),
                              "Processing…"
                            ] }) : plan.id === "Pro" ? "Upgrade to Pro" : "Start Business Plan"
                          }
                        ) }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-center text-xs text-muted-foreground", children: plan.id === "Free" ? "No credit card required" : "Cancel anytime · Secure via Stripe" })
                      ] })
                    ]
                  }
                )
              },
              plan.id
            );
          }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0 },
              animate: { opacity: 1 },
              transition: { delay: 0.4 },
              className: "mt-8 p-4 rounded-xl bg-muted/40 border border-border",
              "data-ocid": "pricing.legal_disclaimer",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(LegalDisclaimer, {}),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "legal-disclaimer mt-2 pl-5", children: "Pricing does not include legal advice. Sue Letter is not a law firm and does not provide legal representation." })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-8 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatedButton, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "ghost",
              onClick: () => setTableOpen((v) => !v),
              className: "text-sm font-medium text-muted-foreground hover:text-foreground gap-2",
              "data-ocid": "pricing.compare_toggle_button",
              "aria-expanded": tableOpen,
              children: tableOpen ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                "Hide feature comparison ",
                /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { className: "w-4 h-4" })
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                "Compare all features ",
                /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "w-4 h-4" })
              ] })
            }
          ) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: tableOpen && /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.div,
            {
              initial: { opacity: 0, height: 0 },
              animate: { opacity: 1, height: "auto" },
              exit: { opacity: 0, height: 0 },
              transition: { duration: 0.3 },
              className: "overflow-hidden",
              "data-ocid": "pricing.comparison_table",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 rounded-2xl border border-border overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "bg-muted/60", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-5 py-3.5 text-foreground font-semibold w-1/2", children: "Feature" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-center px-4 py-3.5 text-muted-foreground font-medium", children: "Free" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-center px-4 py-3.5 text-accent font-semibold", children: "Pro" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-center px-4 py-3.5 text-muted-foreground font-medium", children: "Business" })
                ] }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: ALL_FEATURES.map((row, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  motion.tr,
                  {
                    initial: { opacity: 0, x: -8 },
                    animate: { opacity: 1, x: 0 },
                    transition: {
                      duration: 0.3,
                      delay: 0.05 + idx * 0.03
                    },
                    className: `border-t border-border/50 ${idx % 2 === 0 ? "bg-card" : "bg-muted/20"}`,
                    "data-ocid": `pricing.compare_row.${idx + 1}`,
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3 text-muted-foreground", children: row.label }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(FeatureCell, { value: row.free }) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(FeatureCell, { value: row.pro }) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(FeatureCell, { value: row.business }) })
                    ]
                  },
                  row.label
                )) })
              ] }) })
            }
          ) })
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "section",
      {
        className: "bg-muted/30 border-y border-border py-14 px-4",
        "data-ocid": "pricing.pay_per_letter_section",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-3xl mx-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatedSection, { direction: "up", delay: 0.1, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl bg-card border border-border shadow-sm p-8 flex flex-col md:flex-row items-center md:items-start gap-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-shrink-0 w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            CreditCard,
            {
              className: "w-7 h-7 text-primary",
              "aria-hidden": "true"
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 text-center md:text-left", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col md:flex-row md:items-center gap-2 mb-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-bold font-display text-foreground", children: "Just need one letter?" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Badge,
                {
                  variant: "outline",
                  className: "self-center md:self-auto text-primary border-primary/30 bg-primary/5",
                  children: "One-time · No subscription"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mb-4", children: "Pay $2.99 and generate a single lawyer-quality demand letter — clean PDF and DOCX included. No account required." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-1.5 mb-6", children: [
              "Clean PDF download (no watermark)",
              "DOCX Word document",
              "All 8 letter types available",
              "No subscription, no recurring charges"
            ].map((f) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "li",
              {
                className: "flex items-center gap-2 text-sm text-muted-foreground",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Check,
                    {
                      className: "w-4 h-4 text-accent shrink-0",
                      "aria-hidden": "true"
                    }
                  ),
                  f
                ]
              },
              f
            )) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatedButton, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  className: "bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6",
                  onClick: () => handleUpgrade("PayPerLetter"),
                  disabled: loadingPlan === "PayPerLetter",
                  "data-ocid": "pricing.pay_per_letter_button",
                  children: loadingPlan === "PayPerLetter" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" }),
                    "Processing…"
                  ] }) : "Pay $2.99 and Generate"
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "w-3 h-3", "aria-hidden": "true" }),
                "No account needed · Secure via Stripe"
              ] })
            ] })
          ] })
        ] }) }) })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "bg-background py-10 px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-3xl mx-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsx(StaggeredList, { staggerDelay: 0.03, initialDelay: 0.1, children: [
      {
        icon: Shield,
        label: "256-bit SSL",
        sub: "Encrypted checkout"
      },
      {
        icon: Lock,
        label: "Stripe Secure",
        sub: "PCI-compliant payments"
      },
      {
        icon: Users,
        label: "10,000+ users",
        sub: "Trust Sue Letter"
      },
      {
        icon: FileText,
        label: "Attorney-reviewed",
        sub: "Letter structure"
      }
    ].map(({ icon: Icon, label, sub }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-col items-center gap-1.5 p-4 rounded-xl bg-muted/30 border border-border/50",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "w-5 h-5 text-accent", "aria-hidden": "true" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-foreground", children: label }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: sub })
        ]
      },
      label
    )) }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "section",
      {
        className: "bg-muted/20 border-t border-border py-14 px-4",
        "data-ocid": "pricing.faq_section",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-2xl mx-auto", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatedSection, { direction: "up", delay: 0, children: /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-bold font-display text-foreground text-center mb-8", children: "Frequently Asked Questions" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: FAQS.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "rounded-xl border border-border bg-card overflow-hidden",
                "data-ocid": `pricing.faq.${idx + 1}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "button",
                    {
                      type: "button",
                      onClick: () => setOpenFaq(isOpen ? null : idx),
                      className: "w-full flex items-center justify-between px-5 py-4 text-left text-sm font-medium text-foreground hover:bg-muted/30 transition-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset",
                      "aria-expanded": isOpen,
                      "data-ocid": `pricing.faq_toggle.${idx + 1}`,
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: faq.q }),
                        isOpen ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { className: "w-4 h-4 shrink-0 text-muted-foreground" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "w-4 h-4 shrink-0 text-muted-foreground" })
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { initial: false, children: isOpen && /* @__PURE__ */ jsxRuntimeExports.jsx(
                    motion.div,
                    {
                      initial: { height: 0, opacity: 0 },
                      animate: { height: "auto", opacity: 1 },
                      exit: { height: 0, opacity: 0 },
                      transition: { duration: 0.22 },
                      className: "overflow-hidden",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "px-5 pb-4 text-sm text-muted-foreground border-t border-border/50 pt-3", children: faq.a })
                    }
                  ) })
                ]
              },
              faq.q
            );
          }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatedSection, { direction: "up", delay: 0.1, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-10 text-center p-8 rounded-2xl bg-card border border-border", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold font-display text-foreground mb-2", children: "Ready to get started?" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mb-5", children: "Generate your first letter free — no credit card required." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatedButton, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                asChild: true,
                className: "bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-8",
                "data-ocid": "pricing.bottom_cta_button",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/generate", children: "Generate a Letter Free" })
              }
            ) })
          ] }) })
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "bg-card border-t border-border py-6 px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-3xl mx-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LegalDisclaimer, { compact: true }) }) })
  ] });
}
export {
  PricingPage as default
};
