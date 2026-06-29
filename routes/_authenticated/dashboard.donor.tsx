import { createFileRoute } from "@tanstack/react-router";
import { DashboardShell, StatCard } from "@/components/DashboardShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Droplet, Heart, Award, Flame, Bell, Calendar, MapPin, Activity } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { getDashboardStats, updateRequestStatus } from "@/lib/supabase-helpers";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/_authenticated/dashboard/donor")({
  component: DonorDashboard,
});

function DonorDashboard() {
  const { profile, refresh } = useAuth();
  const [available, setAvailable] = useState(profile?.donor_info?.is_available ?? true);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const donorInfo = profile?.donor_info;
  const lastDonation = donorInfo?.last_donated ? new Date(donorInfo.last_donated) : null;
  const nextEligible = lastDonation ? new Date(lastDonation.getTime() + 90 * 86400000) : null;
  const daysLeft = nextEligible ? Math.max(0, Math.ceil((nextEligible.getTime() - Date.now()) / 86400000)) : 0;
  const reliability = 92;

  useEffect(() => {
    if (profile?.id) {
      loadStats();
    }
  }, [profile]);

  useEffect(() => {
    setAvailable(profile?.donor_info?.is_available ?? true);
  }, [profile]);

  const loadStats = async () => {
    try {
      const data = await getDashboardStats(profile!.id, 'donor');
      setStats(data);
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleAvailable = async (v: boolean) => {
    setAvailable(v);
    const { error } = await supabase
      .from("donors")
      .update({ is_available: v })
      .eq("user_id", profile!.id);
    if (error) {
      toast.error(error.message);
      setAvailable(!v);
      return;
    }
    toast.success(v ? "You're now available to donate" : "Availability paused");
    await refresh();
  };

  const acceptRequest = async (requestId: string) => {
    try {
      await updateRequestStatus(requestId, 'accepted', donorInfo!.id);
      toast.success('Request accepted successfully');
      await loadStats();
    } catch (error) {
      toast.error('Failed to accept request');
    }
  };

  const achievements = [
    { name: "Bronze Donor", earned: donorInfo?.badge === 'bronze' || ['silver', 'gold', 'lifesaver'].includes(donorInfo?.badge || ''), icon: "🥉" },
    { name: "Silver Donor", earned: donorInfo?.badge === 'silver' || ['gold', 'lifesaver'].includes(donorInfo?.badge || ''), icon: "🥈" },
    { name: "Gold Donor", earned: donorInfo?.badge === 'gold' || donorInfo?.badge === 'lifesaver', icon: "🥇" },
    { name: "Life Saver", earned: donorInfo?.badge === 'lifesaver', icon: "💖" },
  ];

  if (loading) {
    return (
      <DashboardShell roleBadge="Donor" subtitle="Your impact, donations, and matched requests.">
        <div className="text-center py-12">Loading your dashboard...</div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell roleBadge="Donor" subtitle="Your impact, donations, and matched requests.">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total donations" value={donorInfo?.total_donations || 0} icon={Droplet} />
        <StatCard label="Lives saved" value={(donorInfo?.total_donations || 0) * 3} icon={Heart} />
        <StatCard label="Reward points" value={donorInfo?.reward_points || 0} icon={Award} />
        <StatCard label="Badge" value={donorInfo?.badge || 'none'} icon={Flame} />
      </div>

      <div className="grid lg:grid-cols-3 gap-4 mt-6">
        <Card className="lg:col-span-1">
          <CardHeader><CardTitle className="text-base">AI Reliability Score</CardTitle></CardHeader>
          <CardContent>
            <div className="text-5xl font-bold font-display bg-gradient-primary bg-clip-text text-transparent">{reliability}<span className="text-2xl text-muted-foreground">/100</span></div>
            <Progress value={reliability} className="mt-3" />
            <p className="text-xs text-muted-foreground mt-3">Based on response speed, donation frequency, and availability.</p>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base flex items-center gap-2"><Calendar className="size-4 text-primary" />Next eligible donation</CardTitle>
            <div className="flex items-center gap-2 text-sm"><span className="text-muted-foreground">Available</span><Switch checked={available} onCheckedChange={toggleAvailable} /></div>
          </CardHeader>
          <CardContent>
            {lastDonation ? (
              <div className="flex flex-wrap gap-6 items-end">
                <div>
                  <div className="text-xs text-muted-foreground">Last donation</div>
                  <div className="font-semibold">{lastDonation.toDateString()}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Next eligible</div>
                  <div className="font-semibold">{nextEligible?.toDateString()}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Countdown</div>
                  <div className="font-semibold text-primary">{daysLeft === 0 ? "Eligible today!" : `${daysLeft} days`}</div>
                </div>
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">No donations recorded yet</div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-4 mt-6">
        <Card>
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><Bell className="size-4 text-primary" />Notifications</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {stats?.donor_stats?.unread_notifications > 0 ? (
              <div className="text-sm text-muted-foreground">You have {stats.donor_stats.unread_notifications} unread notifications</div>
            ) : (
              <div className="text-sm text-muted-foreground">No new notifications</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><Activity className="size-4 text-primary" />Recent Donations</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-2">
              {stats?.donor_stats?.recent_donations?.length > 0 ? (
                stats.donor_stats.recent_donations.map((d: any) => (
                  <div key={d.id} className="flex items-center justify-between text-sm border-b last:border-0 pb-2 last:pb-0">
                    <div>
                      <div className="font-medium">{d.hospital_name}</div>
                      <div className="text-xs text-muted-foreground">{new Date(d.donated_at).toLocaleDateString()}</div>
                    </div>
                    <Badge variant="secondary">{d.blood_group} · {d.units} unit</Badge>
                  </div>
                ))
              ) : (
                <div className="text-sm text-muted-foreground">No donations recorded yet</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader><CardTitle className="text-base flex items-center gap-2"><Award className="size-4 text-primary" />Achievements</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {achievements.map((a) => (
            <div key={a.name} className={`rounded-lg border p-4 text-center ${a.earned ? "bg-gradient-soft border-primary/30" : "opacity-50"}`}>
              <div className="text-3xl">{a.icon}</div>
              <div className="text-sm font-medium mt-1">{a.name}</div>
              <div className="text-xs text-muted-foreground">{a.earned ? "Earned" : "Locked"}</div>
            </div>
          ))}
        </CardContent>
      </Card>
    </DashboardShell>
  );
}
