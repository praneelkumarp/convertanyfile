export function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[hsl(var(--bg-dark))] text-white flex flex-col">
      {children}
    </div>
  );
}
