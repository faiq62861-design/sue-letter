import {
  AnimatedButton,
  AnimatedCard,
  AnimatedSection,
  CountUp,
  StaggeredList,
} from "@/components/animations";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Clock,
  Download,
  FileText,
  Lock,
  Mail,
  MessageSquare,
  PlusCircle,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Trophy,
} from "lucide-react";
import { useState } from "react";
import {
  recordDownloadLocally,
  useCurrentUser,
  useLetterHistory,
} from "../hooks/use-backend";
import {
  type GeneratedLetter,
  LETTER_TYPE_CONFIG,
  type LetterStatus,
  type LetterType,
  PLAN_CONFIG,
} from "../types";
import { printLetter } from "../utils/pdfGenerator";

// ─── Constants ────────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
  LetterStatus,
  { label: string; className: string; icon: React.ReactNode }
> = {
  Draft: {
    label: "Draft",
    className: "bg-muted text-muted-foreground border-border",
    icon: <Clock className="w-3 h-3" aria-hidden="true" />,
  },
  Sent: {
    label: "Sent",
    className: "bg-primary/10 text-primary border-primary/20",
    icon: <Mail className="w-3 h-3" aria-hidden="true" />,
  },
  ResponseReceived: {
    label: "Response Received",
    className: "bg-accent/15 text-accent border-accent/25",
    icon: <MessageSquare className="w-3 h-3" aria-hidden="true" />,
  },
  FollowUpNeeded: {
    label: "Follow-Up Needed",
    className:
      "bg-[oklch(0.75_0.2_60)]/15 text-[oklch(0.55_0.18_60)] border-[oklch(0.75_0.2_60)]/25",
    icon: <AlertCircle className="w-3 h-3" aria-hidden="true" />,
  },
  Resolved: {
    label: "Resolved",
    className: "bg-accent/10 text-accent border-accent/20",
    icon: <CheckCircle2 className="w-3 h-3" aria-hidden="true" />,
  },
};

