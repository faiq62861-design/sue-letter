import type { LetterFormData, LetterTone } from "../../types";

interface ToneOption {
  value: LetterTone;
  label: string;
  tagline: string;
  preview: string;
  badge: string;
  badgeColor: string;
}

const TONE_OPTIONS: ToneOption[] = [
  {
    value: "Firm",
    label: "Firm",
    tagline: "Professional & measured",
    preview:
      "I am writing to formally request payment of the outstanding amount of $[X] within 14 days. I trust that we can resolve this matter amicably without further action.",
    badge: "Recommended",
    badgeColor: "bg-accent/20 text-accent",
  },
  {
    value: "Assertive",
    label: "Assertive",
    tagline: "Stronger & direct",
    preview:
      "You are hereby notified that your failure to remit payment constitutes a material breach. I demand immediate payment of $[X] within 14 days. Failure to comply will result in legal action.",
    badge: "Most effective",
    badgeColor: "bg-primary/10 text-primary",
  },
  {
    value: "FinalWarning",
    label: "Final Warning",
    tagline: "Maximum urgency",
    preview:
      "FINAL NOTICE: This is your last opportunity to resolve this matter before I file a lawsuit. Unless full payment of $[X] is received within 7 days, I will file without further notice.",
    badge: "Last resort",
    badgeColor: "bg-destructive/10 text-destructive",
  },
];

interface ToneStepProps {
  data: LetterFormData;
  onChange: (data: Partial<LetterFormData>) => void;
}

export function ToneStep({ data, onChange }: ToneStepProps) {
  return (
    <div className="space-y-4" data-ocid="tone_step.section">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Letter tone</h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          Choose how assertive your demand letter should be.
        </p>
      </div>

      <div className="space-y-3">
        {TONE_OPTIONS.map((opt) => {
          const isSelected = data.tone === opt.value;
          return (
            <label
              key={opt.value}
              className={`flex flex-col gap-2 rounded-lg border-2 p-4 cursor-pointer transition-smooth ${
                isSelected
                  ? "border-accent bg-accent/10"
                  : "border-border bg-card hover:border-accent/40"
              }`}
              data-ocid={`tone_step.${opt.value.toLowerCase()}_radio`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="tone"
                    value={opt.value}
                    checked={isSelected}
                    onChange={() => onChange({ tone: opt.value })}
                    className="accent-accent w-4 h-4"
                    aria-label={opt.label}
                  />
                  <div>
                    <span className="font-semibold text-foreground text-sm">
                      {opt.label}
                    </span>
                    <span className="text-muted-foreground text-xs ml-2">
                      — {opt.tagline}
                    </span>
                  </div>
                </div>
                <span
                  className={`text-xs font-medium px-2 py-0.5 rounded-full ${opt.badgeColor}`}
                >
                  {opt.badge}
                </span>
              </div>
              <p className="text-xs text-muted-foreground italic leading-relaxed pl-7">
                "{opt.preview}"
              </p>
            </label>
          );
        })}
      </div>
    </div>
  );
}
