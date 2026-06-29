import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Stethoscope, MapPin, Star, Phone, Search, Calendar } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/find-doctors")({
  head: () => ({ meta: [
    { title: "Find Doctors — LifeLink" },
    { name: "description", content: "Browse and book verified doctors across Pakistan on LifeLink." },
  ]}),
  component: FindDoctors,
});

const doctors = [
  { name: "Dr. Ayesha Khan", spec: "Hematologist", city: "Karachi", rating: 4.9, exp: 12, fee: 2500, phone: "+92 300 1234567" },
  { name: "Dr. Bilal Ahmed", spec: "Cardiologist", city: "Lahore", rating: 4.8, exp: 15, fee: 3000, phone: "+92 301 2345678" },
  { name: "Dr. Sara Malik", spec: "General Physician", city: "Islamabad", rating: 4.7, exp: 8, fee: 1500, phone: "+92 302 3456789" },
  { name: "Dr. Imran Tariq", spec: "Pediatrician", city: "Rawalpindi", rating: 4.9, exp: 10, fee: 2000, phone: "+92 303 4567890" },
  { name: "Dr. Fatima Noor", spec: "Gynecologist", city: "Karachi", rating: 4.8, exp: 14, fee: 2800, phone: "+92 304 5678901" },
  { name: "Dr. Usman Raza", spec: "Oncologist", city: "Lahore", rating: 4.9, exp: 18, fee: 3500, phone: "+92 305 6789012" },
];

function FindDoctors() {
  const [q, setQ] = useState("");
  const filtered = doctors.filter(d =>
    d.name.toLowerCase().includes(q.toLowerCase()) ||
    d.spec.toLowerCase().includes(q.toLowerCase()) ||
    d.city.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <PageShell
      eyebrow="Doctor Directory"
      title="Find Verified Doctors"
      subtitle="Search across specialists, hospitals and cities. Book an appointment in seconds."
    >
      <div className="flex gap-2 mb-8 max-w-2xl">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input placeholder="Search by name, specialty or city…" value={q} onChange={e => setQ(e.target.value)} className="pl-10 h-12" />
        </div>
        <Button size="lg" onClick={() => toast.success(`Found ${filtered.length} doctors`)}>Search</Button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map(d => (
          <Card key={d.name} className="hover:shadow-elegant transition-shadow">
            <CardContent className="p-6 space-y-3">
              <div className="flex items-start gap-3">
                <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Stethoscope className="size-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{d.name}</h3>
                  <p className="text-sm text-muted-foreground">{d.spec}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><MapPin className="size-3.5" /> {d.city}</span>
                <span className="flex items-center gap-1"><Star className="size-3.5 fill-amber-400 text-amber-400" /> {d.rating}</span>
                <Badge variant="secondary" className="text-xs">{d.exp} yrs</Badge>
              </div>
              <div className="flex items-center justify-between pt-2 border-t">
                <span className="font-semibold text-primary">Rs. {d.fee}</span>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => toast.info(`Calling ${d.name}`)}><Phone className="size-3.5" /></Button>
                  <Button size="sm" onClick={() => toast.success(`Appointment requested with ${d.name}`)}>
                    <Calendar className="size-3.5 mr-1" /> Book
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {filtered.length === 0 && <p className="text-center text-muted-foreground py-12">No doctors match your search.</p>}
    </PageShell>
  );
}
