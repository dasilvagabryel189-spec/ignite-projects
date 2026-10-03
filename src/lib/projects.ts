import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type Project = {
  id: string; name: string; description: string; category: string;
  status: "ideia" | "planejamento" | "construcao" | "lancamento" | "ativo";
  notes: string; created_at: string;
};
export type ProjectTask = { id: string; project_id: string; title: string; position: number; done: boolean };

export const STATUS_FLOW: Project["status"][] = ["ideia", "planejamento", "construcao", "lancamento", "ativo"];
export const STATUS_LABEL: Record<Project["status"], string> = {
  ideia: "Ideia", planejamento: "Planejamento", construcao: "Construção", lancamento: "Lançamento", ativo: "Projeto ativo",
};

export const DEFAULT_CHECKLIST = [
  "Definir problema", "Definir público", "Pesquisar concorrentes", "Criar solução",
  "Criar primeira versão", "Criar página", "Divulgar",
];

export const projectsQuery = queryOptions({
  queryKey: ["projects"],
  queryFn: async () => {
    const [p, t] = await Promise.all([
      supabase.from("projects").select("*").order("created_at", { ascending: false }),
      supabase.from("project_tasks").select("id, project_id, title, position, done").order("position"),
    ]);
    if (p.error) throw p.error;
    if (t.error) throw t.error;
    const tasks = t.data ?? [];
    const projects = (p.data ?? []) as Project[];
    return projects.map((pr) => ({ ...pr, tasks: tasks.filter((tk) => tk.project_id === pr.id) }));
  },
});

export const ideasQuery = queryOptions({
  queryKey: ["ideas"],
  queryFn: async () => {
    const { data, error } = await supabase.from("project_ideas").select("*").order("created_at", { ascending: false });
    if (error) throw error;
    return data ?? [];
  },
});

export async function awardXp(amount: number, reason: string) {
  await supabase.from("xp_events").insert({ amount, reason });
}
