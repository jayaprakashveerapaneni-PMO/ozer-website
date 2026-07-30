import { cn } from "@/lib/cn";

/** A page section with the standard vertical rhythm and optional scroll anchor. */
export default function Section({
  id,
  className,
  children,
}: {
  id?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className={cn("relative py-24 lg:py-36", id && "scroll-mt-16", className)}>
      {children}
    </section>
  );
}
