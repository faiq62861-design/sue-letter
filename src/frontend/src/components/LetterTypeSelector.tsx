import { AnimatedCard, StaggeredList } from "@/components/animations";
import { Check } from "lucide-react";
import { LETTER_TYPE_CONFIG } from "../types";
import type { LetterType } from "../types";

interface LetterTypeSelectorProps {
  value: LetterType | null;
  onChange: (type: LetterType) => void;
}

export function LetterTypeSelector({
  value,
  onChange,
}: LetterTypeSelectorProps) {
  const entries = Object.entries(LETTER_TYPE_CONFIG) as [
    LetterType,
    (typeof LETTER_TYPE_CONFIG)[LetterType],
  ][];

  return (
    <div className="space-y-3" data-ocid="letter_type.section">
      <h2 className="text-lg font-semibold text-foreground">
        What type of demand letter do you need?
      </h2>
      <p className="text-sm text-muted-foreground">
        Select the category that best matches your situation.
      </p>
      <StaggeredList
        staggerDelay={0.06}
        className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4"
      >
        {entries.map(([type, config], idx) => {
          const isSelected = value === type;
          return (
            <AnimatedCard key={type} delay={idx * 0.06} enableTilt>
              <button
                type="button"
                onClick={() => onChange(type)}
                aria-pressed={isSelected}
                data-ocid={`letter_type.item.${idx + 1}`}
                className={`relative flex flex-col items-start gap-2 rounded-lg border-2 p-4 text-left transition-smooth cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-ring w-full ${
                  isSelected
                    ? "border-accent bg-accent/10 shadow-md"
                    : "border-border bg-card hover:border-accent/50 hover:bg-accent/5"
                }`}
              >
                {isSelected && (
                  <div className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-accent flex items-center justify-center">
                    <Check
                      className="w-3 h-3 text-accent-foreground"
                      aria-hidden="true"
                    />
                  </div>
                )}
                <span className="text-2xl" role="img" aria-label={config.label}>
                  {config.icon}
                </span>
                <div className="min-w-0">
                  <p
                    className={`text-sm font-semibold leading-tight ${
                      isSelected ? "text-primary" : "text-foreground"
                    }`}
                  >
                    {config.label}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-snug line-clamp-2">
                    {config.description}
                  </p>
                </div>
              </button>
            </AnimatedCard>
          );
        })}
      </StaggeredList>
    </div>
  );
}
