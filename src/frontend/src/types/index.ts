// ─── Enums / Union Types ────────────────────────────────────────────────────

export type LetterType =
  | "DebtRecovery"
  | "LandlordTenant"
  | "RefundConsumer"
  | "PropertyDamage"
  | "CeaseDesist"
  | "EmploymentDispute"
  | "InsuranceClaim"
  | "ContractorDispute"
  | "CreditReportDispute";

export type LetterTone = "Firm" | "Assertive" | "FinalWarning";

export type LetterStatus =
  | "Draft"
  | "Sent"
  | "ResponseReceived"
  | "FollowUpNeeded"
  | "Resolved";

export type UserPlan = "Free" | "Pro" | "Business" | "PayPerLetter";

// ─── Letter Form Data ───────────────────────────────────────────────────────

export interface LetterFormData {
  // Step 1 – Letter type & tone
  letterType: LetterType | null;
  tone: LetterTone;
  jurisdiction: string; // US state code e.g. 'CA'
  language: string; // e.g. 'English', 'Spanish'
  country: string; // ISO 3166-1 alpha-2 e.g. 'US', 'GB', 'AU', 'IN'

  // Step 2 – Party details
  senderName: string;
  senderAddress: string;
  senderCity: string;
  senderState: string;
  senderZip: string;
  senderEmail: string;
  senderPhone: string;

  recipientName: string;
  recipientTitle: string;
  recipientCompany: string;
  recipientEmail: string;
  recipientAddress: string;
  recipientCity: string;
  recipientState: string;
  recipientZip: string;

  // Step 3 – Dispute details
  incidentDate: string;
  disputeDescription: string;
  priorContactAttempts: string;
  amountDemanded: string;
  currency: string;
  responseDeadlineDays: number;

  // Step 4 – Evidence & supporting details
  evidenceItems: string[];
  additionalEvidence: string;
  evidenceImages: string[]; // object-storage URLs or data URIs

  // Step 5 – Supporting detail (type-specific)
  contractDate: string;
  contractReference: string;
  invoiceNumbers: string;
  leaseStartDate: string;
  leaseEndDate: string;
  propertyAddress: string;
  purchaseDate: string;
  orderNumber: string;
  employmentStartDate: string;
  employmentEndDate: string;
  policyNumber: string;
  claimNumber: string;

  // Credit Report Dispute-specific fields (optional — only used when letterType === "CreditReportDispute")
  creditBureauName?: string;
  accountName?: string;
  accountNumber?: string;
  inaccuracyType?: string;
  creditDisputeDescription?: string;
  creditSupportingDocs?: string[];
}

export const DEFAULT_FORM_DATA: LetterFormData = {
  letterType: null,
  tone: "Firm",
  jurisdiction: "CA",
  language: "English",
  country: "US",
  senderName: "",
  senderAddress: "",
  senderCity: "",
  senderState: "",
  senderZip: "",
  senderEmail: "",
  senderPhone: "",
  recipientName: "",
  recipientTitle: "",
  recipientCompany: "",
  recipientEmail: "",
  recipientAddress: "",
  recipientCity: "",
  recipientState: "",
  recipientZip: "",
  incidentDate: "",
  disputeDescription: "",
  priorContactAttempts: "",
  amountDemanded: "",
  currency: "USD",
  responseDeadlineDays: 14,
  evidenceItems: [],
  additionalEvidence: "",
  evidenceImages: [],
  contractDate: "",
  contractReference: "",
  invoiceNumbers: "",
  leaseStartDate: "",
  leaseEndDate: "",
  propertyAddress: "",
  purchaseDate: "",
  orderNumber: "",
  employmentStartDate: "",
  employmentEndDate: "",
  policyNumber: "",
  claimNumber: "",
  // Credit Report Dispute-specific
  creditBureauName: "",
  accountName: "",
  accountNumber: "",
  inaccuracyType: "",
  creditDisputeDescription: "",
  creditSupportingDocs: [],
};

// ─── Domain Models ──────────────────────────────────────────────────────────

export interface GeneratedLetter {
  id: string;
  userId: string;
  formData: LetterFormData;
  letterContent: string;
  createdAt: bigint;
  status: LetterStatus;
  isFollowUp: boolean;
  originalLetterId?: string;
  /** Client-side tracked — sourced from localStorage */
  downloadCount?: number;
  /** Client-side tracked — sourced from localStorage (ms epoch) */
  lastDownloadAt?: number | null;
}

export interface UserProfile {
  userId: string;
  email?: string;
  plan: UserPlan;
  lettersThisMonth: number;
  totalLetters: number;
  currentMonthYear: string;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  createdAt: bigint;
}

export interface StrengthAnalysis {
  score: number;
  strengths: string[];
  improvements: string[];
  responseLikelihood: "Low" | "Medium" | "High";
}

// ─── Gmail Send State ───────────────────────────────────────────────────────

export interface GmailSendState {
  isConnected: boolean;
  recipientEmail: string;
  subject: string;
  status: "idle" | "sending" | "sent" | "error";
  error?: string;
}

// ─── Config Maps ────────────────────────────────────────────────────────────

export interface LetterTypeConfig {
  label: string;
  icon: string;
  description: string;
  slug: string;
}

export const LETTER_TYPE_CONFIG: Record<LetterType, LetterTypeConfig> = {
  DebtRecovery: {
    label: "Debt Recovery",
    icon: "💰",
    description: "Recover unpaid debts and outstanding invoices",
    slug: "debt-demand-letter-generator",
  },
  LandlordTenant: {
    label: "Landlord / Tenant Dispute",
    icon: "🏠",
    description: "Security deposits, evictions, lease violations, habitability",
    slug: "landlord-demand-letter-generator",
  },
  RefundConsumer: {
    label: "Refund & Consumer",
    icon: "🛒",
    description: "Product refunds, consumer fraud, warranty disputes",
    slug: "refund-demand-letter-generator",
  },
  PropertyDamage: {
    label: "Property Damage",
    icon: "🏚",
    description: "Recover damages for destroyed or damaged property",
    slug: "property-damage-demand-letter",
  },
  CeaseDesist: {
    label: "Cease & Desist",
    icon: "🚫",
    description:
      "Stop harassment, defamation, IP infringement, or unlawful conduct",
    slug: "cease-and-desist-letter-generator",
  },
  EmploymentDispute: {
    label: "Employment Dispute",
    icon: "💼",
    description: "Wrongful termination, unpaid wages, discrimination",
    slug: "employment-dispute-demand-letter",
  },
  InsuranceClaim: {
    label: "Insurance Claim",
    icon: "📋",
    description: "Disputed insurance claims, bad faith denials",
    slug: "insurance-claim-demand-letter",
  },
  ContractorDispute: {
    label: "Contractor Dispute",
    icon: "🔧",
    description: "Incomplete work, overbilling, construction defects",
    slug: "contractor-dispute-demand-letter",
  },
  CreditReportDispute: {
    label: "Credit Report Dispute",
    icon: "📊",
    description:
      "Dispute inaccurate or fraudulent entries on your credit report with bureaus or creditors",
    slug: "credit-report-dispute-demand-letter",
  },
};

