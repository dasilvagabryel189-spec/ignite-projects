import { PlanBanner } from "@/components/plans";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { CheckCircle2, Flame, Sparkles, Target } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { levelFromXp, progressQuery, todayISO } from "@/lib/progress";

export const Route = createFileRoute("/_authenticated/painel")({
  head: () => ({ meta: [{ title: "Painel — Primeiro Projeto Online" }, { name: "description", content: "Seu progresso, XP e missão do dia." }] }),
  loader: ({ context }) => context.queryClient.ensureQueryData(progressQuery),
  component: Dashboard,
  errorComponent: ({ error }) => <p role="alert">{(error as Error).message}</p>,
  notFoundComponent: () => <p>Não encontrado.</p>,
});

function Dashboard() {
  const { data } = useSuspenseQuery(progressQuery);
  const qc = useQueryClient();
  const { level, into, need } = levelFromXp(data.xp);
  const doneToday = data.history.some((h) => h.day === todayISO());
  const active = data.missions.find((m) => m.steps.some((s) => !data.doneSet.has(s.id)));

  const complete = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("daily_completions").insert({ day: todayISO(), daily_mission_id: data.today!.id });
      if (error) throw error;
    },
    onSuccess: () => { toast.success(`Missão concluída! +${data.today?.xp ?? 0} XP`); qc.invalidateQueries({ queryKey: ["progress"] }); },
    onError: () => toast.error("Não foi possível salvar. Tente de novo."),
  });

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground">Bem-vindo de volta{data.name ? `, ${data.name}` : ""}</p>
        <h1 className="font-display text-3xl font-semibold">Sua central de projetos</h1>
      </div>
      <PlanBanner />

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-6">
          <p className="text-sm text-muted-foreground">Nível</p>
          <p className="mt-1 font-display text-4xl font-semibold">{level}</p>
          <Progress value={(into / need) * 100} className="mt-4" />
          <p className="mt-2 text-xs text-muted-foreground">{into}/{need} XP para o próximo nível · {data.xp} XP total</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-6">
          <p className="flex items-center gap-2 text-sm text-muted-foreground"><Flame className="size-4 text-primary-bright" /> Missões diárias feitas</p>
          <p className="mt-1 font-display text-4xl font-semibold">{data.history.length}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-6">
          <p className="flex items-center gap-2 text-sm text-muted-foreground"><Target className="size-4 text-primary-bright" /> Missão em andamento</p>
          <p className="mt-2 font-medium">{active?.title ?? "Todas concluídas 🎉"}</p>
          <Button asChild variant="outline" size="sm" className="mt-4"><Link to="/missoes">Ver missões</Link></Button>
        </div>
      </div>

      {data.today && (
        <div className="rounded-2xl border border-primary/40 bg-gradient-to-br from-primary/15 to-card p-6">
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary-bright"><Sparkles className="size-4" /> Missão de hoje · +{data.today.xp} XP</p>
          <p className="mt-3 font-display text-xl font-semibold">{data.today.title}</p>
          {doneToday ? (
            <p className="mt-4 flex items-center gap-2 font-medium text-success"><CheckCircle2 className="size-5" /> Missão concluída!</p>
          ) : (
            <Button className="mt-4" onClick={() => complete.mutate()} disabled={complete.isPending}>Concluir missão</Button>
          )}
        </div>
      )}

      <div className="rounded-2xl border border-border bg-card p-6">
        <h2 className="font-display text-lg font-semibold">Histórico de missões diárias</h2>
        {data.history.length === 0 ? (
          <p className="mt-2 text-sm text-muted-foreground">Conclua sua primeira missão de hoje para começar o histórico.</p>
        ) : (
          <ul className="mt-3 divide-y divide-border">
            {data.history.slice(0, 10).map((h) => (
              <li key={h.day} className="flex justify-between gap-4 py-2 text-sm">
                <span>{data.dailyList.find((d) => d.id === h.daily_mission_id)?.title}</span>
                <span className="shrink-0 text-muted-foreground">{new Date(h.day + "T12:00").toLocaleDateString("pt-BR")}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
