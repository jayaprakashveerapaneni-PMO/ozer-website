import { cn } from "@/lib/cn";

/** A pill/chip. `glass` for floating labels, `soft` for inline tags. */
export default function Badge({
  variant = "soft",
  className,
  children,
}: {
  variant?: "glass" | "soft";
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold",
        variant === "glass" ? "glass text-primary" : "bg-surface text-muted",
        className
      )}
    >
      {children}
    </span>
  );
}