// ─── Evidence Items ─────────────────────────────────────────────────────────

export interface EvidenceItem {
  id: string;
  label: string;
}

export const EVIDENCE_ITEMS: EvidenceItem[] = [
  { id: "contracts", label: "Signed contracts or agreements" },
  { id: "invoices", label: "Invoices or receipts" },
  { id: "emails", label: "Email correspondence" },
  { id: "photos", label: "Photographs or videos" },
  { id: "texts", label: "Text messages or chat logs" },
  { id: "bank_statements", label: "Bank or payment statements" },
  { id: "police_report", label: "Police or incident report" },
  { id: "medical_records", label: "Medical records or bills" },
  { id: "witness_statements", label: "Witness statements" },
  { id: "appraisal", label: "Property appraisal or estimate" },
  { id: "lease", label: "Lease agreement" },
  { id: "pay_stubs", label: "Pay stubs or W-2 forms" },
];

// ─── US States ──────────────────────────────────────────────────────────────

export interface USState {
  code: string;
  name: string;
}

export const US_STATES: USState[] = [
  { code: "AL", name: "Alabama" },
  { code: "AK", name: "Alaska" },
  { code: "AZ", name: "Arizona" },
  { code: "AR", name: "Arkansas" },
  { code: "CA", name: "California" },
  { code: "CO", name: "Colorado" },
  { code: "CT", name: "Connecticut" },
  { code: "DE", name: "Delaware" },
  { code: "FL", name: "Florida" },
  { code: "GA", name: "Georgia" },
  { code: "HI", name: "Hawaii" },
  { code: "ID", name: "Idaho" },
  { code: "IL", name: "Illinois" },
  { code: "IN", name: "Indiana" },
  { code: "IA", name: "Iowa" },
  { code: "KS", name: "Kansas" },
  { code: "KY", name: "Kentucky" },
  { code: "LA", name: "Louisiana" },
  { code: "ME", name: "Maine" },
  { code: "MD", name: "Maryland" },
  { code: "MA", name: "Massachusetts" },
  { code: "MI", name: "Michigan" },
  { code: "MN", name: "Minnesota" },
  { code: "MS", name: "Mississippi" },
  { code: "MO", name: "Missouri" },
  { code: "MT", name: "Montana" },
  { code: "NE", name: "Nebraska" },
  { code: "NV", name: "Nevada" },
  { code: "NH", name: "New Hampshire" },
  { code: "NJ", name: "New Jersey" },
  { code: "NM", name: "New Mexico" },
  { code: "NY", name: "New York" },
  { code: "NC", name: "North Carolina" },
  { code: "ND", name: "North Dakota" },
  { code: "OH", name: "Ohio" },
  { code: "OK", name: "Oklahoma" },
  { code: "OR", name: "Oregon" },
  { code: "PA", name: "Pennsylvania" },
  { code: "RI", name: "Rhode Island" },
  { code: "SC", name: "South Carolina" },
  { code: "SD", name: "South Dakota" },
  { code: "TN", name: "Tennessee" },
  { code: "TX", name: "Texas" },
  { code: "UT", name: "Utah" },
  { code: "VT", name: "Vermont" },
  { code: "VA", name: "Virginia" },
  { code: "WA", name: "Washington" },
  { code: "WV", name: "West Virginia" },
  { code: "WI", name: "Wisconsin" },
  { code: "WY", name: "Wyoming" },
  { code: "DC", name: "District of Columbia" },
];

// ─── Currencies ─────────────────────────────────────────────────────────────

export interface Currency {
  code: string;
  symbol: string;
}

export const CURRENCIES: Currency[] = [
  { code: "USD", symbol: "$" },
  { code: "CAD", symbol: "CA$" },
  { code: "EUR", symbol: "€" },
  { code: "GBP", symbol: "£" },
  { code: "AUD", symbol: "A$" },
];

// ─── Plan Config ─────────────────────────────────────────────────────────────

export interface PlanConfig {
  id: UserPlan;
  name: string;
  price: number | null;
  priceLabel: string;
  lettersPerMonth: number | null;
  features: string[];
  highlight: boolean;
}

export const PLAN_CONFIG: PlanConfig[] = [
  {
    id: "Free",
    name: "Free",
    price: 0,
    priceLabel: "$0 / month",
    lettersPerMonth: 2,
    features: [
      "2 letters per month",
      "PDF download (watermarked)",
      "Plain-text copy",
      "All 8 letter types",
    ],
    highlight: false,
  },
  {
    id: "Pro",
    name: "Pro",
    price: 9.99,
    priceLabel: "$9.99 / month",
    lettersPerMonth: null,
    features: [
      "Unlimited letters",
      "Clean PDF & DOCX download",
      "Strength analyser",
      "Next-steps advisor",
      "Follow-up letter generator",
      "Letter history dashboard",
      "Email letter via certified mail cover sheet",
    ],
    highlight: true,
  },
  {
    id: "Business",
    name: "Business",
    price: 29,
    priceLabel: "$29 / month",
    lettersPerMonth: null,
    features: [
      "Everything in Pro",
      "Unlimited team members",
      "Priority AI generation",
      "Bulk letter generation",
      "API access",
      "Dedicated support",
    ],
    highlight: false,
  },
];

// ─── World Languages ─────────────────────────────────────────────────────────

export const WORLD_LANGUAGES: string[] = [
  "Afrikaans",
  "Albanian",
  "Amharic",
  "Arabic",
  "Armenian",
  "Azerbaijani",
  "Basque",
  "Belarusian",
  "Bengali",
  "Bosnian",
  "Bulgarian",
  "Catalan",
  "Cebuano",
  "Chinese (Simplified)",
  "Chinese (Traditional)",
  "Croatian",
  "Czech",
  "Danish",
  "Dutch",
  "English",
  "Esperanto",
  "Estonian",
  "Filipino",
  "Finnish",
  "French",
  "Galician",
  "Georgian",
  "German",
  "Greek",
  "Gujarati",
  "Haitian Creole",
  "Hausa",
  "Hawaiian",
  "Hebrew",
  "Hindi",
  "Hmong",
  "Hungarian",
  "Icelandic",
  "Igbo",
  "Indonesian",
  "Irish",
  "Italian",
  "Japanese",
  "Javanese",
  "Kannada",
  "Kazakh",
  "Khmer",
  "Kinyarwanda",
  "Korean",
  "Kurdish",
  "Kyrgyz",
  "Lao",
  "Latin",
  "Latvian",
  "Lithuanian",
  "Luxembourgish",
  "Macedonian",
  "Malagasy",
  "Malay",
  "Malayalam",
  "Maltese",
  "Maori",
  "Marathi",
  "Mongolian",
  "Myanmar (Burmese)",
  "Nepali",
  "Norwegian",
  "Nyanja (Chichewa)",
  "Odia (Oriya)",
  "Pashto",
  "Persian",
  "Polish",
  "Portuguese",
  "Punjabi",
  "Romanian",
  "Russian",
  "Samoan",
  "Scots Gaelic",
  "Serbian",
  "Sesotho",
  "Shona",
  "Sindhi",
  "Sinhala",
  "Slovak",
  "Slovenian",
  "Somali",
  "Spanish",
  "Sundanese",
  "Swahili",
  "Swedish",
  "Tajik",
  "Tamil",
  "Tatar",
  "Telugu",
  "Thai",
  "Turkish",
  "Turkmen",
  "Ukrainian",
  "Urdu",
  "Uyghur",
  "Uzbek",
  "Vietnamese",
  "Welsh",
  "Xhosa",
  "Yiddish",
  "Yoruba",
  "Zulu",
];

