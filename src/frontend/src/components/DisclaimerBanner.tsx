import { AlertTriangle, X } from "lucide-react";
import { useState } from "react";

interface DisclaimerBannerProps {
  dismissible?: boolean;
  className?: string;
}

export function DisclaimerBanner({
  dismissible = false,
  className = "",
}: DisclaimerBannerProps) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div
      role="alert"
      className={`warning-banner flex items-start justify-between gap-3 ${className}`}
      data-ocid="disclaimer.banner"
    >
      <div className="flex items-start gap-2 min-w-0">
        <AlertTriangle
          className="w-4 h-4 mt-0.5 shrink-0 text-yellow-700"
          aria-hidden="true"
        />
        <p className="text-sm text-yellow-800">
          <strong className="font-semibold">Disclaimer:</strong> This tool does
          not provide legal advice. The generated letter is a starting point —
          consult a licensed attorney before sending for complex legal matters.
          No attorney-client relationship is formed.
        </p>
      </div>
      {dismissible && (
        <button
          type="button"
          onClick={() => setDismissed(true)}
          aria-label="Dismiss disclaimer"
          className="shrink-0 text-yellow-700 hover:text-yellow-900 transition-fast"
          data-ocid="disclaimer.close_button"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
