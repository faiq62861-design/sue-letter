import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Briefcase,
  Building2,
  FileText,
  Scale,
  Shield,
  Truck,
} from "lucide-react";
import type { LetterFormData } from "../types";
import { AnimatedCard, AnimatedSection } from "./animations";

interface NextStepsAdvisorProps {
  formData: LetterFormData;
  visible: boolean;
}

interface NextStep {
  icon: React.ReactNode;
  title: string;
  description: string;
  badge?: { label: string; className: string };
  cta?: { label: string; href: string };
}

function getNextSteps(formData: LetterFormData): NextStep[] {
  const steps: NextStep[] = [];
  const amount = Number.parseFloat(formData.amountDemanded || "0");

  // Always recommend certified mail
  steps.push({
    icon: <Truck className="w-4 h-4 text-primary" aria-hidden="true" />,
    title: "Send via certified mail",
    description:
      "USPS Certified Mail with return receipt creates a legal record of delivery. Courts require proof of service.",
    badge: {
      label: "Strongly Recommended",
      className: "bg-primary/10 text-primary",
    },
  });

  // Amount-based guidance
  if (amount > 0 && amount < 10000) {
    steps.push({
      icon: <Scale className="w-4 h-4 text-accent" aria-hidden="true" />,
      title: "Small claims court is an option",
      description: `${formData.jurisdiction !== "INT" ? `In ${formData.jurisdiction}, small claims` : "Small claims courts"} handle disputes up to $10,000 with no attorney required. Filing fees typically range $30–$100.`,
      badge: { label: "Low Cost", className: "bg-accent/10 text-accent" },
    });
  } else if (amount >= 10000) {
    steps.push({
      icon: <Briefcase className="w-4 h-4 text-accent" aria-hidden="true" />,
      title: "Consider hiring an attorney",
      description:
        "For claims above $10,000, an attorney can significantly improve your odds. Many work on contingency for strong cases.",
      badge: {
        label: "High Stakes",
        className: "bg-yellow-100 text-yellow-800",
      },
      cta: { label: "Get a free consultation →", href: "#attorney" },
    });
  }

  // Letter-type specific guidance
  if (formData.letterType === "RefundConsumer") {
    steps.push({
      icon: <Shield className="w-4 h-4 text-foreground" aria-hidden="true" />,
      title: "File a consumer protection complaint",
      description:
        "Report to your state attorney general's consumer protection office. This puts additional pressure on the business to respond.",
    });
  }

  if (formData.letterType === "EmploymentDispute") {
    steps.push({
      icon: (
        <Building2 className="w-4 h-4 text-foreground" aria-hidden="true" />
      ),
      title: "File with the labor board",
      description:
        "The Equal Employment Opportunity Commission (EEOC) or your state labor board can investigate wage and discrimination claims for free.",
    });
  }

  if (formData.letterType === "InsuranceClaim") {
    steps.push({
      icon: <FileText className="w-4 h-4 text-foreground" aria-hidden="true" />,
      title: "File with your state insurance commissioner",
      description:
        "State insurance commissioners regulate bad faith denials and can require the insurer to re-review your claim.",
    });
  }

  return steps;
}

export function NextStepsAdvisor({ formData, visible }: NextStepsAdvisorProps) {
  if (!visible) return null;

  const steps = getNextSteps(formData);

  return (
    <AnimatedSection direction="up" delay={0.05}>
      <div
        className="border border-border rounded-lg bg-card overflow-hidden"
        data-ocid="next_steps.panel"
      >
        <div className="px-4 py-3 border-b border-border bg-muted/30">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Scale className="w-4 h-4 text-primary" aria-hidden="true" />
            Next Steps Advisor
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Personalised guidance based on your dispute
          </p>
        </div>

        <div className="p-4 space-y-4">
          {steps.map((step, idx) => (
            <AnimatedCard
              key={step.title}
              delay={idx * 0.05}
              className="flex gap-3"
            >
              <div
                className="flex gap-3 w-full"
                data-ocid={`next_steps.item.${idx + 1}`}
              >
                <div className="w-7 h-7 rounded-md bg-muted flex items-center justify-center shrink-0 mt-0.5">
                  {step.icon}
                </div>
                <div className="min-w-0 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-medium text-foreground">
                      {step.title}
                    </p>
                    {step.badge && (
                      <Badge
                        className={`text-xs border-0 ${step.badge.className}`}
                      >
                        {step.badge.label}
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                  {step.cta && (
                    <a
                      href={step.cta.href}
                      className="text-xs font-medium text-accent hover:underline inline-flex items-center gap-1 mt-1"
                      data-ocid={`next_steps.cta.${idx + 1}`}
                    >
                      {step.cta.label}
                    </a>
                  )}
                </div>
              </div>
            </AnimatedCard>
          ))}

          {/* Attorney affiliate banner */}
          <div className="mt-2 rounded-lg border border-accent/30 bg-accent/5 p-4 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-foreground">
                Want a real attorney to review this?
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Get matched with a licensed attorney in your state — free
                initial consultation.
              </p>
            </div>
            <Button
              size="sm"
              className="bg-accent hover:bg-accent/90 text-accent-foreground whitespace-nowrap shrink-0"
              data-ocid="next_steps.attorney_cta"
            >
              Free Consult{" "}
              <ArrowRight className="w-3.5 h-3.5 ml-1" aria-hidden="true" />
            </Button>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}
