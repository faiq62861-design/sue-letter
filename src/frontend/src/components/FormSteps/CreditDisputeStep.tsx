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
import type { LetterFormData } from "../../types";

interface CreditDisputeStepProps {
  data: LetterFormData;
  onChange: (data: Partial<LetterFormData>) => void;
}

const INACCURACY_TYPES = [
  { value: "incorrect_balance", label: "Incorrect balance" },
  { value: "account_not_mine", label: "Account not mine" },
  {
    value: "account_paid_closed",
    label: "Account paid / closed but showing open",
  },
  {
    value: "fraudulent_identity_theft",
    label: "Fraudulent account / identity theft",
  },
  {
    value: "incorrect_personal_info",
    label: "Incorrect personal information",
  },
  { value: "duplicate_account", label: "Duplicate account" },
  { value: "other", label: "Other" },
] as const;

const SUPPORTING_DOCS = [
  { id: "credit_report_copy", label: "Credit report copy" },
  { id: "bank_statements", label: "Bank statements" },
  { id: "payment_receipts", label: "Payment receipts" },
  { id: "identity_theft_affidavit", label: "Identity theft affidavit" },
  { id: "police_report", label: "Police report" },
  { id: "correspondence_with_creditor", label: "Correspondence with creditor" },
  { id: "other_docs", label: "Other" },
] as const;

const QUICK_BUREAUS = ["Equifax", "Experian", "TransUnion"] as const;

