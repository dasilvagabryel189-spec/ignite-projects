import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Check, Trophy } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { progressQuery, type Mission } from "@/lib/progress";
import { ProGate } from "@/components/plans";

export const Route = createFileRoute("/_authenticated/missoes")({
  head: () => ({ meta: [{ title: "Missões — Primeiro Projeto Online" }, { name: "description", content: "Desafios práticos para construir seus projetos." }] }),
  loader: ({ context }) => context.queryClient.ensureQueryData(progressQuery),
  component: MissionsPage,
  errorComponent: ({ error }) => <p role="alert">{(error as Error).message}</p>,
  notFoundComponent: () => <p>Não encontrado.</p>,
});

function MissionsPage() {
  const { data } = useSuspenseQuery(progressQuery);
  const [celebrate, setCelebrate] = useState<string | null>(null);
  const isDone = (m: Mission) => m.steps.length > 0 && m.steps.every((s) => data.doneSet.has(s.id));
  const groups: [string, string, Mission[]][] = [
    ["semana", "Da semana", data.missions.filter((m) => m.category === "semana" && !isDone(m))],
    ["rapida", "Rápidas", data.missions.filter((m) => m.category === "rapida" && !isDone(m))],
    ["avancada", "Avançadas", data.missions.filter((m) => m.category === "avancada" && !isDone(m))],
    ["concluidas", "Concluídas", data.missions.filter(isDone)],
  ];
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold">Missões</h1>
        <p className="text-muted-foreground">Desafios práticos para tirar ideias do papel. Cada etapa vale XP.</p>
      </div>
      <Tabs defaultValue="semana">
        <TabsList className="flex-wrap">{groups.map(([k, l, ms]) => <TabsTrigger key={k} value={k}>{l} ({ms.length})</TabsTrigger>)}</TabsList>
        {groups.map(([k, , ms]) => {
          const grid = (
            <div className="grid gap-4 md:grid-cols-2">
              {ms.length === 0 && <p className="text-sm text-muted-foreground">Nenhuma missão aqui por enquanto.</p>}
              {ms.map((m) => <MissionCard key={m.id} m={m} doneSet={data.doneSet} onComplete={() => setCelebrate(m.title)} />)}
            </div>
          );
          return (
            <TabsContent key={k} value={k} className="mt-4">
              {k === "avancada" ? <ProGate feature="Missões avançadas">{grid}</ProGate> : grid}
            </TabsContent>
          );
        })}
      </Tabs>
      {celebrate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm animate-in fade-in" onClick={() => setCelebrate(null)}>
          <div className="w-full max-w-sm rounded-2xl border border-primary/50 bg-card p-8 text-center animate-in zoom-in-90 duration-500">
            <Trophy className="mx-auto size-14 animate-bounce text-primary-bright" />
            <p className="mt-4 font-display text-2xl font-semibold">Missão concluída!</p>
            <p className="mt-1 text-primary-bright">+100 XP</p>
            <p className="mt-3 text-sm text-muted-foreground">{celebrate}</p>
          </div>
        </div>
      )}
    </div>
  );
}

function MissionCard({ m, doneSet, onComplete }: { m: Mission; doneSet: Set<string>; onComplete: () => void }) {
  const qc = useQueryClient();
  const done = m.steps.filter((s) => doneSet.has(s.id)).length;
  const toggle = useMutation({
    mutationFn: async (stepId: string) => {
      const was = doneSet.has(stepId);
      const { error } = was
        ? await supabase.from("user_step_progress").delete().eq("step_id", stepId)
        : await supabase.from("user_step_progress").insert({ step_id: stepId });
      if (error) throw error;
      return !was;
    },
    onSuccess: (added) => {
      if (added) {
        if (done + 1 === m.steps.length) onComplete(); else toast.success(`+${m.xp_per_step} XP`);
      }
      qc.invalidateQueries({ queryKey: ["progress"] });
    },
    onError: () => toast.error("Não foi possível salvar."),
  });
  const fmt = (d: string) => new Date(d + "T12:00").toLocaleDateString("pt-BR");
  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="flex flex-wrap gap-2 text-xs">
        <span className="rounded-full bg-surface px-2.5 py-1">{m.difficulty}</span>
        <span className="rounded-full bg-primary/15 px-2.5 py-1 text-primary-bright">{m.steps.length * m.xp_per_step + m.xp_bonus} XP</span>
        <span className="rounded-full bg-surface px-2.5 py-1 text-muted-foreground">{fmt(m.starts_at)} – {fmt(m.ends_at)}</span>
      </div>
      <h3 className="mt-3 font-display text-lg font-semibold">{m.title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{m.description}</p>
      <Progress value={(done / m.steps.length) * 100} className="mt-4" />
      <p className="mt-1 text-xs text-muted-foreground">{done}/{m.steps.length} etapas</p>
      <ul className="mt-4 space-y-2">
        {m.steps.map((s) => {
          const ok = doneSet.has(s.id);
          return (
            <li key={s.id}>
              <button disabled={toggle.isPending} onClick={() => toggle.mutate(s.id)} className="flex w-full items-center gap-3 rounded-lg border border-border px-3 py-2 text-left text-sm transition-colors hover:bg-surface">
                <span className={`flex size-5 shrink-0 items-center justify-center rounded-full border ${ok ? "border-success bg-success text-background" : "border-border"}`}>{ok && <Check className="size-3" />}</span>
                <span className={ok ? "text-muted-foreground line-through" : ""}>{s.position}. {s.title}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
