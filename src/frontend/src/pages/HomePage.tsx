import {
  AnimatedCard,
  AnimatedSection,
  CountUp,
  FloatingElement,
  HeroScene3D,
  StaggeredList,
} from "@/components/animations";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  CheckCircle,
  Download,
  FileText,
  Lock,
  Scale,
  Shield,
  Sparkles,
  Star,
  Users,
  Zap,
} from "lucide-react";
import { TrustBar } from "../components/TrustBar";
import { useAuthStore } from "../store/authStore";
import { useUIStore } from "../store/uiStore";
import { LETTER_TYPE_CONFIG } from "../types";

// ─── Static Data ────────────────────────────────────────────────────────────

const STEPS = [
  {
    num: "01",
    icon: FileText,
    title: "Choose Your Letter Type & Fill Details",
    desc: "Select your dispute type — debt, landlord-tenant, refund, property damage, cease & desist, employment, insurance, or contractor. Fill in sender and recipient details, dispute facts, amounts, and evidence. Takes about 2-3 minutes.",
  },
  {
    num: "02",
    icon: Sparkles,
    title: "AI Generates Your Letter",
    desc: "Our AI inserts real state statutes, structures your legal argument, and streams a live preview as it writes — no templates, no placeholders, no filler text.",
  },
  {
    num: "03",
    icon: Download,
    title: "Download & Send",
    desc: "Download as a formatted PDF, DOCX, or plain text. Send via certified mail for maximum legal weight. Your letter looks like it came from a law firm.",
  },
] as const;

const DIFFERENTIATORS = [
  {
    icon: "✅",
    title: "Zero Placeholders — Ever",
    desc: "Every field you fill is inserted verbatim. The letter engine never outputs [YOUR NAME] or [DATE] — your real information goes in, automatically.",
  },
  {
    icon: "⚖️",
    title: "Real Statute Citations",
    desc: "Our AI knows state and federal law by jurisdiction. Your California landlord dispute cites Civil Code § 1950.5. Your Florida contractor claim cites § 713.01.",
  },
  {
    icon: "⚡",
    title: "Live Streaming Preview",
    desc: "Watch your letter generate word-by-word in real time. Edit inline, compare versions, regenerate sections. Full live preview as you complete the form.",
  },
  {
    icon: "📄",
    title: "True PDF Download",
    desc: "A formatted letterhead document, not a copy-paste block of text. Proper margins, date, addresses, signature block — ready to print and mail.",
  },
] as const;

const TESTIMONIALS = [
  {
    quote:
      "I got my $2,400 security deposit back from my landlord within 10 days of sending this letter. The California Civil Code citation was what made him take it seriously.",
    author: "Sarah K.",
    location: "California",
    disputeType: "Landlord–Tenant",
    stars: 5,
  },
  {
    quote:
      "The letter cited the exact Florida statutes for contractor disputes. My contractor paid me in full without going to court. Generated in under 4 minutes.",
    author: "Marcus T.",
    location: "Florida",
    disputeType: "Contractor Dispute",
    stars: 5,
  },
  {
    quote:
      "Generated in 4 minutes, lawyer-quality structure. The employment dispute letter cited FLSA violations specifically. Worth every penny — my employer settled.",
    author: "Jennifer L.",
    location: "Texas",
    disputeType: "Employment Dispute",
    stars: 5,
  },
] as const;

