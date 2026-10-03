import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { CheckCircle2, ChevronRight, FolderKanban, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { awardXp, DEFAULT_CHECKLIST, projectsQuery, STATUS_FLOW, STATUS_LABEL, type Project } from "@/lib/projects";

export const Route = createFileRoute("/_authenticated/projetos")({
  head: () => ({ meta: [{ title: "Projetos — Primeiro Projeto Online" }, { name: "description", content: "Seus projetos, etapas e checklists." }] }),
  loader: ({ context }) => context.queryClient.ensureQueryData(projectsQuery),
  component: Projetos,
  errorComponent: ({ error }) => <p role="alert">{(error as Error).message}</p>,
  notFoundComponent: () => <p>Não encontrado.</p>,
});

function Projetos() {
  const { data: projects } = useSuspenseQuery(projectsQuery);
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");

  const refresh = () => {
    qc.invalidateQueries({ queryKey: ["projects"] });
    qc.invalidateQueries({ queryKey: ["progress"] });
  };

  const create = useMutation({
    mutationFn: async () => {
      const { data: user } = await supabase.auth.getUser();
      const uid = user.user?.id;
      if (!uid) throw new Error("Sessão expirada");
      const { data: proj, error } = await supabase
        .from("projects")
        .insert({ name: name.trim(), description: description.trim(), category: category.trim() || "Geral" })
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
      setOpen(false); setName(""); setDescription(""); setCategory("");
      refresh();
    },
    onError: () => toast.error("Não foi possível criar o projeto."),
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold">Seus projetos</h1>
          <p className="mt-1 text-sm text-muted-foreground">Da ideia ao projeto ativo, uma etapa de cada vez.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button><Plus className="size-4" /> Novo projeto</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Criar projeto</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <Input placeholder="Nome do projeto" value={name} onChange={(e) => setName(e.target.value)} />
              <Input placeholder="Categoria (ex.: Conteúdo, Produto digital)" value={category} onChange={(e) => setCategory(e.target.value)} />
              <Textarea placeholder="Descreva a ideia em uma ou duas frases" value={description} onChange={(e) => setDescription(e.target.value)} />
              <Button className="w-full" disabled={!name.trim() || create.isPending} onClick={() => create.mutate()}>
                Criar projeto · +30 XP
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {projects.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center">
          <FolderKanban className="mx-auto size-10 text-muted-foreground" />
          <p className="mt-4 font-medium">Nenhum projeto ainda</p>
          <p className="mt-1 text-sm text-muted-foreground">Crie seu primeiro projeto ou use o Gerador de Projetos para receber ideias.</p>
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {projects.map((p) => <ProjectCard key={p.id} project={p} onChange={refresh} />)}
        </div>
      )}
    </div>
  );
}

function ProjectCard({ project, onChange }: { project: Project & { tasks: { id: string; title: string; done: boolean }[] }; onChange: () => void }) {
  const [notes, setNotes] = useState(project.notes);
  const done = project.tasks.filter((t) => t.done).length;
  const total = project.tasks.length;
  const pct = total ? Math.round((done / total) * 100) : 0;
  const statusIdx = STATUS_FLOW.indexOf(project.status);
  const next = STATUS_FLOW[statusIdx + 1];

  const toggleTask = useMutation({
    mutationFn: async (task: { id: string; done: boolean }) => {
      const { error } = await supabase.from("project_tasks").update({ done: !task.done, done_at: !task.done ? new Date().toISOString() : null }).eq("id", task.id);
      if (error) throw error;
      if (!task.done) await awardXp(10, "Concluiu uma tarefa");
    },
    onSuccess: (_d, task) => { if (!task.done) toast.success("+10 XP"); onChange(); },
    onError: () => toast.error("Não foi possível salvar."),
  });

  const advance = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("projects").update({ status: next }).eq("id", project.id);
      if (error) throw error;
    },
    onSuccess: () => { toast.success(`Etapa atualizada: ${STATUS_LABEL[next!]}`); onChange(); },
    onError: () => toast.error("Não foi possível atualizar."),
  });

  const saveNotes = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("projects").update({ notes }).eq("id", project.id);
      if (error) throw error;
    },
    onSuccess: () => toast.success("Notas salvas"),
    onError: () => toast.error("Não foi possível salvar as notas."),
  });

  const remove = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("projects").delete().eq("id", project.id);
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Projeto removido"); onChange(); },
    onError: () => toast.error("Não foi possível remover."),
  });

  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <span className="rounded-full bg-primary/15 px-2.5 py-0.5 text-xs font-semibold text-primary-bright">{STATUS_LABEL[project.status]}</span>
          <h2 className="mt-2 font-display text-xl font-semibold">{project.name}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{project.category} · criado em {new Date(project.created_at).toLocaleDateString("pt-BR")}</p>
        </div>
        <button onClick={() => remove.mutate()} aria-label="Remover projeto" className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-surface hover:text-foreground">
          <Trash2 className="size-4" />
        </button>
      </div>
      {project.description && <p className="mt-3 text-sm">{project.description}</p>}

      <div className="mt-4">
        <div className="flex justify-between text-xs text-muted-foreground"><span>Progresso</span><span>{done}/{total} tarefas · {pct}%</span></div>
        <Progress value={pct} className="mt-2" />
      </div>

      <ul className="mt-4 space-y-1.5">
        {project.tasks.map((t) => (
          <li key={t.id}>
            <button onClick={() => toggleTask.mutate(t)} className="flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-left text-sm transition-colors hover:bg-surface">
              <CheckCircle2 className={t.done ? "size-4 shrink-0 text-success" : "size-4 shrink-0 text-muted-foreground/40"} />
              <span className={t.done ? "text-muted-foreground line-through" : ""}>{t.title}</span>
            </button>
          </li>
        ))}
      </ul>

      <Textarea
        placeholder="Notas do projeto..."
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        onBlur={() => { if (notes !== project.notes) saveNotes.mutate(); }}
        className="mt-4 min-h-20 text-sm"
      />

      <div className="mt-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          {STATUS_FLOW.map((s, i) => (
            <span key={s} className={`flex items-center gap-1 ${i <= statusIdx ? "text-primary-bright" : ""}`}>
              {i > 0 && <ChevronRight className="size-3" />}{STATUS_LABEL[s]}
            </span>
          ))}
        </div>
        {next && <Button size="sm" variant="outline" onClick={() => advance.mutate()} disabled={advance.isPending}>Avançar</Button>}
      </div>
    </div>
  );
}