// ─── World Countries ─────────────────────────────────────────────────────────

export interface WorldCountry {
  code: string; // ISO 3166-1 alpha-2
  name: string; // Display name with flag emoji prefix
}

export const WORLD_COUNTRIES: WorldCountry[] = [
  { code: "AF", name: "🇦🇫 Afghanistan" },
  { code: "AL", name: "🇦🇱 Albania" },
  { code: "DZ", name: "🇩🇿 Algeria" },
  { code: "AD", name: "🇦🇩 Andorra" },
  { code: "AO", name: "🇦🇴 Angola" },
  { code: "AG", name: "🇦🇬 Antigua and Barbuda" },
  { code: "AR", name: "🇦🇷 Argentina" },
  { code: "AM", name: "🇦🇲 Armenia" },
  { code: "AU", name: "🇦🇺 Australia" },
  { code: "AT", name: "🇦🇹 Austria" },
  { code: "AZ", name: "🇦🇿 Azerbaijan" },
  { code: "BS", name: "🇧🇸 Bahamas" },
  { code: "BH", name: "🇧🇭 Bahrain" },
  { code: "BD", name: "🇧🇩 Bangladesh" },
  { code: "BB", name: "🇧🇧 Barbados" },
  { code: "BY", name: "🇧🇾 Belarus" },
  { code: "BE", name: "🇧🇪 Belgium" },
  { code: "BZ", name: "🇧🇿 Belize" },
  { code: "BJ", name: "🇧🇯 Benin" },
  { code: "BT", name: "🇧🇹 Bhutan" },
  { code: "BO", name: "🇧🇴 Bolivia" },
  { code: "BA", name: "🇧🇦 Bosnia and Herzegovina" },
  { code: "BW", name: "🇧🇼 Botswana" },
  { code: "BR", name: "🇧🇷 Brazil" },
  { code: "BN", name: "🇧🇳 Brunei" },
  { code: "BG", name: "🇧🇬 Bulgaria" },
  { code: "BF", name: "🇧🇫 Burkina Faso" },
  { code: "BI", name: "🇧🇮 Burundi" },
  { code: "CV", name: "🇨🇻 Cabo Verde" },
  { code: "KH", name: "🇰🇭 Cambodia" },
  { code: "CM", name: "🇨🇲 Cameroon" },
  { code: "CA", name: "🇨🇦 Canada" },
  { code: "CF", name: "🇨🇫 Central African Republic" },
  { code: "TD", name: "🇹🇩 Chad" },
  { code: "CL", name: "🇨🇱 Chile" },
  { code: "CN", name: "🇨🇳 China" },
  { code: "CO", name: "🇨🇴 Colombia" },
  { code: "KM", name: "🇰🇲 Comoros" },
  { code: "CG", name: "🇨🇬 Congo (Republic)" },
  { code: "CD", name: "🇨🇩 Congo (Democratic Republic)" },
  { code: "CR", name: "🇨🇷 Costa Rica" },
  { code: "HR", name: "🇭🇷 Croatia" },
  { code: "CU", name: "🇨🇺 Cuba" },
  { code: "CY", name: "🇨🇾 Cyprus" },
  { code: "CZ", name: "🇨🇿 Czech Republic" },
  { code: "DK", name: "🇩🇰 Denmark" },
  { code: "DJ", name: "🇩🇯 Djibouti" },
  { code: "DM", name: "🇩🇲 Dominica" },
  { code: "DO", name: "🇩🇴 Dominican Republic" },
  { code: "EC", name: "🇪🇨 Ecuador" },
  { code: "EG", name: "🇪🇬 Egypt" },
  { code: "SV", name: "🇸🇻 El Salvador" },
  { code: "GQ", name: "🇬🇶 Equatorial Guinea" },
  { code: "ER", name: "🇪🇷 Eritrea" },
  { code: "EE", name: "🇪🇪 Estonia" },
  { code: "SZ", name: "🇸🇿 Eswatini" },
  { code: "ET", name: "🇪🇹 Ethiopia" },
  { code: "FJ", name: "🇫🇯 Fiji" },
  { code: "FI", name: "🇫🇮 Finland" },
  { code: "FR", name: "🇫🇷 France" },
  { code: "GA", name: "🇬🇦 Gabon" },
  { code: "GM", name: "🇬🇲 Gambia" },
  { code: "GE", name: "🇬🇪 Georgia" },
  { code: "DE", name: "🇩🇪 Germany" },
  { code: "GH", name: "🇬🇭 Ghana" },
  { code: "GR", name: "🇬🇷 Greece" },
  { code: "GD", name: "🇬🇩 Grenada" },
  { code: "GT", name: "🇬🇹 Guatemala" },
  { code: "GN", name: "🇬🇳 Guinea" },
  { code: "GW", name: "🇬🇼 Guinea-Bissau" },
  { code: "GY", name: "🇬🇾 Guyana" },
  { code: "HT", name: "🇭🇹 Haiti" },
  { code: "HN", name: "🇭🇳 Honduras" },
  { code: "HU", name: "🇭🇺 Hungary" },
  { code: "IS", name: "🇮🇸 Iceland" },
  { code: "IN", name: "🇮🇳 India" },
  { code: "ID", name: "🇮🇩 Indonesia" },
  { code: "IR", name: "🇮🇷 Iran" },
  { code: "IQ", name: "🇮🇶 Iraq" },
  { code: "IE", name: "🇮🇪 Ireland" },
  { code: "IL", name: "🇮🇱 Israel" },
  { code: "IT", name: "🇮🇹 Italy" },
  { code: "JM", name: "🇯🇲 Jamaica" },
  { code: "JP", name: "🇯🇵 Japan" },
  { code: "JO", name: "🇯🇴 Jordan" },
  { code: "KZ", name: "🇰🇿 Kazakhstan" },
  { code: "KE", name: "🇰🇪 Kenya" },
  { code: "KI", name: "🇰🇮 Kiribati" },
  { code: "KP", name: "🇰🇵 North Korea" },
  { code: "KR", name: "🇰🇷 South Korea" },
  { code: "XK", name: "🇽🇰 Kosovo" },
  { code: "KW", name: "🇰🇼 Kuwait" },
  { code: "KG", name: "🇰🇬 Kyrgyzstan" },
  { code: "LA", name: "🇱🇦 Laos" },
  { code: "LV", name: "🇱🇻 Latvia" },
  { code: "LB", name: "🇱🇧 Lebanon" },
  { code: "LS", name: "🇱🇸 Lesotho" },
  { code: "LR", name: "🇱🇷 Liberia" },
  { code: "LY", name: "🇱🇾 Libya" },
  { code: "LI", name: "🇱🇮 Liechtenstein" },
  { code: "LT", name: "🇱🇹 Lithuania" },
  { code: "LU", name: "🇱🇺 Luxembourg" },
  { code: "MG", name: "🇲🇬 Madagascar" },
  { code: "MW", name: "🇲🇼 Malawi" },
  { code: "MY", name: "🇲🇾 Malaysia" },
  { code: "MV", name: "🇲🇻 Maldives" },
  { code: "ML", name: "🇲🇱 Mali" },
  { code: "MT", name: "🇲🇹 Malta" },
  { code: "MH", name: "🇲🇭 Marshall Islands" },
  { code: "MR", name: "🇲🇷 Mauritania" },
  { code: "MU", name: "🇲🇺 Mauritius" },
  { code: "MX", name: "🇲🇽 Mexico" },
  { code: "FM", name: "🇫🇲 Micronesia" },
  { code: "MD", name: "🇲🇩 Moldova" },
  { code: "MC", name: "🇲🇨 Monaco" },
  { code: "MN", name: "🇲🇳 Mongolia" },
  { code: "ME", name: "🇲🇪 Montenegro" },
  { code: "MA", name: "🇲🇦 Morocco" },
  { code: "MZ", name: "🇲🇿 Mozambique" },
  { code: "MM", name: "🇲🇲 Myanmar" },
  { code: "NA", name: "🇳🇦 Namibia" },
  { code: "NR", name: "🇳🇷 Nauru" },
  { code: "NP", name: "🇳🇵 Nepal" },
  { code: "NL", name: "🇳🇱 Netherlands" },
  { code: "NZ", name: "🇳🇿 New Zealand" },
  { code: "NI", name: "🇳🇮 Nicaragua" },
  { code: "NE", name: "🇳🇪 Niger" },
  { code: "NG", name: "🇳🇬 Nigeria" },
  { code: "MK", name: "🇲🇰 North Macedonia" },
  { code: "NO", name: "🇳🇴 Norway" },
  { code: "OM", name: "🇴🇲 Oman" },
  { code: "PK", name: "🇵🇰 Pakistan" },
  { code: "PW", name: "🇵🇼 Palau" },
  { code: "PS", name: "🇵🇸 Palestine" },
  { code: "PA", name: "🇵🇦 Panama" },
  { code: "PG", name: "🇵🇬 Papua New Guinea" },
  { code: "PY", name: "🇵🇾 Paraguay" },
  { code: "PE", name: "🇵🇪 Peru" },
  { code: "PH", name: "🇵🇭 Philippines" },
  { code: "PL", name: "🇵🇱 Poland" },
  { code: "PT", name: "🇵🇹 Portugal" },
  { code: "QA", name: "🇶🇦 Qatar" },
  { code: "RO", name: "🇷🇴 Romania" },
  { code: "RU", name: "🇷🇺 Russia" },
  { code: "RW", name: "🇷🇼 Rwanda" },
  { code: "KN", name: "🇰🇳 Saint Kitts and Nevis" },
  { code: "LC", name: "🇱🇨 Saint Lucia" },
  { code: "VC", name: "🇻🇨 Saint Vincent and the Grenadines" },
  { code: "WS", name: "🇼🇸 Samoa" },
  { code: "SM", name: "🇸🇲 San Marino" },
  { code: "ST", name: "🇸🇹 Sao Tome and Principe" },
  { code: "SA", name: "🇸🇦 Saudi Arabia" },
  { code: "SN", name: "🇸🇳 Senegal" },
  { code: "RS", name: "🇷🇸 Serbia" },
  { code: "SC", name: "🇸🇨 Seychelles" },
  { code: "SL", name: "🇸🇱 Sierra Leone" },
  { code: "SG", name: "🇸🇬 Singapore" },
  { code: "SK", name: "🇸🇰 Slovakia" },
  { code: "SI", name: "🇸🇮 Slovenia" },
  { code: "SB", name: "🇸🇧 Solomon Islands" },
  { code: "SO", name: "🇸🇴 Somalia" },
  { code: "ZA", name: "🇿🇦 South Africa" },
  { code: "SS", name: "🇸🇸 South Sudan" },
  { code: "ES", name: "🇪🇸 Spain" },
  { code: "LK", name: "🇱🇰 Sri Lanka" },
  { code: "SD", name: "🇸🇩 Sudan" },
  { code: "SR", name: "🇸🇷 Suriname" },
  { code: "SE", name: "🇸🇪 Sweden" },
  { code: "CH", name: "🇨🇭 Switzerland" },
  { code: "SY", name: "🇸🇾 Syria" },
  { code: "TW", name: "🇹🇼 Taiwan" },
  { code: "TJ", name: "🇹🇯 Tajikistan" },
  { code: "TZ", name: "🇹🇿 Tanzania" },
  { code: "TH", name: "🇹🇭 Thailand" },
  { code: "TL", name: "🇹🇱 Timor-Leste" },
  { code: "TG", name: "🇹🇬 Togo" },
  { code: "TO", name: "🇹🇴 Tonga" },
  { code: "TT", name: "🇹🇹 Trinidad and Tobago" },
  { code: "TN", name: "🇹🇳 Tunisia" },
  { code: "TR", name: "🇹🇷 Turkey" },
  { code: "TM", name: "🇹🇲 Turkmenistan" },
  { code: "TV", name: "🇹🇻 Tuvalu" },
  { code: "UG", name: "🇺🇬 Uganda" },
  { code: "UA", name: "🇺🇦 Ukraine" },
  { code: "AE", name: "🇦🇪 United Arab Emirates" },
  { code: "GB", name: "🇬🇧 United Kingdom" },
  { code: "US", name: "🇺🇸 United States" },
  { code: "UY", name: "🇺🇾 Uruguay" },
  { code: "UZ", name: "🇺🇿 Uzbekistan" },
  { code: "VU", name: "🇻🇺 Vanuatu" },
  { code: "VA", name: "🇻🇦 Vatican City" },
  { code: "VE", name: "🇻🇪 Venezuela" },
  { code: "VN", name: "🇻🇳 Vietnam" },
  { code: "YE", name: "🇾🇪 Yemen" },
  { code: "ZM", name: "🇿🇲 Zambia" },
  { code: "ZW", name: "🇿🇼 Zimbabwe" },
];

