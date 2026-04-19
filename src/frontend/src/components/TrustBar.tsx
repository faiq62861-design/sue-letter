import { Lock, Shield } from "lucide-react";

interface TrustBarProps {
  variant?: "header" | "footer" | "compact";
  className?: string;
}

export function TrustBar({
  variant = "header",
  className = "",
}: TrustBarProps) {
  if (variant === "compact") {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <span className="trust-badge">
          <Lock className="w-3 h-3 trust-icon" aria-hidden="true" />
          256-bit SSL
        </span>
        <span className="trust-badge">
          <Shield className="w-3 h-3 trust-icon" aria-hidden="true" />
          Not Legal Advice
        </span>
      </div>
    );
  }

  if (variant === "footer") {
    return (
      <div
        className={`flex flex-wrap items-center justify-center gap-4 ${className}`}
      >
        <span className="trust-badge">
          <Lock className="w-3.5 h-3.5 trust-icon" aria-hidden="true" />
          256-bit SSL Secure
        </span>
        <span className="text-border">|</span>
        <span className="trust-badge">
          <Shield className="w-3.5 h-3.5 trust-icon" aria-hidden="true" />
          Not Legal Advice
        </span>
        <span className="text-border">|</span>
        <span className="stat-badge">Trusted by 10,000+ users</span>
      </div>
    );
  }

  // Default: header variant
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <span className="trust-badge">
        <Lock className="w-3.5 h-3.5 trust-icon" aria-hidden="true" />
        256-bit SSL Secure
      </span>
      <div
        className="flex items-center gap-1.5 px-2.5 py-1 border border-accent/40 rounded-full bg-accent/10"
        aria-label="Trusted by over 10,000 users"
      >
        <Shield className="w-3.5 h-3.5 text-accent" aria-hidden="true" />
        <span className="text-xs font-medium text-accent uppercase tracking-wide">
          Trusted by 10,000+ users
        </span>
      </div>
    </div>
  );
}
