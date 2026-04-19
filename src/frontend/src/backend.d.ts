import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Timestamp = bigint;
export interface TransformationOutput {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export type Result_2 = {
    __kind__: "ok";
    ok: GeneratedLetter;
} | {
    __kind__: "err";
    err: string;
};
export interface BlogArticle {
    id: string;
    title: string;
    content: string;
    isPublished: boolean;
    slug: string;
    authorName: string;
    publishedAt: bigint;
    updatedAt: bigint;
    excerpt: string;
    category: BlogCategory;
}
export interface GeneratedLetter {
    id: LetterId;
    status: LetterStatus;
    userId: UserId;
    createdAt: Timestamp;
    formData: LetterFormData;
    letterContent: string;
    originalLetterId?: LetterId;
    downloadCount: bigint;
    lastDownloadAt?: bigint;
    isFollowUp: boolean;
}
export type Result_1 = {
    __kind__: "ok";
    ok: null;
} | {
    __kind__: "err";
    err: string;
};
export interface CreateArticleInput {
    title: string;
    content: string;
    isPublished: boolean;
    slug: string;
    authorName: string;
    excerpt: string;
    category: BlogCategory;
}
export type Result_4 = {
    __kind__: "ok";
    ok: string;
} | {
    __kind__: "err";
    err: string;
};
export interface LetterFormData {
    inaccuracyType?: string;
    senderPhone: string;
    deadlineDays: bigint;
    tone: LetterTone;
    disputeDescription: string;
    letterType: LetterType;
    creditSupportingDocs?: Array<string>;
    creditDisputeDescription?: string;
    evidenceItems: Array<string>;
    amountDemanded?: bigint;
    evidenceImages: Array<string>;
    jurisdiction: string;
    accountName?: string;
    currency: string;
    preferredResolution: string;
    senderName: string;
    accountNumber?: string;
    senderEmail: string;
    recipientAddress: Address;
    recipientName: string;
    recipientRole: string;
    priorContact: PriorContact;
    senderAddress: Address;
    incidentDate: string;
    creditBureauName?: string;
}
export interface UpdateArticleInput {
    title?: string;
    content?: string;
    isPublished?: boolean;
    authorName?: string;
    excerpt?: string;
    category?: BlogCategory;
}
export interface TransformationInput {
    context: Uint8Array;
    response: http_request_result;
}
export type StripeSessionStatus = {
    __kind__: "completed";
    completed: {
        userPrincipal?: string;
        response: string;
    };
} | {
    __kind__: "failed";
    failed: {
        error: string;
    };
};
export interface StripeConfiguration {
    allowedCountries: Array<string>;
    secretKey: string;
}
export interface PartnershipRequest {
    id: string;
    status: string;
    name: string;
    createdAt: Timestamp;
    email: string;
    company: string;
    message: string;
    preferredDate: string;
    preferredTime: string;
}
export interface GmailToken {
    expiresAt: Timestamp;
    refreshToken: string;
    accessToken: string;
}
export interface http_header {
    value: string;
    name: string;
}
export interface http_request_result {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export type UserId = string;
export interface CreatePartnershipRequestInput {
    name: string;
    email: string;
    company: string;
    message: string;
    preferredDate: string;
    preferredTime: string;
}
export interface ShoppingItem {
    productName: string;
    currency: string;
    quantity: bigint;
    priceInCents: bigint;
    productDescription: string;
}
export type Result_3 = {
    __kind__: "ok";
    ok: StrengthAnalysis;
} | {
    __kind__: "err";
    err: string;
};
export interface StrengthAnalysis {
    responseLikelihood: ResponseLikelihood;
    strengths: Array<string>;
    improvements: Array<string>;
    score: bigint;
}
export type Result = {
    __kind__: "ok";
    ok: boolean;
} | {
    __kind__: "err";
    err: string;
};
export interface PriorContact {
    method: string;
    attempted: boolean;
    count: bigint;
}
export type LetterId = string;
export interface UserProfile {
    stripeSubscriptionId?: string;
    userId: UserId;
    createdAt: Timestamp;
    plan: UserPlan;
    email?: string;
    lettersThisMonth: bigint;
    stripeCustomerId?: string;
    totalLetters: bigint;
    currentMonthYear: string;
}
export interface Address {
    zip: string;
    street: string;
    city: string;
    state: string;
}
export enum BlogCategory {
    Insurance = "Insurance",
    Debt = "Debt",
    Refund = "Refund",
    CeaseDesist = "CeaseDesist",
    PropertyDamage = "PropertyDamage",
    Employment = "Employment",
    Landlord = "Landlord",
    Contractor = "Contractor"
}
export enum LetterStatus {
    Sent = "Sent",
    Draft = "Draft",
    ResponseReceived = "ResponseReceived",
    FollowUpNeeded = "FollowUpNeeded",
    Resolved = "Resolved"
}
export enum LetterTone {
    Firm = "Firm",
    Assertive = "Assertive",
    FinalWarning = "FinalWarning"
}
export enum LetterType {
    DebtRecovery = "DebtRecovery",
    LandlordTenant = "LandlordTenant",
    CeaseDesist = "CeaseDesist",
    ContractorDispute = "ContractorDispute",
    InsuranceClaim = "InsuranceClaim",
    PropertyDamage = "PropertyDamage",
    RefundConsumer = "RefundConsumer",
    EmploymentDispute = "EmploymentDispute",
    CreditReportDispute = "CreditReportDispute"
}
export enum ResponseLikelihood {
    Low = "Low",
    High = "High",
    Medium = "Medium"
}
export enum StripePlan {
    Pro = "Pro",
    Business = "Business"
}
export enum UserPlan {
    Pro = "Pro",
    PayPerLetter = "PayPerLetter",
    Free = "Free",
    Business = "Business"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    answerQuestion(question: string, letterId: LetterId): Promise<Result_4>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    canGenerateLetter(): Promise<{
        canGenerate: boolean;
        remaining: bigint;
        reason: string;
    }>;
    createArticle(input: CreateArticleInput): Promise<{
        __kind__: "ok";
        ok: BlogArticle;
    } | {
        __kind__: "err";
        err: string;
    }>;
    /**
     * / Create a Stripe Checkout session for a pay-per-letter or plan upgrade.
     * / Returns Stripe session JSON (contains `url` to redirect the user).
     */
    createCheckoutSession(items: Array<ShoppingItem>, successUrl: string, cancelUrl: string): Promise<string>;
    createOrUpdateUser(email: string | null): Promise<UserProfile>;
    deleteLetterForUser(id: LetterId): Promise<Result>;
    generateFollowUpLetter(originalLetterId: LetterId): Promise<Result_4>;
    generateLetterStream(formData: LetterFormData, country: string | null): Promise<Result_4>;
    generateStrengthAnalysis(letterId: LetterId): Promise<Result_3>;
    getAdminStats(): Promise<{
        totalLetters: bigint;
        totalUsers: bigint;
        activeSubscriptions: bigint;
    }>;
    getArticleBySlug(slug: string): Promise<BlogArticle | null>;
    getAuditLog(): Promise<Array<[Timestamp, string, string, string]>>;
    getCallerUserRole(): Promise<UserRole>;
    getGmailToken(): Promise<GmailToken | null>;
    getLetter(id: LetterId): Promise<GeneratedLetter | null>;
    /**
     * / Check payment status for a given Stripe session ID.
     */
    getStripeSessionStatus(sessionId: string): Promise<StripeSessionStatus>;
    getUserLetters(): Promise<Array<GeneratedLetter>>;
    getUserProfile(): Promise<UserProfile | null>;
    isAnthropicConfigured(): Promise<boolean>;
    isCallerAdmin(): Promise<boolean>;
    /**
     * / Check whether Stripe has been configured.
     */
    isStripeConfigured(): Promise<boolean>;
    listArticles(categoryFilter: string | null): Promise<Array<BlogArticle>>;
    listPartnershipRequests(): Promise<Array<PartnershipRequest>>;
    recordDownload(id: LetterId): Promise<Result>;
    saveLetter(formData: LetterFormData, letterContent: string): Promise<Result_2>;
    sendLetterViaGmail(recipientEmail: string, letterContent: string, subject: string): Promise<Result_1>;
    setAnthropicKey(key: string): Promise<void>;
    /**
     * / Store the Stripe secret key and allowed countries (admin only).
     */
    setStripeConfiguration(config: StripeConfiguration): Promise<void>;
    storeGmailToken(accessToken: string, refreshToken: string, expiresAt: bigint): Promise<Result_1>;
    submitPartnershipRequest(input: CreatePartnershipRequestInput): Promise<{
        __kind__: "ok";
        ok: PartnershipRequest;
    } | {
        __kind__: "err";
        err: string;
    }>;
    transform(input: TransformationInput): Promise<TransformationOutput>;
    updateArticle(id: string, updates: UpdateArticleInput): Promise<{
        __kind__: "ok";
        ok: BlogArticle;
    } | {
        __kind__: "err";
        err: string;
    }>;
    updateLetterStatus(id: LetterId, status: LetterStatus): Promise<Result>;
    updateUserPlan(userId: UserId, plan: StripePlan): Promise<Result>;
}
