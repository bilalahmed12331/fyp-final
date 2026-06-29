import { type ReactNode } from "react";
import { Navbar } from "./Navbar";

export function PageShell({
  eyebrow, title, subtitle, children,
}: { eyebrow?: string; title: string; subtitle?: string; children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="relative overflow-hidden border-b border-border/60">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background" />
        <div className="absolute -top-32 -right-32 size-96 rounded-full bg-primary/20 blur-3xl" />
        <div className="container relative mx-auto px-6 py-16 lg:py-24">
          {eyebrow && (
            <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold tracking-wide uppercase mb-4">
              {eyebrow}
            </span>
          )}
          <h1 className="text-4xl lg:text-5xl font-bold tracking-tight font-display">{title}</h1>
          {subtitle && <p className="mt-4 text-lg text-muted-foreground max-w-2xl">{subtitle}</p>}
        </div>
      </section>
      <main className="container mx-auto px-6 py-12 lg:py-16">{children}</main>
      <footer className="border-t border-border/60 bg-card/50">
        <div className="container mx-auto px-6 py-8 text-sm text-muted-foreground flex flex-col md:flex-row gap-2 justify-between">
          <p>© {new Date().getFullYear()} LifeLink. A Final Year Project.</p>
          <p>Bridging Life, One Donation at a Time.</p>
        </div>
      </footer>
    </div>
  );
}
