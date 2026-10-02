import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Entrar — Primeiro Projeto Online" },
      { name: "description", content: "Acesse sua central de projetos, missões e progresso." },
      { property: "og:title", content: "Entrar — Primeiro Projeto Online" },
      { property: "og:description", content: "Acesse sua central de projetos, missões e progresso." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => { if (data.session) navigate({ to: "/painel" }); });
    const { data } = supabase.auth.onAuthStateChange((e, s) => { if (e === "SIGNED_IN" && s) navigate({ to: "/painel" }); });
    return () => data.subscription.unsubscribe();
  }, [navigate]);

  const submit = async (ev: React.FormEvent) => {
    ev.preventDefault(); setBusy(true); setMsg(null);
    if (mode === "in") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setMsg("E-mail ou senha incorretos.");
    } else {
      const { error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: window.location.origin + "/auth" } });
      setMsg(error ? error.message : "Conta criada! Confira seu e-mail para confirmar o acesso.");
    }
    setBusy(false);
  };

  const google = async () => {
    const r = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin + "/auth" });
    if (r.error) setMsg("Não foi possível entrar com Google.");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 text-foreground">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-8">
        <Link to="/" className="font-display text-sm text-muted-foreground">← Primeiro Projeto Online</Link>
        <h1 className="mt-4 font-display text-2xl font-semibold">{mode === "in" ? "Entre na sua central" : "Crie sua conta"}</h1>
        <p className="mt-1 text-sm text-muted-foreground">Missões, progresso e projetos em um só lugar.</p>
        <Button variant="outline" className="mt-6 w-full" onClick={google}>Continuar com Google</Button>
        <div className="my-5 text-center text-xs text-muted-foreground">ou com e-mail</div>
        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-1.5"><Label htmlFor="email">E-mail</Label><Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></div>
          <div className="space-y-1.5"><Label htmlFor="pw">Senha</Label><Input id="pw" type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} /></div>
          <Button type="submit" className="w-full" disabled={busy}>{mode === "in" ? "Entrar" : "Criar conta"}</Button>
        </form>
        {msg && <p className="mt-4 text-sm text-muted-foreground">{msg}</p>}
        <button className="mt-6 text-sm text-primary-bright" onClick={() => { setMode(mode === "in" ? "up" : "in"); setMsg(null); }}>
          {mode === "in" ? "Ainda não tem conta? Criar agora" : "Já tem conta? Entrar"}
        </button>
      </div>
    </div>
  );
}
