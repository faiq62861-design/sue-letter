import {
  AnimatedButton,
  AnimatedSection,
  StaggeredList,
  TiltCard3D,
} from "@/components/animations";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import {
  Building2,
  Check,
  ChevronDown,
  ChevronUp,
  CreditCard,
  FileText,
  Lock,
  type LucideIcon,
  Shield,
  Users,
  X,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { LegalDisclaimer } from "../components/LegalDisclaimer";
import { useBackend } from "../hooks/use-backend";
import { useAuthStore } from "../store/authStore";
import { PLAN_CONFIG } from "../types";

// ─── Feature Comparison Data ────────────────────────────────────────────────

const ALL_FEATURES = [
  {
    label: "Letters per month",
    free: "2 letters",
    pro: "Unlimited",
    business: "Unlimited",
  },
  { label: "All 8 letter types", free: true, pro: true, business: true },
  { label: "Plain text copy", free: true, pro: true, business: true },
  {
    label: "PDF download",
    free: "Watermarked",
    pro: "Clean (no watermark)",
    business: "White-label",
  },
  { label: "DOCX Word download", free: false, pro: true, business: true },
  {
    label: "Tone options",
    free: "Basic",
    pro: "Full (3 tones)",
    business: "Full (3 tones)",
  },
  { label: "Strength analyser", free: false, pro: true, business: true },
  { label: "Next-steps advisor", free: false, pro: true, business: true },
  {
    label: "Follow-up letter generator",
    free: false,
    pro: true,
    business: true,
  },
  {
    label: "Letter history & dashboard",
    free: false,
    pro: true,
    business: true,
  },
  {
    label: "Deadline tracker reminders",
    free: false,
    pro: true,
    business: true,
  },
  {
    label: "Certified mail cover sheet",
    free: false,
    pro: true,
    business: true,
  },
  { label: "Team seats", free: false, pro: false, business: "5 seats" },
  {
    label: "White-label PDF branding",
    free: false,
    pro: false,
    business: true,
  },
  { label: "API access", free: false, pro: false, business: true },
  { label: "Bulk letter generation", free: false, pro: false, business: true },
  { label: "Priority support", free: false, pro: false, business: true },
];

// ─── FAQ Data ────────────────────────────────────────────────────────────────

const FAQS = [
  {
    q: "Can I cancel Pro anytime?",
    a: "Yes — cancel anytime, no questions asked. You keep Pro access until the end of your billing period. No cancellation fees, no contracts.",
  },
  {
    q: "Do my 2 free letters roll over each month?",
    a: "No. The 2 free letters reset on the 1st of each month. Unused letters don't carry forward, so make the most of each month.",
  },
  {
    q: "Is the $2.99 pay-per-letter a subscription?",
    a: "No — it's a one-time payment per letter. You pay $2.99, get a single clean PDF and DOCX download, and that's it. No recurring charges.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept all major credit and debit cards (Visa, Mastercard, American Express) via Stripe. Apple Pay and Google Pay are also supported where available.",
  },
  {
    q: "Is there a student or nonprofit discount?",
    a: "We don't have a discount programme yet — but we're building one. Reach out through our support channels and we'll see what we can do.",
  },
];

// ─── Cell Renderer ────────────────────────────────────────────────────────────

type CellValue = boolean | string;

function FeatureCell({ value }: { value: CellValue }) {
  if (value === true)
    return (
      <Check className="w-4 h-4 text-accent mx-auto" aria-label="Included" />
    );
  if (value === false)
    return (
      <X
        className="w-4 h-4 text-muted-foreground/40 mx-auto"
        aria-label="Not included"
      />
    );
  return <span className="text-xs text-foreground font-medium">{value}</span>;
}

// ─── Plan CTA Handler ─────────────────────────────────────────────────────────

type PlanId = "Free" | "Pro" | "Business" | "PayPerLetter";

function usePlanAction() {
  const { actor } = useBackend();
  const { isAuthenticated } = useAuthStore();
  const [loadingPlan, setLoadingPlan] = useState<PlanId | null>(null);

  async function handleUpgrade(planId: PlanId) {
    if (planId === "Free") return;
    if (!isAuthenticated) {
      toast.error("Please sign in first to upgrade your plan.");
      return;
    }
    setLoadingPlan(planId);
    try {
      if (!actor) throw new Error("Backend not available");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = await (actor as any).createCheckoutSession(planId);
      if (result && typeof result === "object" && "ok" in result) {
        window.location.href = result.ok as string;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch {
      toast.error("Failed to start checkout. Please try again.");
    } finally {
      setLoadingPlan(null);
    }
  }

  return { handleUpgrade, loadingPlan };
}

// ─── Billing Toggle ───────────────────────────────────────────────────────────

function BillingToggle({
  annual,
  onToggle,
}: {
  annual: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      className="flex items-center justify-center gap-3 mt-6"
      data-ocid="pricing.billing_toggle"
    >
      <span
        className={`text-sm font-medium ${!annual ? "text-foreground" : "text-muted-foreground"}`}
      >
        Monthly
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={annual}
        onClick={onToggle}
        className={`relative w-12 h-6 rounded-full transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
          annual ? "bg-accent" : "bg-muted"
        }`}
        data-ocid="pricing.annual_switch"
      >
        <span
          className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-smooth ${
            annual ? "translate-x-6" : "translate-x-0"
          }`}
        />
      </button>
      <span
        className={`text-sm font-medium ${annual ? "text-foreground" : "text-muted-foreground"}`}
      >
        Annual
        <Badge className="ml-2 bg-accent/15 text-accent border-accent/30 text-xs px-1.5 py-0">
          Save 20%
        </Badge>
      </span>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function PricingPage() {
  const [annual, setAnnual] = useState(false);
  const [tableOpen, setTableOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const { handleUpgrade, loadingPlan } = usePlanAction();

  const planIcons: Record<string, LucideIcon | null> = {
    Free: FileText,
    Pro: Zap,
    Business: Building2,
  };

  return (
    <div className="flex flex-col min-h-screen" data-ocid="pricing.page">
      {/* ── Page Header ───────────────────────────────────────────────── */}
      <section className="bg-card border-b border-border py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium mb-5">
              <Shield className="w-3.5 h-3.5" aria-hidden="true" />
              No hidden fees · Cancel anytime · Secure payments
            </div>
            <h1 className="text-4xl md:text-5xl font-bold font-display text-foreground mb-4 tracking-tight">
              Simple, Transparent Pricing
            </h1>
            <p className="text-lg text-muted-foreground max-w-md mx-auto">
              Start free. Upgrade when you need more.
            </p>
          </motion.div>
          <BillingToggle
            annual={annual}
            onToggle={() => setAnnual((v) => !v)}
          />
          {annual && (
            <p className="mt-3 text-xs text-muted-foreground">
              Annual pricing shown. Billed as one payment yearly.
            </p>
          )}
        </div>
      </section>

      {/* ── Pricing Cards ─────────────────────────────────────────────── */}
      <section
        className="bg-background py-14 px-4"
        data-ocid="pricing.cards_section"
      >
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PLAN_CONFIG.map((plan, i) => {
              const Icon = planIcons[plan.id];
              const isLoading = loadingPlan === plan.id;
              const annualPrice =
                plan.price !== null && plan.price > 0
                  ? (plan.price * 0.8).toFixed(2)
                  : null;
              const displayPrice =
                annual && annualPrice
                  ? annualPrice
                  : (plan.price?.toFixed(2) ?? "0");

              return (
                <TiltCard3D
                  key={plan.id}
                  maxTilt={8}
                  glare
                  className="rounded-2xl"
                >
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.1 }}
                    className={`relative rounded-2xl flex flex-col gap-5 p-7 h-full ${
                      plan.highlight
                        ? "border-2 border-accent bg-card shadow-lg ring-1 ring-accent/20"
                        : "border border-border bg-card shadow-sm"
                    }`}
                    data-ocid={`pricing.${plan.id.toLowerCase()}_card`}
                  >
                    {/* Badge */}
                    {plan.highlight && (
                      <div className="absolute -top-3.5 left-0 right-0 flex justify-center">
                        <Badge className="bg-accent text-accent-foreground text-xs px-3 py-0.5 shadow-sm">
                          Most Popular
                        </Badge>
                      </div>
                    )}
                    {plan.id === "Business" && (
                      <div className="absolute -top-3.5 left-0 right-0 flex justify-center">
                        <Badge className="bg-primary text-primary-foreground text-xs px-3 py-0.5 shadow-sm">
                          For Teams
                        </Badge>
                      </div>
                    )}
                    {plan.id === "Free" && (
                      <div className="absolute -top-3.5 left-0 right-0 flex justify-center">
                        <Badge
                          variant="outline"
                          className="bg-card text-muted-foreground text-xs px-3 py-0.5"
                        >
                          Current Plan
                        </Badge>
                      </div>
                    )}

                    {/* Icon + Name */}
                    <div className="flex items-center gap-3 mt-2">
                      {Icon && (
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                            plan.highlight ? "bg-accent/15" : "bg-muted"
                          }`}
                        >
                          <Icon
                            className={`w-5 h-5 ${plan.highlight ? "text-accent" : "text-muted-foreground"}`}
                            aria-hidden="true"
                          />
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-foreground">
                          {plan.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {plan.id === "Free"
                            ? "Get started, no card needed"
                            : plan.id === "Pro"
                              ? "For individuals"
                              : "For teams & firms"}
                        </p>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="border-t border-border pt-4">
                      <div className="flex items-end gap-1">
                        <span className="text-3xl font-bold font-display text-foreground">
                          ${displayPrice}
                        </span>
                        <span className="text-sm text-muted-foreground mb-1">
                          /month
                        </span>
                      </div>
                      {annual && annualPrice && (
                        <p className="text-xs text-accent font-medium mt-0.5">
                          Save $
                          {((plan.price! - Number(annualPrice)) * 12).toFixed(
                            0,
                          )}
                          /yr
                        </p>
                      )}
                    </div>

                    {/* Features */}
                    <ul className="space-y-2.5 flex-1">
                      {plan.features.map((f) => (
                        <li
                          key={f}
                          className="flex items-start gap-2.5 text-sm"
                        >
                          <Check
                            className="w-4 h-4 mt-0.5 shrink-0 text-accent"
                            aria-hidden="true"
                          />
                          <span className="text-muted-foreground">{f}</span>
                        </li>
                      ))}
                    </ul>

                    {/* CTA */}
                    <div className="space-y-1.5">
                      {plan.id === "Free" ? (
                        <AnimatedButton>
                          <Button
                            asChild
                            variant="outline"
                            className="w-full font-medium"
                            data-ocid="pricing.free_cta_button"
                          >
                            <Link to="/generate">Get Started Free</Link>
                          </Button>
                        </AnimatedButton>
                      ) : (
                        <AnimatedButton>
                          <Button
                            className={`w-full font-medium ${
                              plan.highlight
                                ? "bg-accent hover:bg-accent/90 text-accent-foreground"
                                : "bg-primary hover:bg-primary/90 text-primary-foreground"
                            }`}
                            onClick={() => handleUpgrade(plan.id)}
                            disabled={isLoading}
                            data-ocid={`pricing.${plan.id.toLowerCase()}_cta_button`}
                          >
                            {isLoading ? (
                              <span className="flex items-center gap-2">
                                <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                Processing…
                              </span>
                            ) : plan.id === "Pro" ? (
                              "Upgrade to Pro"
                            ) : (
                              "Start Business Plan"
                            )}
                          </Button>
                        </AnimatedButton>
                      )}
                      <p className="text-center text-xs text-muted-foreground">
                        {plan.id === "Free"
                          ? "No credit card required"
                          : "Cancel anytime · Secure via Stripe"}
                      </p>
                    </div>
                  </motion.div>
                </TiltCard3D>
              );
            })}
          </div>

          {/* ── Legal Disclaimer ─────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-8 p-4 rounded-xl bg-muted/40 border border-border"
            data-ocid="pricing.legal_disclaimer"
          >
            <LegalDisclaimer />
            <p className="legal-disclaimer mt-2 pl-5">
              Pricing does not include legal advice. Sue Letter is not a law
              firm and does not provide legal representation.
            </p>
          </motion.div>

          {/* ── Feature Comparison Toggle ─────────────────────────────── */}
          <div className="mt-8 text-center">
            <AnimatedButton>
              <Button
                variant="ghost"
                onClick={() => setTableOpen((v) => !v)}
                className="text-sm font-medium text-muted-foreground hover:text-foreground gap-2"
                data-ocid="pricing.compare_toggle_button"
                aria-expanded={tableOpen}
              >
                {tableOpen ? (
                  <>
                    Hide feature comparison <ChevronUp className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    Compare all features <ChevronDown className="w-4 h-4" />
                  </>
                )}
              </Button>
            </AnimatedButton>
          </div>

          {/* ── Comparison Table ──────────────────────────────────────── */}
          <AnimatePresence>
            {tableOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
                data-ocid="pricing.comparison_table"
              >
                <div className="mt-4 rounded-2xl border border-border overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-muted/60">
                        <th className="text-left px-5 py-3.5 text-foreground font-semibold w-1/2">
                          Feature
                        </th>
                        <th className="text-center px-4 py-3.5 text-muted-foreground font-medium">
                          Free
                        </th>
                        <th className="text-center px-4 py-3.5 text-accent font-semibold">
                          Pro
                        </th>
                        <th className="text-center px-4 py-3.5 text-muted-foreground font-medium">
                          Business
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {ALL_FEATURES.map((row, idx) => (
                        <motion.tr
                          key={row.label}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{
                            duration: 0.3,
                            delay: 0.05 + idx * 0.03,
                          }}
                          className={`border-t border-border/50 ${
                            idx % 2 === 0 ? "bg-card" : "bg-muted/20"
                          }`}
                          data-ocid={`pricing.compare_row.${idx + 1}`}
                        >
                          <td className="px-5 py-3 text-muted-foreground">
                            {row.label}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <FeatureCell value={row.free as CellValue} />
                          </td>
                          <td className="px-4 py-3 text-center">
                            <FeatureCell value={row.pro as CellValue} />
                          </td>
                          <td className="px-4 py-3 text-center">
                            <FeatureCell value={row.business as CellValue} />
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* ── Pay-per-Letter Section ────────────────────────────────────── */}
      <section
        className="bg-muted/30 border-y border-border py-14 px-4"
        data-ocid="pricing.pay_per_letter_section"
      >
        <div className="max-w-3xl mx-auto">
          <AnimatedSection direction="up" delay={0.1}>
            <div className="rounded-2xl bg-card border border-border shadow-sm p-8 flex flex-col md:flex-row items-center md:items-start gap-8">
              <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                <CreditCard
                  className="w-7 h-7 text-primary"
                  aria-hidden="true"
                />
              </div>
              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
                  <h2 className="text-xl font-bold font-display text-foreground">
                    Just need one letter?
                  </h2>
                  <Badge
                    variant="outline"
                    className="self-center md:self-auto text-primary border-primary/30 bg-primary/5"
                  >
                    One-time · No subscription
                  </Badge>
                </div>
                <p className="text-muted-foreground mb-4">
                  Pay $2.99 and generate a single lawyer-quality demand letter —
                  clean PDF and DOCX included. No account required.
                </p>
                <ul className="space-y-1.5 mb-6">
                  {[
                    "Clean PDF download (no watermark)",
                    "DOCX Word document",
                    "All 8 letter types available",
                    "No subscription, no recurring charges",
                  ].map((f) => (
                    <li
                      key={f}
                      className="flex items-center gap-2 text-sm text-muted-foreground"
                    >
                      <Check
                        className="w-4 h-4 text-accent shrink-0"
                        aria-hidden="true"
                      />
                      {f}
                    </li>
                  ))}
                </ul>
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <AnimatedButton>
                    <Button
                      className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6"
                      onClick={() => handleUpgrade("PayPerLetter")}
                      disabled={loadingPlan === "PayPerLetter"}
                      data-ocid="pricing.pay_per_letter_button"
                    >
                      {loadingPlan === "PayPerLetter" ? (
                        <span className="flex items-center gap-2">
                          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                          Processing…
                        </span>
                      ) : (
                        "Pay $2.99 and Generate"
                      )}
                    </Button>
                  </AnimatedButton>
                  <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                    <Lock className="w-3 h-3" aria-hidden="true" />
                    No account needed · Secure via Stripe
                  </p>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ── Trust Signals ─────────────────────────────────────────────── */}
      <section className="bg-background py-10 px-4">
        <div className="max-w-3xl mx-auto">
          <StaggeredList staggerDelay={0.03} initialDelay={0.1}>
            {[
              {
                icon: Shield,
                label: "256-bit SSL",
                sub: "Encrypted checkout",
              },
              {
                icon: Lock,
                label: "Stripe Secure",
                sub: "PCI-compliant payments",
              },
              {
                icon: Users,
                label: "10,000+ users",
                sub: "Trust Sue Letter",
              },
              {
                icon: FileText,
                label: "Attorney-reviewed",
                sub: "Letter structure",
              },
            ].map(({ icon: Icon, label, sub }) => (
              <div
                key={label}
                className="flex flex-col items-center gap-1.5 p-4 rounded-xl bg-muted/30 border border-border/50"
              >
                <Icon className="w-5 h-5 text-accent" aria-hidden="true" />
                <p className="text-xs font-semibold text-foreground">{label}</p>
                <p className="text-xs text-muted-foreground">{sub}</p>
              </div>
            ))}
          </StaggeredList>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────────── */}
      <section
        className="bg-muted/20 border-t border-border py-14 px-4"
        data-ocid="pricing.faq_section"
      >
        <div className="max-w-2xl mx-auto">
          <AnimatedSection direction="up" delay={0}>
            <h2 className="text-2xl font-bold font-display text-foreground text-center mb-8">
              Frequently Asked Questions
            </h2>
          </AnimatedSection>
          <div className="space-y-2">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={faq.q}
                  className="rounded-xl border border-border bg-card overflow-hidden"
                  data-ocid={`pricing.faq.${idx + 1}`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between px-5 py-4 text-left text-sm font-medium text-foreground hover:bg-muted/30 transition-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
                    aria-expanded={isOpen}
                    data-ocid={`pricing.faq_toggle.${idx + 1}`}
                  >
                    <span>{faq.q}</span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 shrink-0 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="w-4 h-4 shrink-0 text-muted-foreground" />
                    )}
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.22 }}
                        className="overflow-hidden"
                      >
                        <p className="px-5 pb-4 text-sm text-muted-foreground border-t border-border/50 pt-3">
                          {faq.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          {/* Bottom CTA */}
          <AnimatedSection direction="up" delay={0.1}>
            <div className="mt-10 text-center p-8 rounded-2xl bg-card border border-border">
              <h3 className="text-lg font-semibold font-display text-foreground mb-2">
                Ready to get started?
              </h3>
              <p className="text-sm text-muted-foreground mb-5">
                Generate your first letter free — no credit card required.
              </p>
              <AnimatedButton>
                <Button
                  asChild
                  className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-8"
                  data-ocid="pricing.bottom_cta_button"
                >
                  <Link to="/generate">Generate a Letter Free</Link>
                </Button>
              </AnimatedButton>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ── Footer Disclaimer ─────────────────────────────────────────── */}
      <section className="bg-card border-t border-border py-6 px-4">
        <div className="max-w-3xl mx-auto">
          <LegalDisclaimer compact />
        </div>
      </section>
    </div>
  );
}
