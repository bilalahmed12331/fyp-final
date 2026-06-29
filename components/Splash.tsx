import { useEffect, useMemo, useState } from "react";
import { Logo } from "./Logo";

export function Splash({ onDone }: { onDone: () => void }) {
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setLeaving(true), 2400);
    const t2 = setTimeout(() => onDone(), 3000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [onDone]);

  // Floating blood-drop particles (deterministic so SSR matches)
  const dots = useMemo(
    () =>
      Array.from({ length: 22 }).map((_, i) => {
        const seed = (i * 9301 + 49297) % 233280;
        const r1 = (seed / 233280) * 100;
        const r2 = ((seed * 7) % 233280) / 2332.8;
        const r3 = ((seed * 13) % 233280) / 23328;
        return {
          left: r1,
          top: r2,
          size: 3 + (r3 * 7),
          delay: r3 * 2,
          opacity: 0.25 + r3 * 0.5,
        };
      }),
    [],
  );

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center transition-opacity duration-700 ${leaving ? "opacity-0 pointer-events-none" : "opacity-100"}`}
      style={{ background: "radial-gradient(ellipse at center, oklch(0.20 0.05 260) 0%, oklch(0.12 0.04 260) 80%)" }}
    >
      {/* Floating blood-drop particles */}
      <div className="absolute inset-0 overflow-hidden">
        {dots.map((d, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-primary animate-heart-beat"
            style={{
              left: `${d.left}%`,
              top: `${d.top}%`,
              width: d.size,
              height: d.size,
              opacity: d.opacity,
              animationDelay: `${d.delay}s`,
              filter: "blur(0.5px)",
              boxShadow: "0 0 12px oklch(0.64 0.24 25 / 0.6)",
            }}
          />
        ))}
      </div>

      <div className="relative flex items-center justify-center">
        <span className="absolute inline-flex h-40 w-40 rounded-full bg-primary/25 animate-pulse-ring" />
        <span className="absolute inline-flex h-40 w-40 rounded-full bg-primary/15 animate-pulse-ring [animation-delay:0.6s]" />
        <div className="animate-heart-beat drop-shadow-[0_0_24px_oklch(0.64_0.24_25/0.7)]">
          <Logo size={104} withText={false} />
        </div>
      </div>
      <div className="mt-8 text-center animate-fade-up relative">
        <h1 className="text-5xl font-display font-extrabold tracking-tight">
          <span className="text-white">Life</span>
          <span className="text-gradient-primary">Link</span>
        </h1>
        <p className="mt-3 text-sm text-white/70 italic">
          Bridging Life, One Donation at a Time
        </p>
      </div>
      <div className="mt-10 h-1.5 w-56 overflow-hidden rounded-full bg-white/10 relative">
        <div
          className="absolute inset-y-0 left-0 bg-gradient-primary rounded-full"
          style={{ animation: "splash-load 2.4s ease-out forwards" }}
        />
      </div>
      <style>{`
        @keyframes splash-load {
          0% { width: 0%; }
          100% { width: 100%; }
        }
      `}</style>
    </div>
  );
}
