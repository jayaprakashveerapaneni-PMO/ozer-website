# OZER — Session Handoff (100% context)

> Read this top to bottom before doing anything. It is the complete state of the
> project as of 2026-07-16 (evening). The previous session shipped the
> "out of demo" sprint: voice/assistants/build-story removed, payment-first
> booking cycle, and a sign-in helper app. See §0 for actions ONLY the user can do.

## 0. CURRENT BLOCKER + the email-delivery saga (state as of 2026-07-17 ~16:30 IST)

**The ONLY thing between the user and their first real signed-in booking is
email DELIVERABILITY.** Everything else works and is verified. Full state:

DONE (verified this session — do not redo):
- Migrations 002+003 APPLIED to prod DB (ran via the user's logged-in
  dashboard tab in the browser pane; verified via REST: amount_paid,
  payment_id, payment_method, customer_id, customer_email columns exist).
- Supabase Auth Site URL = https://ozer-website.vercel.app (user set it).
  Redirect URLs /** entries: ASKED FOR but UNVERIFIED — check. (With
  code-entry sign-in, redirects barely matter.)
- Email templates ("Magic link or OTP" + Confirm signup): customized with
  `{{ .Token }}` — verified correct via screenshot. NOTE: custom templates
  REQUIRE custom SMTP in Supabase (that dependency caused a day of 500s).
- Custom SMTP = Brevo, fully configured & SAVED (host smtp-relay.brevo.com,
  port 587, login b2546d001@smtp-brevo.com, SMTP key named "Ozer", sender
  jayaprakash.veerapaneni@thinkhat.ai, which is a Verified sender). Brevo
  account validated, 300 emails/day. Brevo IP-restriction for SMTP keys was
  the first 500-cause (user deactivated it); Supabase mailer IP
  13.193.86.234 authorized by user via Brevo's security-alert email.
- POST $SUPABASE_URL/auth/v1/otp with anon key returns HTTP 200 (sending
  WORKS — use this curl as the health probe; a 500 "Error sending magic link
  email" means template/SMTP breakage).

THE REMAINING PROBLEM — thinkhat.ai domain NOT authenticated in Brevo:
- To @thinkhat.ai recipients: Brevo keeps From=thinkhat.ai → Google
  Workspace SOFT-BOUNCES every send (DMARC fail; thinkhat.ai has DMARC).
- To other recipients (tested jpveerapaneni25@gmail.com): Brevo rewrites
  From to jayaprakash.veerapaneni@11687021.brevosend.com → Gmail DEFERS
  (greylist/tarpit of the day-old subdomain) — "Deferred" events repeating
  for 40+ min, "First opening" events are Gmail's scanner, nothing reached
  inbox/spam/All Mail. May self-resolve within hours.
- Diagnosis tool: Brevo → Transactional → Logs (Sent/Deferred/Soft
  bounce/Delivered per message). Read it before theorizing.

**THE RIGHT FIX (user explicitly rejected the Gmail-app-password shortcut as
"not the right way"): authenticate thinkhat.ai in Brevo.** Brevo → Senders,
Domains & Dedicated IPs → Domains → thinkhat.ai → Authenticate → add the
shown DKIM/SPF/code records at thinkhat.ai's DNS host → Verify. Needs the
user's DNS access (host unknown — ASK). After that, sends to ANY mailbox
deliver, properly branded. OPEN QUESTION posed to the user, unanswered when
the session ended: DNS route, or rearchitect sign-in entirely (they may
prefer phone-OTP — which anyway needs an SMS provider, or another approach)?

Agent access constraints (hard-learned, do not re-attempt):
- claude-in-chrome (user's Chrome) BLOCKS supabase.com, gmail.com,
  app.brevo.com at extension policy level regardless of "all sites" setting.
- WORKAROUND THAT WORKS: the user logs into dashboards inside the app's
  BROWSER PANE tabs; the agent can then drive them (SQL editor, Brevo logs
  all worked this way). Pane logins are session-scoped — gone in a new chat;
  ask the user to log in again in the pane when dashboard work is needed.
  Gotcha: heavy SPAs (Supabase Studio) render blank until tabs_select
  fronts the tab.
- The runtime classifier BLOCKS the agent from: weakening security settings
  (Brevo IP toggle), authorizing IPs, revealing/handling the Supabase secret
  key (sb_secret_*). These clicks must be the user's; frame the exact click
  and ask. Entering passwords/credentials into forms is prohibited for the
  agent, period.
- Gmail MCP (thinkhat mailbox only) works for READING; it mangles ~2 chars
  of magic-link tokens (decode bug at "token=") — links from it are
  unusable; the 6-digit {{ .Token }} code reads fine.

Other pending (unchanged): Razorpay keys for real money (checkout code
complete, flips on env vars); SMS provider decision for phone-OTP sprint.
Minor test residue: helper h1 wallet has ₹680 from E2E tests; a stray
booking OZ-MJPC8CR may exist — check/clean when convenient.

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
| Pages | `/` `/book` `/helper` (+ robots.txt, sitemap.xml, icon, opengraph-image; `/flow` DELETED). API: `/api/payments/order`, `/api/payments/verify` (dynamic; 503 until Razorpay env set) |
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
app/            routes only (+ api/payments/{order,verify}/route.ts — Razorpay
                order creation & HMAC signature verification, Node crypto)
components/ui/      Button (variants: primary|glass|ghost|success|pill) Card Badge
                    Container Section NumberField SegmentedControl (+ index barrel)
components/motion/  Reveal Spotlight CountUp WordRotate
components/layout/  Navbar Footer Logo (gem-cut O) SilkWave (dune field) FlowRibbons
                    (unused) ScrollProgress RisingParticles StructuredData
features/home/      Hero Services Highlights(NEW: auto-playing 4-step booking
                    walkthrough + CountUp proof band, replaces VoiceDemo)
                    HowItWorks Estimator Trust Helpers Testimonials Faq
                    Personas Marquee
features/booking/   BookingWizard(orchestrator, payment-first) steps/{Service,
                    Details,Slot,Helper,Confirm}Step PaymentSheet(NEW)
                    SuccessScreen InstantScreen ServiceDetailsFields
                    useServiceDetails booking.constants
features/helper/    HelperApp (sign-in gate + portal) HelperSignIn(NEW)
                    helper-session(NEW: phone+PIN localStorage session,
                    useSyncExternalStore) useHelperPortal ActiveJobCard OfferList
lib/domain/         types (+PaymentMethod, amountPaid/paymentId/paymentMethod,
                    bookingQuote) catalog estimator content (+barrel)
lib/services/       booking-service (interface+factory) local-booking-service
                    supabase-booking-service payment-service(NEW: modes,
                    sandbox mint) razorpay-client(NEW: checkout.js + verify)
lib/design/         tokens (ASSISTANT_* removed) contrast — both tested
lib/motion/         stagger prefersReducedMotion ANIMATION + timing tokens
lib/site.ts lib/cn.ts
DELETED: features/voice, features/assistants, app/flow, lib/voice
```

**BookingService:** factory picks Supabase when NEXT_PUBLIC_SUPABASE_URL/ANON_KEY set
(they are, so prod = Postgres + Realtime, multi-device verified E2E), else localStorage.
Booking FSM: pending_offer→assigned→en_route→arrived(OTP)→in_progress→completed.
OTP handshake FR-16: wrong OTP blocks (verified). Care bookings only match certified
helpers (FR-37). 6 mock helpers (h1 Meena cleaning+laundry, h2 Lakshmi cleaning+cook,
h3 Fatima cook, h4 Radha care+cleaning cert, h5 Sunitha care cert, h6 Anand laundry).

**Payment-first cycle (NEW):** booking rows are created only AFTER a payment record
exists. Fixed price = `bookingQuote` = estimate-band midpoint = helper payout
(wallet credit via atomic RPC on completion, T+0). PaymentSheet: sandbox
UPI/card/netbanking (labelled "Sandbox payment — no money moves…") until Razorpay
env keys exist, then real checkout (see §0). Instant path pays first too.
Supabase insert degrades gracefully while payment columns are unmigrated (§0.1).

**Customer auth (NEW, real):** Supabase email auth. `lib/services/supabase-client`
(shared singleton — auth JWT flows into the booking client), `auth-service`
(subscribe/snapshot for useSyncExternalStore + sendSignInEmail/verifyEmailCode/
signOutUser + customerNameFromUser), `use-auth` hook, `SignInCard` (inline in
the wizard's Review & pay when signed out; also surfaces expired-link errors
from the URL hash), `booking-draft` (localStorage; survives the email
round-trip — VERIFIED: failed-link redirect restored the full wizard),
`AccountChip` in the navbar. Bookings carry customer_id/customer_email +
real customerName. Payment gate requires sign-in. E2E status: everything
verified live except the final email-link click (agent can't click in the
user's inbox — see §0 for why); Supabase accepted OTP sends against the
user's real address.

**Helper notifications (NEW):** on new offers the portal shows the toast,
plays a WebAudio two-tone chime and fires a native OS Notification (Enable
alerts button requests permission). VERIFIED live: REST insert → Realtime →
offer + toast within ~1s (toast auto-hides at 4.2s — poll fast or use a
MutationObserver when testing). Web Push (browser closed) = roadmap.

**Helper sign-in (interim):** phone+PIN against `HELPER_LOGINS` in
features/helper/helper-session.ts (h1: 98490 10001/1111 … h6: …10006/6666),
localStorage session, online/offline toggle per helper. Credentials are listed
in a "Pilot roster access" disclosure on /helper. Replaced by Supabase
phone-OTP auth in the next sprint — this is identity UX, not security.

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
- **Motion system ("glides and flows", user request)**: SilkDivider — flowing
  golden dune bands (2 drifting/breathing ridge layers, amber crest md+ only,
  `.silk-divider` pins contain-intrinsic-size to 120px) placed before
  Highlights / Estimator (flipped) / Testimonials. Hero SilkWave has a
  scroll-driven parallax (`.silk-parallax`, @supports animation-timeline,
  disabled under reduced motion). `.reveal` glide is 36px/0.9s. ALL page
  motion is transform/opacity-only — CI enforces CLS ≤ 0.05 and run #2 FAILED
  on 0.18 CLS from the Highlights phone-swap; fixed by a fixed 200px screen
  stage + scaleX progress bar. Measure CLS via PerformanceObserver
  (layout-shift, buffered) in the browser pane before shipping motion.
- Homepage flow (2026-07-16 evening): Hero → Marquee → Services → Highlights
  (auto-playing 4-step booking walkthrough, 3.4s cycle, pauses on hover/interaction,
  `.highlight-progress` keyframe, reduced-motion safe) → Personas (Rao garu is now
  the family-books-for-him story) → HowItWorks (payment-first steps) → Estimator →
  Trust → Helpers → Testimonials → Faq. All voice/assistant/pay-after copy is gone
  sitewide (incl. metadata + OG image). Hero CTA: "Book a service" → /book.

## 5. Quality state (measured, not guessed)

- Lighthouse prod: **Desktop 99/100/100/100; Mobile ~72 median** (LCP ~3.7s structural:
  throttled fonts/CSS on animation-rich 950-node page).
- axe: 0 violations all routes + voice-confirm state (when last run).
- 47 vitest tests: estimator, local service FSM/wallet/payment persistence,
  payment modes + quote math, helper session/credentials, design tokens, WCAG
  contrast enforcement, Button/NumberField/SegmentedControl (jsdom).
  (Voice parser tests were deleted with lib/voice.)
- CI `.github/workflows/ci.yml`: job1 typecheck+lint+test+build; job2 Lighthouse budget
  vs PROD (3 runs × /, /book, /helper) with `lighthouserc.json`: a11y=1.0, seo=1.0,
  bp≥0.95, **perf≥0.6**, CLS≤0.05. Run #1 failed & caught 2 real a11y bugs (fixed);
  since green. IMPORTANT: deploy to prod BEFORE/WITH push, since the budget audits prod.
- Security headers in next.config.ts (CSP with dev-only unsafe-eval + Razorpay
  script/frame/connect allowances, HSTS, X-Frame DENY, Permissions-Policy
  microphone=() — mic denied now, voice is gone). npm audit: 2 moderate = postcss
  vendored inside Next, build-time only — documented-accept, do NOT "fix".
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

- **Lighthouse-on-Linux cannot measure /helper-class pages — /helper is
  deliberately EXCLUDED from the CI Lighthouse URL list** (see the comment in
  ci.yml). Full story of the NO_FCP saga (CI runs #9–#15, closed 2026-07-17):
  Lighthouse on the ubuntu runner (Chrome 140 AND 150, LHCI and plain CLI)
  never receives first-contentful-paint for /helper and aborts the whole
  collect. Four hypotheses were tested ON THE RUNNER and falsified: entrance
  animation on primary content; localStorage read during hydration; all text
  inside glass/backdrop-filter; page too static to produce frames
  (animate-breathe changed nothing). Killer datapoint: a bare `<h1>` probe
  page ALSO gets NO_FCP, while /helper paints in 1.0s in local headless
  Chrome and the runner's own puppeteer shows its text visible at ~200ms with
  zero errors. Verdict: measurement artifact, not product defect. DO NOT
  reopen by re-adding /helper to the audit; if investigating again, the only
  technique that produced truth was a temporary debug-branch workflow running
  puppeteer/lighthouse ON the runner and printing paint entries — guessing
  cost 4 red runs. Hygiene fixes shipped during the hunt (KEEP them all):
  plain-canvas h1 outside glass on /helper, no opacity-animation on primary
  content, isAutomatedAgent() gate on JS animation loops, deferred
  helper-session storage read past first paint.

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

YES for pilot: real cross-device booking loop on Postgres, payment-first UX,
verified end-to-end repeatedly (again this session: pay → book → sign in as
helper → accept → OTP → complete → wallet credit). NOT yet commercial:
(1) customer accounts don't exist; helper sign-in is client-side phone+PIN
(identity UX, not security) — OTP still readable via API, demo-open RLS;
(2) helpers are 6 mock personas; (3) payments are sandbox until the user adds
Razorpay keys (§0.2) — code path is complete and server-verified;
(4) payment columns unmigrated in prod until §0.1 is run.

## 9. Roadmap (agreed priorities)

0. User actions in §0 (migration 002, Razorpay keys, SMS provider choice).
1. **NEXT SPRINT: Supabase phone-OTP auth + real RLS policies** + move OTP
   verify server-side (security-definer function) + replace the interim
   phone+PIN helper sign-in. The migration file documents the demo policies.
2. Real helper onboarding (replace mock catalog).
3. Payments hardening once keys exist: webhook capture-confirmation, refunds
   (cancellation + money-back promise flows), receipts. (Checkout itself: DONE.)
4. i18n framework (next-intl) — TR-12 warns retrofitting is the classic failure.
5. error.tsx/404, Sentry-class monitoring, analytics events (TR-13).
6. Vercel↔GitHub auto-deploy once the user sorts dashboard account access.
7. Legal/DPDP + voice-consent pages (launch gate per NFR-6/FR-30).
8. Finish primitive adoption inside booking/helper internals; visual regression
   (Playwright); 320px audit; dark scheme exists as [data-theme] but unused.

## 10. Where the last session ended

Two marathon days. Day 1 shipped: the "out of demo" sprint (homepage de-demo
+ Highlights walkthrough, payment-first cycle, helper sign-in app), the
flowing golden motion front page + CLS fix, real customer auth + helper
notifications. Day 2: the booking draft trap fix (users were stuck at
Review & pay — d96a4cd), the NO_FCP CI saga closed by excluding /helper from
the Lighthouse list after runner-side probes proved a measurement artifact
(§7), CI GREEN since run #16 (57dea82), and then the email-delivery saga
(§0) chased through Supabase templates/SMTP dependency → Brevo IP
restriction → IP authorization → DMARC bounce → Gmail greylist, ending at:
authenticate thinkhat.ai DNS in Brevo, or rearchitect sign-in — USER'S CALL
PENDING (they rejected the Gmail-app-password shortcut as "not the right
way"; respect that bar). E2E status: pay-first booking, realtime helper
offer + chime/notification, draft round-trip, migrations — all VERIFIED on
prod; the customer's actual email sign-in is the one unverified link, purely
on deliverability. The user's standing directive remains: proper user-ready
product, no shortcuts, they act as the customer. Greet with current state,
get their §0 decision, keep ship-loop discipline.
