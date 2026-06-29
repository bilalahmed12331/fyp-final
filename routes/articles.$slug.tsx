import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Clock, User, Calendar, Share2, BookOpen } from "lucide-react";
import { toast } from "sonner";
import { articles, getArticleBySlug } from "@/lib/articles-data";

export const Route = createFileRoute("/articles/$slug")({
  head: ({ params }) => {
    const a = getArticleBySlug(params.slug);
    return {
      meta: [
        { title: a ? `${a.title} — LifeLink` : "Article — LifeLink" },
        { name: "description", content: a?.excerpt ?? "LifeLink health article." },
      ],
    };
  },
  loader: ({ params }) => {
    const article = getArticleBySlug(params.slug);
    if (!article) throw notFound();
    return { article };
  },
  notFoundComponent: () => (
    <PageShell eyebrow="404" title="Article not found" subtitle="The article you're looking for doesn't exist.">
      <Button asChild><Link to="/articles">Back to articles</Link></Button>
    </PageShell>
  ),
  component: ArticlePage,
});

function ArticlePage() {
  const { article } = Route.useLoaderData();
  const related = articles.filter((a) => a.slug !== article.slug).slice(0, 3);

  const share = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    try {
      if (navigator.share) {
        await navigator.share({ title: article.title, text: article.excerpt, url });
      } else {
        await navigator.clipboard.writeText(url);
        toast.success("Link copied to clipboard");
      }
    } catch {
      toast.error("Couldn't share right now");
    }
  };

  return (
    <PageShell eyebrow={article.tag} title={article.title} subtitle={article.excerpt}>
      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-8">
        <span className="flex items-center gap-1.5"><User className="size-4" />{article.author}</span>
        <span className="flex items-center gap-1.5"><Calendar className="size-4" />{article.date}</span>
        <span className="flex items-center gap-1.5"><Clock className="size-4" />{article.read} min read</span>
        <Badge variant="secondary">{article.tag}</Badge>
      </div>

      <div className="aspect-[16/6] rounded-2xl bg-gradient-to-br from-primary/30 via-primary/10 to-background mb-10 flex items-center justify-center">
        <BookOpen className="size-16 text-primary/60" />
      </div>

      <article className="prose prose-invert max-w-3xl">
        {article.content.map((p: string, i: number) => (
          <p key={i} className="text-base lg:text-lg leading-relaxed text-foreground/90 mb-5">{p}</p>
        ))}
      </article>

      <div className="flex flex-wrap gap-3 mt-10 pt-8 border-t border-border/60">
        <Button asChild variant="outline"><Link to="/articles"><ArrowLeft className="size-4" /> All articles</Link></Button>
        <Button onClick={share} className="bg-gradient-primary text-primary-foreground"><Share2 className="size-4" /> Share article</Button>
      </div>

      <section className="mt-16">
        <h2 className="text-2xl font-bold font-display mb-5">Related articles</h2>
        <div className="grid md:grid-cols-3 gap-5">
          {related.map((a) => (
            <Link key={a.slug} to="/articles/$slug" params={{ slug: a.slug }}>
              <Card className="hover:shadow-elegant transition-shadow h-full">
                <CardContent className="p-5">
                  <Badge variant="secondary" className="mb-2">{a.tag}</Badge>
                  <h3 className="font-semibold leading-snug mb-2">{a.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">{a.excerpt}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