const STATUS_UPDATE_OPTIONS: { value: LetterStatus; label: string }[] = [
  { value: "Sent", label: "Mark as Sent" },
  { value: "ResponseReceived", label: "Response Received" },
  { value: "FollowUpNeeded", label: "Follow-Up Needed" },
  { value: "Resolved", label: "Mark as Resolved" },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: LetterStatus }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${cfg.className}`}
    >
      {cfg.icon}
      {cfg.label}
    </span>
  );
}

function LetterTypePill({ type }: { type: LetterType | null }) {
  if (!type) return null;
  const cfg = LETTER_TYPE_CONFIG[type];
  return (
    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
      <span aria-hidden="true">{cfg.icon}</span>
      {cfg.label}
    </span>
  );
}

function LetterRow({
  letter,
  index,
  onStatusChange,
  onRedownload,
}: {
  letter: GeneratedLetter;
  index: number;
  onStatusChange: (id: string, status: LetterStatus) => void;
  onRedownload: (letter: GeneratedLetter) => void;
}) {
  const date = new Date(
    Number(letter.createdAt) / 1_000_000,
  ).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const recipient =
    letter.formData.recipientName ||
    letter.formData.recipientCompany ||
    "Unknown Recipient";

  const amount = letter.formData.amountDemanded
    ? `$${Number.parseFloat(letter.formData.amountDemanded).toLocaleString()}`
    : null;

  const downloadCount = letter.downloadCount ?? 0;
  const lastDownload = letter.lastDownloadAt
    ? new Date(letter.lastDownloadAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;

  return (
    <div
      className="bg-card border border-border rounded-xl p-4 hover:shadow-md transition-shadow duration-200"
      data-ocid={`dashboard.letter.item.${index}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        {/* Icon + type */}
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
            <FileText className="w-5 h-5 text-primary" aria-hidden="true" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <LetterTypePill type={letter.formData.letterType} />
              {amount && (
                <span className="text-xs font-semibold text-foreground bg-muted px-2 py-0.5 rounded-full">
                  {amount}
                </span>
              )}
            </div>
            <p className="text-sm font-medium text-foreground truncate mt-0.5">
              To: {recipient}
            </p>
            <div className="flex items-center gap-3 mt-1 flex-wrap">
              <div className="flex items-center gap-1.5">
                <Clock
                  className="w-3 h-3 text-muted-foreground shrink-0"
                  aria-hidden="true"
                />
                <span className="text-xs text-muted-foreground">{date}</span>
              </div>
              {/* Download activity */}
              <div
                className="flex items-center gap-1.5"
                data-ocid={`dashboard.download_activity.${index}`}
              >
                <Download
                  className="w-3 h-3 text-muted-foreground shrink-0"
                  aria-hidden="true"
                />
                {downloadCount > 0 ? (
                  <span className="text-xs text-muted-foreground">
                    Downloaded {downloadCount}×
                    {lastDownload ? ` · Last ${lastDownload}` : ""}
                  </span>
                ) : (
                  <span className="text-xs text-muted-foreground/60 italic">
                    Not yet downloaded
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Status + actions */}
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          <StatusBadge status={letter.status} />

          {/* Re-download */}
          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-1.5 text-xs"
            data-ocid={`dashboard.redownload_button.${index}`}
            onClick={() => onRedownload(letter)}
          >
            <Download className="w-3.5 h-3.5" aria-hidden="true" />
            PDF
          </Button>

          {/* Follow-up */}
          <Button
            variant="outline"
            size="sm"
            asChild
            className="h-8 gap-1.5 text-xs"
            data-ocid={`dashboard.followup_button.${index}`}
          >
            <Link to="/generate">
              <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
              Follow-Up
            </Link>
          </Button>

          {/* Change status */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-8 gap-1 text-xs"
                data-ocid={`dashboard.status_dropdown.${index}`}
              >
                Status
                <ChevronDown className="w-3 h-3" aria-hidden="true" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              {STATUS_UPDATE_OPTIONS.map((opt) => (
                <DropdownMenuItem
                  key={opt.value}
                  onClick={() => onStatusChange(letter.id, opt.value)}
                  data-ocid={`dashboard.status_option.${opt.value.toLowerCase()}.${index}`}
                >
                  {opt.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}

function LetterRowSkeleton() {
  return (
    <div className="bg-card border border-border rounded-xl p-4">
      <div className="flex items-center gap-3">
        <Skeleton className="w-10 h-10 rounded-lg shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-3 w-20" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-18" />
        </div>
      </div>
    </div>
  );
}

// ─── Auth wall ────────────────────────────────────────────────────────────────

function AuthWall() {
  const { login, isLoggingIn } = useInternetIdentity();
  return (
    <div
      className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center"
      data-ocid="dashboard.auth_wall"
    >
      <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-5">
        <Lock className="w-7 h-7 text-primary" aria-hidden="true" />
      </div>
      <h2 className="text-2xl font-bold text-foreground font-display mb-2">
        Sign in to access your dashboard
      </h2>
      <p className="text-muted-foreground max-w-sm mb-8 text-sm leading-relaxed">
        Your letter history, usage stats, and status tracker are stored securely
        and accessible only to you.
      </p>
      <div className="flex items-center gap-2 mb-8 text-xs text-muted-foreground">
        <ShieldCheck className="w-4 h-4 text-accent" aria-hidden="true" />
        <span>256-bit SSL · Encrypted · Not legal advice</span>
      </div>
      <Button
        onClick={login}
        disabled={isLoggingIn}
        className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 h-11 text-sm font-semibold"
        data-ocid="dashboard.login_button"
      >
        {isLoggingIn ? (
          <>
            <div
              className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2"
              aria-hidden="true"
            />
            Connecting…
          </>
        ) : (
          <>
            <ShieldCheck className="w-4 h-4 mr-2" aria-hidden="true" />
            Sign in with Internet Identity
          </>
        )}
      </Button>
    </div>
  );
}

// ─── Stats cards ──────────────────────────────────────────────────────────────

function StatsCards({ letters }: { letters: GeneratedLetter[] }) {
  const total = letters.length;
  const resolved = letters.filter((l) => l.status === "Resolved").length;
  const responses = letters.filter(
    (l) => l.status === "ResponseReceived",
  ).length;
  const totalDownloads = letters.reduce(
    (sum, l) => sum + (l.downloadCount ?? 0),
    0,
  );

  const stats = [
    {
      label: "Total Generated",
      value: total,
      icon: <FileText className="w-5 h-5 text-primary" aria-hidden="true" />,
      bg: "bg-primary/10",
    },
    {
      label: "Total Downloads",
      value: totalDownloads,
      icon: <Download className="w-5 h-5 text-primary" aria-hidden="true" />,
      bg: "bg-primary/10",
    },
    {
      label: "Responses Received",
      value: responses,
      icon: (
        <MessageSquare className="w-5 h-5 text-accent" aria-hidden="true" />
      ),
      bg: "bg-accent/10",
    },
    {
      label: "Resolved",
      value: resolved,
      icon: <Trophy className="w-5 h-5 text-accent" aria-hidden="true" />,
      bg: "bg-accent/10",
    },
  ];

  return (
    <div
      className="grid grid-cols-2 sm:grid-cols-4 gap-3"
      data-ocid="dashboard.stats_section"
    >
      {stats.map((s, i) => (
        <AnimatedCard key={s.label} enableTilt delay={i * 0.1}>
          <Card
            className="border-border"
            data-ocid={`dashboard.stat.item.${i + 1}`}
          >
            <CardContent className="p-4">
              <div
                className={`w-9 h-9 rounded-lg ${s.bg} flex items-center justify-center mb-3`}
              >
                {s.icon}
              </div>
              <p className="text-2xl font-bold text-foreground font-display">
                <CountUp end={s.value} duration={1.5} />
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
            </CardContent>
          </Card>
        </AnimatedCard>
      ))}
    </div>
  );
}

// ─── Usage card ───────────────────────────────────────────────────────────────

function UsageCard({
  plan,
  used,
  limit,
}: {
  plan: string;
  used: number;
  limit: number | null;
}) {
  const planConfig = PLAN_CONFIG.find((p) => p.id === plan);
  const planName = planConfig?.name ?? "Free";
  const isUnlimited = limit === null;
  const pct = isUnlimited ? 100 : Math.min((used / (limit ?? 2)) * 100, 100);
  const remaining = isUnlimited ? null : Math.max((limit ?? 2) - used, 0);

  const planColors: Record<string, string> = {
    Free: "bg-muted text-muted-foreground",
    Pro: "bg-accent/15 text-accent",
    Business: "bg-primary/10 text-primary",
  };
  const badgeClass = planColors[planName] ?? planColors.Free;

  return (
    <AnimatedCard delay={0.3}>
      <Card className="border-border h-full" data-ocid="dashboard.usage_card">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold text-foreground">
              Monthly Usage
            </CardTitle>
            <Badge
              className={`text-xs px-2 py-0.5 rounded-full border-0 ${badgeClass}`}
            >
              {planName} Plan
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-end gap-1 mb-2">
            <span className="text-3xl font-bold text-foreground font-display leading-none">
              <CountUp end={used} duration={1.2} />
            </span>
            <span className="text-sm text-muted-foreground mb-0.5">
              {isUnlimited
                ? "letters generated"
                : `/ ${limit} letters this month`}
            </span>
          </div>

          {!isUnlimited && (
            <>
              <Progress
                value={pct}
                className="h-2 mb-2"
                data-ocid="dashboard.usage_progress"
              />
              <p className="text-xs text-muted-foreground">
                {remaining === 0
                  ? "Monthly limit reached — upgrade to continue"
                  : `${remaining} letter${remaining === 1 ? "" : "s"} remaining · Resets on the 1st of the month`}
              </p>
            </>
          )}

          {isUnlimited && (
            <p className="text-xs text-muted-foreground">
              Unlimited letters · No monthly cap
            </p>
          )}
        </CardContent>
      </Card>
    </AnimatedCard>
  );
}

// ─── Upgrade nudge ────────────────────────────────────────────────────────────

function UpgradeNudge({ used }: { used: number }) {
  if (used < 1) return null;
  return (
    <div
      className="rounded-xl border border-accent/30 bg-accent/10 p-5"
      data-ocid="dashboard.upgrade_nudge"
    >
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-lg bg-accent/15 flex items-center justify-center shrink-0">
          <Sparkles className="w-5 h-5 text-accent" aria-hidden="true" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground mb-1">
            Unlock unlimited letters
          </p>
          <p className="text-xs text-muted-foreground leading-relaxed mb-3">
            Get clean PDF &amp; DOCX downloads, strength analyser, next-steps
            advisor, and full letter history with Pro.
          </p>
          <AnimatedButton>
            <Button
              asChild
              size="sm"
              className="bg-accent text-accent-foreground hover:bg-accent/90 h-9 px-4 text-xs font-semibold gap-1.5"
              data-ocid="dashboard.upgrade_button"
            >
              <Link to="/pricing">
                <TrendingUp className="w-3.5 h-3.5" aria-hidden="true" />
                Upgrade to Pro — $9.99/month
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </Link>
            </Button>
          </AnimatedButton>
        </div>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const { isAuthenticated, isInitializing } = useInternetIdentity();
  const { data: letters, isLoading: lettersLoading } = useLetterHistory();
  const { data: userProfile } = useCurrentUser();
  const queryClient = useQueryClient();

  // Optimistic status state: letterId → LetterStatus
  const [optimisticStatus, setOptimisticStatus] = useState<
    Record<string, LetterStatus>
  >({});

  if (isInitializing) {
    return (
      <div
        className="flex items-center justify-center min-h-[60vh]"
        data-ocid="dashboard.loading_state"
      >
        <div className="flex flex-col items-center gap-3">
          <div
            className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin"
            aria-hidden="true"
          />
          <p className="text-sm text-muted-foreground">Loading…</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthWall />;
  }

  const resolvedLetters = (letters ?? []).map((l) => ({
    ...l,
    status: (optimisticStatus[l.id] ?? l.status) as LetterStatus,
  }));

  // Sort newest first
  const sortedLetters = [...resolvedLetters].sort(
    (a, b) => Number(b.createdAt) - Number(a.createdAt),
  );

  const plan = userProfile?.plan ?? "Free";
  const planConfig = PLAN_CONFIG.find((p) => p.id === plan);
  const lettersLimit = planConfig?.lettersPerMonth ?? 2;
  const lettersUsed = userProfile?.lettersThisMonth ?? 0;

  function handleStatusChange(id: string, status: LetterStatus) {
    setOptimisticStatus((prev) => ({ ...prev, [id]: status }));
    // Invalidate cache so next fetch reflects the real backend update
    void queryClient.invalidateQueries({ queryKey: ["letterHistory"] });
  }

  function handleRedownload(letter: GeneratedLetter) {
    printLetter({
      formData: letter.formData,
      letterContent: letter.letterContent,
    });
    // Record the download in localStorage then refresh dashboard counts
    recordDownloadLocally(letter.id);
    void queryClient.invalidateQueries({ queryKey: ["letterHistory"] });
  }

  return (
    <AnimatedSection direction="up" delay={0}>
      <div
        className="bg-background flex-1 py-10 px-4"
        data-ocid="dashboard.page"
      >
        <div className="max-w-5xl mx-auto space-y-8">
          {/* ── Header ── */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground font-display tracking-tight">
                Your Letters
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Manage, download, and track your demand letters.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground border border-border rounded-full px-3 py-1.5 bg-card">
                <ShieldCheck
                  className="w-3.5 h-3.5 text-accent"
                  aria-hidden="true"
                />
                Secure &amp; Private
              </div>
              <AnimatedButton>
                <Button
                  asChild
                  className="bg-accent hover:bg-accent/90 text-accent-foreground h-9 px-4 text-sm font-semibold gap-1.5"
                  data-ocid="dashboard.new_letter_button"
                >
                  <Link to="/generate">
                    <PlusCircle className="w-4 h-4" aria-hidden="true" />
                    New Letter
                  </Link>
                </Button>
              </AnimatedButton>
            </div>
          </div>

          {/* ── Stats row ── */}
          {!lettersLoading && <StatsCards letters={sortedLetters} />}

          {/* ── Two-column: Usage + Upgrade nudge ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <UsageCard plan={plan} used={lettersUsed} limit={lettersLimit} />
            {plan === "Free" && (
              <div className="flex flex-col justify-center">
                <UpgradeNudge used={lettersUsed} />
              </div>
            )}
          </div>

          <Separator />

          {/* ── Letter history ── */}
          <AnimatedSection direction="up" delay={0.1}>
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-semibold text-foreground font-display">
                  Letter History
                </h2>
                {sortedLetters.length > 0 && (
                  <span className="text-xs text-muted-foreground">
                    {sortedLetters.length} letter
                    {sortedLetters.length !== 1 ? "s" : ""} · newest first
                  </span>
                )}
              </div>

              {lettersLoading ? (
                <div className="space-y-3" data-ocid="dashboard.loading_state">
                  {[1, 2, 3].map((n) => (
                    <LetterRowSkeleton key={n} />
                  ))}
                </div>
              ) : sortedLetters.length > 0 ? (
                <StaggeredList
                  className="space-y-3"
                  staggerDelay={0.07}
                  initialDelay={0.05}
                >
                  {sortedLetters.map((letter, i) => (
                    <div key={letter.id} data-ocid="dashboard.letters_list">
                      <LetterRow
                        letter={letter}
                        index={i + 1}
                        onStatusChange={handleStatusChange}
                        onRedownload={handleRedownload}
                      />
                    </div>
                  ))}
                </StaggeredList>
              ) : (
                <div
                  className="flex flex-col items-center justify-center py-16 bg-card border border-border rounded-xl text-center"
                  data-ocid="dashboard.empty_state"
                >
                  <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mb-4">
                    <FileText
                      className="w-7 h-7 text-muted-foreground/50"
                      aria-hidden="true"
                    />
                  </div>
                  <h3 className="text-base font-semibold text-foreground mb-2">
                    No letters yet
                  </h3>
                  <p className="text-sm text-muted-foreground mb-6 max-w-xs leading-relaxed">
                    Generate your first demand letter to recover what you're
                    owed. Takes about 3 minutes.
                  </p>
                  <AnimatedButton>
                    <Button
                      asChild
                      className="bg-accent hover:bg-accent/90 text-accent-foreground h-10 px-6 text-sm font-semibold gap-1.5"
                      data-ocid="dashboard.empty_cta_button"
                    >
                      <Link to="/generate">
                        Generate your first letter
                        <ArrowRight className="w-4 h-4" aria-hidden="true" />
                      </Link>
                    </Button>
                  </AnimatedButton>
                </div>
              )}
            </div>
          </AnimatedSection>

          {/* ── Legal disclaimer ── */}
          <p className="text-xs text-muted-foreground text-center leading-relaxed border-t border-border pt-6">
            <ShieldCheck
              className="inline w-3.5 h-3.5 mr-1 text-accent align-middle"
              aria-hidden="true"
            />
            All letters are stored on a decentralized network and accessible
            only to you. This service provides templates only and does not
            constitute legal advice. Consult a licensed attorney for legal
            counsel.
          </p>
        </div>
      </div>
    </AnimatedSection>
  );
}
