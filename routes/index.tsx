import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Navbar } from "@/components/Navbar";
import { Logo } from "@/components/Logo";
import { useAuth, roleHome } from "@/lib/auth";
import {
  Droplet, Heart, Hospital, Search, AlertTriangle, Users,
  Activity, ShieldCheck, Phone, Stethoscope, Award, ArrowRight,
  Brain, Zap, MapPin, Sparkles,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "LifeLink — AI-Powered Smart Blood Donation Platform" },
      { name: "description", content: "An AI-powered smart blood donation & emergency healthcare system connecting donors, patients and hospitals across Pakistan." },
      { property: "og:title", content: "LifeLink — Bridging Life, One Donation at a Time" },
      { property: "og:description", content: "AI-powered smart blood donation & emergency healthcare platform." },
      { property: "og:type", content: "website" },
    ],
  }),
  component: Home,
});

const heroChips = [
  { icon: Brain, label: "Smart Donor Matching" },
  { icon: Zap, label: "AI Priority Detection" },
  { icon: MapPin, label: "Live Blood Tracking" },
  { icon: ShieldCheck, label: "Verified & Secure" },
];

const stats = [
  { label: "Active Donors", value: "12,847", icon: Users },
  { label: "Blood Requests", value: "8,392", icon: Droplet },
  { label: "Completed Donations", value: "21,540", icon: Heart },
  { label: "Partner Hospitals", value: "316", icon: Hospital },
  { label: "Registered Doctors", value: "1,128", icon: Stethoscope },
  { label: "Lives Saved", value: "64,620", icon: Award },
];

const features = [
  { icon: Search, title: "Search Blood Donor", desc: "Find verified donors near you, filtered by blood group and city." },
  { icon: Droplet, title: "Request Blood", desc: "Post a request and reach the right donors instantly." },
  { icon: Heart, title: "Become a Donor", desc: "Register, donate, and save up to three lives per donation." },
  { icon: Hospital, title: "Find Hospitals", desc: "Browse partner hospitals and their live blood inventory." },
  { icon: Stethoscope, title: "Find Doctors", desc: "Book appointments with specialists across the network." },
  { icon: AlertTriangle, title: "Emergency SOS", desc: "Trigger SOS — nearby donors get notified within seconds." },
  { icon: Activity, title: "Health Awareness", desc: "Articles and tips from medical professionals." },
  { icon: ShieldCheck, title: "Verified & Secure", desc: "CNIC-verified profiles and end-to-end encrypted data." },
];

