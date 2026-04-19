import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import type { LetterFormData } from "../../types";

const DEADLINE_OPTIONS = [
  { value: "7", label: "7 days" },
  { value: "14", label: "14 days" },
  { value: "21", label: "21 days" },
  { value: "30", label: "30 days" },
  { value: "custom", label: "Custom date…" },
];

const RESOLUTION_OPTIONS = [
  "Full monetary payment",
  "Partial payment / settlement",
  "Refund of purchase price",
  "Repair or replacement",
  "Return of property",
  "Cease the disputed conduct",
  "Written apology",
  "Performance of contractual duties",
  "Other",
];

interface ResolutionStepProps {
  data: LetterFormData;
  onChange: (data: Partial<LetterFormData>) => void;
}

export function ResolutionStep({ data, onChange }: ResolutionStepProps) {
  const [useCustomDate, setUseCustomDate] = useState(false);

  const handleDeadlineChange = (val: string) => {
    if (val === "custom") {
      setUseCustomDate(true);
    } else {
      setUseCustomDate(false);
      onChange({ responseDeadlineDays: Number.parseInt(val, 10) });
    }
  };

  return (
    <div className="space-y-4" data-ocid="resolution_step.section">
      <div>
        <h2 className="text-lg font-semibold text-foreground">
          Resolution request
        </h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          What do you want the other party to do, and by when?
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="form-group">
          <Label htmlFor="deadlineSelect" className="text-sm font-medium">
            Response deadline <span className="text-destructive">*</span>
          </Label>
          <Select
            defaultValue={String(data.responseDeadlineDays)}
            onValueChange={handleDeadlineChange}
          >
            <SelectTrigger
              id="deadlineSelect"
              data-ocid="resolution_step.deadline_select"
            >
              <SelectValue placeholder="Select deadline…" />
            </SelectTrigger>
            <SelectContent>
              {DEADLINE_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {useCustomDate && (
          <div className="form-group">
            <Label htmlFor="customDeadlineDate" className="text-sm font-medium">
              Custom deadline date
            </Label>
            <Input
              id="customDeadlineDate"
              type="date"
              onChange={(e) => {
                const days = Math.ceil(
                  (new Date(e.target.value).getTime() - Date.now()) /
                    (1000 * 60 * 60 * 24),
                );
                if (days > 0) onChange({ responseDeadlineDays: days });
              }}
              data-ocid="resolution_step.custom_date_input"
            />
          </div>
        )}

        <div className="form-group sm:col-span-2">
          <Label htmlFor="preferredResolution" className="text-sm font-medium">
            Preferred resolution <span className="text-destructive">*</span>
          </Label>
          <Select onValueChange={(v) => onChange({ priorContactAttempts: v })}>
            <SelectTrigger
              id="preferredResolution"
              data-ocid="resolution_step.resolution_select"
            >
              <SelectValue placeholder="Select preferred outcome…" />
            </SelectTrigger>
            <SelectContent>
              {RESOLUTION_OPTIONS.map((opt) => (
                <SelectItem key={opt} value={opt}>
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="p-4 rounded-lg bg-primary/5 border border-primary/20 text-sm text-foreground">
        <strong className="font-medium">Tip:</strong> A{" "}
        {data.responseDeadlineDays}-day deadline is standard for most demand
        letters. Courts generally view 14–30 days as reasonable notice.
      </div>
    </div>
  );
}
