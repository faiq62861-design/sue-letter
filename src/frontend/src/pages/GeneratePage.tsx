import { Button } from "@/components/ui/button";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Copy,
  Download,
  Eye,
  EyeOff,
  Lock,
  Mail,
  RefreshCw,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type {
  Address,
  LetterFormData as BackendLetterFormData,
  LetterTone as BackendLetterTone,
  LetterType as BackendLetterType,
  PriorContact,
} from "../backend.d.ts";
import { DisclaimerBanner } from "../components/DisclaimerBanner";
import { EditBeforeDownloadModal } from "../components/EditBeforeDownloadModal";
import { CreditDisputeStep } from "../components/FormSteps/CreditDisputeStep";
import { DisputeStep } from "../components/FormSteps/DisputeStep";
import { EvidenceStep } from "../components/FormSteps/EvidenceStep";
import { JurisdictionStep } from "../components/FormSteps/JurisdictionStep";
import { PriorContactStep } from "../components/FormSteps/PriorContactStep";
import { RecipientStep } from "../components/FormSteps/RecipientStep";
import { ResolutionStep } from "../components/FormSteps/ResolutionStep";
import { SenderStep } from "../components/FormSteps/SenderStep";
import { ToneStep } from "../components/FormSteps/ToneStep";
import { GmailSendModal } from "../components/GmailSendModal";
import { LetterPreview } from "../components/LetterPreview";
import { LetterTypeSelector } from "../components/LetterTypeSelector";
import { QAChat } from "../components/QAChat";
import { StepIndicator } from "../components/StepIndicator";
import { StrengthAnalyser } from "../components/StrengthAnalyser";
import { UpgradeModal } from "../components/UpgradeModal";
import {
  useBackend,
  useCurrentUser,
  useRecordDownload,
} from "../hooks/use-backend";
import { useLetterStore } from "../store/letterStore";
import { useUIStore } from "../store/uiStore";
import type { LetterFormData, LetterType } from "../types";
import { copyLetterText } from "../utils/pdfGenerator";
import { sanitizeInput } from "../utils/security";

const TOTAL_STEPS_DEFAULT = 9;
const TOTAL_STEPS_CREDIT = 3;

/** Returns total steps based on selected letter type */
function getTotalSteps(letterType: LetterType | null) {
  return letterType === "CreditReportDispute"
    ? TOTAL_STEPS_CREDIT
    : TOTAL_STEPS_DEFAULT;
}

/** Convert flat frontend LetterFormData to nested backend LetterFormData shape */
function convertToBackendFormData(
  formData: LetterFormData,
): BackendLetterFormData {
  const senderAddress: Address = {
    street: formData.senderAddress,
    city: formData.senderCity,
    state: formData.senderState,
    zip: formData.senderZip,
  };

  const isCreditDispute = formData.letterType === "CreditReportDispute";

  // For Credit Report Dispute, the bureau is the recipient
  const recipientAddress: Address = isCreditDispute
    ? { street: "", city: "", state: "", zip: "" }
    : {
        street: formData.recipientAddress,
        city: formData.recipientCity,
        state: formData.recipientState,
        zip: formData.recipientZip,
      };

  // Parse priorContactAttempts string into PriorContact object
  const priorContactStr = (formData.priorContactAttempts || "").toLowerCase();
  const hasPriorContact =
    priorContactStr.length > 0 && priorContactStr !== "none";
  const priorContact: PriorContact = {
    attempted: hasPriorContact,
    method: hasPriorContact ? priorContactStr.slice(0, 100) : "None",
    count: hasPriorContact ? BigInt(1) : BigInt(0),
  };

  // Parse amountDemanded string to optional bigint
  const amountRaw = Number.parseFloat(formData.amountDemanded || "0");
  const amountDemanded: bigint | undefined =
    !Number.isNaN(amountRaw) && amountRaw > 0
      ? BigInt(Math.round(amountRaw * 100)) // store as cents
      : undefined;

  // For Credit Report Dispute: map credit-specific fields to backend fields
  const recipientName = isCreditDispute
    ? (formData.creditBureauName ?? "")
    : formData.recipientName;

  const disputeDescription = isCreditDispute
    ? buildCreditDisputeDescription(formData)
    : formData.disputeDescription;

  const evidenceItems = isCreditDispute
    ? (formData.creditSupportingDocs ?? [])
    : formData.evidenceItems;

  return {
    letterType: formData.letterType as unknown as BackendLetterType,
    tone: formData.tone as unknown as BackendLetterTone,
    jurisdiction: formData.jurisdiction || "CA",
    currency: formData.currency || "USD",
    senderName: formData.senderName,
    senderEmail: formData.senderEmail,
    senderPhone: formData.senderPhone,
    senderAddress,
    recipientName,
    recipientRole: isCreditDispute
      ? "Credit Bureau"
      : formData.recipientTitle || "",
    recipientAddress,
    disputeDescription,
    incidentDate: formData.incidentDate || "",
    evidenceItems,
    evidenceImages: formData.evidenceImages,
    amountDemanded,
    deadlineDays: BigInt(formData.responseDeadlineDays || 14),
    priorContact,
    preferredResolution: "",
  };
}

