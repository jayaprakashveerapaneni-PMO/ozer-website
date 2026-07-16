# OZER — Session Handoff (100% context)

> Read this top to bottom before doing anything. It is the complete state of the
> project as of 2026-07-16. The previous session ended with the LuminaAI-reference
> hero deployed and the user happy with the centered composition.

## 1. What this is

**Ozer** ("Daily Help, Delivered") — a voice-first on-demand home-services platform
for Hyderabad (cleaning, home cook, laundry, child & elder care), built for the user
(Jayaprakash Veerapaneni, jayaprakash.veerapaneni@thinkhat.ai) from a 131-page
requirements suite. It is a REAL working product (multi-device bookings on Supabase),
currently pilot-grade, being driven toward commercial launch.

**Requirements source:** `C:\Users\jayaprakash.v\Downloads\OZER-export.pdf` (131 pages).
Key contents: personas PS-1..6, FR-1..FR-70 across 14 epics (EP-14 = Alexa/Siri/Google
addendum: Alexa full dialog En+Hi, Siri App Shortcuts, Google App Actions — honest
per-platform depth is a requirement), NFRs (DPDP compliance is a launch gate), voice
guardrail: voice NEVER books alone (FR-27/AI-7). Use `python` + pypdf (installed) to
re-extract if needed.

## 2. Live URLs & accounts

