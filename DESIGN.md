# DemandLetterAI Design Brief

## Overview
Professional legal-tech specialist for generating lawyer-quality demand letters. Authority, trustworthiness, and clarity are paramount. Refined minimalism with zero decorative excess.

## Aesthetic Direction
Refined minimalism with legal gravitas. Deep navy primary conveys authority and trust. Trust green accents highlight actions, progress, and validation. No playfulness, no gradients. Comparable to Linear, Stripe, or law firm digital presence.

## Color Palette

| Token | OKLCH | Purpose |
|-------|-------|---------|
| Primary (Navy) | `0.25 0.08 256` | Headers, text, primary actions — authority and trust |
| Accent (Green) | `0.58 0.15 142` | Buttons, progress, validation, statute highlights |
| Background | `0.98 0.005 0` | Clean, neutral, legal document aesthetic |
| Card | `1.0 0 0` | Form fields, step containers — elevated but clean |
| Muted | `0.92 0 0` | Secondary text, disabled states, borders |
| Border | `0.90 0 0` | Subtle boundaries between sections |
| Warning | `0.75 0.20 60` | Disclaimer banners, yellow alerts |
| Destructive | `0.55 0.22 25` | Error states, dangerous actions |

## Typography
- **Display & Body**: DM Sans, 400 weight body, 500 weight headings — clean, professional, no serifs
- **Mono**: Geist Mono — code samples, statute citations, quote blocks
- **Type Scale**: h1 2rem / 600, h2 1.5rem / 600, h3 1.25rem / 500, body 1rem / 400, small 0.875rem / 400

## Structural Zones

| Zone | Treatment | Purpose |
|------|-----------|---------|
| Header | Navy background, white text, border-bottom, trust badge (padlock + SSL + user count) | Navigation, brand, trust signals |
| Form (60% width) | Card background with subtle borders, step-based card layout | Primary interaction, multi-step wizard |
| Preview (40% width) | White letter preview with navy letterhead, green highlights on amounts | Live output, real-time feedback |
| Disclaimer Banner | Yellow background, navy text, no border-radius | Legal warning above generator |
| Footer | Muted background, legal disclaimer text, repeated padlock icons | Legal compliance, support links |

## Component Patterns
- **Form Fields**: rounded-md, border border-border, focus:ring accent, light grey background
- **Buttons**: Primary (navy bg, white text), Secondary (white bg, navy text, border), Accent (green bg, white text)
- **Step Card**: rounded-md border, hover:border-accent, transition-smooth, icon + label
- **Trust Badge**: Inline flex, padlock icon, "256-bit SSL", "10,000+ users", xs text, primary color
- **Letter Preview**: Monospace font, cream background, navy letterhead section, green highlights on demand amounts

## Spacing & Rhythm
- Tight vertical rhythm: 0.5rem increments for micro-spacing, 1rem for sections, 1.5rem for major blocks
- Form and preview stack vertically on mobile (`sm:grid-cols-1 md:grid-cols-3` → 60/40 split)
- Step cards: 4px rounded, 16px padding, 8px gap between cards

## Motion & Interactions
- **Transition Default**: `transition-smooth` (0.3s cubic-bezier) on interactive elements
- **Focus State**: accent ring on all inputs and buttons
- **Hover State**: border color shifts to accent, no scale transforms
- **Letter Preview Updates**: No animation, instant refresh as user types

## Constraints
- No placeholder brackets in generated letters (all user data inserted verbatim)
- Legal disclaimer on every page footer (xs text, muted color)
- Yellow disclaimer banner above generator ("Not legal advice — this is an AI tool for drafting purposes")
- Trust badges on header and form intro card
- Mobile: form and preview stack vertically with full-width cards
- Accessibility: 4.5:1 contrast minimum, all interactive elements keyboard-navigable

## Signature Detail
Deep navy header with padlock icon repeated in footer — visual anchor signaling legal authority and security. Trust green used sparingly only for primary actions and statute highlights in preview — not for secondary UI.

## Anti-Patterns to Avoid
- No purple gradients, no warm amber + sage green, no full-page blurred backgrounds
- No decorative shapes or illustrations
- No animations on scroll or hover beyond color transitions
- No rounded corners on buttons > 8px (keep sharp and professional)
- No dropdown shadows beyond `shadow-elevated` (max 12px)
