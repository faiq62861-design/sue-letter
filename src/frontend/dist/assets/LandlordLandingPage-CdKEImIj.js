import { c as createLucideIcon, j as jsxRuntimeExports, A as AnimatedSection, $ as AnimatedButton, f as Button, L as Link, B as Badge, k as StaggeredList, a9 as LegalDisclaimer, h as Lock, S as Shield } from "./index-DkssxSHZ.js";
import { A as AnimatedCard } from "./index-vxsl8MaO.js";
import { a as CircleCheckBig, R as Root2, I as Item, T as Trigger2, C as Content2 } from "./index-CqrjrF-m.js";
import { D as DisclaimerBanner } from "./DisclaimerBanner-DTDsGzL3.js";
import { A as ArrowRight } from "./arrow-right-DKpjrEPm.js";
import { F as FileText } from "./file-text--MTT5rq2.js";
import { M as MapPin } from "./map-pin-DwOO83-8.js";
import { C as ChevronDown } from "./chevron-down-DNUpHeTU.js";
import { U as Users } from "./users-C8l7cqF2.js";
import "./index-BMlygM05.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8", key: "5wwlr5" }],
  [
    "path",
    {
      d: "M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",
      key: "1d0kgt"
    }
  ]
];
const House = createLucideIcon("house", __iconNode);
function TrustBadges() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    StaggeredList,
    {
      className: "flex flex-wrap items-center gap-3 mt-6",
      staggerDelay: 0.1,
      initialDelay: 0.3,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "trust-badge", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "w-3.5 h-3.5 text-accent", "aria-hidden": "true" }),
          "256-bit SSL"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "trust-badge", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "w-3.5 h-3.5 text-accent", "aria-hidden": "true" }),
          "Not Legal Advice"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "trust-badge", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "w-3.5 h-3.5 text-accent", "aria-hidden": "true" }),
          "Trusted by 10,000+ users"
        ] })
      ]
    }
  );
}
const SEO_CONTENT = [
  {
    heading: "The most common landlord-tenant disputes",
    body: "Security deposit disputes are the single most litigated landlord-tenant issue in the US — landlords wrongfully withhold deposits in more than 40% of cases according to tenant advocacy data. Other frequent disputes include: failure to make repairs (implied warranty of habitability), landlord illegal entry without proper notice (typically 24 hours required), wrongful lease termination, uninhabitable conditions such as mold, pests, or non-functioning heat/plumbing, and retaliation for reporting housing code violations. A formal demand letter is the required first step before small claims court in nearly every state."
  },
  {
    heading: "State law governs almost everything",
    body: "Unlike federal law (which is relatively thin on landlord-tenant matters outside of fair housing), state statutes govern the specifics. California Civil Code §1950.5 requires landlords to return deposits within 21 days with an itemized statement — violations can result in treble damages. Texas Property Code Chapter 92 sets a 30-day return window, with penalties of $100 + 3x the wrongfully withheld amount. New York Real Property Law §235-b codifies the warranty of habitability for all residential leases statewide, regardless of whether it's written into the lease. Our tool automatically cites the correct statutes for your state."
  },
  {
    heading: "Why a written demand is essential before court",
    body: "Most small claims courts require or strongly recommend evidence that the plaintiff made a good-faith written demand before filing. A formal letter: (1) Puts the landlord on legal notice with a clear deadline; (2) Documents your position in writing, creating an evidentiary record; (3) Demonstrates to a judge that you attempted resolution before litigation; (4) Often produces settlement — many landlords respond to a legally worded letter to avoid the time and cost of court. Verbal requests and text messages alone are rarely sufficient to establish the required demand in a disputed case."
  },
  {
    heading: "How this tool handles jurisdiction-specific statutes",
    body: "When you select your state, the AI identifies the governing landlord-tenant statutes automatically — including deposit return deadlines, permitted deductions, notice requirements for entry, and habitability standards. Every letter is written for your specific situation, not a generic national template. If you are in California, your letter will cite Cal. Civil Code §§1950.5, 1950.6, and 1942 as appropriate. If you are in Texas, it cites Tex. Prop. Code §§92.101–92.109. The AI inserts the correct deadlines, damages multipliers, and statutory penalties so your letter carries real legal weight."
  }
];
const FAQS = [
  {
    q: "How do I get my security deposit back?",
    a: "Start with a formal written demand letter citing your state's deposit return statute — this is the fastest path to recovery. Your letter should specify: the exact deposit amount, the move-out date, that no legitimate deductions apply (or dispute the ones claimed), the statutory deadline your landlord has already missed, and the consequences (statutory penalties, small claims filing) if payment is not received within 14 days. In California, failure to comply with §1950.5 allows you to claim up to 2x the withheld amount as bad-faith damages. Most states have similar penalty multipliers."
  },
  {
    q: "What is an uninhabitable conditions letter?",
    a: "An uninhabitable conditions letter (sometimes called a warranty of habitability demand) formally notifies your landlord of conditions that make the property unsafe or unlivable — and gives them a reasonable time to repair them. Under the implied warranty of habitability recognized in all 50 states, landlords must maintain rental units in habitable condition regardless of what the lease says. Common conditions covered include: non-functional heat or plumbing, significant mold growth, pest infestations, broken locks or windows, and structural hazards. After your demand letter, you may have the right to rent withholding, repair-and-deduct, or lease termination depending on your state."
  },
  {
    q: "Can I write my own demand letter to my landlord?",
    a: "Yes — and it works. Tenants do not need an attorney to write or send a demand letter. A well-structured letter that cites the correct statute, states the amount owed, provides a clear deadline, and identifies the legal consequences of non-compliance is treated seriously by landlords and their insurance companies. The key is specificity: generic 'you owe me money' letters are ignored; letters that cite 'California Civil Code §1950.5(g), which provides for damages of twice the withheld amount' prompt action. Our generator handles the legal precision so you don't need a law degree."
  },
  {
    q: "What state laws cover tenant rights?",
    a: "Every state has a landlord-tenant act. Key examples: California — Civil Code §§1940–1954.1 (habitability, deposits, entry); New York — Real Property Law §§220–238 (warranty of habitability §235-b); Texas — Property Code Chapter 92 (security deposits §92.101, repairs §92.052); Florida — Statutes §83.40–83.682 (residential tenancies); Illinois — Residential Landlord and Tenant Ordinance (Chicago); Washington — Residential Landlord-Tenant Act RCW 59.18. The federal Fair Housing Act (42 U.S.C. §3601) covers discrimination. Our AI knows all of these and inserts the applicable citations."
  },
  {
    q: "How long does a landlord have to return a deposit?",
    a: "Deposit return deadlines vary by state: California — 21 days; New York — 14 days (for units covered by NYC Admin Code), otherwise 'reasonable time'; Texas — 30 days; Florida — 15 days (no deductions) or 30 days (with itemized deductions); Illinois — 30 days; Washington — 21 days; Pennsylvania — 30 days; Colorado — 1 month (60 days if stated in lease). In most states, the clock starts on the day you vacate or the day the lease ends, whichever is later. Missing the deadline often forfeits the landlord's right to make any deductions at all and triggers statutory penalty provisions."
  }
];
const RELATED = [
  {
    type: "PropertyDamage",
    label: "Property Damage",
    icon: "🏚",
    desc: "Recover damages for destroyed or damaged property",
    to: "/generate?type=PropertyDamage"
  },
  {
    type: "EmploymentDispute",
    label: "Employment Dispute",
    icon: "💼",
    desc: "Unpaid wages, wrongful termination, discrimination",
    to: "/generate?type=EmploymentDispute"
  },
  {
    type: "CeaseDesist",
    label: "Cease & Desist",
    icon: "🚫",
    desc: "Stop harassment, illegal entry, or unlawful conduct",
    to: "/generate?type=CeaseDesist"
  }
];
const SAMPLE_PARAGRAPHS = [
  "RE: FORMAL DEMAND FOR RETURN OF SECURITY DEPOSIT — $2,800.00\n\nDear Mr. David Hartley (Property Manager, Hartley Properties LLC),",
  "This letter constitutes formal written notice that you are in violation of California Civil Code §1950.5(g) for your failure to return my security deposit of Two Thousand Eight Hundred Dollars ($2,800.00) within the statutory 21-day period following my vacating of the premises at 4421 Maple Grove Drive, Apt. 3B, Sacramento, California 95814, on October 31, 2024.",
  "I vacated the property on October 31, 2024, provided you with my new forwarding address in writing on that date, and left the property in clean and undamaged condition consistent with normal wear and tear. More than thirty (30) days have now elapsed and I have received neither the deposit nor an itemized statement of deductions as required by California Civil Code §1950.5(f). Your failure to comply with this statutory requirement may constitute bad faith withholding, which subjects you to liability for the actual deposit amount plus statutory damages up to two (2) times the amount of the security deposit, as provided by Cal. Civil Code §1950.5(l)."
];
function LandlordLandingPage() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col", "data-ocid": "landlord_landing.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DisclaimerBanner, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "bg-primary text-primary-foreground py-20 px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-3xl mx-auto", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(House, { className: "w-5 h-5 text-accent", "aria-hidden": "true" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium text-primary-foreground/60 uppercase tracking-widest", children: "Landlord–Tenant · AI Letter Generator" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatedSection, { direction: "up", delay: 0, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-4xl sm:text-5xl font-bold leading-tight mb-5 font-display", children: [
        "Free Landlord & Tenant",
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-accent", children: "Demand Letter Generator" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatedSection, { direction: "up", delay: 0.15, children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg text-primary-foreground/80 leading-relaxed mb-8 max-w-2xl", children: "Generate a demand letter for security deposits, illegal entry, habitability issues, or lease violations. Cites your state's landlord-tenant act automatically." }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatedButton, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          size: "lg",
          asChild: true,
          className: "bg-accent hover:bg-accent/90 text-accent-foreground font-semibold text-base px-8 shadow-elevated",
          "data-ocid": "landlord_landing.hero_cta_button",
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/generate", children: [
            "Generate My Letter Free",
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "ml-2 w-5 h-5", "aria-hidden": "true" })
          ] })
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TrustBadges, {})
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "bg-background py-16 px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-3xl mx-auto", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "w-5 h-5 text-accent", "aria-hidden": "true" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-bold text-foreground font-display", children: "Landlord-Tenant Demand Letters Explained" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-8", children: SEO_CONTENT.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-base font-semibold text-foreground mb-2", children: item.heading }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground leading-7", children: item.body })
      ] }, item.heading)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatedCard, { delay: 0.1, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-10 bg-card border border-border rounded-xl p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "w-4 h-4 text-accent", "aria-hidden": "true" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground", children: "Key State Statutes — Security Deposits" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid sm:grid-cols-2 gap-x-8 gap-y-2", children: [
          {
            state: "California",
            law: "Civil Code §1950.5",
            days: "21 days"
          },
          {
            state: "New York",
            law: "Real Property Law §234",
            days: "14 days"
          },
          {
            state: "Texas",
            law: "Property Code §92.103",
            days: "30 days"
          },
          {
            state: "Florida",
            law: "Statutes §83.49",
            days: "15–30 days"
          },
          {
            state: "Washington",
            law: "RCW 59.18.280",
            days: "21 days"
          },
          {
            state: "Illinois",
            law: "765 ILCS 710/1",
            days: "30 days"
          }
        ].map((row) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-center justify-between py-1.5 border-b border-border/50 last:border-0",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium text-foreground", children: row.state }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground ml-2", children: row.law })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "text-xs", children: row.days })
            ]
          },
          row.state
        )) })
      ] }) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "bg-muted/30 py-16 px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-3xl mx-auto", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-bold text-foreground mb-2 font-display", children: "Start Your Landlord-Tenant Letter" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mb-8", children: "Pre-selects Landlord-Tenant and auto-fetches your state's statutes." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatedCard, { delay: 0.1, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-xl p-6 shadow-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(House, { className: "w-5 h-5 text-primary", "aria-hidden": "true" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground", children: "Landlord–Tenant Letter" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Pre-selected · State statutes auto-cited" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "text-xs", children: "Free" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-3 mb-5", children: [
          "Tenant name & address",
          "Landlord / property manager",
          "Property address",
          "State / jurisdiction",
          "Deposit amount + dates",
          "Nature of dispute"
        ].map((field) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-center gap-2 text-xs text-muted-foreground",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                CircleCheckBig,
                {
                  className: "w-3.5 h-3.5 text-accent shrink-0",
                  "aria-hidden": "true"
                }
              ),
              field
            ]
          },
          field
        )) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatedButton, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            asChild: true,
            className: "w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold",
            "data-ocid": "landlord_landing.tool_preview_cta",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/generate", children: "Start Your Letter →" })
          }
        ) })
      ] }) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "bg-background py-16 px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-3xl mx-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AnimatedSection, { direction: "left", delay: 0, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-bold text-foreground mb-2 font-display", children: "Sample Landlord-Tenant Demand Letter" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mb-6", children: "Security deposit scenario — California. Your letter will be customized with your details." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "letter-preview overflow-hidden max-h-64", children: [
          SAMPLE_PARAGRAPHS.map((para) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              className: "mb-4 whitespace-pre-line text-foreground",
              children: para
            },
            para.slice(0, 40)
          )),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mb-4 text-foreground blur-sm select-none", children: "You are hereby demanded to remit the full deposit amount of $2,800.00 within fourteen (14) calendar days of the date of this letter. Payment should be made by cashier's check or electronic transfer made payable to Jennifer L. Santos, along with an itemized written accounting of any deductions claimed, as required by Cal. Civil Code §1950.5(f). Your failure to respond within this period will leave me no alternative but to file a complaint in Sacramento County Small Claims Court seeking the deposit, statutory penalties, court costs, and any attorney fees permitted under applicable law." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mb-4 text-foreground blur-sm select-none", children: "Please be advised that I have documented the condition of the property with timestamped photographs taken on the day of move-out, preserved all correspondence relating to this tenancy, and consulted with a tenant rights advisor regarding my legal options. I sincerely hope that we can resolve this matter without court involvement and look forward to your prompt response." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-background to-transparent pointer-events-none" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 flex items-end justify-center pb-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatedButton, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            asChild: true,
            className: "bg-primary hover:bg-primary/90 text-primary-foreground shadow-elevated",
            "data-ocid": "landlord_landing.sample_unlock_cta",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/generate", children: "Generate your own with your details →" })
          }
        ) }) })
      ] })
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "bg-muted/30 py-16 px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-3xl mx-auto", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-bold text-foreground mb-8 font-display", children: "Frequently Asked Questions" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        StaggeredList,
        {
          className: "space-y-3",
          staggerDelay: 0.1,
          initialDelay: 0.05,
          children: FAQS.map((faq, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            Root2,
            {
              type: "multiple",
              "data-ocid": "landlord_landing.faq_list",
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Item,
                {
                  value: `faq-${i}`,
                  className: "bg-card border border-border rounded-lg overflow-hidden",
                  "data-ocid": `landlord_landing.faq.item.${i + 1}`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      Trigger2,
                      {
                        className: "w-full flex items-center justify-between px-5 py-4 text-left text-sm font-semibold text-foreground hover:text-accent transition-colors duration-200 group",
                        "data-ocid": `landlord_landing.faq.toggle.${i + 1}`,
                        children: [
                          faq.q,
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            ChevronDown,
                            {
                              className: "w-4 h-4 shrink-0 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180",
                              "aria-hidden": "true"
                            }
                          )
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Content2, { className: "px-5 pb-4 text-sm text-muted-foreground leading-7 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", children: faq.a })
                  ]
                }
              )
            },
            faq.q
          ))
        }
      )
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "bg-background py-16 px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-3xl mx-auto", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-bold text-foreground mb-2 font-display", children: "Also generate:" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mb-6", children: "Need a different type of demand letter? We cover all major dispute types." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid sm:grid-cols-3 gap-4", children: RELATED.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Link,
        {
          to: "/generate",
          className: "group step-card flex flex-col gap-2",
          "data-ocid": `landlord_landing.related.${item.type.toLowerCase()}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-2xl", "aria-hidden": "true", children: item.icon }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground group-hover:text-accent transition-colors duration-200", children: item.label }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground leading-relaxed", children: item.desc }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-accent font-medium mt-auto flex items-center gap-1", children: [
              "Generate free",
              /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "w-3 h-3", "aria-hidden": "true" })
            ] })
          ]
        },
        item.type
      )) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "bg-muted/20 py-10 px-4 border-t border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-3xl mx-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LegalDisclaimer, {}) }) })
  ] });
}
export {
  LandlordLandingPage as default
};