export function CreditDisputeStep({ data, onChange }: CreditDisputeStepProps) {
  const creditBureauName = data.creditBureauName ?? "";
  const accountName = data.accountName ?? "";
  const accountNumber = data.accountNumber ?? "";
  const inaccuracyType = data.inaccuracyType ?? "";
  const creditDisputeDescription = data.creditDisputeDescription ?? "";
  const creditSupportingDocs: string[] = data.creditSupportingDocs ?? [];

  const isQuickBureau = QUICK_BUREAUS.includes(
    creditBureauName as (typeof QUICK_BUREAUS)[number],
  );

  const toggleDoc = (id: string) => {
    const next = creditSupportingDocs.includes(id)
      ? creditSupportingDocs.filter((d) => d !== id)
      : [...creditSupportingDocs, id];
    onChange({ creditSupportingDocs: next });
  };

  return (
    <div className="space-y-6" data-ocid="credit_dispute_step.section">
      <div>
        <h2 className="text-lg font-semibold text-foreground">
          Credit report dispute details
        </h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          Provide the details of the inaccuracy you want to dispute. This
          information will be used to address your letter to the correct bureau
          and creditor.
        </p>
      </div>

      {/* Credit Bureau */}
      <div className="space-y-2" data-ocid="credit_dispute_step.bureau_section">
        <Label className="text-sm font-medium">
          Credit bureau <span className="text-destructive">*</span>
        </Label>
        <div className="flex flex-wrap gap-2 mb-2">
          {QUICK_BUREAUS.map((bureau) => (
            <Button
              key={bureau}
              type="button"
              variant={creditBureauName === bureau ? "default" : "outline"}
              size="sm"
              className={
                creditBureauName === bureau
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground"
              }
              onClick={() => onChange({ creditBureauName: bureau })}
              data-ocid={`credit_dispute_step.bureau_${bureau.toLowerCase()}_button`}
            >
              {bureau}
            </Button>
          ))}
          <Button
            type="button"
            variant={creditBureauName && !isQuickBureau ? "default" : "outline"}
            size="sm"
            className={
              creditBureauName && !isQuickBureau
                ? "bg-primary text-primary-foreground"
                : "text-foreground"
            }
            onClick={() => {
              if (isQuickBureau || !creditBureauName) {
                onChange({ creditBureauName: "" });
              }
            }}
            data-ocid="credit_dispute_step.bureau_other_button"
          >
            Other / International
          </Button>
        </div>
        {(!creditBureauName || !isQuickBureau) && (
          <Input
            id="creditBureauName"
            value={isQuickBureau ? "" : creditBureauName}
            onChange={(e) => onChange({ creditBureauName: e.target.value })}
            placeholder="e.g. CIBIL, Experian India, Credifax…"
            data-ocid="credit_dispute_step.bureau_input"
          />
        )}
      </div>

      {/* Account / Creditor name */}
      <div className="form-group">
        <Label htmlFor="accountName" className="text-sm font-medium">
          Creditor / account name being disputed{" "}
          <span className="text-destructive">*</span>
        </Label>
        <Input
          id="accountName"
          value={accountName}
          onChange={(e) => onChange({ accountName: e.target.value })}
          placeholder="e.g. Bank of America — Visa ending 4321"
          required
          data-ocid="credit_dispute_step.account_name_input"
        />
        <p className="text-xs text-muted-foreground mt-1">
          Enter the exact name of the account as it appears on your credit
          report.
        </p>
      </div>

      {/* Account number (optional) */}
      <div className="form-group">
        <Label htmlFor="accountNumber" className="text-sm font-medium">
          Account number{" "}
          <span className="text-muted-foreground font-normal">(optional)</span>
        </Label>
        <Input
          id="accountNumber"
          value={accountNumber}
          onChange={(e) => onChange({ accountNumber: e.target.value })}
          placeholder="e.g. ****-****-****-4321 or last 4 digits"
          data-ocid="credit_dispute_step.account_number_input"
        />
      </div>

      {/* Nature of inaccuracy */}
      <div className="form-group">
        <Label htmlFor="inaccuracyType" className="text-sm font-medium">
          Nature of the inaccuracy <span className="text-destructive">*</span>
        </Label>
        <Select
          value={inaccuracyType}
          onValueChange={(v) => onChange({ inaccuracyType: v })}
        >
          <SelectTrigger
            id="inaccuracyType"
            data-ocid="credit_dispute_step.inaccuracy_select"
          >
            <SelectValue placeholder="Select the type of error…" />
          </SelectTrigger>
          <SelectContent>
            {INACCURACY_TYPES.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Description of dispute */}
      <div className="form-group">
        <Label
          htmlFor="creditDisputeDescription"
          className="text-sm font-medium"
        >
          Description of the dispute <span className="text-destructive">*</span>
        </Label>
        <Textarea
          id="creditDisputeDescription"
          value={creditDisputeDescription}
          onChange={(e) =>
            onChange({ creditDisputeDescription: e.target.value })
          }
          placeholder="Describe the inaccuracy clearly — what is shown on your report and what the correct information should be. Include any relevant dates, amounts, or reference numbers."
          rows={5}
          className="resize-y min-h-[110px]"
          required
          data-ocid="credit_dispute_step.description_textarea"
        />
        <p className="text-xs text-muted-foreground mt-1">
          Be specific — the more detail you provide, the stronger your dispute
          letter will be.
        </p>
      </div>

      {/* Supporting documents */}
      <div
        className="space-y-2"
        data-ocid="credit_dispute_step.supporting_docs_section"
      >
        <Label className="text-sm font-medium">
          Supporting documents available{" "}
          <span className="text-muted-foreground font-normal">(optional)</span>
        </Label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {SUPPORTING_DOCS.map((doc) => {
            const checked = creditSupportingDocs.includes(doc.id);
            return (
              <label
                key={doc.id}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-md border cursor-pointer transition-colors ${
                  checked
                    ? "border-primary/60 bg-primary/8 text-foreground"
                    : "border-border bg-card text-muted-foreground hover:border-primary/30 hover:text-foreground"
                }`}
                data-ocid={`credit_dispute_step.doc_${doc.id}`}
              >
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={checked}
                  onChange={() => toggleDoc(doc.id)}
                />
                <span
                  className={`w-4 h-4 flex-shrink-0 rounded border transition-colors flex items-center justify-center ${
                    checked
                      ? "bg-primary border-primary"
                      : "border-border bg-background"
                  }`}
                  aria-hidden="true"
                >
                  {checked && (
                    <svg
                      viewBox="0 0 12 12"
                      fill="none"
                      className="w-2.5 h-2.5"
                      aria-hidden="true"
                      focusable="false"
                    >
                      <path
                        d="M2 6l3 3 5-5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-primary-foreground"
                      />
                    </svg>
                  )}
                </span>
                <span className="text-sm">{doc.label}</span>
              </label>
            );
          })}
        </div>
        <p className="text-xs text-muted-foreground">
          These will be referenced in the letter as evidence supporting your
          dispute.
        </p>
      </div>
    </div>
  );
}
