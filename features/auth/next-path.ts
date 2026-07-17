/** Open-redirect guard for ?next= — only same-site absolute paths pass.
 *  Rejects protocol-relative ("//evil.com"), absolute URLs and backslash
 *  tricks; anything rejected falls back to staying on /login. */
export function sanitizeNextPath(raw: string | null): string | null {
  if (!raw) return null;
  if (!raw.startsWith("/")) return null;
  if (raw.startsWith("//") || raw.includes("://") || raw.includes("\\")) return null;
  return raw;
}
