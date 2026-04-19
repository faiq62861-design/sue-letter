import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Link, useLocation } from "@tanstack/react-router";
import { Menu, Scale, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { SiApple, SiGoogle } from "react-icons/si";
import { useAuthSync } from "../store/authStore";
import { useUIStore } from "../store/uiStore";
import { TrustBar } from "./TrustBar";
import { AnimatedButton } from "./animations";

const NAV_LINKS = [
  { href: "/" as const, label: "Home" },
  { href: "/generate" as const, label: "Generator" },
  { href: "/blog" as const, label: "Blog" },
  { href: "/pricing" as const, label: "Pricing" },
] as const;

// Microsoft logo SVG as a component
function MicrosoftIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 21 21"
      aria-hidden="true"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="1" y="1" width="9" height="9" fill="#F25022" />
      <rect x="11" y="1" width="9" height="9" fill="#7FBA00" />
      <rect x="1" y="11" width="9" height="9" fill="#00A4EF" />
      <rect x="11" y="11" width="9" height="9" fill="#FFB900" />
    </svg>
  );
}

// Animated nav link with sliding underline
function NavLink({
  href,
  isActive,
  children,
  onClick,
  className,
  ocid,
}: {
  href: string;
  isActive: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  ocid?: string;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      to={href as "/"}
      onClick={onClick}
      className={className}
      data-ocid={ocid}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span className="relative inline-block">
        {children}
        <motion.span
          className="absolute left-0 bottom-0 h-[2px] bg-primary rounded-full"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: isActive || hovered ? 1 : 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          style={{ originX: 0, width: "100%" }}
        />
      </span>
    </Link>
  );
}

function SignInDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { login, isLoggingIn } = useAuthSync();

  const handleLogin = () => {
    login();
    onClose();
  };

  const providers = [
    {
      label: "Continue with Google",
      icon: SiGoogle,
      color: "text-primary",
    },
    {
      label: "Continue with Apple",
      icon: SiApple,
      color: "text-foreground",
    },
    {
      label: "Continue with Microsoft",
      icon: MicrosoftIcon,
      color: "",
    },
  ];

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        className="max-w-sm"
        data-ocid="signin.dialog"
        aria-label="Sign in to Sue Letter"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 320, damping: 28 }}
        >
          <DialogHeader>
            <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg mx-auto mb-2">
              <Scale className="w-5 h-5 text-primary" aria-hidden="true" />
            </div>
            <DialogTitle className="text-center text-lg font-semibold">
              Sign in to Sue Letter
            </DialogTitle>
            <p className="text-center text-sm text-muted-foreground mt-1">
              Use your Google, Apple, or Microsoft account to get started.
            </p>
          </DialogHeader>

          <div className="space-y-2.5 mt-2">
            {providers.map(({ label, icon: Icon, color }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.08 + i * 0.06, duration: 0.2 }}
              >
                <Button
                  variant="outline"
                  className="w-full h-11 font-medium flex items-center gap-3 justify-start px-4"
                  onClick={handleLogin}
                  disabled={isLoggingIn}
                  data-ocid={`signin.${label.toLowerCase().replace(/\s+/g, "_")}_button`}
                >
                  <Icon
                    className={`w-4 h-4 shrink-0 ${color}`}
                    aria-hidden="true"
                  />
                  <span>{label}</span>
                </Button>
              </motion.div>
            ))}
          </div>

          <p className="text-xs text-center text-muted-foreground mt-3 px-2">
            By signing in you agree to our Terms of Service. This platform uses
            Internet Identity — your chosen provider account authenticates you.
          </p>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}

