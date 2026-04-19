import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { LetterFormData } from "../../types";

interface SenderStepProps {
  data: LetterFormData;
  onChange: (data: Partial<LetterFormData>) => void;
}

export function SenderStep({ data, onChange }: SenderStepProps) {
  return (
    <div className="space-y-4" data-ocid="sender_step.section">
      <div>
        <h2 className="text-lg font-semibold text-foreground">
          Your contact details
        </h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          This information will appear as the sender in your demand letter.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="form-group sm:col-span-2">
          <Label htmlFor="senderName" className="text-sm font-medium">
            Full Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="senderName"
            value={data.senderName}
            onChange={(e) => onChange({ senderName: e.target.value })}
            placeholder="Jane Smith"
            required
            data-ocid="sender_step.name_input"
          />
        </div>

        <div className="form-group sm:col-span-2">
          <Label htmlFor="senderAddress" className="text-sm font-medium">
            Street Address <span className="text-destructive">*</span>
          </Label>
          <Input
            id="senderAddress"
            value={data.senderAddress}
            onChange={(e) => onChange({ senderAddress: e.target.value })}
            placeholder="123 Main Street, Apt 4B"
            required
            data-ocid="sender_step.address_input"
          />
        </div>

        <div className="form-group">
          <Label htmlFor="senderCity" className="text-sm font-medium">
            City <span className="text-destructive">*</span>
          </Label>
          <Input
            id="senderCity"
            value={data.senderCity}
            onChange={(e) => onChange({ senderCity: e.target.value })}
            placeholder="Los Angeles"
            required
            data-ocid="sender_step.city_input"
          />
        </div>

        <div className="form-group">
          <Label htmlFor="senderState" className="text-sm font-medium">
            State / Province <span className="text-destructive">*</span>
          </Label>
          <Input
            id="senderState"
            value={data.senderState}
            onChange={(e) => onChange({ senderState: e.target.value })}
            placeholder="California"
            required
            data-ocid="sender_step.state_input"
          />
        </div>

        <div className="form-group">
          <Label htmlFor="senderZip" className="text-sm font-medium">
            ZIP / Postal Code <span className="text-destructive">*</span>
          </Label>
          <Input
            id="senderZip"
            value={data.senderZip}
            onChange={(e) => onChange({ senderZip: e.target.value })}
            placeholder="90001"
            required
            data-ocid="sender_step.zip_input"
          />
        </div>

        <div className="form-group">
          <Label htmlFor="senderPhone" className="text-sm font-medium">
            Phone Number <span className="text-destructive">*</span>
          </Label>
          <Input
            id="senderPhone"
            type="tel"
            value={data.senderPhone}
            onChange={(e) => onChange({ senderPhone: e.target.value })}
            placeholder="(310) 555-0123"
            required
            data-ocid="sender_step.phone_input"
          />
        </div>

        <div className="form-group sm:col-span-2">
          <Label htmlFor="senderEmail" className="text-sm font-medium">
            Email Address <span className="text-destructive">*</span>
          </Label>
          <Input
            id="senderEmail"
            type="email"
            value={data.senderEmail}
            onChange={(e) => onChange({ senderEmail: e.target.value })}
            placeholder="jane@example.com"
            required
            data-ocid="sender_step.email_input"
          />
        </div>
      </div>
    </div>
  );
}
