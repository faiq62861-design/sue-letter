import {
  AnimatedButton,
  AnimatedCard,
  AnimatedSection,
  StaggeredList,
} from "@/components/animations";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import * as Accordion from "@radix-ui/react-accordion";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  CheckCircle,
  ChevronDown,
  DollarSign,
  FileText,
  Lock,
  Scale,
  Shield,
  Users,
} from "lucide-react";
import { DisclaimerBanner } from "../components/DisclaimerBanner";
import { LegalDisclaimer } from "../components/LegalDisclaimer";

// ─── Trust Badges ─────────────────────────────────────────────────────────────

function TrustBadges() {
  return (
    <StaggeredList
      className="flex flex-wrap items-center gap-3 mt-6"
      staggerDelay={0.1}
      initialDelay={0.3}
    >
      <span className="trust-badge">
        <Lock className="w-3.5 h-3.5 text-accent" aria-hidden="true" />
        256-bit SSL
      </span>
      <span className="trust-badge">
        <Shield className="w-3.5 h-3.5 text-accent" aria-hidden="true" />
        Not Legal Advice
      </span>
      <span className="trust-badge">
        <Users className="w-3.5 h-3.5 text-accent" aria-hidden="true" />
        Trusted by 10,000+ users
      </span>
    </StaggeredList>
  );
}

// ─── SEO Content ──────────────────────────────────────────────────────────────

const SEO_CONTENT = [
  {
    heading: "What is a debt demand letter?",
    body: "A debt demand letter is a formal written notice sent to an individual or business demanding repayment of money owed. It outlines the debt amount, the basis of the obligation, a firm deadline for payment, and the consequences of non-compliance — such as small claims court, collections, or credit bureau reporting. Courts and creditors treat a properly worded demand letter as evidence of good-faith attempts to resolve the matter before escalating.",
  },
  {
    heading: "When should you send a debt demand letter?",
    body: "Send a debt demand letter when: (1) An invoice remains unpaid beyond 30–60 days despite reminders; (2) A personal loan has not been repaid after repeated verbal requests; (3) A customer or contractor owes you money and communication has broken down; (4) You are preparing for small claims court and need a paper trail. For amounts under $10,000 in most states, a strong demand letter is often enough to prompt payment without litigation.",
  },
  {
    heading: "What makes a debt letter legally effective?",
    body: "Three elements separate a strong demand letter from an ignored one. First, it must reference the correct legal basis — for consumer debts, the Fair Debt Collection Practices Act (15 U.S.C. §1692) sets conduct standards; for commercial debts, the Uniform Commercial Code (UCC) and state statutes govern enforcement. Second, it must acknowledge the applicable statute of limitations for your state — ranging from 3 years (California) to 10 years (some contract debts in Wyoming). Third, it must include a clear, specific demand: exact amount owed, method of payment accepted, and a firm deadline (typically 14–30 days).",
  },
  {
    heading: "How this tool handles debt collection letters",
    body: "Our AI demand letter generator automatically detects your state from your jurisdiction selection and inserts the correct statute citations — including the FDCPA for consumer debts, applicable state collection statutes, and the relevant SOL. Your creditor's name, debtor's information, amount owed, invoice references, and prior contact history are all filled in verbatim from your form responses. No placeholder brackets. No generic language. The output reads like a letter prepared by an experienced collections attorney.",
  },
];

