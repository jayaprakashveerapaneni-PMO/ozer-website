// Re-mounts on each route change → cinematic page entrance site-wide
// (long settle on the shared camera easing; transform/opacity only).
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-cine flex min-h-full flex-1 flex-col">{children}</div>;
}
