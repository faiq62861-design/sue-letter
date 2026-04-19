import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Building2, Check, CreditCard, Zap } from "lucide-react";
import { motion } from "motion/react";
import { useUIStore } from "../store/uiStore";
import { PLAN_CONFIG } from "../types";
import { LegalDisclaimer } from "./LegalDisclaimer";
import { AnimatedButton } from "./animations";

const PLAN_ICONS = {
  Free: null,
  Pro: Zap,
  Business: Building2,
  PayPerLetter: CreditCard,
};

export function UpgradeModal() {
  const { upgradeModalOpen, setUpgradeModalOpen } = useUIStore();

  const handleUpgrade = (planId: string) => {
    // Stripe checkout will be wired in once the extension is active
    console.log("Upgrade to:", planId);
    setUpgradeModalOpen(false);
  };

  return (
    <Dialog open={upgradeModalOpen} onOpenChange={setUpgradeModalOpen}>
      <DialogContent
        className="max-w-2xl w-full p-0 overflow-hidden"
        data-ocid="upgrade_modal.dialog"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <DialogHeader className="px-6 pt-6 pb-0">
            <DialogTitle className="text-xl font-semibold text-foreground">
              You've reached your free limit
            </DialogTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Free accounts include 2 letters per month. Upgrade to continue
              generating letters.
            </p>
          </DialogHeader>

          <div className="px-6 py-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {PLAN_CONFIG.map((plan, i) => {
              const IconComp = PLAN_ICONS[plan.id];
              return (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 + i * 0.07, duration: 0.28 }}
                  className={`relative rounded-lg border p-4 flex flex-col gap-3 ${
                    plan.highlight
                      ? "border-accent bg-accent/5 shadow-elevated"
                      : "border-border bg-card"
                  }`}
                  data-ocid={`upgrade_modal.${plan.id.toLowerCase()}_card`}
                >
                  {plan.highlight && (
                    <Badge className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground text-xs px-2.5 py-0.5 whitespace-nowrap">
                      Most Popular
                    </Badge>
                  )}

                  <div className="flex items-center gap-2">
                    {IconComp && (
                      <div
                        className={`w-7 h-7 rounded-md flex items-center justify-center ${
                          plan.highlight ? "bg-accent/20" : "bg-muted"
                        }`}
                      >
                        <IconComp
                          className={`w-4 h-4 ${plan.highlight ? "text-accent" : "text-muted-foreground"}`}
                          aria-hidden="true"
                        />
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        {plan.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {plan.priceLabel}
                      </p>
                    </div>
                  </div>

                  <ul className="space-y-1.5 flex-1">
                    {plan.features.map((f) => (
                      <li
                        key={f}
                        className="flex items-start gap-1.5 text-xs text-muted-foreground"
                      >
                        <Check
                          className="w-3.5 h-3.5 mt-0.5 shrink-0 text-accent"
                          aria-hidden="true"
                        />
                        {f}
                      </li>
                    ))}
                  </ul>

                  {plan.id === "Free" ? (
                    <Button
                      variant="outline"
                      size="sm"
                      disabled
                      className="w-full text-xs"
                      data-ocid="upgrade_modal.current_plan_button"
                    >
                      Current Plan
                    </Button>
                  ) : (
                    <AnimatedButton>
                      <Button
                        size="sm"
                        onClick={() => handleUpgrade(plan.id)}
                        className={`w-full text-xs font-medium ${
                          plan.highlight
                            ? "bg-accent hover:bg-accent/90 text-accent-foreground"
                            : "bg-primary hover:bg-primary/90 text-primary-foreground"
                        }`}
                        data-ocid={`upgrade_modal.upgrade_${plan.id.toLowerCase()}_button`}
                      >
                        Upgrade to {plan.name}
                      </Button>
                    </AnimatedButton>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Pay per letter */}
          <div className="px-6 pb-2">
            <div className="flex items-center justify-between rounded-lg border border-border bg-muted/40 px-4 py-3">
              <div className="flex items-center gap-2">
                <CreditCard
                  className="w-4 h-4 text-muted-foreground"
                  aria-hidden="true"
                />
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Pay per letter
                  </p>
                  <p className="text-xs text-muted-foreground">
                    No subscription — one-time payment
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-foreground">
                  $2.99
                </span>
                <AnimatedButton>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleUpgrade("PayPerLetter")}
                    className="text-xs"
                    data-ocid="upgrade_modal.pay_per_letter_button"
                  >
                    Buy Now
                  </Button>
                </AnimatedButton>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-border bg-muted/20">
            <LegalDisclaimer compact />
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
