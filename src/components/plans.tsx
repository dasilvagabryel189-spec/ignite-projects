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

export function ProGate({ children, feature }: { children: React.ReactNode; feature: string }) {
  const { data: s } = useSuspenseQuery(subscriptionQuery());
  if (s.hasPro) return <>{children}</>;
  return (
    <div className="glass-card mx-auto max-w-xl rounded-2xl p-8 text-center">
      <Lock className="mx-auto size-8 text-primary-bright" />
      <h2 className="mt-3 font-display text-2xl font-semibold">{feature} é PRO+</h2>
      <p className="mt-2 text-muted-foreground">Adicione o PRO+ ao seu plano Base por + {PLANS.pro.price}/mês.</p>
      <Button asChild variant="premium" className="mt-6"><Link to="/planos">Ver PRO+</Link></Button>
    </div>
  );
}
