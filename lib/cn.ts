/**
 * Join class names, dropping falsy values. A tiny dependency-free `clsx`;
 * order is preserved so later Tailwind utilities win as authored.
 */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}
