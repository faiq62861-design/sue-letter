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
import { CURRENCIES } from "../../types";
import type { LetterFormData } from "../../types";

interface DisputeStepProps {
  data: LetterFormData;
  onChange: (data: Partial<LetterFormData>) => void;
}

export function DisputeStep({ data, onChange }: DisputeStepProps) {
  return (
    <div className="space-y-4" data-ocid="dispute_step.section">
      <div>
        <h2 className="text-lg font-semibold text-foreground">
          Dispute details
        </h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          Describe your situation in detail. More information leads to a
          stronger letter.
        </p>
      </div>

      <div className="form-group">
        <Label htmlFor="disputeDescription" className="text-sm font-medium">
          Describe your dispute <span className="text-destructive">*</span>
        </Label>
        <Textarea
          id="disputeDescription"
          value={data.disputeDescription}
          onChange={(e) => onChange({ disputeDescription: e.target.value })}
          placeholder="Explain what happened, when it occurred, what was agreed upon, and how the other party failed to meet their obligations. Include all relevant details — dates, amounts, and any prior communications."
          rows={6}
          className="resize-y min-h-[120px]"
          required
          data-ocid="dispute_step.description_textarea"
        />
        <p className="text-xs text-muted-foreground mt-1">
          Be specific — include dates, amounts, and key events.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="form-group">
          <Label htmlFor="incidentDate" className="text-sm font-medium">
            Date of incident / breach
          </Label>
          <Input
            id="incidentDate"
            type="date"
            value={data.incidentDate}
            onChange={(e) => onChange({ incidentDate: e.target.value })}
            data-ocid="dispute_step.date_input"
          />
        </div>

        <div className="form-group">
          <Label className="text-sm font-medium">Amount demanded</Label>
          <div className="flex gap-2">
            <Select
              value={data.currency}
              onValueChange={(v) => onChange({ currency: v })}
            >
              <SelectTrigger
                className="w-24 shrink-0"
                data-ocid="dispute_step.currency_select"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CURRENCIES.map((c) => (
                  <SelectItem key={c.code} value={c.code}>
                    {c.code} {c.symbol}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              type="number"
              min="0"
              step="0.01"
              value={data.amountDemanded}
              onChange={(e) => onChange({ amountDemanded: e.target.value })}
              placeholder="5,000.00"
              data-ocid="dispute_step.amount_input"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
