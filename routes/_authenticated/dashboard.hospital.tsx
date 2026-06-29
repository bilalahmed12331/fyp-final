import { createFileRoute } from "@tanstack/react-router";
import { DashboardShell, StatCard } from "@/components/DashboardShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Hospital, Droplet, AlertTriangle, TrendingDown, Plus } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { getDashboardStats } from "@/lib/supabase-helpers";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/_authenticated/dashboard/hospital")({
  component: HospitalDashboard,
});

const inventoryColor: Record<string, string> = {
  OK: "bg-success/15 text-success border-success/30",
  Low: "bg-warning/15 text-warning-foreground border-warning/30",
  Critical: "bg-destructive/15 text-destructive border-destructive/30",
};

function HospitalDashboard() {
  const { profile } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [inventory, setInventory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile?.id) {
      loadData();
    }
  }, [profile]);

  const loadData = async () => {
    try {
      const [statsData, inventoryData] = await Promise.all([
        getDashboardStats(profile!.id, 'hospital'),
        supabase.from('blood_inventory').select('*').eq('hospital_id', profile!.id)
      ]);
      setStats(statsData);
      setInventory(inventoryData.data || []);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getInventoryStatus = (units: number, max: number) => {
    const ratio = units / max;
    if (ratio < 0.2) return 'Critical';
    if (ratio < 0.4) return 'Low';
    return 'OK';
  };

  if (loading) {
    return (
      <DashboardShell roleBadge="Hospital" subtitle={profile?.name || "Hospital Dashboard"}>
        <div className="text-center py-12">Loading your dashboard...</div>
      </DashboardShell>
    );
  }

  const hospitalStats = stats?.hospital_stats || {};
  const pendingRequests = hospitalStats.pending_requests || [];

  return (
    <DashboardShell roleBadge="Hospital" subtitle={profile?.name || "Hospital Dashboard"}>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total donations" value={hospitalStats.total_donations || 0} icon={Hospital} />
        <StatCard label="Blood units" value={inventory.reduce((sum, i) => sum + i.units, 0)} icon={Droplet} />
        <StatCard label="Pending requests" value={pendingRequests.length} icon={AlertTriangle} />
        <StatCard label="Low stock alerts" value={inventory.filter(i => getInventoryStatus(i.units, i.max_units) !== 'OK').length} icon={TrendingDown} />
      </div>

      <div className="grid lg:grid-cols-3 gap-4 mt-6">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle className="text-base">Pending blood requests</CardTitle></CardHeader>
          <CardContent>
            {pendingRequests.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Request Code</TableHead><TableHead>Patient</TableHead><TableHead>Group</TableHead><TableHead>Units</TableHead><TableHead>Urgency</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingRequests.map((r: any) => (
                      <TableRow key={r.id}>
                        <TableCell className="text-xs font-mono">{r.request_code}</TableCell>
                        <TableCell className="font-medium">{r.patient_name || 'Unknown'}</TableCell>
                        <TableCell><Badge variant="outline">{r.blood_group}</Badge></TableCell>
                        <TableCell>{r.units_needed}</TableCell>
                        <TableCell><Badge variant={r.urgency === 'critical' ? 'destructive' : 'secondary'}>{r.urgency}</Badge></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">No pending requests</div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-base flex items-center gap-2"><AlertTriangle className="size-4 text-primary" />Critical Alerts</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {inventory.filter(i => getInventoryStatus(i.units, i.max_units) === 'Critical').map((i) => (
                <div key={i.id} className="rounded-lg border p-3">
                  <div className="font-medium flex items-center justify-between">{i.blood_group}<Badge variant="destructive">Critical</Badge></div>
                  <div className="text-xs text-muted-foreground mt-1">{i.units}/{i.max_units} units remaining</div>
                </div>
              ))}
              {inventory.filter(i => getInventoryStatus(i.units, i.max_units) === 'Critical').length === 0 && (
                <div className="text-sm text-muted-foreground">No critical alerts</div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base">Quick Actions</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              <Button size="sm" className="w-full bg-gradient-primary text-primary-foreground" onClick={() => toast.success('Inventory update coming soon')}>
                <Plus className="size-3.5 mr-1.5" /> Update Inventory
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="mt-6">
        <CardHeader><CardTitle className="text-base">Blood inventory</CardTitle></CardHeader>
        <CardContent>
          {inventory.length > 0 ? (
            <div className="grid sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {inventory.map((i) => {
                const status = getInventoryStatus(i.units, i.max_units);
                return (
                  <div key={i.id} className="rounded-lg border p-4 text-center">
                    <div className="text-3xl font-bold font-display text-primary">{i.blood_group}</div>
                    <div className="text-2xl font-semibold mt-1">{i.units} <span className="text-xs text-muted-foreground">/ {i.max_units}</span></div>
                    <Badge variant="outline" className={`mt-2 ${inventoryColor[status]}`}>{status}</Badge>
                    <div className="text-[10px] text-muted-foreground mt-1">Updated: {new Date(i.updated_at).toLocaleDateString()}</div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">No inventory data. Please set up your blood inventory.</div>
          )}
        </CardContent>
      </Card>
    </DashboardShell>
  );
}
