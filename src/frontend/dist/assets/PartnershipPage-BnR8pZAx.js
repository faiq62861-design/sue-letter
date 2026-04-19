import { c as createLucideIcon, j as jsxRuntimeExports, A as AnimatedSection, B as Badge, a8 as Building2, a9 as LegalDisclaimer, r as reactExports, f as Button } from "./index-DkssxSHZ.js";
import { A as AnimatedCard } from "./index-vxsl8MaO.js";
import { I as Input } from "./input-D3UHnDUg.js";
import { G as Globe, L as Label, T as Textarea, S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./textarea-CNPTnSIc.js";
import { c as useBackend } from "./use-backend-DszHSVCa.js";
import { S as Sparkles } from "./sparkles-Bd7TWpQf.js";
import { b as CircleCheck } from "./index-DQ70dg7q.js";
import { D as DollarSign } from "./dollar-sign-BUSZc6gA.js";
import "./chevron-down-DNUpHeTU.js";
import "./chevron-up-DTq8CSEB.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$5 = [
  ["path", { d: "M8 2v4", key: "1cmpym" }],
  ["path", { d: "M16 2v4", key: "4m81vk" }],
  ["rect", { width: "18", height: "18", x: "3", y: "4", rx: "2", key: "1hopcy" }],
  ["path", { d: "M3 10h18", key: "8toen8" }],
  ["path", { d: "m9 16 2 2 4-4", key: "19s6y9" }]
];
const CalendarCheck = createLucideIcon("calendar-check", __iconNode$5);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$4 = [
  ["path", { d: "M3 3v16a2 2 0 0 0 2 2h16", key: "c24i48" }],
  ["path", { d: "M18 17V9", key: "2bz60n" }],
  ["path", { d: "M13 17V5", key: "1frdt8" }],
  ["path", { d: "M8 17v-3", key: "17ska0" }]
];
const ChartColumn = createLucideIcon("chart-column", __iconNode$4);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [
  ["path", { d: "m11 17 2 2a1 1 0 1 0 3-3", key: "efffak" }],
  [
    "path",
    {
      d: "m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4",
      key: "9pr0kb"
    }
  ],
  ["path", { d: "m21 3 1 11h-2", key: "1tisrp" }],
  ["path", { d: "M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3", key: "1uvwmv" }],
  ["path", { d: "M3 4h8", key: "1ep09j" }]
];
const Handshake = createLucideIcon("handshake", __iconNode$3);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [["path", { d: "M21 12a9 9 0 1 1-6.219-8.56", key: "13zald" }]];
const LoaderCircle = createLucideIcon("loader-circle", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "M15 18h-5", key: "95g1m2" }],
  ["path", { d: "M18 14h-8", key: "sponae" }],
  [
    "path",
    {
      d: "M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-4 0v-9a2 2 0 0 1 2-2h2",
      key: "39pd36"
    }
  ],
  ["rect", { width: "8", height: "4", x: "10", y: "6", rx: "1", key: "aywv1n" }]
];
const Newspaper = createLucideIcon("newspaper", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["line", { x1: "19", x2: "5", y1: "5", y2: "19", key: "1x9vlm" }],
  ["circle", { cx: "6.5", cy: "6.5", r: "2.5", key: "4mh3h7" }],
  ["circle", { cx: "17.5", cy: "17.5", r: "2.5", key: "1mdrzq" }]
];
const Percent = createLucideIcon("percent", __iconNode);
const BENEFIT_BADGES = [
  { icon: Percent, label: "30% Commission" },
  { icon: Sparkles, label: "Co-Marketing" },
  { icon: Globe, label: "White-Label Access" }
];
const PARTNER_TYPES = [
  {
    icon: DollarSign,
    title: "Affiliate Partners",
    description: "Earn recurring commission for every paying customer you refer. Perfect for content creators, bloggers, and consultants.",
    bullets: [
      "30% recurring commission on all referred subscriptions",
      "Real-time dashboard with clicks, conversions & earnings",
      "Dedicated affiliate links and custom promo codes"
    ],
    accent: "bg-accent/10 text-accent border-accent/20",
    delay: 0
  },
  {
    icon: Building2,
    title: "Agency Partners",
    description: "White-label Sue Letter under your own brand. Serve your clients with volume pricing and priority support.",
    bullets: [
      "Full white-label setup with your branding and domain",
      "Volume pricing with tiered discounts up to 50%",
      "Dedicated account manager and priority support SLA"
    ],
    accent: "bg-primary/10 text-primary border-primary/20",
    delay: 0.1
  },
  {
    icon: Newspaper,
    title: "Media & Content",
    description: "Editorial partnerships, sponsored guides, and featured placements for legal publishers and content platforms.",
    bullets: [
      "Co-branded legal guides and resource pages",
      "Sponsored content and newsletter placements",
      "Early access to data reports and research assets"
    ],
    accent: "bg-warning/10 text-warning border-warning/20",
    delay: 0.2
  }
];
const WHY_PARTNER = [
  { icon: ChartColumn, text: "10,000+ active users and growing" },
  { icon: CircleCheck, text: "Industry-leading demand letter AI" },
  { icon: Handshake, text: "Transparent, reliable partner payouts" }
];
const TIME_SLOTS = [
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
  "5:00 PM"
];
const EMPTY_FORM = {
  name: "",
  email: "",
  company: "",
  message: "",
  preferredDate: "",
  preferredTime: ""
};
function getTomorrowDate() {
  const d = /* @__PURE__ */ new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split("T")[0];
}
function validateForm(fields) {
  const errors = {};
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
  } else if (fields.message.trim().length > 2e3) {
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
function ScheduleForm() {
  const { actor } = useBackend();
  const [fields, setFields] = reactExports.useState(EMPTY_FORM);
  const [touched, setTouched] = reactExports.useState({});
  const [errors, setErrors] = reactExports.useState({});
  const [isSubmitting, setIsSubmitting] = reactExports.useState(false);
  const [submitError, setSubmitError] = reactExports.useState(null);
  const [submitted, setSubmitted] = reactExports.useState(false);
  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const newErrors = validateForm({ ...fields });
    setErrors(newErrors);
  };
  const handleChange = (field, value) => {
    setFields((prev) => ({ ...prev, [field]: value }));
    if (touched[field]) {
      const newErrors = validateForm({ ...fields, [field]: value });
      setErrors(newErrors);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const allTouched = {
      name: true,
      email: true,
      company: true,
      message: true,
      preferredDate: true,
      preferredTime: true
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
      const input = {
        name: fields.name.trim(),
        email: fields.email.trim(),
        company: fields.company.trim(),
        message: fields.message.trim(),
        preferredDate: fields.preferredDate,
        preferredTime: fields.preferredTime
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
      const msg = err instanceof Error ? err.message : "Something went wrong. Please try again.";
      setSubmitError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };
  if (submitted) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-col items-center justify-center gap-5 py-16 px-8 text-center",
        "data-ocid": "partnership.success_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 rounded-full bg-accent/15 border border-accent/30 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-8 h-8 text-accent", "aria-hidden": "true" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-2xl font-bold font-display text-foreground mb-2", children: "Meeting Request Submitted!" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-base max-w-sm mx-auto", children: "Thank you for reaching out. We'll review your request and confirm the meeting within 24 hours." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "outline",
              onClick: () => setSubmitted(false),
              "data-ocid": "partnership.schedule_another_button",
              className: "mt-2",
              children: "Schedule Another Meeting"
            }
          )
        ]
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "form",
    {
      onSubmit: handleSubmit,
      noValidate: true,
      "aria-label": "Partnership meeting request form",
      "data-ocid": "partnership.form",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "partner-name", className: "text-foreground font-medium", children: [
              "Full Name",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", "aria-hidden": "true", children: "*" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "partner-name",
                type: "text",
                placeholder: "Jane Smith",
                autoComplete: "name",
                maxLength: 100,
                value: fields.name,
                onChange: (e) => handleChange("name", e.target.value),
                onBlur: () => handleBlur("name"),
                "aria-required": "true",
                "aria-invalid": !!errors.name && touched.name,
                "aria-describedby": errors.name && touched.name ? "partner-name-error" : void 0,
                "data-ocid": "partnership.name_input",
                className: errors.name && touched.name ? "border-destructive focus-visible:ring-destructive" : ""
              }
            ),
            errors.name && touched.name && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                id: "partner-name-error",
                className: "text-destructive text-xs mt-0.5",
                role: "alert",
                "data-ocid": "partnership.name_input.field_error",
                children: errors.name
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Label,
              {
                htmlFor: "partner-email",
                className: "text-foreground font-medium",
                children: [
                  "Email Address",
                  " ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", "aria-hidden": "true", children: "*" })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "partner-email",
                type: "email",
                placeholder: "jane@company.com",
                autoComplete: "email",
                maxLength: 200,
                value: fields.email,
                onChange: (e) => handleChange("email", e.target.value),
                onBlur: () => handleBlur("email"),
                "aria-required": "true",
                "aria-invalid": !!errors.email && touched.email,
                "aria-describedby": errors.email && touched.email ? "partner-email-error" : void 0,
                "data-ocid": "partnership.email_input",
                className: errors.email && touched.email ? "border-destructive focus-visible:ring-destructive" : ""
              }
            ),
            errors.email && touched.email && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                id: "partner-email-error",
                className: "text-destructive text-xs mt-0.5",
                role: "alert",
                "data-ocid": "partnership.email_input.field_error",
                children: errors.email
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1.5 sm:col-span-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Label,
              {
                htmlFor: "partner-company",
                className: "text-foreground font-medium",
                children: [
                  "Company / Organization",
                  " ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", "aria-hidden": "true", children: "*" })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "partner-company",
                type: "text",
                placeholder: "Acme Legal Services",
                autoComplete: "organization",
                maxLength: 200,
                value: fields.company,
                onChange: (e) => handleChange("company", e.target.value),
                onBlur: () => handleBlur("company"),
                "aria-required": "true",
                "aria-invalid": !!errors.company && touched.company,
                "aria-describedby": errors.company && touched.company ? "partner-company-error" : void 0,
                "data-ocid": "partnership.company_input",
                className: errors.company && touched.company ? "border-destructive focus-visible:ring-destructive" : ""
              }
            ),
            errors.company && touched.company && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                id: "partner-company-error",
                className: "text-destructive text-xs mt-0.5",
                role: "alert",
                "data-ocid": "partnership.company_input.field_error",
                children: errors.company
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1.5 sm:col-span-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Label,
              {
                htmlFor: "partner-message",
                className: "text-foreground font-medium",
                children: [
                  "Message / How can we collaborate?",
                  " ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", "aria-hidden": "true", children: "*" })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Textarea,
              {
                id: "partner-message",
                placeholder: "Tell us about your audience, your goals, and the type of partnership you're interested in…",
                maxLength: 2e3,
                rows: 5,
                value: fields.message,
                onChange: (e) => handleChange("message", e.target.value),
                onBlur: () => handleBlur("message"),
                "aria-required": "true",
                "aria-invalid": !!errors.message && touched.message,
                "aria-describedby": errors.message && touched.message ? "partner-message-error" : void 0,
                "data-ocid": "partnership.message_textarea",
                className: `resize-none${errors.message && touched.message ? " border-destructive focus-visible:ring-destructive" : ""}`
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2", children: [
              errors.message && touched.message ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                "p",
                {
                  id: "partner-message-error",
                  className: "text-destructive text-xs",
                  role: "alert",
                  "data-ocid": "partnership.message_textarea.field_error",
                  children: errors.message
                }
              ) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", {}),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground text-xs shrink-0", children: [
                fields.message.length,
                "/2000"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "partner-date", className: "text-foreground font-medium", children: [
              "Preferred Date",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", "aria-hidden": "true", children: "*" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "partner-date",
                type: "date",
                min: getTomorrowDate(),
                value: fields.preferredDate,
                onChange: (e) => handleChange("preferredDate", e.target.value),
                onBlur: () => handleBlur("preferredDate"),
                "aria-required": "true",
                "aria-invalid": !!errors.preferredDate && touched.preferredDate,
                "aria-describedby": errors.preferredDate && touched.preferredDate ? "partner-date-error" : void 0,
                "data-ocid": "partnership.date_input",
                className: errors.preferredDate && touched.preferredDate ? "border-destructive focus-visible:ring-destructive" : ""
              }
            ),
            errors.preferredDate && touched.preferredDate && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                id: "partner-date-error",
                className: "text-destructive text-xs mt-0.5",
                role: "alert",
                "data-ocid": "partnership.date_input.field_error",
                children: errors.preferredDate
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "partner-time", className: "text-foreground font-medium", children: [
              "Preferred Time",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", "aria-hidden": "true", children: "*" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Select,
              {
                value: fields.preferredTime,
                onValueChange: (val) => {
                  handleChange("preferredTime", val);
                  setTouched((prev) => ({ ...prev, preferredTime: true }));
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    SelectTrigger,
                    {
                      id: "partner-time",
                      "aria-required": "true",
                      "aria-invalid": !!errors.preferredTime && touched.preferredTime,
                      "aria-describedby": errors.preferredTime && touched.preferredTime ? "partner-time-error" : void 0,
                      "data-ocid": "partnership.time_select",
                      className: errors.preferredTime && touched.preferredTime ? "border-destructive focus-visible:ring-destructive" : "",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select a time slot" })
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: TIME_SLOTS.map((slot) => /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: slot, children: [
                    slot,
                    " (EST)"
                  ] }, slot)) })
                ]
              }
            ),
            errors.preferredTime && touched.preferredTime && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                id: "partner-time-error",
                className: "text-destructive text-xs mt-0.5",
                role: "alert",
                "data-ocid": "partnership.time_select.field_error",
                children: errors.preferredTime
              }
            )
          ] })
        ] }),
        submitError && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "mt-5 flex items-start gap-2.5 p-3.5 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm",
            role: "alert",
            "data-ocid": "partnership.form.error_state",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "shrink-0 mt-0.5", children: "⚠" }),
              submitError
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "submit",
              disabled: isSubmitting,
              size: "lg",
              className: "w-full sm:w-auto bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-8 transition-smooth",
              "data-ocid": "partnership.form.submit_button",
              children: isSubmitting ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  LoaderCircle,
                  {
                    className: "w-4 h-4 mr-2 animate-spin",
                    "aria-hidden": "true"
                  }
                ),
                "Submitting…"
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarCheck, { className: "w-4 h-4 mr-2", "aria-hidden": "true" }),
                "Request Meeting"
              ] })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-xs text-muted-foreground", children: "All times are Eastern Standard Time (EST). We'll confirm your meeting within 24 hours." })
        ] })
      ]
    }
  );
}
function PartnershipPage() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col", "data-ocid": "partnership.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "bg-primary text-primary-foreground py-20 px-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatedSection, { direction: "up", delay: 0, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-3xl mx-auto text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Badge,
        {
          variant: "outline",
          className: "mb-4 border-primary-foreground/30 text-primary-foreground/80 bg-primary-foreground/10",
          children: "Partnership Program"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-4xl sm:text-5xl font-bold font-display leading-tight mb-4", children: [
        "Partner with ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-accent", children: "Sue Letter" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg sm:text-xl text-primary-foreground/80 max-w-2xl mx-auto mb-10", children: "Join agencies, law firms, content creators, and affiliate partners who grow their business alongside the leading AI demand letter platform. Choose the partnership model that fits your audience." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "flex flex-wrap items-center justify-center gap-3",
          "data-ocid": "partnership.benefit_badges",
          children: BENEFIT_BADGES.map(({ icon: Icon, label }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "span",
            {
              className: "inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/10 border border-primary-foreground/20 text-sm font-medium text-primary-foreground",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "w-4 h-4 text-accent", "aria-hidden": "true" }),
                label
              ]
            },
            label
          ))
        }
      )
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "bg-muted/40 border-b border-border py-8 px-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12", children: WHY_PARTNER.map(({ icon: Icon, text }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Icon,
        {
          className: "w-5 h-5 text-accent shrink-0",
          "aria-hidden": "true"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium text-foreground", children: text })
    ] }, text)) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "section",
      {
        className: "bg-background py-20 px-4 sm:px-6 lg:px-8",
        "data-ocid": "partnership.types_section",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-6xl mx-auto", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatedSection, { direction: "up", delay: 0, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-12", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-3xl sm:text-4xl font-bold font-display text-foreground mb-3", children: "Find Your Partnership Model" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-lg max-w-xl mx-auto", children: "Three flexible tracks designed for different audiences and business goals." })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6", children: PARTNER_TYPES.map((pt, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            AnimatedCard,
            {
              delay: pt.delay,
              enableTilt: true,
              className: "step-card flex flex-col h-full",
              "data-ocid": `partnership.type_card.${i + 1}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: `w-10 h-10 rounded-lg flex items-center justify-center border mb-4 ${pt.accent}`,
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(pt.icon, { className: "w-5 h-5", "aria-hidden": "true" })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-semibold font-display text-foreground mb-2", children: pt.title }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm leading-relaxed mb-5", children: pt.description }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "mt-auto space-y-2.5", children: pt.bullets.map((b) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "li",
                  {
                    className: "flex items-start gap-2 text-sm text-foreground/80",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        CircleCheck,
                        {
                          className: "w-4 h-4 text-accent shrink-0 mt-0.5",
                          "aria-hidden": "true"
                        }
                      ),
                      b
                    ]
                  },
                  b
                )) })
              ]
            },
            pt.title
          )) })
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "section",
      {
        className: "bg-muted/30 py-20 px-4 sm:px-6 lg:px-8 border-t border-border",
        "data-ocid": "partnership.scheduler_section",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-3xl mx-auto", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatedSection, { direction: "up", delay: 0, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-10", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "inline-flex items-center justify-center w-12 h-12 rounded-full bg-accent/10 border border-accent/20 mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              CalendarCheck,
              {
                className: "w-6 h-6 text-accent",
                "aria-hidden": "true"
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-3xl sm:text-4xl font-bold font-display text-foreground mb-3", children: "Let's Connect" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-lg max-w-lg mx-auto", children: "Fill in your details and pick a time. We'll review your request and send a calendar invite within 24 hours." })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatedSection, { direction: "up", delay: 0.1, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "bg-card border border-border rounded-2xl shadow-sm p-7 sm:p-10",
              "data-ocid": "partnership.form_card",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2 mb-8", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-medium", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-3.5 h-3.5", "aria-hidden": "true" }),
                    "Free Consultation"
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-muted border border-border text-muted-foreground text-xs font-medium", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarCheck, { className: "w-3.5 h-3.5", "aria-hidden": "true" }),
                    "30-Minute Call"
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-muted border border-border text-muted-foreground text-xs font-medium", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Handshake, { className: "w-3.5 h-3.5", "aria-hidden": "true" }),
                    "No Commitment"
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(ScheduleForm, {})
              ]
            }
          ) })
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "bg-background border-t border-border py-8 px-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-4xl mx-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LegalDisclaimer, {}) }) })
  ] });
}
export {
  PartnershipPage as default
};
