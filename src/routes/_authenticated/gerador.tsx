import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { BookmarkCheck, Lightbulb, Rocket, Wand2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { awardXp, DEFAULT_CHECKLIST, ideasQuery } from "@/lib/projects";
import { ProGate } from "@/components/plans";
import { subscriptionQuery } from "@/lib/plans";

export const Route = createFileRoute("/_authenticated/gerador")({
  head: () => ({ meta: [{ title: "Gerador de Projetos — Primeiro Projeto Online" }, { name: "description", content: "Responda 4 perguntas e receba ideias de projeto." }] }),
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(subscriptionQuery());
    return context.queryClient.ensureQueryData(ideasQuery);
  },
  component: () => <ProGate feature="Gerador de Projetos"><Gerador /></ProGate>,
  errorComponent: ({ error }) => <p role="alert">{(error as Error).message}</p>,
  notFoundComponent: () => <p>Não encontrado.</p>,
});

type Suggestion = {
  name: string; description: string; audience: string; problem: string;
  solution: string; difficulty: string; monetization: string; first_steps: string;
};

const FORMATS = [
  { key: "guia", label: "Guia digital", monetization: "Venda única do guia", difficulty: "Fácil" },
  { key: "conteudo", label: "Perfil de conteúdo", monetization: "Parcerias e produtos próprios no futuro", difficulty: "Fácil" },
  { key: "servico", label: "Serviço online", monetization: "Pacotes mensais ou por projeto", difficulty: "Média" },
  { key: "template", label: "Templates prontos", monetization: "Venda de pacotes de templates", difficulty: "Fácil" },
  { key: "comunidade", label: "Comunidade temática", monetization: "Assinatura mensal quando houver valor", difficulty: "Média" },
  { key: "ferramenta", label: "Ferramenta simples", monetization: "Plano gratuito + versão paga", difficulty: "Avançada" },
];

function buildSuggestions(likes: string, skills: string, time: string, area: string): Suggestion[] {
  const tema = area.trim() || likes.trim() || "um tema que você domina";
  const habilidade = skills.trim() || "o que você já sabe fazer";
  const tempo = time.trim() || "algumas horas por semana";
  const pool = FORMATS.filter((f) => (tempo.match(/^[0-4]\b|pouco/i) ? f.difficulty !== "Avançada" : true));
  return pool.slice(0, 3).map((f) => ({
    name: `${f.label} sobre ${tema}`,
    description: `Um projeto de ${f.label.toLowerCase()} que une seu interesse em ${likes.trim() || tema} com ${habilidade}.`,
    audience: `Pessoas que se interessam por ${tema} e ainda estão começando.`,
    problem: `Iniciantes em ${tema} não encontram conteúdo simples e direto feito por quem entende de ${habilidade}.`,
    solution: `Usar ${habilidade} e ferramentas de IA para criar ${f.label.toLowerCase()} claro e útil sobre ${tema}.`,
    difficulty: f.difficulty,
    monetization: f.monetization,
    first_steps: `1) Escolha um recorte específico de ${tema}. 2) Use IA para gerar um rascunho. 3) Monte a primeira versão com ${tempo} disponíveis. 4) Mostre para 3 pessoas e ajuste.`,
  }));
}

