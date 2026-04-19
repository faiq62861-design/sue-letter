import type { CreatePartnershipRequestInput } from "@/backend.d.ts";
import { LegalDisclaimer } from "@/components/LegalDisclaimer";
import { AnimatedCard, AnimatedSection } from "@/components/animations";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useBackend } from "@/hooks/use-backend";
import {
  BarChart3,
  Building2,
  CalendarCheck,
  CheckCircle2,
  DollarSign,
  Globe,
  Handshake,
  Loader2,
  Newspaper,
  Percent,
  Sparkles,
} from "lucide-react";
import { useState } from "react";

// ─── Static data ──────────────────────────────────────────────────────────────

const BENEFIT_BADGES = [
  { icon: Percent, label: "30% Commission" },
  { icon: Sparkles, label: "Co-Marketing" },
  { icon: Globe, label: "White-Label Access" },
];

const PARTNER_TYPES = [
  {
    icon: DollarSign,
    title: "Affiliate Partners",
    description:
      "Earn recurring commission for every paying customer you refer. Perfect for content creators, bloggers, and consultants.",
    bullets: [
      "30% recurring commission on all referred subscriptions",
      "Real-time dashboard with clicks, conversions & earnings",
      "Dedicated affiliate links and custom promo codes",
    ],
    accent: "bg-accent/10 text-accent border-accent/20",
    delay: 0,
  },
  {
    icon: Building2,
    title: "Agency Partners",
    description:
      "White-label Sue Letter under your own brand. Serve your clients with volume pricing and priority support.",
    bullets: [
      "Full white-label setup with your branding and domain",
      "Volume pricing with tiered discounts up to 50%",
      "Dedicated account manager and priority support SLA",
    ],
    accent: "bg-primary/10 text-primary border-primary/20",
    delay: 0.1,
  },
  {
    icon: Newspaper,
    title: "Media & Content",
    description:
      "Editorial partnerships, sponsored guides, and featured placements for legal publishers and content platforms.",
    bullets: [
      "Co-branded legal guides and resource pages",
      "Sponsored content and newsletter placements",
      "Early access to data reports and research assets",
    ],
    accent: "bg-warning/10 text-warning border-warning/20",
    delay: 0.2,
  },
];

const WHY_PARTNER = [
  { icon: BarChart3, text: "10,000+ active users and growing" },
  { icon: CheckCircle2, text: "Industry-leading demand letter AI" },
  { icon: Handshake, text: "Transparent, reliable partner payouts" },
];

const TIME_SLOTS = [
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
  "5:00 PM",
];

// ─── Form types ───────────────────────────────────────────────────────────────

interface FormFields {
  name: string;
  email: string;
  company: string;
  message: string;
  preferredDate: string;
  preferredTime: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  company?: string;
  message?: string;
  preferredDate?: string;
  preferredTime?: string;
}

const EMPTY_FORM: FormFields = {
  name: "",
  email: "",
  company: "",
  message: "",
  preferredDate: "",
  preferredTime: "",
};

// Get tomorrow's date as min for the date picker
function getTomorrowDate(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split("T")[0];
}

// ─── Form validation ──────────────────────────────────────────────────────────

function validateForm(fields: FormFields): FormErrors {
  const errors: FormErrors = {};

  if (!fields.name.trim()) {
    errors.name = "Full name is required.";
  } else if (fields.name.trim().length > 100) {
    errors.name = "Name must be 100 characters or fewer.";
  }

  if (!fields.email.trim()) {
    errors.email = "Email address is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email.trim())) {
    errors.email = "Please enter a valid email address.";
  } else if (fields.email.trim().length > 200) {
    errors.email = "Email must be 200 characters or fewer.";
  }

  if (!fields.company.trim()) {
    errors.company = "Company or organization is required.";
  } else if (fields.company.trim().length > 200) {
    errors.company = "Company name must be 200 characters or fewer.";
  }

  if (!fields.message.trim()) {
    errors.message = "Please describe how we can collaborate.";
  } else if (fields.message.trim().length > 2000) {
    errors.message = "Message must be 2,000 characters or fewer.";
  }

  if (!fields.preferredDate) {
    errors.preferredDate = "Please select a preferred date.";
  }

  if (!fields.preferredTime) {
    errors.preferredTime = "Please select a preferred time.";
  }

  return errors;
}