/** Build a structured dispute description from credit-specific fields */
function buildCreditDisputeDescription(formData: LetterFormData): string {
  const parts: string[] = [];

  if (formData.accountName) {
    parts.push(`Account being disputed: ${formData.accountName}`);
  }
  if (formData.accountNumber) {
    parts.push(`Account number: ${formData.accountNumber}`);
  }
  if (formData.inaccuracyType) {
    const label = formData.inaccuracyType.replace(/_/g, " ");
    parts.push(`Nature of inaccuracy: ${label}`);
  }
  if (formData.creditDisputeDescription) {
    parts.push(`\nDispute details:\n${formData.creditDisputeDescription}`);
  }

  return parts.join("\n");
}

export default function GeneratePage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [showMobilePreview, setShowMobilePreview] = useState(false);
  const [followUpLoading, setFollowUpLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [gmailModalOpen, setGmailModalOpen] = useState(false);
  const [editDownloadOpen, setEditDownloadOpen] = useState(false);
  const [strengthLoading, setStrengthLoading] = useState(false);
  const [strengthFailed, setStrengthFailed] = useState(false);

  const {
    currentFormData,
    setFormData,
    letterContent,
    setLetterContent,
    appendLetterContent,
    isGenerating,
    setIsGenerating,
    generatedLetter,
    strengthAnalysis,
    setStrengthAnalysis,
    savedLetterId,
    setSavedLetterId,
  } = useLetterStore();

  const { setUpgradeModalOpen, setSignInOpen } = useUIStore();
  const { actor } = useBackend();
  const { isAuthenticated } = useInternetIdentity();
  const { data: userProfile } = useCurrentUser();
  const { mutate: recordDownload } = useRecordDownload();

  const isCreditDispute = currentFormData.letterType === "CreditReportDispute";
  const totalSteps = getTotalSteps(currentFormData.letterType);

  // Derived: is the user at their free limit (2 letters/month)?
  const isAtFreeLimit =
    userProfile?.plan === "Free" && (userProfile?.lettersThisMonth ?? 0) >= 2;

  const canProceed = currentStep !== 1 || currentFormData.letterType !== null;

  const handleNext = () => {
    if (currentStep < totalSteps) setCurrentStep((s) => s + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep((s) => s - 1);
  };

  const generateLetter = async () => {
    if (!currentFormData.letterType) {
      toast.error("Please select a letter type first");
      return;
    }

    setIsGenerating(true);
    setLetterContent("");
    setSavedLetterId(null);
    setStrengthAnalysis(null);
    setStrengthFailed(false);
    setShowMobilePreview(true);

    try {
      if (actor && isAuthenticated) {
        // Authenticated + actor ready: generate via real backend
        // Defense-in-depth: sanitize all user-supplied text fields before sending
        const sanitizedFormData: LetterFormData = {
          ...currentFormData,
          senderName: sanitizeInput(currentFormData.senderName, 500),
          senderAddress: sanitizeInput(currentFormData.senderAddress, 1000),
          senderCity: sanitizeInput(currentFormData.senderCity, 500),
          senderState: sanitizeInput(currentFormData.senderState, 500),
          senderZip: sanitizeInput(currentFormData.senderZip, 20),
          senderPhone: sanitizeInput(currentFormData.senderPhone, 50),
          senderEmail: sanitizeInput(currentFormData.senderEmail, 254),
          recipientName: sanitizeInput(currentFormData.recipientName, 500),
          recipientCompany: sanitizeInput(
            currentFormData.recipientCompany,
            500,
          ),
          recipientTitle: sanitizeInput(currentFormData.recipientTitle, 500),
          recipientAddress: sanitizeInput(
            currentFormData.recipientAddress,
            1000,
          ),
          recipientCity: sanitizeInput(currentFormData.recipientCity, 500),
          recipientState: sanitizeInput(currentFormData.recipientState, 500),
          recipientZip: sanitizeInput(currentFormData.recipientZip, 20),
          recipientEmail: sanitizeInput(currentFormData.recipientEmail, 254),
          disputeDescription: sanitizeInput(
            currentFormData.disputeDescription,
            10000,
          ),
          amountDemanded: sanitizeInput(currentFormData.amountDemanded, 100),
          priorContactAttempts: sanitizeInput(
            currentFormData.priorContactAttempts,
            1000,
          ),
        };
        const backendFormData = convertToBackendFormData(sanitizedFormData);
        // country is passed as second param: string | null (Motoko ?Text)
        const country = currentFormData.country || null;

        const result = await actor.generateLetterStream(
          backendFormData,
          country,
        );

        if (result.__kind__ === "err") {
          throw new Error(result.err);
        }

        const letterText = result.ok;
        setLetterContent(letterText);

        // Save the letter to get a LetterId for follow-up and strength analysis
        try {
          const saveResult = await actor.saveLetter(
            backendFormData,
            letterText,
          );
          if (saveResult.__kind__ === "ok") {
            const letterId = saveResult.ok.id;
            setSavedLetterId(letterId);

            // Run strength analysis with the real letterId
            try {
              setStrengthLoading(true);
              const analysisResult =
                await actor.generateStrengthAnalysis(letterId);
              if (analysisResult.__kind__ === "ok") {
                const raw = analysisResult.ok;
                // backend score is bigint — convert to number
                const likelihood = raw.responseLikelihood as
                  | "Low"
                  | "Medium"
                  | "High";
                setStrengthAnalysis({
                  score: Number(raw.score),
                  strengths: Array.from(raw.strengths),
                  improvements: Array.from(raw.improvements),
                  responseLikelihood: likelihood,
                });
              } else {
                setStrengthFailed(true);
              }
            } catch {
              setStrengthFailed(true);
            } finally {
              setStrengthLoading(false);
            }
          }
        } catch {
          // Save failure is non-fatal — letter still displayed
        }
      } else {
        // Demo / preview mode: works for all users including unauthenticated
        // Authenticated users without actor (still loading) also hit this path
        const demo = buildDemoLetter(currentFormData);
        let i = 0;
        const chunk = 8;
        await new Promise<void>((resolve) => {
          const interval = setInterval(() => {
            appendLetterContent(demo.slice(i, i + chunk));
            i += chunk;
            if (i >= demo.length) {
              clearInterval(interval);
              resolve();
            }
          }, 20);
        });

        // Prompt sign-in after demo so user can save / use AI features
        if (!isAuthenticated) {
          setTimeout(() => {
            toast.info(
              "Sign in to save your letter and use AI-powered features",
              {
                duration: 6000,
                action: {
                  label: "Sign In",
                  onClick: () => setSignInOpen(true),
                },
              },
            );
          }, 800);
        }
      }
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Generation failed. Please try again.";
      toast.error(message);
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateFollowUp = async () => {
    if (!letterContent) return;

    if (!actor) {
      toast.info("Backend not connected — follow-up requires live backend");
      return;
    }

    if (!savedLetterId) {
      toast.error(
        "Please generate and save your letter first before creating a follow-up",
      );
      return;
    }

    setFollowUpLoading(true);
    try {
      const result = await actor.generateFollowUpLetter(savedLetterId);
      if (result.__kind__ === "err") {
        throw new Error(result.err);
      }
      setLetterContent(result.ok);
      toast.success("Follow-up letter generated");
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to generate follow-up letter";
      toast.error(message);
    } finally {
      setFollowUpLoading(false);
    }
  };

  const handleCopy = async () => {
    if (isAtFreeLimit) {
      setUpgradeModalOpen(true);
      return;
    }
    await copyLetterText(letterContent);
    setCopied(true);
    toast.success("Letter copied to clipboard");
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadPDF = () => {
    // Open the edit-before-download modal instead of downloading immediately
    setEditDownloadOpen(true);
  };

  const hasLetter = letterContent.trim().length > 0 || !!generatedLetter;

  return (
    <div className="flex flex-col flex-1 min-h-0" data-ocid="generate.page">
      {/* Page header */}
      <div className="bg-card border-b border-border px-4 py-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-xl font-bold text-foreground font-display">
            AI Demand Letter Generator
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Generate a lawyer-quality demand letter in minutes — free.
          </p>
        </div>
      </div>

      {/* Auth banner */}
      {!isAuthenticated && (
        <div
          className="bg-primary/5 border-b border-primary/20 px-4 py-3"
          data-ocid="generate.auth_banner"
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <p className="text-sm text-foreground">
              <strong>Sign in to generate your letter.</strong> Free accounts
              get 2 letters/month.
            </p>
            <Button
              size="sm"
              className="bg-primary hover:bg-primary/90 text-primary-foreground shrink-0"
              onClick={() => setSignInOpen(true)}
              data-ocid="generate.signin_button"
            >
              Sign In Free
            </Button>
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col lg:flex-row max-w-7xl mx-auto w-full gap-0 overflow-hidden">
        {/* ── LEFT PANEL: Form ── */}
        <div
          className={`lg:w-3/5 flex flex-col border-r border-border bg-background overflow-y-auto ${showMobilePreview ? "hidden lg:flex" : "flex"}`}
          data-ocid="generate.form_panel"
        >
          {/* Step indicator */}
          <div className="px-6 pt-5 pb-4 border-b border-border bg-card">
            <StepIndicator currentStep={currentStep} totalSteps={totalSteps} />
          </div>

          {/* Step content */}
          <div className="flex-1 px-6 py-6">
            {currentStep === 1 && (
              <LetterTypeSelector
                value={currentFormData.letterType}
                onChange={(type: LetterType) => {
                  setFormData({ letterType: type });
                  // Reset step to 1 when type changes so step count recalculates cleanly
                  setCurrentStep(1);
                }}
              />
            )}

            {/* ── Credit Report Dispute flow (steps 2–3) ── */}
            {isCreditDispute && currentStep === 2 && (
              <SenderStep data={currentFormData} onChange={setFormData} />
            )}
            {isCreditDispute && currentStep === 3 && (
              <CreditDisputeStep
                data={currentFormData}
                onChange={setFormData}
              />
            )}

            {/* ── Default flow (steps 2–9) — untouched ── */}
            {!isCreditDispute && currentStep === 2 && (
              <SenderStep data={currentFormData} onChange={setFormData} />
            )}
            {!isCreditDispute && currentStep === 3 && (
              <RecipientStep data={currentFormData} onChange={setFormData} />
            )}
            {!isCreditDispute && currentStep === 4 && (
              <DisputeStep data={currentFormData} onChange={setFormData} />
            )}
            {!isCreditDispute && currentStep === 5 && (
              <ResolutionStep data={currentFormData} onChange={setFormData} />
            )}
            {!isCreditDispute && currentStep === 6 && (
              <JurisdictionStep data={currentFormData} onChange={setFormData} />
            )}
            {!isCreditDispute && currentStep === 7 && (
              <ToneStep data={currentFormData} onChange={setFormData} />
            )}
            {!isCreditDispute && currentStep === 8 && (
              <EvidenceStep data={currentFormData} onChange={setFormData} />
            )}
            {!isCreditDispute && currentStep === 9 && (
              <PriorContactStep data={currentFormData} onChange={setFormData} />
            )}
          </div>

          {/* Navigation */}
          <div className="px-6 py-4 border-t border-border bg-card flex items-center justify-between gap-3">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 1}
              data-ocid="generate.back_button"
              className="flex items-center gap-1.5"
            >
              <ChevronLeft className="w-4 h-4" aria-hidden="true" /> Back
            </Button>

            <div className="flex items-center gap-2 flex-1 justify-end">
              {/* Mobile preview toggle */}
              <Button
                variant="outline"
                size="sm"
                className="lg:hidden"
                onClick={() => setShowMobilePreview(true)}
                data-ocid="generate.preview_toggle"
              >
                <Eye className="w-4 h-4 mr-1.5" aria-hidden="true" />
                Preview
              </Button>

              {currentStep < totalSteps ? (
                <Button
                  onClick={handleNext}
                  disabled={!canProceed}
                  className="bg-accent hover:bg-accent/90 text-accent-foreground flex items-center gap-1.5"
                  data-ocid="generate.next_button"
                >
                  Next <ChevronRight className="w-4 h-4" aria-hidden="true" />
                </Button>
              ) : (
                <Button
                  onClick={generateLetter}
                  disabled={isGenerating || !currentFormData.letterType}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6"
                  data-ocid="generate.submit_button"
                >
                  {isGenerating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
                      Generating…
                    </>
                  ) : (
                    "Generate Letter →"
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* ── RIGHT PANEL: Preview ── */}
        <div
          className={`lg:w-2/5 flex flex-col bg-muted/20 overflow-y-auto ${showMobilePreview ? "flex" : "hidden lg:flex"}`}
          data-ocid="generate.preview_panel"
        >
          {/* Mobile back button */}
          {showMobilePreview && (
            <div className="lg:hidden px-4 py-2 border-b border-border bg-card flex items-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowMobilePreview(false)}
                data-ocid="generate.preview_back"
              >
                <EyeOff className="w-4 h-4 mr-1.5" /> Back to Form
              </Button>
            </div>
          )}

          {/* Sticky preview header with disclaimer */}
          <div className="sticky top-0 z-10 bg-card border-b border-border">
            <DisclaimerBanner dismissible />
          </div>

          {/* Letter preview area */}
          <div className="flex-1 p-4">
            <LetterPreview
              formData={currentFormData}
              letterContent={letterContent}
              isGenerating={isGenerating}
              generatedLetter={generatedLetter}
            />

            {/* Attached Evidence preview */}
            {currentFormData.evidenceImages.length > 0 && letterContent && (
              <div className="mt-4 p-3 rounded-lg border border-border bg-card">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                  Attached Evidence ({currentFormData.evidenceImages.length}{" "}
                  image
                  {currentFormData.evidenceImages.length > 1 ? "s" : ""})
                </p>
                <ol className="space-y-1 text-xs text-foreground list-decimal ml-4">
                  {currentFormData.evidenceImages.map((url, i) => (
                    <li key={url}>
                      <span className="text-muted-foreground">
                        Evidence image {i + 1}
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </div>

          {/* Action buttons (post-generation) */}
          {hasLetter && !isGenerating && (
            <div className="px-4 pb-2 space-y-3">
              <div
                className="flex flex-wrap gap-2"
                data-ocid="generate.action_buttons"
              >
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCopy}
                  className={`flex items-center gap-1.5 text-xs ${isAtFreeLimit ? "opacity-70" : ""}`}
                  title={
                    isAtFreeLimit
                      ? "Upgrade to Pro to copy unlimited letters"
                      : undefined
                  }
                  data-ocid="generate.copy_button"
                >
                  {isAtFreeLimit ? (
                    <Lock
                      className="w-3.5 h-3.5 text-muted-foreground"
                      aria-hidden="true"
                    />
                  ) : copied ? (
                    <Check className="w-3.5 h-3.5 text-accent" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  {isAtFreeLimit
                    ? "Copy (Upgrade)"
                    : copied
                      ? "Copied!"
                      : "Copy Text"}
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleDownloadPDF}
                  className="flex items-center gap-1.5 text-xs"
                  data-ocid="generate.download_button"
                >
                  <Download className="w-3.5 h-3.5" aria-hidden="true" />
                  Download PDF
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={generateLetter}
                  disabled={isGenerating}
                  className="flex items-center gap-1.5 text-xs"
                  data-ocid="generate.regenerate_button"
                >
                  <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
                  Regenerate
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleGenerateFollowUp}
                  disabled={followUpLoading || !savedLetterId}
                  title={
                    !savedLetterId
                      ? "Generate a letter first to enable follow-up"
                      : undefined
                  }
                  className="flex items-center gap-1.5 text-xs"
                  data-ocid="generate.followup_button"
                >
                  {followUpLoading ? (
                    <div className="w-3.5 h-3.5 border border-muted-foreground border-t-transparent rounded-full animate-spin" />
                  ) : (
                    "↗ Follow-Up Letter"
                  )}
                </Button>

                {/* Gmail Send Button */}
                <Button
                  size="sm"
                  onClick={() => {
                    if (isAtFreeLimit) {
                      setUpgradeModalOpen(true);
                    } else {
                      setGmailModalOpen(true);
                    }
                  }}
                  className={`flex items-center gap-1.5 text-xs ${isAtFreeLimit ? "bg-muted text-muted-foreground border border-border hover:bg-muted/80" : "bg-destructive hover:bg-destructive/90 text-destructive-foreground border-0"}`}
                  title={
                    isAtFreeLimit
                      ? "Upgrade to Pro to send via Gmail"
                      : undefined
                  }
                  data-ocid="generate.gmail_send_button"
                >
                  {isAtFreeLimit ? (
                    <Lock className="w-3.5 h-3.5" aria-hidden="true" />
                  ) : (
                    <Mail className="w-3.5 h-3.5" aria-hidden="true" />
                  )}
                  {isAtFreeLimit ? "Gmail (Upgrade)" : "Send via Gmail"}
                </Button>
              </div>

              {/* Strength Analyser */}
              <StrengthAnalyser
                analysis={strengthAnalysis}
                isLoading={strengthLoading}
                analysisFailed={strengthFailed}
              />
            </div>
          )}

          {/* Upgrade prompt if at limit */}
          {isAuthenticated && (
            <div className="px-4 pb-4">
              <button
                type="button"
                onClick={() => setUpgradeModalOpen(true)}
                className="w-full text-xs text-muted-foreground hover:text-foreground transition-fast py-2"
                data-ocid="generate.upgrade_link"
              >
                Free plan · 2 letters/month ·{" "}
                <span className="text-accent font-medium underline">
                  Upgrade for unlimited
                </span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Q&A Chat Widget */}
      <QAChat caseContext={currentFormData.disputeDescription} />

      {/* Upgrade Modal */}
      <UpgradeModal />

      {/* Gmail Send Modal */}
      <GmailSendModal
        open={gmailModalOpen}
        onClose={() => setGmailModalOpen(false)}
        letterContent={letterContent}
        letterType={currentFormData.letterType}
        initialTo={currentFormData.recipientEmail}
      />

      {/* Edit Before Download Modal */}
      <EditBeforeDownloadModal
        open={editDownloadOpen}
        onClose={() => setEditDownloadOpen(false)}
        letterContent={letterContent}
        formData={currentFormData}
        watermark={userProfile?.plan === "Free" || !userProfile}
        letterId={savedLetterId}
        onDownloadRecorded={() => {
          if (savedLetterId) recordDownload(savedLetterId);
        }}
      />
    </div>
  );
}

/** Demo letter for when backend is not connected */
function buildDemoLetter(formData: LetterFormData): string {
  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const senderBlock = `${formData.senderName || "Sender Name"}
${formData.senderAddress || "123 Main Street"}
${formData.senderCity || "City"}, ${formData.senderState || "CA"} ${formData.senderZip || "90001"}
${formData.senderPhone || ""}
${formData.senderEmail || ""}`;

  const recipientBlock = `${formData.recipientName || "Recipient Name"}
${formData.recipientCompany ? `${formData.recipientCompany}\n` : ""}${formData.recipientAddress || "456 Oak Avenue"}
${formData.recipientCity || "City"}, ${formData.recipientState || "CA"} ${formData.recipientZip || "94102"}`;

  const amount = formData.amountDemanded
    ? `${formData.currency} ${formData.amountDemanded}`
    : "the full amount owed";

  const deadline = formData.responseDeadlineDays || 14;

  return `${senderBlock}

${today}

${recipientBlock}

RE: FORMAL DEMAND FOR PAYMENT

Dear ${formData.recipientName || "Sir/Madam"},

I am writing to formally demand payment of ${amount}, which is now past due and payable to me immediately. This letter serves as your final notice before I pursue all available legal remedies.

STATEMENT OF FACTS

${formData.disputeDescription || "On the relevant date, you failed to fulfill your obligations as agreed."}

Despite my prior attempts to resolve this matter amicably, the situation remains unresolved. You have had ample opportunity to address this obligation and have failed to do so.

LEGAL BASIS

Under California Civil Code § 1549 (Contract Obligations) and applicable consumer protection statutes, you are legally obligated to fulfill the terms of our agreement. Your failure to do so constitutes a material breach, entitling me to seek monetary damages and any other relief available under law.

Additionally, California Code of Civil Procedure § 685.010 provides for the recovery of interest on unpaid obligations at the statutory rate from the date payment was due.

DEMAND

You are hereby demanded to remit full payment of ${amount} within ${deadline} days of the date of this letter. Payment must be received by ${new Date(Date.now() + deadline * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}.

CONSEQUENCES OF NON-COMPLIANCE

Should you fail to comply with this demand within the specified time, I will pursue all available legal remedies without further notice, including but not limited to:

1. Filing a civil lawsuit in the appropriate court;
2. Seeking recovery of attorney's fees and court costs;
3. Reporting this matter to relevant consumer protection agencies;
4. Taking any other action permitted by law.

I strongly urge you to take this matter seriously and respond promptly. Settlement at this stage will save both parties the expense and inconvenience of litigation.

Please confirm receipt of this letter and your intention to comply in writing.

Sincerely,

${formData.senderName || "Sender Name"}
${formData.senderEmail || ""}
${formData.senderPhone || ""}

---
Generated by Sue Letter. This document is not legal advice.`;
}
