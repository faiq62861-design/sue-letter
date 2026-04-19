import { Check } from "lucide-react";
import { motion } from "motion/react";

const STEPS = [
  { label: "Letter Type" },
  { label: "Sender" },
  { label: "Recipient" },
  { label: "Dispute" },
  { label: "Resolution" },
  { label: "Jurisdiction" },
  { label: "Tone" },
  { label: "Evidence" },
  { label: "Prior Contact" },
];

interface StepIndicatorProps {
  currentStep: number;
  totalSteps?: number;
}

export function StepIndicator({
  currentStep,
  totalSteps = 9,
}: StepIndicatorProps) {
  const progress = ((currentStep - 1) / (totalSteps - 1)) * 100;

  return (
    <div className="space-y-3" data-ocid="step_indicator.panel">
      {/* Mobile: compact */}
      <div className="md:hidden">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-foreground">
            Step {currentStep} of {totalSteps} — {STEPS[currentStep - 1]?.label}
          </span>
          <span className="text-xs text-muted-foreground">
            {Math.round(progress)}%
          </span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-accent rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Desktop: full step list */}
      <div className="hidden md:block">
        <div
          className="flex items-center gap-1 mb-3"
          aria-label="Progress indicator"
        >
          {STEPS.map((step, i) => {
            const stepNum = i + 1;
            const isCompleted = stepNum < currentStep;
            const isActive = stepNum === currentStep;
            return (
              <div key={stepNum} className="flex items-center flex-1">
                <div className="flex flex-col items-center min-w-0 flex-1">
                  <motion.div
                    animate={isActive ? { scale: [1, 1.2, 1] } : { scale: 1 }}
                    transition={
                      isActive
                        ? { duration: 0.4, ease: "easeInOut" }
                        : { duration: 0.2 }
                    }
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-smooth border-2 ${
                      isCompleted
                        ? "bg-accent border-accent text-accent-foreground"
                        : isActive
                          ? "bg-primary border-primary text-primary-foreground"
                          : "bg-card border-border text-muted-foreground"
                    }`}
                    aria-label={`Step ${stepNum}: ${step.label}${isCompleted ? " (completed)" : isActive ? " (current)" : ""}`}
                    data-ocid={`step_indicator.step.${stepNum}`}
                  >
                    {isCompleted ? (
                      <Check className="w-3.5 h-3.5" aria-hidden="true" />
                    ) : (
                      stepNum
                    )}
                  </motion.div>
                  <span
                    className={`text-[10px] mt-1 text-center leading-tight truncate w-full px-0.5 ${
                      isActive
                        ? "text-primary font-semibold"
                        : isCompleted
                          ? "text-accent"
                          : "text-muted-foreground"
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className="h-0.5 flex-1 mx-1 rounded-full bg-muted overflow-hidden">
                    <motion.div
                      className="h-full bg-accent rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: isCompleted ? "100%" : "0%" }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
