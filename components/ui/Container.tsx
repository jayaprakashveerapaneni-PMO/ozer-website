import { cn } from "@/lib/cn";

const WIDTHS = {
  narrow: "max-w-3xl",
  default: "max-w-6xl",
  wide: "max-w-5xl",
} as const;

/** Centered, horizontally-padded content column. */
export default function Container({
  size = "default",
  className,
  children,
}: {
  size?: keyof typeof WIDTHS;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("mx-auto px-4 sm:px-6", WIDTHS[size], className)}>{children}</div>
  );
}