// ─── Schedule Form component ──────────────────────────────────────────────────

function ScheduleForm() {
  const { actor } = useBackend();
  const [fields, setFields] = useState<FormFields>(EMPTY_FORM);
  const [touched, setTouched] = useState<
    Partial<Record<keyof FormFields, boolean>>
  >({});
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleBlur = (field: keyof FormFields) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const newErrors = validateForm({ ...fields });
    setErrors(newErrors);
  };

  const handleChange = (field: keyof FormFields, value: string) => {
    setFields((prev) => ({ ...prev, [field]: value }));
    if (touched[field]) {
      const newErrors = validateForm({ ...fields, [field]: value });
      setErrors(newErrors);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Mark all fields as touched to show all errors
    const allTouched: Partial<Record<keyof FormFields, boolean>> = {
      name: true,
      email: true,
      company: true,
      message: true,
      preferredDate: true,
      preferredTime: true,
    };
    setTouched(allTouched);

    const validationErrors = validateForm(fields);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    if (!actor) {
      setSubmitError("Unable to connect. Please try again in a moment.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const input: CreatePartnershipRequestInput = {
        name: fields.name.trim(),
        email: fields.email.trim(),
        company: fields.company.trim(),
        message: fields.message.trim(),
        preferredDate: fields.preferredDate,
        preferredTime: fields.preferredTime,
      };

      const result = await actor.submitPartnershipRequest(input);

      if (result.__kind__ === "err") {
        setSubmitError(result.err || "Something went wrong. Please try again.");
        return;
      }

      setSubmitted(true);
      setFields(EMPTY_FORM);
      setTouched({});
      setErrors({});
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.";
      setSubmitError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Success state ──────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div
        className="flex flex-col items-center justify-center gap-5 py-16 px-8 text-center"
        data-ocid="partnership.success_state"
      >
        <div className="w-16 h-16 rounded-full bg-accent/15 border border-accent/30 flex items-center justify-center">
          <CheckCircle2 className="w-8 h-8 text-accent" aria-hidden="true" />
        </div>
        <div>
          <h3 className="text-2xl font-bold font-display text-foreground mb-2">
            Meeting Request Submitted!
          </h3>
          <p className="text-muted-foreground text-base max-w-sm mx-auto">
            Thank you for reaching out. We'll review your request and confirm
            the meeting within 24 hours.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => setSubmitted(false)}
          data-ocid="partnership.schedule_another_button"
          className="mt-2"
        >
          Schedule Another Meeting
        </Button>
      </div>
    );
  }

  // ── Form ───────────────────────────────────────────────────────────────────
  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      aria-label="Partnership meeting request form"
      data-ocid="partnership.form"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Full Name */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="partner-name" className="text-foreground font-medium">
            Full Name{" "}
            <span className="text-destructive" aria-hidden="true">
              *
            </span>
          </Label>
          <Input
            id="partner-name"
            type="text"
            placeholder="Jane Smith"
            autoComplete="name"
            maxLength={100}
            value={fields.name}
            onChange={(e) => handleChange("name", e.target.value)}
            onBlur={() => handleBlur("name")}
            aria-required="true"
            aria-invalid={!!errors.name && touched.name}
            aria-describedby={
              errors.name && touched.name ? "partner-name-error" : undefined
            }
            data-ocid="partnership.name_input"
            className={
              errors.name && touched.name
                ? "border-destructive focus-visible:ring-destructive"
                : ""
            }
          />
          {errors.name && touched.name && (
            <p
              id="partner-name-error"
              className="text-destructive text-xs mt-0.5"
              role="alert"
              data-ocid="partnership.name_input.field_error"
            >
              {errors.name}
            </p>
          )}
        </div>

        {/* Email Address */}
        <div className="flex flex-col gap-1.5">
          <Label
            htmlFor="partner-email"
            className="text-foreground font-medium"
          >
            Email Address{" "}
            <span className="text-destructive" aria-hidden="true">
              *
            </span>
          </Label>
          <Input
            id="partner-email"
            type="email"
            placeholder="jane@company.com"
            autoComplete="email"
            maxLength={200}
            value={fields.email}
            onChange={(e) => handleChange("email", e.target.value)}
            onBlur={() => handleBlur("email")}
            aria-required="true"
            aria-invalid={!!errors.email && touched.email}
            aria-describedby={
              errors.email && touched.email ? "partner-email-error" : undefined
            }
            data-ocid="partnership.email_input"
            className={
              errors.email && touched.email
                ? "border-destructive focus-visible:ring-destructive"
                : ""
            }
          />
          {errors.email && touched.email && (
            <p
              id="partner-email-error"
              className="text-destructive text-xs mt-0.5"
              role="alert"
              data-ocid="partnership.email_input.field_error"
            >
              {errors.email}
            </p>
          )}
        </div>

        {/* Company */}
        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <Label
            htmlFor="partner-company"
            className="text-foreground font-medium"
          >
            Company / Organization{" "}
            <span className="text-destructive" aria-hidden="true">
              *
            </span>
          </Label>
          <Input
            id="partner-company"
            type="text"
            placeholder="Acme Legal Services"
            autoComplete="organization"
            maxLength={200}
            value={fields.company}
            onChange={(e) => handleChange("company", e.target.value)}
            onBlur={() => handleBlur("company")}
            aria-required="true"
            aria-invalid={!!errors.company && touched.company}
            aria-describedby={
              errors.company && touched.company
                ? "partner-company-error"
                : undefined
            }
            data-ocid="partnership.company_input"
            className={
              errors.company && touched.company
                ? "border-destructive focus-visible:ring-destructive"
                : ""
            }
          />
          {errors.company && touched.company && (
            <p
              id="partner-company-error"
              className="text-destructive text-xs mt-0.5"
              role="alert"
              data-ocid="partnership.company_input.field_error"
            >
              {errors.company}
            </p>
          )}
        </div>

        {/* Message */}
        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <Label
            htmlFor="partner-message"
            className="text-foreground font-medium"
          >
            Message / How can we collaborate?{" "}
            <span className="text-destructive" aria-hidden="true">
              *
            </span>
          </Label>
          <Textarea
            id="partner-message"
            placeholder="Tell us about your audience, your goals, and the type of partnership you're interested in…"
            maxLength={2000}
            rows={5}
            value={fields.message}
            onChange={(e) => handleChange("message", e.target.value)}
            onBlur={() => handleBlur("message")}
            aria-required="true"
            aria-invalid={!!errors.message && touched.message}
            aria-describedby={
              errors.message && touched.message
                ? "partner-message-error"
                : undefined
            }
            data-ocid="partnership.message_textarea"
            className={`resize-none${errors.message && touched.message ? " border-destructive focus-visible:ring-destructive" : ""}`}
          />
          <div className="flex items-start justify-between gap-2">
            {errors.message && touched.message ? (
              <p
                id="partner-message-error"
                className="text-destructive text-xs"
                role="alert"
                data-ocid="partnership.message_textarea.field_error"
              >
                {errors.message}
              </p>
            ) : (
              <span />
            )}
            <span className="text-muted-foreground text-xs shrink-0">
              {fields.message.length}/2000
            </span>
          </div>
        </div>

        {/* Preferred Date */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="partner-date" className="text-foreground font-medium">
            Preferred Date{" "}
            <span className="text-destructive" aria-hidden="true">
              *
            </span>
          </Label>
          <Input
            id="partner-date"
            type="date"
            min={getTomorrowDate()}
            value={fields.preferredDate}
            onChange={(e) => handleChange("preferredDate", e.target.value)}
            onBlur={() => handleBlur("preferredDate")}
            aria-required="true"
            aria-invalid={!!errors.preferredDate && touched.preferredDate}
            aria-describedby={
              errors.preferredDate && touched.preferredDate
                ? "partner-date-error"
                : undefined
            }
            data-ocid="partnership.date_input"
            className={
              errors.preferredDate && touched.preferredDate
                ? "border-destructive focus-visible:ring-destructive"
                : ""
            }
          />
          {errors.preferredDate && touched.preferredDate && (
            <p
              id="partner-date-error"
              className="text-destructive text-xs mt-0.5"
              role="alert"
              data-ocid="partnership.date_input.field_error"
            >
              {errors.preferredDate}
            </p>
          )}
        </div>

        {/* Preferred Time */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="partner-time" className="text-foreground font-medium">
            Preferred Time{" "}
            <span className="text-destructive" aria-hidden="true">
              *
            </span>
          </Label>
          <Select
            value={fields.preferredTime}
            onValueChange={(val) => {
              handleChange("preferredTime", val);
              setTouched((prev) => ({ ...prev, preferredTime: true }));
            }}
          >
            <SelectTrigger
              id="partner-time"
              aria-required="true"
              aria-invalid={!!errors.preferredTime && touched.preferredTime}
              aria-describedby={
                errors.preferredTime && touched.preferredTime
                  ? "partner-time-error"
                  : undefined
              }
              data-ocid="partnership.time_select"
              className={
                errors.preferredTime && touched.preferredTime
                  ? "border-destructive focus-visible:ring-destructive"
                  : ""
              }
            >
              <SelectValue placeholder="Select a time slot" />
            </SelectTrigger>
            <SelectContent>
              {TIME_SLOTS.map((slot) => (
                <SelectItem key={slot} value={slot}>
                  {slot} (EST)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.preferredTime && touched.preferredTime && (
            <p
              id="partner-time-error"
              className="text-destructive text-xs mt-0.5"
              role="alert"
              data-ocid="partnership.time_select.field_error"
            >
              {errors.preferredTime}
            </p>
          )}
        </div>
      </div>

      {/* Backend error */}
      {submitError && (
        <div
          className="mt-5 flex items-start gap-2.5 p-3.5 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm"
          role="alert"
          data-ocid="partnership.form.error_state"
        >
          <span className="shrink-0 mt-0.5">⚠</span>
          {submitError}
        </div>
      )}

      <div className="mt-6">
        <Button
          type="submit"
          disabled={isSubmitting}
          size="lg"
          className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-8 transition-smooth"
          data-ocid="partnership.form.submit_button"
        >
          {isSubmitting ? (
            <>
              <Loader2
                className="w-4 h-4 mr-2 animate-spin"
                aria-hidden="true"
              />
              Submitting…
            </>
          ) : (
            <>
              <CalendarCheck className="w-4 h-4 mr-2" aria-hidden="true" />
              Request Meeting
            </>
          )}
        </Button>
        <p className="mt-3 text-xs text-muted-foreground">
          All times are Eastern Standard Time (EST). We'll confirm your meeting
          within 24 hours.
        </p>
      </div>
    </form>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PartnershipPage() {
  return (
    <div className="flex flex-col" data-ocid="partnership.page">
      {/* Hero */}
      <section className="bg-primary text-primary-foreground py-20 px-4 sm:px-6 lg:px-8">
        <AnimatedSection direction="up" delay={0}>
          <div className="max-w-3xl mx-auto text-center">
            <Badge
              variant="outline"
              className="mb-4 border-primary-foreground/30 text-primary-foreground/80 bg-primary-foreground/10"
            >
              Partnership Program
            </Badge>

            <h1 className="text-4xl sm:text-5xl font-bold font-display leading-tight mb-4">
              Partner with <span className="text-accent">Sue Letter</span>
            </h1>

            <p className="text-lg sm:text-xl text-primary-foreground/80 max-w-2xl mx-auto mb-10">
              Join agencies, law firms, content creators, and affiliate partners
              who grow their business alongside the leading AI demand letter
              platform. Choose the partnership model that fits your audience.
            </p>

            {/* Benefit badges */}
            <div
              className="flex flex-wrap items-center justify-center gap-3"
              data-ocid="partnership.benefit_badges"
            >
              {BENEFIT_BADGES.map(({ icon: Icon, label }) => (
                <span
                  key={label}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/10 border border-primary-foreground/20 text-sm font-medium text-primary-foreground"
                >
                  <Icon className="w-4 h-4 text-accent" aria-hidden="true" />
                  {label}
                </span>
              ))}
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* Why partner stats strip */}
      <section className="bg-muted/40 border-b border-border py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12">
          {WHY_PARTNER.map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-2.5">
              <Icon
                className="w-5 h-5 text-accent shrink-0"
                aria-hidden="true"
              />
              <span className="text-sm font-medium text-foreground">
                {text}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Partnership Types */}
      <section
        className="bg-background py-20 px-4 sm:px-6 lg:px-8"
        data-ocid="partnership.types_section"
      >
        <div className="max-w-6xl mx-auto">
          <AnimatedSection direction="up" delay={0}>
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold font-display text-foreground mb-3">
                Find Your Partnership Model
              </h2>
              <p className="text-muted-foreground text-lg max-w-xl mx-auto">
                Three flexible tracks designed for different audiences and
                business goals.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PARTNER_TYPES.map((pt, i) => (
              <AnimatedCard
                key={pt.title}
                delay={pt.delay}
                enableTilt
                className="step-card flex flex-col h-full"
                data-ocid={`partnership.type_card.${i + 1}`}
              >
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center border mb-4 ${pt.accent}`}
                >
                  <pt.icon className="w-5 h-5" aria-hidden="true" />
                </div>

                <h3 className="text-xl font-semibold font-display text-foreground mb-2">
                  {pt.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-5">
                  {pt.description}
                </p>

                <ul className="mt-auto space-y-2.5">
                  {pt.bullets.map((b) => (
                    <li
                      key={b}
                      className="flex items-start gap-2 text-sm text-foreground/80"
                    >
                      <CheckCircle2
                        className="w-4 h-4 text-accent shrink-0 mt-0.5"
                        aria-hidden="true"
                      />
                      {b}
                    </li>
                  ))}
                </ul>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </section>

      {/* Schedule a Meeting — native form */}
      <section
        className="bg-muted/30 py-20 px-4 sm:px-6 lg:px-8 border-t border-border"
        data-ocid="partnership.scheduler_section"
      >
        <div className="max-w-3xl mx-auto">
          <AnimatedSection direction="up" delay={0}>
            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-accent/10 border border-accent/20 mb-4">
                <CalendarCheck
                  className="w-6 h-6 text-accent"
                  aria-hidden="true"
                />
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold font-display text-foreground mb-3">
                Let's Connect
              </h2>
              <p className="text-muted-foreground text-lg max-w-lg mx-auto">
                Fill in your details and pick a time. We'll review your request
                and send a calendar invite within 24 hours.
              </p>
            </div>
          </AnimatedSection>

          <AnimatedSection direction="up" delay={0.1}>
            <div
              className="bg-card border border-border rounded-2xl shadow-sm p-7 sm:p-10"
              data-ocid="partnership.form_card"
            >
              {/* Quick contact badges */}
              <div className="flex flex-wrap gap-2 mb-8">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                  Free Consultation
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-muted border border-border text-muted-foreground text-xs font-medium">
                  <CalendarCheck className="w-3.5 h-3.5" aria-hidden="true" />
                  30-Minute Call
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-muted border border-border text-muted-foreground text-xs font-medium">
                  <Handshake className="w-3.5 h-3.5" aria-hidden="true" />
                  No Commitment
                </span>
              </div>

              <ScheduleForm />
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Legal Disclaimer */}
      <section className="bg-background border-t border-border py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <LegalDisclaimer />
        </div>
      </section>
    </div>
  );
}