const FAQS = [
  {
    q: "What is an FDCPA demand letter?",
    a: "The Fair Debt Collection Practices Act (15 U.S.C. §1692) is a federal law that governs how debts may be collected from consumers. An FDCPA demand letter references this statute to signal to the debtor that their obligations and your rights are legally recognized at the federal level. Even if you are not a professional debt collector, citing FDCPA demonstrates legal awareness and significantly increases the letter's perceived authority. Our generator automatically includes FDCPA language for consumer debts.",
  },
  {
    q: "How long do I have to collect a debt?",
    a: "Each state sets a statute of limitations (SOL) for how long you have to file a lawsuit to collect a debt. For written contracts: California — 4 years (CCP §337); New York — 6 years (CPLR §213); Texas — 4 years (Bus. & Com. Code §16.004); Florida — 5 years (Fla. Stat. §95.11). For oral contracts, most states allow 2–4 years. Sending a demand letter does not restart the clock, but it creates evidence of timely action. Always verify the current SOL for your state.",
  },
  {
    q: "What should a debt collection letter include?",
    a: "An effective debt collection letter must include: (1) Exact creditor and debtor names and addresses; (2) The debt amount and the underlying obligation (invoice number, contract date, loan agreement); (3) The legal basis for the debt and applicable statutes; (4) Evidence you have available (receipts, contracts, communications); (5) A firm payment deadline (14 days is standard for demand letters); (6) The specific consequences if payment is not received — small claims filing, collections referral, or credit bureau reporting; (7) Your preferred payment method.",
  },
  {
    q: "Can I collect a debt without an attorney?",
    a: "Yes — for debts under $10,000 in most states, you can pursue collection entirely on your own. The process is: (1) Send a formal demand letter first — this creates a paper trail and often resolves the matter; (2) If ignored, file in small claims court (no attorney required in any US state for small claims); (3) If a judgment is granted, you can enforce it via wage garnishment, bank levy, or property lien. Our generator handles step one completely, producing attorney-quality letters without the $300–$500 drafting fee.",
  },
  {
    q: "What happens if they ignore my debt demand letter?",
    a: "If the debtor ignores your letter by the stated deadline, you have several options: (1) File in small claims court — your demand letter serves as evidence of a good-faith attempt to resolve the matter; (2) Report the delinquency to credit bureaus (for business debts, you can report to Dun & Bradstreet); (3) Refer the debt to a collections agency (they typically take 25–40% of recovered amounts); (4) Hire an attorney for larger debts — our follow-up letter generator can also produce an escalated final notice before litigation.",
  },
];

const RELATED = [
  {
    type: "ContractorDispute",
    label: "Contractor Dispute",
    icon: "🔧",
    desc: "Incomplete work, overbilling, construction defects",
    to: "/generate?type=ContractorDispute",
  },
  {
    type: "RefundConsumer",
    label: "Refund & Consumer",
    icon: "🛒",
    desc: "Product refunds, consumer fraud, warranty disputes",
    to: "/generate?type=RefundConsumer",
  },
  {
    type: "EmploymentDispute",
    label: "Employment Dispute",
    icon: "💼",
    desc: "Unpaid wages, wrongful termination, discrimination",
    to: "/generate?type=EmploymentDispute",
  },
];