function Home() {
  const { user, role } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      {/* HERO — split: left text + chips, right glowing logo */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-hero" />
        {/* Ambient glow blobs */}
        <div className="absolute -top-32 -left-24 size-[28rem] rounded-full bg-primary/20 blur-[120px] -z-10" />
        <div className="absolute -bottom-40 -right-24 size-[32rem] rounded-full bg-primary-glow/15 blur-[140px] -z-10" />

        <div className="container mx-auto px-6 lg:px-10 py-20 md:py-28 grid lg:grid-cols-[1.15fr_0.85fr] gap-12 items-center">
          {/* Left — text */}
          <div className="animate-fade-up">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/8 backdrop-blur border border-white/10 px-4 py-1.5 text-xs font-semibold tracking-wider uppercase text-white/90">
              <Sparkles className="size-3.5 text-primary" /> AI-Powered · Healthcare
            </span>
            <h1 className="mt-6 text-4xl md:text-6xl lg:text-7xl font-extrabold leading-[1.05] text-white">
              Bridging Life,<br />
              <span className="text-gradient-primary">One Donation</span><br />
              <span className="text-white/95">at a Time</span>
            </h1>
            <p className="mt-6 text-lg text-white/75 max-w-xl leading-relaxed">
              An AI-powered smart blood donation & emergency healthcare system connecting donors, patients and hospitals across Pakistan.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                size="lg"
                onClick={() => navigate({ to: user ? roleHome(role) as "/dashboard/donor" : "/auth" })}
                className="bg-gradient-primary text-primary-foreground shadow-elegant hover:shadow-glow transition-all px-7 h-12"
              >
                <AlertTriangle className="size-5 mr-2" /> Emergency SOS
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate({ to: "/auth", search: { tab: "register" } })}
                className="border-white/25 bg-white/5 text-white hover:bg-white/10 backdrop-blur h-12 px-6"
              >
                Become a Donor <ArrowRight className="size-4 ml-2" />
              </Button>
            </div>

            {/* Feature chips */}
            <div className="mt-10 grid grid-cols-2 gap-3 max-w-lg">
              {heroChips.map((c) => (
                <div
                  key={c.label}
                  className="flex items-center gap-2.5 rounded-xl bg-white/5 backdrop-blur border border-white/10 px-4 py-3 hover:bg-white/10 transition-colors"
                >
                  <div className="size-8 rounded-lg bg-gradient-primary flex items-center justify-center shadow-elegant shrink-0">
                    <c.icon className="size-4 text-white" />
                  </div>
                  <span className="text-sm font-medium text-white/90">{c.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right — glowing logo */}
          <div className="relative flex items-center justify-center order-first lg:order-last">
            <div className="absolute size-72 md:size-96 rounded-full bg-primary/30 blur-3xl animate-pulse-ring" />
            <div className="absolute size-72 md:size-96 rounded-full bg-primary/20 blur-2xl animate-pulse-ring [animation-delay:0.8s]" />
            <div className="relative animate-heart-beat drop-shadow-[0_0_40px_oklch(0.64_0.24_25/0.6)]">
              <Logo size={220} withText={false} />
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="container mx-auto px-6 lg:px-10 -mt-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {stats.map((s) => (
            <Card key={s.label} className="bg-gradient-card border-border/60 backdrop-blur shadow-soft hover:shadow-elegant hover:border-primary/40 transition-all">
              <CardContent className="p-4 text-center">
                <s.icon className="size-5 mx-auto text-primary" />
                <div className="mt-2 text-2xl font-extrabold font-display text-white">{s.value}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{s.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section id="explore" className="container mx-auto px-6 lg:px-10 py-24">
        <div className="text-center max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/30 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
            <Heart className="size-3" /> Platform Features
          </span>
          <h2 className="mt-4 text-3xl md:text-5xl font-extrabold text-white">Everything you need to <span className="text-gradient-primary">save a life</span></h2>
          <p className="mt-4 text-muted-foreground">
            One trusted ecosystem for donors, patients, hospitals, and doctors — powered by AI to match the right donor at the right moment.
          </p>
        </div>
        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((f) => (
            <Card key={f.title} className="group bg-gradient-card border-border/60 hover:border-primary/50 hover:shadow-elegant hover:-translate-y-1 transition-all">
              <CardContent className="p-6">
                <div className="size-12 rounded-xl bg-gradient-primary text-primary-foreground flex items-center justify-center shadow-elegant group-hover:scale-110 transition-transform">
                  <f.icon className="size-5" />
                </div>
                <h3 className="mt-5 font-bold text-white">{f.title}</h3>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{f.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA band */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-primary -z-10" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(255,255,255,0.15),transparent_50%)] -z-10" />
        <div className="container mx-auto px-6 lg:px-10 py-16 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-white">
            <h3 className="text-3xl md:text-4xl font-extrabold">Ready to make a difference?</h3>
            <p className="text-white/90 mt-2">Join 12,000+ donors saving lives across Pakistan.</p>
          </div>
          <div className="flex gap-3">
            <Button size="lg" className="bg-white text-primary hover:bg-white/90 h-12 px-7 font-semibold shadow-elegant" asChild>
              <Link to="/auth" search={{ tab: "register" }}>Register now</Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white/40 bg-transparent text-white hover:bg-white/10 h-12 px-6" asChild>
              <Link to="/auth">Log in</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/60">
        <div className="container mx-auto px-6 lg:px-10 py-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Droplet className="size-4 text-primary" />
            <span>© {new Date().getFullYear()} LifeLink · Final Year Project</span>
          </div>
          <div className="flex items-center gap-5 text-muted-foreground">
            <a href="#" className="hover:text-primary transition-colors flex items-center gap-1.5"><Phone className="size-3.5" /> 24/7 Helpline</a>
            <a href="#" className="hover:text-primary transition-colors">Privacy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
