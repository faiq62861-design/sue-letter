import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import type { LetterFormData } from "../../types";

const CONTACT_METHODS = [
  "Email",
  "Phone call",
  "In-person conversation",
  "Certified mail",
  "Text message",
  "Online dispute form",
  "Through attorney",
];

interface PriorContactStepProps {
  data: LetterFormData;
  onChange: (data: Partial<LetterFormData>) => void;
}

export function PriorContactStep({ onChange }: PriorContactStepProps) {
  const [hadContact, setHadContact] = useState(false);
  const [contactCount, setContactCount] = useState("1");

  const handleToggle = (checked: boolean) => {
    setHadContact(checked);
    if (!checked) {
      onChange({ priorContactAttempts: "0" });
    }
  };

  return (
    <div className="space-y-5" data-ocid="prior_contact_step.section">
      <div>
        <h2 className="text-lg font-semibold text-foreground">
          Prior contact attempts
        </h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          Have you already tried to resolve this matter with the other party?
        </p>
      </div>

      <div
        className="flex items-center justify-between rounded-lg border border-border bg-card px-4 py-4"
        data-ocid="prior_contact_step.toggle"
      >
        <div>
          <p className="text-sm font-medium text-foreground">
            I have already contacted them
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Documenting prior contact strengthens your legal position.
          </p>
        </div>
        <Switch
          checked={hadContact}
          onCheckedChange={handleToggle}
          aria-label="Toggle prior contact"
          data-ocid="prior_contact_step.switch"
        />
      </div>

      {hadContact && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          <div className="form-group">
            <Label htmlFor="contactCount" className="text-sm font-medium">
              Number of contact attempts
            </Label>
            <Input
              id="contactCount"
              type="number"
              min="1"
              max="20"
              value={contactCount}
              onChange={(e) => {
                setContactCount(e.target.value);
                onChange({ priorContactAttempts: e.target.value });
              }}
              data-ocid="prior_contact_step.count_input"
            />
          </div>

          <div className="form-group">
            <Label htmlFor="contactMethod" className="text-sm font-medium">
              Primary contact method
            </Label>
            <Select
              onValueChange={(v) =>
                onChange({ priorContactAttempts: `${contactCount} via ${v}` })
              }
            >
              <SelectTrigger
                id="contactMethod"
                data-ocid="prior_contact_step.method_select"
              >
                <SelectValue placeholder="How did you contact them?" />
              </SelectTrigger>
              <SelectContent>
                {CONTACT_METHODS.map((m) => (
                  <SelectItem key={m} value={m}>
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="sm:col-span-2 p-3 rounded-lg bg-accent/10 border border-accent/30 text-sm text-foreground">
            <strong className="font-medium text-accent">Great.</strong> Your
            prior contact attempts will be documented in the letter to show good
            faith before escalating to legal action.
          </div>
        </div>
      )}

      {!hadContact && (
        <div className="p-3 rounded-lg bg-muted border border-border text-sm text-muted-foreground">
          No prior contact noted. The letter will be written as an initial
          demand, which is perfectly valid. Many recipients respond to the first
          formal demand.
        </div>
      )}
    </div>
  );
}