const SAMPLE_PARAGRAPHS = [
  "RE: FORMAL DEMAND FOR PAYMENT — OUTSTANDING DEBT OF $3,450.00\n\nDear Mr. Robert Thompson,",
  "This letter constitutes formal written notice that you owe the sum of Three Thousand Four Hundred and Fifty Dollars ($3,450.00) to Sarah M. Mitchell, arising from an unpaid invoice (Invoice #INV-2024-0187, dated September 12, 2024) for professional consulting services rendered between August 1 and September 10, 2024, pursuant to our written service agreement dated July 28, 2024.",
  "Despite repeated requests for payment — including written notices dated October 3, October 17, and November 4, 2024 — this amount remains unpaid in full. Your failure to satisfy this obligation constitutes a breach of our contract and may subject you to liability under applicable state law, the Uniform Commercial Code (UCC Article 3), and, where applicable, the Fair Debt Collection Practices Act (15 U.S.C. §1692 et seq.).",
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DebtLandingPage() {
  return (
    <div className="flex flex-col" data-ocid="debt_landing.page">
      <DisclaimerBanner />

      {/* ── Section 1: Hero ─────────────────────────────────────────────── */}
      <section className="bg-primary text-primary-foreground py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-2 mb-5">
            <Scale className="w-5 h-5 text-accent" aria-hidden="true" />
            <span className="text-sm font-medium text-primary-foreground/60 uppercase tracking-widest">
              Debt Recovery · AI Letter Generator
            </span>
          </div>
          <AnimatedSection direction="up" delay={0}>
            <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-5 font-display">
              Free Debt Demand Letter Generator{" "}
              <span className="text-accent">— Get Paid What You're Owed</span>
            </h1>
          </AnimatedSection>
          <AnimatedSection direction="up" delay={0.15}>
            <p className="text-lg text-primary-foreground/80 leading-relaxed mb-8 max-w-2xl">
              Generate a professional debt collection demand letter in minutes.
              Includes FDCPA citations, state-specific statute of limitations,
              and a firm payment deadline.
            </p>
          </AnimatedSection>
          <AnimatedButton>
            <Button
              size="lg"
              asChild
              className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold text-base px-8 shadow-elevated"
              data-ocid="debt_landing.hero_cta_button"
            >
              <Link to="/generate">
                Generate My Debt Letter Free
                <ArrowRight className="ml-2 w-5 h-5" aria-hidden="true" />
              </Link>
            </Button>
          </AnimatedButton>
          <TrustBadges />
        </div>
      </section>

      {/* ── Section 2: 400-word SEO intro ───────────────────────────────── */}
      <section className="bg-background py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-2 mb-8">
            <FileText className="w-5 h-5 text-accent" aria-hidden="true" />
            <h2 className="text-2xl font-bold text-foreground font-display">
              Everything You Need to Know About Debt Demand Letters
            </h2>
          </div>
          <div className="space-y-8">
            {SEO_CONTENT.map((item) => (
              <div key={item.heading}>
                <h3 className="text-base font-semibold text-foreground mb-2">
                  {item.heading}
                </h3>
                <p className="text-sm text-muted-foreground leading-7">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 3: Embedded tool preview ────────────────────────────── */}
      <section className="bg-muted/30 py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-foreground mb-2 font-display">
            Start Your Debt Collection Letter
          </h2>
          <p className="text-sm text-muted-foreground mb-8">
            Our generator pre-selects Debt Recovery and guides you through 5
            quick steps.
          </p>
          <AnimatedCard delay={0.1}>
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                    <DollarSign
                      className="w-5 h-5 text-primary"
                      aria-hidden="true"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      Debt Recovery Letter
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Pre-selected · FDCPA + state statutes
                    </p>
                  </div>
                </div>
                <Badge variant="secondary" className="text-xs">
                  Free
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-5">
                {[
                  "Your name & address",
                  "Debtor name & address",
                  "Amount owed + invoice",
                  "State / jurisdiction",
                  "Prior contact history",
                  "Payment deadline",
                ].map((field) => (
                  <div
                    key={field}
                    className="flex items-center gap-2 text-xs text-muted-foreground"
                  >
                    <CheckCircle
                      className="w-3.5 h-3.5 text-accent shrink-0"
                      aria-hidden="true"
                    />
                    {field}
                  </div>
                ))}
              </div>

              <AnimatedButton>
                <Button
                  asChild
                  className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold"
                  data-ocid="debt_landing.tool_preview_cta"
                >
                  <Link to="/generate">Start Your Letter →</Link>
                </Button>
              </AnimatedButton>
            </div>
          </AnimatedCard>
        </div>
      </section>

      {/* ── Section 4: Sample letter (blurred/truncated) ─────────────────── */}
      <section className="bg-background py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <AnimatedSection direction="left" delay={0}>
            <h2 className="text-2xl font-bold text-foreground mb-2 font-display">
              Sample Debt Demand Letter
            </h2>
            <p className="text-sm text-muted-foreground mb-6">
              See the quality and structure of an AI-generated debt letter.
            </p>
            <div className="relative">
              <div className="letter-preview overflow-hidden max-h-64">
                {SAMPLE_PARAGRAPHS.map((para) => (
                  <p
                    key={para.slice(0, 40)}
                    className="mb-4 whitespace-pre-line text-foreground"
                  >
                    {para}
                  </p>
                ))}
                {/* Extra blurred paragraphs */}
                <p className="mb-4 text-foreground blur-sm select-none">
                  You are hereby demanded to remit full payment in the amount of
                  $3,450.00 no later than fourteen (14) calendar days from the
                  date of this letter. Payment shall be made by cashier's check
                  or electronic transfer to the account details provided below.
                  If payment is not received by this deadline, I will have no
                  alternative but to pursue all available legal remedies
                  including filing a complaint in the appropriate Small Claims
                  Court, engaging a collections agency, and reporting this
                  delinquency to applicable credit reporting bureaus.
                </p>
                <p className="mb-4 text-foreground blur-sm select-none">
                  I trust that you will treat this matter with the seriousness
                  it deserves and resolve this obligation promptly. Should you
                  have any legitimate dispute regarding the amount owed, I
                  invite you to contact me in writing within seven (7) days so
                  that we may discuss the matter. This letter is sent without
                  prejudice to any other rights or remedies available to me
                  under applicable law.
                </p>
              </div>

              {/* Blur overlay */}
              <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-background to-transparent pointer-events-none" />
              <div className="absolute inset-0 flex items-end justify-center pb-6">
                <AnimatedButton>
                  <Button
                    asChild
                    className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-elevated"
                    data-ocid="debt_landing.sample_unlock_cta"
                  >
                    <Link to="/generate">
                      Generate your own with your details →
                    </Link>
                  </Button>
                </AnimatedButton>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ── Section 5: FAQs ──────────────────────────────────────────────── */}
      <section className="bg-muted/30 py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-foreground mb-8 font-display">
            Frequently Asked Questions
          </h2>
          <StaggeredList
            className="space-y-3"
            staggerDelay={0.1}
            initialDelay={0.05}
          >
            {FAQS.map((faq, i) => (
              <Accordion.Root
                key={faq.q}
                type="multiple"
                data-ocid="debt_landing.faq_list"
              >
                <Accordion.Item
                  value={`faq-${i}`}
                  className="bg-card border border-border rounded-lg overflow-hidden"
                  data-ocid={`debt_landing.faq.item.${i + 1}`}
                >
                  <Accordion.Trigger
                    className="w-full flex items-center justify-between px-5 py-4 text-left text-sm font-semibold text-foreground hover:text-accent transition-colors duration-200 group"
                    data-ocid={`debt_landing.faq.toggle.${i + 1}`}
                  >
                    {faq.q}
                    <ChevronDown
                      className="w-4 h-4 shrink-0 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180"
                      aria-hidden="true"
                    />
                  </Accordion.Trigger>
                  <Accordion.Content className="px-5 pb-4 text-sm text-muted-foreground leading-7 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0">
                    {faq.a}
                  </Accordion.Content>
                </Accordion.Item>
              </Accordion.Root>
            ))}
          </StaggeredList>
        </div>
      </section>

      {/* ── Section 6: Related types CTA ─────────────────────────────────── */}
      <section className="bg-background py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xl font-bold text-foreground mb-2 font-display">
            Also generate:
          </h2>
          <p className="text-sm text-muted-foreground mb-6">
            Need a different type of demand letter? We cover all major dispute
            types.
          </p>
          <div className="grid sm:grid-cols-3 gap-4">
            {RELATED.map((item) => (
              <Link
                key={item.type}
                to="/generate"
                className="group step-card flex flex-col gap-2"
                data-ocid={`debt_landing.related.${item.type.toLowerCase()}`}
              >
                <span className="text-2xl" aria-hidden="true">
                  {item.icon}
                </span>
                <p className="text-sm font-semibold text-foreground group-hover:text-accent transition-colors duration-200">
                  {item.label}
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {item.desc}
                </p>
                <span className="text-xs text-accent font-medium mt-auto flex items-center gap-1">
                  Generate free
                  <ArrowRight className="w-3 h-3" aria-hidden="true" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer disclaimer ────────────────────────────────────────────── */}
      <section className="bg-muted/20 py-10 px-4 border-t border-border">
        <div className="max-w-3xl mx-auto">
          <LegalDisclaimer />
        </div>
      </section>
    </div>
  );
}
