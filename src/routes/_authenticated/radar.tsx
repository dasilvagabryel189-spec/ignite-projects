import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { z } from "zod";
import { Radar as RadarIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const CATEGORIES = ["Tendências", "Inteligência Artificial", "Produtos digitais", "Jogos", "Conteúdo", "Marketing", "Ferramentas", "Ideias de negócio"];

const oppsQuery = queryOptions({
  queryKey: ["opportunities"],
  queryFn: async () => {
    const { data, error } = await supabase.from("opportunities").select("*").order("published_at", { ascending: false });
    if (error) throw error;
    return data;
  },
});

export const Route = createFileRoute("/_authenticated/radar")({
  validateSearch: z.object({ categoria: z.string().optional() }),
  head: () => ({ meta: [{ title: "Radar — Primeiro Projeto Online" }, { name: "description", content: "Oportunidades e tendências para inspirar novos projetos." }] }),
  loader: ({ context }) => context.queryClient.ensureQueryData(oppsQuery),
  component: RadarPage,
  errorComponent: ({ error }) => <p role="alert">{(error as Error).message}</p>,
  notFoundComponent: () => <p>Não encontrado.</p>,
});

const levelStyle: Record<string, string> = {
  Alta: "bg-success/15 text-success",
  Média: "bg-primary/15 text-primary-bright",
  Emergente: "bg-surface text-muted-foreground",
};

function RadarPage() {
  const { data } = useSuspenseQuery(oppsQuery);
  const { categoria } = Route.useSearch();
  const navigate = useNavigate({ from: "/radar" });
  const [open, setOpen] = useState<(typeof data)[number] | null>(null);
  const list = categoria ? data.filter((o) => o.category === categoria) : data;
  const chip = (active: boolean) => `rounded-full border px-3 py-1.5 text-sm transition-colors ${active ? "border-primary bg-primary/15 text-foreground" : "border-border text-muted-foreground hover:text-foreground"}`;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="flex items-center gap-2 font-display text-3xl font-semibold"><RadarIcon className="size-7 text-primary-bright" /> Radar</h1>
        <p className="text-muted-foreground">Sinais e ideias para inspirar seu próximo projeto.</p>
      </div>
      <div className="flex flex-wrap gap-2">
        <button className={chip(!categoria)} onClick={() => navigate({ search: {} })}>Todas</button>
        {CATEGORIES.map((c) => <button key={c} className={chip(categoria === c)} onClick={() => navigate({ search: { categoria: c } })}>{c}</button>)}
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {list.length === 0 && <p className="text-sm text-muted-foreground">Nenhuma oportunidade nesta categoria ainda.</p>}
        {list.map((o) => (
          <div key={o.id} className="flex flex-col rounded-2xl border border-border bg-card p-6">
            <div className="flex items-center justify-between gap-2 text-xs">
              <span className="text-muted-foreground">{o.category}</span>
              <span className={`rounded-full px-2.5 py-1 font-medium ${levelStyle[o.level]}`}>{o.level}</span>
            </div>
            <h3 className="mt-3 font-display text-lg font-semibold">{o.title}</h3>
            <p className="mt-1 flex-1 text-sm text-muted-foreground">{o.description}</p>
            <div className="mt-4 flex flex-wrap gap-1.5">{o.tags.map((t) => <span key={t} className="rounded-md bg-surface px-2 py-0.5 text-xs">#{t}</span>)}</div>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{new Date(o.published_at + "T12:00").toLocaleDateString("pt-BR")}</span>
              <Button size="sm" onClick={() => setOpen(o)}>Explorar</Button>
            </div>
          </div>
        ))}
      </div>
      <Dialog open={!!open} onOpenChange={(v) => !v && setOpen(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{open?.title}</DialogTitle>
            <DialogDescription>{open?.category} · Oportunidade {open?.level.toLowerCase()}</DialogDescription>
          </DialogHeader>
          <p className="text-sm">{open?.description}</p>
          <div className="rounded-xl border border-border bg-surface p-4 text-sm">{open?.details}</div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
