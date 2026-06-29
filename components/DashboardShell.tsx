import { type ReactNode } from "react";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth";
import { Loader2 } from "lucide-react";

export function DashboardShell({
  subtitle,
  roleBadge,
  children,
}: {
  subtitle?: string;
  roleBadge: string;
  children: ReactNode;
}) {
  const { profile, loading } = useAuth();

  return (
    <div className="min-h-screen bg-muted/30">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-wrap items-end justify-between gap-3 mb-6">
          <div>
            <Badge className="bg-gradient-primary text-primary-foreground border-0 mb-2">{roleBadge}</Badge>
            <h1 className="text-3xl font-bold font-display">
              Welcome, {profile?.full_name?.split(" ")[0] ?? "Friend"}!
            </h1>
            {subtitle && <p className="text-muted-foreground mt-1">{subtitle}</p>}
          </div>
        </div>
        {loading ? (
          <Card><CardContent className="p-12 flex items-center justify-center"><Loader2 className="size-6 animate-spin text-primary" /></CardContent></Card>
        ) : (
          children
        )}
      </div>
    </div>
  );
}

export function StatCard({ label, value, icon: Icon, accent }: { label: string; value: string | number; icon: any; accent?: string }) {
  return (
    <Card className="border-border/60 hover:shadow-elegant transition-shadow">
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs uppercase tracking-wide text-muted-foreground">{label}</div>
            <div className="mt-1.5 text-2xl font-bold font-display">{value}</div>
          </div>
          <div className={`size-11 rounded-xl flex items-center justify-center ${accent ?? "bg-gradient-primary text-primary-foreground shadow-elegant"}`}>
            <Icon className="size-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
