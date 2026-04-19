import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  CheckCircle2,
  Info,
  Mail,
  MailCheck,
  RefreshCw,
  XCircle,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { SiGmail } from "react-icons/si";
import {
  useGmailToken,
  useSendViaGmail,
  useStoreGmailToken,
} from "../hooks/use-backend";
import type { LetterType } from "../types";
import { LETTER_TYPE_CONFIG } from "../types";
import { isValidEmail } from "../utils/security";
import { AnimatedButton } from "./animations";

interface GmailSendModalProps {
  open: boolean;
  onClose: () => void;
  letterContent: string;
  letterType: LetterType | null;
  initialTo?: string;
}

type Step = "connect" | "compose" | "sent";

export function GmailSendModal({
  open,
  onClose,
  letterContent,
  letterType,
  initialTo = "",
}: GmailSendModalProps) {
  const letterLabel = letterType
    ? LETTER_TYPE_CONFIG[letterType].label
    : "Demand";

  const { data: isGmailConnected, refetch: refetchGmailToken } =
    useGmailToken();
  const storeToken = useStoreGmailToken();
  const {
    send,
    isSending,
    error: sendError,
    reset: resetSend,
  } = useSendViaGmail();

  const [step, setStep] = useState<Step>("connect");
  const [recipientEmail, setRecipientEmail] = useState(initialTo);
  const [subject, setSubject] = useState(`Demand Letter - ${letterLabel}`);
  const [emailError, setEmailError] = useState<string | null>(null);

  // Gmail token connect state
  const [accessToken, setAccessToken] = useState("");
  const [refreshToken, setRefreshToken] = useState("");
  const [connectError, setConnectError] = useState<string | null>(null);

  const handleClose = () => {
    resetSend();
    setEmailError(null);
    setConnectError(null);
    onClose();
  };

  const validateEmail = (val: string) => isValidEmail(val);

  const handleConnect = async () => {
    setConnectError(null);
    if (!accessToken.trim() || !refreshToken.trim()) {
      setConnectError("Both access token and refresh token are required.");
      return;
    }
    try {
      // expiresAt: 1 hour from now as nanoseconds
      const expiresAt = BigInt(Date.now() + 3600_000) * BigInt(1_000_000);
      await storeToken.mutateAsync({ accessToken, refreshToken, expiresAt });
      await refetchGmailToken();
      setStep("compose");
    } catch (e) {
      setConnectError(
        e instanceof Error ? e.message : "Failed to connect Gmail.",
      );
    }
  };

  const handleSend = async () => {
    setEmailError(null);
    if (!validateEmail(recipientEmail)) {
      setEmailError("Please enter a valid email address.");
      return;
    }
    const ok = await send(recipientEmail, letterContent, subject);
    if (ok) setStep("sent");
  };

  // Reset to compose if opened fresh with connected token
  const effectiveStep =
    step === "connect" && isGmailConnected ? "compose" : step;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent
        className="max-w-md"
        data-ocid="gmail_send.dialog"
        aria-label="Send letter via Gmail"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <DialogHeader>
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 bg-destructive/10 rounded-lg flex items-center justify-center shrink-0">
                <SiGmail
                  className="w-5 h-5 text-destructive"
                  aria-hidden="true"
                />
              </div>
              <div>
                <DialogTitle className="text-base font-semibold">
                  Send via Gmail
                </DialogTitle>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Deliver your demand letter directly to the recipient's inbox
                </p>
              </div>
            </div>
          </DialogHeader>

          {/* ── Step: Connect Gmail ── */}
          {effectiveStep === "connect" && (
            <div className="space-y-4 mt-2">
              <div className="rounded-lg bg-muted/50 border border-border p-3 flex gap-2.5">
                <Info
                  className="w-4 h-4 text-primary shrink-0 mt-0.5"
                  aria-hidden="true"
                />
                <div className="text-xs text-foreground space-y-1">
                  <p className="font-medium">
                    How to get your Gmail OAuth tokens:
                  </p>
                  <ol className="list-decimal ml-4 space-y-0.5 text-muted-foreground">
                    <li>
                      Go to{" "}
                      <a
                        href="https://developers.google.com/oauthplayground"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-accent underline"
                      >
                        Google OAuth Playground
                      </a>
                    </li>
                    <li>
                      Select <strong>Gmail API v1</strong> →{" "}
                      <code className="bg-muted px-1 rounded text-[10px]">
                        gmail.send
                      </code>
                    </li>
                    <li>Authorize and exchange for tokens</li>
                    <li>Paste them below</li>
                  </ol>
                </div>
              </div>

              <div className="space-y-3">
                <div className="form-group">
                  <Label
                    htmlFor="gmail_access_token"
                    className="text-sm font-medium"
                  >
                    Access Token
                  </Label>
                  <Input
                    id="gmail_access_token"
                    value={accessToken}
                    onChange={(e) => setAccessToken(e.target.value)}
                    placeholder="ya29.a0…"
                    className="font-mono text-xs"
                    data-ocid="gmail_send.access_token_input"
                  />
                </div>
                <div className="form-group">
                  <Label
                    htmlFor="gmail_refresh_token"
                    className="text-sm font-medium"
                  >
                    Refresh Token
                  </Label>
                  <Input
                    id="gmail_refresh_token"
                    value={refreshToken}
                    onChange={(e) => setRefreshToken(e.target.value)}
                    placeholder="1//04…"
                    className="font-mono text-xs"
                    data-ocid="gmail_send.refresh_token_input"
                  />
                </div>
              </div>

              {connectError && (
                <p
                  className="text-xs text-destructive"
                  role="alert"
                  data-ocid="gmail_send.connect_error"
                >
                  {connectError}
                </p>
              )}

              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClose}
                  data-ocid="gmail_send.cancel_button"
                >
                  Cancel
                </Button>
                <AnimatedButton>
                  <Button
                    size="sm"
                    onClick={handleConnect}
                    disabled={storeToken.isPending}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                    data-ocid="gmail_send.connect_button"
                  >
                    {storeToken.isPending ? (
                      <RefreshCw
                        className="w-3.5 h-3.5 mr-1.5 animate-spin"
                        aria-hidden="true"
                      />
                    ) : (
                      <Mail className="w-3.5 h-3.5 mr-1.5" aria-hidden="true" />
                    )}
                    Connect Gmail
                  </Button>
                </AnimatedButton>
              </div>
            </div>
          )}

          {/* ── Step: Compose ── */}
          {effectiveStep === "compose" && (
            <div className="space-y-4 mt-2">
              {isGmailConnected && (
                <Badge
                  variant="secondary"
                  className="bg-accent/10 text-accent border-accent/20 text-xs"
                  data-ocid="gmail_send.connected_badge"
                >
                  <CheckCircle2 className="w-3 h-3 mr-1" aria-hidden="true" />
                  Gmail connected
                </Badge>
              )}

              <div className="space-y-3">
                <div className="form-group">
                  <Label
                    htmlFor="recipient_email"
                    className="text-sm font-medium"
                  >
                    Recipient Email
                    <span className="text-destructive ml-0.5">*</span>
                  </Label>
                  <Input
                    id="recipient_email"
                    type="email"
                    value={recipientEmail}
                    onChange={(e) => {
                      setRecipientEmail(e.target.value);
                      setEmailError(null);
                    }}
                    onBlur={() => {
                      if (recipientEmail && !validateEmail(recipientEmail)) {
                        setEmailError("Please enter a valid email address.");
                      }
                    }}
                    placeholder="recipient@example.com"
                    maxLength={254}
                    data-ocid="gmail_send.recipient_input"
                  />
                  {emailError && (
                    <p
                      className="text-xs text-destructive mt-1"
                      role="alert"
                      data-ocid="gmail_send.email_error"
                    >
                      {emailError}
                    </p>
                  )}
                </div>

                <div className="form-group">
                  <Label
                    htmlFor="email_subject"
                    className="text-sm font-medium"
                  >
                    Subject
                  </Label>
                  <Input
                    id="email_subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Demand Letter"
                    data-ocid="gmail_send.subject_input"
                  />
                </div>
              </div>

              {sendError && (
                <div
                  className="flex items-start gap-2 p-2.5 rounded-lg bg-destructive/10 border border-destructive/20"
                  role="alert"
                  data-ocid="gmail_send.error_state"
                >
                  <XCircle
                    className="w-4 h-4 text-destructive shrink-0 mt-0.5"
                    aria-hidden="true"
                  />
                  <p className="text-xs text-destructive">{sendError}</p>
                </div>
              )}

              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClose}
                  data-ocid="gmail_send.cancel_button"
                >
                  Cancel
                </Button>
                <AnimatedButton>
                  <Button
                    size="sm"
                    onClick={handleSend}
                    disabled={isSending || !recipientEmail}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                    data-ocid="gmail_send.submit_button"
                  >
                    {isSending ? (
                      <>
                        <RefreshCw
                          className="w-3.5 h-3.5 mr-1.5 animate-spin"
                          aria-hidden="true"
                        />
                        Sending…
                      </>
                    ) : (
                      <>
                        <Mail
                          className="w-3.5 h-3.5 mr-1.5"
                          aria-hidden="true"
                        />
                        Send Letter
                      </>
                    )}
                  </Button>
                </AnimatedButton>
              </div>
            </div>
          )}

          {/* ── Step: Sent ── */}
          {effectiveStep === "sent" && (
            <div
              className="flex flex-col items-center text-center py-4 space-y-3"
              data-ocid="gmail_send.success_state"
            >
              <motion.div
                className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center"
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 280, damping: 22 }}
              >
                <MailCheck className="w-7 h-7 text-accent" aria-hidden="true" />
              </motion.div>
              <div>
                <p className="font-semibold text-foreground text-base">
                  Letter Sent!
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Your demand letter has been sent to{" "}
                  <strong className="text-foreground">{recipientEmail}</strong>
                </p>
              </div>
              <AnimatedButton>
                <Button
                  size="sm"
                  onClick={handleClose}
                  className="bg-accent hover:bg-accent/90 text-accent-foreground"
                  data-ocid="gmail_send.close_button"
                >
                  Done
                </Button>
              </AnimatedButton>
            </div>
          )}
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