// ─── Blog Types ──────────────────────────────────────────────────────────────

export type BlogCategory =
  | "Debt"
  | "Landlord"
  | "Employment"
  | "Refund"
  | "PropertyDamage"
  | "CeaseDesist"
  | "Insurance"
  | "Contractor";

export interface BlogArticle {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string; // Full HTML content
  category: BlogCategory;
  author: string;
  publishedAt: bigint; // nanoseconds timestamp
  wordCount: number;
  coverImageUrl?: string;
}

export interface CreateArticleInput {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: BlogCategory;
  author: string;
  coverImageUrl?: string;
}

export interface UpdateArticleInput {
  title?: string;
  excerpt?: string;
  content?: string;
  category?: BlogCategory;
  author?: string;
  coverImageUrl?: string;
}

export const BLOG_CATEGORY_CONFIG: Record<
  BlogCategory,
  {
    label: string;
    color: string;
    bgClass: string;
    textClass: string;
    borderClass: string;
  }
> = {
  Debt: {
    label: "Debt Recovery",
    color: "blue",
    bgClass: "bg-blue-500/15",
    textClass: "text-blue-400",
    borderClass: "border-blue-500/30",
  },
  Landlord: {
    label: "Landlord / Tenant",
    color: "green",
    bgClass: "bg-green-500/15",
    textClass: "text-green-400",
    borderClass: "border-green-500/30",
  },
  Employment: {
    label: "Employment",
    color: "orange",
    bgClass: "bg-orange-500/15",
    textClass: "text-orange-400",
    borderClass: "border-orange-500/30",
  },
  Refund: {
    label: "Refund & Consumer",
    color: "purple",
    bgClass: "bg-purple-500/15",
    textClass: "text-purple-400",
    borderClass: "border-purple-500/30",
  },
  PropertyDamage: {
    label: "Property Damage",
    color: "red",
    bgClass: "bg-red-500/15",
    textClass: "text-red-400",
    borderClass: "border-red-500/30",
  },
  CeaseDesist: {
    label: "Cease & Desist",
    color: "yellow",
    bgClass: "bg-yellow-500/15",
    textClass: "text-yellow-400",
    borderClass: "border-yellow-500/30",
  },
  Insurance: {
    label: "Insurance Claim",
    color: "cyan",
    bgClass: "bg-cyan-500/15",
    textClass: "text-cyan-400",
    borderClass: "border-cyan-500/30",
  },
  Contractor: {
    label: "Contractor Dispute",
    color: "pink",
    bgClass: "bg-pink-500/15",
    textClass: "text-pink-400",
    borderClass: "border-pink-500/30",
  },
};

