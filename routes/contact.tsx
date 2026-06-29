import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/contact")({
  head: () => ({ meta: [
    { title: "Contact Us — LifeLink" },
    { name: "description", content: "Reach the LifeLink team for support, partnerships and emergency assistance." },
  ]}),
  component: Contact,
});

function Contact() {
  const [sending, setSending] = useState(false);

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => {
      setSending(false);
      (e.target as HTMLFormElement).reset();
      toast.success("Message sent — we'll get back within 24 hours.");
    }, 800);
  };

  return (
    <PageShell
      eyebrow="Get in Touch"
      title="Contact LifeLink"
      subtitle="Questions, partnerships or feedback? We'd love to hear from you."
    >
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="space-y-4">
          {[
            { icon: Mail, label: "Email", value: "support@lifelink.pk" },
            { icon: Phone, label: "24/7 Hotline", value: "+92 311 LIFELINK" },
            { icon: MapPin, label: "Head Office", value: "Karachi, Pakistan" },
            { icon: Clock, label: "Support Hours", value: "24 / 7 / 365" },
          ].map(i => (
            <Card key={i.label}>
              <CardContent className="p-5 flex items-start gap-3">
                <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <i.icon className="size-5" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">{i.label}</p>
                  <p className="font-semibold">{i.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="lg:col-span-2 shadow-elegant">
          <CardContent className="p-6">
            <h3 className="font-semibold text-lg mb-1">Send us a message</h3>
            <p className="text-sm text-muted-foreground mb-5">We respond within 24 hours.</p>
            <form className="space-y-4" onSubmit={submit}>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" required placeholder="Your name" />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" required placeholder="you@example.com" />
                </div>
              </div>
              <div>
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" required placeholder="How can we help?" />
              </div>
              <div>
                <Label htmlFor="msg">Message</Label>
                <Textarea id="msg" required rows={6} placeholder="Tell us a bit more…" />
              </div>
              <Button type="submit" disabled={sending} className="bg-gradient-primary gap-2">
                {sending ? "Sending…" : <>Send Message <Send className="size-4" /></>}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </PageShell>
  );
}
