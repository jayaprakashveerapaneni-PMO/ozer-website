import Link from "next/link";
import { cn } from "@/lib/cn";

export type ButtonVariant = "primary" | "glass" | "ghost" | "success";
export type ButtonSize = "sm" | "md" | "lg";

const BASE =
  "btn-shine inline-flex items-center justify-center gap-2 font-bold transition-transform duration-200 focus-visible:outline-2 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100";

const VARIANTS: Record<ButtonVariant, string> = {
  primary: "bg-primary text-on-primary glow-primary hover:scale-105",
  glass: "glass text-foreground hover:text-primary-soft hover:scale-105",
  ghost: "text-muted hover:text-primary-soft",
  success: "bg-success text-white hover:scale-105",
};

// Radius tracks size: large CTAs read as pills-ish (2xl), controls as xl.
const SIZES: Record<ButtonSize, string> = {
  sm: "rounded-xl px-4 py-2 text-sm",
  md: "rounded-xl px-5 py-2.5 text-sm",
  lg: "rounded-2xl px-7 py-4 text-base",
};

type CommonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  className?: string;
  children: React.ReactNode;
};

type ButtonAsButton = CommonProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof CommonProps> & {
    href?: undefined;
  };

type ButtonAsLink = CommonProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof CommonProps> & {
    href: string;
  };

export type ButtonProps = ButtonAsButton | ButtonAsLink;

/**
 * The single button primitive. Renders a real <button> or a Next <Link> based
 * on whether `href` is passed — so semantics stay correct (actions vs.
 * navigation) with one API. Replaces ~14 duplicated inline button strings.
 */
export default function Button({
  variant = "primary",
  size = "md",
  fullWidth = false,
  className,
  children,
  ...rest
}: ButtonProps) {
  const classes = cn(BASE, VARIANTS[variant], SIZES[size], fullWidth && "w-full", className);

  if ("href" in rest && rest.href !== undefined) {
    const { href, ...anchorRest } = rest as ButtonAsLink;
    return (
      <Link href={href} className={classes} {...anchorRest}>
        {children}
      </Link>
    );
  }

  const { type = "button", ...buttonRest } = rest as ButtonAsButton;
  return (
    <button type={type} className={classes} {...buttonRest}>
      {children}
    </button>
  );
}