// ─── Country Law Database ─────────────────────────────────────────────────────
// Key statutes per country per letter type — cited in generated letters

export type CountryLawEntry = {
  DebtRecovery?: string[];
  LandlordTenant?: string[];
  RefundConsumer?: string[];
  PropertyDamage?: string[];
  CeaseDesist?: string[];
  EmploymentDispute?: string[];
  InsuranceClaim?: string[];
  ContractorDispute?: string[];
  CreditReportDispute?: string[];
};

export const COUNTRY_LAWS: Record<string, CountryLawEntry> = {
  US: {
    DebtRecovery: [
      "Fair Debt Collection Practices Act (15 U.S.C. § 1692)",
      "Uniform Commercial Code § 3-301 (Negotiable Instruments)",
    ],
    LandlordTenant: [
      "Residential Landlord-Tenant Act (applicable state statute)",
      "Fair Housing Act (42 U.S.C. § 3604)",
    ],
    RefundConsumer: [
      "Federal Trade Commission Act § 5 (Unfair or Deceptive Acts)",
      "Magnuson-Moss Warranty Act (15 U.S.C. § 2301)",
    ],
    PropertyDamage: [
      "Restatement (Second) of Torts § 925 (Damages for Property)",
      "UCC § 2-714 (Buyer's Damages for Breach in Accepted Goods)",
    ],
    CeaseDesist: [
      "Lanham Act (15 U.S.C. § 1125) — Trademark/Trade Dress",
      "Communications Decency Act § 230",
    ],
    EmploymentDispute: [
      "Title VII of the Civil Rights Act (42 U.S.C. § 2000e)",
      "Fair Labor Standards Act (29 U.S.C. § 201)",
    ],
    InsuranceClaim: [
      "Insurance Bad Faith Doctrine (common law)",
      "State Unfair Insurance Practices Act",
    ],
    ContractorDispute: [
      "Restatement (Second) of Contracts § 241 (Material Breach)",
      "UCC § 2-601 (Buyer's Rights on Improper Delivery)",
    ],
    CreditReportDispute: [
      "Fair Credit Reporting Act (15 U.S.C. § 1681) — Accuracy of consumer reports",
      "Fair Credit Reporting Act § 611 (15 U.S.C. § 1681i) — Procedure in case of disputed accuracy",
    ],
  },
  GB: {
    DebtRecovery: [
      "Late Payment of Commercial Debts (Interest) Act 1998",
      "Limitation Act 1980 § 5 (Six-year limitation for contract debts)",
    ],
    LandlordTenant: [
      "Housing Act 2004 (Tenancy Deposit Scheme)",
      "Landlord and Tenant Act 1985 § 11 (Repairing obligations)",
    ],
    RefundConsumer: [
      "Consumer Rights Act 2015 § 19–24 (Rights to repair, replacement, refund)",
      "Consumer Protection from Unfair Trading Regulations 2008",
    ],
    PropertyDamage: [
      "Torts (Interference with Goods) Act 1977",
      "Occupiers' Liability Act 1957",
    ],
    CeaseDesist: ["Trade Marks Act 1994 § 10", "Defamation Act 2013 § 1–4"],
    EmploymentDispute: [
      "Employment Rights Act 1996 (Unfair Dismissal, § 94)",
      "Equality Act 2010 (Protected Characteristics)",
    ],
    InsuranceClaim: [
      "Insurance Act 2015 (Duty of Fair Presentation)",
      "Financial Services and Markets Act 2000",
    ],
    ContractorDispute: [
      "Construction Act (Housing Grants, Construction and Regeneration Act 1996)",
      "Supply of Goods and Services Act 1982 § 13 (Reasonable Care and Skill)",
    ],
  },
  AU: {
    DebtRecovery: [
      "Australian Consumer Law (Sch. 2, Competition and Consumer Act 2010)",
      "Limitation Act 1969 (NSW) / applicable state Act — 6-year limit",
    ],
    LandlordTenant: [
      "Residential Tenancies Act 2010 (NSW) / applicable state Act",
      "Retail Leases Act 2003 (commercial)",
    ],
    RefundConsumer: [
      "Australian Consumer Law §§ 54–56 (Consumer Guarantees — Acceptable Quality)",
      "ACL § 18 (Misleading or Deceptive Conduct)",
    ],
    PropertyDamage: [
      "Civil Liability Act 2002 (NSW) / applicable state Act",
      "Torts Act 1972 (SA)",
    ],
    CeaseDesist: [
      "Trade Marks Act 1995 § 120 (Infringement)",
      "ACL § 18 (Misleading conduct)",
    ],
    EmploymentDispute: [
      "Fair Work Act 2009 § 382 (Unfair Dismissal)",
      "National Employment Standards (NES) — Fair Work Act 2009 Part 2-2",
    ],
    InsuranceClaim: [
      "Insurance Contracts Act 1984 § 13 (Duty of Utmost Good Faith)",
      "Australian Securities and Investments Commission Act 2001",
    ],
    ContractorDispute: [
      "Home Building Act 1989 (NSW) / applicable state Act",
      "Australian Consumer Law § 60 (Guarantee as to Due Care and Skill)",
    ],
  },
  CA: {
    DebtRecovery: [
      "Limitation Act, S.C. 2002 (2-year basic limitation)",
      "Interest Act (R.S.C., 1985, c. I-15)",
    ],
    LandlordTenant: [
      "Residential Tenancies Act, 2006 (Ontario) / applicable provincial Act",
      "Canada Mortgage and Housing Corporation guidelines",
    ],
    RefundConsumer: [
      "Consumer Protection Act, 2002 (Ontario) § 14 (Unfair Practices)",
      "Competition Act (R.S.C., 1985, c. C-34) § 74.01",
    ],
    PropertyDamage: [
      "Civil Code of Québec art. 1457 (Extracontractual Liability)",
      "Tort Law — negligence principles (common law provinces)",
    ],
    CeaseDesist: [
      "Trade-marks Act (R.S.C., 1985, c. T-13) § 20",
      "Copyright Act (R.S.C., 1985, c. C-42) § 27",
    ],
    EmploymentDispute: [
      "Canada Labour Code (R.S.C., 1985, c. L-2) § 240 (Unjust Dismissal)",
      "Canadian Human Rights Act (R.S.C., 1985, c. H-6)",
    ],
    InsuranceClaim: [
      "Insurance Companies Act (S.C. 1991, c. 47)",
      "Provincial Insurance Acts (e.g., Insurance Act, R.S.O. 1990, c. I.8)",
    ],
    ContractorDispute: [
      "Construction Act, R.S.O. 1990, c. C.30 (Ontario) / applicable provincial Act",
      "Builders Lien Act (applicable province)",
    ],
  },
  IN: {
    DebtRecovery: [
      "Recovery of Debts and Bankruptcy Act, 1993",
      "Negotiable Instruments Act, 1881 § 138 (Dishonour of Cheque)",
    ],
    LandlordTenant: [
      "Transfer of Property Act, 1882 (Tenancy provisions)",
      "Model Tenancy Act, 2021",
    ],
    RefundConsumer: [
      "Consumer Protection Act, 2019 § 2(7) (Consumer Rights)",
      "Consumer Protection (E-Commerce) Rules, 2020",
    ],
    PropertyDamage: [
      "Law of Torts — Donoghue v Stevenson principles (Indian courts apply)",
      "Code of Civil Procedure, 1908 § 9 (Civil suits for damages)",
    ],
    CeaseDesist: [
      "Trade Marks Act, 1999 § 29 (Infringement)",
      "Information Technology Act, 2000 § 66A (Online harassment)",
    ],
    EmploymentDispute: [
      "Industrial Disputes Act, 1947 (Retrenchment/Termination)",
      "Payment of Wages Act, 1936 § 15 (Unpaid wages)",
    ],
    InsuranceClaim: [
      "Insurance Act, 1938 § 45 (Policy cannot be repudiated after 3 years)",
      "IRDA Regulations, 2002 (Insurance Ombudsman)",
    ],
    ContractorDispute: [
      "Indian Contract Act, 1872 § 73 (Compensation for breach)",
      "Arbitration and Conciliation Act, 1996 (Dispute resolution)",
    ],
  },
  DE: {
    DebtRecovery: [
      "Bürgerliches Gesetzbuch (BGB) § 286 (Verzug/Default)",
      "Zivilprozessordnung (ZPO) §§ 688–703 (Mahnverfahren/Dunning procedure)",
    ],
    LandlordTenant: [
      "BGB §§ 535–580a (Mietrecht/Tenancy Law)",
      "Betriebskostenverordnung (BetrKV) — Service Charges Regulation",
    ],
    RefundConsumer: [
      "BGB §§ 474–479 (Verbrauchsgüterkauf/Consumer Sales)",
      "Gesetz gegen den unlauteren Wettbewerb (UWG) § 3",
    ],
    PropertyDamage: [
      "BGB § 823 (Schadensersatzpflicht/Duty to pay damages)",
      "BGB § 249 (Art und Umfang des Schadensersatzes)",
    ],
    CeaseDesist: [
      "Markengesetz (MarkenG) § 14 (Trademark infringement)",
      "UWG § 8 (Abmahnung/Cease and desist notice)",
    ],
    EmploymentDispute: [
      "Kündigungsschutzgesetz (KSchG) § 1 (Unfair dismissal protection)",
      "Allgemeines Gleichbehandlungsgesetz (AGG) § 7 (Anti-discrimination)",
    ],
    InsuranceClaim: [
      "Versicherungsvertragsgesetz (VVG) § 28 (Policy obligations)",
      "VVG § 86 (Subrogation rights)",
    ],
    ContractorDispute: [
      "BGB §§ 631–651 (Werkvertragsrecht/Contract for Work)",
      "Vergabe- und Vertragsordnung für Bauleistungen (VOB/B)",
    ],
  },
  FR: {
    DebtRecovery: [
      "Code civil art. 1231-1 (Dommages et intérêts pour inexécution)",
      "Code de procédure civile art. 1405 (Injonction de payer)",
    ],
    LandlordTenant: [
      "Loi n° 89-462 du 6 juillet 1989 (Bail d'habitation)",
      "Loi ALUR 2014 (Encadrement des loyers)",
    ],
    RefundConsumer: [
      "Code de la consommation art. L.217-4 (Conformité des biens)",
      "Code civil art. 1641 (Garantie des vices cachés)",
    ],
    PropertyDamage: [
      "Code civil art. 1382 (Responsabilité délictuelle)",
      "Code civil art. 1386-1 (Responsabilité du fait des produits défectueux)",
    ],
    CeaseDesist: [
      "Code de la propriété intellectuelle art. L.713-2 (Contrefaçon de marque)",
      "Code civil art. 1382 (Action en concurrence déloyale)",
    ],
    EmploymentDispute: [
      "Code du travail art. L.1232-1 (Licenciement pour cause réelle et sérieuse)",
      "Code du travail art. L.3141-1 (Congés payés)",
    ],
    InsuranceClaim: [
      "Code des assurances art. L.113-5 (Obligations de l'assureur)",
      "Code des assurances art. L.122-1 (Garantie)",
    ],
    ContractorDispute: [
      "Code civil art. 1792 (Garantie décennale des constructeurs)",
      "Code civil art. 1792-6 (Réception de l'ouvrage)",
    ],
  },
  JP: {
    DebtRecovery: [
      "民法 (Civil Code) § 415 (Liability for Non-Performance)",
      "民事執行法 (Civil Execution Act) § 43 (Enforcement Procedures)",
    ],
    LandlordTenant: [
      "借地借家法 (Act on Land and Building Leases) § 26–28",
      "民法 § 601 (Lease Contract)",
    ],
    RefundConsumer: [
      "消費者契約法 (Consumer Contract Act) § 4–9",
      "特定商取引法 (Act on Specified Commercial Transactions) § 9",
    ],
    PropertyDamage: [
      "民法 § 709 (Tortious Act — Damages)",
      "民法 § 717 (Liability of Possessor of Structure)",
    ],
    CeaseDesist: [
      "商標法 (Trademark Act) § 36 (Right to Demand Injunction)",
      "不正競争防止法 (Unfair Competition Prevention Act) § 3",
    ],
    EmploymentDispute: [
      "労働基準法 (Labor Standards Act) § 20 (Notice of Dismissal)",
      "労働契約法 (Labor Contract Act) § 16 (Abusive Dismissal)",
    ],
    InsuranceClaim: [
      "保険法 (Insurance Act) § 17 (Insurer's Obligations)",
      "保険業法 (Insurance Business Act) § 100",
    ],
    ContractorDispute: [
      "建設業法 (Construction Business Act) § 19",
      "民法 § 634 (Contractor's Warranty for Defects in Work)",
    ],
  },
  ZA: {
    DebtRecovery: [
      "Prescription Act 68 of 1969 (3-year prescription for debts)",
      "Magistrates' Courts Act 32 of 1944 (debt collection proceedings)",
    ],
    LandlordTenant: [
      "Rental Housing Act 50 of 1999",
      "Prevention of Illegal Eviction from and Unlawful Occupation of Land Act 19 of 1998",
    ],
    RefundConsumer: [
      "Consumer Protection Act 68 of 2008 § 56 (Implied warranty of quality)",
      "Electronic Communications and Transactions Act 25 of 2002",
    ],
    PropertyDamage: [
      "Aquilian Action (Delictual liability for property damage)",
      "Apportionment of Damages Act 34 of 1956",
    ],
    CeaseDesist: [
      "Trade Marks Act 194 of 1993 § 34 (Infringement)",
      "Consumer Protection Act § 41 (False, misleading or deceptive representations)",
    ],
    EmploymentDispute: [
      "Labour Relations Act 66 of 1995 § 185 (Right not to be unfairly dismissed)",
      "Basic Conditions of Employment Act 75 of 1997",
    ],
    InsuranceClaim: [
      "Short-term Insurance Act 53 of 1998",
      "Long-term Insurance Act 52 of 1998",
    ],
    ContractorDispute: [
      "Housing Consumer Protection Measures Act 95 of 1998",
      "Construction Industry Development Board Act 38 of 2000",
    ],
  },
  NG: {
    DebtRecovery: [
      "Limitation Law Cap L67, Laws of Lagos State 2015 (6-year limit)",
      "Recovery of Premises Act Cap R4 LFN 2004",
    ],
    LandlordTenant: [
      "Recovery of Premises Act Cap R4 LFN 2004",
      "Tenancy Law of Lagos State 2011",
    ],
    RefundConsumer: [
      "Federal Competition and Consumer Protection Act, 2018 § 114",
      "Consumer Protection Council Act Cap C25 LFN 2004",
    ],
    PropertyDamage: [
      "Torts Law (common law principles as received in Nigeria)",
      "Limitation Law — 6-year limitation for tort claims",
    ],
    CeaseDesist: [
      "Trademarks Act Cap T13 LFN 2004 § 5",
      "Copyright Act Cap C28 LFN 2004 § 15",
    ],
    EmploymentDispute: [
      "Labour Act Cap L1 LFN 2004 § 9 (Termination Notice)",
      "Trade Disputes Act Cap T8 LFN 2004",
    ],
    InsuranceClaim: [
      "Insurance Act Cap I17 LFN 2004",
      "National Insurance Commission Act Cap N53 LFN 2004",
    ],
    ContractorDispute: [
      "Indian Contract Act (applicable via received English law)",
      "Public Procurement Act 2007 (Federal contracts)",
    ],
  },
  SG: {
    DebtRecovery: [
      "Limitation Act (Cap. 163) § 6 (6-year limitation for contract debts)",
      "Small Claims Tribunals Act (Cap. 308) (for smaller claims)",
    ],
    LandlordTenant: [
      "Conveyancing and Law of Property Act (Cap. 61)",
      "Residential Tenancies Act 2022",
    ],
    RefundConsumer: [
      "Consumer Protection (Fair Trading) Act (Cap. 52A)",
      "Sale of Goods Act (Cap. 393) § 14 (Implied Terms)",
    ],
    PropertyDamage: [
      "Civil Law Act (Cap. 43) § 2",
      "Occupiers' Liability Act (Cap. 217)",
    ],
    CeaseDesist: [
      "Trade Marks Act (Cap. 332) § 27",
      "Copyright Act 2021 § 120",
    ],
    EmploymentDispute: [
      "Employment Act (Cap. 91) § 14 (Dismissal without notice)",
      "Employment Claims Act 2016",
    ],
    InsuranceClaim: [
      "Insurance Act (Cap. 142) § 52",
      "MAS Notice 126 (Claims handling)",
    ],
    ContractorDispute: [
      "Building and Construction Industry Security of Payment Act (Cap. 30B)",
      "Contractors' All Risks Policy — standard form conditions",
    ],
  },
  AE: {
    DebtRecovery: [
      "UAE Civil Transactions Law (Federal Law No. 5 of 1985) Art. 472",
      "Commercial Transactions Law (Federal Law No. 18 of 1993) Art. 95",
    ],
    LandlordTenant: [
      "Dubai Rental Law (Law No. 26 of 2007, as amended by Law No. 33 of 2008)",
      "Abu Dhabi Law No. 20 of 2006 (Tenancy Relations)",
    ],
    RefundConsumer: [
      "UAE Consumer Protection Law (Federal Law No. 15 of 2020)",
      "E-Commerce Law (Federal Decree-Law No. 14 of 2023)",
    ],
    PropertyDamage: [
      "UAE Civil Transactions Law Art. 282 (Tortious Liability)",
      "UAE Civil Transactions Law Art. 317 (Compensation for Damage)",
    ],
    CeaseDesist: [
      "Federal Law No. 37 of 1992 on Trademarks (as amended)",
      "Federal Law No. 7 of 2002 on Copyrights and Related Rights",
    ],
    EmploymentDispute: [
      "UAE Labour Law (Federal Decree-Law No. 33 of 2021) Art. 42",
      "Cabinet Resolution No. 1 of 2022 (New Labour Law implementing regulations)",
    ],
    InsuranceClaim: [
      "UAE Insurance Law (Federal Law No. 6 of 2007)",
      "Insurance Authority Board of Directors Resolution No. 25 of 2016",
    ],
    ContractorDispute: [
      "UAE Civil Transactions Law Art. 872 (Muqawala — Construction Contract)",
      "FIDIC Conditions of Contract (widely adopted in UAE construction)",
    ],
  },
  BR: {
    DebtRecovery: [
      "Código Civil Brasileiro art. 394 (Inadimplemento das obrigações)",
      "Lei n. 9.492/1997 (Lei de Protestos de Títulos)",
    ],
    LandlordTenant: [
      "Lei do Inquilinato (Lei n. 8.245/1991)",
      "Código Civil art. 565–578 (Locação de coisas)",
    ],
    RefundConsumer: [
      "Código de Defesa do Consumidor (Lei n. 8.078/1990) art. 18–20",
      "CDC art. 49 (Direito de arrependimento — 7 dias)",
    ],
    PropertyDamage: [
      "Código Civil art. 186 e 927 (Ato ilícito e responsabilidade civil)",
      "Código Civil art. 944 (Indenização — extensão do dano)",
    ],
    CeaseDesist: [
      "Lei de Propriedade Industrial (Lei n. 9.279/1996) art. 130",
      "Lei de Direitos Autorais (Lei n. 9.610/1998) art. 102",
    ],
    EmploymentDispute: [
      "Consolidação das Leis do Trabalho (CLT) art. 482–483",
      "Lei n. 9.029/1995 (Discriminação no trabalho)",
    ],
    InsuranceClaim: [
      "Código Civil art. 757–802 (Contrato de Seguro)",
      "Resolução CNSP n. 382/2020 (Regulamento de Seguros)",
    ],
    ContractorDispute: [
      "Código Civil art. 610–626 (Contrato de Empreitada)",
      "Lei n. 8.666/1993 (Contratos administrativos)",
    ],
  },
  MX: {
    DebtRecovery: [
      "Código Civil Federal art. 2189 (Pago de lo indebido)",
      "Código de Comercio art. 1049 (Juicio mercantil ejecutivo)",
    ],
    LandlordTenant: [
      "Código Civil Federal art. 2398–2496 (Arrendamiento)",
      "Ley Federal de Protección al Consumidor art. 7",
    ],
    RefundConsumer: [
      "Ley Federal de Protección al Consumidor (LFPC) art. 92",
      "NOM-070-SCFI-2016 (Prácticas comerciales)",
    ],
    PropertyDamage: [
      "Código Civil Federal art. 1910 (Responsabilidad civil extracontractual)",
      "Código Civil Federal art. 2107–2109 (Daños y perjuicios)",
    ],
    CeaseDesist: [
      "Ley Federal de Protección a la Propiedad Industrial art. 189",
      "Ley Federal del Derecho de Autor art. 27",
    ],
    EmploymentDispute: [
      "Ley Federal del Trabajo art. 47–51 (Rescisión de la relación de trabajo)",
      "Ley Federal del Trabajo art. 123 (Derechos laborales fundamentales)",
    ],
    InsuranceClaim: [
      "Ley sobre el Contrato de Seguro art. 39–70",
      "Ley de Instituciones de Seguros y de Fianzas",
    ],
    ContractorDispute: [
      "Código Civil Federal art. 2616–2647 (Contrato de obra)",
      "Ley de Obras Públicas y Servicios Relacionados con las Mismas",
    ],
  },
  NZ: {
    DebtRecovery: [
      "Limitation Act 2010 § 11 (6-year limitation for contract debts)",
      "Disputes Tribunal Act 1988 (for smaller claims up to NZD 30,000)",
    ],
    LandlordTenant: ["Residential Tenancies Act 1986", "Unit Titles Act 2010"],
    RefundConsumer: [
      "Consumer Guarantees Act 1993 § 7–12 (Guarantee as to acceptable quality)",
      "Fair Trading Act 1986 § 9 (Misleading and deceptive conduct)",
    ],
    PropertyDamage: [
      "Torts Act (common law negligence principles)",
      "Accident Compensation Act 2001 (for personal injury — may limit tort claims)",
    ],
    CeaseDesist: [
      "Trade Marks Act 2002 § 89 (Infringement)",
      "Copyright Act 1994 § 120",
    ],
    EmploymentDispute: [
      "Employment Relations Act 2000 § 103 (Unjustified dismissal)",
      "Minimum Wage Act 1983",
    ],
    InsuranceClaim: [
      "Insurance Law Reform Act 1977",
      "Insurance Contracts Act 1984 (general principles)",
    ],
    ContractorDispute: [
      "Construction Contracts Act 2002",
      "Building Act 2004 § 362I (Building disputes)",
    ],
  },
  IE: {
    DebtRecovery: [
      "Statute of Limitations 1957 § 11 (6-year limit for contract debts)",
      "European Communities (Late Payment in Commercial Transactions) Regulations 2012",
    ],
    LandlordTenant: [
      "Residential Tenancies Act 2004 (as amended 2022)",
      "Landlord and Tenant (Amendment) Act 1994",
    ],
    RefundConsumer: [
      "Consumer Rights Act 2022 § 24–30 (Goods and Digital Content)",
      "European Union (Consumer Information, Cancellation and Other Rights) Regulations 2013",
    ],
    PropertyDamage: [
      "Civil Liability Act 1961",
      "Occupiers' Liability Act 1995",
    ],
    CeaseDesist: [
      "Trade Marks Act 1996 § 14",
      "Copyright and Related Rights Act 2000 § 37",
    ],
    EmploymentDispute: [
      "Unfair Dismissals Act 1977 (as amended)",
      "Employment Equality Act 1998 (as amended)",
    ],
    InsuranceClaim: [
      "Insurance Act 1936 (as amended)",
      "Central Bank (Supervision and Enforcement) Act 2013",
    ],
    ContractorDispute: [
      "Construction Contracts Act 2013",
      "Building Control Regulations 1997 (as amended)",
    ],
  },
};

// Helper: get country-specific laws for a given country code and letter type
export function getCountryLaws(
  countryCode: string,
  letterType: LetterType,
): string[] {
  const entry = COUNTRY_LAWS[countryCode];
  if (!entry) return [];
  return entry[letterType] ?? [];
}