| Thing | Value |
|---|---|
| Production | https://ozer-website.vercel.app (aliases: ozer-website-jayaprakashveerapaneni-1633s-projects.vercel.app) |
| Pages | `/` `/book` `/helper` `/flow` (+ robots.txt, sitemap.xml, icon, opengraph-image) |
| GitHub | https://github.com/jayaprakashveerapaneni-PMO/ozer-website — remote `origin`, branch `main`, push works (credentials cached) |
| CI | GitHub Actions on push/PR — see §6 |
| Vercel | Project `ozer-website` under account `jayaprakashveerapaneni-1633` (auto-created via CLI device login). CLI is authenticated; deploy with `npx vercel deploy --prod --yes` from the repo. ⚠ The user's browser Vercel dashboard may be a DIFFERENT account — unresolved; they couldn't see the project. Git auto-deploy NOT connected (deploys are CLI-only). |
| Supabase | Project `dricctnumigchunyvtxn` (free tier, user's account, created via GitHub login). URL `https://dricctnumigchunyvtxn.supabase.co`. Anon key in `.env.local` (gitignored) AND in Vercel env (production/preview/development). Anon key is public-by-design. Migration `supabase/migrations/001_init.sql` IS applied (bookings + wallets tables, `increment_wallet` RPC, Realtime publication, **demo-open RLS policies**). |
| 21st.dev MCP | Registered in D:\UI-UX-Pro-Max-Lite-Skill\.mcp.json, key in user-level env var `API_KEY_21ST`. Unused so far. |

**User's environment:** Windows 11, VS Code, Node 24, Chrome. PowerShell does NOT have
git on PATH — git lives at `C:\Users\jayaprakash.v\AppData\Local\Programs\Git\cmd\git.exe`
(the agent's Bash tool has it fine). `gh` CLI NOT installed.

## 3. Repo & architecture

Location: `D:\UI-UX-Pro-Max-Lite-Skill\ozer-website` (inside a clone of the
ui-ux-pro-max skill repo — the parent repo is unrelated; never commit to it).
Dev server: preview_start name `ozer-dev` (launch.json at BOTH parent and app root).

Stack: **Next.js 16.2.10 (App Router, Turbopack) · React 19 · Tailwind v4 · TS strict ·
vitest (45 tests green) · @testing-library/react · lucide-react · @supabase/supabase-js**.
All routes statically prerendered. AGENTS.md says: read `node_modules/next/dist/docs/`
before assuming Next APIs.

```
app/            routes only (page/layout/template/robots/sitemap/icon/opengraph-image)
components/ui/      Button (variants: primary|glass|ghost|success|pill) Card Badge
                    Container Section NumberField SegmentedControl (+ index barrel)
components/motion/  Reveal Spotlight CountUp WordRotate
components/layout/  Navbar Footer Logo (gem-cut O) SilkWave (dune field) FlowRibbons
                    (light-strings, currently unused in hero) ScrollProgress
                    RisingParticles StructuredData CrystalField(DELETED)
features/home/      Hero Services HowItWorks Estimator Trust Helpers Testimonials
                    Faq Personas Marquee
features/booking/   BookingWizard(orchestrator) steps/{Service,Details,Slot,Helper,
                    Confirm}Step SuccessScreen InstantScreen ServiceDetailsFields
                    useServiceDetails booking.constants
features/helper/    HelperApp useHelperPortal ActiveJobCard OfferList
features/voice/     VoiceDemo (Web Speech API, te-IN/hi-IN/ta-IN/en-IN)
features/assistants/ Assistants (playable Alexa/Siri/Google conversations)
lib/domain/         types catalog estimator content (+barrel) — pure, tested
lib/services/       booking-service (interface+factory) local-booking-service
                    supabase-booking-service — UI ONLY touches the interface
lib/voice/          parser responses speech (longest-keyword slot matching!)
lib/design/         tokens (3-tier: PALETTE→semantic→component; *_INK = AA-safe
                    variants for text/solid, bright = decorative only) contrast
                    (WCAG math) — both tested
lib/motion/         stagger prefersReducedMotion ANIMATION + timing tokens
lib/site.ts lib/cn.ts
```

**BookingService:** factory picks Supabase when NEXT_PUBLIC_SUPABASE_URL/ANON_KEY set
(they are, so prod = Postgres + Realtime, multi-device verified E2E), else localStorage.
Booking FSM: pending_offer→assigned→en_route→arrived(OTP)→in_progress→completed.
OTP handshake FR-16: wrong OTP blocks (verified). Wallet credit = estimate midpoint via
atomic RPC. Care bookings only match certified helpers (FR-37). 6 mock helpers (h1 Meena
cleaning+laundry, h2 Lakshmi cleaning+cook, h3 Fatima cook, h4 Radha care+cleaning cert,
h5 Sunitha care cert, h6 Anand laundry).

## 4. Current design (just shipped, user approved direction)

Faithful recreation of the LuminaAI reel the user shared
(https://www.instagram.com/reel/DYuAoaiSf6o/ — "Intelligence That Flows With You",
warm ivory, serif headline, silk-dune wave in lower half, dark pill CTA, trust logo
strip on the wave). Viewed the actual frames via the user's Chrome (claude-in-chrome).

- Palette: ivory `--background:#f4efe7`, ink `--foreground:#26221c`, muted `#6b6559`,
  primary `#c2410c` (4.52:1, barely AA — don't lighten!), destructive `#b91c1c`.
  ALL text tokens AA-enforced by `lib/design/contrast.test.ts` (BG_LIGHT there = #f4efe7;
  any palette change MUST update that file and pass).
- Hero: centered; **Instrument Serif** (`--font-serif`, next/font var `--font-instrument`)
  headline "Daily Help That / Flows With ___" — WordRotate cycles **You./Telugu./Trust./
  Ease.** in text-primary (words kept SHORT so headline never reflows). Subcopy = LCP
  element → NEVER opacity-animate it. Dark pill CTA "Start booking with voice" +
  text-link "Explore booking". Trust strip (6 zone names) rests on the wave.
- SilkWave = bottom-anchored dune field (52% height): 4 tiling ridges (pale lavender back,
  golden cream mid, deep amber, hot coral crest) + radial amber glow core; drift via
  seamless 2×-width translateX(-50%) loop + vertical "breathe". Fonts: Space Grotesk
  600/700, Inter 400-700, Instrument Serif 400+italic.
- Gem-cut hexagonal "O" logo (Logo.tsx, saffron→rose→violet facets) in navbar/footer;
  icon.tsx favicon matches. opengraph-image.tsx exists (older palette — could refresh).
- Other sections still use the previous light-glass style with token colors (consistent
  but not yet dune-themed) — possible next design task if user asks.

## 5. Quality state (measured, not guessed)

- Lighthouse prod: **Desktop 99/100/100/100; Mobile ~72 median** (LCP ~3.7s structural:
  throttled fonts/CSS on animation-rich 950-node page).
- axe: 0 violations all routes + voice-confirm state (when last run).
- 45 vitest tests: estimator, voice parser (Hindi "कल शाम" bug fixed via
  longest-keyword-wins), local service FSM/wallet, design tokens, WCAG contrast
  enforcement, Button/NumberField/SegmentedControl (jsdom).
- CI `.github/workflows/ci.yml`: job1 typecheck+lint+test+build; job2 Lighthouse budget
  vs PROD (3 runs × /, /book, /helper) with `lighthouserc.json`: a11y=1.0, seo=1.0,
  bp≥0.95, **perf≥0.6**, CLS≤0.05. Run #1 failed & caught 2 real a11y bugs (fixed);
  since green. IMPORTANT: deploy to prod BEFORE/WITH push, since the budget audits prod.
- Security headers in next.config.ts (CSP with dev-only unsafe-eval, HSTS, X-Frame DENY,
  Permissions-Policy microphone=(self)). npm audit: 2 moderate = postcss vendored inside
  Next, build-time only — documented-accept, do NOT "fix" (npm suggests Next 9!).
- SEO: metadataBase/canonicals/OG/Twitter/robots/sitemap/JSON-LD LocalBusiness.

## 6. Conventions this project follows

- Ship loop: `npx tsc --noEmit` → `npm test` → `npm run build` → commit → push →
  `npx vercel deploy --prod --yes` → verify on prod. Commits:
  `git -c user.name="Jayaprakash Veerapaneni" -c user.email="jayaprakash.veerapaneni@thinkhat.ai" commit -m "..."`
  ending with `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>`.
- Every palette change: compute WCAG ratios FIRST (node one-liner), then update
  contrast.test.ts, then apply.
- Components ≤200 lines; business math in lib/domain; UI never imports an adapter
  directly; no hex literals in components (use lib/design tokens).
- E2E verification pattern: drive prod with browser-pane javascript_tool clicks +
  verify rows in Supabase via REST (curl with anon key). Clear test bookings after
  (`DELETE .../bookings?id=neq.__none__`).

## 7. Known gotchas (hard-won)

- **Browser pane tab often reports visibilityState:hidden** → screenshots time out AND
  CSS/rAF animation clocks freeze. Not a code bug. Verify animations via WAAPI
  (`el.getAnimations()`, resolved keyframes) or ask the user to look.
- Turbopack serves stale CSS after big globals.css rewrites while dev server runs:
  stop server, `rm -rf .next`, restart (preview_start `ozer-dev`).
- `.word-in` class sets display:inline-block and unlayered CSS BEATS Tailwind utilities
  → never put it on flex/grid containers (use animate-fade-up there).
- `stroke-dashoffset` in @keyframes needs a UNIT (-2200px); unitless silently dropped.
- OG images (Satori): every multi-child element needs explicit display:flex; no mixed
  text+element children.
- react-hooks/set-state-in-effect lint: no sync setState in effect bodies (use IO
  callbacks / async+cancelled flag / useSyncExternalStore — all three patterns exist
  in code as examples).
- Windows: sed via Git Bash works; PowerShell lacks git; use the Bash tool.
- Instagram links need the user's Chrome (claude-in-chrome tools) — WebFetch only gets metadata.

## 8. Honest product status ("can clients book?")

YES for pilot: real cross-device booking loop on Postgres, verified end-to-end
repeatedly. NOT yet commercial: (1) no auth/accounts — helper page is open, OTP
readable via API (fine for demo personas only), demo-open RLS policies; (2) helpers
are 6 mock personas; (3) no payment collection (pay-after is displayed, not charged).

## 9. Roadmap (agreed priorities)

1. **NEXT SPRINT (user said "that's where I want to be"): Supabase phone-OTP auth +
   real RLS policies** + move OTP verify server-side (security-definer function).
   The migration file documents the demo policies to replace.
2. Real helper onboarding (replace mock catalog).
3. Payments: Razorpay/Cashfree per TR-20.
4. i18n framework (next-intl) — TR-12 warns retrofitting is the classic failure.
5. error.tsx/404, Sentry-class monitoring, analytics events (TR-13).
6. Vercel↔GitHub auto-deploy once the user sorts dashboard account access.
7. Legal/DPDP + voice-consent pages (launch gate per NFR-6/FR-30).
8. Finish primitive adoption inside booking/helper internals; visual regression
   (Playwright); 320px audit; dark scheme exists as [data-theme] but unused.

## 10. Where the last session ended

Deployed commit `f585a65` (LuminaAI hero) — since verified live. User was asked for
a design verdict + told auth+RLS is next. Continue from there: greet with current
state, act on whatever they ask, keep the ship-loop discipline.
