import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Clock, ArrowRight } from "lucide-react";
import { articles } from "@/lib/articles-data";

export const Route = createFileRoute("/articles")({
  head: () => ({
    meta: [
      { title: "Health Articles — LifeLink" },
      { name: "description", content: "Expert articles on blood donation, health awareness and emergency care." },
    ],
  }),
  component: Articles,
});

function Articles() {
  return (
    <PageShell
      eyebrow="Knowledge Hub"
      title="Health Awareness Articles"
      subtitle="Expert-reviewed content on blood donation, nutrition, emergency care and patient stories."
    >
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {articles.map((a) => (
          <Card key={a.slug} className="hover:shadow-elegant transition-shadow flex flex-col">
            <CardContent className="p-6 flex-1 flex flex-col">
              <div className="aspect-video rounded-lg bg-gradient-to-br from-primary/30 to-primary/5 mb-4 flex items-center justify-center">
                <BookOpen className="size-10 text-primary/60" />
              </div>
              <Badge variant="secondary" className="self-start mb-2">{a.tag}</Badge>
              <h3 className="font-semibold text-lg leading-snug mb-2">{a.title}</h3>
              <p className="text-sm text-muted-foreground flex-1">{a.excerpt}</p>
              <div className="flex items-center justify-between mt-4 pt-4 border-t">
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="size-3.5" /> {a.read} min read
                </span>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/articles/$slug" params={{ slug: a.slug }}>
                    Read <ArrowRight className="size-3.5 ml-1" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </PageShell>
  );
}
