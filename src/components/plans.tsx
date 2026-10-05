import { useSuspenseQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { Check, Lock, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { CHECKOUT_URLS, PLANS, subscriptionQuery } from "@/lib/plans";

function goCheckout(plan: "base" | "pro"): void {
  const url = CHECKOUT_URLS[plan];
  if (!url) {
    toast("Checkout ainda não configurado.");
    return undefined;
  }
  window.open(url, "_blank", "noopener");
}

export function PlanCards() {
  const { data: s } = useSuspenseQuery(subscriptionQuery());
  return (
    <div className="grid gap-5 md:grid-cols-2">
      <div className="glass-card rounded-2xl p-6">
        <p className="eyebrow">Plano principal</p>
        <h3 className="mt-2 font-display text-2xl font-semibold">{PLANS.base.name}</h3>
        <p className="mt-3 text-4xl font-bold">{PLANS.base.price}<span className="text-base font-medium text-muted-foreground">{PLANS.base.period}</span></p>
        <ul className="mt-5 space-y-2 text-sm text-muted-foreground">
          {["Acesso ao aplicativo", "Missões, Radar e Projetos", "Missão diária e XP"].map((t) => (
            <li key={t} className="flex gap-2"><Check className="size-4 text-success" />{t}</li>
          ))}
        </ul>
        <div className="mt-6">
          {s.hasBase ? <Button disabled className="w-full">Base ativo</Button>
            : <Button variant="premium" className="w-full" onClick={() => goCheckout("base")}>Assinar Base</Button>}
        </div>
      </div>
      <div className="glass-card rounded-2xl border-primary/40 p-6">
        <p className="eyebrow flex items-center gap-1"><Sparkles className="size-3" />Complemento do Base</p>
        <h3 className="mt-2 font-display text-2xl font-semibold">{PLANS.pro.name}</h3>
        <p className="mt-3 text-4xl font-bold">+ {PLANS.pro.price}<span className="text-base font-medium text-muted-foreground">{PLANS.pro.period}</span></p>
        <p className="mt-1 text-xs text-muted-foreground">Total com Base: {PLANS.pro.total}/mês. Requer o plano Base ativo.</p>
        <ul className="mt-5 space-y-2 text-sm text-muted-foreground">
          {["Gerador de Projetos", "Missões avançadas", "Recursos PRO+ futuros"].map((t) => (
            <li key={t} className="flex gap-2"><Check className="size-4 text-success" />{t}</li>
          ))}
        </ul>
        <div className="mt-6">
          {s.hasPro ? <Button disabled className="w-full">PRO+ ativo</Button>
            : s.hasBase ? <Button variant="premium" className="w-full" onClick={() => goCheckout("pro")}>Ativar PRO+</Button>
            : <Button disabled variant="outline" className="w-full"><Lock className="size-4" />Ative o Base primeiro</Button>}
        </div>
      </div>
    </div>
  );
}

export function BaseRequired() {
  return (
    <div className="mx-auto max-w-3xl py-6">
      <h1 className="font-display text-3xl font-semibold">Ative sua assinatura Base</h1>
      <p className="mt-2 text-muted-foreground">Para acessar o aplicativo é necessário ter o plano Base ativo.</p>
      <div className="mt-8"><PlanCards /></div>
      <p className="mt-6 text-sm text-muted-foreground">Já assinou? Use o mesmo e-mail da compra e <Link to="/conta" className="text-primary-bright underline">confira sua conta</Link>.</p>
    </div>
  );
}

export function ProCta({ label = "Conhecer PRO+", className }: { label?: string; className?: string }) {
  if (CHECKOUT_URLS.pro) return <Button variant="premium" className={className} onClick={() => goCheckout("pro")}>{label}</Button>;
  return <Button asChild variant="premium" className={className}><Link to="/planos">{label}</Link></Button>;
}

export function ProBadge() {
  return <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-primary-bright">PRO+</span>;
}

export function ProLockCard({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="flex flex-col rounded-2xl border border-dashed border-primary/40 bg-card/60 p-6">
      <div className="flex items-center justify-between text-xs"><span className="text-muted-foreground">{subtitle}</span><ProBadge /></div>
      <h3 className="mt-3 font-display text-lg font-semibold">{title}</h3>
      <p className="mt-2 flex flex-1 items-start gap-2 text-sm text-muted-foreground"><Lock className="mt-0.5 size-4 shrink-0" />Este recurso faz parte do PRO+.</p>
      <ProCta className="mt-4 self-start" />
    </div>
  );
}

export function PlanBanner() {
  const { data: s } = useSuspenseQuery(subscriptionQuery());
  if (s.hasPro) return <div className="glass-card flex items-center gap-2 rounded-xl px-4 py-3 text-sm"><Sparkles className="size-4 text-primary-bright" />PRO+ ativo</div>;
  return (
    <div className="glass-card flex flex-wrap items-center justify-between gap-3 rounded-xl px-4 py-3 text-sm">
      <p><strong>Você está no plano Base.</strong> <span className="text-muted-foreground">Desbloqueie o PRO+ para acessar todas as ferramentas, ideias e recursos.</span></p>
      <ProCta label="Desbloquear PRO+" />
    </div>
  );
}

export function ProGate({ children, feature }: { children: React.ReactNode; feature: string }) {
  const { data: s } = useSuspenseQuery(subscriptionQuery());
  if (s.hasPro) return <>{children}</>;
  return (
    <div className="glass-card mx-auto max-w-xl rounded-2xl p-8 text-center">
      <Lock className="mx-auto size-8 text-primary-bright" />
      <p className="eyebrow mt-3">Ferramenta PRO+</p>
      <h2 className="mt-2 font-display text-2xl font-semibold">{feature}</h2>
      <p className="mt-2 text-muted-foreground">Desbloqueie o PRO+ para acessar esta ferramenta.</p>
      <ProCta label="Desbloquear PRO+" className="mt-6" />
    </div>
  );
}
