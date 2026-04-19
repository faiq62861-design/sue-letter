import { Skeleton } from "@/components/ui/skeleton";
import { AlertTriangle } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import type { GeneratedLetter, LetterFormData } from "../types";
import { LETTER_TYPE_CONFIG } from "../types";
import { DisclaimerBanner } from "./DisclaimerBanner";

interface LetterPreviewProps {
  formData: LetterFormData;
  letterContent: string;
  isGenerating: boolean;
  generatedLetter: GeneratedLetter | null;
}

function PlaceholderLetterhead({ formData }: { formData: LetterFormData }) {
  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div
      className="letter-preview space-y-6 opacity-60 select-none"
      aria-hidden="true"
    >
      <div className="border-b pb-4">
        <div className="text-sm font-bold text-foreground">
          {formData.senderName || "YOUR NAME"}
        </div>
        <div className="text-xs text-muted-foreground mt-0.5">
          {formData.senderAddress || "Your Address"},{" "}
          {formData.senderCity || "City"}, {formData.senderState || "ST"}{" "}
          {formData.senderZip || "ZIP"}
        </div>
        {formData.senderEmail && (
          <div className="text-xs text-muted-foreground">
            {formData.senderEmail}
          </div>
        )}
        {formData.senderPhone && (
          <div className="text-xs text-muted-foreground">
            {formData.senderPhone}
          </div>
        )}
      </div>

      <p className="text-xs">{today}</p>

      <div className="text-sm">
        <div className="font-medium">
          {formData.recipientName || "Recipient Name"}
        </div>
        {formData.recipientCompany && (
          <div className="text-xs">{formData.recipientCompany}</div>
        )}
        <div className="text-xs text-muted-foreground">
          {formData.recipientAddress || "Recipient Address"}
        </div>
      </div>

      <div className="text-xs font-semibold uppercase tracking-wide">
        Re:{" "}
        {formData.letterType
          ? `${LETTER_TYPE_CONFIG[formData.letterType].label} — Formal Demand`
          : "Formal Demand Letter"}
      </div>

      <p className="text-xs text-muted-foreground">
        Complete the form steps on the left and click{" "}
        <strong>Generate Letter</strong> to produce your demand letter here.
      </p>

      {/* Shimmer skeleton lines for placeholder */}
      <div className="space-y-2">
        {([140, 120, 160, 100] as const).map((w) => (
          <div
            key={w}
            className="h-2.5 bg-muted rounded-full animate-pulse"
            style={{ width: `${w}px`, maxWidth: "100%" }}
          />
        ))}
      </div>

      <div className="border-t pt-4 space-y-1 text-xs text-muted-foreground">
        <div>Sincerely,</div>
        <div className="h-6 w-32 bg-muted rounded animate-pulse" />
        <div>{formData.senderName || "Your Name"}</div>
      </div>
    </div>
  );
}

function GeneratingState() {
  return (
    <div
      className="letter-preview space-y-3"
      data-ocid="letter_preview.loading_state"
    >
      <div className="flex items-center gap-2 mb-4">
        <div className="w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin" />
        <span className="text-sm font-medium text-accent">
          Crafting your demand letter…
        </span>
      </div>
      {["100%", "80%", "120%", "90%", "110%", "70%", "130%", "85%"].map((w) => (
        <Skeleton
          key={w}
          className="h-3 rounded"
          style={{ width: w, maxWidth: w }}
        />
      ))}
    </div>
  );
}

export function LetterPreview({
  formData,
  letterContent,
  isGenerating,
  generatedLetter,
}: LetterPreviewProps) {
  const hasContent = letterContent.trim().length > 0;

  return (
    <div className="flex flex-col h-full" data-ocid="letter_preview.panel">
      <DisclaimerBanner className="rounded-t-lg" />

      <div className="flex-1 overflow-y-auto p-1">
        <AnimatePresence mode="wait">
          {isGenerating && !hasContent ? (
            <motion.div
              key="generating"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <GeneratingState />
            </motion.div>
          ) : hasContent ? (
            <motion.div
              key="content"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="letter-preview whitespace-pre-wrap"
              data-ocid="letter_preview.content"
            >
              {letterContent}
              {isGenerating && (
                <span className="inline-block w-0.5 h-4 bg-foreground animate-pulse ml-0.5 align-middle" />
              )}
            </motion.div>
          ) : generatedLetter ? (
            <motion.div
              key="generated"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="letter-preview whitespace-pre-wrap"
              data-ocid="letter_preview.content"
            >
              {generatedLetter.letterContent}
            </motion.div>
          ) : (
            <motion.div
              key="placeholder"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <PlaceholderLetterhead formData={formData} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {!hasContent && !isGenerating && !generatedLetter && (
        <div className="px-4 py-3 border-t border-border bg-muted/30 flex items-center gap-2 text-xs text-muted-foreground">
          <AlertTriangle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
          Preview updates after generation
        </div>
      )}
    </div>
  );
}
