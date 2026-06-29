import { createFileRoute } from "@tanstack/react-router";
import { DashboardShell, StatCard } from "@/components/DashboardShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, Droplet, Hospital, AlertTriangle, Stethoscope, Activity, Ban, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/dashboard/admin")({
  component: AdminDashboard,
});

const recentUsers = [
  { name: "Taimoor Ahmed", role: "Donor", city: "Karachi", status: "active" },
  { name: "Hanif Memon", role: "Patient", city: "Lahore", status: "active" },
  { name: "Aga Khan Hospital", role: "Hospital", city: "Karachi", status: "verified" },
  { name: "Dr. Sara Khan", role: "Doctor", city: "Islamabad", status: "pending" },
  { name: "National Blood Bank", role: "Blood Bank", city: "Karachi", status: "verified" },
];

const activity = [
  "New donor registered: Bilal R. (O-) — 2m ago",
  "Emergency request matched at Shifa International — 8m ago",
  "Hospital onboarded: Indus Hospital — 35m ago",
  "AI flagged O- shortage in Karachi region — 1h ago",
  "1,200 SMS notifications dispatched today",
];

function AdminDashboard() {
  return (
    <DashboardShell roleBadge="Admin" subtitle="Platform-wide overview and controls.">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total users" value="14,302" icon={Users} />
        <StatCard label="Active donors" value="9,418" icon={Droplet} />
        <StatCard label="Hospitals" value={316} icon={Hospital} />
        <StatCard label="Doctors" value={1128} icon={Stethoscope} />
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
        <StatCard label="Blood requests" value="8,392" icon={Droplet} accent="bg-warning/15 text-warning-foreground" />
        <StatCard label="Emergency requests" value={62} icon={AlertTriangle} accent="bg-destructive/15 text-destructive" />
        <StatCard label="Donations completed" value="21,540" icon={CheckCircle2} accent="bg-success/15 text-success" />
        <StatCard label="Lives saved" value="64,620" icon={Activity} />
      </div>

      <div className="grid lg:grid-cols-3 gap-4 mt-6">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Recent users</CardTitle>
            <Button size="sm" onClick={() => toast.info("Open user manager")}>Manage users</Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Role</TableHead><TableHead>City</TableHead><TableHead>Status</TableHead><TableHead></TableHead></TableRow></TableHeader>
              <TableBody>
                {recentUsers.map((u) => (
                  <TableRow key={u.name}>
                    <TableCell className="font-medium">{u.name}</TableCell>
                    <TableCell><Badge variant="outline">{u.role}</Badge></TableCell>
                    <TableCell className="text-sm">{u.city}</TableCell>
                    <TableCell><Badge variant={u.status === "pending" ? "outline" : "secondary"}>{u.status}</Badge></TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" variant="ghost" onClick={() => toast.error(`${u.name} blocked`)}><Ban className="size-3.5" /></Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><Activity className="size-4 text-primary" />Activity log</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            {activity.map((a, i) => (
              <div key={i} className="flex items-start gap-2 pb-2 border-b last:border-0 last:pb-0">
                <div className="size-1.5 rounded-full bg-primary mt-2 shrink-0" />
                <span>{a}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}
