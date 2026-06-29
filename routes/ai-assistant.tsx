import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bot, Send, Sparkles, User } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/ai-assistant")({
  head: () => ({ meta: [
    { title: "AI Health Assistant — LifeLink" },
    { name: "description", content: "24/7 multilingual AI health assistant for blood donation, eligibility and emergency guidance." },
  ]}),
  component: AIAssistant,
});

type Msg = { role: "user" | "bot"; text: string };

const suggestions = [
  "Am I eligible to donate blood?",
  "What should I eat before donating?",
  "How often can I donate?",
  "Find me O+ donors in Karachi",
];

const replies: Record<string, string> = {
  eligible: "You're generally eligible if you're 18–65, weigh over 50kg, are in good health, and haven't donated in the last 90 days. Avoid donating if you have a fever, low hemoglobin, or recent tattoos/surgery.",
  eat: "Eat iron-rich foods like spinach, lentils, red meat, and citrus fruits 24 hours before. Hydrate well — drink at least 2 glasses of water before donating. Avoid fatty meals.",
  often: "Whole blood: every 90 days (men) or 120 days (women). Plasma: every 28 days. Platelets: every 7 days, up to 24 times a year.",
  find: "I can match you with verified O+ donors near you instantly. Head to Smart Matching, set your city, and I'll rank donors by reliability and distance.",
};

function botReply(q: string): string {
  const l = q.toLowerCase();
  if (l.includes("eligib")) return replies.eligible;
  if (l.includes("eat") || l.includes("food")) return replies.eat;
  if (l.includes("often") || l.includes("frequent")) return replies.often;
  if (l.includes("find") || l.includes("donor")) return replies.find;
  return "I'm your LifeLink AI Health Assistant. I can help with donation eligibility, nutrition, emergency steps, and finding donors. What would you like to know?";
}

function AIAssistant() {
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: "bot", text: "Hi! I'm LifeBot 🩸 — your AI health assistant. Ask me anything about blood donation, eligibility or emergencies." },
  ]);
  const [input, setInput] = useState("");

  const send = (text: string) => {
    if (!text.trim()) return;
    setMsgs(m => [...m, { role: "user", text }]);
    setInput("");
    setTimeout(() => {
      setMsgs(m => [...m, { role: "bot", text: botReply(text) }]);
    }, 500);
  };

  return (
    <PageShell
      eyebrow="LifeBot AI"
      title="AI Health Assistant"
      subtitle="Multilingual, 24/7. Ask about eligibility, nutrition, recovery, or emergency steps."
    >
      <div className="max-w-3xl mx-auto">
        <Card className="shadow-elegant">
          <CardContent className="p-0">
            <div className="border-b p-4 flex items-center gap-3">
              <div className="size-10 rounded-full bg-gradient-primary flex items-center justify-center">
                <Bot className="size-5 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-semibold">LifeBot</h3>
                <p className="text-xs text-emerald-500 flex items-center gap-1">
                  <span className="size-1.5 rounded-full bg-emerald-500" /> Online
                </p>
              </div>
            </div>

            <div className="h-[420px] overflow-y-auto p-4 space-y-4 bg-muted/20">
              {msgs.map((m, i) => (
                <div key={i} className={`flex gap-2 ${m.role === "user" ? "justify-end" : ""}`}>
                  {m.role === "bot" && <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0"><Bot className="size-4 text-primary" /></div>}
                  <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${m.role === "user" ? "bg-gradient-primary text-primary-foreground" : "bg-card border"}`}>
                    {m.text}
                  </div>
                  {m.role === "user" && <div className="size-8 rounded-full bg-muted flex items-center justify-center shrink-0"><User className="size-4" /></div>}
                </div>
              ))}
            </div>

            <div className="p-3 border-t space-y-3">
              <div className="flex flex-wrap gap-2">
                {suggestions.map(s => (
                  <Button key={s} size="sm" variant="outline" className="text-xs h-7" onClick={() => send(s)}>
                    <Sparkles className="size-3 mr-1" /> {s}
                  </Button>
                ))}
              </div>
              <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); send(input); }}>
                <Input placeholder="Ask LifeBot anything…" value={input} onChange={e => setInput(e.target.value)} />
                <Button type="submit"><Send className="size-4" /></Button>
              </form>
              <p className="text-xs text-muted-foreground text-center">
                LifeBot provides general guidance, not medical advice. For emergencies call 1122.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageShell>
  );
}
