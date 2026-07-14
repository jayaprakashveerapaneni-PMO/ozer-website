// Re-mounts on each route change → animated page transitions site-wide.
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="animate-fade-up flex min-h-full flex-1 flex-col">{children}</div>;
}