function Gerador() {
  const { data: ideas } = useSuspenseQuery(ideasQuery);
  const qc = useQueryClient();
  const navigate = useNavigate();
  const [likes, setLikes] = useState("");
  const [skills, setSkills] = useState("");
  const [time, setTime] = useState("");
  const [area, setArea] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[] | null>(null);

  const refresh = () => {
    qc.invalidateQueries({ queryKey: ["ideas"] });
    qc.invalidateQueries({ queryKey: ["progress"] });
    qc.invalidateQueries({ queryKey: ["projects"] });
  };

  const save = useMutation({
    mutationFn: async (s: Suggestion) => {
      const { error } = await supabase.from("project_ideas").insert(s);
      if (error) throw error;
      await awardXp(5, "Salvou uma ideia");
    },
    onSuccess: () => { toast.success("Ideia salva! +5 XP"); refresh(); },
    onError: () => toast.error("Não foi possível salvar a ideia."),
  });

  const createProject = useMutation({
    mutationFn: async (s: Suggestion) => {
      const { data: user } = await supabase.auth.getUser();
      const uid = user.user?.id;
      if (!uid) throw new Error("Sessão expirada");
      const { data: proj, error } = await supabase
        .from("projects")
        .insert({ name: s.name, description: s.description, category: area.trim() || "Geral" })
        .select("id")
        .single();
      if (error) throw error;
      const { error: tErr } = await supabase.from("project_tasks").insert(
        DEFAULT_CHECKLIST.map((title, i) => ({ project_id: proj.id, user_id: uid, title, position: i })),
      );
      if (tErr) throw tErr;
      await awardXp(30, "Criou um projeto");
    },
    onSuccess: () => {
      toast.success("Projeto criado! +30 XP");
      refresh();
      navigate({ to: "/projetos" });
    },
    onError: () => toast.error("Não foi possível criar o projeto."),
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-semibold">Gerador de Projetos</h1>
        <p className="mt-1 text-sm text-muted-foreground">Responda 4 perguntas e receba ideias de projeto feitas para você.</p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-1.5 text-sm font-medium">O que você gosta?
            <Input placeholder="Ex.: jogos, culinária, música" value={likes} onChange={(e) => setLikes(e.target.value)} />
          </label>
          <label className="space-y-1.5 text-sm font-medium">O que você sabe fazer?
            <Input placeholder="Ex.: escrever, editar vídeo, planilhas" value={skills} onChange={(e) => setSkills(e.target.value)} />
          </label>
          <label className="space-y-1.5 text-sm font-medium">Quanto tempo você tem?
            <Input placeholder="Ex.: 1 hora por dia" value={time} onChange={(e) => setTime(e.target.value)} />
          </label>
          <label className="space-y-1.5 text-sm font-medium">Qual área deseja explorar?
            <Input placeholder="Ex.: educação, games, finanças" value={area} onChange={(e) => setArea(e.target.value)} />
          </label>
        </div>
        <Button className="mt-5" onClick={() => setSuggestions(buildSuggestions(likes, skills, time, area))} disabled={!likes.trim() && !area.trim()}>
          <Wand2 className="size-4" /> Gerar ideias
        </Button>
      </div>

      {suggestions && (
        <div className="grid gap-4 lg:grid-cols-3">
          {suggestions.map((s) => (
            <div key={s.name} className="flex flex-col rounded-2xl border border-border bg-card p-6">
              <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary-bright"><Lightbulb className="size-4" /> {s.difficulty}</p>
              <h2 className="mt-2 font-display text-lg font-semibold">{s.name}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{s.description}</p>
              <dl className="mt-4 space-y-2 text-sm">
                <div><dt className="font-medium">Público-alvo</dt><dd className="text-muted-foreground">{s.audience}</dd></div>
                <div><dt className="font-medium">Problema</dt><dd className="text-muted-foreground">{s.problem}</dd></div>
                <div><dt className="font-medium">Solução</dt><dd className="text-muted-foreground">{s.solution}</dd></div>
                <div><dt className="font-medium">Monetização</dt><dd className="text-muted-foreground">{s.monetization}</dd></div>
                <div><dt className="font-medium">Primeiros passos</dt><dd className="text-muted-foreground">{s.first_steps}</dd></div>
              </dl>
              <div className="mt-auto flex gap-2 pt-5">
                <Button variant="outline" size="sm" onClick={() => save.mutate(s)} disabled={save.isPending}><BookmarkCheck className="size-4" /> Salvar ideia</Button>
                <Button size="sm" onClick={() => createProject.mutate(s)} disabled={createProject.isPending}><Rocket className="size-4" /> Criar projeto</Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div>
        <h2 className="font-display text-xl font-semibold">Ideias salvas</h2>
        {ideas.length === 0 ? (
          <p className="mt-2 text-sm text-muted-foreground">Gere ideias acima e salve as favoritas aqui.</p>
        ) : (
          <ul className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {ideas.map((i) => (
              <li key={i.id} className="rounded-xl border border-border bg-card p-4">
                <p className="font-medium">{i.name}</p>
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{i.description}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
