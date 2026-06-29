import logo from "@/assets/logo.png";

export function Logo({ size = 36, withText = true }: { size?: number; withText?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <img
        src={logo}
        alt="LifeLink logo"
        width={size}
        height={size}
        style={{ width: size, height: size }}
        className="object-contain drop-shadow-sm"
      />
      {withText && (
        <span
          className="font-display font-bold tracking-tight bg-gradient-primary bg-clip-text text-transparent"
          style={{ fontSize: size * 0.62 }}
        >
          LifeLink
        </span>
      )}
    </div>
  );
}
