import { Link, useNavigate } from "@tanstack/react-router";
import { Logo } from "./Logo";
import { Button } from "@/components/ui/button";
import { useAuth, roleHome } from "@/lib/auth";
import { toast } from "sonner";
import { useState } from "react";
import {
  LogOut, LayoutDashboard, Home, Stethoscope, Hospital,
  BookOpen, Brain, Bot, Phone, Menu, X,
} from "lucide-react";

const navLinks = [
  { to: "/", label: "Home", icon: Home },
  { to: "/find-doctors", label: "Find Doctors", icon: Stethoscope },
  { to: "/find-hospitals", label: "Find Hospitals", icon: Hospital },
  { to: "/articles", label: "Articles", icon: BookOpen },
  { to: "/smart-matching", label: "Smart Matching", icon: Brain },
  { to: "/ai-assistant", label: "AI Assistant", icon: Bot },
  { to: "/contact", label: "Contact", icon: Phone },
] as const;

export function Navbar() {
  const { user, profile, role, signOut } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    toast.success("Signed out successfully");
    navigate({ to: "/auth" });
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="container mx-auto flex h-20 items-center justify-between gap-4 px-4 lg:px-8">
        <Link to="/" className="flex items-center shrink-0">
          <Logo size={38} />
        </Link>

        <nav className="hidden xl:flex items-center gap-1 flex-1 justify-center">
          {navLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeOptions={{ exact: l.to === "/" }}
              className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5 rounded-md hover:bg-accent/50"
              activeProps={{ className: "text-primary bg-accent/40" }}
            >
              <l.icon className="size-4" /> {l.label}
            </Link>
          ))}
          {user && (
            <Link
              to={roleHome(role) as "/dashboard/donor"}
              className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5 rounded-md hover:bg-accent/50"
              activeProps={{ className: "text-primary bg-accent/40" }}
            >
              <LayoutDashboard className="size-4" /> My Dashboard
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-2 shrink-0">
          {user ? (
            <>
              <span className="hidden lg:block text-sm text-muted-foreground pr-1">
                Hi, <span className="font-semibold text-foreground">{profile?.full_name?.split(" ")[0] ?? "Friend"}</span>
              </span>
              <Button variant="outline" size="sm" onClick={handleSignOut} className="gap-1.5">
                <LogOut className="size-4" /> <span className="hidden sm:inline">Sign out</span>
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild className="hidden sm:inline-flex">
                <Link to="/auth">Log in</Link>
              </Button>
              <Button size="sm" asChild className="bg-gradient-primary text-primary-foreground shadow-elegant hover:opacity-95 px-4">
                <Link to="/auth">Get started</Link>
              </Button>
            </>
          )}
          <Button variant="ghost" size="icon" className="xl:hidden" onClick={() => setOpen(!open)} aria-label="Menu">
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
        </div>
      </div>

      {open && (
        <div className="xl:hidden border-t border-border/60 bg-background/95 backdrop-blur">
          <nav className="container mx-auto px-4 py-3 flex flex-col gap-1">
            {navLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="px-3 py-2.5 text-sm font-medium text-muted-foreground hover:text-primary rounded-md hover:bg-accent/50 flex items-center gap-2"
                activeProps={{ className: "text-primary bg-accent/40" }}
                activeOptions={{ exact: l.to === "/" }}
              >
                <l.icon className="size-4" /> {l.label}
              </Link>
            ))}
            {user && (
              <Link
                to={roleHome(role) as "/dashboard/donor"}
                onClick={() => setOpen(false)}
                className="px-3 py-2.5 text-sm font-medium text-muted-foreground hover:text-primary rounded-md hover:bg-accent/50 flex items-center gap-2"
              >
                <LayoutDashboard className="size-4" /> My Dashboard
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