const FAQ_ITEMS = [
  {
    q: "Is this real legal advice?",
    a: "No. Sue Letter is a document generation tool, not a law firm. The letters produced are for informational purposes only and do not constitute legal advice. For complex disputes, consult a licensed attorney in your state.",
  },
  {
    q: "Will my letter include real laws for my state?",
    a: "Yes. Our AI automatically inserts relevant state and federal statutes based on your jurisdiction and dispute type. A California landlord dispute cites California Civil Code. A Texas employment matter cites Texas Labor Code.",
  },
  {
    q: "Can I use this for free?",
    a: "Yes. Free accounts get 2 letters per month with watermarked PDF download. For unlimited letters, clean PDF/DOCX, strength analyser, and more — upgrade to Pro for $9.99/month.",
  },
  {
    q: "What formats can I download?",
    a: "PDF (formatted letterhead, ready to print), DOCX (editable in Word or Google Docs), and plain text (copy-paste anywhere). Pro and Business plans get clean, watermark-free PDF and DOCX.",
  },
  {
    q: "How long does it take to generate a letter?",
    a: "Most letters generate in under 60 seconds. The streaming preview starts within seconds of submission. You can watch your letter build in real time.",
  },
  {
    q: "What if they ignore my demand letter?",
    a: "You can generate a follow-up escalation letter (Pro feature) with stronger language and an updated deadline. We also provide a Next-Steps Advisor that recommends small claims court, certified mail, or attorney escalation based on your dispute.",
  },
  {
    q: "Is my information secure?",
    a: "Yes. All data is encrypted with 256-bit SSL in transit. We do not sell or share your personal information. Your letter content is stored securely and only accessible by you.",
  },
  {
    q: "What types of demand letters can I generate?",
    a: "Seven specialist types: Debt Recovery, Refund & Consumer Complaint, Property Damage, Cease & Desist, Employment Dispute, Insurance Claim Dispute, and Contractor/Service Dispute.",
  },
] as const;

// ─── Sub-components ──────────────────────────────────────────────────────────

function LetterPreviewMockup() {
  return (
    <div className="relative w-full max-w-sm mx-auto lg:mx-0">
      {/* Glow */}
      <div
        className="absolute -inset-4 rounded-2xl opacity-20 blur-2xl"
        style={{ background: "oklch(0.58 0.15 142 / 0.4)" }}
        aria-hidden="true"
      />
      <div className="relative bg-card border border-border rounded-xl shadow-elevated overflow-hidden">
        {/* Letter header bar */}
        <div className="px-5 pt-4 pb-3 border-b border-border bg-muted/30">
          <div className="flex items-center gap-2 mb-2">
            <div
              className="w-2 h-2 rounded-full bg-destructive/60"
              aria-hidden="true"
            />
            <div
              className="w-2 h-2 rounded-full bg-warning/60"
              aria-hidden="true"
            />
            <div
              className="w-2 h-2 rounded-full bg-accent/60"
              aria-hidden="true"
            />
            <span className="ml-2 text-xs text-muted-foreground font-mono">
              demand_letter.pdf
            </span>
          </div>
        </div>
        {/* Letter body */}
        <div className="p-5 font-mono text-xs leading-relaxed space-y-3">
          <div className="space-y-0.5">
            <div
              className="h-2.5 bg-foreground/80 rounded w-36"
              aria-hidden="true"
            />
            <div
              className="h-2 bg-foreground/40 rounded w-48"
              aria-hidden="true"
            />
            <div
              className="h-2 bg-foreground/40 rounded w-32"
              aria-hidden="true"
            />
          </div>
          <div className="pt-1 space-y-0.5">
            <div
              className="h-2 bg-foreground/30 rounded w-20"
              aria-hidden="true"
            />
            <div
              className="h-2.5 bg-foreground/70 rounded w-40"
              aria-hidden="true"
            />
            <div
              className="h-2 bg-foreground/40 rounded w-52"
              aria-hidden="true"
            />
            <div
              className="h-2 bg-foreground/40 rounded w-36"
              aria-hidden="true"
            />
          </div>
          <div className="pt-1">
            <div
              className="h-2.5 bg-accent/70 rounded w-56 mb-1"
              aria-hidden="true"
            />
          </div>
          <div className="space-y-1">
            <div
              className="h-2 bg-foreground/20 rounded w-full"
              aria-hidden="true"
            />
            <div
              className="h-2 bg-foreground/20 rounded w-full"
              aria-hidden="true"
            />
            <div
              className="h-2 bg-foreground/20 rounded w-5/6"
              aria-hidden="true"
            />
            <div
              className="h-2 bg-foreground/20 rounded w-full"
              aria-hidden="true"
            />
            <div
              className="h-2 bg-foreground/20 rounded w-4/5"
              aria-hidden="true"
            />
          </div>
          {/* Statute callout */}
          <div className="bg-accent/10 border border-accent/30 rounded p-2 space-y-1">
            <div className="flex items-center gap-1.5">
              <Scale
                className="w-3 h-3 text-accent flex-shrink-0"
                aria-hidden="true"
              />
              <div
                className="h-2 bg-accent/60 rounded w-44"
                aria-hidden="true"
              />
            </div>
            <div className="h-2 bg-accent/30 rounded w-52" aria-hidden="true" />
          </div>
          <div className="space-y-1">
            <div
              className="h-2 bg-foreground/20 rounded w-full"
              aria-hidden="true"
            />
            <div
              className="h-2 bg-foreground/20 rounded w-3/4"
              aria-hidden="true"
            />
          </div>
          <div className="pt-1 space-y-0.5">
            <div
              className="h-2 bg-foreground/30 rounded w-28"
              aria-hidden="true"
            />
            <div
              className="h-2.5 bg-foreground/70 rounded w-36"
              aria-hidden="true"
            />
          </div>
        </div>
        {/* Generating indicator */}
        <div className="px-5 pb-4 flex items-center gap-2">
          <div className="flex gap-1" aria-hidden="true">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-accent animate-bounce"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
          <span className="text-xs text-accent font-medium">
            Generating your letter…
          </span>
        </div>
      </div>
    </div>
  );
}

