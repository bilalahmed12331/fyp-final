import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Hospital, MapPin, Phone, Search, Droplet, Bed } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/find-hospitals")({
  head: () => ({ meta: [
    { title: "Find Hospitals — LifeLink" },
    { name: "description", content: "Discover partner hospitals with live blood inventory and bed availability." },
  ]}),
  component: FindHospitals,
});

const hospitals = [
  { name: "Aga Khan University Hospital", city: "Karachi", beds: 712, blood: ["A+","B+","O+","AB+","O-"], phone: "021-111-911-911" },
  { name: "Shaukat Khanum Memorial", city: "Lahore", beds: 195, blood: ["A+","B+","O+","AB-"], phone: "042-3590-5000" },
  { name: "Shifa International", city: "Islamabad", beds: 488, blood: ["A+","B-","O+","O-"], phone: "051-846-4646" },
  { name: "Indus Hospital", city: "Karachi", beds: 300, blood: ["A+","B+","O+","AB+"], phone: "021-111-111-880" },
  { name: "Liaquat National Hospital", city: "Karachi", beds: 700, blood: ["A-","B+","O+","AB+","O-"], phone: "021-3441-2851" },
  { name: "PIMS", city: "Islamabad", beds: 592, blood: ["A+","B+","O+","AB+"], phone: "051-9261170" },
];

function FindHospitals() {
  const [q, setQ] = useState("");
  const filtered = hospitals.filter(h =>
    h.name.toLowerCase().includes(q.toLowerCase()) || h.city.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <PageShell
      eyebrow="Hospital Network"
      title="Partner Hospitals"
      subtitle="Live blood inventory, bed availability and direct contact for our verified hospital network."
    >
      <div className="flex gap-2 mb-8 max-w-2xl">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input placeholder="Search by hospital or city…" value={q} onChange={e => setQ(e.target.value)} className="pl-10 h-12" />
        </div>
        <Button size="lg" onClick={() => toast.success(`Found ${filtered.length} hospitals`)}>Search</Button>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        {filtered.map(h => (
          <Card key={h.name} className="hover:shadow-elegant transition-shadow">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-start gap-3">
                <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <Hospital className="size-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{h.name}</h3>
                  <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                    <MapPin className="size-3.5" /> {h.city}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <span className="flex items-center gap-1.5"><Bed className="size-4 text-primary" /> {h.beds} beds</span>
                <span className="flex items-center gap-1.5"><Droplet className="size-4 text-primary" /> Live inventory</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {h.blood.map(b => <Badge key={b} variant="secondary">{b}</Badge>)}
              </div>
              <div className="flex gap-2 pt-2 border-t">
                <Button variant="outline" size="sm" className="flex-1" onClick={() => toast.info(`Calling ${h.name}`)}>
                  <Phone className="size-3.5 mr-1.5" /> {h.phone}
                </Button>
                <Button size="sm" onClick={() => toast.success(`Request sent to ${h.name}`)}>Request Blood</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </PageShell>
  );
}
