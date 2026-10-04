import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { fmtDate, subscriptionQuery } from "@/lib/plans";

export const Route = createFileRoute("/_authenticated/conta")({
  head: () => ({ meta: [{ title: "Minha conta — Primeiro Projeto Online" }, { name: "description", content: "Status da sua assinatura." }, { property: "og:title", content: "Minha conta" }, { property: "og:description", content: "Status da sua assinatura." }] }),
  loader: ({ context }) => context.queryClient.ensureQueryData(subscriptionQuery()),
  component: Conta,
});

function Row({ label, active, renewal }: { label: string; active: boolean; renewal: string | null }) {
  return (
    <div className="flex items-center justify-between border-b border-border py-4 last:border-0">
      <div>
        <p className="font-medium">{label}</p>
        {active && fmtDate(renewal) && <p className="text-xs text-muted-foreground">Próxima renovação: {fmtDate(renewal)}</p>}
      </div>
      <span className={`status-pill rounded-full px-3 py-1 text-xs font-semibold ${active ? "bg-success/15 text-success" : "bg-muted text-muted-foreground"}`}>
        {active ? "Ativo" : "Inativo"}
      </span>
    </div>
  );
}

function Conta() {
  const { user } = Route.useRouteContext();
  const { data: s } = useSuspenseQuery(subscriptionQuery());
  return (
    <div className="mx-auto max-w-xl">
      <h1 className="font-display text-3xl font-semibold">Minha conta</h1>
      <p className="mt-1 text-sm text-muted-foreground">{user.email}</p>
      <div className="glass-card mt-6 rounded-2xl px-6">
        <Row label="Plano Base" active={s.hasBase} renewal={s.base_next_renewal} />
        <Row label="PRO+" active={s.hasPro} renewal={s.pro_next_renewal} />
      </div>
      <Link to="/planos" className="mt-4 inline-block text-sm text-primary-bright underline">Ver planos</Link>
    </div>
  );
}
