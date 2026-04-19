import { Link } from "@tanstack/react-router";
import { ExternalLink, Scale } from "lucide-react";
import { LegalDisclaimer } from "./LegalDisclaimer";
import { Navigation } from "./Navigation";
import { TrustBar } from "./TrustBar";
import { AnimatedSection, StaggeredList } from "./animations";

const FOOTER_LINKS = [
  {
    heading: "Generator",
    links: [
      { label: "All Letter Types", href: "/generate" },
      { label: "Debt Recovery", href: "/debt-demand-letter-generator" },
      { label: "Landlord–Tenant", href: "/landlord-demand-letter-generator" },
      { label: "Pricing", href: "/pricing" },
    ],
  },
  {
    heading: "Resources",
    links: [
      { label: "Sample Letters", href: "/samples" },
      { label: "Legal Guides", href: "/blog" },
      { label: "Find an Attorney", href: "/find-attorney" },
      { label: "Partnership", href: "/partnership" },
    ],
  },
  {
    heading: "Account",
    links: [
      { label: "Dashboard", href: "/dashboard" },
      { label: "Generator", href: "/generate" },
    ],
  },
] as const;

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const year = new Date().getFullYear();
  const caffeineUrl = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
    typeof window !== "undefined" ? window.location.hostname : "",
  )}`;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />

      <main className="flex-1 flex flex-col" id="main-content">
        {children}
      </main>

      <AnimatedSection direction="up" delay={0.05}>
        <footer className="bg-card border-t border-border" data-ocid="footer">
          {/* Top footer grid */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Brand column */}
              <div className="lg:col-span-1">
                <Link
                  to="/"
                  className="flex items-center gap-2 mb-3"
                  aria-label="Sue Letter home"
                >
                  <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
                    <Scale
                      className="w-4 h-4 text-primary-foreground"
                      aria-hidden="true"
                    />
                  </div>
                  <span className="text-base font-semibold text-foreground">
                    Sue<span className="text-accent">Letter</span>
                  </span>
                </Link>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  AI-powered demand letters with real statute citations.
                  Professional results in minutes.
                </p>
                <TrustBar
                  variant="footer"
                  className="flex-col items-start gap-2"
                />
              </div>

              {/* Link columns */}
              {FOOTER_LINKS.map((col) => (
                <div key={col.heading}>
                  <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-3">
                    {col.heading}
                  </h3>
                  <StaggeredList staggerDelay={0.06}>
                    {col.links.map((link) => (
                      <li key={link.label} className="list-none">
                        <Link
                          to={link.href}
                          className="text-sm text-muted-foreground hover:text-foreground transition-fast"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </StaggeredList>
                </div>
              ))}
            </div>
          </div>

          {/* Disclaimer row */}
          <div className="border-t border-border bg-muted/40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <LegalDisclaimer />
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-border">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
              <p className="text-xs text-muted-foreground">
                © {year} Sue Letter. All rights reserved.
              </p>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                Built with love using{" "}
                <a
                  href={caffeineUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-fast inline-flex items-center gap-0.5"
                >
                  caffeine.ai{" "}
                  <ExternalLink className="w-3 h-3" aria-hidden="true" />
                </a>
              </p>
            </div>
          </div>
        </footer>
      </AnimatedSection>
    </div>
  );
}