function SampleLetterTeaser() {
  return (
    <div
      className="relative max-w-2xl mx-auto"
      id="sample"
      aria-label="Sample letter preview"
    >
      {/* Blurred letter */}
      <div className="relative overflow-hidden rounded-xl border border-border shadow-elevated bg-card">
        <div className="p-8 font-mono text-sm leading-relaxed text-foreground/60 select-none blur-[3px]">
          <p className="font-bold text-foreground/80 mb-1">JOHN A. SMITH</p>
          <p>123 Main Street, Apt 4B</p>
          <p>Los Angeles, CA 90001</p>
          <p>john.smith@email.com · (213) 555-0192</p>
          <br />
          <p>April 12, 2026</p>
          <br />
          <p className="font-bold text-foreground/80">
            VIA CERTIFIED MAIL — RETURN RECEIPT REQUESTED
          </p>
          <br />
          <p className="font-bold text-foreground/80">
            Pacific Property Management LLC
          </p>
          <p>Attn: Regional Manager</p>
          <p>456 Corporate Blvd, Suite 200</p>
          <p>Los Angeles, CA 90010</p>
          <br />
          <p className="font-bold text-foreground/80 underline">
            RE: FORMAL DEMAND FOR RETURN OF SECURITY DEPOSIT — $2,400.00
          </p>
          <br />
          <p>Dear Regional Manager,</p>
          <br />
          <p>
            I write to formally demand the immediate return of my security
            deposit in the amount of $2,400.00, which you have wrongfully
            withheld in violation of California Civil Code § 1950.5. My tenancy
            at 789 Oak Avenue, #12, Los Angeles, CA 90003 concluded on March 31,
            2026, following proper written notice…
          </p>
          <br />
          <p className="text-accent/80">
            Pursuant to California Civil Code § 1950.5(g), you were required to
            return the security deposit or provide an itemized statement of
            deductions within twenty-one (21) days of termination of tenancy. As
            of this date, you have failed to do either…
          </p>
        </div>
        {/* Overlay gradient */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center"
          style={{ background: "oklch(1.0 0 0 / 0.55)" }}
        >
          {/* Callout badges */}
          <div className="absolute top-6 left-4 bg-accent text-accent-foreground text-xs font-semibold px-2.5 py-1 rounded-full shadow-md">
            ← Your name & address
          </div>
          <div className="absolute top-1/3 right-4 bg-primary text-primary-foreground text-xs font-semibold px-2.5 py-1 rounded-full shadow-md">
            Real statute citation →
          </div>
          <div className="absolute bottom-16 left-4 bg-accent text-accent-foreground text-xs font-semibold px-2.5 py-1 rounded-full shadow-md">
            ← Exact demand amount
          </div>
          {/* CTA */}
          <div className="flex flex-col items-center gap-3 mt-8">
            <p className="text-foreground font-semibold text-base">
              Your details auto-filled. No placeholders.
            </p>
            <Button
              size="lg"
              asChild
              className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold shadow-elevated"
              data-ocid="home.sample_cta_button"
            >
              <Link to="/generate">
                Generate Your Letter{" "}
                <ArrowRight className="ml-2 w-4 h-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function HomePage() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const setSignInOpen = useUIStore((s) => s.setSignInOpen);

  function scrollToSample() {
    document.getElementById("sample")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <div className="flex flex-col" data-ocid="home.page">
      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden bg-primary text-primary-foreground"
        data-ocid="home.hero_section"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.18 0.09 256) 0%, oklch(0.25 0.08 256) 60%, oklch(0.22 0.07 230) 100%)",
        }}
      >
        {/* Decorative grid */}
        <div
          className="absolute inset-0 opacity-5 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(oklch(0.98 0 0 / 0.3) 1px, transparent 1px), linear-gradient(90deg, oklch(0.98 0 0 / 0.3) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
          aria-hidden="true"
        />

        {/* 3D background scene */}
        <div
          className="absolute inset-0 z-0 opacity-20 pointer-events-none"
          aria-hidden="true"
        >
          <HeroScene3D />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: copy */}
            <div>
              <AnimatedSection direction="up" delay={0}>
                <FloatingElement amplitude={6} duration={3.5}>
                  <Badge className="mb-5 bg-accent/20 text-accent-foreground border-accent/40 text-xs font-medium tracking-wide uppercase">
                    Attorney-Reviewed Structure · Real Statute Citations
                  </Badge>
                </FloatingElement>
              </AnimatedSection>

              <AnimatedSection direction="up" delay={0}>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] mb-5 font-display">
                  Generate a Lawyer-Quality
                  <span className="block text-accent mt-1">Demand Letter</span>
                  in 3 Minutes
                </h1>
              </AnimatedSection>

              <AnimatedSection direction="up" delay={0.15}>
                <p className="text-lg text-primary-foreground/80 max-w-lg mb-8 leading-relaxed">
                  Free. No templates. No placeholder text. Real statute
                  citations for your state — automatically inserted. Used by
                  10,000+ people to recover money without an attorney.
                </p>
              </AnimatedSection>

              {/* CTAs */}
              <AnimatedSection direction="up" delay={0.3}>
                <div className="flex flex-col sm:flex-row gap-3 mb-8">
                  {isAuthenticated ? (
                    <Button
                      size="lg"
                      asChild
                      className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold text-base px-8 shadow-elevated"
                      data-ocid="home.hero_cta_button"
                    >
                      <Link to="/generate">
                        Generate My Letter Free
                        <ArrowRight
                          className="ml-2 w-5 h-5"
                          aria-hidden="true"
                        />
                      </Link>
                    </Button>
                  ) : (
                    <Button
                      size="lg"
                      className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold text-base px-8 shadow-elevated"
                      onClick={() => setSignInOpen(true)}
                      data-ocid="home.hero_cta_button"
                    >
                      Sign In
                      <ArrowRight className="ml-2 w-5 h-5" aria-hidden="true" />
                    </Button>
                  )}
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 font-medium text-base px-8"
                    onClick={scrollToSample}
                    data-ocid="home.see_sample_button"
                  >
                    See a Sample Letter
                  </Button>
                </div>
              </AnimatedSection>

              {/* Inline trust bar */}
              <AnimatedSection direction="up" delay={0.45}>
                <div className="flex flex-wrap items-center gap-4 text-primary-foreground/70">
                  <span className="flex items-center gap-1.5 text-sm">
                    <Users className="w-4 h-4 text-accent" aria-hidden="true" />
                    Trusted by 10,000+ users
                  </span>
                  <span
                    className="text-primary-foreground/30"
                    aria-hidden="true"
                  >
                    |
                  </span>
                  <span className="flex items-center gap-1.5 text-sm">
                    <Lock className="w-4 h-4 text-accent" aria-hidden="true" />
                    256-bit SSL
                  </span>
                  <span
                    className="text-primary-foreground/30"
                    aria-hidden="true"
                  >
                    |
                  </span>
                  <span className="flex items-center gap-1.5 text-sm">
                    <Shield
                      className="w-4 h-4 text-accent"
                      aria-hidden="true"
                    />
                    Not legal advice
                  </span>
                </div>
              </AnimatedSection>
            </div>

            {/* Right: letter mockup */}
            <div className="flex justify-center lg:justify-end">
              <AnimatedSection direction="right" delay={0.2}>
                <AnimatedCard enableTilt delay={0.2}>
                  <LetterPreviewMockup />
                </AnimatedCard>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ────────────────────────────────────────────── */}
      <section
        className="bg-card border-b border-border py-8 px-4"
        data-ocid="home.stats_section"
      >
        <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6">
          {[
            {
              value: 10000,
              suffix: "+",
              label: "Letters Generated",
              icon: FileText,
            },
            { value: 7, suffix: "", label: "Letter Types", icon: Scale },
            { value: 50, suffix: "", label: "US States Covered", icon: Shield },
            {
              value: 3,
              suffix: " min",
              label: "Average Generation Time",
              icon: Zap,
            },
          ].map(({ value, suffix, label, icon: Icon }, i) => (
            <AnimatedSection key={label} direction="up" delay={i * 0.1}>
              <div className="text-center">
                <Icon
                  className="w-5 h-5 text-accent mx-auto mb-2"
                  aria-hidden="true"
                />
                <p className="text-2xl font-bold text-foreground font-display">
                  {label === "Average Generation Time" ? (
                    <span>
                      {"< "}
                      <CountUp end={value} duration={1.5} suffix={suffix} />
                    </span>
                  ) : (
                    <CountUp end={value} duration={1.8} suffix={suffix} />
                  )}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────── */}
      <section
        className="bg-background py-20 px-4"
        data-ocid="home.how_it_works_section"
      >
        <div className="max-w-5xl mx-auto">
          <AnimatedSection direction="up" delay={0}>
            <div className="text-center mb-14">
              <p className="text-accent text-sm font-semibold uppercase tracking-widest mb-2">
                Simple 3-step process
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground font-display">
                How It Works
              </h2>
            </div>
          </AnimatedSection>

          <StaggeredList
            staggerDelay={0.1}
            className="grid grid-cols-1 sm:grid-cols-3 gap-8 relative"
          >
            {STEPS.map(({ num, icon: Icon, title, desc }, i) => (
              <AnimatedCard key={num} delay={i * 0.1}>
                <div
                  className="flex flex-col items-center text-center gap-4"
                  data-ocid={`home.step.item.${num}`}
                >
                  <div className="relative z-10 w-16 h-16 rounded-full border-2 border-accent/40 bg-accent/10 flex items-center justify-center shadow-xs">
                    <Icon className="w-7 h-7 text-accent" aria-hidden="true" />
                    <span
                      className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center"
                      aria-hidden="true"
                    >
                      {num.replace("0", "")}
                    </span>
                  </div>
                  <h3 className="font-semibold text-foreground text-lg">
                    {title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {desc}
                  </p>
                </div>
              </AnimatedCard>
            ))}
          </StaggeredList>

          <AnimatedSection direction="up" delay={0.3}>
            <div className="text-center mt-10">
              <Button
                size="lg"
                asChild
                className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-8 shadow-elevated"
                data-ocid="home.how_it_works_cta_button"
              >
                <Link to="/generate">
                  Start Now — It's Free{" "}
                  <ArrowRight className="ml-2 w-4 h-4" aria-hidden="true" />
                </Link>
              </Button>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ── 8 LETTER TYPE TILES ──────────────────────────────────── */}
      <section
        className="bg-muted/30 py-20 px-4"
        data-ocid="home.letter_types_section"
      >
        <div className="max-w-5xl mx-auto">
          <AnimatedSection direction="left" delay={0}>
            <div className="text-center mb-12">
              <p className="text-accent text-sm font-semibold uppercase tracking-widest mb-2">
                7 specialist categories
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground font-display mb-3">
                Every Dispute Type Covered
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Each type is pre-loaded with the relevant statutes, legal
                standards, and professional language required for that specific
                dispute.
              </p>
            </div>
          </AnimatedSection>

          <StaggeredList
            staggerDelay={0.07}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {Object.entries(LETTER_TYPE_CONFIG).map(([key, config], i) => (
              <AnimatedCard key={key} delay={i * 0.07} enableTilt>
                <Link
                  to="/generate"
                  className="group step-card flex flex-col items-start gap-3 hover:shadow-elevated hover:border-accent transition-smooth"
                  data-ocid={`home.letter_type.item.${i + 1}`}
                >
                  <span className="text-3xl" aria-hidden="true">
                    {config.icon}
                  </span>
                  <div className="flex-1">
                    <p className="font-semibold text-foreground group-hover:text-accent transition-colors text-sm mb-1">
                      {config.label}
                    </p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {config.description}
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-accent flex items-center gap-1 group-hover:gap-2 transition-smooth">
                    Generate{" "}
                    <ArrowRight className="w-3 h-3" aria-hidden="true" />
                  </span>
                </Link>
              </AnimatedCard>
            ))}
          </StaggeredList>
        </div>
      </section>

      {/* ── WHY US / DIFFERENTIATORS ─────────────────────────────── */}
      <section
        className="bg-background py-20 px-4"
        data-ocid="home.differentiators_section"
      >
        <div className="max-w-5xl mx-auto">
          <AnimatedSection direction="left" delay={0}>
            <div className="text-center mb-12">
              <p className="text-accent text-sm font-semibold uppercase tracking-widest mb-2">
                Why Sue Letter
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground font-display mb-3">
                What Makes Us Different
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Competitors generate template-filled letters with placeholder
                brackets. We don't. Here's what you actually get.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {DIFFERENTIATORS.map((d, i) => (
              <AnimatedCard key={d.title} delay={i * 0.1} enableTilt>
                <div
                  className="bg-card border border-border rounded-xl p-6 flex gap-4 items-start shadow-xs hover:shadow-elevated hover:border-accent/50 transition-smooth"
                  data-ocid={`home.differentiator.item.${i + 1}`}
                >
                  <span className="text-3xl flex-shrink-0" aria-hidden="true">
                    {d.icon}
                  </span>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1.5">
                      {d.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {d.desc}
                    </p>
                  </div>
                </div>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </section>

      {/* ── SAMPLE LETTER TEASER ─────────────────────────────────── */}
      <section
        className="bg-muted/30 py-20 px-4"
        data-ocid="home.sample_section"
      >
        <div className="max-w-5xl mx-auto">
          <AnimatedSection direction="up" delay={0}>
            <div className="text-center mb-10">
              <p className="text-accent text-sm font-semibold uppercase tracking-widest mb-2">
                See the quality
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground font-display mb-3">
                What Your Letter Looks Like
              </h2>
              <p className="text-muted-foreground max-w-lg mx-auto">
                A real California landlord–tenant demand letter. Your name, your
                facts, real statute citations — not placeholders.
              </p>
            </div>
          </AnimatedSection>
          <AnimatedSection direction="up" delay={0.15}>
            <SampleLetterTeaser />
          </AnimatedSection>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────────────── */}
      <section
        className="bg-background py-20 px-4"
        data-ocid="home.testimonials_section"
      >
        <div className="max-w-5xl mx-auto">
          <AnimatedSection direction="up" delay={0}>
            <div className="text-center mb-12">
              <p className="text-accent text-sm font-semibold uppercase tracking-widest mb-2">
                Real users, real results
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground font-display">
                People Are Getting Paid
              </h2>
            </div>
          </AnimatedSection>

          <StaggeredList
            staggerDelay={0.12}
            className="grid grid-cols-1 sm:grid-cols-3 gap-6"
          >
            {TESTIMONIALS.map((t, i) => (
              <AnimatedCard key={t.author} delay={i * 0.12}>
                <div
                  className="bg-card rounded-xl border border-border p-6 flex flex-col gap-4 shadow-xs hover:shadow-elevated hover:border-accent/30 transition-smooth"
                  data-ocid={`home.testimonial.item.${i + 1}`}
                >
                  <div className="flex gap-0.5">
                    {Array.from({ length: t.stars }, (_, j) => (
                      <Star
                        key={`${t.author}-star-${j + 1}`}
                        className="w-4 h-4 fill-accent text-accent"
                        aria-hidden="true"
                      />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed italic flex-1">
                    "{t.quote}"
                  </p>
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {t.author}, {t.location}
                    </p>
                    <Badge
                      variant="secondary"
                      className="mt-1.5 text-xs font-normal"
                    >
                      {t.disputeType}
                    </Badge>
                  </div>
                </div>
              </AnimatedCard>
            ))}
          </StaggeredList>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────── */}
      <section className="bg-muted/30 py-20 px-4" data-ocid="home.faq_section">
        <div className="max-w-3xl mx-auto">
          <AnimatedSection direction="up" delay={0}>
            <div className="text-center mb-12">
              <p className="text-accent text-sm font-semibold uppercase tracking-widest mb-2">
                FAQ
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground font-display">
                Common Questions
              </h2>
            </div>
          </AnimatedSection>

          <StaggeredList staggerDelay={0.06} className="space-y-3">
            <Accordion type="single" collapsible className="space-y-3">
              {FAQ_ITEMS.map((item, i) => (
                <AccordionItem
                  key={item.q}
                  value={`faq-${i}`}
                  className="bg-card border border-border rounded-lg px-5 shadow-xs"
                  data-ocid={`home.faq.item.${i + 1}`}
                >
                  <AccordionTrigger className="text-sm font-semibold text-foreground hover:text-accent text-left">
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-4">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </StaggeredList>
        </div>
      </section>

      {/* ── FOOTER CTA BAND ──────────────────────────────────────── */}
      <section
        className="py-16 px-4 text-center"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.18 0.09 256) 0%, oklch(0.25 0.08 256) 100%)",
        }}
        data-ocid="home.footer_cta_section"
      >
        <AnimatedSection direction="up" delay={0}>
          <div className="max-w-2xl mx-auto">
            <FloatingElement amplitude={8} duration={4}>
              <Scale
                className="w-10 h-10 text-accent mx-auto mb-5"
                aria-hidden="true"
              />
            </FloatingElement>
            <h2 className="text-3xl sm:text-4xl font-bold text-primary-foreground mb-4 font-display">
              Ready to send your demand letter?
            </h2>
            <p className="text-primary-foreground/70 mb-8 leading-relaxed max-w-lg mx-auto">
              Join 10,000+ people who recovered money, stopped harassment, and
              resolved disputes — without expensive attorney fees.
            </p>
            <Button
              size="lg"
              asChild
              className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold text-base px-10 shadow-elevated"
              data-ocid="home.footer_cta_button"
            >
              <Link to="/generate">
                Generate for Free
                <ArrowRight className="ml-2 w-5 h-5" aria-hidden="true" />
              </Link>
            </Button>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-5">
              {[
                { label: "Free to start", icon: CheckCircle },
                { label: "No credit card needed", icon: CheckCircle },
                { label: "Instant download", icon: CheckCircle },
              ].map(({ label, icon: Icon }) => (
                <span
                  key={label}
                  className="flex items-center gap-1.5 text-sm text-primary-foreground/60"
                >
                  <Icon className="w-4 h-4 text-accent" aria-hidden="true" />
                  {label}
                </span>
              ))}
            </div>
            <div className="mt-8 border-t border-primary-foreground/10 pt-6">
              <TrustBar
                variant="footer"
                className="opacity-60 justify-center"
              />
            </div>
          </div>
        </AnimatedSection>
      </section>
    </div>
  );
}
