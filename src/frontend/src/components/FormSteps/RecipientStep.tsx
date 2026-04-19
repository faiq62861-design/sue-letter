import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SiGmail } from "react-icons/si";
import type { LetterFormData } from "../../types";

const RECIPIENT_ROLES = [
  "Individual",
  "Business Owner",
  "Property Manager",
  "Landlord",
  "Contractor",
  "Attorney",
  "Insurance Adjuster",
  "Human Resources",
  "Corporate Legal Dept.",
  "Other",
];

interface RecipientStepProps {
  data: LetterFormData;
  onChange: (data: Partial<LetterFormData>) => void;
}

export function RecipientStep({ data, onChange }: RecipientStepProps) {
  return (
    <div className="space-y-4" data-ocid="recipient_step.section">
      <div>
        <h2 className="text-lg font-semibold text-foreground">
          Recipient details
        </h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          Who are you sending this demand letter to?
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="form-group sm:col-span-2">
          <Label htmlFor="recipientName" className="text-sm font-medium">
            Full Name or Company <span className="text-destructive">*</span>
          </Label>
          <Input
            id="recipientName"
            value={data.recipientName}
            onChange={(e) => onChange({ recipientName: e.target.value })}
            placeholder="John Doe or Acme Corp."
            required
            data-ocid="recipient_step.name_input"
          />
        </div>

        <div className="form-group">
          <Label htmlFor="recipientTitle" className="text-sm font-medium">
            Role / Title
          </Label>
          <Select
            value={data.recipientTitle}
            onValueChange={(v) => onChange({ recipientTitle: v })}
          >
            <SelectTrigger
              id="recipientTitle"
              data-ocid="recipient_step.role_select"
            >
              <SelectValue placeholder="Select role…" />
            </SelectTrigger>
            <SelectContent>
              {RECIPIENT_ROLES.map((role) => (
                <SelectItem key={role} value={role}>
                  {role}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="form-group">
          <Label htmlFor="recipientCompany" className="text-sm font-medium">
            Company (if different)
          </Label>
          <Input
            id="recipientCompany"
            value={data.recipientCompany}
            onChange={(e) => onChange({ recipientCompany: e.target.value })}
            placeholder="Company Name Inc."
            data-ocid="recipient_step.company_input"
          />
        </div>

        <div className="form-group sm:col-span-2">
          <Label htmlFor="recipientAddress" className="text-sm font-medium">
            Street Address <span className="text-destructive">*</span>
          </Label>
          <Input
            id="recipientAddress"
            value={data.recipientAddress}
            onChange={(e) => onChange({ recipientAddress: e.target.value })}
            placeholder="456 Oak Avenue"
            required
            data-ocid="recipient_step.address_input"
          />
        </div>

        <div className="form-group">
          <Label htmlFor="recipientCity" className="text-sm font-medium">
            City <span className="text-destructive">*</span>
          </Label>
          <Input
            id="recipientCity"
            value={data.recipientCity}
            onChange={(e) => onChange({ recipientCity: e.target.value })}
            placeholder="San Francisco"
            required
            data-ocid="recipient_step.city_input"
          />
        </div>

        <div className="form-group">
          <Label htmlFor="recipientState" className="text-sm font-medium">
            State / Province
          </Label>
          <Input
            id="recipientState"
            value={data.recipientState}
            onChange={(e) => onChange({ recipientState: e.target.value })}
            placeholder="California"
            data-ocid="recipient_step.state_input"
          />
        </div>

        <div className="form-group">
          <Label htmlFor="recipientZip" className="text-sm font-medium">
            ZIP / Postal Code
          </Label>
          <Input
            id="recipientZip"
            value={data.recipientZip}
            onChange={(e) => onChange({ recipientZip: e.target.value })}
            placeholder="94102"
            data-ocid="recipient_step.zip_input"
          />
        </div>

        {/* Gmail / Email field */}
        <div className="form-group sm:col-span-2">
          <Label
            htmlFor="recipientEmail"
            className="text-sm font-medium flex items-center gap-1.5"
          >
            <span className="inline-flex items-center justify-center w-4 h-4 rounded-sm bg-destructive/10">
              <SiGmail
                className="w-2.5 h-2.5 text-destructive"
                aria-hidden="true"
              />
            </span>
            Recipient Email
            <span className="text-muted-foreground font-normal text-xs">
              (Gmail)
            </span>
          </Label>
          <Input
            id="recipientEmail"
            type="email"
            value={data.recipientEmail}
            onChange={(e) => onChange({ recipientEmail: e.target.value })}
            placeholder="recipient@gmail.com"
            data-ocid="recipient_step.email_input"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Used to send the letter directly via Gmail
          </p>
        </div>
      </div>
    </div>
  );
}