export function Navigation() {
  const location = useLocation();
  const { isAuthenticated, isInitializing, isLoggingIn, logout } =
    useAuthSync();
  const { mobileMenuOpen, setMobileMenuOpen, signInOpen, setSignInOpen } =
    useUIStore();

  const isActive = (href: string) =>
    href === "/"
      ? location.pathname === "/"
      : location.pathname.startsWith(href);

  const openSignIn = () => setSignInOpen(true);
  const closeSignIn = () => setSignInOpen(false);

  return (
    <>
      <header
        className="sticky top-0 z-50 bg-card border-b border-border shadow-elevated"
        data-ocid="nav.header"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo — subtle pulse on first load */}
            <Link
              to="/"
              className="flex items-center gap-2 group"
              aria-label="Sue Letter home"
              data-ocid="nav.logo_link"
            >
              <motion.div
                className="w-8 h-8 bg-primary rounded-md flex items-center justify-center shrink-0"
                initial={{ boxShadow: "0 0 0px 0px oklch(var(--primary)/0)" }}
                animate={{
                  boxShadow: [
                    "0 0 0px 0px oklch(var(--primary)/0)",
                    "0 0 12px 4px oklch(var(--primary)/0.35)",
                    "0 0 0px 0px oklch(var(--primary)/0)",
                  ],
                }}
                transition={{ duration: 1.6, delay: 0.3, times: [0, 0.5, 1] }}
              >
                <Scale
                  className="w-4 h-4 text-primary-foreground"
                  aria-hidden="true"
                />
              </motion.div>
              <span className="text-lg font-semibold tracking-tight text-foreground">
                Sue<span className="text-accent">Letter</span>
              </span>
            </Link>

            {/* Desktop nav */}
            <nav
              className="hidden md:flex items-center gap-1"
              aria-label="Main navigation"
            >
              {NAV_LINKS.map((link) => (
                <NavLink
                  key={link.href}
                  href={link.href}
                  isActive={isActive(link.href)}
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive(link.href)
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                  }`}
                  ocid={`nav.${link.label.toLowerCase()}_link`}
                >
                  {link.label}
                </NavLink>
              ))}
              {isAuthenticated && (
                <NavLink
                  href="/dashboard"
                  isActive={isActive("/dashboard")}
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive("/dashboard")
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                  }`}
                  ocid="nav.dashboard_link"
                >
                  Dashboard
                </NavLink>
              )}
            </nav>

            {/* Right side: trust + auth */}
            <div className="hidden md:flex items-center gap-3">
              <TrustBar variant="compact" />
              {isAuthenticated ? (
                <AnimatedButton>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={logout}
                    disabled={isInitializing}
                    className="font-medium"
                    data-ocid="nav.signout_button"
                  >
                    Sign Out
                  </Button>
                </AnimatedButton>
              ) : (
                <>
                  <AnimatedButton>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={openSignIn}
                      disabled={isInitializing || isLoggingIn}
                      className="font-medium"
                      data-ocid="nav.signin_button"
                    >
                      {isInitializing
                        ? "Loading…"
                        : isLoggingIn
                          ? "Signing in…"
                          : "Sign In"}
                    </Button>
                  </AnimatedButton>
                  <AnimatedButton>
                    <Button
                      size="sm"
                      onClick={openSignIn}
                      disabled={isInitializing || isLoggingIn}
                      className="bg-accent hover:bg-accent/90 text-accent-foreground font-medium"
                      data-ocid="nav.get_started_button"
                    >
                      Get Started Free
                    </Button>
                  </AnimatedButton>
                </>
              )}
            </div>

            {/* Mobile hamburger */}
            <button
              type="button"
              className="md:hidden p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-fast"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded={mobileMenuOpen}
              aria-label={
                mobileMenuOpen
                  ? "Close navigation menu"
                  : "Open navigation menu"
              }
              data-ocid="nav.mobile_menu_toggle"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu — animated slide down/up */}
        <AnimatePresence initial={false}>
          {mobileMenuOpen && (
            <motion.div
              key="mobile-menu"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="md:hidden border-t border-border bg-card overflow-hidden"
              data-ocid="nav.mobile_menu"
            >
              <nav
                className="px-4 py-3 space-y-1"
                aria-label="Mobile navigation"
              >
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block px-3 py-2.5 text-sm font-medium rounded-md transition-colors ${
                      isActive(link.href)
                        ? "text-primary bg-primary/10"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                    }`}
                    data-ocid={`nav.mobile_${link.label.toLowerCase()}_link`}
                  >
                    {link.label}
                  </Link>
                ))}
                {isAuthenticated && (
                  <Link
                    to="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2.5 text-sm font-medium rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
                    data-ocid="nav.mobile_dashboard_link"
                  >
                    Dashboard
                  </Link>
                )}
              </nav>
              <div className="px-4 py-3 border-t border-border space-y-2">
                <TrustBar variant="compact" />
                <div className="flex gap-2 pt-1">
                  {isAuthenticated ? (
                    <AnimatedButton>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={logout}
                        className="flex-1"
                        data-ocid="nav.mobile_signout_button"
                      >
                        Sign Out
                      </Button>
                    </AnimatedButton>
                  ) : (
                    <>
                      <AnimatedButton>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={openSignIn}
                          disabled={isInitializing || isLoggingIn}
                          className="flex-1"
                          data-ocid="nav.mobile_signin_button"
                        >
                          {isInitializing ? "Loading…" : "Sign In"}
                        </Button>
                      </AnimatedButton>
                      <AnimatedButton>
                        <Button
                          size="sm"
                          onClick={openSignIn}
                          disabled={isInitializing || isLoggingIn}
                          className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground"
                          data-ocid="nav.mobile_get_started_button"
                        >
                          Get Started
                        </Button>
                      </AnimatedButton>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <SignInDialog open={signInOpen} onClose={closeSignIn} />
    </>
  );
}
