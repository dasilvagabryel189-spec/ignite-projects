import { createFileRoute, Link, Outlet, redirect, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { FolderKanban, LayoutDashboard, LogOut, Radar, Target, Wand2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) throw redirect({ to: "/auth" });
    return { user: data.user };
  },
  component: AppShell,
});

function AppShell() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const signOut = async () => {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  };
  const link = "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-surface hover:text-foreground";
  const active = { className: "bg-surface text-foreground" };
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
          <Link to="/painel" className="font-display text-base font-semibold">Primeiro Projeto <span className="text-primary-bright">Online</span></Link>
          <nav className="flex items-center gap-1">
            <Link to="/painel" className={link} activeProps={active}><LayoutDashboard className="size-4" /><span className="hidden sm:inline">Painel</span></Link>
            <Link to="/missoes" className={link} activeProps={active}><Target className="size-4" /><span className="hidden sm:inline">Missões</span></Link>
            <Link to="/radar" className={link} activeProps={active}><Radar className="size-4" /><span className="hidden sm:inline">Radar</span></Link>
            <Link to="/projetos" className={link} activeProps={active}><FolderKanban className="size-4" /><span className="hidden sm:inline">Projetos</span></Link>
            <Link to="/gerador" className={link} activeProps={active}><Wand2 className="size-4" /><span className="hidden sm:inline">Gerador</span></Link>
            <button onClick={signOut} className={link} aria-label="Sair"><LogOut className="size-4" /></button>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8"><Outlet /></main>
    </div>
  );
}
