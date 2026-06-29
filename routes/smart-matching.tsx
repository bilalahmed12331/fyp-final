import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Brain, Sparkles, MapPin, Droplet, Activity, Phone, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { matchDonors } from "@/lib/supabase-helpers";

export const Route = createFileRoute("/smart-matching")({
  head: () => ({ meta: [
    { title: "Smart Matching — LifeLink" },
    { name: "description", content: "AI-powered donor matching that ranks the most reliable, nearby donors for your blood group." },
  ]}),
  component: SmartMatching,
});

const bloodGroups = ["A+","A-","B+","B-","AB+","AB-","O+","O-"];

function SmartMatching() {
  const [form, setForm] = useState({
    blood_group: "O+",
    city: "Lahore",
    latitude: 31.5204,
    longitude: 74.3587
  });
  const [matched, setMatched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [donors, setDonors] = useState<any[]>([]);

  const handleMatch = async () => {
    setLoading(true);
    try {
      const result = await matchDonors(
        form.blood_group as any,
        form.latitude,
        form.longitude,
        form.city
      );
      setDonors(result.donors || []);
      setMatched(true);
      toast.success(`AI matched ${result.count} donors near you`);
    } catch (error: any) {
      toast.error(error.message || "Failed to match donors");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageShell
      eyebrow="AI-Powered"
      title="Smart Donor Matching"
      subtitle="Our AI ranks donors by reliability score, proximity, eligibility and response history — so you reach the right people first."
    >
      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-2 text-primary">
              <Brain className="size-5" />
              <h3 className="font-semibold">Match Request</h3>
            </div>
            <div className="space-y-3">
              <div>
                <Label>Blood Group Needed</Label>
                <Select value={form.blood_group} onValueChange={(v) => setForm({ ...form, blood_group: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {bloodGroups.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>City</Label>
                <Input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
              </div>
              <div>
                <Label>Latitude</Label>
                <Input type="number" step="any" value={form.latitude} onChange={(e) => setForm({ ...form, latitude: parseFloat(e.target.value) })} />
              </div>
              <div>
                <Label>Longitude</Label>
                <Input type="number" step="any" value={form.longitude} onChange={(e) => setForm({ ...form, longitude: parseFloat(e.target.value) })} />
              </div>
              <Button className="w-full bg-gradient-primary" onClick={handleMatch} disabled={loading}>
                {loading ? <Loader2 className="size-4 mr-2 animate-spin" /> : <Sparkles className="size-4 mr-2" />} 
                {loading ? "Matching..." : "Run Smart Match"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-2 space-y-3">
          <h3 className="font-semibold flex items-center gap-2">
            <Activity className="size-5 text-primary" />
            {matched ? `Top Matches (${donors.length})` : "Run match to see results"}
          </h3>
          {matched && donors.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center text-muted-foreground">
                No compatible donors found in your area.
              </CardContent>
            </Card>
          ) : matched ? (
            donors.map((d) => (
              <Card key={d.id} className="hover:shadow-elegant transition-shadow">
                <CardContent className="p-5 flex items-center gap-4">
                  <div className="size-14 rounded-full bg-gradient-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
                    {d.badge === 'none' ? '🩸' : d.badge === 'bronze' ? '🥉' : d.badge === 'silver' ? '🥈' : d.badge === 'gold' ? '🥇' : '💖'}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold">{d.name}</h4>
                      <Badge variant="secondary">{d.blood_group}</Badge>
                      <Badge variant="outline">{d.badge}</Badge>
                    </div>
                    <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mt-1">
                      <span className="flex items-center gap-1"><MapPin className="size-3" /> {d.distance_km} km away</span>
                      <span className="flex items-center gap-1"><Droplet className="size-3" /> {d.total_donations} donations</span>
                      <span className="flex items-center gap-1">{d.reward_points} points</span>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => toast.success(`Contact: ${d.phone}`)}>
                    <Phone className="size-3.5 mr-1.5" /> Contact
                  </Button>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="p-6 text-center text-muted-foreground">
                Enter blood group and location, then click "Run Smart Match" to find compatible donors.
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </PageShell>
  );
}
