// ActLabel — the film's chapter marker. A serif act numeral, a hairline,
// and a small-caps title above each section headline. The numbering runs
// through the homepage acts so the page reads as one continuous piece.

export default function ActLabel({
  n,
  children,
  className = "",
}: {
  n: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p
      className={`mb-5 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.25em] text-muted ${className}`}
    >
      <span className="font-serif text-2xl normal-case italic leading-none text-primary/70" aria-hidden>
        {n}
      </span>
      <span className="h-px w-10 bg-line" aria-hidden />
      {children}
    </p>
  );
}
