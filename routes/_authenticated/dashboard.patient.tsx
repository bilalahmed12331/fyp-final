import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { DashboardShell, StatCard } from "@/components/DashboardShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Droplet, Send, CheckCircle2, Clock, XCircle, Phone, MapPin, Plus } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { createSOSRequest, getDashboardStats } from "@/lib/supabase-helpers";
import { useEffect } from "react";

export const Route = createFileRoute("/_authenticated/dashboard/patient")({
  component: PatientDashboard,
});

const statusStyles: Record<string, string> = {
  submitted: "bg-warning/15 text-warning-foreground border-warning/30",
  matching: "bg-primary/15 text-primary border-primary/30",
  accepted: "bg-primary/15 text-primary border-primary/30",
  en_route: "bg-primary/15 text-primary border-primary/30",
  delivered: "bg-success/15 text-success border-success/30",
  cancelled: "bg-destructive/15 text-destructive border-destructive/30",
};

function PatientDashboard() {
  const { user, profile } = useAuth();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ 
    hospital_name: "", 
    blood_group: "", 
    units_needed: 1, 
    city: profile?.city ?? "Lahore", 
    latitude: 31.5204, 
    longitude: 74.3587,
    urgency: "normal" as const,
    notes: ""
  });
  const [busy, setBusy] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile?.id) {
      loadStats();
    }
  }, [profile]);

  const loadStats = async () => {
    try {
      const data = await getDashboardStats(profile!.id, 'patient');
      setStats(data);
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const submitRequest = async () => {
    if (!form.hospital_name || !form.blood_group) return toast.error("Fill in hospital and blood group");
    setBusy(true);
    try {
      await createSOSRequest({
        blood_group: form.blood_group as any,
        units_needed: form.units_needed,
        urgency: form.urgency,
        hospital_name: form.hospital_name,
        city: form.city,
        latitude: form.latitude,
        longitude: form.longitude,
        patient_id: user!.id,
        notes: form.notes
      });
      toast.success("Blood request submitted — matching donors now");
      setOpen(false);
      await loadStats();
    } catch (error: any) {
      toast.error(error.message || "Failed to submit request");
    } finally {
      setBusy(false);
    }
  };

  if (loading) {
    return (
      <DashboardShell roleBadge="Patient" subtitle="Track your requests and received donations.">
        <div className="text-center py-12">Loading your dashboard...</div>
      </DashboardShell>
    );
  }

  const recentRequests = stats?.patient_stats?.recent_requests || [];

  return (
    <DashboardShell roleBadge="Patient" subtitle="Track your requests and received donations.">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Patient overview</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-primary text-primary-foreground shadow-elegant">
              <Plus className="size-4 mr-1.5" /> New blood request
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Request blood</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div><Label>Hospital Name</Label><Input value={form.hospital_name} onChange={(e) => setForm({ ...form, hospital_name: e.target.value })} placeholder="e.g., Services Hospital" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Blood group</Label>
                  <Select value={form.blood_group} onValueChange={(v) => setForm({ ...form, blood_group: v })}>
                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>{["A+","A-","B+","B-","AB+","AB-","O+","O-"].map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div><Label>Units needed</Label><Input type="number" min={1} value={form.units_needed} onChange={(e) => setForm({ ...form, units_needed: Number(e.target.value) })} /></div>
              </div>
              <div><Label>City</Label><Input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} placeholder="e.g., Lahore" /></div>
              <div><Label>Notes</Label><Input value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Medical condition, etc." /></div>
              <div>
                <Label>Urgency</Label>
                <Select value={form.urgency} onValueChange={(v) => setForm({ ...form, urgency: v as any })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={submitRequest} disabled={busy} className="bg-gradient-primary text-primary-foreground">Submit request</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total requests" value={stats?.patient_stats?.total_requests || 0} icon={Send} />
        <StatCard label="Fulfilled" value={stats?.patient_stats?.fulfilled_requests || 0} icon={CheckCircle2} />
        <StatCard label="Pending" value={stats?.patient_stats?.pending_requests || 0} icon={Clock} />
        <StatCard label="Cancelled" value={0} icon={XCircle} />
      </div>

      <div className="grid lg:grid-cols-2 gap-4 mt-6">
        <Card>
          <CardHeader><CardTitle className="text-base">My blood requests</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {recentRequests.length > 0 ? (
              recentRequests.map((r: any) => (
                <div key={r.id} className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <div className="font-medium">{r.hospital_name}</div>
                    <div className="text-xs text-muted-foreground">{new Date(r.created_at).toLocaleDateString()} · {r.blood_group} · {r.units_needed} units</div>
                  </div>
                  <Badge variant="outline" className={statusStyles[r.status] || ""}>{r.status}</Badge>
                </div>
              ))
            ) : (
              <div className="text-sm text-muted-foreground">No requests yet</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><Droplet className="size-4 text-primary" />Request codes</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {recentRequests.length > 0 ? (
              recentRequests.map((r: any) => (
                <div key={r.id} className="rounded-lg border p-3">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">{r.request_code}</div>
                    <Badge variant="secondary">{r.urgency}</Badge>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1.5">
                    <div className="flex items-center gap-1.5"><MapPin className="size-3" /> {r.city}</div>
                    <div className="flex items-center gap-1.5">{r.blood_group} · {r.units_needed} units</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-sm text-muted-foreground">No requests yet</div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}
