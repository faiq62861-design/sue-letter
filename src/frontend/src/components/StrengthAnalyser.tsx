import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  TrendingUp,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import type { StrengthAnalysis } from "../types";
import { AnimatedSection, CountUp, StaggeredList } from "./animations";

interface StrengthAnalyserProps {
  analysis: StrengthAnalysis | null;
  isLoading?: boolean;
  analysisFailed?: boolean;
}

function ScoreBadge({ score }: { score: number }) {
  const color =
    score >= 8
      ? "bg-accent/20 text-accent border-accent/40"
      : score >= 5
        ? "bg-yellow-100 text-yellow-800 border-yellow-300"
        : "bg-destructive/10 text-destructive border-destructive/30";

  return (
    <div
      className={`w-14 h-14 rounded-full border-2 flex items-center justify-center text-xl font-bold shrink-0 ${color}`}
      aria-label={`Strength score: ${score} out of 10`}
    >
      <CountUp end={score} duration={1.2} />
    </div>
  );
}

function LikelihoodBadge({
  value,
}: { value: StrengthAnalysis["responseLikelihood"] }) {
  const config: Record<"Low" | "Medium" | "High", string> = {
    Low: "bg-destructive/10 text-destructive",
    Medium: "bg-yellow-100 text-yellow-800",
    High: "bg-accent/20 text-accent",
  };
  const cls = config[value] ?? "bg-muted text-muted-foreground";
  return (
    <Badge className={`${cls} border-0`} data-ocid="strength.likelihood_badge">
      Response Likelihood: {value}
    </Badge>
  );
}

export function StrengthAnalyser({
  analysis,
  isLoading,
  analysisFailed,
}: StrengthAnalyserProps) {
  const [open, setOpen] = useState(false);

  // Auto-open the panel when loading starts or analysis data arrives
  useEffect(() => {
    if (isLoading || analysis) {
      setOpen(true);
    }
  }, [isLoading, analysis]);

  return (
    <Collapsible open={open} onOpenChange={setOpen} data-ocid="strength.panel">
      <CollapsibleTrigger asChild>
        <Button
          variant="outline"
          className="w-full flex items-center justify-between px-4 py-3 h-auto"
          data-ocid="strength.toggle"
        >
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-accent" aria-hidden="true" />
            <span className="text-sm font-semibold">
              Letter Strength Analyser
            </span>
            {analysis && (
              <span
                className={`text-xs font-bold ml-1 ${
                  analysis.score >= 8
                    ? "text-accent"
                    : analysis.score >= 5
                      ? "text-yellow-600"
                      : "text-destructive"
                }`}
              >
                {analysis.score}/10
              </span>
            )}
          </div>
          <ChevronDown
            className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${open ? "rotate-180" : ""}`}
            aria-hidden="true"
          />
        </Button>
      </CollapsibleTrigger>

      <CollapsibleContent>
        <AnimatedSection direction="up" delay={0.05}>
          <div className="border border-t-0 rounded-b-lg bg-card p-4 space-y-4">
            {isLoading && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                Analysing your letter…
              </div>
            )}

            {!isLoading && !analysis && !analysisFailed && (
              <p className="text-sm text-muted-foreground text-center py-2">
                Generate your letter first to see the strength analysis.
              </p>
            )}

            {!isLoading && analysisFailed && !analysis && (
              <p
                className="text-sm text-destructive text-center py-2"
                data-ocid="strength.error_state"
              >
                Strength analysis could not be loaded. Please try regenerating
                your letter.
              </p>
            )}

            {analysis && (
              <>
                <div className="flex items-center gap-4">
                  <ScoreBadge score={analysis.score} />
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-foreground">
                      {analysis.score >= 8
                        ? "Strong letter"
                        : analysis.score >= 5
                          ? "Adequate letter"
                          : "Needs improvement"}
                    </p>
                    <LikelihoodBadge value={analysis.responseLikelihood} />
                  </div>
                </div>

                {/* Animated score bar */}
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-accent rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${(analysis.score / 10) * 100}%` }}
                    transition={{ duration: 1, ease: "easeOut", delay: 0.1 }}
                  />
                </div>

                {analysis.strengths.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-foreground uppercase tracking-wide">
                      Strengths
                    </p>
                    <StaggeredList staggerDelay={0.08} className="space-y-1">
                      {analysis.strengths.map((s) => (
                        <li
                          key={s}
                          className="flex items-start gap-2 text-sm list-none"
                        >
                          <CheckCircle2
                            className="w-4 h-4 text-accent shrink-0 mt-0.5"
                            aria-hidden="true"
                          />
                          <span className="text-foreground">{s}</span>
                        </li>
                      ))}
                    </StaggeredList>
                  </div>
                )}

                {analysis.improvements.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-foreground uppercase tracking-wide">
                      Suggested Improvements
                    </p>
                    <StaggeredList staggerDelay={0.08} className="space-y-1">
                      {analysis.improvements.map((imp) => (
                        <li
                          key={imp}
                          className="flex items-start gap-2 text-sm list-none"
                        >
                          <AlertCircle
                            className="w-4 h-4 text-yellow-500 shrink-0 mt-0.5"
                            aria-hidden="true"
                          />
                          <span className="text-foreground">{imp}</span>
                        </li>
                      ))}
                    </StaggeredList>
                  </div>
                )}
              </>
            )}
          </div>
        </AnimatedSection>
      </CollapsibleContent>
    </Collapsible>
  );
}
