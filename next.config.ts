import type { NextConfig } from "next";

/**
 * Content-Security-Policy.
 * - 'unsafe-inline' for script/style is required because Next injects inline
 *   hydration scripts and React inline styles without a nonce on statically
 *   prerendered pages. (A nonce-based CSP needs a middleware/dynamic render.)
 * - connect-src allows Supabase REST + Realtime (wss) — the booking backend.
 * - Microphone is granted to same-origin so the in-app voice demo works;
 *   camera/geolocation are denied.
 */
// React's dev server uses eval() for debugging (never in production builds),
// so 'unsafe-eval' is added in development only — production stays strict.
const scriptSrc =
  process.env.NODE_ENV === "production"
    ? "script-src 'self' 'unsafe-inline'"
    : "script-src 'self' 'unsafe-inline' 'unsafe-eval'";

const csp = [
  "default-src 'self'",
  scriptSrc,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "connect-src 'self' https://*.supabase.co wss://*.supabase.co",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "microphone=(self), camera=(), geolocation=(), browsing-topics=()" },
];

const nextConfig: NextConfig = {
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
