import { cn } from "@/lib/cn";

/**
 * Glass surface primitive. `interactive` adds the lift-on-hover; `glow` adds
 * the brand ring. Composes with motion/Spotlight where a spotlight is wanted.
 */
export default function Card({
  interactive = false,
  glow = false,
  className,
  children,
}: {
  interactive?: boolean;
  glow?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "glass rounded-3xl p-6",
        interactive && "tilt-card",
        glow && "glow-ring",
        className
      )}
    >
      {children}
    </div>
  );
}
